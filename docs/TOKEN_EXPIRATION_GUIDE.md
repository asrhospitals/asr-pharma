# Token Expiration Handling Guide

## Overview

When a user is on any page (like `master/accounts/group`) and their JWT token expires, the system should automatically handle this by logging them out and redirecting to the login page. This is the standard and secure way to handle token expiration.

## How It Works

### Backend Response
When a token is expired or invalid, your backend returns:
```json
{
  "success": false,
  "message": "Invalid token",
  "code": "INVALID_TOKEN"
}
```

Or for missing tokens:
```json
{
  "success": false,
  "message": "Access token required",
  "code": "TOKEN_MISSING"
}
```

### Frontend Handling
Your frontend should automatically:
1. **Detect the 401 status** from any API call
2. **Check for token expiration codes** (`INVALID_TOKEN`, `TOKEN_EXPIRED`, `TOKEN_MISSING`)
3. **Logout the user** (clear Redux state and localStorage)
4. **Redirect to login page**
5. **Show a user-friendly message**

## Implementation

### 1. Centralized API Base (Already Implemented)

The `apiBase.js` file provides a centralized way to handle token expiration for all API calls:

```javascript
// Enhanced base query with token expiration handling
const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  
  // Check if the response indicates token expiration
  if (result.error && result.error.status === 401) {
    const errorData = result.error.data;
    
    // Check for specific token expiration error
    if (errorData?.code === 'TOKEN_EXPIRED' || 
        errorData?.code === 'INVALID_TOKEN' ||
        errorData?.code === 'TOKEN_MISSING' ||
        errorData?.message?.includes('expired') ||
        result.error.statusText === 'Unauthorized') {
      
      // Dispatch logout action to clear user state
      api.dispatch(logout());
      
      // Redirect to login page
      window.location.href = '/';
      
      return result;
    }
  }
  
  return result;
};
```

### 2. Using the Base in All APIs

All your API services should use this base:

```javascript
import { createBaseQueryWithAuth } from './apiBase';

const baseUrl = import.meta.env.VITE_BACKEND_BASE_URL
  ? `${import.meta.env.VITE_BACKEND_BASE_URL}/pharmacy/admin/master`
  : "/api/admin/master";

export const groupApi = createApi({
  reducerPath: "groupApi",
  baseQuery: createBaseQueryWithAuth(baseUrl), // This handles token expiration
  // ... rest of your API configuration
});
```

### 3. User Experience Flow

When a user is on any page (e.g., `master/accounts/group`) and their token expires:

1. **User makes an API call** (e.g., fetching groups, creating a group, etc.)
2. **Backend returns 401** with `INVALID_TOKEN` code
3. **Frontend automatically detects** the token expiration
4. **User is logged out** (Redux state cleared, localStorage cleared)
5. **User is redirected** to login page
6. **User sees a message** explaining why they were logged out

## Testing Token Expiration

### Manual Test
1. Login to your application
2. Navigate to any page (e.g., `master/accounts/group`)
3. Wait for the token to expire (15 minutes) or manually clear the token from localStorage
4. Try to perform any action (refresh page, click a button, etc.)
5. You should be automatically redirected to login

### Programmatic Test
Use the test script to verify token expiration handling:

```bash
node test-token-expiration.js
```

## Best Practices

### 1. Consistent Error Handling
All API calls should use the same base query to ensure consistent token expiration handling.

### 2. User-Friendly Messages
When redirecting to login, consider showing a toast notification:
```javascript
// In your toast system
showToast({
  type: 'warning',
  message: 'Your session has expired. Please login again.',
  duration: 5000
});
```

### 3. Automatic Token Refresh (Future Enhancement)
Consider implementing automatic token refresh before expiration:
- Check token expiration time
- Automatically refresh token if it's about to expire
- Only logout if refresh fails

### 4. Remember User's Last Page
You could store the current page in localStorage before redirecting:
```javascript
// Before redirecting
localStorage.setItem('lastPage', window.location.pathname);

// After login, redirect back
const lastPage = localStorage.getItem('lastPage');
if (lastPage) {
  navigate(lastPage);
  localStorage.removeItem('lastPage');
}
```

## Security Benefits

1. **Automatic Logout**: Users are automatically logged out when their session expires
2. **No Stale Data**: Prevents users from working with expired sessions
3. **Consistent Behavior**: All API calls handle token expiration the same way
4. **User Experience**: Clear feedback about why they were logged out

## Troubleshooting

### Common Issues

1. **Token not being cleared**: Ensure the logout action clears both Redux state and localStorage
2. **Redirect not working**: Check that `window.location.href = '/'` is being called
3. **Multiple API calls**: The first failed call should trigger logout, subsequent calls should be handled gracefully

### Debug Mode
Add console logs to debug token expiration handling:
```javascript
if (errorData?.code === 'INVALID_TOKEN') {
  console.log('Token expired, logging out user');
  api.dispatch(logout());
  console.log('Redirecting to login page');
  window.location.href = '/';
}
```

## Summary

Your current implementation correctly handles token expiration by:
- ✅ Detecting 401 responses from the backend
- ✅ Checking for token expiration error codes
- ✅ Automatically logging out users
- ✅ Redirecting to login page
- ✅ Providing clear user feedback

This is the standard and secure way to handle token expiration in web applications. 