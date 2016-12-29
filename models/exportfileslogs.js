'use strict';
module.exports = function (sequelize, DataTypes) {
    var ExportFilesLogs = sequelize.define('exportfileslogs', {
        FileName: {type: DataTypes.STRING, allowNull: false, primaryKey: true}
    }, {
        timestamps: true,
        paranoid: true,
        indexes: [
            {fields: ['deletedAt']}
        ],
        classMethods: {

        }
    });

    return ExportFilesLogs;
};
