const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController');

// POST endpoint to create a new item
router.post('/items', itemController.createItem);

module.exports = router;
