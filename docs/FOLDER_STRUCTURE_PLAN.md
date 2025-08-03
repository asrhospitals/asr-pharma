# Backend Folder Structure Reorganization Plan

## 🎯 **Current Issues**

1. **Mixed naming conventions**: `controller/` vs `controllers/`
2. **Scattered test files**: Multiple test files in root directory
3. **Documentation scattered**: Multiple summary files in root
4. **Inconsistent organization**: Some folders not following standard patterns
5. **Missing standard folders**: No `src/`, `tests/`, `docs/` organization

## 🏗️ **Proposed New Structure**

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
│   │   │   └── authController.js
│   │   ├── masters/
│   │   │   ├── account/
│   │   │   ├── inventory/
│   │   │   └── other/
│   │   └── sales/
│   │       └── billController.js
│   ├── services/                 # Business logic
│   │   ├── authService.js
│   │   ├── userService.js
│   │   └── groupPermissionService.js
│   ├── middleware/               # Custom middleware
│   │   ├── auth/
│   │   │   ├── authMiddleware.js
│   │   │   └── roleMiddleware.js
│   │   ├── security/
│   │   │   ├── enhancedAuth.js
│   │   │   ├── inputValidation.js
│   │   │   ├── rateLimiter.js
│   │   │   ├── securityHeaders.js
│   │   │   └── index.js
│   │   ├── logging/
│   │   │   └── apiLogger.js
│   │   └── permissions/
│   │       └── groupPermissionMiddleware.js
│   ├── routes/                   # Route definitions
│   │   ├── auth/
│   │   │   └── authRoutes.js
│   │   ├── masters/
│   │   │   ├── accountRoutes.js
│   │   │   ├── groupRoutes.js
│   │   │   └── masterRoutes.js
│   │   └── sales/
│   │       └── billRoutes.js
│   ├── models/                   # Database models
│   │   ├── auth/
│   │   │   └── user.js
│   │   ├── masters/
│   │   │   ├── account/
│   │   │   ├── inventory/
│   │   │   └── other/
│   │   └── sales/
│   │       ├── bill.js
│   │       └── billItem.js
│   ├── utils/                    # Utility functions
│   │   ├── queryOptions.js
│   │   ├── validators.js
│   │   └── helpers.js
│   └── database/                 # Database related files
│       ├── migrations/
│       ├── seeders/
│       └── index.js
├── tests/                        # Test files
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── docs/                         # Documentation
│   ├── api/
│   ├── setup/
│   └── guides/
├── logs/                         # Application logs
├── scripts/                      # Utility scripts
├── .env.example                  # Environment variables example
├── .gitignore
├── package.json
└── README.md
```

## 🔄 **Migration Steps**

### **Phase 1: Create New Structure**
1. Create `src/` directory
2. Move main application files
3. Reorganize existing folders

### **Phase 2: Update Imports**
1. Update all require statements
2. Fix import paths
3. Update package.json scripts

### **Phase 3: Clean Up**
1. Remove old folders
2. Organize test files
3. Consolidate documentation

## 📋 **Benefits of New Structure**

1. **Clear Separation**: Source code, tests, docs separated
2. **Scalable**: Easy to add new features
3. **Maintainable**: Logical organization
4. **Industry Standard**: Follows Node.js best practices
5. **Team Friendly**: Easy for new developers to understand

## 🚀 **Implementation Plan**

1. **Create new structure**
2. **Move files systematically**
3. **Update all imports**
4. **Test functionality**
5. **Update documentation**
6. **Clean up old files** 