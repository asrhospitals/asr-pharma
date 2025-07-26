# Accounting Group Permission System

## Overview

This document explains the comprehensive permission system implemented for accounting groups in the ASR Pharma software. The system is designed to control access to ledgers, transactions, and reports based on user roles and group-specific permissions, with support for **unlimited hierarchical group creation**.

## Key Features

### 🏗️ **Unlimited Hierarchy Support**
- Create unlimited levels of sub-groups within any group
- Automatic permission inheritance from parent groups
- Recursive hierarchy management
- Visual tree structure with expand/collapse functionality

### 🔐 **Permission Inheritance**
- Sub-groups automatically inherit all permissions from their parent group
- Permissions cascade down through the entire hierarchy
- Maintains data integrity and security across all levels

## Architecture

### 1. Database Models

#### Group Model (`models/masters/accountMaster/group.js`)
- **Purpose**: Stores accounting group information with hierarchical support
- **Key Fields**:
  - `groupName`: Unique name of the group
  - `groupType`: Asset, Liability, Income, Expense, or Capital
  - `parentGroupId`: Foreign key to parent group (enables unlimited hierarchy)
  - `undergroup`: Parent group name for display purposes
  - `isDefault`: Whether it's a system default group
  - `isEditable`: Whether the group can be edited
  - `isDeletable`: Whether the group can be deleted
  - `level`: Hierarchical level (computed field)

#### GroupPermission Model (`models/masters/accountMaster/groupPermission.js`)
- **Purpose**: Stores granular permissions for each user-group combination
- **Key Permission Fields**:
  - Ledger permissions: `canCreateLedger`, `canEditLedger`, `canDeleteLedger`, `canViewLedger`
  - Transaction permissions: `canCreateTransaction`, `canEditTransaction`, `canDeleteTransaction`, `canViewTransaction`
  - Report permissions: `canViewReport`, `canExportReport`
  - Balance permissions: `canViewBalance`, `canModifyBalance`, `canSetOpeningBalance`
  - Group management: `canCreateSubGroup`, `canEditGroup`, `canDeleteGroup`

### 2. Default Groups

The system includes the following default accounting groups (as shown in the image):

#### Parent Groups
- Branch / Divisions
- Capital Account
- Current Assets
- Current Liabilities
- Fixed Assets
- Investments
- Loans (Liability)
- Misc.Expenses(ASSET)
- Profit & Loss
- Revenue Account
- Suspense Accounts

#### Sub-Groups
- **Under Capital Account**: Share Capital, Reserves & Surplus
- **Under Current Assets**: Bank Accounts, Cash in Hand, Sundry Debtors
- **Under Current Liabilities**: Sundry Creditors, Bank Overdraft
- **Under Loans (Liability)**: Secured Loans, Unsecured Loans
- **Under Revenue Account**: Sales, Other Income

## Unlimited Hierarchy Implementation

### 1. Hierarchical Group Creation

#### Creating Sub-Groups
```javascript
// Example: Create a sub-group under "Current Assets"
const newGroup = {
  groupName: "Petty Cash",
  undergroup: "Current Assets",
  groupType: "Asset", // Inherited from parent
  parentGroupId: currentAssetsGroupId,
  description: "Petty cash accounts"
};

// The system will:
// 1. Automatically inherit group type from parent
// 2. Inherit all permissions from parent group
// 3. Allow further sub-groups under this new group
```

#### Permission Inheritance
```javascript
// When creating a sub-group, permissions are automatically inherited:
const inheritedPermissions = {
  canCreateLedger: parentPermission.canCreateLedger,
  canEditLedger: parentPermission.canEditLedger,
  canDeleteLedger: parentPermission.canDeleteLedger,
  canViewLedger: parentPermission.canViewLedger,
  canCreateTransaction: parentPermission.canCreateTransaction,
  canEditTransaction: parentPermission.canEditTransaction,
  canDeleteTransaction: parentPermission.canDeleteTransaction,
  canViewTransaction: parentPermission.canViewTransaction,
  canViewReport: parentPermission.canViewReport,
  canExportReport: parentPermission.canExportReport,
  canViewBalance: parentPermission.canViewBalance,
  canModifyBalance: parentPermission.canModifyBalance,
  canSetOpeningBalance: parentPermission.canSetOpeningBalance,
  canCreateSubGroup: parentPermission.canCreateSubGroup,
  canEditGroup: parentPermission.canEditGroup,
  canDeleteGroup: parentPermission.canDeleteGroup
};
```

### 2. Hierarchy Management

#### Recursive Hierarchy Building
```javascript
// Build unlimited hierarchy recursively
const buildHierarchy = (groups, parentId = null, level = 0) => {
  return groups
    .filter(group => group.parentGroupId === parentId)
    .map(group => ({
      ...group.toJSON(),
      level,
      children: buildHierarchy(groups, group.id, level + 1)
    }));
};
```

#### Sub-Group Validation
```javascript
// Check for sub-groups recursively before deletion
const hasSubGroups = async (groupId) => {
  const subGroups = await Group.findAll({ where: { parentGroupId: groupId } });
  
  if (subGroups.length > 0) {
    return true;
  }

  // Check recursively
  for (const subGroup of subGroups) {
    const hasNestedSubGroups = await hasSubGroups(subGroup.id);
    if (hasNestedSubGroups) {
      return true;
    }
  }

  return false;
};
```

### 3. API Endpoints for Hierarchy

#### Group Management
- `POST /api/groups` - Create new group (with parent support)
- `GET /api/groups` - Get all accessible groups
- `GET /api/groups/hierarchy` - Get complete hierarchy tree
- `GET /api/groups/parent/:parentId` - Get groups by parent
- `GET /api/groups/available-parents` - Get available parent groups
- `GET /api/groups/:id` - Get specific group
- `PUT /api/groups/:id` - Update group
- `DELETE /api/groups/:id` - Delete group

#### Permission Management
- `GET /api/groups/:groupId/permissions` - Get group permissions
- `POST /api/groups/:groupId/permissions/:userId` - Set user permissions for group

## Permission System

### 1. Role-Based Permissions

Different user roles have different levels of access:

#### Admin
- Full access to all groups and operations
- Can manage all permissions
- Can create, edit, and delete any group
- Can create unlimited hierarchy levels

#### Accountant
- Full access to accounting operations
- Can create ledgers and transactions
- Can view and export reports
- Can modify opening balances
- Can create sub-groups under accessible groups

#### Manager
- Similar to accountant but with group management capabilities
- Can create unlimited sub-groups
- Can edit group properties
- Can manage group hierarchy

#### Accounts Officer
- Full accounting permissions
- Can manage ledgers and transactions
- Can view audit logs
- Can create sub-groups

#### Auditor
- Read-only access to all accounting data
- Can view reports and transactions
- Cannot modify any data
- Can view complete hierarchy

#### Viewer
- Minimal read-only access
- Can view basic information only
- Can view hierarchy structure

### 2. Group-Type-Based Permissions

Different group types have different default permissions:

#### Asset Groups
- ✅ Can create and edit ledgers
- ❌ Cannot delete ledgers (preserves data integrity)
- ✅ Can create and edit transactions
- ❌ Cannot delete transactions
- ✅ Can view reports and balances
- ❌ Cannot modify opening balances (restricted)
- ✅ Can create unlimited sub-groups

#### Liability Groups
- ✅ Can create and edit ledgers
- ❌ Cannot delete ledgers
- ✅ Can create and edit transactions
- ❌ Cannot delete transactions
- ✅ Can view reports and balances
- ❌ Cannot modify opening balances
- ✅ Can create unlimited sub-groups

#### Income Groups
- ✅ Full CRUD operations on ledgers and transactions
- ✅ Can modify opening balances
- ✅ Can create unlimited sub-groups

#### Expense Groups
- ✅ Full CRUD operations on ledgers and transactions
- ✅ Can modify opening balances
- ✅ Can create unlimited sub-groups

#### Capital Groups
- ❌ Cannot create or edit ledgers (system-managed)
- ❌ Cannot create or edit transactions
- ✅ Can view reports and balances
- ❌ Cannot modify opening balances
- ❌ Cannot create sub-groups

### 3. Default Group Special Permissions

Each default group has specific permission overrides:

#### Branch / Divisions
- Can create ledgers and transactions
- Cannot delete ledgers or transactions
- Cannot be edited or deleted
- ✅ Can create unlimited sub-groups

#### Capital Account
- Cannot create or edit ledgers (system-managed)
- Cannot create or edit transactions
- Cannot be edited or deleted
- ✅ Can create sub-groups (for organizational purposes)

#### Current Assets
- Can create and edit ledgers
- Cannot delete ledgers
- Cannot be edited or deleted
- ✅ Can create unlimited sub-groups

#### Current Liabilities
- Can create and edit ledgers
- Cannot delete ledgers
- Cannot be edited or deleted
- ✅ Can create unlimited sub-groups

#### Fixed Assets
- Can create and edit ledgers
- Cannot delete ledgers
- Cannot be edited or deleted
- ✅ Can create unlimited sub-groups

#### Investments
- Can create and edit ledgers
- Cannot delete ledgers
- Cannot be edited or deleted
- ✅ Can create unlimited sub-groups

#### Loans (Liability)
- Can create and edit ledgers
- Cannot delete ledgers
- Cannot be edited or deleted
- ✅ Can create unlimited sub-groups

#### Misc.Expenses(ASSET)
- Full CRUD operations allowed
- Cannot be edited or deleted
- ✅ Can create unlimited sub-groups

#### Profit & Loss
- Full CRUD operations allowed
- Cannot be edited or deleted
- ✅ Can create unlimited sub-groups

#### Revenue Account
- Full CRUD operations allowed
- Cannot be edited or deleted
- ✅ Can create unlimited sub-groups

#### Suspense Accounts
- Can create and edit ledgers
- Cannot delete ledgers
- Cannot be edited or deleted
- ✅ Can create unlimited sub-groups

## Implementation

### 1. Database Setup

Run the migrations to create the necessary tables:

```bash
# Create groups table
npx sequelize-cli db:migrate --name 20250725212511-create-groups

# Create group_permissions table
npx sequelize-cli db:migrate --name 20250725212530-create-group-permissions

# Seed default groups
npx sequelize-cli db:seed --seed 20250725212553-default-accounting-groups.js
```

### 2. API Endpoints

#### Group Management
- `POST /api/groups` - Create new group (with parent support)
- `GET /api/groups` - Get all accessible groups
- `GET /api/groups/hierarchy` - Get complete hierarchy tree
- `GET /api/groups/parent/:parentId` - Get groups by parent
- `GET /api/groups/available-parents` - Get available parent groups
- `GET /api/groups/:id` - Get specific group
- `PUT /api/groups/:id` - Update group
- `DELETE /api/groups/:id` - Delete group

#### Permission Management
- `GET /api/groups/:groupId/permissions` - Get group permissions
- `POST /api/groups/:groupId/permissions/:userId` - Set user permissions for group

#### Ledger Operations (with group permissions)
- `POST /api/groups/:groupId/ledgers` - Create ledger under group
- `PUT /api/groups/:groupId/ledgers/:ledgerId` - Edit ledger under group
- `DELETE /api/groups/:groupId/ledgers/:ledgerId` - Delete ledger under group
- `GET /api/groups/:groupId/ledgers` - View ledgers under group

### 3. Middleware Usage

The system includes middleware for permission checking:

```javascript
const { 
  canEditGroup, 
  canDeleteGroup, 
  filterAccessibleGroups,
  canCreateLedger,
  canEditLedger,
  canDeleteLedger,
  canViewLedger
} = require('../middleware/groupPermissionMiddleware');

// Apply to routes
router.put('/groups/:id', canEditGroup, groupController.updateGroup);
router.delete('/groups/:id', canDeleteGroup, groupController.deleteGroup);
router.get('/groups', filterAccessibleGroups, groupController.getAllGroups);
```

### 4. Service Usage

Use the GroupPermissionService for permission checks:

```javascript
const GroupPermissionService = require('../utils/groupPermissionService');

// Check if user can create ledger under a group
const canCreate = await GroupPermissionService.canCreateLedger(userId, groupId);

// Check if user can edit a group
const canEdit = await GroupPermissionService.canEditGroup(userId, groupId);

// Get accessible groups for user
const groups = await GroupPermissionService.getAccessibleGroups(userId);

// Get complete hierarchy
const hierarchy = await GroupPermissionService.getGroupHierarchy(userId);

// Check if group has sub-groups
const hasSubGroups = await GroupPermissionService.hasSubGroups(groupId);

// Get all sub-groups recursively
const allSubGroups = await GroupPermissionService.getAllSubGroups(groupId);

// Set default permissions for new user
await GroupPermissionService.setDefaultPermissions(userId, userRole);
```

## Frontend Integration

### 1. Hierarchical Group Manager Component

The system includes a comprehensive frontend component (`HierarchicalGroupManager.jsx`) that provides:

- **Tree View**: Visual hierarchy with expand/collapse functionality
- **Unlimited Nesting**: Support for unlimited levels of sub-groups
- **Permission Display**: Shows permissions for each group
- **Create/Edit/Delete**: Full CRUD operations with permission checks
- **Parent Selection**: Dropdown to select parent groups
- **Permission Inheritance**: Visual indication of inherited permissions

### 2. Permission Checking

```javascript
import { hasGroupPermission, getGroupPermissions } from '../data/permissions';

// Check if user can create ledger under a group
const canCreate = hasGroupPermission('Current Assets', 'Asset', 'canCreateLedger');

// Get all permissions for a group
const permissions = getGroupPermissions('Capital Account', 'Capital');
```

### 3. UI Components

The frontend should:
- Show/hide action buttons based on permissions
- Disable form fields for restricted operations
- Display appropriate error messages for unauthorized actions
- Show group hierarchy with expand/collapse functionality
- Indicate which groups are default vs. custom
- Support unlimited nesting levels
- Show permission inheritance visually

### 4. Route Protection

```javascript
// In route configuration
{
  path: "/master/accounts/group",
  module: "accounting_groups",
  action: "V",
  element: <HierarchicalGroupManager />
}
```

## Security Considerations

### 1. Default Group Protection
- Default groups cannot be edited or deleted
- They have special permission restrictions
- Only admins can modify default group permissions
- Sub-groups inherit protection levels

### 2. Data Integrity
- Asset and Liability groups prevent deletion of ledgers
- Capital groups prevent creation of ledgers
- Opening balance modifications are restricted for sensitive groups
- Hierarchy integrity is maintained during operations

### 3. Permission Inheritance Security
- Permissions are inherited automatically but can be overridden
- Parent group changes affect all sub-groups
- Audit trail tracks permission inheritance changes
- User actions are recorded with hierarchy context

### 4. Hierarchy Depth Limits
- No artificial limits on hierarchy depth
- Performance considerations for very deep hierarchies
- Caching strategies for large hierarchies
- Pagination for displaying large hierarchies

## Best Practices

### 1. Permission Assignment
- Start with restrictive permissions
- Grant additional permissions as needed
- Regularly review and audit permissions
- Use role-based defaults for new users
- Consider hierarchy when assigning permissions

### 2. Group Management
- Use descriptive group names
- Maintain proper hierarchy
- Document group purposes
- Regular cleanup of unused groups
- Plan hierarchy structure before implementation

### 3. Hierarchy Design
- Keep hierarchy logical and intuitive
- Avoid overly deep nesting (performance considerations)
- Use consistent naming conventions
- Document hierarchy structure
- Plan for future expansion

### 4. User Training
- Train users on permission system
- Explain group restrictions
- Provide clear error messages
- Document common scenarios
- Explain hierarchy inheritance

## Troubleshooting

### Common Issues

1. **User cannot create sub-group**
   - Check if user has `canCreateSubGroup` permission for the parent group
   - Verify parent group is not a Capital type
   - Ensure parent group is active

2. **User cannot edit group**
   - Check if group is default (cannot be edited)
   - Verify user has `canEditGroup` permission
   - Ensure user role allows group editing
   - Check if group is in a protected hierarchy

3. **Permission not working**
   - Check if permission is active
   - Verify effective dates
   - Check for restrictions
   - Verify permission inheritance from parent

4. **Hierarchy not displaying correctly**
   - Check parent-child relationships
   - Verify group associations
   - Check for circular references
   - Validate hierarchy data

### Debug Commands

```javascript
// Check user permissions for a group
const permissions = await GroupPermissionService.getUserGroupPermissions(userId);

// Check if group is accessible
const groups = await GroupPermissionService.getAccessibleGroups(userId);

// Verify permission check
const hasPermission = await GroupPermissionService.hasGroupPermission(userId, groupId, 'createLedger');

// Check hierarchy
const hierarchy = await GroupPermissionService.getGroupHierarchy(userId);

// Check for sub-groups
const hasSubGroups = await GroupPermissionService.hasSubGroups(groupId);

// Get all sub-groups
const allSubGroups = await GroupPermissionService.getAllSubGroups(groupId);
```

## Performance Considerations

### 1. Large Hierarchies
- Implement lazy loading for deep hierarchies
- Use pagination for displaying large groups
- Cache hierarchy data appropriately
- Optimize database queries for hierarchy

### 2. Permission Checks
- Cache permission results
- Batch permission checks where possible
- Use database indexes for permission queries
- Implement permission preloading

### 3. Hierarchy Operations
- Use recursive CTEs for hierarchy queries
- Implement proper indexing on parentGroupId
- Cache hierarchy structure
- Optimize for read-heavy operations

## Future Enhancements

1. **Time-based Permissions**: Allow permissions to expire
2. **Bulk Permission Management**: Set permissions for multiple users
3. **Permission Templates**: Predefined permission sets
4. **Advanced Reporting**: Permission usage analytics
5. **Integration with External Systems**: LDAP/AD integration
6. **Mobile Permissions**: Mobile-specific permission sets
7. **Hierarchy Visualization**: Advanced tree visualization
8. **Drag-and-Drop Hierarchy**: Visual hierarchy management
9. **Bulk Hierarchy Operations**: Mass hierarchy changes
10. **Hierarchy Templates**: Predefined hierarchy structures 