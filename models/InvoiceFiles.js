/**
 * Created by a.kabakibi on 11/19/2016.
 */

'use strict';
module.exports = function(sequelize, DataTypes) {
    var InvoiceFiles = sequelize.define('invoicefiles', {
        mimetype:{ type: DataTypes.STRING },
        path:{ type: DataTypes.STRING },
        filename:{ type: DataTypes.STRING },
        originalFilename:{ type: DataTypes.STRING },
        size:{ type: DataTypes.STRING }
    }, {
        timestamps: true,
        paranoid: true,
        indexes: [
            { fields: ['deletedAt'] }
        ],
        classMethods: {
            associate: function(models) {
                InvoiceFiles.belongsTo(models.poheader) ;
            }
        }
    });
    return InvoiceFiles;
};
