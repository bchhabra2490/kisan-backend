'use strict';
module.exports = (sequelize, DataTypes) => {
  var Messages = sequelize.define('Messages', {
    // attributes
    sendFrom: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    sendTo: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    message: {
      type: DataTypes.STRING,
      allowNull: false
    },
  });

  Messages.associate = function(models) {
    models.Messages.belongsTo(models.Users, {
      onDelete: "CASCADE",
      foreignKey: 'sendFrom'
    });
    models.Messages.belongsTo(models.Contacts, {
      onDelete: "CASCADE",
      foreignKey: 'sendTo'
    });
  };

  return Messages;
};