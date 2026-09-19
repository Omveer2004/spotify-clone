const express = require('express');
const cookieParser = require('cookie-parser');
const authController = require("../controllers/auth.controllers");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();
router.post('/register', authController.registerUser);
router.post('/login', authController.loginUser);
router.post('/logout', authController.logoutUser);
router.get('/me', authMiddleware.authUser, authController.getMe);

module.exports = router;
