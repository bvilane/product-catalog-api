# Product Catalog API

A RESTful API for a product catalog system built with Node.js and Express.js. This API provides the foundation for an e-commerce platform with features like product management, categorization, search functionality, inventory tracking, and more.

## Features

- **Product Management**: Create, read, update, and delete products
- **Category Management**: Organize products into categories with parent-child relationships
- **Search & Filtering**: Advanced search by name, description, attributes, price ranges, and more
- **Variant Support**: Manage product variants with different attributes (size, color, etc.)
- **Inventory Tracking**: Keep track of stock for products and variants
- **Pricing & Discounts**: Set prices and apply discounts to products
- **Reporting**: Generate reports for low stock items
- **Authentication & Authorization**: JWT-based authentication with user roles
- **Rate Limiting**: Protection against API abuse
- **Performance Optimization**: Response caching for improved performance

## Prerequisites

- Node.js (version 14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

## Installation

1. **Clone the repository**

```bash
git clone https://github.com/bvilane/product-catalog-api.git
cd product-catalog-api
```

2. **Install dependencies**

```bash
npm install
```

3. **Environment configuration**

Create a `.env` file in the root directory with the following variables:

```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/product-catalog
NODE_ENV=development
JWT_SECRET=your_jwt_secret_key
```

4. **Start the server**

```bash
# Development mode with auto-restart
npm run dev

# Production mode
npm start
```

## API Documentation

For detailed documentation of all API endpoints, see [API_DOCUMENTATION.md](./API_DOCUMENTATION.md).

### Main Features

#### Products API
- Create, read, update, and delete products
- Search products by keywords
- Filter by category, price range, availability
- Manage product variants
- Update inventory
- Get low stock reports

#### Categories API
- Create, read, update, and delete categories
- Support for hierarchical categories
- Retrieve products by category

#### Authentication API
- User registration and login
- JWT-based authentication
- Protected routes
- Role-based authorization

## Security Features

- Input validation and sanitization
- JWT authentication for protected routes
- Rate limiting to prevent abuse
- CORS configuration
- Error handling with appropriate status codes

## Performance Optimizations

- Response caching for frequently accessed data
- Efficient database queries with proper indexing
- Pagination for large dataset handling

## Testing

Run the automated test suite with:

```bash
npm test
```

The tests cover:
- API endpoints functionality
- Authentication and authorization
- Data validation
- Error handling

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
├── API_DOCUMENTATION.md    # Detailed API documentation
├── PROJECT_SETUP.md        # Setup instructions
└── Product Catalog API.postman_collection.json  # Postman collection
```

## Assumptions and Limitations

- JWT tokens expire after 30 days
- Rate limiting is set to 100 requests per 15 minutes for general API endpoints
- Authentication endpoints are limited to 5 requests per hour per IP
- Response caching durations vary from 2 minutes to 1 hour depending on the endpoint

## Author

Bavukile Birthwell Vilane - b.vilane@alustudent.com - https://github.com/bvilane

## License

MIT