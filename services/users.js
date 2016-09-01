var models = require('../models');
var Promise = require('bluebird');

var service = module.exports = {
    listUsers: function () {
        return models.user.findAll();
    }
}