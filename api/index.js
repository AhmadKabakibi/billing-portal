//Sanitize untrusted HTML (to prevent XSS) with a configuration specified by a Whitelist

var exportService = require('../services/export.js'),
    UsersService = require('../services/users.js'),
    FTPService = require('../services/ftpFetch.js'),
    ParserService = require('../services/parser.js'),
    logger = require('../services/logger.js');

var acl = require('acl');

successHandler = function (res, result) {
    res.json({success: true, data: result});
},
    errorHandler = function (res, error) {
        return res.status(400).json({success: false, error: "Something went wrong"});
    }

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
}
