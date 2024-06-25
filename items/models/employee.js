const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Office = require('./office');

const Employee = sequelize.define('Employee', {
  employeeNumber: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    unique: true // Unique constraint
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  extension: {
    type: DataTypes.STRING(10),
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true // Unique constraint
  },
  officeCode: {
    type: DataTypes.STRING(10),
    allowNull: false,
    references: {
      model: 'Office', // Use string reference to prevent circular dependency
      key: 'officeCode'
    }
  },
  reportsTo: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Employee', // Use string reference to prevent circular dependency
      key: 'employeeNumber'
    }
  },
  jobTitle: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

module.exports = Employee;
