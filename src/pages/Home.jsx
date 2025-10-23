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
        { path: '/admin/login', label: 'Admin Login', method: 'POST' },
        { path: '/admin/logout', label: 'Admin Logout', method: 'POST' },
      ]
    },
    {
      category: 'Customer',
      icon: '🛍️',
      color: '#48bb78',
      items: [
        { path: '/customer/register', label: 'Register Customer', method: 'POST' },
        { path: '/customer/login', label: 'Customer Login (OTP)', method: 'POST' },
        { path: '/customer/profile', label: 'View Profile', method: 'GET' },
        { path: '/customer/update-profile', label: 'Update Profile', method: 'PUT' },
        { path: '/customer/address', label: 'Manage Addresses', method: 'GET/POST/PUT/DELETE' },
      ]
    },
    {
      category: 'Vendor',
      icon: '🏪',
      color: '#ed8936',
      items: [
        { path: '/vendor/register', label: 'Register Vendor', method: 'POST' },
        { path: '/vendor/login', label: 'Vendor Login (OTP)', method: 'POST' },
        { path: '/vendor/profile', label: 'View Profile', method: 'GET' },
        { path: '/vendor/update-profile', label: 'Update Profile', method: 'PUT' },
      ]
    },
    {
      category: 'Delivery Partner',
      icon: '🚚',
      color: '#f56565',
      items: [
        { path: '/delivery-partner/register', label: 'Register Delivery Partner', method: 'POST' },
        { path: '/delivery-partner/login', label: 'Delivery Partner Login (OTP)', method: 'POST' },
        { path: '/delivery-partner/profile', label: 'View Profile', method: 'GET' },
        { path: '/delivery-partner/update-profile', label: 'Update Profile', method: 'PUT' },
      ]
    },
    {
      category: 'OTP Services',
      icon: '🔐',
      color: '#9f7aea',
      items: [
        { path: '/otp/send-registration', label: 'Send Registration OTP', method: 'POST' },
        { path: '/otp/verify-registration', label: 'Verify Registration OTP', method: 'POST' },
        { path: '/otp/verify-login', label: 'Verify Login OTP', method: 'POST' },
        { path: '/otp/resend', label: 'Resend OTP', method: 'POST' },
      ]
    }
  ];

  return (
    <Layout>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{
          fontSize: '3rem',
          margin: '0 0 1rem 0',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          BazarGhor API Testing Portal
        </h1>
        <p style={{ fontSize: '1.2rem', color: '#718096', maxWidth: '600px', margin: '0 auto' }}>
          Test all backend API routes from this comprehensive testing interface
        </p>
      </div>

      {routes.map((section, idx) => (
        <Card key={idx} style={{ marginBottom: '2rem' }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            marginBottom: '1.5rem',
            paddingBottom: '1rem',
            borderBottom: '2px solid #e2e8f0'
          }}>
            <span style={{ fontSize: '2.5rem', marginRight: '1rem' }}>{section.icon}</span>
            <h2 style={{ 
              margin: 0, 
              color: section.color,
              fontSize: '1.8rem'
            }}>
              {section.category}
            </h2>
          </div>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1rem'
          }}>
            {section.items.map((item, itemIdx) => (
              <Link
                key={itemIdx}
                to={item.path}
                style={{
                  textDecoration: 'none',
                  padding: '1rem',
                  background: '#f7fafc',
                  borderRadius: '8px',
                  border: '2px solid #e2e8f0',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = section.color;
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#e2e8f0';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{ 
                  color: '#2d3748', 
                  fontWeight: '600',
                  fontSize: '1rem'
                }}>
                  {item.label}
                </div>
                <div style={{ 
                  fontSize: '0.75rem', 
                  color: '#718096',
                  fontFamily: 'monospace',
                  background: 'white',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '4px',
                  alignSelf: 'flex-start'
                }}>
                  {item.method}
                </div>
              </Link>
            ))}
          </div>
        </Card>
      ))}

      <Card>
        <h3 style={{ marginTop: 0, color: '#2d3748' }}>🔗 API Endpoints Base URLs</h3>
        <div style={{ 
          background: '#2d3748', 
          color: '#48bb78', 
          padding: '1rem', 
          borderRadius: '8px',
          fontFamily: 'monospace',
          fontSize: '0.9rem'
        }}>
          <div style={{ marginBottom: '0.5rem' }}>
            <strong style={{ color: '#cbd5e0' }}>Base URL:</strong> https://private-bazarghor-backend-for-testing-production.up.railway.app/api
          </div>
          <div style={{ marginBottom: '0.5rem' }}>
            <strong style={{ color: '#cbd5e0' }}>Admin:</strong> /api/admin
          </div>
          <div style={{ marginBottom: '0.5rem' }}>
            <strong style={{ color: '#cbd5e0' }}>Customer:</strong> /api/customers
          </div>
          <div style={{ marginBottom: '0.5rem' }}>
            <strong style={{ color: '#cbd5e0' }}>Vendor:</strong> /api/vendors
          </div>
          <div style={{ marginBottom: '0.5rem' }}>
            <strong style={{ color: '#cbd5e0' }}>Delivery Partner:</strong> /api/delivery-partner
          </div>
          <div>
            <strong style={{ color: '#cbd5e0' }}>OTP:</strong> /api/otp
          </div>
        </div>
      </Card>
    </Layout>
  );
};

export default Home;

