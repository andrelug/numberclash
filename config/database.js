// config/database.js ...problems with azure variables
var express = require('express'),
    app = express();

if('development' == app.get('env')) {
    module.exports = {
        'url': 'mongodb://NumberClashMongo:kqqSHDyxCDyzOWVYaO50SksNu4Q8EoUd2Ykdhnc_7UE-@ds031088.mongolab.com:31088/NumberClashMongo',
        'url2': 'mongodb://ncsessions:i127C0MLpkYCvPwMAZ.SCBuQy_cINeKuxPtPOG1z35c-@ds035747.mongolab.com:35747/ncsessions'
    }
}else{
    module.exports = {
        'url': 'mongodb://NumberClashMongo:kqqSHDyxCDyzOWVYaO50SksNu4Q8EoUd2Ykdhnc_7UE-@ds031088.mongolab.com:31088/NumberClashMongo',
        'url2': 'mongodb://ncsessions:i127C0MLpkYCvPwMAZ.SCBuQy_cINeKuxPtPOG1z35c-@ds035747.mongolab.com:35747/ncsessions'
    }
}
