const express = require("express");
const router = express.Router();
const {
  createOrder, getOrders, getOrderById, updateOrderById, deleteOrderById, updateOrderStatusById, getAllItemsOfAnOrder
} = require("../controllers/orderController");
const { verifyToken, isAdmin } = require('../middleware/auth');

// POST /api/order - Create a new customer
router.post("/",verifyToken,isAdmin, createOrder);
//get all orders
/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: APIs for managing orders
 * /orders:
 *   get:
 *     summary: List all orders
 *     tags: [Orders]
 *     responses:
 *       '200':
 *         description: A list of orders
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 * components:
 *   schemas:
 *     Order:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           format: int64
 *           description: Unique identifier for the order.
 *         customer_id:
 *           type: integer
 *           description: ID of the customer who placed the order.
 *         order_date:
 *           type: string
 *           format: date-time
 *           description: Date and time when the order was placed.
 *         status:
 *           type: string
 *           enum: [Pending, Fulfilled, Cancelled]
 *           description: Status of the order.
 *       required:
 *         - customer_id
 *         - status
 *         - order_date
 * 
 */
router.get("/", getOrders);
//get order by id
/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: APIs for managing orders
 * /orders:
 *   get:
 *     summary: List all orders
 *     tags: [Orders]
 *     responses:
 *       '200':
 *         description: A list of orders
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 * /orders/{id}:
 *   get:
 *     summary: Get order by ID
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           format: int64
 *         description: ID of the order to get
 *     responses:
 *       '200':
 *         description: Order found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 * components:
 *   schemas:
 *     Order:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           format: int64
 *           description: Unique identifier for the order.
 *         customer_id:
 *           type: integer
 *           description: ID of the customer who placed the order.
 *         order_date:
 *           type: string
 *           format: date-time
 *           description: Date and time when the order was placed.
 *         status:
 *           type: string
 *           enum: [Pending, Fulfilled, Cancelled]
 *           description: Status of the order.
 *       required:
 *         - customer_id
 *         - status
 *         - order_date
 */

router.get("/:order_id", getOrderById);
//update order by id
/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: APIs for managing orders
 * /orders:
 *   get:
 *     summary: List all orders
 *     tags: [Orders]
 *     responses:
 *       '200':
 *         description: A list of orders
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 * /orders/{id}:
 *   get:
 *     summary: Get order by ID
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           format: int64
 *         description: ID of the order to get
 *     responses:
 *       '200':
 *         description: Order found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *   put:
 *     summary: Update order by ID
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           format: int64
 *         description: ID of the order to update
 *       - in: requestBody
 *         name: body
 *         required: true
 *         description: Updated order object
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 customer_id:
 *                   type: integer
 *                   description: ID of the customer who placed the order.
 *                 order_date:
 *                   type: string
 *                   format: date-time
 *                   description: Date and time when the order was placed.
 *                 status:
 *                   type: string
 *                   enum: [Pending, Fulfilled, Cancelled]
 *                   description: Status of the order.
 *               required:
 *                 - customer_id
 *                 - status
 *                 - order_date
 *     responses:
 *       '200':
 *         description: Order updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 * components:
 *   schemas:
 *     Order:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           format: int64
 *           description: Unique identifier for the order.
 *         customer_id:
 *           type: integer
 *           description: ID of the customer who placed the order.
 *         order_date:
 *           type: string
 *           format: date-time
 *           description: Date and time when the order was placed.
 *         status:
 *           type: string
 *           enum: [Pending, Fulfilled, Cancelled]
 *           description: Status of the order.
 *       required:
 *         - customer_id
 *         - status
 *         - order_date
 */
router.put("/:order_id", updateOrderById  );
//delete order by id
/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: APIs for managing orders
 * /orders:
 *   get:
 *     summary: List all orders
 *     tags: [Orders]
 *     responses:
 *       '200':
 *         description: A list of orders
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 * /orders/{id}:
 *   get:
 *     summary: Get order by ID
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           format: int64
 *         description: ID of the order to get
 *     responses:
 *       '200':
 *         description: Order found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *   delete:
 *     summary: Delete order by ID
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           format: int64
 *         description: ID of the order to delete
 *     responses:
 *       '200':
 *         description: Order deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Order deleted successfully
 * components:
 *   schemas:
 *     Order:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           format: int64
 *           description: Unique identifier for the order.
 *         customer_id:
 *           type: integer
 *           description: ID of the customer who placed the order.
 *         order_date:
 *           type: string
 *           format: date-time
 *           description: Date and time when the order was placed.
 *         status:
 *           type: string
 *           enum: [Pending, Fulfilled, Cancelled]
 *           description: Status of the order.
 *       required:
 *         - customer_id
 *         - status
 *         - order_date
 *     OrderNotFound:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: Order not found
 */

router.delete("/:order_id", deleteOrderById);
// Update the status of an order
router.patch("/:order_id/:status", updateOrderStatusById);
//get all items of an order
router.get("/:order_id/items", getAllItemsOfAnOrder);




module.exports = router;
