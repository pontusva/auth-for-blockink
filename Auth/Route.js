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

router.route('/getAll').get(cors(corsOptions), adminAuth, getAll);

router.route('/register').post(cors(corsOptions), register);

router.route('/login').post(cors(corsOptions), login);

router.route('/update').put(adminAuth, update);

router.route('/deleteUser').delete(adminAuth, deleteUser);

module.exports = router;
