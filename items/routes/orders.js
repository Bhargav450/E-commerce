const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { verifyToken, isAdmin } = require('../midddlewares/auth');




  


// POST endpoint to create a new item
router.get('/orders',verifyToken,isAdmin, orderController.getOrder);

router.get('/orders/filter',verifyToken,isAdmin, orderController.getOrderFilter);
router.post('/orders',verifyToken,orderController.insertOrder);

router.patch('/orders',verifyToken,orderController.udpateOrder);

module.exports = router;
