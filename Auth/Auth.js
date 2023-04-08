const User = require('../model/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const jwtSecret = process.env.JWT_SECRET;

exports.getAll = async (req, res, next) => {
  try {
    const data = await User.find().sort({ namn: 1 });
    res.json(data);
    console.log(req.body);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.register = async (req, res, next) => {
  const { username, password } = req.body;
  if (password.length < 6) {
    return res.status(400).json({ message: 'Password less than 6 characters' });
  }
  bcrypt.hash(password, 10).then(async (hash) => {
    await User.create({
      username,
      password: hash,
    })
      .then((user) => {
        const maxAge = 3 * 60 * 60;
        const token = jwt.sign(
          { id: user._id, username, role: user.role },
          jwtSecret,
          {
            expiresIn: maxAge, // 3hrs in sec
          }
        );
        res.cookie('jwt', token, {
          httpOnly: true,
          maxAge: maxAge * 1000, // 3hrs in ms
        });
        res.json({
          token,
          user,
        });
        res.status(201).json({
          message: 'User successfully created',
          user: user._id,
        });
      })
      .catch((error) =>
        res.status(400).json({
          message: 'User not successful created',
          error: error.message,
        })
      );
  });
};

exports.login = async (req, res, next) => {
  const { username, password } = req.body;
  // Check if username and password is provided
  if (!username || !password) {
    return res.status(400).json({
      message: 'Username or Password not present',
    });
  }
  try {
    const user = await User.findOne({ username });
    if (!user) {
      res.status(400).json({
        message: 'Login not successful',
        error: 'User not found',
      });
    } else {
      // comparing given password with hashed password
      bcrypt.compare(password, user.password).then(function (result) {
        if (result) {
          const maxAge = 3 * 60 * 60;
          const token = jwt.sign(
            { id: user._id, username, role: user.role },
            jwtSecret,
            {
              expiresIn: maxAge, // 3hrs in sec
            }
          );
          res.cookie('jwt', token, {
            httpOnly: true,
            maxAge: maxAge * 1000, // 3hrs in ms
          });
          res.json({
            token,
            user,
          });
          res.status(201).json({
            message: 'User successfully Logged in',
            user: user._id,
          });
        } else {
          res.status(400).json({ message: 'Login not succesful' });
        }
      });
    }
  } catch (error) {
    res.status(400).json({
      message: 'An error occurred',
      error: error.message,
    });
  }
};

exports.update = async (req, res, next) => {
  const { role, id } = req.body;
  // First - Verifying if role and id is presnt
  if (role && id) {
    // Second - Verifying if the value of role is admin
    if (role === 'admin') {
      // Finds the user with the id
      await User.findById(id)
        .then((user) => {
          // Third - Verifies the user is not an admin
          if (user.role !== 'admin') {
            user.role = role;
            user.save().then(() => {
              (err) => {
                //Monogodb error checker
                if (err) {
                  res
                    .status('400')
                    .json({ message: 'An error occurred', error: err.message });
                  process.exit(1);
                }
                res.status('201').json({ message: 'Update successful', user });
              };
            });
          } else {
            res.status(400).json({ message: 'User is already an Admin' });
          }
        })
        .catch((error) => {
          res
            .status(400)
            .json({ message: 'An error occurred', error: error.message });
        });
    }
  }
};

exports.deleteUser = async (req, res, next) => {
  const { id } = req.body;
  await User.findById(id)
    .then((user) => user.deleteOne())
    .then((user) =>
      res.status(201).json({ message: 'User successfully deleted', user })
    )
    .catch((error) =>
      res
        .status(400)
        .json({ message: 'An error occurred', error: error.message })
    );
};
