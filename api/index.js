//Sanitize untrusted HTML (to prevent XSS) with a configuration specified by a Whitelist

var exportService = require('../services/export.js'),
    UsersService = require('../services/users.js'),
    FTPService = require('../services/ftpFetch.js'),
    ParserService = require('../services/parser.js'),
    logger = require('../services/logger.js'),
    successHandler = function (res, result) {
        res.json({success: true, data: result});
    },
    errorHandler = function (res, error) {
        return res.status(400).json({success: false, error: error});
    }

var models = require('../models');
var jwt = require('jwt-simple');
//var bcrypt = require('bcrypt');
var env = process.env.NODE_ENV || 'development';
var config = require(__dirname + '/../config/tsconfig.json')[env];

var path = require('path');
var xss = require('xss');

 FTPService.startFTP();

 FTPService.on(FTPService.events.onFTPConnected, function (CheckingTime) {
 logger.info("onFTPConnected Emitt " + CheckingTime);
 });

//API
module.exports = function (apiRouter) {

    apiRouter.get('/pos', function (req, res) {
        return exportService.listPOs().then(function (result) {
            return successHandler(res, result);
        }).catch(function (error) {
            return errorHandler(res, error);
        });
    });

    apiRouter.post('/po/:PONumber', function (req, res) {
        return exportService.getPOs({PONumber:req.params.PONumber,dateRange:req.body.dateRange}).then(function (result) {
            return successHandler(res, result);
        }).catch(function (error) {
            return errorHandler(res, error);
        });

    });


    apiRouter.get('/auth', function (req, res) {
        return res.json({success:true,user:req.user});
    });

}
