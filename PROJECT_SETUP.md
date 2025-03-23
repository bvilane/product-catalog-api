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
git clone https://github.com/your-username/product-catalog-api.git

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

### 3. Testing with cURL

Here are some example cURL commands to test the API:

```bash
# Get all products
curl -X GET http://localhost:3000/api/products

# Create a category
curl -X POST http://localhost:3000/api/categories \
  -H "Content-Type: application/json" \
  -d '{"name":"Electronics","description":"Electronic devices and gadgets"}'

# Create a product
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Smartphone X",
    "description": "Latest smartphone with amazing features",
    "sku": "PHONE-X-128",
    "price": 799.99,
    "stockCount": 25,
    "categories": []
  }'
```

## Project Structure

```
product-catalog-api/
│
├── src/                    # Source code
│   ├── config/             # Configuration files
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Custom middleware
│   ├── models/             # Mongoose models
│   ├── routes/             # API routes
│   ├── utils/              # Utility functions
│   └── server.js           # Main server file
│
├── tests/                  # Test files
│
├── .env                    # Environment variables (create this)
├── .gitignore              # Git ignore file
├── package.json            # Project dependencies and scripts
├── README.md               # Project documentation
└── Product Catalog API.postman_collection.json  # Postman collection
```

## Deployment

### Preparing for Production

1. Update the `.env` file for production:
   ```
   PORT=3000
   MONGODB_URI=your_production_mongodb_uri
   NODE_ENV=production
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

3. **Permission Issues**:
   - Ensure proper file permissions for project files
   - Check MongoDB user permissions

### Getting Help

If you encounter any issues, please:
1. Check the console logs for error messages
2. Review the documentation in README.md
3. Open an issue on the GitHub repository

## Next Steps

Once the basic setup is working, consider implementing these extensions:

- Authentication and authorization
- Database integration (if using in-memory storage)
- Advanced search functionality
- Image uploading for products
- Cache implementation for better performance