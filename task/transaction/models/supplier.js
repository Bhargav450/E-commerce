const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Correct import

const Supplier = sequelize.define('Supplier', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  contact_info: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
});



module.exports = Supplier;
