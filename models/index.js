'use strict';

var fs        = require('fs');
var path      = require('path');
var moment    = require('moment') //timing utulity module
var Sequelize = require('sequelize');
var basename  = path.basename(module.filename);
var env       = process.env.NODE_ENV || 'development';
var config    = require(__dirname + '/../config/tsconfig.json')[env];
var sequelize = new Sequelize("postgres://hxvoddymxpielm:c650e484df270703f78ea5bbd6c58ec9b0bf567e5d018feef9c6953a76926fe7@ec2-176-34-222-188.eu-west-1.compute.amazonaws.com:5432/df3bkqp6gea9r1");
var db        = {};

try {
    sequelize.authenticate().then(console.log('Connection has been established successfully.'));
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }

fs
    .readdirSync(__dirname)
    .filter(function(file) {
        return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
    })
    .forEach(function(file) {
        var model = sequelize['import'](path.join(__dirname, file));
        db[model.name] = model;
    });

Object.keys(db).forEach(function(modelName) {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
