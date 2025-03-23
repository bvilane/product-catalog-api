const Product = require('../models/Product');
const Category = require('../models/Category');

// @desc    Create a new product
// @route   POST /api/products
// @access  Public
const createProduct = async (req, res, next) => {
  try {
    // Check if categories exist
    if (req.body.categories && req.body.categories.length > 0) {
      const categoriesExist = await Category.countDocuments({
        _id: { $in: req.body.categories },
      });
      
      if (categoriesExist !== req.body.categories.length) {
        res.status(400);
        throw new Error('One or more categories not found');
      }
    }

    // Check if SKU already exists
    const skuExists = await Product.findOne({ sku: req.body.sku });
    if (skuExists) {
      res.status(400);
      throw new Error('Product with this SKU already exists');
    }

    // Check variant SKUs are unique
    if (req.body.variants && req.body.variants.length > 0) {
      const skus = req.body.variants.map((variant) => variant.sku);
      const uniqueSkus = new Set(skus);
      
      if (skus.length !== uniqueSkus.size) {
        res.status(400);
        throw new Error('Variant SKUs must be unique');
      }
      
      // Check if variant SKUs already exist in the database
      const variantSkuExists = await Product.findOne({
        'variants.sku': { $in: skus },
      });
      
      if (variantSkuExists) {
        res.status(400);
        throw new Error('One or more variant SKUs already exist');
      }
    }

    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all products with filtering, sorting and pagination
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res, next) => {
  try {
    // Build query based on request parameters
    const queryObj = { isActive: true };
    
    // Filter by category
    if (req.query.category) {
      queryObj.categories = req.query.category;
    }
    
    // Filter by price range
    if (req.query.minPrice || req.query.maxPrice) {
      queryObj.price = {};
      if (req.query.minPrice) queryObj.price.$gte = Number(req.query.minPrice);
      if (req.query.maxPrice) queryObj.price.$lte = Number(req.query.maxPrice);
    }
    
    // Filter by availability
    if (req.query.inStock === 'true') {
      queryObj.stockCount = { $gt: 0 };
    }
    
    // ENHANCED SEARCH FUNCTIONALITY
    // Search by keyword (name or description)
    if (req.query.keyword) {
      queryObj.$or = [
        { name: { $regex: req.query.keyword, $options: 'i' } },
        { description: { $regex: req.query.keyword, $options: 'i' } },
        // Search in attributes
        { "attributes.brand": { $regex: req.query.keyword, $options: 'i' } },
        { "attributes.color": { $regex: req.query.keyword, $options: 'i' } },
      ];
    }

    // Add filter by discount
    if (req.query.hasDiscount === 'true') {
      queryObj.discountPercentage = { $gt: 0 };
    }

    // Filter by price range with more flexibility
    if (req.query.priceRange) {
      const ranges = {
        'budget': { $lte: 100 },
        'mid-range': { $gt: 100, $lte: 500 },
        'premium': { $gt: 500 }
      };
      if (ranges[req.query.priceRange]) {
        queryObj.price = ranges[req.query.priceRange];
      }
    }

    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Sorting
    let sortBy = {};
    if (req.query.sortBy) {
      const parts = req.query.sortBy.split(':');
      sortBy[parts[0]] = parts[1] === 'desc' ? -1 : 1;
    } else {
      sortBy = { createdAt: -1 }; // Default: newest first
    }

    // Execute query
    const products = await Product.find(queryObj)
      .populate('categories', 'name')
      .sort(sortBy)
      .skip(skip)
      .limit(limit);

    // Get total count for pagination
    const total = await Product.countDocuments(queryObj);

    res.json({
      products,
      page,
      pages: Math.ceil(total / limit),
      total,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get a single product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      'categories',
      'name description'
    );

    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }

    res.json(product);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Public
const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }

    // Check if updated SKU already exists (if changing SKU)
    if (req.body.sku && req.body.sku !== product.sku) {
      const skuExists = await Product.findOne({ sku: req.body.sku });
      if (skuExists) {
        res.status(400);
        throw new Error('Product with this SKU already exists');
      }
    }

    // Check if categories exist
    if (req.body.categories && req.body.categories.length > 0) {
      const categoriesExist = await Category.countDocuments({
        _id: { $in: req.body.categories },
      });
      
      if (categoriesExist !== req.body.categories.length) {
        res.status(400);
        throw new Error('One or more categories not found');
      }
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json(updatedProduct);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Public
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }

    await product.deleteOne();
    res.json({ message: 'Product removed' });
  } catch (error) {
    next(error);
  }
};

// @desc    Update product inventory
// @route   PATCH /api/products/:id/inventory
// @access  Public
const updateInventory = async (req, res, next) => {
  try {
    const { stockCount } = req.body;
    
    if (stockCount === undefined || stockCount < 0) {
      res.status(400);
      throw new Error('Valid stock count is required');
    }

    const product = await Product.findById(req.params.id);

    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }

    product.stockCount = stockCount;
    await product.save();

    res.json({ 
      id: product._id,
      name: product.name, 
      stockCount: product.stockCount 
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get low stock products (for reporting)
// @route   GET /api/products/low-stock
// @access  Public
const getLowStockProducts = async (req, res, next) => {
  try {
    const threshold = parseInt(req.query.threshold) || 5;

    const products = await Product.find({ stockCount: { $lte: threshold } })
      .select('name sku stockCount price')
      .sort({ stockCount: 1 });

    res.json(products);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  updateInventory,
  getLowStockProducts,
};