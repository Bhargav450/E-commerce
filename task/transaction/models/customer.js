const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Customer = sequelize.define('Customer', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    
  },
  contact_info: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
  }
});




module.exports = Customer;
