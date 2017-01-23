var models = require('../models');
var Promise = require('bluebird');
var moment = require('moment') //timing utulity module
var multer = require('multer');
var fs = Promise.promisifyAll(require("fs"));
var uuid = require('node-uuid');
var path = require('path');
var sanitize = require("sanitize-filename");

var BASE_PATH = path.resolve(__dirname, '../uploads'),
    STORAGE = multer.diskStorage({
        destination: function (req, file, cb) {
            var path = BASE_PATH + '/' + uuid.v4();

            fs.statAsync(path, function (err, stats) {
                if (!err && stats.isDirectory()) return cb(null, path);
                fs.mkdirAsync(path).then(function (err) {
                    return cb(err, path);
                });
            });
        },
        filename: function (req, file, cb) {
            //PartnerName_PONumber_InvoiceNumber_SerialNumber.PDF
            //sanitize(file.originalname)
            cb(null, req.body.PartnerName+"_"+req.body.PONumber+"_"+req.body.InvoiceNumber+"_"+uuid.v4()+".pdf");
        }
    });


var service = module.exports = {
    middleware: multer({
        storage: STORAGE,
        limits: {
            fileSize: 1024 * 1024 * 100,
            files: 1
        }
    }),
    getPath: function (params) {
        var path = BASE_PATH + '/' + params.uuid + '/' + sanitize(params.filename);

        return new Promise(function (resolve, reject) {
            fs.statAsync(path, function (err, stats) {
                if (err || !stats.isFile()) {
                    reject();
                } else {
                    resolve(path);
                }
            });
        })
    }
};