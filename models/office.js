const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Office = sequelize.define('Office', {
  officeCode: {
    type: DataTypes.STRING(10),
    primaryKey: true,
    unique: true // Unique constraint
  },
  city: {
    type: DataTypes.STRING,
    allowNull: false
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false
  },
  addressLine1: {
    type: DataTypes.STRING,
    allowNull: false
  },
  addressLine2: {
    type: DataTypes.STRING,
    allowNull: true
  },
  state: {
    type: DataTypes.STRING,
    allowNull: true
  },
  country: {
    type: DataTypes.STRING,
    allowNull: false
  },
  postalCode: {
    type: DataTypes.STRING(15),
    allowNull: false
  },
  territory: {
    type: DataTypes.STRING(10),
    allowNull: false
  }
});

module.exports = Office;
