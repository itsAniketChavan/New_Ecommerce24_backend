const express = require('express');
const connectDatabase = require('./config/db');
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
require("dotenv").config();
 

// Load allowed origins from environment variables
const allowedOrigins = process.env.CORS_ALLOWED_ORIGINS ? process.env.CORS_ALLOWED_ORIGINS.split(',') : [];

const corsOptions = {
  origin: function(origin, callback) {
    if (allowedOrigins.includes(origin) || !origin) {
      // Allow requests with no origin, like mobile apps or curl requests
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
};

 

const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors(corsOptions));

// Connect to the database
connectDatabase();

// Import routes
const user = require('./routes/userRoute');
const order = require('./routes/orderRoute');
const product = require('./routes/productRoute');

// Use routes
app.use('/api/products', product);
app.use('/api/users', user);
app.use('/api/orders', order);

// Default route
app.get('/', (req, res) => {
  res.json('Hello, world!');
});

// Start the server
app.listen(process.env.PORT, () => {
  console.log(`Server is running on Port : ${process.env.PORT}`);
});
