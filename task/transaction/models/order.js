const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Customer = require('./customer');

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  customer_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Customer,
      key: 'id'
    }
  },
  order_date: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  status: {
    type: DataTypes.ENUM('Pending', 'Fulfilled', 'Cancelled'),
    allowNull: false,
    defaultValue: 'Pending'
  }
});

Order.belongsTo(Customer, { foreignKey: 'customer_id' });
Customer.hasMany(Order, { foreignKey: 'customer_id' });





module.exports = Order;
