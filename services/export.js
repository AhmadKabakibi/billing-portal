var models = require('../models');
var Promise = require('bluebird');
var moment = require('moment') //timing utulity module

var service = module.exports = {
    listPOs: function () {
        return models.poinfo.findAll();
    },
    getPOs: function (params) {
        var DATE_RANGE;
        var now = moment().format("YYYY-MM-DD HH:mm:ss.SSSSSSS");

        if (params.dateRange == 30) {
            DATE_RANGE = moment().subtract(30, 'days').format("YYYY-MM-DD HH:mm:ss.SSSSSSS");
            console.log('GTe 30: ' + DATE_RANGE)

            return models.poinfo.findAll({
                //PODate:params.dateRange
                where: {
                    PONumber: params.PONumber,
                    PODate: {
                        $lt: now,
                        $gt: DATE_RANGE
                    }
                }
            });
        } else if (params.dateRange == 60) {
            DATE_RANGE = moment().subtract(60, 'days').format("YYYY-MM-DD HH:mm:ss.SSSSSSS");
            console.log('GTe 60: ' + DATE_RANGE)
            return models.poinfo.findAll({
                //PODate:params.dateRange
                where: {
                    PONumber: params.PONumber,
                    PODate: {
                        $lt: now,
                        $gt: DATE_RANGE
                    }
                }
            });
        } else if (params.dateRange == 7) {

            DATE_RANGE = moment().subtract(7, 'days').format("YYYY-MM-DD HH:mm:ss.SSSSSSS");
            console.log('GTe 7: ' + DATE_RANGE)
            return models.poinfo.findAll({
                //PODate:params.dateRange
                where: {
                    PONumber: params.PONumber,
                    PODate: {
                        $lt: now,
                        $gt: DATE_RANGE
                    }
                }
            });
        } else if (params.dateRange == 1) {

            DATE_RANGE = moment().format("YYYY-MM-DD HH:mm:ss.SSSSSSS");
            console.log(new Date() + ' GTe 1: ' + DATE_RANGE)

            return models.poinfo.findAll({
                //PODate:params.dateRange
                where: {
                    PONumber: params.PONumber,
                    PODate: {
                        $lt: now,
                        $gt: DATE_RANGE
                    }
                }
            });
        } else {

            return models.poinfo.findAll({
                //PODate:params.dateRange
                where: {
                    PONumber: params.PONumber
                }
            });
        }
    }

}