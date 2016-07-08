//Sanitize untrusted HTML (to prevent XSS) with a configuration specified by a Whitelist

var exportService = require('../services/export.js'),
    UsersService = require('../services/users.js'),

    successHandler = function (res, result) {
        res.json({success: true, data: result});
    },
    errorHandler = function (res, error) {
        return res.status(400).json({success: false, error: "Something went wrong"});
    }

var xss = require('xss');


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
