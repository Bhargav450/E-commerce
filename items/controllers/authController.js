const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sequelize = require("../config/database");
const { QueryTypes } = require("sequelize");
const User = require("../models/user"); // as we have sync task in the model its creating the table
const { secretKey } = require("../config/config");
const { validationResult, check } = require("express-validator");

//seed data
let users = [
  {
    id: 1,
    username: "user1",
    password: "$2b$10$5qoG1Rq8.kzSD3zeZ.AQG.h2zqFynQ0BhbV5N8fC5dK/VKAg1dxmu",
  }, // Password: password1
  {
    id: 2,
    username: "user2",
    password: "$2b$10$5qoG1Rq8.kzSD3zeZ.AQG.h2zqFynQ0BhbV5N8fC5dK/VKAg1dxmu",
  }, // Password: password2
];

const isValidPassword = (password) => {
  // Check if the password is at least 8 characters long
  if (password.length < 8) {
    return false;
  }

  // Check if the password contains at least one uppercase letter, one lowercase letter, and one number
  if (
    !/[A-Z]/.test(password) ||
    !/[a-z]/.test(password) ||
    !/\d/.test(password)
  ) {
    return false;
  }

  // Optionally, check if the password contains at least one special character
  // You may adjust this based on your specific requirements
  if (!/[^A-Za-z0-9]/.test(password)) {
    return false;
  }

  return true;
};

const registration = {
  registration: async (req, res) => {
    try {
      const validationsRules = [
        check("email")
          .notEmpty()
          .withMessage("email address is required!!")
          .isEmail()
          .withMessage("Invalid order email address!!"),
          check("password")
          .notEmpty()
          .withMessage("Password is required")
          .isLength({ min: 8 })
          .withMessage("Password must be at least 8 characters long"),
        check("role").notEmpty().withMessage("Role is required"),
      ];
      // Validate request body
      await Promise.all(
        validationsRules.map((validation) => validation.run(req))
      );
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          console.error("Validation errors:", errors.array()[0].msg);
          return res.status(400).json({ errors: errors.array()[0].msg });
        }

      const { email, password, role } = req.body;

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user using raw SQL insert query
      const createUserQuery = `
                INSERT INTO USERS(email, password, role) 
                VALUES (?, ?, ?)
            `;
      await sequelize.query(createUserQuery, {
        replacements: [email, hashedPassword, role],
        type: QueryTypes.INSERT,
      });

      res.status(201).json({ message: "User registered successfully!!" });
    } catch (error) {
      // Log the error for debugging purposes
      console.error("Error creating user:", error);

      // Send appropriate response based on error type
      if (error.name === "SequelizeUniqueConstraintError") {
        res.status(400).json({ message: "User already exists!!" });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  },
};

const getUsers = async (req, res) => {
  try {
    const getUsers = await sequelize.query(`SELECT *FROM USERS`);
    return res.status(201).json(getUsers[0]);
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    //generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, expiresIn: "1h" },
      secretKey
    );
    res.status(200).json({ token });
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  registration: registration.registration,
  getUsers,
  login,
};
