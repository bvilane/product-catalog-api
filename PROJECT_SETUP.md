# Product Catalog API - Setup Guide

This document provides step-by-step instructions to set up, run, and test the Product Catalog API project.

## Prerequisites

Make sure you have the following installed on your system:

- Node.js (v14 or higher)
- npm (usually comes with Node.js)
- MongoDB (local installation or access to MongoDB Atlas)
- Git

## Project Setup

### 1. Clone the Repository

```bash
# Clone the repository
git clone https://github.com/bvilane/product-catalog-api.git

# Navigate to the project directory
cd product-catalog-api
```

### 2. Install Dependencies

```bash
# Install project dependencies
npm install
```

### 3. Environment Configuration

Create a `.env` file in the root directory with the following variables:

```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/product-catalog
NODE_ENV=development
JWT_SECRET=your_jwt_secret_key
```

If you're using MongoDB Atlas, replace the `MONGODB_URI` with your connection string.

### 4. Database Setup

Make sure MongoDB is running on your local machine or you have access to MongoDB Atlas.

For local MongoDB:
```bash
# Start MongoDB (commands may vary based on your OS and installation method)
# For Ubuntu/Debian
sudo service mongod start

# For macOS (if installed with Homebrew)
brew services start mongodb-community

# For Windows (from Command Prompt as Administrator)
net start MongoDB
```

### 5. Start the Server

```bash
# Start the development server with auto-restart on file changes
npm run dev

# Or start the server in production mode
npm start
```

You should see output similar to:
```
Server running in development mode on port 3000
MongoDB Connected: localhost
```

## Testing the API

### 1. Running Automated Tests

```bash
# Run the automated test suite
npm test
```

### 2. Manual Testing with Postman

1. Import the Postman collection from the `Product Catalog API.postman_collection.json` file
2. Set the `baseUrl` variable to `http://localhost:3000` (or your custom port)
3. Use the collection to test each API endpoint

#### Authentication Testing

1. Register a user: `POST /api/auth/register`
   ```json
   {
     "name": "Test User",
     "email": "test@example.com",
     "password": "password123"
   }
   ```

2. Login with the user: `POST /api/auth/login`
   ```json
   {
     "email": "test@example.com",
     "password": "password123"
   }
   ```

3. Copy the JWT token from the response
4. Add the token to the Authorization header for protected routes:
   - Type: Bearer Token
   - Token: [paste your JWT token]

### 3. Testing with cURL

Here are some example cURL commands to test the API:

```bash
# Get all products
curl -X GET http://localhost:3000/api/products

# Create a category
curl -X POST http://localhost:3000/api/categories \
  -H "Content-Type: application/json" \
  -d '{"name":"Electronics","description":"Electronic devices and gadgets"}'

# Register a user
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

## Project Structure

```
product-catalog-api/
│
├── src/                    # Source code
│   ├── config/             # Configuration files
│   │   ├── db.js           # Database connection
│   │   └── testDb.js       # Test database configuration
│   │
│   ├── controllers/        # Route controllers
│   │   ├── authController.js   # Authentication controller
│   │   ├── categoryController.js  # Category controller
│   │   └── productController.js   # Product controller
│   │
│   ├── middleware/         # Custom middleware
│   │   ├── authMiddleware.js    # Authentication middleware
│   │   ├── cacheMiddleware.js   # Caching middleware
│   │   ├── errorMiddleware.js   # Error handling middleware
│   │   ├── rateLimitMiddleware.js  # Rate limiting middleware
│   │   └── validationMiddleware.js  # Input validation middleware
│   │
│   ├── models/             # Mongoose models
│   │   ├── Category.js     # Category model
│   │   ├── Product.js      # Product model
│   │   └── User.js         # User model
│   │
│   ├── routes/             # API routes
│   │   ├── authRoutes.js   # Authentication routes
│   │   ├── categoryRoutes.js  # Category routes
│   │   └── productRoutes.js   # Product routes
│   │
│   └── server.js           # Main server file
│
├── tests/                  # Test files
│   ├── categoryRoutes.test.js  # Category API tests
│   └── productRoutes.test.js   # Product API tests
│
├── .env                    # Environment variables
├── .gitignore              # Git ignore file
├── package.json            # Project dependencies and scripts
├── README.md               # Project documentation
├── API_DOCUMENTATION.md    # Detailed API documentation
├── PROJECT_SETUP.md        # Setup instructions
└── Product Catalog API.postman_collection.json  # Postman collection
```

## Deployment

### Preparing for Production

1. Update the `.env` file for production:
   ```
   PORT=3000
   MONGODB_URI=your_production_mongodb_uri
   NODE_ENV=production
   JWT_SECRET=your_secret_key_here
   ```

2. Build the project (if needed):
   ```bash
   npm run build
   ```

### Deploying to a Server

For a basic deployment on a Linux server:

1. Install Node.js, npm, and MongoDB on your server
2. Clone your repository to the server
3. Install dependencies: `npm install --production`
4. Set up environment variables
5. Start the server: `npm start`

### Using PM2 for Process Management

PM2 is a production process manager for Node.js applications:

```bash
# Install PM2 globally
npm install -g pm2

# Start the application with PM2
pm2 start src/server.js --name "product-catalog-api"

# Other useful PM2 commands
pm2 status               # Check status
pm2 logs                 # View logs
pm2 restart product-catalog-api  # Restart the application
```

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**:
   - Ensure MongoDB is running
   - Check the connection string in `.env`
   - Verify network connectivity to the database

2. **Port Already in Use**:
   - Change the PORT in `.env`
   - Check for other processes using the same port: `lsof -i :3000`

3. **JWT Authentication Issues**:
   - Verify the JWT_SECRET is set correctly
   - Check that the token is being sent in the Authorization header
   - Ensure the token hasn't expired

4. **Rate Limiting Issues**:
   - If you're being rate limited during testing, you can temporarily increase the limits in `rateLimitMiddleware.js`

5. **Permission Issues**:
   - Ensure proper file permissions for project files
   - Check MongoDB user permissions

### Getting Help

If you encounter any issues, please:
1. Check the console logs for error messages
2. Review the documentation in README.md and API_DOCUMENTATION.md
3. Open an issue on the GitHub repository

## Extended Features

The API includes several extended features:

1. **Authentication and Authorization**:
   - JWT-based authentication
   - Protected routes requiring authentication
   - Role-based access control (admin vs regular users)

2. **Rate Limiting**:
   - General API endpoints: 100 requests per 15 minutes
   - Auth endpoints: 5 requests per hour

3. **Caching**:
   - Short-lived cache (2 minutes) for frequently changing data
   - Medium-lived cache (10 minutes) for more stable data
   - Long-lived cache (1 hour) for very stable data

4. **Advanced Search**:
   - Search by keyword across multiple fields
   - Filter by price ranges (budget, mid-range, premium)
   - Filter by discount availability
   - Search within product attributes
