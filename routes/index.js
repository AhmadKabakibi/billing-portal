var models = require('../models');
var express = require('express');
var jwt = require('jsonwebtoken');


//var bcrypt = require('bcrypt');


var env = process.env.NODE_ENV || 'development';
var config = require(__dirname + '/../config/tsconfig.json')[env];

var path = require('path'),
    rootPath = path.normalize(__dirname + '/../'),
    apiRouter = express.Router(),
    router = express.Router();

module.exports = function (app, passport) {

    app.use('/api',isLoggedIn, apiRouter);
    //app.use('/api', apiRouter);
    app.use('/', router);

    // API routes
    require('../api/index.js')(apiRouter);


    // =====================================
    // HOME PAGE (with login links) ========
    // =====================================
    app.get('*', function (req, res) {
        // load the single view file (angular will handle the page changes on the front-end)
        res.sendFile(path.join(__dirname, '../dist', 'index.html'));
    });

    // process the login form
    // route to authenticate a user (POST http://localhost:PORT/auth/authenticate)
    // Authenticate the user and get a JSON Web Token to include in the header of future requests.
    app.post('/auth/authenticate', passport.authenticate('local', {}), function (req, res) {
        if (req.user)
            res.json({success: true, user: req.user,isAuthenticated:req.isAuthenticated()});
        else
            res.send({success: false, msg: 'Authentication failed.'});
    });

    // create a new user account (POST http://localhost:PORT/auth/new)
    app.post('/auth/new', function (req, res) {
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
                        code:req.body.code,
                        email:req.body.email
                    }).then(function (user) {
                        res.json({success: true, msg: 'Successful created new user.'});
                    });
                }
            })
        }
    });
}

// route middleware to make sure

function isLoggedIn(req, res, next) {
    // if user is authenticated in the session, call the next() to call the next request handler
    // Passport adds this method to request object. A middleware is allowed to add properties to
    // request and response objects
    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next()
    res.send(401);
}
