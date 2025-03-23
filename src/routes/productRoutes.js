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

const router = express.Router();

router.route('/')
  .get(getProducts)
  .post(validateProduct, createProduct);

router.route('/low-stock')
  .get(getLowStockProducts);

router.route('/:id')
  .get(getProductById)
  .put(validateProduct, updateProduct)
  .delete(deleteProduct);

router.route('/:id/inventory')
  .patch(updateInventory);

module.exports = router;