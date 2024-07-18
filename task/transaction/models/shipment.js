const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Order = require('./order');

const Shipment = sequelize.define('Shipment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  order_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Order,
      key: 'id'
    }
  },
  shipment_date: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  delivery_date: {
    type: DataTypes.DATE,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('Shipped', 'In Transit', 'Delivered', 'Returned'),
    allowNull: false,
    defaultValue: 'Shipped'
  }
});

Shipment.belongsTo(Order, { foreignKey: 'order_id' });
Order.hasMany(Shipment, { foreignKey: 'order_id' });




module.exports = Shipment;
