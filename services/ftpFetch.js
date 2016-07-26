var models = require('../models');
var Promise = require('bluebird');
var env       = process.env.NODE_ENV || 'development';
var config    = require(__dirname + '/../config/tsconfig.json')[env];
var FTP = require('ftpimp'),

    //Initializes the main FTP sequence ftp will emit a ready event once the server connection has been established
    ftp = FTP.create(config.ftp,false),
    connected = function () {
        console.log('connected to remote FTP server');
    };

var service = module.exports = {

    startFTP: function(params) {
        ftp.connect(function(){
            service.sweepFTP();
        });
    },
    sweepFTP: function() {
        ftp.ls(config.ftp.root, function (err, filelist) {
            console.log('sweeping FTP server every 20 Sec!');
            console.log(filelist);
        });
        setTimeout(service.sweepFTP,20000);
    },
    download: function () {

    },
    archive: function(){

    }
}

ftp.on('ready', connected);