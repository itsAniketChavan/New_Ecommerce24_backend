const User = require("../models/userModel");
const Order = require("../models/orderModel");

const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");
const { uploadImage, destroyImage } = require("../utils/cloudinary");

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email and include the password for comparison
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({ message: "User Not Found" });
    }

    // Compare the provided password with the stored hashed password
    bcrypt.compare(password, user.password, (err, result) => {
      if (err) {
        return res.status(500).json({ message: "Server error" });
      }

      if (result) {
        const token = generateToken(user._id);

        // Remove the password from the user object before sending the response
        const { password: _, ...userWithoutPassword } = user.toObject();

        res.status(200).json({
          success: true,
          message: "Login successful",
          user: userWithoutPassword,
          token,
        });
      } else {
        res.status(401).json({ message: "Invalid email or password" });
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new user
exports.createUser = async (req, res) => {
  try {
    const { name, email, password, avatar } = req.body;

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }
    let avatar_url = "";
    let public_id = "";
    if (avatar) {
      const result = await uploadImage(avatar);
      if (result) {
        avatar_url = result.url;
        public_id = result.public_id;
      }
    }

    user = new User({
      name,
      email,
      password,
      avatar: {
        public_id: public_id,
        url: avatar_url,
      },
    });

    await user.save();

    user = await User.findById(user._id).select("-password");

    res
      .status(201)
      .json({ success: true, message: "User created successfully", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const id = req.params.id;
    const { name, email, password, avatarPath } = req.body;

    // Find the user by ID
    let user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the new email is already in use by another user
    if (email && email !== user.email) {
      let existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "Email already in use" });
      }
      user.email = email;
    }

    
    if (avatarPath) {
      const destroyResult = await destroyImage(user.avatar.public_id);
      
      if (!destroyResult) {
        return res.status(500).json({ message: "Error destroying old avatar" });
      }

      // Upload the new avatar
      const uploadResult = await uploadImage(avatarPath);
      if (uploadResult) {
        user.avatar = {
          public_id: uploadResult.public_id,
          url: uploadResult.url,
        };
      } else {
        return res.status(500).json({ message: "Error uploading new avatar" });
      }
    }

    // Update user fields
    if (name) user.name = name;
    if (password) user.password = password; // password will be hashed by the schema pre-save hook

    await user.save();

    res
      .status(200)
      .json({ success: true, message: "User updated successfully", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const id = req.params.id;

    // Find the user by ID
    let user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await User.findByIdAndDelete(id);

    res
      .status(200)
      .json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const id = req.params.id;

    let user = await User.findById(id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    let users = await User.find().select("-password"); // Adjust the select part to exclude any sensitive fields if necessary

    if (users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }

    res.status(200).json({ success: true, users });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getOrdersForUser = async (req, res) => {
  try {
    const id = req.params.id;

    // Find the user by ID
    const user = await User.findById(id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    console;
    // Find all orders for the user
    const orders = await Order.find({ user: id }).populate(
      "orderItems.product"
    );
    //
    //     if (orders.length === 0) {
    //       return res.status(404).json({ message: "No orders found for this user" });
    //     }

    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
