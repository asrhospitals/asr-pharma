const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const basicAuth = require('express-basic-auth');

// Swagger UI credentials from environment or defaults
const SWAGGER_USER = process.env.SWAGGER_USER || 'admin';
const SWAGGER_PASSWORD = process.env.SWAGGER_PASSWORD || 'swagger123';

// Basic auth middleware for Swagger UI
const swaggerAuthMiddleware = basicAuth({
  users: { [SWAGGER_USER]: SWAGGER_PASSWORD },
  challenge: true,
  realm: 'ASR Pharma API Documentation',
});

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'ASR Pharma Management System API',
      version: '1.0.0',
      description: 'Comprehensive Pharmacy Management System API with authentication, inventory, accounting, and billing modules',
      contact: {
        name: 'ASR Pharma Team',
        email: 'support@asrpharma.com',
      },
      license: {
        name: 'MIT',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
      {
        url: 'https://asrpharma.asrhospitalindia.in',
        description: 'Production server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT token obtained from login endpoint',
        },
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false,
            },
            message: {
              type: 'string',
              example: 'Error message',
            },
            code: {
              type: 'string',
              example: 'ERROR_CODE',
            },
          },
        },
        User: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            uname: { type: 'string' },
            fname: { type: 'string' },
            lname: { type: 'string' },
            email: { type: 'string', format: 'email' },
            phone: { type: 'string' },
            role: { type: 'string', enum: ['admin', 'manager', 'user'] },
            isactive: { type: 'string', enum: ['active', 'inactive'] },
            phoneVerified: { type: 'boolean' },
            emailVerified: { type: 'boolean' },
            activeCompanyId: { type: 'string', format: 'uuid' },
            lastLoginAt: { type: 'string', format: 'date-time' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        AuthResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
            data: {
              type: 'object',
              properties: {
                user: { $ref: '#/components/schemas/User' },
                accessToken: { type: 'string' },
                refreshToken: { type: 'string' },
              },
            },
          },
        },
        Ledger: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            ledgerName: { type: 'string' },
            acgroup: { type: 'integer' },
            userCompanyId: { type: 'string', format: 'uuid' },
            openingBalance: { type: 'number', format: 'decimal' },
            balanceType: { type: 'string', enum: ['Debit', 'Credit'] },
            isDefault: { type: 'boolean' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        Group: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            groupName: { type: 'string' },
            parentGroupId: { type: 'integer', nullable: true },
            userCompanyId: { type: 'string', format: 'uuid' },
            isDefault: { type: 'boolean' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        Item: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            itemName: { type: 'string' },
            itemCode: { type: 'string' },
            hsnsac: { type: 'string', format: 'uuid' },
            salt: { type: 'string', format: 'uuid' },
            unit1: { type: 'string', format: 'uuid' },
            unit2: { type: 'string', format: 'uuid', nullable: true },
            rack: { type: 'string', format: 'uuid' },
            company: { type: 'string', format: 'uuid' },
            userCompanyId: { type: 'string', format: 'uuid' },
            taxcategory: { type: 'string', format: 'uuid' },
            quantity: { type: 'integer' },
            rate: { type: 'number', format: 'decimal' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        Bill: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            billNumber: { type: 'string' },
            billDate: { type: 'string', format: 'date' },
            userCompanyId: { type: 'string', format: 'uuid' },
            totalAmount: { type: 'number', format: 'decimal' },
            taxAmount: { type: 'number', format: 'decimal' },
            netAmount: { type: 'number', format: 'decimal' },
            status: { type: 'string', enum: ['Draft', 'Finalized', 'Cancelled'] },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        Transaction: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            fromLedgerId: { type: 'string', format: 'uuid' },
            toLedgerId: { type: 'string', format: 'uuid' },
            amount: { type: 'number', format: 'decimal' },
            description: { type: 'string' },
            transactionDate: { type: 'string', format: 'date' },
            status: { type: 'string', enum: ['Draft', 'Posted', 'Cancelled'] },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        Store: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            storeName: { type: 'string' },
            storeCode: { type: 'string' },
            address: { type: 'string' },
            city: { type: 'string' },
            state: { type: 'string' },
            pinCode: { type: 'string' },
            phone: { type: 'string' },
            email: { type: 'string', format: 'email' },
            userCompanyId: { type: 'string', format: 'uuid' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        Doctor: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            doctorName: { type: 'string' },
            doctorCode: { type: 'string' },
            specialization: { type: 'string' },
            phone: { type: 'string' },
            email: { type: 'string', format: 'email' },
            address: { type: 'string' },
            userCompanyId: { type: 'string', format: 'uuid' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        Patient: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            patientName: { type: 'string' },
            patientCode: { type: 'string' },
            age: { type: 'integer' },
            gender: { type: 'string', enum: ['Male', 'Female', 'Other'] },
            phone: { type: 'string' },
            email: { type: 'string', format: 'email' },
            address: { type: 'string' },
            userCompanyId: { type: 'string', format: 'uuid' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ['./src/routes/**/*.js'],
};

const specs = swaggerJsdoc(options);

const setupSwagger = (app) => {
  // Serve Swagger UI with basic authentication
  app.use('/api-docs', swaggerAuthMiddleware, swaggerUi.serve);
  
  app.get('/api-docs', swaggerAuthMiddleware, swaggerUi.setup(specs, {
    swaggerOptions: {
      persistAuthorization: true,
      displayOperationId: true,
      filter: true,
      showRequestHeaders: true,
      layout: 'BaseLayout',
    },
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'ASR Pharma API Documentation',
  }));

  // Serve OpenAPI spec with basic authentication
  app.get('/api-docs.json', swaggerAuthMiddleware, (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(specs);
  });

  // Log Swagger credentials and URL
  console.log('\n📚 SWAGGER UI DOCUMENTATION');
  console.log('═══════════════════════════════════════════════════════════');
  console.log(`🔐 Swagger UI: http://localhost:${process.env.PORT || 3000}/api-docs`);
  console.log(`👤 Username: ${SWAGGER_USER}`);
  console.log(`🔑 Password: ${SWAGGER_PASSWORD}`);
  console.log('═══════════════════════════════════════════════════════════\n');
};

module.exports = setupSwagger;
