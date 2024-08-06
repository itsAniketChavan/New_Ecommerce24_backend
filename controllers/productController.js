
const Product = require("../models/productModel");
const { uploadImage, destroyImage } = require("../utils/cloudinary");
 
 

// Create a new product

exports.createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      ratings,
      images,
      category,
      stock,
      numOfReviews,
      reviews,
      user,
    } = req.body;

    // Upload images to Cloudinary and get their URLs
    const imageUploads = [];
    for (const imageBase64 of images) {
      const uploadedImage = await uploadImage(imageBase64);
      imageUploads.push({
        public_id: uploadedImage.public_id,
        url: uploadedImage.url,
      });
    }

    // Create a new product
    const product = new Product({
      name,
      description,
      price,
      ratings,
      images: imageUploads,
      category,
      stock,
      numOfReviews,
      reviews,
      user,
    });

    // Save the product to the database
    await product.save();

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update a product by ID
exports.updateProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const { name, description, price, ratings, images, category, stock, numOfReviews, reviews } = req.body;

    // Find the product by ID
    let product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
 
    // Update product fields individually
    if (name !== undefined) product.name = name;
    if (description !== undefined) product.description = description;
    if (price !== undefined) product.price = price;
    if (ratings !== undefined) product.ratings = ratings;
    if (images !== undefined) product.images = images;
    if (category !== undefined) product.category = category;
    if (numOfReviews !== undefined) product.numOfReviews = numOfReviews;
    if (reviews !== undefined) product.reviews = reviews;
    if (stock !== undefined) product.stock = stock;

    
    // Save the updated product
    await product.save();

    res.status(200).json({ success: true, message: "Product updated successfully", product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// Delete a product by ID
exports.deleteProduct = async (req, res) => {
  try {
    const   id   = req.params.id;

    // Find the product by ID
    let product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    // Delete the product
    await Product.findByIdAndDelete(id);

    res.status(200).json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
// Get a product by ID
exports.getProductById = async (req, res) => {
    try {
      const id  = req.params.id;
  
      // Find the product by ID
      let product = await Product.findById(id);
      if (!product) {
        return res.status(404).json({ success: false, message: "Product not found" });
      }
  
      res.status(200).json({ success: true, product });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  // Get all products
exports.getAllProducts = async (req, res) => {
    try {
      // Retrieve all products from the database
      let products = await Product.find();
      
      res.status(200).json({ success: true, products });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  

  
  