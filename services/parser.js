var models = require('../models');
var Promise = require('bluebird');
var csv = require('csv-stream');
fs = require('fs');
var path = require('path');

// All of these arguments are  optional.
var options = {
    endLine : '\n', // default is \n,
    columns : ['PONumber','PODate','OrderType','Division','PartnerCode',
        'PartnerName','ShipToCode','ShipToName',
        'POERPStatus',
        'CustomerNumber','FreightAmount','ItemCode','Description','WarehouseCode',
        'PartnerPONumber',
        'UnitofMeasure',
        'QuantityOrdered',
        'Quantitybackordered',
        'Quantityinvoiced',
        'UnitCost',
        'Total'
    ], // by default read the first line and use values found as columns
    escapeChar : '"', // default is an empty string
    enclosedChar : '"' // default is an empty string
}

var csvStream = csv.createStream(options);


var service = module.exports = {
    parseFile: function(filename){

        fs.createReadStream(filename)
            .pipe(csv.createStream(options))
            .on('data',function(data){
                console.log(data);
            })
            .on('column',function(key,value){

            })
            .on('end',function(){
                console.log('end!');
            })
            .on('close',function(){
                console.log('close!');
            })

    }
}