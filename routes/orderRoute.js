const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const restrictTo = require('../middlewares/restrictMiddleware');



const {
    getAllOrders,
    getOrderById,
    createOrder,
    deleteOrder,
    processOrder
} = require('../controllers/orderController');


router.get('/',protect,restrictTo(['vendor']),  getAllOrders);
router.get('/:id',protect,restrictTo(['vendor']),  getOrderById);
router.post('/:id',protect, createOrder);
router.delete('/:id',protect,restrictTo(['vendor']),  deleteOrder);
router.put('/:id/process',protect,restrictTo(['vendor']),  processOrder);

module.exports = router;
