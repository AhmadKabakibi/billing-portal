//Sanitize untrusted HTML (to prevent XSS) with a configuration specified by a Whitelist

var exportService = require('../services/export.js'),
    usersService = require('../services/users.js'),
    FTPService = require('../services/ftpFetcher.js'),
    ParserService = require('../services/parser.js'),
    FilesService = require('../services/files.js'),
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
var fs = require('fs');
var Promise = require('bluebird');
var path = require('path');
var xss = require('xss');

var JSFtp = require("jsftp");


//SendGrid
//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
// using SendGrid's Node.js Library
var sendgrid = require("sendgrid")("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");

var NotificationEmail = new sendgrid.Email({
    to: 'ahmadkbakibi@gmail.com',
    from: 'noreply@r-pac.com',
    subject: 'r-pac billing portal Notification',
    html: '<h2>New Notification!</h2>'
});
NotificationEmail.setFilters({
    "templates": {
        "settings": {
            "enabled": 1,
            "template_id": "ae6ea2e4-adae-4b6a-8184-9b0b6ebc7fa3"
        }
    }
});
NotificationEmail.addSubstitution('-R-Pac Billing Portal-', "Thanks!");

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

    apiRouter.get('/ftp/export/:FileName', function (req, res) {

        var Ftp = new JSFtp({
            host: config.ftp.host,
            port: config.ftp.port,
            user: config.ftp.user,
            pass: config.ftp.password,
            debugMode: false
        });

        Ftp.get(path.join(config.ftp.rootExport, req.params.FileName), path.join(__dirname, '../', req.params.FileName), function (error) {
            if (error) {
                return errorHandler(res, error);
            }
            else {
                //console.log('File copied successfully!');
                return res.sendFile(path.join(__dirname, '../', req.params.FileName), {
                    dotfiles: 'deny',
                    headers: {
                        'Content-Disposition': 'attachment; filename="' + req.params.FileName + '"'
                    }
                }, function (err) {
                    if (err) {
                        return errorHandler(res, error);
                    }
                    fs.unlink(path.join(__dirname, '../', req.params.FileName), function (err) {
                        if (err) {
                            logger.error('error deleting after download from ftp ' + localFile + ' ' + err);
                        }
                        Ftp.raw.quit(function (err, data) {
                            if (err) return console.error(err);
                            console.log("FTP disconnected after download file!");
                        });
                    });
                });

            }
        });
    });

    apiRouter.get('/ftp/:FileName', function (req, res) {

        var Ftp = new JSFtp({
            host: config.ftp.host,
            port: config.ftp.port,
            user: config.ftp.user,
            pass: config.ftp.password,
            debugMode: false
        });

        Ftp.get(path.join(config.ftp.archive, req.params.FileName), path.join(__dirname, '../', req.params.FileName), function (error) {
            if (error) {
                return errorHandler(res, error);
            }
            else {
                //console.log('File copied successfully!');
                return res.sendFile(path.join(__dirname, '../', req.params.FileName), {
                    dotfiles: 'deny',
                    headers: {
                        'Content-Disposition': 'attachment; filename="' + req.params.FileName + '"'
                    }
                }, function (err) {
                    if (err) {
                        return errorHandler(res, error);
                    }
                    fs.unlink(path.join(__dirname, '../', req.params.FileName), function (err) {
                        if (err) {
                            logger.error('error deleting after download from ftp ' + localFile + ' ' + err);
                        }
                        Ftp.raw.quit(function (err, data) {
                            if (err) return console.error(err);
                            console.log("FTP disconnected after download file!");
                        });
                    });
                });

            }
        });

        /*  FTPService.downloadArchive(req.params.FileName, function (err, localFile) {
         console.log("FTP: " + localFile)
         if (err) {
         return errorHandler(res, error);
         } else {
         return res.sendFile(localFile, {
         dotfiles: 'deny',
         headers: {
         'Content-Disposition': 'attachment; filename="' + req.params.FileName + '"'
         }
         }, function (err) {
         if (err) {
         return errorHandler(res, error);
         }
         fs.unlink(localFile, function (err) {
         if (err) {
         logger.error('error deleting after download from ftp ' + localFile + ' ' + err);
         }
         });
         });
         }
         });*/
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

    apiRouter.get('/pos/exported', function (req, res) {
        if (req.user.type == 'admin') {
            return exportService.Exportedfiles().then(function (result) {
                    return successHandler(res, result);
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
                PartnerCode: req.body.PartnerCode,
                POStatus: req.body.status
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
                    PartnerCode: codes,
                    POStatus: req.body.status
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
                //var unq = removeDuplicate(result, 'PONumber');
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

    //change the status of the PO from “Pending” to “Accepted”
    //Admin Function
    apiRouter.put('/po/accept', function (req, res) {
        return exportService.acceptPOslist(req.body.POList).then(function (result) {
            return successHandler(res, result);
        }).catch(function (error) {
            return errorHandler(res, error);
        });
    });

    //Change the status of the PO to “Rejected” & send an email to admin
    //multiple Function permissions

    apiRouter.put('/po/reject', function (req, res) {
        return exportService.rejectedPO(req.body.PONumber).then(function (result) {

            //todo send an email to admin using API SendGrid
            //todo use partner name instead of the code

            NotificationEmail.to = config.email;
            NotificationEmail.subject = "PO: " + req.body.PONumber + " was rejected by " + req.user.code;
            NotificationEmail.html = req.body.comment;
            sendgrid.send(NotificationEmail, function (err, json) {
                if (err) {
                    console.log("Notification Error Email: " + err);
                } else {
                    console.log('Notify Invitation! ');
                }
            })

            return successHandler(res, result);
        }).catch(function (error) {
            return errorHandler(res, error);
        });
    });

    //change the status of the PO from “Pending” to “Accepted”
    apiRouter.put('/po/inovice', function (req, res) {
        return exportService.invociePO(req.body.PONumber).then(function (result) {
            return successHandler(res, result);
        }).catch(function (error) {
            return errorHandler(res, error);
        });
    });

    //change the status of the PO to “UnderReviewPO”
    apiRouter.put('/po/underreview', function (req, res) {
        return exportService.UnderReviewPO(req.body.PONumber).then(function (result) {
            return successHandler(res, result);
        }).catch(function (error) {
            return errorHandler(res, error);
        });
    });

    //Update POdetails line after acknowledge invocie
    apiRouter.put('/poline', function (req, res) {
        return exportService.updatePoLine({
            id: req.body.id,
            QuantityOrdered: req.body.QuantityOrdered,
            QuantityInvoiced: req.body.QuantityInvoiced,
            Total: req.body.Total,
            PONumber: req.body.PONumber
        }).then(function (result) {
            return successHandler(res, result);
        }).catch(function (error) {
            return errorHandler(res, error);
        });
    });


    //todo Create new invoice api

    apiRouter.post('/po/invoice/create', function (req, res) {
        return exportService.createInvocie({
            InvoiceNumber: req.body.InvoiceNumber,
            PartnerCode: req.body.PartnerCode,
            InvoiceDate: req.body.InvoiceDate,
            PurchaseOrder: req.body.PurchaseOrder,
            ContactEmail: req.body.ContactEmail,
            QuantityInvoiced: req.body.QuantityInvoiced,
            Total: req.body.Total,
            poheaderPONumber: req.body.poheaderPONumber,
            podetails_invoice: req.body.podetails_invoice, //array of updated lines
            podetails: req.body.podetails // array of new lines
        }).then(function (result) {
            if (!result) {
                return res.json({success: false, data: "cannot enter the same invoice number twice"});
            } else {
                return successHandler(res, result);
            }
        }).catch(function (error) {
            return errorHandler(res, error);
        })

    });

    /** API path that will upload the files*/

    apiRouter.post('/po/invoice/:PONumber/upload', FilesService.middleware.single('file'), function (req, res) {
        return exportService.createFile({
            mimetype: req.file.mimetype,
            path: req.file.destination.split('/').pop(),
            filename: req.file.filename,
            originalFilename: req.file.originalname,
            size: req.file.size,
            poheaderPONumber: req.params.PONumber
        }).then(function (result) {
            return successHandler(res, result);
        }).catch(function (error) {
            return errorHandler(res, error);
        });
    });

    apiRouter.get('/po/invoice/file/:uuid/:filename', function (req, res) {
        return FilesService.getPath({
            uuid: req.params.uuid,
            filename: req.params.filename
        }).then(function (filePath) {
            return res.sendFile(filePath, {
                dotfiles: 'deny',
                headers: {
                    'Content-Disposition': 'attachment; filename="' + req.params.filename + '"'
                }
            });
        }).catch(function (error) {
            return errorHandler(res, error);
        });
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

function parseCode (cd, callback) {
    var codes = [];
    var code = cd.split(";");
    for (var i = 0; i < code.length; i++) {
        codes.push(code[i]);
    }
    return callback(codes)
}

function removeDuplicate (arr, prop) {
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

function Receivedfiles (files, callback) {

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