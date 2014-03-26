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
        'url': 'mongodb://test-k:gsdfAgLbB4AQMKcHWazo4RnvXMZ7fjTJMDnKv8dkJ8Y-@ds030817.mongolab.com:30817/test-k',
        'url2': 'mongodb://test2:P4a.orlbd7BpGTTU8Iq3J7eFR4BLhq9fRM2NlWvfoRI-@ds030607.mongolab.com:30607/test2'
    }
}