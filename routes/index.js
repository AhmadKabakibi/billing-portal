var models = require('../models');
var express = require('express');
var jwt = require('jsonwebtoken');


//var bcrypt = require('bcrypt');


var env = process.env.NODE_ENV || 'development';
var config = require(__dirname + '/../config/tsconfig.json')[env];

var path = require('path'),
    rootPath = path.normalize(__dirname + '/../'),
    apiRouter = express.Router(),
    router = express.Router(),
     moment = require('moment') //timing utulity module
     successHandler = function (res, result) {
    res.json({success: true, data: result});
      },
      errorHandler = function (res, error) {
        return res.status(400).json({success: false, error: error});
      }


module.exports = function (app, passport) {

    app.use('/api',isLoggedIn, apiRouter);
    //app.use('/api', apiRouter);
    app.use('/', router);

    // API routes
    require('../api/index.js')(apiRouter);

  app.get('/v1/invoices',function(req,res){
      var csv =[];
      models.podetails.findAll({
            include: [{model: models.poheader, where: {POStatus: 'Invoiced'}, include: [{model: models.invoice}]}]
        }).then(function (Invoicedline) {
            for (let line of Invoicedline) {
                 csv.push({
                "type":"I",
                "atr01":"",
                "atr02":"",
                "InvoiceDate":moment(line.poheader.invoices[0].InvoiceDate).format('MM/DD/YYYY'),
                "PartnerCode":line.poheader.PartnerCode,
                "PartnerName":line.poheader.PartnerName,
                "InvoiceDate":moment(line.poheader.invoices[0].InvoiceDate).format('MM/DD/YYYY'),
                "InvoiceNumber":line.poheader.invoices[0].InvoiceNumber,
                "atr03":moment(line.poheader.invoices[0].InvoiceDate).format('MM/DD/YYYY'),
                "atr04":"NONTAX",
                "FreightAmount":line.FreightAmount,
                "atr05":"",
                "ItemCode":line.ItemCode,
                "atr06":"4521-000",
                "UnitofMeasure":line.UnitofMeasure,
                "QuantityOrdered":line.QuantityOrdered,
                "QuantityInvoiced":line.QuantityInvoiced,
                "UnitCost":line.UnitCost,
                "Total":line.Total
              })
            }
          return successHandler(res, csv);
        }).catch(function (error) {
            console.log(error);
          return errorHandler(res, error);
        })
  })

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
            res.sendStatus({success: false, msg: 'Authentication failed.'});
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
    res.sendStatus(401);
}
