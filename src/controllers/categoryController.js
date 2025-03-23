const Category = require('../models/Category');
const Product = require('../models/Product');

// @desc    Create a new category
// @route   POST /api/categories
// @access  Public
const createCategory = async (req, res, next) => {
  try {
    // Check if parent category exists if provided
    if (req.body.parent) {
      const parentExists = await Category.findById(req.body.parent);
      if (!parentExists) {
        res.status(400);
        throw new Error('Parent category not found');
      }
    }

    // Check if category name already exists
    const nameExists = await Category.findOne({ name: req.body.name });
    if (nameExists) {
      res.status(400);
      throw new Error('Category with this name already exists');
    }

    const category = await Category.create(req.body);
    res.status(201).json(category);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({})
      .populate('parent', 'name')
      .sort({ name: 1 });
    res.json(categories);
  } catch (error) {
    next(error);
  }
};

// @desc    Get a single category by ID
// @route   GET /api/categories/:id
// @access  Public
const getCategoryById = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id).populate(
      'parent',
      'name'
    );

    if (!category) {
      res.status(404);
      throw new Error('Category not found');
    }

    res.json(category);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a category
// @route   PUT /api/categories/:id
// @access  Public
const updateCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      res.status(404);
      throw new Error('Category not found');
    }

    // Check if name already exists (if changing name)
    if (req.body.name && req.body.name !== category.name) {
      const nameExists = await Category.findOne({ name: req.body.name });
      if (nameExists) {
        res.status(400);
        throw new Error('Category with this name already exists');
      }
    }

    // Check if parent exists if provided
    if (req.body.parent) {
      // Prevent setting itself as parent
      if (req.body.parent === req.params.id) {
        res.status(400);
        throw new Error('Category cannot be its own parent');
      }

      const parentExists = await Category.findById(req.body.parent);
      if (!parentExists) {
        res.status(400);
        throw new Error('Parent category not found');
      }
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json(updatedCategory);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a category
// @route   DELETE /api/categories/:id
// @access  Public
const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      res.status(404);
      throw new Error('Category not found');
    }

    // Check if category is used by any products
    const productsWithCategory = await Product.countDocuments({
      categories: req.params.id,
    });

    if (productsWithCategory > 0) {
      res.status(400);
      throw new Error(
        `Cannot delete category. It is used by ${productsWithCategory} products.`
      );
    }

    // Check if category is a parent of other categories
    const childCategories = await Category.countDocuments({
      parent: req.params.id,
    });

    if (childCategories > 0) {
      res.status(400);
      throw new Error(
        `Cannot delete category. It is a parent to ${childCategories} categories.`
      );
    }

    await category.deleteOne();
    res.json({ message: 'Category removed' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get products by category
// @route   GET /api/categories/:id/products
// @access  Public
const getCategoryProducts = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      res.status(404);
      throw new Error('Category not found');
    }

    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const products = await Product.find({ categories: req.params.id })
      .select('name price description stockCount finalPrice')
      .skip(skip)
      .limit(limit);

    const total = await Product.countDocuments({ categories: req.params.id });

    res.json({
      category: {
        id: category._id,
        name: category.name,
      },
      products,
      page,
      pages: Math.ceil(total / limit),
      total,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
  getCategoryProducts,
};