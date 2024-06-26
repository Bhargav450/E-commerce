const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const ProductLine = require('./productLine'); // Import ProductLine model

const Product = sequelize.define('Product', {
  productCode: {
    type: DataTypes.STRING,
    primaryKey: true,
    unique: true // Unique constraint
  },
  productName: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  productLine: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: ProductLine,
      key: 'productLine'
    }
  },
  productScale: {
    type: DataTypes.STRING(10),
    allowNull: false
  },
  productVendor: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  productDescription: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  quantityInStock: {
    type: DataTypes.SMALLINT,
    allowNull: false
  },
  buyPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  MSRP: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  }
});

module.exports = Product;
