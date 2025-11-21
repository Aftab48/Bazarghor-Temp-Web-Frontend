# BazarGhor Frontend Testing Portal

A comprehensive React-based frontend testing interface for the BazarGhor backend API. This application provides a beautiful UI to test all backend endpoints including Admin, Customer, Vendor, Delivery Partner, and OTP services.

## 🚀 Features

- **Admin Management**: Login and authentication
- **Customer Portal**: Registration, OTP-based login, profile management, and address management
- **Vendor Portal**: Registration, OTP-based login, profile management with store details
- **Delivery Partner Portal**: Registration, OTP-based login, profile management with vehicle details
- **Customer Cart & Orders**: Dedicated playgrounds for `/api/customers/cart/*` and `/api/customers/order/*`
- **Vendor & Admin Ops**: Vendor order console, subscription management, admin order history explorer
- **Store & Discovery**: Unified screen for vendor toggles, admin store CRUD, and customer store/products feed
- **Mappls Playground**: Test autosuggest, geocode, and reverse geocode via `/api/mappls/*`
- **OTP + Messaging Services**: Comprehensive OTP interface plus WhatsApp/email notification tester
- **Modern UI**: Beautiful gradient design with smooth animations
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **File Upload Support**: Handle profile pictures and multiple file uploads
- **Protected Routes**: Authentication-based route protection

## 📋 Prerequisites

Before running this project, ensure you have:

- Node.js (v16 or higher)
- npm or pnpm
- BazarGhor backend server running (default: http://localhost:5000)

## 🛠️ Installation

1. **Install dependencies:**
   ```bash
   pnpm install
   # or
   npm install
   ```

2. **Update API Base URL (if needed):**
   
   Open `src/config/api.js` and update the `BASE_URL` if your backend runs on a different port:
   ```javascript
   const BASE_URL = 'http://localhost:5000/api';
   ```

## 🎯 Running the Application

1. **Start the backend server** (in the bazarghor-backend folder):
   ```bash
   pnpm start
   # or
   npm start
   ```

2. **Start the frontend development server** (in the bazarghor-backend-test folder):
   ```bash
   pnpm dev
   # or
   npm run dev
   ```

3. **Open your browser** and navigate to:
   ```
   http://localhost:5173
   ```

## 📁 Project Structure

```
bazarghor-backend-test/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Layout.jsx
│   │   ├── Card.jsx
│   │   ├── Button.jsx
│   │   ├── Input.jsx
│   │   └── Select.jsx
│   ├── config/              # Configuration files
│   │   └── api.js          # API endpoints and axios setup
│   ├── pages/               # Application pages
│   │   ├── admin/          # Admin pages
│   │   ├── customer/       # Customer pages
│   │   ├── vendor/         # Vendor pages
│   │   ├── deliveryPartner/# Delivery Partner pages
│   │   ├── otp/            # OTP testing pages
│   │   └── Home.jsx        # Landing page with all routes
│   ├── utils/               # Utility functions
│   │   └── auth.js         # Authentication helpers
│   ├── App.jsx              # Main application component with routing
│   ├── main.jsx             # Application entry point
│   └── index.css            # Global styles
└── package.json
```

## 🔗 Available Routes

### Admin
- `/admin/login` – Admin login page
- `/admin/dashboard` – Snapshot of profile and quick actions
- `/admin/vendors` – Review/approve vendor onboarding requests
- `/admin/orders` – Inspect vendor order queues and history (`/api/admin/order*`)
- `/admin/vendor-subscriptions` – Create, assign, renew, and cancel vendor plans

### Customer
- `/customer/register` – Customer registration flow
- `/customer/login` – OTP-based authentication
- `/customer/profile` – View customer profile
- `/customer/update-profile` – Update profile information
- `/customer/address` – Manage saved addresses
- `/customer/cart` – Full cart playground for `/api/customers/cart/*`
- `/customer/orders` – Create orders, inspect history, update payment status

### Vendor
- `/vendor/register` – Vendor onboarding
- `/vendor/login` – Vendor OTP login + verification
- `/vendor/profile` – View vendor profile & store details
- `/vendor/update-profile` – Update vendor profile
- `/vendor/products` – Product list
- `/vendor/products/create` – Create product (also used for editing)
- `/vendor/orders` – Accept/decline marketplace orders and inspect details
- `/vendor/subscriptions` – Purchase/renew vendor subscriptions

### Delivery Partner
- `/delivery-partner/register` – Delivery partner registration
- `/delivery-partner/login` – Delivery OTP login
- `/delivery-partner/profile` – View partner profile
- `/delivery-partner/update-profile` – Update partner profile
- `/delivery-partner/orders` – Respond/pickup/deliver and view stats

### Store & Discovery
- `/store/manage` – Vendor open/close, admin store CRUD, customer store/product exploration

### Mappls & Location
- `/mappls/playground` – Autosuggest, geocode, and reverse geocode tester

### OTP Services
- `/otp/*` – Comprehensive OTP interface

### Messaging & Notifications
- `/whatsapp/test` – Trigger WhatsApp + email notifications (admin + user creation flows)

## 🔐 Authentication

The application uses JWT token-based authentication:

- Tokens are stored in `localStorage`
- Authenticated routes automatically check for valid tokens
- Unauthorized users are redirected to login pages
- Logout clears all authentication data

## 📝 API Endpoints

All API endpoints are configured in `src/config/api.js`:

- **Base URL**: `http://localhost:5000/api`
- **Admin**: `/api/admin/*`
- **Customers**: `/api/customers/*`
- **Vendors**: `/api/vendors/*`
- **Delivery Partners**: `/api/delivery-partner/*`
- **OTP**: `/api/otp/*`
- **Staff & Users**: `/api/staff/*`, `/api/users/*`
- **Products**: `/api/products/*`
- **Store & Customer Discovery**: `/api/store/*`, `/api/customers/store/*`
- **Delivery Orders**: `/api/delivery-order/*`
- **Mappls**: `/api/mappls/*`

## 🎨 UI Components

The application includes reusable components:

- **Layout**: Navigation bar and footer wrapper
- **Card**: Container for content sections
- **Button**: Multiple variants (primary, secondary, danger, success)
- **Input**: Text, email, tel, file, date inputs
- **Select**: Dropdown selection component

## 🧪 Testing OTP

The backend uses a hardcoded OTP for testing purposes:
- **OTP**: `123456`
- **Expiry Time**: 5 minutes (configurable in backend)

## 🚧 Development Notes

- The frontend uses Vite for fast development and hot module replacement
- React Router DOM for client-side routing
- Axios for API requests with interceptors for authentication
- Inline CSS-in-JS for styling (easily customizable)

## 🔧 Configuration

### Updating Backend URL

Edit `src/config/api.js`:
```javascript
const BASE_URL = 'http://your-backend-url/api';
```

### Updating Authentication

Edit `src/utils/auth.js` to modify authentication logic.

## 📦 Build for Production

```bash
pnpm build
# or
npm run build
```

The production build will be created in the `dist/` folder.

## 🐛 Troubleshooting

### CORS Issues
If you encounter CORS errors, ensure your backend has CORS enabled for your frontend URL.

### Authentication Errors
- Check if the backend is running
- Verify the API base URL is correct
- Clear localStorage and try again

### File Upload Issues
- Ensure the backend has proper file upload middleware configured
- Check file size limits in backend configuration

## 📄 License

This project is part of the BazarGhor application ecosystem.

## 👨‍💻 Development

For development questions or issues, refer to the backend documentation in the `bazarghor-backend` folder.

---

**Happy Testing! 🎉**
