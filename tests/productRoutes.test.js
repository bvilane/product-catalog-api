const request = require('supertest');
const mongoose = require('mongoose');
const { app, server } = require('../src/server');
const Product = require('../src/models/Product');
const Category = require('../src/models/Category');
const { connectTestDB, disconnectTestDB, clearTestDB } = require('../src/config/testDb');

// Sample product data for testing
const sampleProduct = {
  name: 'Test Product',
  description: 'This is a test product',
  sku: 'TEST123',
  price: 29.99,
  stockCount: 10,
  categories: [],
};

// Connect to test database before tests
beforeAll(async () => {
  await connectTestDB();
});

// Clear database between tests
beforeEach(async () => {
  await clearTestDB();
});

// Disconnect from test database after tests
afterAll(async () => {
    await disconnectTestDB();
    if (server && server.close) {
      server.close();
    }
  }, 10000);

describe('Product API Tests', () => {
  // Create Product Test
  it('should create a new product', async () => {
    const res = await request(app)
      .post('/api/products')
      .send(sampleProduct);

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('_id');
    expect(res.body.name).toEqual(sampleProduct.name);
    expect(res.body.price).toEqual(sampleProduct.price);
  });

  // Create Product with Invalid Data Test
  it('should not create product with invalid data', async () => {
    const invalidProduct = {
      name: 'Invalid Product',
      // missing required fields
    };

    const res = await request(app)
      .post('/api/products')
      .send(invalidProduct);

    expect(res.statusCode).toEqual(400);
  });

  // Get Products Test
  it('should get all products', async () => {
    // Create a couple of products first
    await Product.create(sampleProduct);
    await Product.create({
      ...sampleProduct,
      name: 'Another Product',
      sku: 'TEST456',
    });

    const res = await request(app).get('/api/products');

    expect(res.statusCode).toEqual(200);
    expect(res.body.products).toBeInstanceOf(Array);
    expect(res.body.products.length).toEqual(2);
  });

  // Get Single Product Test
  it('should get a single product by id', async () => {
    const product = await Product.create(sampleProduct);

    const res = await request(app).get(`/api/products/${product._id}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.name).toEqual(sampleProduct.name);
  });

  // Update Product Test
  it('should update a product', async () => {
    const product = await Product.create(sampleProduct);

    const updatedData = {
      name: 'Updated Name',
      price: 39.99,
    };

    const res = await request(app)
      .put(`/api/products/${product._id}`)
      .send({...sampleProduct, ...updatedData});

    expect(res.statusCode).toEqual(200);
    expect(res.body.name).toEqual(updatedData.name);
    expect(res.body.price).toEqual(updatedData.price);
  });

  // Delete Product Test
  it('should delete a product', async () => {
    const product = await Product.create(sampleProduct);

    const res = await request(app).delete(`/api/products/${product._id}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toContain('removed');

    // Verify product is deleted
    const deletedProduct = await Product.findById(product._id);
    expect(deletedProduct).toBeNull();
  });

  // Search Products Test
  it('should search products by keyword', async () => {
    // Create products with different keywords
    await Product.create(sampleProduct);
    await Product.create({
      ...sampleProduct,
      name: 'Smartphone',
      description: 'Latest technology',
      sku: 'PHONE123',
    });

    const res = await request(app).get('/api/products?keyword=smart');

    expect(res.statusCode).toEqual(200);
    expect(res.body.products).toBeInstanceOf(Array);
    expect(res.body.products.length).toEqual(1);
    expect(res.body.products[0].name).toEqual('Smartphone');
  });

  // Filter Products by Category Test
  it('should filter products by category', async () => {
    // Create a category first
    const category = await Category.create({
      name: 'Electronics',
      description: 'Electronic products',
    });

    // Create products with and without the category
    await Product.create(sampleProduct);
    await Product.create({
      ...sampleProduct,
      name: 'Laptop',
      sku: 'LAPTOP123',
      categories: [category._id],
    });

    const res = await request(app).get(`/api/products?category=${category._id}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.products).toBeInstanceOf(Array);
    expect(res.body.products.length).toEqual(1);
    expect(res.body.products[0].name).toEqual('Laptop');
  });

  // Update Inventory Test
  it('should update product inventory', async () => {
    const product = await Product.create(sampleProduct);
    const newStockCount = 25;

    const res = await request(app)
      .patch(`/api/products/${product._id}/inventory`)
      .send({ stockCount: newStockCount });

    expect(res.statusCode).toEqual(200);
    expect(res.body.stockCount).toEqual(newStockCount);
  });

  // Low Stock Report Test
  it('should get low stock products report', async () => {
    // Create products with varying stock levels
    await Product.create(sampleProduct); // 10 in stock
    await Product.create({
      ...sampleProduct,
      name: 'Low Stock Item',
      sku: 'LOW123',
      stockCount: 3,
    });
    await Product.create({
      ...sampleProduct,
      name: 'Out of Stock Item',
      sku: 'OUT123',
      stockCount: 0,
    });

    const res = await request(app).get('/api/products/low-stock?threshold=5');

    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array);
    expect(res.body.length).toEqual(2);
    expect(res.body.some(p => p.name === 'Low Stock Item')).toBeTruthy();
    expect(res.body.some(p => p.name === 'Out of Stock Item')).toBeTruthy();
  });
});