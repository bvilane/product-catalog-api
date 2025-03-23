# Product Catalog API

A RESTful API for a product catalog system built with Node.js and Express.js. This API provides the foundation for an e-commerce platform with features like product management, categorization, search functionality, inventory tracking, and more.

## Features

- **Product Management**: Create, read, update, and delete products
- **Category Management**: Organize products into categories with parent-child relationships
- **Search & Filtering**: Find products by name, description, category, price range, etc.
- **Variant Support**: Manage product variants with different attributes (size, color, etc.)
- **Inventory Tracking**: Keep track of stock for products and variants
- **Pricing & Discounts**: Set prices and apply discounts to products
- **Reporting**: Generate reports for low stock items

## Prerequisites

- Node.js (version 14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

## Installation

1. **Clone the repository**

```bash
git clone https://github.com/your-username/product-catalog-api.git
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
```

4. **Start the server**

```bash
# Development mode with auto-restart
npm run dev

# Production mode
npm start
```

## API Documentation

### Products

#### Get all products
- **URL**: `/api/products`
- **Method**: `GET`
- **URL Params**:
  - `keyword=[string]` - Search by name or description
  - `category=[id]` - Filter by category ID
  - `minPrice=[number]` - Minimum price filter
  - `maxPrice=[number]` - Maximum price filter
  - `inStock=[boolean]` - Filter by availability
  - `page=[number]` - Page number for pagination (default: 1)
  - `limit=[number]` - Results per page (default: 10)
  - `sortBy=[field:order]` - Sort by field (e.g., `price:asc`, `name:desc`)
- **Success Response**: `200 OK`
```json
{
  "products": [
    {
      "_id": "60d21b4667d0d8992e610c85",
      "name": "Smartphone X",
      "description": "Latest smartphone with amazing features",
      "price": 799.99,
      "finalPrice": 719.99,
      "discountPercentage": 10,
      "stockCount": 25,
      "categories": [
        {
          "_id": "60d21b4667d0d8992e610c80",
          "name": "Electronics"
        }
      ],
      "createdAt": "2023-03-20T15:30:45.123Z",
      "updatedAt": "2023-03-20T15:30:45.123Z"
    },
    // More products...
  ],
  "page": 1,
  "pages": 5,
  "total": 48
}
```

#### Get a single product
- **URL**: `/api/products/:id`
- **Method**: `GET`
- **URL Params**: None
- **Success Response**: `200 OK`
```json
{
  "_id": "60d21b4667d0d8992e610c85",
  "name": "Smartphone X",
  "description": "Latest smartphone with amazing features",
  "sku": "PHONE-X-128",
  "price": 799.99,
  "finalPrice": 719.99,
  "discountPercentage": 10,
  "stockCount": 25,
  "categories": [
    {
      "_id": "60d21b4667d0d8992e610c80",
      "name": "Electronics",
      "description": "Electronic devices and gadgets"
    }
  ],
  "variants": [
    {
      "_id": "60d21b4667d0d8992e610c86",
      "name": "128GB Black",
      "sku": "PHONE-X-128B",
      "additionalCost": 0,
      "stockCount": 15
    },
    {
      "_id": "60d21b4667d0d8992e610c87",
      "name": "256GB Black",
      "sku": "PHONE-X-256B",
      "additionalCost": 100,
      "stockCount": 10
    }
  ],
  "attributes": {
    "brand": "TechCo",
    "color": "Black",
    "weight": "180g"
  },
  "createdAt": "2023-03-20T15:30:45.123Z",
  "updatedAt": "2023-03-20T15:30:45.123Z"
}
```

#### Create a product
- **URL**: `/api/products`
- **Method**: `POST`
- **Body**:
```json
{
  "name": "Smartphone X",
  "description": "Latest smartphone with amazing features",
  "sku": "PHONE-X-128",
  "price": 799.99,
  "discountPercentage": 10,
  "stockCount": 25,
  "categories": ["60d21b4667d0d8992e610c80"],
  "variants": [
    {
      "name": "128GB Black",
      "sku": "PHONE-X-128B",
      "additionalCost": 0,
      "stockCount": 15
    },
    {
      "name": "256GB Black",
      "sku": "PHONE-X-256B",
      "additionalCost": 100,
      "stockCount": 10
    }
  ],
  "attributes": {
    "brand": "TechCo",
    "color": "Black",
    "weight": "180g"
  }
}
```
- **Success Response**: `201 Created`
- **Error Response**: `400 Bad Request` if validation fails

#### Update a product
- **URL**: `/api/products/:id`
- **Method**: `PUT`
- **Body**: Same as for creating a product
- **Success Response**: `200 OK`
- **Error Response**: `404 Not Found` if product doesn't exist

#### Delete a product
- **URL**: `/api/products/:id`
- **Method**: `DELETE`
- **Success Response**: `200 OK`
```json
{
  "message": "Product removed"
}
```
- **Error Response**: `404 Not Found` if product doesn't exist

#### Update product inventory
- **URL**: `/api/products/:id/inventory`
- **Method**: `PATCH`
- **Body**:
```json
{
  "stockCount": 30
}
```
- **Success Response**: `200 OK`
```json
{
  "id": "60d21b4667d0d8992e610c85",
  "name": "Smartphone X",
  "stockCount": 30
}
```

#### Get low stock products
- **URL**: `/api/products/low-stock`
- **Method**: `GET`
- **URL Params**:
  - `threshold=[number]` - Stock threshold (default: 5)
- **Success Response**: `200 OK`
```json
[
  {
    "_id": "60d21b4667d0d8992e610c90",
    "name": "Wireless Earbuds",
    "sku": "EARBUDS-01",
    "stockCount": 3,
    "price": 129.99
  },
  // More low stock products...
]
```

### Categories

#### Get all categories
- **URL**: `/api/categories`
- **Method**: `GET`
- **Success Response**: `200 OK`
```json
[
  {
    "_id": "60d21b4667d0d8992e610c80",
    "name": "Electronics",
    "description": "Electronic devices and gadgets",
    "parent": null,
    "createdAt": "2023-03-20T15:30:45.123Z",
    "updatedAt": "2023-03-20T15:30:45.123Z"
  },
  {
    "_id": "60d21b4667d0d8992e610c81",
    "name": "Smartphones",
    "description": "Mobile phones and accessories",
    "parent": {
      "_id": "60d21b4667d0d8992e610c80",
      "name": "Electronics"
    },
    "createdAt": "2023-03-20T15:30:45.123Z",
    "updatedAt": "2023-03-20T15:30:45.123Z"
  },
  // More categories...
]
```

#### Get a single category
- **URL**: `/api/categories/:id`
- **Method**: `GET`
- **Success Response**: `200 OK`
```json
{
  "_id": "60d21b4667d0d8992e610c81",
  "name": "Smartphones",
  "description": "Mobile phones and accessories",
  "parent": {
    "_id": "60d21b4667d0d8992e610c80",
    "name": "Electronics"
  },
  "createdAt": "2023-03-20T15:30:45.123Z",
  "updatedAt": "2023-03-20T15:30:45.123Z"
}
```

#### Create a category
- **URL**: `/api/categories`
- **Method**: `POST`
- **Body**:
```json
{
  "name": "Laptops",
  "description": "Notebook computers and accessories",
  "parent": "60d21b4667d0d8992e610c80"
}
```
- **Success Response**: `201 Created`
- **Error Response**: `400 Bad Request` if validation fails

#### Update a category
- **URL**: `/api/categories/:id`
- **Method**: `PUT`
- **Body**: Same as for creating a category
- **Success Response**: `200 OK`
- **Error Response**: `404 Not Found` if category doesn't exist

#### Delete a category
- **URL**: `/api/categories/:id`
- **Method**: `DELETE`
- **Success Response**: `200 OK`
```json
{
  "message": "Category removed"
}
```
- **Error Response**: 
  - `404 Not Found` if category doesn't exist
  - `400 Bad Request` if category is used by products or has child categories

#### Get products in a category
- **URL**: `/api/categories/:id/products`
- **Method**: `GET`
- **URL Params**:
  - `page=[number]` - Page number for pagination (default: 1)
  - `limit=[number]` - Results per page (default: 10)
- **Success Response**: `200 OK`
```json
{
  "category": {
    "id": "60d21b4667d0d8992e610c81",
    "name": "Smartphones"
  },
  "products": [
    {
      "_id": "60d21b4667d0d8992e610c85",
      "name": "Smartphone X",
      "description": "Latest smartphone with amazing features",
      "price": 799.99,
      "finalPrice": 719.99,
      "stockCount": 25
    },
    // More products...
  ],
  "page": 1,
  "pages": 2,
  "total": 15
}
```

## Error Handling

The API returns appropriate HTTP status codes and error messages for different scenarios:

- `400 Bad Request`: Invalid input data or operation
- `404 Not Found`: Resource doesn't exist
- `500 Internal Server Error`: Server-side errors

Error response format:
```json
{
  "message": "Detailed error message"
}
```

## Testing

Run the test suite with:

```bash
npm test
```

The tests cover all API endpoints and include:
- Validation tests
- CRUD operations for products and categories
- Search and filtering functionality
- Error handling scenarios

## Extensions and Improvements

The API can be extended with the following features:

- **Authentication & Authorization**: Implement JWT-based auth with user roles
- **Rate Limiting**: Protect the API from abuse
- **Database Integration**: Connect to a persistent MongoDB database
- **Image Handling**: Add support for product images
- **Performance Optimization**: Implement caching and query optimization
- **Extended Search**: Add full-text search capabilities

## Assumptions and Limitations

- The API currently uses in-memory storage which resets on server restart (in development mode)
- No authentication or authorization is implemented in this version
- The API assumes all requests are in JSON format
- Rate limiting is not implemented in this version

## Author 

Bavukile Birthwell Vilane - b.vilane@alustudent.com - https://github.com/bvilane