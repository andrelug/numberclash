var Users = require('./models/user');
var Anon = require('./models/anon');
var func = require('../config/functions');
var facebook = require('../config/facebook.js');
var ip = require('ip');

// Session check function
var sessionReload = function(req, res, next){
    if('HEAD' == req.method || 'OPTIONS' == req.method){
        return next();
    }else{
        req.session._garbage = Date();
        req.session.touch();
    }
}

module.exports = function (app, passport, mongoose) {

    // =====================================
    // HOME PAGE (with login links) ========
    // =====================================
    app.get('/', function (req, res, next) {

        var user = req.user;
        var totalGames;

        Anon.count({}, function (err, anonCount) {
            Users.aggregate([{ $unwind: '$scores.history' }, { $group: { _id: null, number: { $sum: 1}}}], function (err, userCount) {

                totalGames = anonCount + userCount[0].number;

            });
        });

        Anon.find({}, { score: 1, _id: 0 }).sort({ 'score': -1 }).limit(10).exec(function (err, docs) {
            Users.find({}, { 'scores.best': 1, 'name.first': 1, 'photo': 1, _id: 0 }).sort({ 'scores.best': -1 }).limit(10).exec(function (err, udocs) {
                if (!user) {
                    res.render("index", { message: req.flash('signupMessage'), user: '', lead: docs, ulead: udocs, totalGames: totalGames});
                } else {
                    if (user.deleted === false) {
                        var userId = [];
                        for (i = 0; i < user.social.facebook.friends.length; i++) {
                            userId.push(user.social.facebook.friends[i].id);
                        }

                        Users.find({ 'social.facebook.id': { $in: userId} }, { 'scores.best': 1, 'name.first': 1, 'photo': 1, _id: 0 }).sort({ 'scores.best': -1 }).limit(10).exec(function (err, friends) {
                            req.session.name = req.user.name.loginName;
                            sessionReload(req, res, next);
                            res.render('index', { user: user, lead: docs, ulead: udocs, friends: friends, totalGames: totalGames });
                        });
                    } else {
                        res.redirect('/users/restore');
                    }
                }
            });
        });
    });

    app.post('/score', function (req, res) {
        var best = req.body.best;
        var score = req.body.score;
        var date = new Date();
        var time = req.body.time;
        var won = req.body.win;
        var sessionId = req.sessionID;

        if (!req.user) {
            var ipN = req.ip;
            //var ipN = ip.address();
            var longi = ip.toLong(ipN);

            new Anon({
                score: score,
                date: date,
                time: time,
                won: won,
                ip: longi,
                sessionId: sessionId

            }).save(function (err, docs) {
                if (err) res.json(err);
                res.end();
            });
        } else {
            var user = req.user;

            if (best === score) {

                if (user.scores.best < best) {
                    Users.update({ 'name.loginName': user.name.loginName },
                    { $set: { 'scores.best': best },
                        $push: { 'scores.history': { score: score, date: date, time: time, won: won} }
                    },
                    function (err) {
                        if (err) throw err;
                        res.end();
                    });
                } else {
                    Users.update({ 'name.loginName': user.name.loginName },
                    { $push: { 'scores.history': { score: score, date: date, time: time, won: won} }
                    },
                    function (err) {
                        if (err) throw err;
                        res.end();
                    });
                }

            } else {

                Users.update({ 'name.loginName': user.name.loginName },
                { $push: { 'scores.history': { score: score, date: date, time: time, won: won} }
                },
                function (err) {
                    if (err) throw err;
                    res.end();
                });

            }

        }

    });

    // =====================================
    // USER SIGNUP =========================
    // ===================================== I should later find a way to pass params to the jade file here and put values on the inputs
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/', // redirect to the secure profile section
        failureRedirect: '/signup', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages     
    }));

    app.get('/signup', function (req, res) {
        var user = req.user;
        if (!user) {
            res.render("signup", { message: req.flash('signupMessage') });
        } else {
            res.redirect("/");
        }
    });

    // =====================================
    // LOG IN ==============================
    // =====================================
    app.get('/login', function (req, res) {
        var user = req.user;
        if (!user) {
            res.render("login", { message: req.flash('loginMessage') });
            if (req.url === '/favicon.ico') {
                r.writeHead(200, { 'Content-Type': 'image/x-icon' });
                return r.end();
            }
        } else {
            res.redirect("/");
        }
    });


    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/', // redirect to the secure profile section
        failureRedirect: '/login', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));

    // =====================================
    // FACEBOOK ROUTES =====================
    // =====================================
    // route for facebook authentication and login
    app.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email', 'user_friends']
    }));

    // handle the callback after facebook has authenticated the user
    app.get('/auth/facebook/callback',
	    passport.authenticate('facebook', {
	        successRedirect: '/facebook',
	        failureRedirect: '/'
	    })
    );

    // =====================================
    // TWITTER ROUTES ======================
    // =====================================
    // route for twitter authentication and login
    app.get('/auth/twitter', passport.authenticate('twitter'));

    // handle the callback after twitter has authenticated the user
    app.get('/auth/twitter/callback',
		passport.authenticate('twitter', {
		    successRedirect: '/',
		    failureRedirect: '/'
		})
    );

    // =====================================
    // GOOGLE ROUTES =======================
    // =====================================
    // send to google to do the authentication
    // profile gets us their basic information including their name
    // email gets their emails
    app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email', 'openid'] }));

    // the callback after google has authenticated the user
    app.get('/auth/google/callback',
        passport.authenticate('google', {
            successRedirect: '/',
            failureRedirect: '/'
        })
    );


    // =============================================================================
    // AUTHORIZE (ALREADY LOGGED IN / CONNECTING OTHER SOCIAL ACCOUNT) =============
    // =============================================================================

    // locally --------------------------------
    app.get('/profile/edit', isLoggedIn, function (req, res) {
        var user = req.user;
        res.render('profile/edit', { message: req.flash('loginMessage'), user: user });
    });
    app.post('/profile/edit', passport.authenticate('local-signup', {
        successRedirect: '/', // redirect to the secure profile section
        failureRedirect: '/profile/edit', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));

    // facebook -------------------------------

    // send to facebook to do the authentication
    app.get('/connect/facebook', passport.authorize('facebook', { scope: ['email', 'user_about_me',
    'user_birthday ', 'user_hometown', 'user_website']
    }));

    // handle the callback after facebook has authorized the user
    app.get('/connect/facebook/callback',
			passport.authorize('facebook', {
			    successRedirect: '/',
			    failureRedirect: '/'
			})
        );

    // twitter --------------------------------

    // send to twitter to do the authentication
    app.get('/connect/twitter', passport.authorize('twitter', { scope: 'email' }));

    // handle the callback after twitter has authorized the user
    app.get('/connect/twitter/callback',
			passport.authorize('twitter', {
			    successRedirect: '/',
			    failureRedirect: '/'
			})
        );


    // google ---------------------------------

    // send to google to do the authentication
    app.get('/connect/google', passport.authorize('google', { scope: ['profile', 'email', 'openid'] }));

    // the callback after google has authorized the user
    app.get('/connect/google/callback',
		passport.authorize('google', {
		    successRedirect: '/',
		    failureRedirect: '/'
		})
    );


    // =============================================================================
    // UNLINK ACCOUNTS =============================================================
    // =============================================================================
    // facebook -------------------------------
    app.get('/unlink/facebook', function (req, res) {
        var user = req.user;
        user.social.facebook.token = undefined;
        user.save(function (err) {
            res.redirect('/profile');
        });
    });

    // twitter --------------------------------
    app.get('/unlink/twitter', function (req, res) {
        var user = req.user;
        user.social.twitter.token = undefined;
        user.save(function (err) {
            res.redirect('/profile');
        });
    });

    // google ---------------------------------
    app.get('/unlink/google', function (req, res) {
        var user = req.user;
        user.social.google.token = undefined;
        user.save(function (err) {
            res.redirect('/profile');
        });
    });


    // =====================================
    // LOGOUT ==============================
    // =====================================
    app.get('/logout', function (req, res) {
        req.logout();
        res.redirect('/');
    });


    // =====================================
    // PROFILE =============================
    // =====================================
    app.get('/profile', function (req, res, next) {

        var user = req.user;
        if (!user) {
            res.redirect("signup");
        } else {
            sessionReload(req, res, next);
            res.render('profile/index', { message: req.flash('loginMessage'), user: user });
        }
    });

    app.get('/facebook', function (req, res) {
        var user = req.user;
        facebook.getFbData(user.social.facebook.token, '/me/friends', function (data) {
            var friend = eval("(" + data + ")")
            Users.update({ _id: user._id }, { $pushAll: { 'social.facebook.friends': friend.data} }, function (err) {
                res.redirect('/');
            });
        });
    });

    // =====================================
    // DELETE USER =========================
    // =====================================
    app.put('/users/delete', function (req, res) {
        Users.update(
            { 'name.loginName': req.user.name.loginName },
            { $set: {
                deleted: true
            }
            },
            function (err) {
                res.redirect('/logout')
            }
        );
    });

    // =====================================
    // RESTORE USER ========================
    // =====================================
    app.get('/users/restore', function (req, res) {
        user = req.user;
        res.render('profile/restore', { user: user });
    });

    app.put('/users/restore', function (req, res) {
        Users.update(
            { 'name.loginName': req.user.name.loginName },
            { $set: {
                deleted: false
            }
            },
            function (err) {
                res.redirect('/profile')
            }
        );
    });

    // =====================================
    // FLAPPY ==============================
    // =====================================
    app.get('/flappy', function (req, res, next) {

        var user = req.user;
        Anon.find({}, { score: 1, _id: 0 }).sort({ 'score': -1 }).limit(10).exec(function (err, docs) {
            Users.find({}, { 'scores.best': 1, 'name.first': 1, 'photo': 1, _id: 0 }).sort({ 'scores.best': -1 }).limit(10).exec(function (err, udocs) {
                if (!user) {
                    res.render("flappy", { message: req.flash('signupMessage'), user: '', lead: docs, ulead: udocs });
                } else {
                    if (user.deleted === false) {
                        var userId = [];
                        for (i = 0; i < user.social.facebook.friends.length; i++) {
                            userId.push(user.social.facebook.friends[i].id);
                        }

                        Users.find({ 'social.facebook.id': { $in: userId} }, { 'scores.best': 1, 'name.first': 1, 'photo': 1, _id: 0 }).sort({ 'scores.best': -1 }).limit(10).exec(function (err, friends) {
                            req.session.name = req.user.name.loginName;
                            sessionReload(req, res, next);
                            res.render('flappy', { user: user, lead: docs, ulead: udocs, friends: friends });
                        });
                    } else {
                        res.redirect('/users/restore');
                    }
                }
            });
        });

    });


    // =====================================
    // CONFIGURATIONS ======================
    // =====================================

    // On Off Switch
    app.put('/users/onoff', function (req, res) {
        user = req.user;
        state = req.body.state;

        Users.update(
            { 'name.loginName': user.name.loginName },
            { $set: {
                onOffSwitch: state
            }
            },
            function (err) {
                res.send('done');
            }
        )
    });

    function isLoggedIn(req, res, next) {

        // if user is authenticated in the session, carry on 
        if (req.isAuthenticated())
            return next();

        // if they aren't redirect them to the home page
        res.redirect('/');
    }
}