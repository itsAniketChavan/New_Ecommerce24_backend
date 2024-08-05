const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const restrictTo = require('../middlewares/restrictMiddleware');


const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');


router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.post('/',protect,restrictTo(['vendor']), createProduct);
router.put('/:id',protect,restrictTo(['vendor']), updateProduct);
router.delete('/:id',protect,restrictTo(['vendor']), deleteProduct);
 

module.exports = router;
