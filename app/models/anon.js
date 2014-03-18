var mongoose = require('mongoose');


var AnonSchema = new mongoose.Schema({
    score: Number,
    date: Date,
    time: [Number],
    won: Boolean
});

// create the model for users and expose it to app // Users var
module.exports = mongoose.model('Anon', AnonSchema);