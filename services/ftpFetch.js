var models = require('../models');
var Promise = require('bluebird');
var path = require("path");
var env       = process.env.NODE_ENV || 'development';
var config    = require(__dirname + '/../config/tsconfig.json')[env];
var ftpLocal  =path.join(__dirname,'../',config.ftp.local);
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
        ftp.ls(config.ftp.root, function (err, fileslist) {
            console.log('sweeping FTP server every '+ (config.ftp.interval / 1000)  / 60 + ' minutes!');
            //console.log(fileslist)

            for(var i =0;i<fileslist.length;i++){
               console.log(config.ftp.root+'/'+fileslist[i].filename);
                service.download(config.ftp.root+'/'+fileslist[i].filename,path.join(ftpLocal,fileslist[i].filename));
            }
        });
        setTimeout(service.sweepFTP,config.ftp.interval);
    },
    download: function (remote_path_file,local_path_file) {
        ftp.save([remote_path_file, local_path_file ], function (err, filename) {
            console.log("Saved "+filename);
        });
    },
    archive: function(){

    }
}

ftp.on('ready', connected);