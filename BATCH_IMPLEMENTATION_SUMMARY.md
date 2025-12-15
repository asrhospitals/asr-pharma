# Batch Management System - Implementation Summary

## What Was Built

A complete batch management system for tracking item quantities by batch, with automatic batch quantity updates when purchase bills are created.

## Files Created

### 1. Model
- **`src/models/masters/inventory/batch.js`** - Batch model with fields for batch number, quantity, expiry date, MRP, purchase rate, and status

### 2. Controller
- **`src/controllers/masters/BatchController.js`** - Contains all batch operations:
  - `createBatch` - Create new batch
  - `getBatchesByItem` - Get active batches for an item
  - `getAllBatches` - Get all batches with filtering
  - `getBatchById` - Get specific batch
  - `updateBatchQuantity` - Update batch quantity
  - `moveBatchQuantity` - Move quantity between batches
  - `deleteBatch` - Delete batch (only if quantity is 0)

### 3. Routes
- **`src/routes/master/batchRoutes.js`** - Batch API endpoints (not used directly, routes are in masterroutes.js)
- **`src/routes/master/masterroutes.js`** - Updated to include batch routes

### 4. Migrations
- **`src/database/migrations/20251214000001-create-batch.js`** - Creates batches table
- **`src/database/migrations/20251214000002-add-batchId-to-purchase-bill-items.js`** - Adds batchId column to purchase_bill_items

## Files Modified

### 1. Database
- **`src/database/index.js`** - Added Batch, PurchaseBill, and PurchaseBillItem model imports
- **`src/database/association.js`** - Added associations between Batch, Item, and UserCompany

### 2. Models
- **`src/models/purchase/purchaseBillItem.js`** - Added batchId field and association to Batch model

### 3. Controllers
- **`src/controllers/purchase/PurchaseBillController.js`** - Updated createPurchaseBill to automatically update batch quantities when items with batchId are added

### 4. Routes
- **`src/routes/master/masterroutes.js`** - Added all batch endpoints

## API Endpoints

### Batch Management
- `POST /pharmacy/admin/master/batch/v1/create` - Create batch
- `GET /pharmacy/admin/master/batch/v1/get-all` - Get all batches
- `GET /pharmacy/admin/master/batch/v1/get-by-item/{itemId}` - Get batches for item
- `GET /pharmacy/admin/master/batch/v1/get/{id}` - Get batch by ID
- `PUT /pharmacy/admin/master/batch/v1/update-quantity/{id}` - Update quantity
- `POST /pharmacy/admin/master/batch/v1/move-quantity` - Move quantity between batches
- `DELETE /pharmacy/admin/master/batch/v1/delete/{id}` - Delete batch

## Key Features

1. **Batch Creation** - Create batches with batch number, quantity, expiry date, MRP, and purchase rate
2. **Quantity Tracking** - Track quantity per batch
3. **Batch Selection** - Select batch when creating purchase bills
4. **Automatic Updates** - Batch quantity automatically increases when purchase bill is created with batch ID
5. **Quantity Movement** - Move quantity from one batch to another before deletion
6. **Status Management** - Batches can be Active, Inactive, or Expired
7. **Company Isolation** - Batches are isolated per company

## Database Schema

### Batches Table
```sql
CREATE TABLE batches (
  id UUID PRIMARY KEY,
  userCompanyId UUID NOT NULL REFERENCES user_companies(id),
  itemId UUID NOT NULL REFERENCES items(id),
  batchNumber VARCHAR NOT NULL,
  quantity DECIMAL(10,2) NOT NULL DEFAULT 0,
  expiryDate DATE,
  mrp DECIMAL(10,2),
  purchaseRate DECIMAL(10,2),
  status ENUM('Active', 'Inactive', 'Expired') DEFAULT 'Active',
  notes TEXT,
  createdAt TIMESTAMP,
  updatedAt TIMESTAMP,
  UNIQUE(itemId, batchNumber)
);
```

### Purchase Bill Items Update
Added `batchId` column to link purchase bill items to batches.

## How It Works

1. **Create Batch** - Admin creates a batch for an item with initial quantity
2. **Purchase Bill** - When creating a purchase bill, select a batch for each item
3. **Auto Update** - System automatically increases batch quantity by the purchased amount
4. **Manage Batches** - Update quantities, move between batches, or delete empty batches

## Frontend Integration

Frontend should:
1. Call `GET /pharmacy/admin/master/batch/v1/get-by-item/{itemId}` to get available batches for an item
2. Display batch selection dropdown when adding items to purchase bill
3. Include `batchId` in the item object when creating purchase bill
4. Call batch endpoints for batch management operations

## Running Migrations

```bash
npm run migrate
```

This will create the batches table and add the batchId column to purchase_bill_items.
