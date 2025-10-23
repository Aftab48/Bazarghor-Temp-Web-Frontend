# 🔧 Troubleshooting Guide

## Issue: "Failed to..." messages despite 200 status codes

### The Problem
Your backend returns **HTTP 200** for most responses, but uses a `code` field to indicate success or error:

**Backend Response Structure:**
```json
{
  "code": "SUCCESS",    // or "ERROR", "OTP_VERIFIED", etc.
  "message": "Operation successful",
  "data": { ... }
}
```

**Error Response (still 200!):**
```json
{
  "code": "ERROR",
  "message": "Something went wrong",
  "data": {}
}
```

### The Solution
The axios interceptor now checks the `code` field in the response and treats `"ERROR"` codes as actual errors, even when HTTP status is 200.

**Updated in:** `src/config/api.js`

```javascript
apiClient.interceptors.response.use(
  (response) => {
    // Check if response has ERROR code
    if (response.data && response.data.code === 'ERROR') {
      // Treat as error
      return Promise.reject({
        response: {
          data: response.data,
          status: 200
        }
      });
    }
    return response;
  },
  // ... error handling
);
```

## Common Response Codes

Your backend uses these response codes:

| Code | Meaning | HTTP Status |
|------|---------|-------------|
| `SUCCESS` | Operation successful | 200 |
| `ERROR` | Operation failed | 200/400/422 |
| `LOGIN` | Login successful | 200 |
| `OTP_VERIFIED` | OTP verified | 200 |
| `UNAUTHENTICATED` | Not authenticated | 401 |
| `NOT_VERIFIED` | Account not verified | 200 |
| `DUPLICATE` | Duplicate record | 409 |

## Testing the Fix

1. **Try registering a user with duplicate mobile number**
   - Expected: Should show error message
   - Backend returns: 200 with `code: "DUPLICATE"`

2. **Try logging in with wrong OTP**
   - Expected: Should show "Invalid OTP" error
   - Backend returns: 200 with `code: "ERROR"`

3. **Try accessing protected route without token**
   - Expected: Should redirect to login
   - Backend returns: 401 with `code: "UNAUTHENTICATED"`

## Other Common Issues

### 1. CORS Errors
**Symptom:** Browser console shows CORS errors

**Solution:** Add CORS middleware to backend:
```javascript
// In backend app.js
const cors = require('cors');
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
```

### 2. Token Not Being Sent
**Symptom:** Backend says "Unauthorized" but you're logged in

**Check:**
1. Open DevTools → Application → Local Storage
2. Verify `token` exists
3. Check Network tab → Request Headers → Should have `Authorization: Bearer [token]`

**Solution:** The interceptor handles this automatically, but if it's not working:
```javascript
// Check src/config/api.js request interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  }
);
```

### 3. File Upload Not Working
**Symptom:** Files not being uploaded

**Check:**
1. Make sure `Content-Type: multipart/form-data` is set
2. Check file size limits in backend

**The API already handles this:**
```javascript
api.customer.register(formData) // Uses multipart/form-data automatically
```

### 4. Response Data Structure
**Backend Response:**
```json
{
  "code": "SUCCESS",
  "message": "User created",
  "data": {
    "user": { ... },
    "token": "...",
    "refreshToken": "..."
  }
}
```

**Accessing in Frontend:**
```javascript
const response = await api.customer.register(formData);
// Access data
const user = response.data.data.user;
const token = response.data.data.token;
const message = response.data.message;
```

### 5. OTP Not Showing
**Symptom:** OTP sent but not displayed

**Check:** The backend returns OTP in development mode:
```json
{
  "code": "OTP",
  "message": "OTP sent",
  "data": {
    "otp": "123456",
    "expireTime": "..."
  }
}
```

**Frontend displays it:**
```javascript
setMessage({ 
  text: `OTP sent! OTP: ${response.data.data.otp}` 
});
```

### 6. Authentication Persistence
**How it works:**
1. Login successful → Save to localStorage
2. Page refresh → Check localStorage
3. API calls → Add token to headers
4. Logout → Clear localStorage

**Manual testing:**
```javascript
// In browser console
localStorage.getItem('token')      // Check if logged in
localStorage.getItem('user')       // Check user data
localStorage.clear()               // Manual logout
```

## Debugging Tips

### 1. Check Network Tab
- Open DevTools (F12) → Network tab
- Filter by XHR
- Click on any request
- Check:
  - Request URL
  - Request Headers (Authorization token?)
  - Request Payload (data being sent)
  - Response (what backend returned)
  - Status Code

### 2. Check Console
- Look for errors in red
- Look for axios errors with response data

### 3. Check Backend Terminal
- Should show the request
- Should show if it hit the route
- Should show any errors

### 4. Check Response Structure
If you're getting unexpected errors, log the full response:
```javascript
try {
  const response = await api.customer.register(formData);
  console.log('Full response:', response);
  console.log('Response data:', response.data);
  console.log('Response code:', response.data.code);
} catch (error) {
  console.log('Error response:', error.response);
  console.log('Error data:', error.response?.data);
}
```

## Response Status Reference

### Backend Status Codes
```javascript
success: 200
created: 201
badRequest: 400
unauthorized: 401
forbidden: 403
notFound: 404
validationError: 422
internalServerError: 500
duplicateRecord: 409
```

### But Remember!
Most responses return **200** even for errors. Always check the `code` field:
- `code: "SUCCESS"` → Success
- `code: "ERROR"` → Error
- `code: "OTP_VERIFIED"` → OTP Success
- etc.

## Quick Fixes Checklist

- [ ] Backend running on port 5000?
- [ ] Frontend running on port 5173?
- [ ] No CORS errors in console?
- [ ] Token saved in localStorage after login?
- [ ] Request has Authorization header?
- [ ] Response has `code` field?
- [ ] Checking `response.data.data` for actual data?
- [ ] Checking `response.data.message` for messages?

## Need More Help?

1. Check backend logs
2. Check browser DevTools Console
3. Check browser DevTools Network tab
4. Add console.logs to see what's happening
5. Check if the backend endpoint matches the frontend call

---

**The main fix is done!** The axios interceptor now properly handles your backend's response structure. 🎉

