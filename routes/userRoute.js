const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const restrictTo = require('../middlewares/restrictMiddleware');

const {
 
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    getOrdersForUser,
    login
  
  } = require("../controllers/userController");

  // public routes 
  router.post('/login', login);
  router.post('/register', createUser);


router.get('/',protect,restrictTo(['admin']), getAllUsers);
router.get('/:id', protect,restrictTo(['user','vendor']), getUserById);
router.put('/:id', protect, restrictTo(['user','vendor']),updateUser);
router.delete('/:id',protect,restrictTo(['user','vendor']), deleteUser);
router.get('/:id/orders',protect,restrictTo(['user']), getOrdersForUser);
 

module.exports = router;    
