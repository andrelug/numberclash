// config/database.js
var express = require('express'),
    app = express();

if('development' == app.get('env')) {
    module.exports = {
        'url': 'mongodb://localhost/numberclash',
        'url2': 'mongodb://localhost/numberclashsessions'
    }
}else{
    module.exports = {
        'url': process.env.CUSTOMCONNSTR_MONGOLAB_URI,
        'url2': 'mongodb://ncsessions:i127C0MLpkYCvPwMAZ.SCBuQy_cINeKuxPtPOG1z35c-@ds035747.mongolab.com:35747/ncsessions'
    }
}