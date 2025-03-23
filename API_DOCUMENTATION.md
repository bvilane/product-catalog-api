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
  "name": "Smartphone X",
  "stockCount": 30
}
```

### Get Low Stock Products

Retrieves products with stock count below a specified threshold.

**Endpoint:** `GET /api/products/low-stock`

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `threshold` | number | Stock threshold (default: 5) |

**Response:**

```json
[
  {
    "_id": "60d21b4667d0d8992e610c90",
    "name": "Wireless Earbuds",
    "sku": "EARBUDS-01",
    "stockCount": 3,
    "price": 129.99
  },
  {
    "_id": "60d21b4667d0d8992e610c91",
    "name": "Smart Watch",
    "sku": "WATCH-02",
    "stockCount": 2,
    "price": 199.99
  }
]
```

## Category Endpoints

### Get All Categories

Retrieves all categories.

**Endpoint:** `GET /api/categories`

**Response:**

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
  }
]
```

### Get Category by ID

Retrieves a single category by its ID.

**Endpoint:** `GET /api/categories/:id`

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string | Category ID |

**Response:**

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

### Create Category

Creates a new category.

**Endpoint:** `POST /api/categories`

**Request Body:**

```json
{
  "name": "Laptops",
  "description": "Notebook computers and accessories",
  "parent": "60d21b4667d0d8992e610c80"
}
```

**Required Fields:**
- `name`: Category name (must be unique)
- `description`: Category description

**Optional Fields:**
- `parent`: Parent category ID (for subcategories)
- `isActive`: Boolean indicating if category is active (default: true)

**Response:**

```json
{
  "_id": "60d21b4667d0d8992e610c82",
  "name": "Laptops",
  "description": "Notebook computers and accessories",
  "parent": "60d21b4667d0d8992e610c80",
  "isActive": true,
  "createdAt": "2023-03-20T15:30:45.123Z",
  "updatedAt": "2023-03-20T15:30:45.123Z"
}
```

### Update Category

Updates an existing category.

**Endpoint:** `PUT /api/categories/:id`

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string | Category ID |

**Request Body:**
Same as for creating a category. All fields are optional for updates.

**Response:**
Returns the updated category object.

### Delete Category

Deletes a category.

**Endpoint:** `DELETE /api/categories/:id`

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string | Category ID |

**Response:**

```json
{
  "message": "Category removed"
}
```

**Error Cases:**
- If the category is used by any products, deletion will fail
- If the category is a parent to other categories, deletion will fail

### Get Products in Category

Retrieves all products in a specific category.

**Endpoint:** `GET /api/categories/:id/products`

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string | Category ID |

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `page` | number | Page number for pagination (default: 1) |
| `limit` | number | Number of items per page (default: 10) |

**Response:**

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
    {
      "_id": "60d21b4667d0d8992e610c86",
      "name": "Smartphone Y",
      "description": "Budget-friendly smartphone",
      "price": 399.99,
      "finalPrice": 399.99,
      "stockCount": 50
    }
  ],
  "page": 1,
  "pages": 1,
  "total": 2
}
```

## Error Responses

### Validation Error

```json
{
  "message": "\"name\" is required"
}
```

### Resource Not Found

```json
{
  "message": "Product not found"
}
```

### Conflict Error

```json
{
  "message": "Product with this SKU already exists"
}
```

### Deletion Constraint Error

```json
{
  "message": "Cannot delete category. It is used by 5 products."
}
```

## Example Use Cases

### Creating a Product Catalog Structure

1. Create parent categories:
   ```
   POST /api/categories
   { "name": "Electronics", "description": "Electronic devices" }
   ```

2. Create subcategories:
   ```
   POST /api/categories
   { "name": "Smartphones", "description": "Mobile phones", "parent": "PARENT_ID" }
   ```

3. Add products to categories:
   ```
   POST /api/products
   { 
     "name": "Phone XYZ", 
     "description": "...", 
     "sku": "PHONE-123", 
     "price": 499.99,
     "stockCount": 50,
     "categories": ["CATEGORY_ID"] 
   }
   ```

### Managing Inventory

1. Check low stock items:
   ```
   GET /api/products/low-stock?threshold=10
   ```

2. Update inventory for a product:
   ```
   PATCH /api/products/PRODUCT_ID/inventory
   { "stockCount": 100 }
   ```

### Searching and Filtering Products

1. Search products by keyword:
   ```
   GET /api/products?keyword=smartphone
   ```

2. Filter products by category:
   ```
   GET /api/products?category=CATEGORY_ID
   ```

3. Filter products by price range:
   ```
   GET /api/products?minPrice=100&maxPrice=500
   ```

4. Combined search, filter, and sort:
   ```
   GET /api/products?keyword=smartphone&minPrice=300&maxPrice=800&sortBy=price:asc&page=1&limit=10
   ```

## Rate Limits

This version of the API does not implement rate limiting. Future versions may include rate limits to prevent abuse.

## Versioning

The current API version is v1. The version is implied in the paths but not explicitly stated.

## Support

For support or questions about the API, please open an issue on the GitHub repository.