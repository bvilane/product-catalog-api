const express = require('express');
const {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
  getCategoryProducts,
} = require('../controllers/categoryController');
const { validateCategory } = require('../middleware/validationMiddleware');
const { mediumCache } = require('../middleware/cacheMiddleware');

const router = express.Router();

router.route('/')
  .get(mediumCache, getCategories)
  .post(validateCategory, createCategory);

router.route('/:id')
  .get(mediumCache, getCategoryById)
  .put(validateCategory, updateCategory)
  .delete(deleteCategory);

router.route('/:id/products')
  .get(mediumCache, getCategoryProducts);

module.exports = router;