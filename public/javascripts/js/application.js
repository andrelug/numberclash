// Wait till the browser is ready to render the game (avoids glitches)
window.requestAnimationFrame(function () {
  new GameManager(4, KeyboardInputManager, HTMLActuator, LocalScoreManager);
});

/* Tracking Events */

    /* Shares */
    $('#facebookShare').on('click', function () {
        ga('send', 'event', 'shareFlappy', 'click', 'facebookFlappy', 1, {'nonInteraction': 1});
    });

    $('#twitterShare').on('click', function () {
        ga('send', 'event', 'shareFlappy', 'click', 'twitterFlappy', 1, {'nonInteraction': 1});
    });

    $('#googleShare').on('click', function () {
        ga('send', 'event', 'shareFlappy', 'click', 'googleFlappy', 1, {'nonInteraction': 1});
    });

    /* Page Exit */
    window.onbeforeunload = sendView;
    function sendView(){
        ga('send', 'pageview', '/exit');
    }

    $('.loginBar').hover(function(){$('.loginFace').animate({'top': 54});});$('.loginBar').on('mouseleave', function(){$('.loginFace').animate({'top':0})});


$('.loginFace a').on('click', function () {
    ga('send', 'event', 'registerFlappy', 'click', 'topBarFaceFlappy', 1, {'nonInteraction': 1});
});

$('#donation').on('click', function () {
    ga('send', 'event', 'donateFlappy', 'click', 'donationFlappy', 1, { 'nonInteraction': 1 });
});

$('.facebookShare').on('click', function () {
    ga('send', 'event', 'share', 'click', 'scoreFacebook', 1, { 'nonInteraction': 1 });
});
$('.twitterShare').on('click', function () {
    ga('send', 'event', 'share', 'click', 'scoreTwitter', 1, { 'nonInteraction': 1 });
});

$('.back').on('click', function(){
    ga('send', 'event', 'flappy', 'click', 'toMainFromFlappy', 1, { 'nonInteraction': 1 });
});