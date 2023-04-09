const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { authAdminMiddleware, authUserMiddleware } = require('../middlewares/authMiddleware')

router.get('/orders', authAdminMiddleware, orderController.getAllOrder);
router.get('/order-details/:id', authUserMiddleware, orderController.getOrderDetails);
router.get('/order-details-user/:id', authUserMiddleware, orderController.getOrderDetailsUser);
router.post('/create-order', authUserMiddleware, orderController.createOrder);
router.delete('/delete-order/:id', authUserMiddleware, orderController.deleteOrder);
router.put('/deliveredOrder/:id', authAdminMiddleware, orderController.deliveredOrder);

module.exports = router