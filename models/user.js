'use strict';
module.exports = function (sequelize, DataTypes) {
    var User = sequelize.define('user', {
        username: {type: DataTypes.STRING, allowNull: false},
        password: {type: DataTypes.STRING, allowNull: false},
        type: {
            type: DataTypes.ENUM,
            values: ['user', 'admin'],
            allowNull: false
        }
    }, {
        timestamps: true,
        paranoid: true,
        indexes: [
            { fields: ['deletedAt'] }
        ]
    });
    return User;
};