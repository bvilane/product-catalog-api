const express = require('express');
const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  updateInventory,
  getLowStockProducts,
} = require('../controllers/productController');
const { validateProduct } = require('../middleware/validationMiddleware');
const { shortCache } = require('../middleware/cacheMiddleware');

const router = express.Router();

// Apply caching to GET requests
router.route('/')
  .get(shortCache, getProducts)
  .post(validateProduct, createProduct);

router.route('/low-stock')
  .get(shortCache, getLowStockProducts);

router.route('/:id')
  .get(shortCache, getProductById)
  .put(validateProduct, updateProduct)
  .delete(deleteProduct);

router.route('/:id/inventory')
  .patch(updateInventory);

module.exports = router;