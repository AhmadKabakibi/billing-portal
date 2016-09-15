'use strict';
module.exports = function (sequelize, DataTypes) {
    var FilesLogs = sequelize.define('fileslogs', {
        FileName: {type: DataTypes.STRING, allowNull: false, primaryKey: true},
        FileNameArchived: {type: DataTypes.STRING, allowNull: false},
    }, {
        timestamps: true,
        paranoid: true,
        indexes: [
            {fields: ['deletedAt']}
        ],
        classMethods: {
            associate: function (models) {
                FilesLogs.hasMany(models.statuslogs, {foreignKey: 'FileName',constraints: false});
            }
        }
    });

    return FilesLogs;
};
