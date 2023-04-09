const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController')
const { authAdminMiddleware, authUserMiddleware } = require('../middlewares/authMiddleware')

router.get('/categories', categoryController.getCategories);
router.post('/create-category', authUserMiddleware, categoryController.createCategory);
router.put('/update-category', authAdminMiddleware, categoryController.updateCategory);
router.delete('/delete-category', authAdminMiddleware, categoryController.deleteCategory);

module.exports = router;