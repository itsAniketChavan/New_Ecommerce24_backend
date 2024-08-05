const mongoose = require('mongoose');
const dotenv = require('dotenv');
 
const connectDatabase = async () => {
  try {
    const data = await mongoose.connect(process.env.DB_URI);
    console.log(`Mongodb connected with server: ${data.connection.host}`);
  } catch (error) {
    console.error('Database connection failed:', error);
     
  }
};

module.exports = connectDatabase;
