const express = require('express');
const app = express();
const connectDB = require('./db');
const PORT = process.env.PORT || 3000;
const cookieParser = require('cookie-parser');
const { adminAuth, userAuth } = require('./middleware/auth.js');

app.get('/admin', adminAuth, (req, res) => res.send('Admin Route'));
app.get('/basic', userAuth, (req, res) => res.send('User Route'));

app.use(express.json());
app.use(cookieParser());
app.use('/api/auth', require('./Auth/Route'));

// Handling Error
process.on('unhandledRejection', (err) => {
  console.log(`An error occurred: ${err.message}`);
  server.close(() => process.exit(1));
});

connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server Connected to port ${PORT}`));
});
