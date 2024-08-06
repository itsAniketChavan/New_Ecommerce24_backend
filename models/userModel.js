const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require('bcrypt');
 

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Enter Your Name"],
    maxLength: [30, "Name cannot exceed 30 characters"],
    minLength: [4, "Name should have more than 4 characters"],
  },
  email: {
    type: String,
    required: [true, "Please Enter Your Email"],
    unique: true,
    validate: [validator.isEmail, "Please Enter a valid Email"],
  },
  password: {
    type: String,
    required: [true, "Please Enter Your Password"],
    minLength: [4, "Password should be greater than 4 characters"],
    select: false,
  },
  avatar: {
    public_id: {
      type: String,
      required: true,
      default:"default"
    },
    url: {
      type: String,
      required: true,
      default:"default"
    },
  },
  phone: {
    type: String,
    
  },
  address: {
    type: String,
  },
  role: {
    type: String,
    default: "user",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
 
});userSchema.pre('save', function (next) {
  const user = this;

  // Only hash the password if it's new or modified
  if (!user.isModified('password')) {
    return next();
  }

  // Generate a salt and hash the password
  bcrypt.genSalt(10, (err, salt) => {
    if (err) return next(err);

    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) return next(err);

      user.password = hash; // Save the hashed password
      next(); // Proceed to save the user
    });
  });
});

 

module.exports = mongoose.model("User", userSchema);
