# ASR Pharma Backend

A comprehensive Pharmacy Management System backend built with Node.js, Express, and PostgreSQL.

## 🏗️ **Project Structure**

```
asr-pharma/
├── src/                          # Main source code
│   ├── app.js                    # Express app configuration
│   ├── server.js                 # Server entry point
│   ├── config/                   # Configuration files
│   │   ├── database.js
│   │   ├── security.js
│   │   └── index.js
│   ├── controllers/              # Request handlers
│   │   ├── auth/
│   │   ├── masters/
│   │   └── sales/
│   ├── services/                 # Business logic
│   ├── middleware/               # Custom middleware
│   │   ├── auth/
│   │   ├── security/
│   │   ├── logging/
│   │   └── permissions/
│   ├── routes/                   # Route definitions
│   │   ├── auth/
│   │   ├── masters/
│   │   └── sales/
│   ├── models/                   # Database models
│   │   ├── auth/
│   │   ├── masters/
│   │   └── sales/
│   ├── utils/                    # Utility functions
│   └── database/                 # Database related files
│       ├── migrations/
│       ├── seeders/
│       └── index.js
├── tests/                        # Test files
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── docs/                         # Documentation
├── logs/                         # Application logs
├── scripts/                      # Utility scripts
├── .env.example                  # Environment variables example
├── .gitignore
├── package.json
└── README.md
```

## 🚀 **Quick Start**

### **Prerequisites**
- Node.js >= 18.0.0
- PostgreSQL >= 12.0
- Redis (optional, for rate limiting)

### **Installation**

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd asr-pharma
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

4. **Database Setup**
   ```bash
   # Run migrations
   npm run migrate
   
   # Seed initial data
   npm run seed
   ```

5. **Start the server**
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

## 📋 **Available Scripts**

| Script | Description |
|--------|-------------|
| `npm start` | Start production server |
| `npm run dev` | Start development server with nodemon |
| `npm test` | Run all tests |
| `npm run test:unit` | Run unit tests |
| `npm run test:integration` | Run integration tests |
| `npm run test:e2e` | Run end-to-end tests |
| `npm run migrate` | Run database migrations |
| `npm run seed` | Seed database with initial data |
| `npm run lint` | Run ESLint |
| `npm run format` | Format code with Prettier |
| `npm run docs` | Generate API documentation |

## 🔧 **Configuration**

### **Environment Variables**

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=pharmacy_db
DB_USER=postgres
DB_PASSWORD=your_password

# JWT Configuration
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Redis Configuration (Optional)
REDIS_URL=redis://localhost:6379

# API Logging
API_LOGGING_ENABLED=true
API_LOG_TO_FILE=true
API_LOG_LEVEL=info
```

## 🔐 **Security Features**

- **JWT Authentication** with access and refresh tokens
- **Rate Limiting** to prevent abuse
- **Input Validation** with express-validator
- **Security Headers** with helmet
- **XSS Protection** with xss-clean
- **CORS Configuration** for cross-origin requests
- **Password Hashing** with bcrypt
- **Token Blacklisting** for secure logout

## 📊 **API Endpoints**

### **Authentication**
- `POST /pharmacy/auth/signin` - User login
- `POST /pharmacy/auth/signup` - User registration
- `POST /pharmacy/auth/refresh` - Refresh token
- `POST /pharmacy/auth/logout` - User logout

### **Masters**
- `GET /pharmacy/admin/master/items` - Get items
- `POST /pharmacy/admin/master/items` - Create item
- `PUT /pharmacy/admin/master/items/:id` - Update item
- `DELETE /pharmacy/admin/master/items/:id` - Delete item

### **Sales**
- `GET /pharmacy/sales/bills/v1` - Get bills
- `POST /pharmacy/sales/bills/v1` - Create bill
- `PUT /pharmacy/sales/bills/v1/:id` - Update bill
- `DELETE /pharmacy/sales/bills/v1/:id` - Delete bill

## 🧪 **Testing**

### **Run Tests**
```bash
# All tests
npm test

# Specific test types
npm run test:unit
npm run test:integration
npm run test:e2e
```

### **Test Structure**
- **Unit Tests**: Test individual functions and modules
- **Integration Tests**: Test API endpoints and database operations
- **E2E Tests**: Test complete user workflows

## 📚 **Documentation**

- **API Documentation**: `docs/api/`
- **Setup Guides**: `docs/setup/`
- **User Guides**: `docs/guides/`

## 🔄 **Database Migrations**

### **Run Migrations**
```bash
# Run all pending migrations
npm run migrate

# Undo last migration
npm run migrate:undo

# Run specific migration
npx sequelize-cli db:migrate --to 20250724204536-create-users.js
```

### **Seed Data**
```bash
# Run all seeders
npm run seed

# Undo all seeders
npm run seed:undo
```

## 🚀 **Deployment**

### **Production Setup**
1. Set `NODE_ENV=production`
2. Configure production database
3. Set secure JWT secret
4. Enable logging
5. Configure CORS for production domains

### **Docker Deployment**
```bash
# Build image
docker build -t asr-pharma .

# Run container
docker run -p 3000:3000 asr-pharma
```

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Run linting and tests
6. Submit a pull request

## 📄 **License**

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 **Support**

For support and questions:
- Create an issue in the repository
- Check the documentation in `docs/`
- Review the API documentation

---

**Built with ❤️ by ASR Pharma Team** 