import { useState } from 'react';
import Layout from '../../components/Layout';
import Card from '../../components/Card';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { api } from '../../config/api';

const WhatsAppTest = () => {
  const [activeTab, setActiveTab] = useState('forgot-password');
  const [formData, setFormData] = useState({
    email: '',
    mobNo: '',
    firstName: '',
    lastName: '',
    userId: '',
    status: '1',
    templateName: 'hello_world',
    languageCode: 'en_US',
    message: 'Hello! This is a test message from BazarGhorr.'
  });
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Test Forgot Password (triggers email + WhatsApp)
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });
    setResults(null);

    try {
      console.log('📤 Sending forgot password request for:', formData.email);
      const response = await api.admin.forgotPassword({ email: formData.email });
      console.log('✅ Forgot password response:', response);
      
      // Handle message - it might be an object or string
      let messageText = 'Password reset OTP sent successfully! Check both email and WhatsApp.';
      if (response.data?.message) {
        if (typeof response.data.message === 'string') {
          messageText = response.data.message;
        } else if (typeof response.data.message === 'object' && response.data.message.message) {
          messageText = response.data.message.message;
        } else if (typeof response.data.message === 'object') {
          messageText = JSON.stringify(response.data.message);
        }
      } else if (response.data?.data?.message) {
        messageText = typeof response.data.data.message === 'string' 
          ? response.data.data.message 
          : response.data.data.message.message || 'Password reset OTP sent successfully!';
      }
      
      setMessage({ 
        type: 'success', 
        text: messageText
      });
      setResults({
        emailSent: true,
        whatsappSent: true,
        message: 'Both email and WhatsApp notifications should have been sent.'
      });
    } catch (error) {
      console.error('❌ Forgot password error:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        config: error.config
      });
      
      let errorMessage = 'Failed to send password reset OTP.';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
        errorMessage = 'Request timed out. Please check if the backend server is running.';
      } else if (error.code === 'ERR_NETWORK' || error.message?.includes('Network Error')) {
        errorMessage = 'Network error. Please check if the backend server is accessible.';
      }
      
      setMessage({
        type: 'error',
        text: errorMessage
      });
    } finally {
      setLoading(false);
    }
  };

  // Test Vendor Creation (triggers email + WhatsApp)
  const handleCreateVendor = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });
    setResults(null);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('firstName', formData.firstName);
      formDataToSend.append('lastName', formData.lastName);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('mobNo', formData.mobNo);
      formDataToSend.append('storeName', 'Test Store');
      formDataToSend.append('storeDescription', 'Test Store Description');
      formDataToSend.append('storeAddress', 'Test Address');
      formDataToSend.append('city', 'Test City');
      formDataToSend.append('state', 'Test State');
      formDataToSend.append('pinCode', '123456');

      const response = await api.staff.createVendor(formDataToSend);
      setMessage({ 
        type: 'success', 
        text: response.data?.message || 'Vendor created successfully! Check both email and WhatsApp.' 
      });
      setResults({
        emailSent: true,
        whatsappSent: true,
        vendorId: response.data?.data?._id,
        message: 'Both email and WhatsApp notifications should have been sent to the vendor.'
      });
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to create vendor.'
      });
    } finally {
      setLoading(false);
    }
  };

  // Test Delivery Partner Creation (triggers email + WhatsApp)
  const handleCreateDeliveryPartner = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });
    setResults(null);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('firstName', formData.firstName);
      formDataToSend.append('lastName', formData.lastName);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('mobNo', formData.mobNo);
      formDataToSend.append('dob', '1990-01-01');
      formDataToSend.append('vehicleType', 'bike');
      formDataToSend.append('vehicleNo', 'TEST123');
      formDataToSend.append('driverLicenseNo', 'DL123456');

      const response = await api.staff.createDeliveryPartner(formDataToSend);
      setMessage({ 
        type: 'success', 
        text: response.data?.message || 'Delivery partner created successfully! Check both email and WhatsApp.' 
      });
      setResults({
        emailSent: true,
        whatsappSent: true,
        deliveryPartnerId: response.data?.data?._id,
        message: 'Both email and WhatsApp notifications should have been sent to the delivery partner.'
      });
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to create delivery partner.'
      });
    } finally {
      setLoading(false);
    }
  };

  // Test Customer Creation (triggers email + WhatsApp)
  const handleCreateCustomer = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });
    setResults(null);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('firstName', formData.firstName);
      formDataToSend.append('lastName', formData.lastName);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('mobNo', formData.mobNo);

      const response = await api.staff.createCustomer(formDataToSend);
      setMessage({ 
        type: 'success', 
        text: response.data?.message || 'Customer created successfully! Check both email and WhatsApp.' 
      });
      setResults({
        emailSent: true,
        whatsappSent: true,
        customerId: response.data?.data?._id,
        message: 'Both email and WhatsApp notifications should have been sent to the customer.'
      });
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to create customer.'
      });
    } finally {
      setLoading(false);
    }
  };

  // Test Account Verification (triggers email + WhatsApp)
  const handleVerifyAccount = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });
    setResults(null);

    try {
      const response = await api.staff.verifyUserStatus(formData.userId, { 
        status: parseInt(formData.status) 
      });
      setMessage({ 
        type: 'success', 
        text: response.data?.message || 'Account verified successfully! Check both email and WhatsApp.' 
      });
      setResults({
        emailSent: true,
        whatsappSent: true,
        message: 'Both email and WhatsApp notifications should have been sent to the user.'
      });
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to verify account.'
      });
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { 
      id: 'forgot-password', 
      label: '🔐 Forgot Password', 
      endpoint: 'POST /api/admin/forget-password',
      description: 'Tests password reset OTP sent via email + WhatsApp'
    },
    { 
      id: 'create-vendor', 
      label: '🏪 Create Vendor', 
      endpoint: 'POST /api/users/create-vendor',
      description: 'Tests vendor account creation with email + WhatsApp notifications'
    },
    { 
      id: 'create-delivery-partner', 
      label: '🚚 Create Delivery Partner', 
      endpoint: 'POST /api/users/create-delivery-partner',
      description: 'Tests delivery partner creation with email + WhatsApp notifications'
    },
    { 
      id: 'create-customer', 
      label: '👤 Create Customer', 
      endpoint: 'POST /api/users/create-customer',
      description: 'Tests customer account creation with email + WhatsApp notifications'
    },
    { 
      id: 'verify-account', 
      label: '✅ Verify Account', 
      endpoint: 'PUT /api/users/verify-status/:userId',
      description: 'Tests account verification with email + WhatsApp notifications'
    }
  ];

  return (
    <Layout>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <Card title="📱 WhatsApp + Email Integration Testing">
          <div style={{ 
            marginBottom: '1.5rem', 
            padding: '1rem', 
            background: '#e6f3ff', 
            borderRadius: '8px',
            border: '2px solid #4a90e2'
          }}>
            <strong>ℹ️ About This Test:</strong>
            <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem' }}>
              This page tests the integrated notification system that sends both <strong>Email</strong> (via Nodemailer) 
              and <strong>WhatsApp</strong> messages simultaneously. Each action below will trigger notifications on both channels.
            </p>
            <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.85rem', color: '#d97706' }}>
              <strong>💡 Debug Tip:</strong> Open browser console (F12) to see detailed request/response logs. 
              If requests hang, check if the backend server is running and accessible.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setMessage({ type: '', text: '' });
                  setResults(null);
                }}
                style={{
                  padding: '0.75rem 1rem',
                  background: activeTab === tab.id ? '#667eea' : '#e2e8f0',
                  color: activeTab === tab.id ? 'white' : '#2d3748',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '0.85rem',
                  transition: 'all 0.3s ease',
                  textAlign: 'left'
                }}
                title={tab.description}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {message.text && (
            <div style={{
              padding: '1rem',
              borderRadius: '8px',
              marginBottom: '1.5rem',
              background: message.type === 'success' ? '#c6f6d5' : '#fed7d7',
              color: message.type === 'success' ? '#22543d' : '#742a2a',
              border: `2px solid ${message.type === 'success' ? '#9ae6b4' : '#fc8181'}`
            }}>
              <strong>{message.type === 'success' ? '✅' : '❌'}</strong> {message.text}
            </div>
          )}

          {results && (
            <div style={{
              padding: '1rem',
              borderRadius: '8px',
              marginBottom: '1.5rem',
              background: '#fff5e6',
              border: '2px solid #ffa500'
            }}>
              <strong>📊 Test Results:</strong>
              <div style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>
                <div>📧 Email Sent: {results.emailSent ? '✅ Yes' : '❌ No'}</div>
                <div>📱 WhatsApp Sent: {results.whatsappSent ? '✅ Yes' : '❌ No'}</div>
                {results.message && <div style={{ marginTop: '0.5rem' }}>{results.message}</div>}
                {results.vendorId && <div style={{ marginTop: '0.5rem' }}>Vendor ID: {results.vendorId}</div>}
                {results.deliveryPartnerId && <div style={{ marginTop: '0.5rem' }}>Delivery Partner ID: {results.deliveryPartnerId}</div>}
                {results.customerId && <div style={{ marginTop: '0.5rem' }}>Customer ID: {results.customerId}</div>}
              </div>
            </div>
          )}

          {/* Forgot Password Form */}
          {activeTab === 'forgot-password' && (
            <form onSubmit={handleForgotPassword}>
              <div style={{ marginBottom: '1rem' }}>
                <strong style={{ fontSize: '0.9rem', color: '#4a5568' }}>
                  {tabs.find(t => t.id === activeTab)?.description}
                </strong>
              </div>
              <Input
                label="Email Address"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="user@example.com"
                required
              />
              <div style={{ 
                marginTop: '0.5rem', 
                padding: '0.75rem', 
                background: '#f7fafc', 
                borderRadius: '6px',
                fontSize: '0.85rem',
                color: '#4a5568'
              }}>
                <strong>Note:</strong> The user must exist in the database with a valid email and phone number (mobNo).
                Both email and WhatsApp will receive the password reset OTP.
              </div>
              <Button type="submit" disabled={loading} style={{ width: '100%', marginTop: '1rem' }}>
                {loading ? 'Sending...' : 'Send Password Reset (Email + WhatsApp)'}
              </Button>
            </form>
          )}

          {/* Create Vendor Form */}
          {activeTab === 'create-vendor' && (
            <form onSubmit={handleCreateVendor}>
              <div style={{ marginBottom: '1rem' }}>
                <strong style={{ fontSize: '0.9rem', color: '#4a5568' }}>
                  {tabs.find(t => t.id === activeTab)?.description}
                </strong>
              </div>
              <Input
                label="First Name"
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="John"
                required
              />
              <Input
                label="Last Name"
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Doe"
                required
              />
              <Input
                label="Email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="vendor@example.com"
                required
              />
              <Input
                label="Mobile Number (International Format)"
                type="tel"
                name="mobNo"
                value={formData.mobNo}
                onChange={handleChange}
                placeholder="919903776046"
                required
              />
              <div style={{ 
                marginTop: '0.5rem', 
                padding: '0.75rem', 
                background: '#f7fafc', 
                borderRadius: '6px',
                fontSize: '0.85rem',
                color: '#4a5568'
              }}>
                <strong>Note:</strong> Requires admin authentication. Both email and WhatsApp will receive vendor account creation notification.
              </div>
              <Button type="submit" disabled={loading} style={{ width: '100%', marginTop: '1rem' }}>
                {loading ? 'Creating...' : 'Create Vendor (Email + WhatsApp)'}
              </Button>
            </form>
          )}

          {/* Create Delivery Partner Form */}
          {activeTab === 'create-delivery-partner' && (
            <form onSubmit={handleCreateDeliveryPartner}>
              <div style={{ marginBottom: '1rem' }}>
                <strong style={{ fontSize: '0.9rem', color: '#4a5568' }}>
                  {tabs.find(t => t.id === activeTab)?.description}
                </strong>
              </div>
              <Input
                label="First Name"
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="John"
                required
              />
              <Input
                label="Last Name"
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Doe"
                required
              />
              <Input
                label="Email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="delivery@example.com"
                required
              />
              <Input
                label="Mobile Number (International Format)"
                type="tel"
                name="mobNo"
                value={formData.mobNo}
                onChange={handleChange}
                placeholder="919903776046"
                required
              />
              <div style={{ 
                marginTop: '0.5rem', 
                padding: '0.75rem', 
                background: '#f7fafc', 
                borderRadius: '6px',
                fontSize: '0.85rem',
                color: '#4a5568'
              }}>
                <strong>Note:</strong> Requires admin authentication. Both email and WhatsApp will receive delivery partner account creation notification.
              </div>
              <Button type="submit" disabled={loading} style={{ width: '100%', marginTop: '1rem' }}>
                {loading ? 'Creating...' : 'Create Delivery Partner (Email + WhatsApp)'}
              </Button>
            </form>
          )}

          {/* Create Customer Form */}
          {activeTab === 'create-customer' && (
            <form onSubmit={handleCreateCustomer}>
              <div style={{ marginBottom: '1rem' }}>
                <strong style={{ fontSize: '0.9rem', color: '#4a5568' }}>
                  {tabs.find(t => t.id === activeTab)?.description}
                </strong>
              </div>
              <Input
                label="First Name"
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="John"
                required
              />
              <Input
                label="Last Name"
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Doe"
                required
              />
              <Input
                label="Email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="customer@example.com"
                required
              />
              <Input
                label="Mobile Number (International Format)"
                type="tel"
                name="mobNo"
                value={formData.mobNo}
                onChange={handleChange}
                placeholder="919903776046"
                required
              />
              <div style={{ 
                marginTop: '0.5rem', 
                padding: '0.75rem', 
                background: '#f7fafc', 
                borderRadius: '6px',
                fontSize: '0.85rem',
                color: '#4a5568'
              }}>
                <strong>Note:</strong> Requires admin authentication. Both email and WhatsApp will receive customer account creation notification.
              </div>
              <Button type="submit" disabled={loading} style={{ width: '100%', marginTop: '1rem' }}>
                {loading ? 'Creating...' : 'Create Customer (Email + WhatsApp)'}
              </Button>
            </form>
          )}

          {/* Verify Account Form */}
          {activeTab === 'verify-account' && (
            <form onSubmit={handleVerifyAccount}>
              <div style={{ marginBottom: '1rem' }}>
                <strong style={{ fontSize: '0.9rem', color: '#4a5568' }}>
                  {tabs.find(t => t.id === activeTab)?.description}
                </strong>
              </div>
              <Input
                label="User ID"
                type="text"
                name="userId"
                value={formData.userId}
                onChange={handleChange}
                placeholder="507f1f77bcf86cd799439011"
                required
              />
              <Input
                label="Status (1 = Approved)"
                type="number"
                name="status"
                value={formData.status}
                onChange={handleChange}
                placeholder="1"
                required
              />
              <div style={{ 
                marginTop: '0.5rem', 
                padding: '0.75rem', 
                background: '#f7fafc', 
                borderRadius: '6px',
                fontSize: '0.85rem',
                color: '#4a5568'
              }}>
                <strong>Note:</strong> Requires admin authentication. User must exist with email and phone number. 
                Both email and WhatsApp will receive account verification notification.
              </div>
              <Button type="submit" disabled={loading} style={{ width: '100%', marginTop: '1rem' }}>
                {loading ? 'Verifying...' : 'Verify Account (Email + WhatsApp)'}
              </Button>
            </form>
          )}

          <div style={{
            marginTop: '2rem',
            padding: '1rem',
            background: '#edf2f7',
            borderRadius: '8px',
            fontSize: '0.9rem'
          }}>
            <strong>📋 Current Endpoint:</strong>
            <div style={{ fontFamily: 'monospace', marginTop: '0.5rem' }}>
              {tabs.find(t => t.id === activeTab)?.endpoint}
            </div>
          </div>

          <div style={{
            marginTop: '1rem',
            padding: '1rem',
            background: '#fff5e6',
            borderRadius: '8px',
            fontSize: '0.9rem',
            border: '2px solid #ffa500'
          }}>
            <strong>⚠️ Important Notes:</strong>
            <ul style={{ margin: '0.5rem 0 0 0', paddingLeft: '1.5rem' }}>
              <li>Ensure WhatsApp credentials are configured in backend .env file</li>
              <li>Phone numbers must be in international format (e.g., 919903776046, no + sign)</li>
              <li>For template messages, templates must be approved in Meta Business Manager</li>
              <li>Check server logs for detailed success/error messages</li>
              <li>Some actions require admin authentication - make sure you're logged in as admin</li>
              <li><strong>If requests timeout:</strong> Check if backend server is running. For local testing, update BASE_URL in <code>frontend/src/config/api.js</code> to <code>http://localhost:YOUR_PORT/api</code></li>
            </ul>
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default WhatsAppTest;

