const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ProductLine = sequelize.define('ProductLine', {
  productLine: {
    type: DataTypes.STRING,
    primaryKey: true,
    unique: true // Unique constraint
  },
  textDescription: {
    type: DataTypes.STRING(4000),
    defaultValue: null
  },
  htmlDescription: {
    type: DataTypes.TEXT('medium'),
    allowNull: true
  },
  image: {
    type: DataTypes.BLOB('medium'),
    allowNull: true
  }
});

module.exports = ProductLine;
