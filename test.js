/*var Converter = require("csvtojson").Converter;
var converter = new Converter({});
converter.fromFile("POExport1_org.txt",function(err,result){
    var csvData = JSON.stringify(result);
    csvData = JSON.parse(csvData);
    console.log(csvData);
});*/

var models = require('./models');
var csv = require('csv-stream');
fs = require('fs');

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

fs.createReadStream('ftp/POExport1_org.txt')
    .pipe(csv.createStream(options))
    .on('data',function(data){
        console.log(data);
        models.poinfo.create(data);
    })
    .on('column',function(key,value){

    })
    .on('end',function(){
        console.log('end!');
    })
    .on('close',function(){
        console.log('close!');
    })