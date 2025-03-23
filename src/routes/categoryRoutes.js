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

const router = express.Router();

router.route('/')
  .get(getCategories)
  .post(validateCategory, createCategory);

router.route('/:id')
  .get(getCategoryById)
  .put(validateCategory, updateCategory)
  .delete(deleteCategory);

router.route('/:id/products')
  .get(getCategoryProducts);

module.exports = router;