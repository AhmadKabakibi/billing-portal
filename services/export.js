var models = require('../models');
var Promise = require('bluebird');
var moment = require('moment') //timing utulity module

var service = module.exports = {

  Receivedfiles: function () {
    return models.fileslogs.findAll({
      include: [{model: models.statuslogs}]
    });
  },
  Exportedfiles: function () {
    return models.exportfileslogs.findAll();
  },

  listPOs: function () {
    return models.poheader.findAll();
  },
  listPartners: function () {
    return models.poheader.findAll({
      attributes: ['PartnerCode', 'PartnerName']
    });
  },
  listPartnersCodes: function (params) {
    return models.poheader.findAll({
      attributes: ['PartnerCode', 'PartnerName'],
      where: {
        PartnerCode: params.PartnerCode
      }
    });
  },
  listPOsCode: function (params) {
    return models.poheader.findAll({
      where: {
        PartnerCode: params.PartnerCode
      }
    });
  },
  getPOHeader: function (params) {
    if (typeof params.PONumber != "undefined" && typeof params.PartnerCode != "undefined" && typeof params.POStatus != "undefined") {
      console.log("both " + params.PONumber + " " + params.PartnerCode)
      return models.poheader.findAll({
        where: {
          PONumber: params.PONumber,
          PartnerCode: params.PartnerCode.PartnerCode,
          POStatus: params.POStatus
        }
      });
    } else if (typeof params.PONumber != "undefined" || typeof params.PartnerCode == "undefined") {
      console.log("just PONumber " + params.PONumber + " " + params.PartnerCode)
      return models.poheader.findAll({
        where: {
          PONumber: params.PONumber
        }
      });
    } else if (typeof params.PONumber == "undefined" || typeof params.PartnerCode != "undefined") {
      console.log("just PartnerCode " + params.PONumber + " " + params.PartnerCode)
      return models.poheader.findAll({
        where: {
          PartnerCode: params.PartnerCode.PartnerCode
        }
      });
    } else {
      console.log("POStatus " + params.POStatus)
      return models.poheader.findAll({
        where: {
          POStatus: params.POStatus
        }
      });
    }
  },
  getPOHeaderCode: function (params) {
    return models.poheader.findAll({
      where: {
        PONumber: params.PONumber,
        PartnerCode: params.PartnerCode
      }
    });
  },
  getAllPos: function (params) {
    var DATE_RANGE;
    var now = moment().format("YYYY-MM-DD HH:mm:ss.SSSSSSS");

    if (params.dateRange == 30) {
      DATE_RANGE = moment().subtract(30, 'days').format("YYYY-MM-DD HH:mm:ss.SSSSSSS");
      console.log('GTe 30: ' + DATE_RANGE)

      return models.poheader.findAll({
        //PODate:params.dateRange
        where: {
          PONumber: params.PONumber,
          PODate: {
            $lt: now,
            $gt: DATE_RANGE
          }
        },
        include: [{model: models.podetails}]
      });
    } else if (params.dateRange == 60) {
      DATE_RANGE = moment().subtract(60, 'days').format("YYYY-MM-DD HH:mm:ss.SSSSSSS");
      console.log('GTe 60: ' + DATE_RANGE)
      return models.poheader.findAll({
        //PODate:params.dateRange
        where: {
          PONumber: params.PONumber,
          PODate: {
            $lt: now,
            $gt: DATE_RANGE
          }
        },
        include: [{model: models.podetails}]
      });
    } else if (params.dateRange == 7) {

      DATE_RANGE = moment().subtract(7, 'days').format("YYYY-MM-DD HH:mm:ss.SSSSSSS");
      console.log('GTe 7: ' + DATE_RANGE)
      return models.poheader.findAll({
        //PODate:params.dateRange
        where: {
          PONumber: params.PONumber,
          PODate: {
            $lt: now,
            $gt: DATE_RANGE
          }
        },
        include: [{model: models.podetails}]
      });
    } else if (params.dateRange == 1) {

      DATE_RANGE = moment().format("YYYY-MM-DD HH:mm:ss.SSSSSSS");
      console.log(new Date() + ' GTe 1: ' + DATE_RANGE)

      return models.poheader.findAll({
        //PODate:params.dateRange
        where: {
          PONumber: params.PONumber,
          PODate: {
            $lt: now,
            $gt: DATE_RANGE
          }
        },
        include: [{model: models.podetails}]
      });
    } else {
      return models.poheader.findAll({
        //PODate:params.dateRange
        where: {
          PONumber: params.PONumber
        },
        include: [{model: models.podetails}, {model: models.invoicefiles}],

      });
    }

  },
  getPOs: function (params) {
    var DATE_RANGE;
    var now = moment().format("YYYY-MM-DD HH:mm:ss.SSSSSSS");

    if (params.dateRange == 30) {
      DATE_RANGE = moment().subtract(30, 'days').format("YYYY-MM-DD HH:mm:ss.SSSSSSS");
      console.log('GTe 30: ' + DATE_RANGE)

      return models.poheader.findAll({
        //PODate:params.dateRange
        where: {
          PONumber: params.PONumber,
          PODate: {
            $lt: now,
            $gt: DATE_RANGE
          }

        },
        include: [{model: models.podetails}]
      });
    } else if (params.dateRange == 60) {
      DATE_RANGE = moment().subtract(60, 'days').format("YYYY-MM-DD HH:mm:ss.SSSSSSS");
      console.log('GTe 60: ' + DATE_RANGE)
      return models.poheader.findAll({
        //PODate:params.dateRange
        where: {
          PONumber: params.PONumber,
          PODate: {
            $lt: now,
            $gt: DATE_RANGE
          }
        },
        include: [{model: models.podetails}]
      });
    } else if (params.dateRange == 7) {

      DATE_RANGE = moment().subtract(7, 'days').format("YYYY-MM-DD HH:mm:ss.SSSSSSS");
      console.log('GTe 7: ' + DATE_RANGE)
      return models.poheader.findAll({
        //PODate:params.dateRange
        where: {
          PONumber: params.PONumber,
          PODate: {
            $lt: now,
            $gt: DATE_RANGE
          }
        },
        include: [{model: models.podetails}]
      });
    } else if (params.dateRange == 1) {

      DATE_RANGE = moment().format("YYYY-MM-DD HH:mm:ss.SSSSSSS");
      console.log(new Date() + ' GTe 1: ' + DATE_RANGE)

      return models.poheader.findAll({
        //PODate:params.dateRange
        where: {
          PONumber: params.PONumber,
          PODate: {
            $lt: now,
            $gt: DATE_RANGE
          }
        },
        include: [{model: models.podetails}]
      });
    } else {
      return models.poheader.findAll({
        //PODate:params.dateRange
        where: {
          PONumber: params.PONumber
        },
        include: [{model: models.podetails}, {model: models.invoicefiles}]
      });
    }
  },
  acceptPOslist: function (pos,userId) {
    return models.poheader.update({POStatus: 'Accepted'}, {where: {PONumber: pos}}).then(function (po){
      for(var i=0;i<pos.length;i++){
        service.createAction({
          Action: 'Accept',
          ActionNote: 'Accepted',
          poheaderPONumber: pos[i],
          userId: userId
        })
      }
    })
  }
  ,
  rejectedPO: function (po,userId) {
    return models.poheader.update({POStatus: 'Rejected'}, {where: {PONumber: po}}).then(function (){
        service.createAction({
          Action: 'Reject',
          ActionNote: 'Rejected',
          poheaderPONumber: po,
          userId: userId
        })

    })
  },
  invociePO: function (po,userId,ActionNote) {
    return models.poheader.update({POStatus: 'Invoiced'}, {where: {PONumber: po}}).then(function (){
      service.createAction({
        Action: 'Invoice',
        ActionNote: ActionNote||'Invoiced',
        poheaderPONumber: po,
        userId: userId
      })
    })
  },
  checkPOStatus: function (po) {
    return models.poheader.findOne({
      where: {PONumber: po},
      attributes: ['POStatus']
    })
  },
  UnderReviewPO: function (po,userId) {
    return models.poheader.update({POStatus: 'UnderReview'}, {where: {PONumber: po}}).then(function (){
      service.createAction({
        Action: 'UnderReview',
        ActionNote: 'UnderReview',
        poheaderPONumber: po,
        userId: userId
      })
    })
  }
  ,
  createInvocie: function (params) {

    return models.invoice.findAll({
      where: {
        InvoiceNumber: params.InvoiceNumber,
        PartnerCode: params.PartnerCode
      }
    }).then(function (rows) {
      if (rows.length > 0) {
        return false
      } else {
        return models.invoice.create(
          {
            InvoiceNumber: params.InvoiceNumber,
            PartnerCode: params.PartnerCode,
            InvoiceDate: params.InvoiceDate,
            PurchaseOrder: params.PurchaseOrder,
            ContactEmail: params.ContactEmail,
            QuantityInvoiced: params.QuantityInvoiced,
            Total: params.Total,
            poheaderPONumber: params.PurchaseOrder
          }).then(function (invoice) {

          //podetails_invoice

          for (var i = 0; i < params.podetails_invoice.length; i++) {
            models.podetails.update(
              {
                QuantityInvoiced: params.podetails_invoice[i].QuantityInvoiced,
                Total: params.Total
              }, {where: {id: params.podetails_invoice[i].id}}).then(function (PoLine) {

            }).catch(function (err) {
              // err is whatever rejected the promise chain returned to the transaction callback
              logger.db(err)
            })
          }

          for (var i = 0; i < params.podetails.length; i++) {
            params.podetails[i].Total = (params.podetails[i].Total).toString();
            console.log(typeof(params.podetails[i].Total))
          }

          return models.podetails.bulkCreate(params.podetails)
        })
      }

    }).catch(function (err) {
      // err is whatever rejected the promise chain returned to the transaction callback
      console.log(err)
    })
  },
  updatePoLine: function (params) {
    return models.podetails.update(
      {
        QuantityOrdered: params.QuantityOrdered,
        QuantityInvoiced: params.QuantityInvoiced,
        Total: params.Total
      }, {where: {id: params.id}}).then(function (PoLine) {

    }).catch(function (err) {
      // err is whatever rejected the promise chain returned to the transaction callback
      logger.db(err)
    })
  },
  createFile: function (params) {
    return models.invoicefiles.create(
      {
        mimetype: params.mimetype,
        path: params.path,
        filename: params.filename,
        originalFilename: params.originalname,
        size: params.size,
        poheaderPONumber: params.poheaderPONumber
      }).then(function (file) {
    })
  },
  createAction: function (params) {
    return models.historyactions.create(
      {
        Action: params.Action,
        ActionNote: params.ActionNote,
        poheaderPONumber: params.poheaderPONumber,
        userId: params.userId
      }).then(function (action) {
    })
  },
  listActions: function (params) {
    return models.historyactions.findAll({
      //PODate:params.dateRange
      where: {
        PONumber: params.PONumber
      },
      include: [{model: models.poheader}, {model: models.user}]
    });
  }
}