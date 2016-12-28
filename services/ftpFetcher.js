var models = require('../models');
var Promise = require('bluebird');
var path = require("path");
var moment = require('moment') //timing utulity module
var env = process.env.NODE_ENV || 'development';
var config = require(__dirname + '/../config/tsconfig.json')[env];
var ftpLocal = path.join(__dirname, '../', config.ftp.local);
var ftpDownload = path.join(__dirname, '../');
var logger = require('./logger.js');
var FTP = require('ftpimp');
var csv = require('fast-csv');

//Initializes the main FTP sequence ftp will emit a ready event once the server connection has been established
ftp = FTP.create(config.ftp, false),
    connected = function () {
        console.log('connected to remote FTP server');
    };

//@Override FTP.prototype.unlink
/**
 * Runs the FTP command DELE - Delete remote file
 * @param {string} filepath - The location of the file to be deleted.
 * @param {function} callback - The callback function to be issued.
 * @param {boolean} runLevel - execution priority; @see {@link FTP.Queue.RunLevels}.
 * @param {boolean} [holdQueue=false] - Prevents the queue from firing an endproc event, user must end manually
 */
ftp.unlink = function (filepath, callback, runLevel, holdQueue) {
    ftp.run(ftp.unlink.raw + ' ' + filepath, function (err, data) {
        callback.call(callback, err, data);
    }, runLevel, holdQueue);
};
ftp.unlink.raw = 'DELE';

var fs = require('fs');
var winston = require('winston');
var archiver = require('archiver');
var archive;
var archiveFile;

var PoHeaders = [];

var service = module.exports = {
    events: {
        onFTPConnected: 'onFTPConnected',
        onFTPPing: 'onFTPPing',
        onFTPUnlink: 'onFTPUnlink',
        onFTPSaved: 'onFTPSaved',
        onFTPArchive: 'onFTPArchive',
        onFTPError: 'onFTPError',
        onFileCheck: 'onFileCheck',
        onPOCheck: 'onPOCheck',
        onFileReject: 'onFileReject',
        onFileArchive: 'onFileArchive',
        onPOReject: 'onPOReject',
        onPOSaved: 'onPOSaved',
        onParseError: 'onParseError'
    },

    startFTP: function () {
        var events = require('events');
        events.EventEmitter.call(service);
        service.__proto__ = events.EventEmitter.prototype;


        ftp.connect(function () {
            var now = moment();
            service.emit(service.events.onFTPConnected, now.format('YYYY-MM-DD hh:mm'));

            if (config.ftp.parser) {
                service.sweepFTP();
            }
            service.pingFTP();
            service.generateInvoicedPos();
        });

    },
    pingFTP: function () {
        ftp.ping(function (err, info) {
            if (err) {
                var now = moment();
                //service.emit(service.events.onFTPError, now.format('YYYY-MM-DD hh:mm'), err);
                logger.error('error ping ' + err);
                service.startFTP();
            }
            logger.info("FTP ping Ok: " + info);
        });
        setTimeout(service.pingFTP, 60000);
    },
    generateInvoicedPos: function () {

        console.log('generate Invoiced Pos to FTP every ' + (config.ftp.intervalExport / 1000) / 60 + ' minutes!');
        logger.info('generate Invoiced Pos to FTP every' + (config.ftp.intervalExport / 1000) / 60 + ' minutes!');

        var csv = "";

        models.podetails.findAll({
            include: [{model: models.poheader, where: {POStatus: 'Invoiced'}, include: [{model: models.invoice}]}]
        }).then(function (Invoicedline) {

            Invoicedline.forEach(function (line) {

                //console.log(JSON.stringify(line))

                csv += 'I' + ',' + '' + ',' + moment(line.poheader.invoices[0].InvoiceDate).format('MM/DD/YYYY') + ',' + line.poheaderPONumber + ',' + line.poheader.Division + ',' + line.poheader.PartnerCode + ',' + line.poheader.PartnerName + ',' + moment(line.poheader.invoices[0].InvoiceDate).format('MM/DD/YYYY') + ',' + line.poheader.invoices[0].InvoiceNumber + ',' + moment(line.poheader.invoices[0].InvoiceDate).format('MM/DD/YYYY') + ',' + 'NONTAX' + ',' + line.FreightAmount + ',' + '' + ',' + line.ItemCode + ',' + '' + ',' + line.UnitofMeasure + ',' + line.WarehouseCode + ',' + line.QuantityOrdered + ',' + line.QuantityInvoiced + ',' + line.UnitCost + ',' + line.Total + '\r\n';
            })

            console.log(csv)

            var now = new moment();
            var generatedFile = 'POInvImport-' + now.format('YYYYMMDDhhmmss')+'.txt';

            fs.writeFile(path.join(ftpLocal, generatedFile), csv, function (err) {
                if (err) {
                    logger.error('error creating new export csv ' + generatedFile + ' ' + err);
                }

                ftp.put([path.join(ftpLocal, generatedFile), path.join(config.ftp.rootExport, generatedFile)], function (status) {

                    fs.unlink(path.join(ftpLocal, generatedFile), function (err) {
                        if (err) {
                            logger.error('error deleting ' + generatedFile + ' ' + err);
                        }
                        logger.info(generatedFile + ' deleted successfully from local disk')
                    });

                });

            });

        })


        setTimeout(service.generateInvoicedPos, config.ftp.intervalExport);

    },
    sweepFTP: function () {
        ftp.ls(config.ftp.root, function (err, fileslist) {
            if (err) {
                logger.error('error sweepFTP ' + err);
            }
            console.log('sweeping FTP server every ' + (config.ftp.interval / 1000) / 60 + ' minutes!');
            logger.info('sweeping FTP server every ' + (config.ftp.interval / 1000) / 60 + ' minutes!');

            //console.log(fileslist)
            if (fileslist.length == 0) {
                console.log("There is no new files in root " + config.ftp.root);
                logger.info("There is no new files in root " + config.ftp.root);
            }

            for (var i = 0; i < fileslist.length; i++) {
                console.log(path.join(config.ftp.root, fileslist[i].filename));
                if (fileslist[i].isFile)
                    service.download(path.join(config.ftp.root, fileslist[i].filename), path.join(ftpLocal, fileslist[i].filename));
            }
        });
        setTimeout(service.sweepFTP, config.ftp.interval);
    },
    download: function (remote_path_file, local_path_file) {
        ftp.save([remote_path_file, local_path_file], function (err, filename) {
            if (err) {
                var now = moment();
                //service.emit(service.events.onFTPError, now.format('YYYY-MM-DD hh:mm'), err);
                logger.error('error download ' + err);
            }
            console.log("Saved " + filename);
            var now = moment();
            //start parsing saved file
            service.parseFile(filename);
            //start deleteing the file from remote ftp it's already saved to local disk
            ftp.unlink(remote_path_file, function (err, file) {
                if (err) {
                    logger.error("unlink error: " + err);
                    logger.error('error deleting from ftp ' + err);
                }
                logger.info("unlink deleted from ftp " + file);
            });
        });
    },
    archive: function (zipFile, fileNameLocal, status) {
        //append date/time to the file name and upload it to the folder (Archive)

        ftp.put([path.join(ftpLocal, zipFile), path.join(config.ftp.archive, zipFile)], function (status) {

            models.sequelize.transaction(function (t) {
                return models.fileslogs.create(
                    {
                        FileName: fileNameLocal,
                        FileNameArchived: zipFile
                    },
                    {transaction: t}).then(function (log) {
                    logger.SuccessfulFiles(zipFile + ' :FTP status Code: ' + status);
                });
            }).catch(function (err) {
                logger.error("Create Logs record err: " + err);
            });

            fs.unlink(path.join(ftpLocal, zipFile), function (err) {
                if (err) {
                    logger.error('error deleting ' + zipFile + ' ' + err);
                }
                logger.info(zipFile + ' deleted successfully from local disk')
            });
        });

        /*var files = fs.readdirSync(ftpLocal);
         for(var i in files) {
         if(path.extname(files[i]) === ".zip") {
         //do something
         ftp.put([path.join(ftpLocal,files[i]),path.join(config.ftp.archive,files[i])],function(status){
         logger.info(files[i]+' :: '+status);
         });
         } else{
         logger.info('wait sweeping ftp processing');
         }
         }*/
        // setTimeout(service.archive,60000);
    },
    parseFile: function (filename) {
        var lineIndex = 0;
        var stream = fs.createReadStream(filename);
        csv
            .fromStream(stream, {
                headers: ['PONumber', 'PODate', 'OrderType', 'Division', 'PartnerCode',
                    'PartnerName', 'ShipToCode', 'ShipToName',
                    'POERPStatus',
                    'CustomerNumber', 'FreightAmount', 'ItemCode', 'Description', 'WarehouseCode',
                    'PartnerPONumber',
                    'UnitofMeasure',
                    'QuantityOrdered',
                    'Quantitybackordered',
                    'Quantityinvoiced',
                    'UnitCost',
                    'Total'
                ],
                discardUnmappedColumns: true,
                quote: '\\'
            })
            .validate(function (data) {
                lineIndex++;
                if (Object.keys(data).length != 21 || data.ItemCode == '/C' || data.PONumber == '' || data.PartnerCode == '' || data.POERPStatus == '' || data.ItemCode == '' || data.QuantityOrdered == '') {
                    return false;
                } else {
                    return true;
                }
            })
            .on("data-invalid", function (data) {
                //do something with invalid row
                var fileName = filename.replace(/^.*[\\\/]/, '')
                models.sequelize.transaction(function (t) {
                    return models.statuslogs.create(
                        {
                            status: 'bad-po',
                            lineNo: lineIndex,
                            PONumber: data.PONumber,
                            FileName: fileName
                        },
                        {transaction: t}).then(function (log) {

                        //reject the PO don't insert to DB
                        logger.BadPOs({
                            "lineNo:": lineIndex,
                            "FileName": fileName,
                            "PONumber": data.PONumber,
                            "PartnerCode": data.PartnerCode,
                            "POERPStatus": data.POERPStatus,
                            "ItemCode": data.ItemCode,
                            "QuantityOrdered": data.QuantityOrdered
                        })
                    })
                }).catch(function (err) {
                    logger.error("Create Logs record err: " + err);
                })
            })
            .on("data", function (data) {
                //console.log(lineIndex + " onData: " + Object.keys(data).length)
                if (PoHeaders.indexOf(data.PONumber) === -1 && (data.POERPStatus == 'O' || data.POERPStatus == 'C')) {
                    /*PO Status
                     If the same PO number is received in the files received from ERP
                     Check if the status in the PO =
                     Open                O       ignore and do nothing the status O means
                     new Open PO should be only Created intoDB
                     Changed             C       replace existing PO if it is not invoiced yet
                     BackOrdered         B       ignore and do nothing
                     Completed           X       ignore and do nothing*/
                    PoHeaders.push(data.PONumber)
                    if (data.POERPStatus == 'C') {
                        //  PO Changed             C       replace existing PO if it is not invoiced yet
                        return models.poheader.update(
                            {
                                PODate: data.PODate,
                                OrderType: data.OrderType,
                                Division: data.Division,
                                PartnerCode: data.PartnerCode,
                                PartnerName: data.PartnerName,
                                ShipToCode: data.ShipToCode,
                                ShipToName: data.ShipToName,
                                POERPStatus: data.POERPStatus
                            }, {where: {PONumber: data.PONumber}}).then(function (PoHeader) {
                            console.log("PO exist line has been updated")
                            return models.podetails.update(
                                {
                                    CustomerNumber: data.CustomerNumber,
                                    FreightAmount: data.FreightAmount,
                                    ItemCode: data.ItemCode,
                                    Description: data.Description,
                                    WarehouseCode: data.WarehouseCode,
                                    PartnerPONumber: data.PartnerPONumber,
                                    UnitofMeasure: data.UnitofMeasure,
                                    QuantityOrdered: data.QuantityOrdered,
                                    QuantityBackordered: data.QuantityBackordered,
                                    QuantityInvoiced: data.QuantityInvoiced,
                                    UnitCost: data.UnitCost,
                                    Total: data.Total,
                                    poheaderPONumber: data.PONumber
                                }, {where: {poheaderPONumber: data.PONumber}}).then(function (PoHeader) {


                            }).catch(function (err) {
                                // err is whatever rejected the promise chain returned to the transaction callback
                                logger.db(err)
                            })
                        }).catch(function (err) {
                            // err is whatever rejected the promise chain returned to the transaction callback
                            logger.db(err)
                        })
                    } else {
                        //now we have a new PO with POERPStatus O it should be inserted but we need to check one
                        // POHeader has multiple PODetails it means the POHeader with a PONumber should be inserted
                        // one time and the PODetails it will be create and link with its POHeader
                        return models.poheader.create(
                            {
                                PONumber: data.PONumber,
                                PODate: data.PODate,
                                OrderType: data.OrderType,
                                Division: data.Division,
                                PartnerCode: data.PartnerCode,
                                PartnerName: data.PartnerName,
                                ShipToCode: data.ShipToCode,
                                ShipToName: data.ShipToName,
                                POERPStatus: data.POERPStatus
                            }).then(function (PoHeader) {
                            console.log("a new PO created line has been crearted")
                            return models.podetails.create(
                                {
                                    CustomerNumber: data.CustomerNumber,
                                    FreightAmount: data.FreightAmount,
                                    ItemCode: data.ItemCode,
                                    Description: data.Description,
                                    WarehouseCode: data.WarehouseCode,
                                    PartnerPONumber: data.PartnerPONumber,
                                    UnitofMeasure: data.UnitofMeasure,
                                    QuantityOrdered: data.QuantityOrdered,
                                    QuantityBackordered: data.QuantityBackordered,
                                    QuantityInvoiced: data.QuantityInvoiced,
                                    UnitCost: data.UnitCost,
                                    Total: data.Total,
                                    poheaderPONumber: data.PONumber
                                }).then(function (PODetalis) {
                            }).catch(function (err) {
                                // err is whatever rejected the promise chain returned to the transaction callback
                                logger.db(err)
                            })
                        }).catch(function (err) {
                            // err is whatever rejected the promise chain returned to the transaction callback
                            logger.db(err)
                        })
                    }
                } else if (data.POERPStatus == 'O' || data.POERPStatus == 'C') {
                    if (data.POERPStatus == 'C') {
                        //  PO Changed C replace existing PO if it is not invoiced yet
                        return models.podetails.update(
                            {
                                CustomerNumber: data.CustomerNumber,
                                FreightAmount: data.FreightAmount,
                                ItemCode: data.ItemCode,
                                Description: data.Description,
                                WarehouseCode: data.WarehouseCode,
                                PartnerPONumber: data.PartnerPONumber,
                                UnitofMeasure: data.UnitofMeasure,
                                QuantityOrdered: data.QuantityOrdered,
                                QuantityBackordered: data.QuantityBackordered,
                                QuantityInvoiced: data.QuantityInvoiced,
                                UnitCost: data.UnitCost,
                                Total: data.Total,
                                poheaderPONumber: data.PONumber
                            }, {where: {poheaderPONumber: data.PONumber}}).then(function (PoHeader) {


                        }).catch(function (err) {
                            // err is whatever rejected the promise chain returned to the transaction callback
                            logger.db(err)
                        })
                    } else {
                        //Create new podetails and link it with its POHeader using poheaderPONumber
                        return models.podetails.create(
                            {
                                CustomerNumber: data.CustomerNumber,
                                FreightAmount: data.FreightAmount,
                                ItemCode: data.ItemCode,
                                Description: data.Description,
                                WarehouseCode: data.WarehouseCode,
                                PartnerPONumber: data.PartnerPONumber,
                                UnitofMeasure: data.UnitofMeasure,
                                QuantityOrdered: data.QuantityOrdered,
                                QuantityBackordered: data.QuantityBackordered,
                                QuantityInvoiced: data.QuantityInvoiced,
                                UnitCost: data.UnitCost,
                                Total: data.Total,
                                poheaderPONumber: data.PONumber
                            }).then(function (PODetalis) {
                        }).catch(function (err) {
                            // err is whatever rejected the promise chain returned to the transaction callback
                            logger.db(err)
                        })
                    }
                }
            })
            .on("end", function () {
                console.log("parsing done .. start inserting into DB PoHeaders: " + PoHeaders.length);

                // here parsing channel has been end and start archive process and deleting local parsed file
                var fileName = filename.replace(/^.*[\\\/]/, '');
                archive = archiver('zip');
                var now = new moment();

                archiveFile = fs.createWriteStream(filename + '.' + now.format('YYYYMMDDhhmmss') + '.zip');

                archiveFile.on('close', function () {

                    logger.Archiver('archiver has been finalized and send ' + fileName + ' to FTP uploader, archive size ' + archive.pointer() / 1024 + ' total KB');

                    //delete local downloaded file from FTP it has been parsed and prepared
                    // to archive and send to FTP archive uploader

                    fs.unlink(filename, function (err) {
                        if (err) {
                            logger.error('error deleting ' + fileName + ' ' + err);
                        }
                        logger.info(fileName + ' deleted successfully from local disk');
                    });

                    //start service FTP archive uploader
                    service.archive(fileName + '.' + now.format('YYYYMMDDhhmmss') + '.zip', fileName);
                });
                archive.on('error', function (err) {
                    logger.error(err);
                });
                archive.pipe(archiveFile);
                archive
                    .append(fs.createReadStream(filename), {name: fileName})
                    .finalize();
            })
    }
    /*,
     isPoHeader: function (PO) {
     return new Promise(function (resolve, reject) {
     models.poheader.findAll({
     where: {PONumber: PoLines[i].PONumber}
     }).then(function (pos) {
     if (pos.length != 0) {
     return resolve(pos);
     } else {
     return resolve(false);
     }
     }).catch(function (err) {
     // err is whatever rejected the promise chain returned to the transaction callback
     logger.error(err)
     return reject(new Error(err))
     })
     })
     },
     newPoHeader: function (data) {
     return new Promise(function (resolve, reject) {
     models.poheader.create(
     {
     PONumber: data.PONumber,
     PODate: data.PODate,
     OrderType: data.OrderType,
     Division: data.Division,
     PartnerCode: data.PartnerCode,
     PartnerName: data.PartnerName,
     ShipToCode: data.ShipToCode,
     ShipToName: data.ShipToName,
     POERPStatus: data.POERPStatus
     }).then(function (PoHeader) {
     return resolve(PoHeader);
     }).catch(function (err) {
     // err is whatever rejected the promise chain returned to the transaction callback
     logger.error(err)
     return reject(new Error(err))
     })
     })
     },
     newPoDetails: function (id, data) {
     return new Promise(function (resolve, reject) {
     models.podetails.create(
     {
     CustomerNumber: data.CustomerNumber,
     FreightAmount: data.FreightAmount,
     ItemCode: data.ItemCode,
     Description: data.Description,
     WarehouseCode: data.WarehouseCode,
     PartnerPONumber: data.PartnerPONumber,
     UnitofMeasure: data.UnitofMeasure,
     QuantityOrdered: data.QuantityOrdered,
     QuantityBackordered: data.QuantityBackordered,
     QuantityInvoiced: data.QuantityInvoiced,
     UnitCost: data.UnitCost,
     Total: data.Total,
     poheaderId: id
     }).then(function (PODetalis) {
     return resolve(PODetalis);
     }).catch(function (err) {
     // err is whatever rejected the promise chain returned to the transaction callback
     logger.error(err)
     return reject(new Error(err))
     })
     })
     }*/
}


ftp.on('ready', connected);