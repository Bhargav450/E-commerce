const Item = require('../models/item');
const Category=require('../models/category');

const itemController = {
  createItem: async (req, res) => {
    try {
      const {name, price} = req.body;
      const newItem = await Item.bulkCreate({name,price});
      const type=req.body;
      const category=await Category.bulkCreate(type);
      res.status(201).json({ message: 'Item created successfully', newItem,category});
      
     


    } catch (error) {
      // If a Sequelize validation error occurs (e.g., duplicate record)
      if (error.name === 'SequelizeUniqueConstraintError') {
        res.status(400).json({ message: 'Duplicate record found' });
      } else {
        // For other errors, send internal server error response
        console.error('Error creating item:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  }
};



module.exports = itemController;
