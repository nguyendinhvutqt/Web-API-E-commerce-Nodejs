const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authUserMiddleware, authAdminMiddleware } = require('../middlewares/authMiddleware');

router.get('/users', authAdminMiddleware, userController.getUsers);
router.get('/profile/:id', authUserMiddleware, userController.profile);
router.post('/sign-in', userController.signIn);
router.post('/sign-up', userController.signUp);
router.post('/logout', userController.logout);
router.post('/refresh-token', userController.refreshTokenUser);
router.put("/change-profile/:id", authUserMiddleware, userController.updateProfile);
router.put("/change-password/:id", authUserMiddleware, userController.changePassword);
router.delete('/delete-user/:id', authUserMiddleware, userController.deleteUser);

module.exports = router