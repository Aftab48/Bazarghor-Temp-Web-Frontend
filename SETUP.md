# 🚀 Quick Setup Guide

Follow these simple steps to get the BazarGhor testing portal up and running!

## Step 1: Start the Backend Server

1. Open a terminal/command prompt
2. Navigate to the backend folder:
   ```bash
   cd bazarghor-backend
   ```
3. Install dependencies (first time only):
   ```bash
   pnpm install
   ```
4. Start the backend server:
   ```bash
   pnpm start
   ```
5. You should see: `server started at 5000 ✅`

**Keep this terminal open!**

## Step 2: Start the Frontend Server

1. Open a **NEW** terminal/command prompt
2. Navigate to the frontend folder:
   ```bash
   cd bazarghor-backend-test
   ```
3. Install dependencies (first time only):
   ```bash
   pnpm install
   ```
4. Start the frontend development server:
   ```bash
   pnpm dev
   ```
5. You should see something like:
   ```
   VITE v7.x.x  ready in xxx ms

   ➜  Local:   http://localhost:5173/
   ➜  Network: use --host to expose
   ```

## Step 3: Open the Application

1. Open your web browser
2. Navigate to: **http://localhost:5173**
3. You should see the BazarGhor API Testing Portal landing page! 🎉

## 🎯 Testing the Application

### Quick Test Flow:

1. **Test Customer Registration:**
   - Click on "Customer" section
   - Click "Register Customer"
   - Fill in the form and submit
   - You should see a success message

2. **Test Customer Login:**
   - Click "Customer Login (OTP)"
   - Enter the mobile number you registered with
   - Click "Send OTP"
   - You'll see the OTP in the response (default: 123456)
   - Enter the OTP and click "Verify & Login"
   - You'll be redirected to the customer profile page

3. **Test Profile Management:**
   - After logging in, you can view and update your profile
   - Add/edit/delete addresses
   - Upload profile pictures

4. **Test Other User Types:**
   - Follow similar flows for Vendor and Delivery Partner
   - Admin login uses email/password instead of OTP

## 🔑 Default Test Credentials

### Admin Login:
You'll need to check your backend seeders for admin credentials, typically:
- Email: (check `bazarghor-backend/api/seeders/admin.json`)
- Password: (check the seeder file)

### OTP for All Users:
- Default OTP: `123456`
- Expiry: 5 minutes

## 🛠️ Troubleshooting

### Backend won't start?
- Check if MongoDB is running
- Verify your `.env` file in bazarghor-backend folder
- Check if port 5000 is available

### Frontend won't start?
- Make sure you ran `pnpm install`
- Check if port 5173 is available
- Try deleting `node_modules` and reinstalling

### Can't login?
- Make sure backend is running
- Check browser console for errors
- Try clearing localStorage: Open browser DevTools → Application → Local Storage → Clear

### CORS errors?
- Ensure backend CORS is configured to allow `http://localhost:5173`
- Check backend `app.js` for CORS configuration

## 📊 Monitoring

### Backend Logs:
Watch the backend terminal for:
- API requests
- OTP codes being generated
- Database operations
- Any errors

### Frontend Network:
Open browser DevTools (F12) → Network tab to see:
- API requests being made
- Response status codes
- Response data

## 🎨 Features to Test

- ✅ **Admin**: Login with credentials
- ✅ **Customer**: Register, OTP login, profile, addresses
- ✅ **Vendor**: Register, OTP login, profile with store details
- ✅ **Delivery Partner**: Register, OTP login, profile with vehicle details
- ✅ **OTP Services**: All OTP endpoints
- ✅ **File Uploads**: Profile pictures, store pictures, vehicle pictures
- ✅ **Authentication**: JWT tokens, protected routes
- ✅ **Logout**: Clear session and redirect

## 📸 What You Should See

### Landing Page:
A beautiful gradient header with sections for:
- Admin (purple icon)
- Customer (green icon)
- Vendor (orange icon)
- Delivery Partner (red icon)
- OTP Services (purple icon)

Each section shows all available routes as clickable cards.

### After Login:
- Navigation bar shows your role
- Logout button available
- Profile pages show your information
- Edit buttons to update profiles
- Address management (for customers)

## 🔄 Development Workflow

1. Make changes to the code
2. Frontend auto-reloads (Vite HMR)
3. Backend restarts (nodemon)
4. Test the changes immediately
5. Check both terminals for any errors

## 🎓 Next Steps

Once everything is working:
1. Test all user registration flows
2. Test OTP login for each user type
3. Test profile updates
4. Test file uploads
5. Test address management (customers)
6. Test logout functionality

## 💡 Tips

- Keep both terminals visible to monitor logs
- Use Chrome DevTools Network tab to debug API calls
- Check the browser console for frontend errors
- The OTP is hardcoded as `123456` for testing
- All API endpoints are shown on each page for reference

---

**Need Help?** Check the main README.md for more detailed documentation!

**Happy Testing! 🚀**

