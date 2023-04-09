const express = require("express");
const router = express.Router();
const productController = require('../controllers/productController');
const { authAdminMiddleware } = require('../middlewares/authMiddleware')

router.get('/products', productController.getProducts);
router.get('/product-details/:id', productController.getProduct);
router.get('/category-products/:id', productController.getProductByCategory);
router.post('/create-product', authAdminMiddleware, productController.createProduct);
router.put('/update-product/:id', authAdminMiddleware, productController.updateProduct);
router.delete('/delete-product/:id', authAdminMiddleware, productController.deleteProduct);

module.exports = router