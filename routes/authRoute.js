const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// POST endpoint to create a new user
router.post('/register',authController.registration);
router.get('/register',authController.getUsers);
router.post('/login',authController.login)

module.exports = router;
