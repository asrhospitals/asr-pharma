/**
 * @swagger
 * /pharmacy/auth/send-otp:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Send OTP to phone
 *     description: Sends a one-time password to the user's phone number
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phone:
 *                 type: string
 *                 example: "+919876543210"
 *     responses:
 *       200:
 *         description: OTP sent successfully
 *       400:
 *         description: Invalid phone number
 *       429:
 *         description: Too many requests
 *
 * /pharmacy/auth/verify-otp:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Verify OTP
 *     description: Verifies the OTP sent to user's phone
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phone:
 *                 type: string
 *               otp:
 *                 type: string
 *     responses:
 *       200:
 *         description: OTP verified successfully
 *       400:
 *         description: Invalid OTP
 *
 * /pharmacy/auth/signup:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: User registration
 *     description: Register a new user account
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - uname
 *               - pwd
 *               - email
 *               - phone
 *               - fname
 *               - lname
 *             properties:
 *               uname:
 *                 type: string
 *                 example: "john_doe"
 *               pwd:
 *                 type: string
 *                 format: password
 *               email:
 *                 type: string
 *                 format: email
 *               phone:
 *                 type: string
 *               fname:
 *                 type: string
 *               lname:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Invalid input or user already exists
 *
 * /pharmacy/auth/signin:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: User login
 *     description: Authenticate user and get JWT tokens
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - uname
 *               - pwd
 *             properties:
 *               uname:
 *                 type: string
 *               pwd:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       401:
 *         description: Invalid credentials
 *       429:
 *         description: Too many login attempts
 *
 * /pharmacy/auth/refresh:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Refresh JWT token
 *     description: Get new access token using refresh token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Token refreshed successfully
 *       401:
 *         description: Invalid refresh token
 *
 * /pharmacy/auth/logout:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: User logout
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 *
 * /pharmacy/auth/profile:
 *   get:
 *     tags:
 *       - Authentication
 *     summary: Get user profile
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *   put:
 *     tags:
 *       - Authentication
 *     summary: Update user profile
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fname:
 *                 type: string
 *               lname:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *
 * /pharmacy/auth/change-password:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Change password
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               oldPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password changed successfully
 *
 * /pharmacy/auth/switch-company:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Switch active company
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               companyId:
 *                 type: string
 *                 format: uuid
 *     responses:
 *       200:
 *         description: Company switched successfully
 */


/**
 * @swagger
 * /pharmacy/admin/master/ledger/v1/add-ledger:
 *   post:
 *     tags:
 *       - Accounting - Ledgers
 *     summary: Create new ledger
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - ledgerName
 *               - acgroup
 *             properties:
 *               ledgerName:
 *                 type: string
 *               acgroup:
 *                 type: integer
 *               openingBalance:
 *                 type: number
 *               balanceType:
 *                 type: string
 *                 enum: [Debit, Credit]
 *     responses:
 *       201:
 *         description: Ledger created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Ledger'
 *       400:
 *         description: Invalid input
 *
 * /pharmacy/admin/master/ledger/v1/get-ledger:
 *   get:
 *     tags:
 *       - Accounting - Ledgers
 *     summary: Get all ledgers
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: page
 *         in: query
 *         schema:
 *           type: integer
 *       - name: limit
 *         in: query
 *         schema:
 *           type: integer
 *       - name: search
 *         in: query
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of ledgers
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Ledger'
 *
 * /pharmacy/admin/master/ledger/v1/get-ledger/{id}:
 *   get:
 *     tags:
 *       - Accounting - Ledgers
 *     summary: Get ledger by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Ledger details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Ledger'
 *       404:
 *         description: Ledger not found
 *
 * /pharmacy/admin/master/ledger/v1/update-ledger/{id}:
 *   put:
 *     tags:
 *       - Accounting - Ledgers
 *     summary: Update ledger
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ledgerName:
 *                 type: string
 *               acgroup:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Ledger updated successfully
 *
 * /pharmacy/admin/master/ledger/v1/delete-ledger/{id}:
 *   delete:
 *     tags:
 *       - Accounting - Ledgers
 *     summary: Delete ledger
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Ledger deleted successfully
 *       404:
 *         description: Ledger not found
 *
 * /pharmacy/admin/master/ledger/v1/{id}/balance:
 *   get:
 *     tags:
 *       - Accounting - Ledgers
 *     summary: Get ledger balance
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Ledger balance
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 balance:
 *                   type: number
 *                 balanceType:
 *                   type: string
 *
 * /pharmacy/admin/master/ledger/v1/{id}/transactions:
 *   get:
 *     tags:
 *       - Accounting - Ledgers
 *     summary: Get ledger transactions
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *       - name: startDate
 *         in: query
 *         schema:
 *           type: string
 *           format: date
 *       - name: endDate
 *         in: query
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: List of transactions
 *
 * /pharmacy/admin/master/ledger/v1/{id}/opening-balance:
 *   put:
 *     tags:
 *       - Accounting - Ledgers
 *     summary: Update opening balance
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               openingBalance:
 *                 type: number
 *               balanceType:
 *                 type: string
 *                 enum: [Debit, Credit]
 *     responses:
 *       200:
 *         description: Opening balance updated
 */


/**
 * @swagger
 * /pharmacy/api/groups:
 *   post:
 *     tags:
 *       - Accounting - Groups
 *     summary: Create accounting group
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - groupName
 *             properties:
 *               groupName:
 *                 type: string
 *               parentGroupId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Group created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Group'
 *   get:
 *     tags:
 *       - Accounting - Groups
 *     summary: Get all groups
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of groups
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Group'
 *
 * /pharmacy/api/groups/hierarchy:
 *   get:
 *     tags:
 *       - Accounting - Groups
 *     summary: Get group hierarchy
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Group hierarchy
 *
 * /pharmacy/api/groups/type/{groupType}:
 *   get:
 *     tags:
 *       - Accounting - Groups
 *     summary: Get groups by type
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: groupType
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Groups of specified type
 *
 * /pharmacy/api/groups/{id}:
 *   get:
 *     tags:
 *       - Accounting - Groups
 *     summary: Get group by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Group details
 *   put:
 *     tags:
 *       - Accounting - Groups
 *     summary: Update group
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               groupName:
 *                 type: string
 *     responses:
 *       200:
 *         description: Group updated successfully
 *   delete:
 *     tags:
 *       - Accounting - Groups
 *     summary: Delete group
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Group deleted successfully
 */


/**
 * @swagger
 * /pharmacy/admin/master/inventory/item/v1/add-item:
 *   post:
 *     tags:
 *       - Inventory - Items
 *     summary: Create new item
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - itemName
 *               - itemCode
 *             properties:
 *               itemName:
 *                 type: string
 *               itemCode:
 *                 type: string
 *               hsnsac:
 *                 type: string
 *                 format: uuid
 *               salt:
 *                 type: string
 *                 format: uuid
 *               unit1:
 *                 type: string
 *                 format: uuid
 *               rack:
 *                 type: string
 *                 format: uuid
 *               quantity:
 *                 type: integer
 *               rate:
 *                 type: number
 *     responses:
 *       201:
 *         description: Item created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Item'
 *
 * /pharmacy/admin/master/inventory/item/v1/get-item:
 *   get:
 *     tags:
 *       - Inventory - Items
 *     summary: Get all items
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: page
 *         in: query
 *         schema:
 *           type: integer
 *       - name: limit
 *         in: query
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of items
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Item'
 *
 * /pharmacy/admin/master/inventory/item/v1/get-items/{id}:
 *   get:
 *     tags:
 *       - Inventory - Items
 *     summary: Get item by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Item details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Item'
 *
 * /pharmacy/admin/master/inventory/item/v1/update-item/{id}:
 *   put:
 *     tags:
 *       - Inventory - Items
 *     summary: Update item
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               itemName:
 *                 type: string
 *               quantity:
 *                 type: integer
 *               rate:
 *                 type: number
 *     responses:
 *       200:
 *         description: Item updated successfully
 *
 * /pharmacy/admin/master/inventory/item/v1/delete-item/{id}:
 *   delete:
 *     tags:
 *       - Inventory - Items
 *     summary: Delete item
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Item deleted successfully
 */


/**
 * @swagger
 * /pharmacy/sales/bills/v1:
 *   post:
 *     tags:
 *       - Sales - Bills
 *     summary: Create sales bill
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - billDate
 *               - items
 *             properties:
 *               billDate:
 *                 type: string
 *                 format: date
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     itemId:
 *                       type: string
 *                       format: uuid
 *                     quantity:
 *                       type: integer
 *                     rate:
 *                       type: number
 *               discount:
 *                 type: number
 *               status:
 *                 type: string
 *                 enum: [Draft, Finalized]
 *     responses:
 *       201:
 *         description: Bill created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Bill'
 *
 * /pharmacy/sales/bills/v1/:
 *   get:
 *     tags:
 *       - Sales - Bills
 *     summary: Get all sales bills
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: page
 *         in: query
 *         schema:
 *           type: integer
 *       - name: limit
 *         in: query
 *         schema:
 *           type: integer
 *       - name: status
 *         in: query
 *         schema:
 *           type: string
 *           enum: [Draft, Finalized, Cancelled]
 *       - name: startDate
 *         in: query
 *         schema:
 *           type: string
 *           format: date
 *       - name: endDate
 *         in: query
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: List of bills
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Bill'
 *
 * /pharmacy/sales/bills/v1/{id}:
 *   get:
 *     tags:
 *       - Sales - Bills
 *     summary: Get bill by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Bill details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Bill'
 *   put:
 *     tags:
 *       - Sales - Bills
 *     summary: Update bill
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               billDate:
 *                 type: string
 *                 format: date
 *               items:
 *                 type: array
 *               discount:
 *                 type: number
 *     responses:
 *       200:
 *         description: Bill updated successfully
 *   delete:
 *     tags:
 *       - Sales - Bills
 *     summary: Delete bill
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Bill deleted successfully
 *
 * /pharmacy/sales/bills/v1/{id}/payment:
 *   post:
 *     tags:
 *       - Sales - Bills
 *     summary: Record payment for bill
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *               paymentMethod:
 *                 type: string
 *                 enum: [Cash, Cheque, Card, Online]
 *               paymentDate:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Payment recorded successfully
 *
 * /pharmacy/sales/bills/v1/{id}/status:
 *   patch:
 *     tags:
 *       - Sales - Bills
 *     summary: Change bill status
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [Draft, Finalized, Cancelled]
 *     responses:
 *       200:
 *         description: Bill status updated
 */


/**
 * @swagger
 * /pharmacy/admin/purchase/bill/v1/create:
 *   post:
 *     tags:
 *       - Purchase - Bills
 *     summary: Create purchase bill
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - billDate
 *               - items
 *             properties:
 *               billDate:
 *                 type: string
 *                 format: date
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *               discount:
 *                 type: number
 *     responses:
 *       201:
 *         description: Purchase bill created successfully
 *
 * /pharmacy/admin/purchase/bill/v1/get-all:
 *   get:
 *     tags:
 *       - Purchase - Bills
 *     summary: Get all purchase bills
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of purchase bills
 *
 * /pharmacy/admin/purchase/bill/v1/get/{id}:
 *   get:
 *     tags:
 *       - Purchase - Bills
 *     summary: Get purchase bill by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Purchase bill details
 *
 * /pharmacy/admin/purchase/bill/v1/update/{id}:
 *   put:
 *     tags:
 *       - Purchase - Bills
 *     summary: Update purchase bill
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Purchase bill updated successfully
 *
 * /pharmacy/admin/purchase/bill/v1/delete/{id}:
 *   delete:
 *     tags:
 *       - Purchase - Bills
 *     summary: Delete purchase bill
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Purchase bill deleted successfully
 */


/**
 * @swagger
 * /pharmacy/admin/master/transaction/v1/create:
 *   post:
 *     tags:
 *       - Accounting - Transactions
 *     summary: Create journal entry
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fromLedgerId
 *               - toLedgerId
 *               - amount
 *             properties:
 *               fromLedgerId:
 *                 type: string
 *                 format: uuid
 *               toLedgerId:
 *                 type: string
 *                 format: uuid
 *               amount:
 *                 type: number
 *               description:
 *                 type: string
 *               transactionDate:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Transaction created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Transaction'
 *
 * /pharmacy/admin/master/transaction/v1/list:
 *   get:
 *     tags:
 *       - Accounting - Transactions
 *     summary: Get all transactions
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: page
 *         in: query
 *         schema:
 *           type: integer
 *       - name: limit
 *         in: query
 *         schema:
 *           type: integer
 *       - name: startDate
 *         in: query
 *         schema:
 *           type: string
 *           format: date
 *       - name: endDate
 *         in: query
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: List of transactions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Transaction'
 *
 * /pharmacy/admin/master/transaction/v1/{id}:
 *   get:
 *     tags:
 *       - Accounting - Transactions
 *     summary: Get transaction by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Transaction details
 *   put:
 *     tags:
 *       - Accounting - Transactions
 *     summary: Update transaction
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Transaction updated successfully
 *   delete:
 *     tags:
 *       - Accounting - Transactions
 *     summary: Delete transaction
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Transaction deleted successfully
 *
 * /pharmacy/admin/master/transaction/v1/{id}/post:
 *   post:
 *     tags:
 *       - Accounting - Transactions
 *     summary: Post transaction
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Transaction posted successfully
 *
 * /pharmacy/admin/master/transaction/v1/{id}/cancel:
 *   post:
 *     tags:
 *       - Accounting - Transactions
 *     summary: Cancel transaction
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Transaction cancelled successfully
 */


/**
 * @swagger
 * /pharmacy/admin/master/inventory/store/v1/add-store:
 *   post:
 *     tags:
 *       - Inventory - Stores
 *     summary: Create store
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - storeName
 *             properties:
 *               storeName:
 *                 type: string
 *               storeCode:
 *                 type: string
 *               address:
 *                 type: string
 *               city:
 *                 type: string
 *               state:
 *                 type: string
 *               pinCode:
 *                 type: string
 *               phone:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       201:
 *         description: Store created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Store'
 *
 * /pharmacy/admin/master/inventory/store/v1/get-store:
 *   get:
 *     tags:
 *       - Inventory - Stores
 *     summary: Get all stores
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of stores
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Store'
 *
 * /pharmacy/admin/master/inventory/store/v1/get-stores/{id}:
 *   get:
 *     tags:
 *       - Inventory - Stores
 *     summary: Get store by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Store details
 *
 * /pharmacy/admin/master/inventory/store/v1/update-store/{id}:
 *   put:
 *     tags:
 *       - Inventory - Stores
 *     summary: Update store
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Store updated successfully
 *
 * /pharmacy/admin/master/inventory/store/v1/delete-store/{id}:
 *   delete:
 *     tags:
 *       - Inventory - Stores
 *     summary: Delete store
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Store deleted successfully
 */


/**
 * @swagger
 * /pharmacy/admin/master/other/doctor/v1/add-doctor:
 *   post:
 *     tags:
 *       - Masters - Doctors
 *     summary: Create doctor
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - doctorName
 *             properties:
 *               doctorName:
 *                 type: string
 *               doctorCode:
 *                 type: string
 *               specialization:
 *                 type: string
 *               phone:
 *                 type: string
 *               email:
 *                 type: string
 *               address:
 *                 type: string
 *     responses:
 *       201:
 *         description: Doctor created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Doctor'
 *
 * /pharmacy/admin/master/other/doctor/v1/get-doctor:
 *   get:
 *     tags:
 *       - Masters - Doctors
 *     summary: Get all doctors
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of doctors
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Doctor'
 *
 * /pharmacy/admin/master/other/doctor/v1/get-doctors/{id}:
 *   get:
 *     tags:
 *       - Masters - Doctors
 *     summary: Get doctor by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Doctor details
 *
 * /pharmacy/admin/master/other/doctor/v1/update-doctor/{id}:
 *   put:
 *     tags:
 *       - Masters - Doctors
 *     summary: Update doctor
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Doctor updated successfully
 *
 * /pharmacy/admin/master/other/doctor/v1/delete-doctor/{id}:
 *   delete:
 *     tags:
 *       - Masters - Doctors
 *     summary: Delete doctor
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Doctor deleted successfully
 *
 * /pharmacy/admin/master/other/patient/v1/add-patient:
 *   post:
 *     tags:
 *       - Masters - Patients
 *     summary: Create patient
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - patientName
 *             properties:
 *               patientName:
 *                 type: string
 *               patientCode:
 *                 type: string
 *               age:
 *                 type: integer
 *               gender:
 *                 type: string
 *                 enum: [Male, Female, Other]
 *               phone:
 *                 type: string
 *               email:
 *                 type: string
 *               address:
 *                 type: string
 *     responses:
 *       201:
 *         description: Patient created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Patient'
 *
 * /pharmacy/admin/master/other/patient/v1/get-patient:
 *   get:
 *     tags:
 *       - Masters - Patients
 *     summary: Get all patients
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of patients
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Patient'
 *
 * /pharmacy/admin/master/other/patient/v1/get-patients/{id}:
 *   get:
 *     tags:
 *       - Masters - Patients
 *     summary: Get patient by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Patient details
 *
 * /pharmacy/admin/master/other/patient/v1/update-patient/{id}:
 *   put:
 *     tags:
 *       - Masters - Patients
 *     summary: Update patient
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Patient updated successfully
 *
 * /pharmacy/admin/master/other/patient/v1/delete-patient/{id}:
 *   delete:
 *     tags:
 *       - Masters - Patients
 *     summary: Delete patient
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Patient deleted successfully
 */
