const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Item = sequelize.define("Item", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  categoryId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Categories',
      key: 'id'
    }
  }
});

// Create the table in the database only if it does not exist
Item.sync({ alter: false })
  .then(() => {
    console.log("Item table created (if not already present).");
  })
  .catch((err) => {
    console.error("Error creating Item table:", err);
  });

module.exports = Item;
