# ASR Pharma Backend - Complete Setup & Project Flow Guide

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Project Overview](#project-overview)
3. [Initial Setup](#initial-setup)
4. [Database Setup](#database-setup)
5. [Project Architecture](#project-architecture)
6. [API Endpoints](#api-endpoints)
7. [Authentication Flow](#authentication-flow)
8. [Database Schema](#database-schema)
9. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before setting up the project, ensure you have:

- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **PostgreSQL**: v12.0 or higher
- **Redis**: (Optional, for rate limiting and caching)
- **Git**: For version control

### Installation Commands

```bash
# Check Node.js version
node --version

# Check npm version
npm --version

# Check PostgreSQL version (if installed)
psql --version
```

---

## Project Overview

**ASR Pharma** is a comprehensive Pharmacy Management System backend built with:

- **Framework**: Express.js (Node.js)
- **Database**: PostgreSQL with Sequelize ORM
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: Helmet, CORS, Rate Limiting, Input Validation
- **API Logging**: Custom middleware for request/response logging
- **Testing**: Jest framework

### Key Features

- Multi-company support with user-company associations
- Role-based access control (Admin, Manager, User)
- Accounting module with ledgers and groups
- Inventory management (Items, Manufacturers, Salts, Racks, Units)
- Sales management with bill generation
- Purchase management
- Patient and Doctor management
- Prescription tracking
- GST tax calculations

---

## Initial Setup

### Step 1: Clone and Install Dependencies

```bash
# Clone the repository
git clone <repository-url>
cd asr-pharma

# Install dependencies
npm install
```

### Step 2: Environment Configuration

Create a `.env` file in the root directory with the following variables:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=pharmacydb
DB_USER=postgres
DB_PASSWORD=postgres

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Redis Configuration (Optional)
REDIS_URL=redis://localhost:6379

# Email Configuration (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Twilio Configuration (Optional)
TWILIO_SID=your-twilio-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token

# Frontend Configuration
FRONTEND_URL=http://localhost:5173
```

### Step 3: Database Setup

#### Create PostgreSQL Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE pharmacydb;

# Create user (optional, if not using default postgres user)
CREATE USER pharmacyuser WITH PASSWORD 'pharmacypassword';
ALTER ROLE pharmacyuser WITH CREATEDB;
GRANT ALL PRIVILEGES ON DATABASE pharmacydb TO pharmacyuser;

# Exit psql
\q
```

#### Run Migrations

```bash
# Run all pending migrations
npm run migrate

# Expected output:
# ✓ 20250724204536-create-users.js
# ✓ 20250724204549-create-user-company.js
# ✓ 20250725061551-create-company.js
# ... (all migrations)
```

#### Seed Initial Data

```bash
# Seed database with default data
npm run seed

# Expected output:
# ✓ 20250725212554-default-accounting-groups.js
# ✓ 20250801192000-create-default-company.js
# ✓ 20250804172804-admin-user.js
# ... (all seeders)
```

### Step 4: Start the Server

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start

# Expected output:
# 🚀 Server is running on port 3000
# 🌍 Environment: development
# 🔒 Security: Enhanced security middleware active
# 📊 API Logging: Enabled
```

### Step 5: Verify Setup

```bash
# Check server health
curl http://localhost:3000/

# Expected response:
# {
#   "message": "Pharmacy server is running",
#   "timestamp": "2025-01-15T10:30:00.000Z",
#   "environment": "development",
#   "security": "enabled",
#   "logging": "enabled"
# }

# Check security health
curl http://localhost:3000/pharmacy/security/health

# Check logs configuration
curl http://localhost:3000/pharmacy/logs/config
```

---

## Database Setup

### Migration Strategy

Migrations are run in chronological order based on their timestamps. The system uses Sequelize CLI for managing migrations.

#### Migration Files Location
```
src/database/migrations/
```

#### Key Migrations (in order)

1. **20250724204536-create-users.js** - Creates users table with authentication fields
2. **20250724204549-create-user-company.js** - Creates user-company associations
3. **20250725061551-create-company.js** - Creates company master data
4. **20250725064007-create-hsnSac.js** - Creates HSN/SAC codes for taxation
5. **20250725074300-create-store.js** - Creates store/warehouse master
6. **20250725074407-create-manufacturer.js** - Creates manufacturer master
7. **20250725074412-create-salt.js** - Creates pharmaceutical salt master
8. **20250725074415-create-rack.js** - Creates inventory rack master
9. **20250725074432-create-salt_variation.js** - Creates salt variations
10. **20250725074451-create-unit.js** - Creates measurement units
11. **20250725074507-create-doctor.js** - Creates doctor master
12. **20250725074510-update-users-table.js** - Updates users table with additional fields
13. **20250725074519-create-patient.js** - Creates patient master
14. **20250725212511-create-groups.js** - Creates accounting groups
15. **20250725212530-create-group-permissions.js** - Creates group permissions
16. **20250725214548-create-station.js** - Creates station/location master
17. **20250725214549-create-ledgers.js** - Creates accounting ledgers
18. **20250725220000-create-transactions.js** - Creates transaction records
19. **20250803150143-create-sale-master.js** - Creates sales master with tax configurations
20. **20250805000000-create-purchase-master.js** - Creates purchase master
21. **20250805000001-create-item.js** - Creates inventory items
22. **20250805000002-create-prescription.js** - Creates prescription records
23. **20250805000003-create-prescription_item.js** - Creates prescription items
24. **20250805000004-create-bill.js** - Creates bill records
25. **20250805000005-create-billItem.js** - Creates bill items

#### Seeder Files Location
```
src/database/seeders/
```

#### Key Seeders (in order)

1. **20250725212554-default-accounting-groups.js** - Seeds default accounting groups
2. **20250801192000-create-default-company.js** - Seeds default company
3. **20250801192000-reset-and-create-all-default-ledgers.js** - Seeds default ledgers
4. **20250803150939-default-sale-masters.js** - Seeds default sales masters with tax rates
5. **20250804172804-admin-user.js** - Seeds admin user (username: admin, password: Admin@123)
6. **20250805000000-default-purchase-masters.js** - Seeds default purchase masters

### Undo Operations

```bash
# Undo last migration
npm run migrate:undo

# Undo all migrations
npm run migrate:undo:all

# Undo all seeders
npm run seed:undo
```

### Fresh Database Setup

```bash
# Complete reset (use with caution!)
npm run migrate:undo:all
npm run seed:undo
npm run migrate
npm run seed
```

---

## Project Architecture

### Directory Structure

```
asr-pharma/
├── src/
│   ├── app.js                          # Express app configuration
│   ├── server.js                       # Server entry point
│   ├── config/
│   │   ├── config.js                   # Database configuration
│   │   └── security.js                 # Security middleware setup
│   ├── controllers/
│   │   ├── auth/                       # Authentication controllers
│   │   ├── masters/                    # Master data controllers
│   │   │   ├── account/                # Accounting controllers
│   │   │   ├── inventory/              # Inventory controllers
│   │   │   └── other/                  # Other masters
│   │   └── sales/                      # Sales controllers
│   ├── models/
│   │   ├── auth/                       # Auth models (User, UserCompany)
│   │   ├── masters/
│   │   │   ├── accountMaster/          # Accounting models
│   │   │   ├── inventory/              # Inventory models
│   │   │   └── other/                  # Other models
│   │   └── sales/                      # Sales models
│   ├── routes/
│   │   ├── auth/                       # Auth routes
│   │   ├── master/                     # Master routes
│   │   └── sales/                      # Sales routes
│   ├── middleware/
│   │   ├── auth/                       # Authentication middleware
│   │   ├── security/                   # Security middleware
│   │   ├── logging/                    # Logging middleware
│   │   ├── permissions/                # Permission middleware
│   │   └── validation/                 # Validation middleware
│   ├── services/
│   │   ├── seeders/                    # Seeder services
│   │   ├── billCalculationService.js   # Bill calculation logic
│   │   ├── ledgerEntryService.js       # Ledger entry logic
│   │   └── verificationService.js      # Verification logic
│   ├── utils/
│   │   ├── groupPermissionService.js   # Permission utilities
│   │   └── queryOptions.js             # Query helpers
│   └── database/
│       ├── migrations/                 # Database migrations
│       ├── seeders/                    # Database seeders
│       ├── association.js              # Model associations
│       └── index.js                    # Database initialization
├── tests/
│   ├── unit/                           # Unit tests
│   ├── integration/                    # Integration tests
│   └── e2e/                            # End-to-end tests
├── docs/                               # Documentation
├── .env                                # Environment variables
├── .sequelizerc                        # Sequelize configuration
├── package.json                        # Dependencies
└── README.md                           # Project README
```

### Layer Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    API Routes                           │
│  (auth, masters, sales, accounts, etc.)                 │
└──────────────────────┬──────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────┐
│              Middleware Stack                           │
│  (Auth, Security, Logging, Validation, Permissions)     │
└──────────────────────┬──────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────┐
│                  Controllers                            │
│  (Request handlers, business logic orchestration)       │
└──────────────────────┬──────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────┐
│                   Services                              │
│  (Business logic, calculations, validations)            │
└──────────────────────┬──────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────┐
│                    Models                               │
│  (Database schema, associations, queries)               │
└──────────────────────┬──────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────┐
│                  PostgreSQL                             │
│  (Data persistence)                                     │
└─────────────────────────────────────────────────────────┘
```

---

## API Endpoints

### Authentication Endpoints

```
POST   /pharmacy/auth/signin              - User login
POST   /pharmacy/auth/signup              - User registration
POST   /pharmacy/auth/refresh             - Refresh JWT token
POST   /pharmacy/auth/logout              - User logout
POST   /pharmacy/auth/verify-otp          - Verify OTP
POST   /pharmacy/auth/resend-otp          - Resend OTP
```

### Master Data Endpoints

#### Accounting
```
GET    /pharmacy/admin/master/groups      - Get all groups
POST   /pharmacy/admin/master/groups      - Create group
PUT    /pharmacy/admin/master/groups/:id  - Update group
DELETE /pharmacy/admin/master/groups/:id  - Delete group

GET    /pharmacy/admin/master/ledgers     - Get all ledgers
POST   /pharmacy/admin/master/ledgers     - Create ledger
PUT    /pharmacy/admin/master/ledgers/:id - Update ledger
DELETE /pharmacy/admin/master/ledgers/:id - Delete ledger
```

#### Inventory
```
GET    /pharmacy/admin/master/items       - Get all items
POST   /pharmacy/admin/master/items       - Create item
PUT    /pharmacy/admin/master/items/:id   - Update item
DELETE /pharmacy/admin/master/items/:id   - Delete item

GET    /pharmacy/admin/master/manufacturers - Get manufacturers
POST   /pharmacy/admin/master/manufacturers - Create manufacturer

GET    /pharmacy/admin/master/salts       - Get salts
POST   /pharmacy/admin/master/salts       - Create salt

GET    /pharmacy/admin/master/units       - Get units
POST   /pharmacy/admin/master/units       - Create unit

GET    /pharmacy/admin/master/racks       - Get racks
POST   /pharmacy/admin/master/racks       - Create rack

GET    /pharmacy/admin/master/stores      - Get stores
POST   /pharmacy/admin/master/stores      - Create store
```

#### Other Masters
```
GET    /pharmacy/admin/master/doctors     - Get doctors
POST   /pharmacy/admin/master/doctors     - Create doctor

GET    /pharmacy/admin/master/patients    - Get patients
POST   /pharmacy/admin/master/patients    - Create patient

GET    /pharmacy/admin/master/stations    - Get stations
POST   /pharmacy/admin/master/stations    - Create station
```

### Sales Endpoints

```
GET    /pharmacy/sales/bills/v1           - Get all bills
POST   /pharmacy/sales/bills/v1           - Create bill
PUT    /pharmacy/sales/bills/v1/:id       - Update bill
DELETE /pharmacy/sales/bills/v1/:id       - Delete bill
GET    /pharmacy/sales/bills/v1/:id       - Get bill details
```

### Logging & Monitoring Endpoints

```
GET    /pharmacy/security/health          - Health check
GET    /pharmacy/logs/config              - Get logging configuration
POST   /pharmacy/logs/enable              - Enable logging
POST   /pharmacy/logs/disable             - Disable logging
GET    /pharmacy/logs/stats               - Get logging statistics
DELETE /pharmacy/logs/clear               - Clear logs
```

---

## Authentication Flow

### User Registration

```
1. User submits registration form with:
   - Username (unique)
   - Password (hashed with bcrypt)
   - First Name
   - Last Name
   - Email
   - Phone

2. System validates input
3. Password is hashed using bcrypt (12 rounds)
4. User record is created in database
5. OTP is sent to email/phone for verification
6. User receives JWT token upon successful verification
```

### User Login

```
1. User submits login credentials (username + password)
2. System retrieves user from database
3. Password is compared with stored hash
4. If valid:
   - JWT access token is generated (15 minutes expiry)
   - JWT refresh token is generated (7 days expiry)
   - Tokens are returned to client
5. If invalid:
   - Error response is returned
   - Failed login attempt is logged
```

### Token Refresh

```
1. Client sends refresh token
2. System validates refresh token
3. If valid:
   - New access token is generated
   - New refresh token is generated
4. If invalid:
   - User must re-login
```

### Protected Routes

```
1. Client sends request with Authorization header:
   Authorization: Bearer <access_token>

2. Middleware verifies token:
   - Token signature is validated
   - Token expiry is checked
   - User is retrieved from database

3. If valid:
   - Request proceeds to controller
   - User context is attached to request

4. If invalid:
   - 401 Unauthorized response is returned
```

---

## Database Schema

### Core Tables

#### users
```sql
- id (UUID, Primary Key)
- uname (String, Unique) - Username
- pwd (String) - Hashed password
- role (Enum: admin, manager)
- module (Array) - Accessible modules
- fname (String) - First name
- lname (String) - Last name
- email (String)
- phone (String)
- pin (String)
- isactive (Enum: active, inactive)
- phoneVerified (Boolean)
- emailVerified (Boolean)
- activeCompanyId (UUID, Foreign Key)
- lastLoginAt (DateTime)
- createdAt (DateTime)
- updatedAt (DateTime)
```

#### user_companies
```sql
- id (UUID, Primary Key)
- userId (UUID, Foreign Key → users)
- companyName (String)
- address (Text)
- country (String)
- state (String)
- pinCode (String)
- branchCode (String)
- businessType (Enum)
- calendarType (Enum: English, Hindi, Gujarati)
- financialYearFrom (Date)
- financialYearTo (Date)
- taxType (String)
- phone (String)
- email (String)
- website (String)
- panNumber (String)
- logoUrl (String)
- status (Enum: active, inactive, suspended)
- isActive (Boolean)
- isPrimary (Boolean)
- createdAt (DateTime)
- updatedAt (DateTime)
```

#### companies
```sql
- id (UUID, Primary Key)
- userCompanyId (UUID, Foreign Key → user_companies)
- companyname (String, Unique)
- status (Enum: Continue, Discontinue)
- prohibited (Enum: Yes, No)
- invoiceprintindex (Integer)
- recorderformula (Float)
- expiredays (Integer)
- dumpdays (Integer)
- minimummargin (Float)
- storeroom (Integer)
```

#### groups (Accounting Groups)
```sql
- id (Integer, Primary Key)
- groupName (String)
- parentGroupId (Integer, Foreign Key → groups)
- userCompanyId (UUID, Foreign Key → user_companies)
- isDefault (Boolean)
- createdAt (DateTime)
- updatedAt (DateTime)
```

#### ledgers (Accounting Ledgers)
```sql
- id (UUID, Primary Key)
- ledgerName (String)
- acgroup (Integer, Foreign Key → groups)
- userCompanyId (UUID, Foreign Key → user_companies)
- openingBalance (Decimal)
- balanceType (Enum: Debit, Credit)
- isDefault (Boolean)
- createdAt (DateTime)
- updatedAt (DateTime)
```

#### items (Inventory Items)
```sql
- id (UUID, Primary Key)
- itemName (String)
- itemCode (String)
- hsnsac (UUID, Foreign Key → hsn_sacs)
- salt (UUID, Foreign Key → salts)
- unit1 (UUID, Foreign Key → units)
- unit2 (UUID, Foreign Key → units)
- rack (UUID, Foreign Key → racks)
- company (UUID, Foreign Key → companies)
- userCompanyId (UUID, Foreign Key → user_companies)
- taxcategory (UUID, Foreign Key → purchase_masters)
- quantity (Integer)
- rate (Decimal)
- createdAt (DateTime)
- updatedAt (DateTime)
```

#### bills (Sales Bills)
```sql
- id (UUID, Primary Key)
- billNumber (String)
- billDate (Date)
- userCompanyId (UUID, Foreign Key → user_companies)
- totalAmount (Decimal)
- taxAmount (Decimal)
- netAmount (Decimal)
- status (Enum: Draft, Finalized, Cancelled)
- createdAt (DateTime)
- updatedAt (DateTime)
```

#### bill_items (Bill Line Items)
```sql
- id (UUID, Primary Key)
- billId (UUID, Foreign Key → bills)
- itemId (UUID, Foreign Key → items)
- quantity (Integer)
- rate (Decimal)
- amount (Decimal)
- taxPercentage (Decimal)
- taxAmount (Decimal)
- createdAt (DateTime)
- updatedAt (DateTime)
```

### Relationships

```
User (1) ──────────────── (Many) UserCompany
UserCompany (1) ────────── (Many) Company
UserCompany (1) ────────── (Many) Group
UserCompany (1) ────────── (Many) Ledger
UserCompany (1) ────────── (Many) Item

Group (1) ──────────────── (Many) Ledger
Group (1) ──────────────── (Many) Group (Self-referencing for hierarchy)

Item (Many) ────────────── (1) Unit
Item (Many) ────────────── (1) Salt
Item (Many) ────────────── (1) Rack
Item (Many) ────────────── (1) Company

Bill (1) ──────────────── (Many) BillItem
BillItem (Many) ────────── (1) Item

SaleMaster (Many) ────────── (1) Ledger
PurchaseMaster (Many) ────── (1) Ledger
```

---

## Troubleshooting

### Common Issues

#### 1. Database Connection Error

**Error**: `Unable to connect to the database`

**Solution**:
```bash
# Check PostgreSQL is running
sudo systemctl status postgresql

# Verify database credentials in .env
# Verify database exists
psql -U postgres -l

# Test connection
psql -U postgres -h localhost -d pharmacydb
```

#### 2. Migration Fails

**Error**: `Migration failed: relation already exists`

**Solution**:
```bash
# Check existing migrations
npm run migrate:undo:all

# Re-run migrations
npm run migrate
```

#### 3. Seeder Fails

**Error**: `Foreign key constraint violation`

**Solution**:
```bash
# Ensure migrations ran successfully first
npm run migrate

# Then run seeders
npm run seed
```

#### 4. JWT Token Invalid

**Error**: `Invalid token` or `Token expired`

**Solution**:
```bash
# Ensure JWT_SECRET is set in .env
# Ensure token is sent in Authorization header
# Format: Authorization: Bearer <token>

# Refresh token if expired
POST /pharmacy/auth/refresh
```

#### 5. Port Already in Use

**Error**: `EADDRINUSE: address already in use :::3000`

**Solution**:
```bash
# Find process using port 3000
lsof -i :3000

# Kill process
kill -9 <PID>

# Or use different port
PORT=3001 npm run dev
```

#### 6. Permission Denied on Migrations

**Error**: `Permission denied` when running migrations

**Solution**:
```bash
# Ensure user has database privileges
psql -U postgres
GRANT ALL PRIVILEGES ON DATABASE pharmacydb TO pharmacyuser;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO pharmacyuser;
```

### Debug Mode

Enable detailed logging:

```bash
# Set debug environment variable
DEBUG=* npm run dev

# Or enable API logging
curl -X POST http://localhost:3000/pharmacy/logs/enable

# Check logs
curl http://localhost:3000/pharmacy/logs/stats
```

### Database Backup

```bash
# Backup database
pg_dump -U postgres pharmacydb > backup.sql

# Restore database
psql -U postgres pharmacydb < backup.sql
```

---

## Development Workflow

### Running Tests

```bash
# Run all tests
npm test

# Run specific test type
npm run test:unit
npm run test:integration
npm run test:e2e

# Run with coverage
npm test -- --coverage
```

### Code Quality

```bash
# Run linter
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format
```

### Generate Documentation

```bash
# Generate API documentation
npm run docs

# Documentation will be in docs/api/
```

---

## Production Deployment

### Pre-deployment Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Update `JWT_SECRET` with strong random key
- [ ] Configure production database
- [ ] Set up HTTPS/SSL certificates
- [ ] Configure CORS for production domains
- [ ] Enable rate limiting
- [ ] Set up monitoring and logging
- [ ] Configure backup strategy
- [ ] Test all migrations and seeders
- [ ] Review security settings

### Deployment Steps

```bash
# 1. Install dependencies
npm install --production

# 2. Run migrations
npm run migrate

# 3. Seed data (if needed)
npm run seed

# 4. Start server
npm start

# 5. Verify health
curl https://your-domain.com/pharmacy/security/health
```

---

## Support & Documentation

- **API Documentation**: See `docs/` folder
- **Security Guide**: See `docs/SECURITY.md`
- **Database Guide**: See `docs/FOLDER_STRUCTURE_COMPLETE.md`
- **Issues**: Create an issue in the repository

---

**Last Updated**: January 2025
**Version**: 1.0.0
**Maintained by**: ASR Pharma Team
