'use strict';
module.exports = (sequelize, DataTypes) => {
  var Contacts = sequelize.define('Contacts', {
    // attributes
    firstName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lastName: {
      type: DataTypes.STRING
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  });

  Contacts.associate = function(models) {
    models.Contacts.belongsTo(models.Users, {
      onDelete: "CASCADE",
      foreignKey: 'createdBy'
    });
  };

  return Contacts;
};