const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Customer = require('./customer'); // Import Customer model

const Order = sequelize.define('Order', {
  orderNumber: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  orderDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  requiredDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  shippedDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  status: {
    type: DataTypes.STRING(15),
    allowNull: false
  },
  comments: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  isActive: {
    type: DataTypes.TINYINT,
    defaultValue: 1
  },
  customerNumber: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Customer,
      key: 'customerNumber'
    }
  }
});

Order.sync({ alter: false })
  .then(() => {
    console.log("Order table created (if not already present).");
  })
  .catch((err) => {
    console.error("Error creating Item table:", err);
  });

module.exports = Order;
