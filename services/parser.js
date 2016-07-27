var models = require('../models');
var Promise = require('bluebird');
var csv = require('csv-stream');
fs = require('fs');
var moment    = require('moment') //timing utulity module
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
    },
    validateFile:function(){
        //Not valid JSON
        //file structure does match the sample file
    },
    validatePO:function(){
        /*Anyone of the below fields is empty
            PO number
            Partner Code
            PO ERP Status field
            Item Code
            Quantity Ordered
            If one record within the PO is bad --> reject the full PO*/
    },
    statusPO:function(){

    }

   /* If the same PO number is received in the files received from ERP
        Check if the status in the PO =
            Open                O             ignore and do nothing
            Changed             C             replace existing PO if it is not invoiced yet
            BackOrdered         B             ignore and do nothing
            Completed           X             ignore and do nothing*/



}