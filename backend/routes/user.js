// IMPORTED PACKAGES
const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');

// ROUTES
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

// EXPORT ROUTER
module.exports = router;