import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import Card from '../components/Card';

const Home = () => {
  const routes = [
    {
      category: 'Admin',
      icon: '👨‍💼',
      color: '#667eea',
      items: [
        { path: '/admin/login', label: 'Admin Login', method: 'POST /api/admin/login' },
        { path: '/admin/dashboard', label: 'Admin Dashboard', method: 'GET /api/admin/profile' },
        { path: '/admin/forgot-password', label: 'Forgot Password', method: 'POST /api/admin/forget-password' },
        { path: '/admin/reset-password', label: 'Reset Password', method: 'POST /api/admin/reset-password' },
        { path: '/admin/vendors', label: 'Vendor Management', method: 'GET/PUT /api/users/*' },
        { path: '/admin/orders', label: 'Vendor Orders & History', method: 'GET /api/admin/order*' },
        { path: '/admin/vendor-subscriptions', label: 'Vendor Subscription Hub', method: 'CRUD /api/admin/vendor-subscription*' },
      ],
    },
    {
      category: 'Customer',
      icon: '🛍️',
      color: '#48bb78',
      items: [
        { path: '/customer/register', label: 'Register Customer', method: 'POST /api/customers/create-customer' },
        { path: '/customer/login', label: 'Customer Login (OTP)', method: 'POST /api/customers/login' },
        { path: '/customer/profile', label: 'View Profile', method: 'GET /api/customers/profile' },
        { path: '/customer/update-profile', label: 'Update Profile', method: 'PUT /api/customers/update-profile' },
        { path: '/customer/address', label: 'Manage Addresses', method: 'CRUD /api/customers/address*' },
        { path: '/customer/cart', label: 'Cart Playground', method: 'CRUD /api/customers/cart/*' },
        { path: '/customer/orders', label: 'Order Workflow', method: 'POST/GET /api/customers/order/*' },
      ],
    },
    {
      category: 'Vendor',
      icon: '🏪',
      color: '#ed8936',
      items: [
        { path: '/vendor/register', label: 'Register Vendor', method: 'POST /api/vendors/create-vendor' },
        { path: '/vendor/login', label: 'Vendor Login (OTP)', method: 'POST /api/vendors/login/*' },
        { path: '/vendor/profile', label: 'View Profile', method: 'GET /api/vendors/profile' },
        { path: '/vendor/update-profile', label: 'Update Profile', method: 'PUT /api/vendors/update-profile' },
        { path: '/vendor/products', label: 'Product List', method: 'GET /api/products/get-products-list' },
        { path: '/vendor/products/create', label: 'Create Product', method: 'POST /api/products/add-product' },
        { path: '/vendor/products/:id', label: 'Inventory Management', method: 'PUT/DELETE /api/products/*' },
        { path: '/vendor/orders', label: 'Vendor Orders', method: 'GET/POST /api/vendors/order*' },
        { path: '/vendor/subscriptions', label: 'Vendor Subscriptions', method: 'POST/GET /api/vendors/*subscription*' },
      ],
    },
    {
      category: 'Delivery Partner',
      icon: '🚚',
      color: '#f56565',
      items: [
        { path: '/delivery-partner/register', label: 'Register Delivery Partner', method: 'POST /api/delivery-partner/create-delivery-partner' },
        { path: '/delivery-partner/login', label: 'Delivery Partner Login (OTP)', method: 'POST /api/delivery-partner/login/*' },
        { path: '/delivery-partner/profile', label: 'View Profile', method: 'GET /api/delivery-partner/profile' },
        { path: '/delivery-partner/update-profile', label: 'Update Profile', method: 'PUT /api/delivery-partner/update-profile' },
        { path: '/delivery-partner/orders', label: 'Delivery Order Flow', method: 'POST/PUT /api/delivery-order/*' },
      ],
    },
    {
      category: 'Store & Discovery',
      icon: '🏬',
      color: '#38b2ac',
      items: [
        { path: '/store/manage', label: 'Store Management & Discovery', method: 'PUT/GET /api/store/* & /api/customers/store/*' },
      ],
    },
    {
      category: 'Location Services',
      icon: '🧭',
      color: '#319795',
      items: [
        { path: '/mappls/playground', label: 'Mappls Playground', method: 'GET /api/mappls/*' },
      ],
    },
    {
      category: 'OTP Services',
      icon: '🔐',
      color: '#9f7aea',
      items: [
        { path: '/otp/send-registration', label: 'Send Registration OTP', method: 'POST /api/otp/send-otp-registration' },
        { path: '/otp/verify-registration', label: 'Verify Registration OTP', method: 'POST /api/otp/verify-otp-registration' },
        { path: '/otp/verify-login', label: 'Verify Login OTP', method: 'POST /api/otp/verify-login' },
        { path: '/otp/resend', label: 'Resend OTP', method: 'POST /api/otp/resend' },
      ],
    },
    {
      category: 'WhatsApp + Email Integration',
      icon: '📱',
      color: '#25d366',
      items: [
        { path: '/whatsapp/test', label: 'Test WhatsApp + Email Notifications', method: 'POST/PUT /api/admin & /api/users endpoints' },
      ],
    },
  ];

  return (
    <Layout>
      <div style={{ textAlign: "center", marginBottom: "3rem" }}>
        <h1
          style={{
            fontSize: "3rem",
            margin: "0 0 1rem 0",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          BazarGhor API Testing Portal
        </h1>
        <p
          style={{
            fontSize: "1.2rem",
            color: "#718096",
            maxWidth: "600px",
            margin: "0 auto",
          }}
        >
          Test all backend API routes from this comprehensive testing interface
        </p>
      </div>

      {routes.map((section, idx) => (
        <Card key={idx} style={{ marginBottom: "2rem" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "1.5rem",
              paddingBottom: "1rem",
              borderBottom: "2px solid #e2e8f0",
            }}
          >
            <span style={{ fontSize: "2.5rem", marginRight: "1rem" }}>
              {section.icon}
            </span>
            <h2
              style={{
                margin: 0,
                color: section.color,
                fontSize: "1.8rem",
              }}
            >
              {section.category}
            </h2>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "1rem",
            }}
          >
            {section.items.map((item, itemIdx) => (
              <Link
                key={itemIdx}
                to={item.path}
                style={{
                  textDecoration: "none",
                  padding: "1rem",
                  background: "#f7fafc",
                  borderRadius: "8px",
                  border: "2px solid #e2e8f0",
                  transition: "all 0.3s ease",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = section.color;
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow =
                    "0 4px 12px rgba(0,0,0,0.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#e2e8f0";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div
                  style={{
                    color: "#2d3748",
                    fontWeight: "600",
                    fontSize: "1rem",
                  }}
                >
                  {item.label}
                </div>
                <div
                  style={{
                    fontSize: "0.75rem",
                    color: "#718096",
                    fontFamily: "monospace",
                    background: "white",
                    padding: "0.25rem 0.5rem",
                    borderRadius: "4px",
                    alignSelf: "flex-start",
                  }}
                >
                  {item.method}
                </div>
              </Link>
            ))}
          </div>
        </Card>
      ))}

      <Card>
        <h3 style={{ marginTop: 0, color: "#2d3748" }}>
          🔗 API Endpoints Base URLs
        </h3>
        <div
          style={{
            background: "#2d3748",
            color: "#48bb78",
            padding: "1rem",
            borderRadius: "8px",
            fontFamily: "monospace",
            fontSize: "0.9rem",
          }}
        >
          <div style={{ marginBottom: "0.5rem" }}>
            <strong style={{ color: "#cbd5e0" }}>Base URL:</strong> {import.meta.env.VITE_API_BASE_URL || "https://c5dbc48a5934.ngrok-free.app/api"}
          </div>
          <div style={{ marginBottom: "0.5rem" }}>
            <strong style={{ color: "#cbd5e0" }}>Admin:</strong> /api/admin
          </div>
          <div style={{ marginBottom: "0.5rem" }}>
            <strong style={{ color: "#cbd5e0" }}>Customer:</strong>{" "}
            /api/customers
          </div>
          <div style={{ marginBottom: "0.5rem" }}>
            <strong style={{ color: "#cbd5e0" }}>Vendor:</strong> /api/vendors
          </div>
          <div style={{ marginBottom: "0.5rem" }}>
            <strong style={{ color: "#cbd5e0" }}>Delivery Partner:</strong>{" "}
            /api/delivery-partner
          </div>
          <div style={{ marginBottom: "0.5rem" }}>
            <strong style={{ color: "#cbd5e0" }}>OTP:</strong> /api/otp
          </div>
          <div style={{ marginBottom: "0.5rem" }}>
            <strong style={{ color: "#cbd5e0" }}>Products:</strong>{" "}
            /api/products
          </div>
          <div style={{ marginBottom: "0.5rem" }}>
            <strong style={{ color: "#cbd5e0" }}>Delivery Orders:</strong>{" "}
            /api/delivery-order
          </div>
          <div style={{ marginBottom: "0.5rem" }}>
            <strong style={{ color: "#cbd5e0" }}>Store:</strong> /api/store
          </div>
          <div>
            <strong style={{ color: "#cbd5e0" }}>Mappls:</strong> /api/mappls
          </div>
        </div>
      </Card>
    </Layout>
  );
};

export default Home;

