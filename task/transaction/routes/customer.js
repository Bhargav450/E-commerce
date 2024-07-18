const express = require("express");
const router = express.Router();
const {
  createCustomer,
  getCustomers,
  getCustomerById,
  updateCustomerById,
  deleteCustomerById    
} = require("../controllers/customerController");

// POST /customers - Create a new customer
router.post("/", createCustomer);
//GET /customers - get all customers
router.get("/", getCustomers);
//GET Customer by id
router.get("/:customer_id", getCustomerById);
//UDPATE Customer by id
router.put("/:customer_id", updateCustomerById);
//DELETE Customer by id
router.delete("/:customer_id", deleteCustomerById);


module.exports = router;
