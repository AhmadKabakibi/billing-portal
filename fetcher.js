/**
 * Created by a.kabakibi on 11/19/2016.
 */
var helmet = require('helmet');
var csrf = require('csurf');
var moment = require('moment');
var path = require('path');
var models = require('./models');

var exportService = require('./services/export.js'),
    usersService = require('./services/users.js'),
    FTPService = require('./services/ftpFetcher.js'),
    ParserService = require('./services/parser.js');

var logger = require('./services/logger.js');
var env = process.env.NODE_ENV || 'development';
var config = require(__dirname + '/config/tsconfig.json')[env];


if (config.dialect == 'mssql') {
    models.sequelize.sync().then(function () {
        console.log('FTP Fetcher Service Database ready!');

        FTPService.startFTP();
        FTPService.on(FTPService.events.onFTPConnected, function (CheckingTime) {
            logger.info("onFTPConnected Emitt " + CheckingTime);
        });
    });
} else {
    models.sequelize.query('CREATE EXTENSION IF NOT EXISTS hstore').then(function () {
        models.sequelize.sync().then(function () {
            console.log('FTP Fetcher Service Database ready!');

            FTPService.startFTP();
            FTPService.on(FTPService.events.onFTPConnected, function (CheckingTime) {
                logger.info("onFTPConnected Emitt " + CheckingTime);
            });
        });
    });
}


