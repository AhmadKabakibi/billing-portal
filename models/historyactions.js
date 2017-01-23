/**
 * Created by a.kabakibi on 11/19/2016.
 */

'use strict';
module.exports = function (sequelize, DataTypes) {
  var HistoryActions = sequelize.define('historyactions', {
    Action: {
      type: DataTypes.ENUM,
      values: ['Accept','Invoice', 'Reject','UnderReview']
    },
    ActionNote: {type: DataTypes.STRING, defaultValue: ''}
  }, {
    timestamps: true,
    paranoid: true,
    indexes: [
      {fields: ['deletedAt']}
    ],
    classMethods: {
      associate: function (models) {
        HistoryActions.belongsTo(models.poheader);
        HistoryActions.belongsTo(models.user)

      }
    }
  });
  return HistoryActions;
};
