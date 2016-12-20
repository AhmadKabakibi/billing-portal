'use strict';
module.exports = function (sequelize, DataTypes) {
    var POHeader = sequelize.define('poheader', {
        PONumber: {type: DataTypes.STRING, primaryKey: true},
        PODate: {type: DataTypes.DATE},
        OrderType: {type: DataTypes.STRING},
        Division: {type: DataTypes.STRING},
        PartnerCode: {type: DataTypes.STRING},
        PartnerName: {type: DataTypes.STRING},
        ShipToCode: {type: DataTypes.STRING},
        ShipToName: {type: DataTypes.STRING},
        POERPStatus: {type: DataTypes.STRING},
        POStatus: {
            type: DataTypes.ENUM,
            values: ['Pending', 'Accepted','Invoiced', 'Rejected','UnderReview'], // etc...
            allowNull: false,
            defaultValue: 'Pending'
        }
    }, {
        timestamps: true,
        paranoid: true,
        indexes: [
            {fields: ['deletedAt']}
        ],
        classMethods: {
            associate: function (models) {
                POHeader.hasMany(models.podetails);
                POHeader.hasMany(models.invoice);
            }
        }
    });

    return POHeader;
};
