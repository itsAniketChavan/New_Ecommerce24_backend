 
 const Order = require("../models/orderModel");
 // Create a new order
exports.createOrder = async (req, res) => {
    try {
      const order = new Order(req.body);
  
      // Save the order
      await order.save();
  
      res.status(201).json({ success: true, order });
    } catch (error) {
      
      res.status(500).json({ message: error.message });
    }
  };
  
 

  
  // Delete an order
  exports.deleteOrder = async (req, res) => {
    try {
      const  id  = req.params.id;
  
      // Find the order by ID and delete it
      const order = await Order.findByIdAndDelete(id);
  
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }
  
      res.status(200).json({ success: true, message: 'Order deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  // Find an order by ID
  exports.getOrderById = async (req, res) => {
    try {
      const  id  = req.params.id;
  
      // Find the order by ID
      const order = await Order.findById(id).populate('user').populate('orderItems.product');
  
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }
  
      res.status(200).json({ success: true, order });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
   

  exports.getAllOrders = async (req, res) => {
    try {
      // Find all orders and populate related fields
      const orders = await Order.find().populate('user').populate('orderItems.product');
  
      if (orders.length === 0) {
        return res.status(404).json({ message: 'No orders found' });
      }
  
      res.status(200).json({ success: true, orders });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  exports.processOrder = async (req, res) => {
    try {
      const id = req.params.id;
  
      // Find the order by ID and populate the related fields
      const order = await Order.findById(id).populate('orderItems.product');
  
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }
  
      // Check and update the order status
      if (order.orderStatus === 'processing') {

        order.orderStatus = 'shipped';
        // Decrease the quantity of each product in the order
      for (const item of order.orderItems) {
        const product = item.product;
        if (product) { // Ensure product exists
          product.stock -= item.quantity;
          await product.save(); // Save each updated product
        }
      }
   
      } else if (order.orderStatus === 'shipped') {
        order.orderStatus = 'delivered';
      } else {
        return res.status(400).json({ message: 'Order cannot be processed further' });
      }
  
      // Save the updated order status
      await order.save({ validateModifiedOnly: true });
  
      res.status(200).json({ success: true, message:"Order Processed Successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  