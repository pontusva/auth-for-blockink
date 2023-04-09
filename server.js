const express = require('express');
const app = express();
const connectDB = require('./db');
const PORT = process.env.PORT || 8080;
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { adminAuth, userAuth } = require('./middleware/auth.js');

const corsOptions = {
  origin: '*',
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
  Connection: 'keep-alive',
  'Access-Control-Request-Headers': 'Authentication',
};

app.use(express.json());
app.use(cookieParser());
app.use('/api/auth', cors(), require('./Auth/Route'));
app.use(cors(corsOptions));

app.get('/', (req, res) => {
  console.log('Cookies: ', req.cookies);

  // Cookies that have been signed
  console.log('Signed Cookies: ', req.signedCookies);
});
app.get('/admin', adminAuth, (req, res) => res.send('Admin Route'));
app.get('/basic', userAuth, (req, res) => res.send('User Route'));

// Handling Error
process.on('unhandledRejection', (err) => {
  console.log(`An error occurred: ${err.message}`);
  // server.close(() => process.exit(1));
});

connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server Connected to port ${PORT}`));
});
