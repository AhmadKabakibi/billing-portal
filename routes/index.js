var models = require('../models');
var express = require('express');

var path = require('path'),
    rootPath = path.normalize(__dirname + '/../'),
    apiRouter = express.Router(),
    router = express.Router();

module.exports = function (app,passport) {

  app.use('/api', isLoggedIn, apiRouter);
  app.use('/', router);

  // API routes
  require('../api/index.js')(apiRouter);


  // =====================================
  // HOME PAGE (with login links) ========
  // =====================================
  app.get('/', function(req, res) {
    res.render('index'); // load the index.ejs file
  });


  // process the login form
  app.post('/login', passport.authenticate('local', {
    successRedirect : '/dashboard', // redirect to the secure profile section
    failureRedirect : '/', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
  }));

  // =====================================
  // PROFILE SECTION =========================
  // =====================================
  // we will want this protected so you have to be logged in to visit
  // we will use route middleware to verify this (the isLoggedIn function)
  app.get('/dashboard', isLoggedIn, function(req, res) {
    res.render('dashboard', {
      user : req.user // get the user out of session and pass to template
    });
  });

  // =====================================
  // LOGOUT ==============================
  // =====================================
  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });


}
// route middleware to make sure
function isLoggedIn (req, res, next) {
  // if user is authenticated in the session, call the next() to call the next request handler
  // Passport adds this method to request object. A middleware is allowed to add properties to
  // request and response objects
  // if user is authenticated in the session, carry on
  if (req.isAuthenticated())
    return next()
  res.redirect('/')
}
