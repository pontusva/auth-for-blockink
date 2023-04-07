const Mongoose = require('mongoose');
require('dotenv').config();
const mongoUri = process.env.ATLAS_URI;
const connectDB = async () => {
  await Mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log('MongoDB Connected');
};
module.exports = connectDB;
