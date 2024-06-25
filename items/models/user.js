const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const User = sequelize.define("User", {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM("admin", "customer"),
      allowNull: false,
      defaultValue: "customer",
    }
  }, {
    timestamps: false // Disable timestamps
  });

User.sync({ alter: false })
  .then(() => {
    console.log("Users table created (if not already present).");
  })
  .catch((err) => {
    console.error("Error creating Item table:", err);
  });

module.exports = User;
