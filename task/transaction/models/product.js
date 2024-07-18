const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Correct import
const Supplier = require('./supplier');

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  supplier_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Supplier,
      key: 'id',
    },
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
});

Product.belongsTo(Supplier, { foreignKey: 'supplier_id' });
Supplier.hasMany(Product, { foreignKey: 'supplier_id' });



module.exports = Product;
