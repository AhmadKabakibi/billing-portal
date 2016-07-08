var models = require('../models');
var Promise = require('bluebird');

var service = module.exports = {

    createPOs: function(params) {
     /*   return models.poinfo.create({
            type: params.type,
            message: params.message,
            userId: params.user.id,
            questionId: params.questionId,
            metadata: params.metadata || {}
        });*/
    },
    listPOs: function() {
        return models.poinfo.findAll();
    }

}