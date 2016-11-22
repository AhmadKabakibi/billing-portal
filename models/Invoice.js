/**
 * Created by a.kabakibi on 11/19/2016.
 */

'use strict';
module.exports = function(sequelize, DataTypes) {
    var Invoice = sequelize.define('invoice', {
        InvoiceNumber: { type: DataTypes.STRING,primaryKey: true},
        InvoiceDate: { type: DataTypes.DATE},
        PurchaseOrder:{ type: DataTypes.STRING },
        ContactEmail:{ type: DataTypes.STRING },
        QuantityInvoiced:{ type: DataTypes.STRING },
        Total:{ type: DataTypes.STRING }
    }, {
        timestamps: true,
        paranoid: true,
        indexes: [
            { fields: ['deletedAt'] }
        ],
        classMethods: {
            associate: function(models) {
                Invoice.belongsTo(models.poheader) ;
            }
        }
    });
    return Invoice;
};
