var models = require('../models');
var Promise = require('bluebird');

var service = module.exports = {

    listPOs: function () {
        return models.poinfo.findAll();
    },
    getPOs: function (params) {
        return models.poinfo.findAll({
            where: {
                PONumber: params.PONumber
            }
        });
    }

}