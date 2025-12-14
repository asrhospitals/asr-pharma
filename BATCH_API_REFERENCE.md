# Batch Management API Reference

## Overview
The batch management system allows you to create and manage item batches with quantity tracking. When a purchase bill is created with a batch ID, the batch quantity is automatically updated.

## Batch Endpoints

### 1. Create Batch
**POST** `/pharmacy/admin/master/batch/v1/create`

Create a new batch for an item.

**Request Body:**
```json
{
  "itemId": "uuid",
  "batchNumber": "string",
  "quantity": 100,
  "expiryDate": "2025-12-31",
  "mrp": 50.00,
  "purchaseRate": 40.00,
  "notes": "optional notes"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Batch created successfully",
  "data": {
    "id": "uuid",
    "itemId": "uuid",
    "batchNumber": "string",
    "quantity": 100,
    "expiryDate": "2025-12-31",
    "mrp": 50.00,
    "purchaseRate": 40.00,
    "status": "Active",
    "item": {
      "id": "uuid",
      "productname": "string",
      "packing": "string"
    }
  }
}
```

### 2. Get All Batches
**GET** `/pharmacy/admin/master/batch/v1/get-all`

Get all batches with optional filtering.

**Query Parameters:**
- `itemId` (optional): Filter by item ID
- `status` (optional): Filter by status (Active, Inactive, Expired)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "itemId": "uuid",
      "batchNumber": "string",
      "quantity": 100,
      "expiryDate": "2025-12-31",
      "status": "Active",
      "item": {
        "id": "uuid",
        "productname": "string"
      }
    }
  ]
}
```

### 3. Get Batches by Item
**GET** `/pharmacy/admin/master/batch/v1/get-by-item/{itemId}`

Get all active batches for a specific item.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "itemId": "uuid",
      "batchNumber": "string",
      "quantity": 100,
      "status": "Active"
    }
  ]
}
```

### 4. Get Batch by ID
**GET** `/pharmacy/admin/master/batch/v1/get/{id}`

Get a specific batch by ID.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "itemId": "uuid",
    "batchNumber": "string",
    "quantity": 100,
    "expiryDate": "2025-12-31",
    "mrp": 50.00,
    "purchaseRate": 40.00,
    "status": "Active",
    "notes": "string"
  }
}
```

### 5. Update Batch Quantity
**PUT** `/pharmacy/admin/master/batch/v1/update-quantity/{id}`

Update the quantity of a batch.

**Request Body:**
```json
{
  "quantity": 150
}
```

**Response:**
```json
{
  "success": true,
  "message": "Batch quantity updated successfully",
  "data": {
    "id": "uuid",
    "quantity": 150
  }
}
```

### 6. Move Quantity Between Batches
**POST** `/pharmacy/admin/master/batch/v1/move-quantity`

Move quantity from one batch to another (useful when deleting a batch).

**Request Body:**
```json
{
  "fromBatchId": "uuid",
  "toBatchId": "uuid",
  "quantity": 50
}
```

**Response:**
```json
{
  "success": true,
  "message": "Quantity moved successfully",
  "data": {
    "fromBatch": {
      "id": "uuid",
      "quantity": 50
    },
    "toBatch": {
      "id": "uuid",
      "quantity": 150
    }
  }
}
```

### 7. Delete Batch
**DELETE** `/pharmacy/admin/master/batch/v1/delete/{id}`

Delete a batch (only if quantity is 0).

**Response:**
```json
{
  "success": true,
  "message": "Batch deleted successfully"
}
```

## Purchase Bill Integration

When creating a purchase bill, include `batchId` in each item to automatically update batch quantities:

**POST** `/pharmacy/admin/purchase/bill/v1/create`

**Request Body:**
```json
{
  "supplierLedgerId": "uuid",
  "purchaseMasterId": "uuid",
  "items": [
    {
      "itemId": "uuid",
      "batchId": "uuid",
      "quantity": 50,
      "rate": 40.00,
      "amount": 2000.00
    }
  ]
}
```

When this bill is created, the batch quantity will be automatically increased by 50.

## Database Schema

### Batches Table
- `id` (UUID, Primary Key)
- `userCompanyId` (UUID, Foreign Key)
- `itemId` (UUID, Foreign Key)
- `batchNumber` (String, Unique per item)
- `quantity` (Decimal)
- `expiryDate` (Date, Optional)
- `mrp` (Decimal, Optional)
- `purchaseRate` (Decimal, Optional)
- `status` (Enum: Active, Inactive, Expired)
- `notes` (Text, Optional)
- `createdAt` (Timestamp)
- `updatedAt` (Timestamp)

### Purchase Bill Items Table (Updated)
- Added `batchId` (UUID, Foreign Key) to link to batch

## Error Handling

All endpoints return appropriate HTTP status codes:
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `404`: Not Found
- `409`: Conflict (e.g., batch already exists)
- `500`: Server Error

Error Response Format:
```json
{
  "success": false,
  "message": "Error description"
}
```
