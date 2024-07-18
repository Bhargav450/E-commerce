const { sequelize } = require("../config/db");
const { QueryTypes } = require("sequelize");
const { validationResult, body } = require("express-validator");

// Controller method to create customer
const createCustomer = async (req, res) => {
  // Validate request data
  await Promise.all([
    body("name").notEmpty().withMessage("Name is required").run(req),
    body("contact_info")
      .notEmpty()
      .withMessage("Contact info is required")
      .run(req),
  ]);

  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // Destructure fields from req.body
  const { name, contact_info } = req.body;

  try {
    // SQL insert query
    const insertQuery = `
      INSERT INTO Customers (name, contact_info)
      VALUES (?, ?)
    `;

    // Execute the query using Sequelize
    const [metadata] = await sequelize.query(insertQuery, {
      replacements: [name, contact_info],
      type: QueryTypes.INSERT,
    });

    // Check if insert was successful
    if (metadata) {
      return res.status(201).json({ message: "Customer created successfully" });
    } else {
      throw new Error("Failed to create customer");
    }
  } catch (error) {
    // Check for duplicate entry error
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({ error: " Customer already exists" });
    }
    return res.status(500).json({ error: "Failed to create customer" });
  }
};

//Controller method to get customer
const getCustomers = async (req, res) => {
  try {
    const customersData = await sequelize.query("SELECT *FROM CUSTOMERS");
    return res.json(customersData[0]);
  } catch (error) {
    console.error("Error fetching items:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Controller method to get a customer by ID 
const getCustomerById = async (req, res) => {
  console.log("inside getCUst by id");
  const customer_id = parseInt(req.params.customer_id);
  console.log(customer_id);

  try {
    const results = await sequelize.query(
      "SELECT * FROM customers WHERE id = ?",
      {
        replacements: [customer_id],
        type: sequelize.QueryTypes.SELECT,
      }
    );

    if (!results) {
      return res.status(404).json({ error: "Customer not found" });
    }

    const customer = results;
    res.status(200).json(customer);
  } catch (err) {
    console.error("Error fetching customer:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Controller method to update a customer by ID
const updateCustomerById = async (req, res) => {
  try {
    // Validation rules using express-validator
    await body("name").notEmpty().withMessage("Name is required").run(req);
    await body("contact_info")
      .notEmpty()
      .withMessage("Contact info is required")
      .run(req);

    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Use req.params to get the customer ID
    const customer_id = parseInt(req.params.customer_id);

    // Check if the customer exists
    const existingCustomer = await sequelize.query(
      "SELECT * FROM customers WHERE id = ?",
      {
        replacements: [customer_id],
        type: sequelize.QueryTypes.SELECT,
      }
    );

    if (existingCustomer.length === 0) {
      return res.status(404).json({ error: "Customer not found" });
    }

    // Extract data from request body
    const { name, contact_info } = req.body;

    // Use a raw SQL query to update the customer
    await sequelize.query(
      "UPDATE customers SET name = ?, contact_info = ? WHERE id = ?",
      {
        replacements: [name, contact_info, customer_id],
        type: sequelize.QueryTypes.UPDATE,
      }
    );

    // Respond with success message
    res.json({ message: "Customer updated successfully" });
  } catch (err) {
    console.error("Error updating customer:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Controller method to delete by id
const deleteCustomerById = async (req, res) => {
  try {
    const customerId = parseInt(req.params.customer_id);

    // Check if the order was found and deleted
    const existingCustomer = await sequelize.query(
      "SELECT * FROM customers WHERE id = ?",
      {
        replacements: [customerId],
        type: sequelize.QueryTypes.SELECT,
      }
    );

    if (existingCustomer.length === 0) {
      return res.status(404).json({ error: "Customer not found" });
    }
    // Use a raw SQL query to delete the customer
    await sequelize.query("DELETE FROM customers WHERE id = :customerId", {
      replacements: { customerId: customerId },
      type: QueryTypes.DELETE,
    });

    // Respond with success message
    res.json({ message: "Customer deleted successfully" });
  } catch (err) {
    console.error("Error deleting customer:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  createCustomer,
  getCustomers,
  getCustomerById,
  updateCustomerById,
  deleteCustomerById,
};
