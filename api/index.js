//Sanitize untrusted HTML (to prevent XSS) with a configuration specified by a Whitelist

var exportService = require('../services/export.js'),
    usersService = require('../services/users.js'),
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

var Promise = require('bluebird');
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
        if (req.user.type == 'admin') {
            return exportService.getAllPos({
                PONumber: req.params.PONumber,
                //     dateRange: req.body.dateRange
            }).then(function (result) {
                return successHandler(res, result);
            }).catch(function (error) {
                return errorHandler(res, error);
            });

        } else if (req.user.type == 'normal') {

            parseCode(req.user.code, function (codes) {
                console.log(":P " + codes);
                return exportService.getPOs({
                    PONumber: req.params.PONumber,
                    //  dateRange: req.body.dateRange,
                    PartnerCode: codes
                }).then(function (result) {
                    return successHandler(res, result);
                }).catch(function (error) {
                    return errorHandler(res, error);
                });

            })
        }
    });

    apiRouter.get('/users', function (req, res) {
        if (req.user.type == 'admin') {
            return usersService.listUsers().then(function (result) {
                return successHandler(res, result);
            }).catch(function (error) {
                return errorHandler(res, error);
            });
        } else {
            return errorHandler(res, "access denied not authorized");
        }
    });

    apiRouter.post('/findUsers', function (req, res) {
        return usersService.findUsers({
            username: req.params.username,
            code: req.body.code
        }).then(function (result) {
            return successHandler(res, result);
        }).catch(function (error) {
            return errorHandler(res, error);
        });
    });


    apiRouter.get('/auth', function (req, res) {
        return res.json({
            success: true,
            user: {
                id: req.user.id,
                username: req.user.username,
                type: req.user.type,
                code: req.user.code,
                email: req.user.email
            },
            isAuth: req.isAuthenticated()
        });
    });

    // =====================================
    // LOGOUT ==============================
    // =====================================
    apiRouter.get('/logout', function (req, res) {
        //req.session.destroy();
        req.logout();
        req.session = null;
        res.json({success: true, msg: 'logout'});
    });

}

function parseCode(cd, callback) {
    var codes = [];
    var code = cd.split(";");
    for (var i = 0; i < code.length; i++) {
        codes.push(code[i]);
    }
    return callback(codes)
}