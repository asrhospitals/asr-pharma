# Frontend Authentication & Authorization Guide

## 🎯 **Backend Response Structure**

Your backend login endpoint returns this exact structure:

```json
{
    "success": true,
    "message": "Login successful",
    "data": {
        "user": {
            "id": 1,
            "username": "admin",
            "role": "admin",
            "firstName": "Admin",
            "lastName": "User",
            "isActive": "active"
        },
        "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        "refreshToken": "471e51af83d3ce90503059c0a92c97a57f1beed4e446a7123d98bc93843031a15ed570fdd859d77ddfeebf3a962055490cb865af123e7a8533c6e3a714d0cac3",
        "expiresIn": 900
    }
}
```

## 🚀 **Frontend Implementation**

### **1. Login Request**

```javascript

const login = async (credentials) => {
  try {
    const response = await fetch('/pharmacy/auth/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        uname: credentials.username,  // Use 'uname' field
        pwd: credentials.password     // Use 'pwd' field
      })
    });

    const result = await response.json();

    if (result.success) {

      localStorage.setItem('accessToken', result.data.accessToken);
      localStorage.setItem('refreshToken', result.data.refreshToken);
      

      localStorage.setItem('user', JSON.stringify(result.data.user));
      

      const expiryTime = Date.now() + (result.data.expiresIn * 1000);
      localStorage.setItem('tokenExpiry', expiryTime);
      
      return { success: true, user: result.data.user };
    } else {
      return { success: false, message: result.message };
    }
  } catch (error) {
    return { success: false, message: 'Network error' };
  }
};
```

### **2. API Request Helper**

```javascript

const apiRequest = async (url, options = {}) => {
  const token = localStorage.getItem('accessToken');
  
  if (!token) {
    throw new Error('No access token found');
  }

  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers
    }
  };

  try {
    const response = await fetch(url, config);
    

    if (response.status === 401) {

      const refreshResult = await refreshToken();
      if (refreshResult.success) {

        config.headers.Authorization = `Bearer ${refreshResult.accessToken}`;
        return await fetch(url, config);
      } else {

        localStorage.clear();
        window.location.href = '/login';
        throw new Error('Session expired');
      }
    }
    
    return response;
  } catch (error) {
    throw error;
  }
};
```

### **3. Token Refresh Function**

```javascript

const refreshToken = async () => {
  try {
    const refreshToken = localStorage.getItem('refreshToken');
    
    if (!refreshToken) {
      return { success: false };
    }

    const response = await fetch('/pharmacy/auth/refresh', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        refreshToken: refreshToken
      })
    });

    const result = await response.json();

    if (result.success) {

      localStorage.setItem('accessToken', result.data.accessToken);
      localStorage.setItem('refreshToken', result.data.refreshToken);
      
      const expiryTime = Date.now() + (result.data.expiresIn * 1000);
      localStorage.setItem('tokenExpiry', expiryTime);
      
      return { success: true, accessToken: result.data.accessToken };
    } else {
      return { success: false };
    }
  } catch (error) {
    return { success: false };
  }
};
```

### **4. Logout Function**

```javascript

const logout = async () => {
  try {
    const token = localStorage.getItem('accessToken');
    
    if (token) {
      await fetch('/pharmacy/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
    }
  } catch (error) {
    console.error('Logout error:', error);
  } finally {

    localStorage.clear();
    window.location.href = '/login';
  }
};
```

### **5. Authentication Context (React)**

```javascript

import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('accessToken');
    const tokenExpiry = localStorage.getItem('tokenExpiry');

    if (storedUser && token && tokenExpiry) {

      if (Date.now() < parseInt(tokenExpiry)) {
        setUser(JSON.parse(storedUser));
      } else {

        refreshToken().then(result => {
          if (result.success) {
            setUser(JSON.parse(localStorage.getItem('user')));
          } else {
            localStorage.clear();
          }
        });
      }
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    const result = await loginUser(credentials);
    if (result.success) {
      setUser(result.user);
    }
    return result;
  };

  const logout = async () => {
    await logoutUser();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
```

### **6. Protected Route Component**

```javascript

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;
```

### **7. API Service Examples**

```javascript

export const apiService = {

  getItems: async () => {
    const response = await apiRequest('/pharmacy/admin/master/items');
    return response.json();
  },


  createItem: async (itemData) => {
    const response = await apiRequest('/pharmacy/admin/master/items', {
      method: 'POST',
      body: JSON.stringify(itemData)
    });
    return response.json();
  },


  updateItem: async (id, itemData) => {
    const response = await apiRequest(`/pharmacy/admin/master/items/${id}`, {
      method: 'PUT',
      body: JSON.stringify(itemData)
    });
    return response.json();
  },


  deleteItem: async (id) => {
    const response = await apiRequest(`/pharmacy/admin/master/items/${id}`, {
      method: 'DELETE'
    });
    return response.json();
  }
};
```

## 🔧 **Common Issues & Solutions**

### **Issue 1: "Unauthorized" Error**
**Cause**: Missing or invalid Authorization header
**Solution**: Ensure you're sending the token correctly:
```javascript
headers: {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
}
```

### **Issue 2: Token Expired**
**Cause**: Access token has expired (15 minutes)
**Solution**: Implement automatic token refresh:
```javascript
if (response.status === 401) {
  const refreshResult = await refreshToken();
  if (refreshResult.success) {

  }
}
```

### **Issue 3: CORS Issues**
**Cause**: Frontend and backend on different ports
**Solution**: Ensure backend CORS is configured properly

### **Issue 4: Wrong Field Names**
**Cause**: Using `username`/`password` instead of `uname`/`pwd`
**Solution**: Use exact field names:
```javascript
{
  uname: "admin",    // ✅ Correct
  pwd: "admin123"    // ✅ Correct
}
```

## 📋 **Testing Checklist**

- ✅ Login with correct credentials
- ✅ Store tokens in localStorage
- ✅ Access protected routes with token
- ✅ Handle 401 errors with token refresh
- ✅ Logout and clear tokens
- ✅ Redirect to login when unauthorized
- ✅ Handle token expiration

## 🎯 **Key Points**

1. **Field Names**: Use `uname` and `pwd` for login
2. **Token Format**: Always use `Bearer ${token}` in Authorization header
3. **Token Expiry**: Access tokens expire in 15 minutes
4. **Error Handling**: Always check `response.success` boolean
5. **Storage**: Store tokens securely in localStorage
6. **Refresh**: Implement automatic token refresh for better UX

## 🚀 **Quick Start**

1. **Login**: Send `{ uname: "admin", pwd: "admin123" }`
2. **Store**: Save tokens and user data in localStorage
3. **Request**: Use `Authorization: Bearer ${token}` header
4. **Handle**: Check for 401 errors and refresh tokens
5. **Logout**: Clear localStorage and redirect to login

Your backend is now properly configured to work with this frontend implementation! 🎉 