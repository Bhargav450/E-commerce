const {DataTypes}=require('sequelize');
const sequelize=require('../config/database.js');

const Category=sequelize.define('Category',{
    type:{
        type:DataTypes.STRING,
        allowNull:false
    }
});

//define association btn item and category
const Item=require('./item.js');
Category.hasMany(Item,{foreignKey:'categoryId'});

//create category table if doesn't exist
Category.sync({ alter: false })
  .then(() => {
    console.log('Category table created (if not already present).');
  })
  .catch(err => {
    console.error('Error creating Category table:', err);
  });

module.exports = Category;
