const express = require('express');
const router = express.Router();
const cors = require('cors');
const { getAll, login, register, update, deleteUser } = require('./Auth');
const { adminAuth } = require('../middleware/auth');

var corsOptions = {
  origin: true,
  methods: ['POST', 'GET'],
  optionsSuccessStatus: 200,
};

router.route('/getAll').get(cors(corsOptions), getAll);

router.route('/register').post(register);

router.route('/login').post(login);

router.route('/update').put(adminAuth, update);

router.route('/deleteUser').delete(adminAuth, deleteUser);

module.exports = router;
