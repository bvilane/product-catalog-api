const request = require('supertest');
const mongoose = require('mongoose');
const { app, server } = require('../src/server');
const Category = require('../src/models/Category');
const Product = require('../src/models/Product');
const { connectTestDB, disconnectTestDB, clearTestDB } = require('../src/config/testDb');

// Sample category data for testing
const sampleCategory = {
  name: 'Test Category',
  description: 'This is a test category',
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

describe('Category API Tests', () => {
  // Create Category Test
  it('should create a new category', async () => {
    const res = await request(app)
      .post('/api/categories')
      .send(sampleCategory);

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('_id');
    expect(res.body.name).toEqual(sampleCategory.name);
  });

  // Create Category with Invalid Data Test
  it('should not create category with invalid data', async () => {
    const invalidCategory = {
      name: 'Invalid Category',
      // missing description
    };

    const res = await request(app)
      .post('/api/categories')
      .send(invalidCategory);

    expect(res.statusCode).toEqual(400);
  });

  // Get Categories Test
  it('should get all categories', async () => {
    // Create a couple of categories first
    await Category.create(sampleCategory);
    await Category.create({
      ...sampleCategory,
      name: 'Another Category',
    });

    const res = await request(app).get('/api/categories');

    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array);
    expect(res.body.length).toEqual(2);
  });

  // Get Single Category Test
  it('should get a single category by id', async () => {
    const category = await Category.create(sampleCategory);

    const res = await request(app).get(`/api/categories/${category._id}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.name).toEqual(sampleCategory.name);
  });

  // Update Category Test
  it('should update a category', async () => {
    const category = await Category.create(sampleCategory);

    const updatedData = {
      name: 'Updated Category',
      description: 'Updated description',
    };

    const res = await request(app)
      .put(`/api/categories/${category._id}`)
      .send(updatedData);

    expect(res.statusCode).toEqual(200);
    expect(res.body.name).toEqual(updatedData.name);
    expect(res.body.description).toEqual(updatedData.description);
  });

  // Delete Category Test
  it('should delete a category', async () => {
    const category = await Category.create(sampleCategory);

    const res = await request(app).delete(`/api/categories/${category._id}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toContain('removed');

    // Verify category is deleted
    const deletedCategory = await Category.findById(category._id);
    expect(deletedCategory).toBeNull();
  });

  // Cannot Delete Category if Used by Products Test
  it('should not delete category used by products', async () => {
    const category = await Category.create(sampleCategory);
    
    // Create a product that uses this category
    await Product.create({
      name: 'Product using category',
      description: 'This product uses the test category',
      sku: 'PROD123',
      price: 19.99,
      stockCount: 5,
      categories: [category._id],
    });

    const res = await request(app).delete(`/api/categories/${category._id}`);

    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toContain('Cannot delete category');
  });

  // Get Products by Category Test
  it('should get all products in a category', async () => {
    const category = await Category.create(sampleCategory);
    
    // Create products in this category
    await Product.create({
      name: 'Product 1',
      description: 'First product in category',
      sku: 'CAT1',
      price: 19.99,
      stockCount: 5,
      categories: [category._id],
    });
    
    await Product.create({
      name: 'Product 2',
      description: 'Second product in category',
      sku: 'CAT2',
      price: 29.99,
      stockCount: 10,
      categories: [category._id],
    });

    const res = await request(app).get(`/api/categories/${category._id}/products`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.products).toBeInstanceOf(Array);
    expect(res.body.products.length).toEqual(2);
    expect(res.body.category.name).toEqual(sampleCategory.name);
  });

  // Parent-Child Category Relationship Test
  it('should create and recognize parent-child relationships', async () => {
    // Create parent category
    const parentCategory = await Category.create(sampleCategory);
    
    // Create child category
    const childCategory = await Category.create({
      name: 'Child Category',
      description: 'This is a child category',
      parent: parentCategory._id
    });

    // Verify the relationship
    const res = await request(app).get(`/api/categories/${childCategory._id}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.parent).toBeDefined();
    expect(res.body.parent.name).toEqual(parentCategory.name);
  });
});