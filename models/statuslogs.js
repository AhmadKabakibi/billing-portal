'use strict';
module.exports = function (sequelize, DataTypes) {
    var StatusLogs = sequelize.define('statuslogs', {
        status: {
            type: DataTypes.ENUM,
            values: ['bad-file', 'bad-po', 'succeed'], // etc...
            allowNull: false
        },
        lineNo: {type: DataTypes.STRING, allowNull: true},
        PONumber: {type: DataTypes.STRING, allowNull: true}
    }, {
        timestamps: true,
        paranoid: true,
        indexes: [
            {fields: ['deletedAt']}
        ],
        classMethods: {
            associate: function(models) {
                StatusLogs.belongsTo(models.fileslogs, {foreignKey: 'FileName',constraints: false}) ;
            }
        }
    });

    return StatusLogs;
};
