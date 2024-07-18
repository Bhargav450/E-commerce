const { sequelize } = require("../config/db");
const { QueryTypes } = require("sequelize");
const { validationResult, body } = require("express-validator");

//creting order
const createOrder = async (req, res) => {
  // Validate fields using express-validator
  await body("customer_id")
    .isInt()
    .exists()
    .withMessage("Customer ID is required and must be an integer")
    .run(req);
  await body("status")
    .isIn(["Pending", "Fulfilled", "Cancelled"])
    .withMessage("Status must be one of: Pending, Fulfilled, Cancelled")
    .run(req);

  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Extract only the error messages
    const errorMessages = errors.array().map((error) => error.msg);
    return res.status(400).json({ errors: errorMessages });
  }

  const { customer_id, status } = req.body;

  try {
    // Check if the customer exists
    const customerExists = await sequelize.query(
      "SELECT id FROM Customers WHERE id = :customerId",
      {
        replacements: { customerId: customer_id },
        type: QueryTypes.SELECT,
      }
    );

    if (!customerExists.length) {
      return res.status(404).json({ error: "Customer not found" });
    }

    // Customer exists, proceed with inserting the order
    const query = `
      INSERT INTO Orders (customer_id, status, order_date)
      VALUES (?, ?, NOW())
    `;

    const results = await sequelize.query(query, {
      replacements: [customer_id, status],
      type: QueryTypes.INSERT,
    });

    const orderId = results.insertId; // Retrieve the ID of the inserted order

    res.status(201).json({ id: orderId, customer_id, status });
  } catch (err) {
    console.error("Error creating order:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

//get all orders
const getOrders = async (req, res) => {
  try {
    const customersData = await sequelize.query("SELECT *FROM ORDERS");
    return res.json(customersData[0]);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//get oder by id
const getOrderById = async (req, res) => {
  const order_id = parseInt(req.params.order_id);

  try {
    const [results, metadata] = await sequelize.query(
      "SELECT * FROM orders WHERE id = ?",
      {
        replacements: [order_id],
        type: sequelize.QueryTypes.SELECT,
      }
    );

    if (!results) {
      return res.status(404).json({ error: "order not found" });
    }

    const customer = results;
    res.status(200).json(customer);
  } catch (err) {
    console.error("Error fetching customer:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

//update order by id
const updateOrderById = async (req, res) => {
  try {
    // Validation rules using express-validator
    await body("customer_id")
      .optional()
      .isInt()
      .withMessage("Customer ID must be an integer")
      .toInt()
      .run(req);
    await body("order_date")
      .optional()
      .isISO8601()
      .toDate()
      .withMessage("Order date must be a valid date in ISO8601 format")
      .run(req);
    await body("status")
      .optional()
      .isIn(["Pending", "Fulfilled", "Cancelled"])
      .withMessage("Status must be one of: Pending, Fulfilled, Cancelled")
      .run(req);

    // Extract data from request body and params
    const order_id = parseInt(req.params.order_id);
    const { customer_id, order_date, status } = req.body;

    const validStatuses = ["Pending", "Fulfilled", "Cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        error: `Invalid status. Status must be one of: ${validStatuses.join(
          ", "
        )}`,
      });
    }

    // Check if the order exists
    const existingOrder = await sequelize.query(
      "SELECT * FROM orders WHERE id = ?",
      {
        replacements: [order_id],
        type: sequelize.QueryTypes.SELECT,
      }
    );

    if (existingOrder.length === 0) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Update the order
    await sequelize.query(
      "UPDATE orders SET customer_id = ?, order_date = ?, status = ? WHERE id = ?",
      {
        replacements: [customer_id, order_date, status, order_id],
        type: sequelize.QueryTypes.UPDATE,
      }
    );

    // Respond with success message
    res.json({ message: "Order updated successfully" });
  } catch (err) {
    console.error("Error updating order:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

//delete order by id
const deleteOrderById = async (req, res) => {
  try {
    // Use req.params to get the order ID
    const order_id = parseInt(req.params.order_id);
    // Check if the order was found and deleted
    const existingOrder = await sequelize.query(
      "SELECT * FROM orders WHERE id = ?",
      {
        replacements: [order_id],
        type: sequelize.QueryTypes.SELECT,
      }
    );

    if (existingOrder.length === 0) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Use a raw SQL query to delete the order
    await sequelize.query("DELETE FROM orders WHERE id = ?", {
      replacements: [order_id],
      type: QueryTypes.DELETE,
    });

    // Respond with success message
    res.json({ message: "Order deleted successfully" });
  } catch (err) {
    console.error("Error deleting order:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

//update order by id
const updateOrderStatusById = async (req, res) => {
  const { order_id, status } = req.params;
  

  try {
    const validStatuses = ["Pending", "Fulfilled", "Cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        error: `Invalid status. Status must be one of: ${validStatuses.join(
          ", "
        )}`,
      });
    }

    // Check if the order exists
    const existingOrder = await sequelize.query(
      "SELECT * FROM orders WHERE id = ?",
      {
        replacements: [order_id],
        type: sequelize.QueryTypes.SELECT,
      }
    );

    if (existingOrder.length === 0) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Update the order status using a raw SQL query
    await sequelize.query("UPDATE orders SET status = ? WHERE id =?", {
      replacements: [status, order_id],
      type: QueryTypes.UPDATE,
    });

    // Check if the order was found and updated

    // Respond with success message
    res.json({ message: "Order status updated successfully" });
  } catch (err) {
    console.error("Error updating order status:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

//get all items of an order
const getAllItemsOfAnOrder = async (req, res) => {
  try {
    const order_id = parseInt(req.params.order_id);

    // Use a raw SQL query to fetch all items for the given order ID
    const query = `
        SELECT oi.id, oi.order_id, oi.product_id, oi.quantity, oi.price, p.name AS product_name, p.description
        FROM OrderItems oi
        JOIN Products p ON oi.product_id = p.id
        WHERE oi.order_id = ?
      `;

    const items = await sequelize.query(query, {
      replacements: [order_id],
      type: QueryTypes.SELECT,
    });

    if (items.length === 0) {
      return res
        .status(404)
        .json({ error: "Order not found or no items in order" });
    }

    res.json(items);
  } catch (err) {
    console.error("Error fetching order items:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderById,
  deleteOrderById,
  updateOrderById,
  updateOrderStatusById,
  getAllItemsOfAnOrder,
};
