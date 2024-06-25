const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Employee = require('./employee'); // Import Employee model

const Customer = sequelize.define('Customer', {
  customerNumber: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  customerName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  contactLastName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  contactFirstName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  addressLine1: {
    type: DataTypes.STRING,
    allowNull: false
  },
  addressLine2: {
    type: DataTypes.STRING,
    allowNull: true
  },
  city: {
    type: DataTypes.STRING,
    allowNull: false
  },
  state: {
    type: DataTypes.STRING,
    allowNull: true
  },
  postalCode: {
    type: DataTypes.STRING(15),
    allowNull: false
  },
  country: {
    type: DataTypes.STRING,
    allowNull: false
  },
  salesRepEmployeeNumber: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: Employee,
      key: 'employeeNumber'
    }
  },
  creditLimit: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  }
});

module.exports = Customer;
