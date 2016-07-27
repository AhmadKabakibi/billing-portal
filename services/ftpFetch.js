var models = require('../models');
var Promise = require('bluebird');
var path = require("path");
var moment    = require('moment') //timing utulity module
var env       = process.env.NODE_ENV || 'development';
var config    = require(__dirname + '/../config/tsconfig.json')[env];
var ftpLocal  =path.join(__dirname,'../',config.ftp.local);
var FTP = require('ftpimp'),

    //Initializes the main FTP sequence ftp will emit a ready event once the server connection has been established
    ftp = FTP.create(config.ftp,false),
    connected = function () {
        console.log('connected to remote FTP server');
    };

//@Override FTP.prototype.unlink
/**
 * Runs the FTP command DELE - Delete remote file
 * @param {string} filepath - The location of the file to be deleted.
 * @param {function} callback - The callback function to be issued.
 * @param {boolean} runLevel - execution priority; @see {@link FTP.Queue.RunLevels}.
 * @param {boolean} [holdQueue=false] - Prevents the queue from firing an endproc event, user must end manually
 */
ftp.unlink = function (filepath, callback, runLevel, holdQueue) {
    ftp.run(ftp.unlink.raw + ' ' + filepath, function (err, data) {
        callback.call(callback, err, data);
    }, runLevel, holdQueue);
};
ftp.unlink.raw = 'DELE';

var service = module.exports = {

    startFTP: function() {
        ftp.connect(function(){
            service.sweepFTP();
            service.pingFTP();
        });
    },
    pingFTP:function(){
        ftp.ping(function(err,info){
            if(err)
                service.startFTP();
            console.log("FTP ping Ok: "+info);
        });
        setTimeout(service.pingFTP,20000);
    },
    sweepFTP: function() {
        ftp.ls(config.ftp.root, function (err, fileslist) {
            console.log('sweeping FTP server every '+ (config.ftp.interval / 1000)  / 60 + ' minutes!');
            //console.log(fileslist)
            if(fileslist.length==0){
                console.log("There is no new files in root "+ config.ftp.root);
            }

            for(var i =0;i<fileslist.length;i++){
               console.log(path.join(config.ftp.root,fileslist[i].filename));
                service.download(path.join(config.ftp.root,fileslist[i].filename),path.join(ftpLocal,fileslist[i].filename));
            }
        });
        setTimeout(service.sweepFTP,config.ftp.interval);
    },
    download: function (remote_path_file,local_path_file) {
        ftp.save([remote_path_file, local_path_file ], function (err, filename) {
            console.log("Saved "+filename);
            ftp.unlink(remote_path_file,function(err,file){
                if(err){
                    console.log("unlink error: "+err);
                }
                console.log("unlink deleted from ftp "+file);
            });
        });
    },
    archive: function(){
        //append date/time to the file name and upload it to the folder (Archive)
    }
}

ftp.on('ready', connected);