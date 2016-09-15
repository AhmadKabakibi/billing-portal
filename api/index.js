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
        if (req.user.type == 'admin') {
            return exportService.listPOs().then(function (result) {
                var unq = removeDuplicate(result, 'PONumber');
                return successHandler(res, unq);
            }).catch(function (error) {
                return errorHandler(res, error);
            })
        } else if (req.user.type == 'normal') {
            parseCode(req.user.code, function (codes) {
                return exportService.listPOsCode({PartnerCode: codes}).then(function (result) {
                    var unq = removeDuplicate(result, 'PONumber');
                    return successHandler(res, unq);
                }).catch(function (error) {
                    return errorHandler(res, error);
                })
            })


        }
    });


    apiRouter.get('/pos/received', function (req, res) {
        if (req.user.type == 'admin') {
            return exportService.Receivedfiles().then(function (result) {
                Receivedfiles(result, function (received_files) {
                    return successHandler(res, received_files);
                })
            }).catch(function (error) {
                return errorHandler(res, error);
            })
        } else if (req.user.type == 'normal') {
            return res.status(401).json({success: false, error: 'Not Authorized'});
        }
    });

    apiRouter.get('/pos/partners', function (req, res) {
        if (req.user.type == 'admin') {
            return exportService.listPartners().then(function (result) {
                var unq = removeDuplicate(result, 'PartnerCode');
                return successHandler(res, unq);
            }).catch(function (error) {
                return errorHandler(res, error);
            })
        } else if (req.user.type == 'normal') {
            parseCode(req.user.code, function (codes) {
                return exportService.listPartnersCodes({PartnerCode: codes}).then(function (result) {
                    var unq = removeDuplicate(result, 'PartnerCode');
                    return successHandler(res, unq);
                }).catch(function (error) {
                    return errorHandler(res, error);
                })
            })
        }
    });

    apiRouter.post('/pos', function (req, res) {
        if (req.user.type == 'admin') {
            return exportService.getPOHeader({
                PONumber: req.body.PONumber,
                PartnerCode: req.body.PartnerCode
            }).then(function (result) {
                var unq = removeDuplicate(result, 'PONumber');
                return successHandler(res, unq);
            }).catch(function (error) {
                return errorHandler(res, error);
            })
        } else if (req.user.type == 'normal') {
            parseCode(req.user.code, function (codes) {
                return exportService.getPOHeaderCode({
                    PONumber: req.body.PONumber,
                    PartnerCode: codes
                }).then(function (result) {
                    var unq = removeDuplicate(result, 'PONumber');
                    return successHandler(res, unq);
                }).catch(function (error) {
                    return errorHandler(res, error);
                })
            })
        }
    });

    apiRouter.post('/po/:PONumber', function (req, res) {
        if (req.user.type == 'admin') {
            return exportService.getAllPos({
                PONumber: req.params.PONumber,
                //     dateRange: req.body.dateRange
            }).then(function (result) {
                var unq = removeDuplicate(result, 'PONumber');
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
                    var unq = removeDuplicate(result, 'PONumber');
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

    apiRouter.post('/user/find', function (req, res) {
        return usersService.findUsers({
            id: req.params.id,
            username: req.params.username,
            code: req.body.code
        }).then(function (result) {
            return successHandler(res, result);
        }).catch(function (error) {
            return errorHandler(res, error);
        });
    });


    apiRouter.get('/user/auth', function (req, res) {
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

    // create a new user account (POST http://localhost:PORT/auth/new)
    apiRouter.post('/user/new', function (req, res) {
        if (!req.body.username || !req.body.password) {
            res.json({success: false, msg: 'Please pass username and password.'});
        } else {
            models.user.findAll({
                where: {username: req.body.username}
            }).then(function (exists_user) {
                if (exists_user.length) {
                    return res.json({success: false, msg: 'Username already exists.'});
                } else {
                    models.user.create({
                        username: req.body.username,
                        password: req.body.password,
                        type: req.body.type,
                        code: req.body.code,
                        email: req.body.email
                    }).then(function (user) {
                        res.json({success: true, msg: 'Successful created new user.'});
                    });
                }
            })
        }
    });

    //edit exist user
    apiRouter.post('/user/update', function (req, res) {
        models.user.update({
            username: req.body.username,
            password: req.body.password,
            type: req.body.type,
            code: req.body.code,
            email: req.body.email
        }, {
            where: {id: req.body.id}
        }).then(function (user) {
            res.json({success: true, msg: 'Successful updated user.'});
        }).catch(function (err) {
            res.json({success: false, msg: 'something went wrong.'});
        });
    });

    //delete exist user
    apiRouter.post('/user/delete', function (req, res) {
        models.user.destroy(
            {
                where: {id: req.body.id},
                force: true
            }).then(function (user) {
            res.json({success: true, msg: 'Successful deleted user.'});
        }).catch(function (err) {
            res.json({success: false, msg: 'something went wrong.'});
        });
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

function removeDuplicate(arr, prop) {
    var new_arr = [];
    var lookup = {};
    for (var i in arr) {
        lookup[arr[i][prop]] = arr[i];
    }
    for (i in lookup) {
        new_arr.push(lookup[i]);
    }
    return new_arr;
}

function Receivedfiles(files, callback) {

    var files_report = []

    for (var i = 0; i < files.length; i++) {
        if (files[i].statuslogs.length == 0) {
            files_report.push({
                FileName: files[i].FileName,
                FileNameArchived: files[i].FileNameArchived,
                createdAt: files[i].createdAt,
                Status: 'Succeed'
            })
        } else {
            for (var j = 0; j < files[i].statuslogs.length; j++) {
                if (files[i].statuslogs[j].status == 'bad-file') {
                    files_report.push({
                        FileName: files[i].FileName,
                        FileNameArchived: files[i].FileNameArchived,
                        createdAt: files[i].createdAt,
                        Status: 'Incorrect file structure'
                    })
                } else if (files[i].statuslogs[j].status == 'bad-po') {
                    files_report.push({
                        FileName: files[i].FileName,
                        FileNameArchived: files[i].FileNameArchived,
                        createdAt: files[i].createdAt,
                        Status: 'Bad Po Empty field'
                    })
                    break;
                }
            }
        }
    }
    return callback(files_report);
}