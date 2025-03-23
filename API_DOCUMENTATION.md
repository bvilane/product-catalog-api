# Product Catalog API Documentation

This document provides comprehensive documentation for all the endpoints available in the Product Catalog API.

## Base URL

```
http://localhost:3000
```

## Authentication

This version of the API does not require authentication. Future versions may implement JWT-based authentication.

## Response Format

All responses are returned in JSON format. Successful responses typically have this structure:

```json
{
  "property1": "value1",
  "property2": "value2",
  ...
}
```

or for collections:

```json
{
  "items": [
    {
      "property1": "value1",
      "property2": "value2",
      ...
    },
    ...
  ],
  "page": 1,
  "pages": 5,
  "total": 42
}
```

Error responses have this structure:

```json
{
  "message": "Error message describing what went wrong"
}
```

## HTTP Status Codes

The API uses standard HTTP status codes to indicate the success or failure of a request:

- `200 OK`: Request succeeded
- `201 Created`: Resource created successfully
- `400 Bad Request`: Invalid request (e.g., validation error)
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server-side error

## Product Endpoints

### Get All Products

Retrieves a list of products with optional filtering, sorting, and pagination.

**Endpoint:** `GET /api/products`

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `keyword` | string | Search term for product name or description |
| `category` | string | Category ID to filter products |
| `minPrice` | number | Minimum price filter |
| `maxPrice` | number | Maximum price filter |
| `inStock` | boolean | Filter for products in stock (`true`) |
| `page` | number | Page number for pagination (default: 1) |
| `limit` | number | Number of items per page (default: 10) |
| `sortBy` | string | Field and direction to sort by (e.g., `price:asc`, `name:desc`) |

**Response:**

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

### Get Product by ID

Retrieves a single product by its ID.

**Endpoint:** `GET /api/products/:id`

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string | Product ID |

**Response:**

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

### Create Product

Creates a new product.

**Endpoint:** `POST /api/products`

**Request Body:**

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

**Required Fields:**
- `name`: Product name
- `description`: Product description 
- `sku`: Unique Stock Keeping Unit
- `price`: Product base price
- `stockCount`: Quantity in stock

**Optional Fields:**
- `discountPercentage`: Percentage discount (0-100)
- `categories`: Array of category IDs
- `variants`: Array of product variants
- `attributes`: Key-value pairs of product attributes
- `isActive`: Boolean indicating if product is active (default: true)

**Response:**

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
  "categories": ["60d21b4667d0d8992e610c80"],
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
  "isActive": true,
  "createdAt": "2023-03-20T15:30:45.123Z",
  "updatedAt": "2023-03-20T15:30:45.123Z"
}
```

### Update Product

Updates an existing product.

**Endpoint:** `PUT /api/products/:id`

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string | Product ID |

**Request Body:**
Same as for creating a product. All fields are optional for updates.

**Response:**
Returns the updated product object.

### Delete Product

Deletes a product.

**Endpoint:** `DELETE /api/products/:id`

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string | Product ID |

**Response:**

```json
{
  "message": "Product removed"
}
```

### Update Product Inventory

Updates the inventory (stock count) of a product.

**Endpoint:** `PATCH /api/products/:id/inventory`

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string | Product ID |

**Request Body:**

```json
{
  "stockCount": 30
}
```

**Response:**

```json
{
  "id": "60d21b4667d0d8992e610c85",
  "name": "Smartphone X