const express=require('express');
const router=express.Router();
const productController=require('../controllers/productController');
const {verifyToken,isAdmin}=require("../midddlewares/auth");


router.post('/products',verifyToken,isAdmin,productController.insertProduct);
router.patch('/products',verifyToken,isAdmin,productController.updateProduct);
router.get('/products',verifyToken,productController.getProducts);

module.exports = router;