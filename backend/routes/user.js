const express = require('express');
const UserController = require('../controller/user');

const router = express.Router();

//for signup
router.post('/signup', UserController.createUser);

//for logins
router.post('/login', UserController.userLogin);

module.exports = router;