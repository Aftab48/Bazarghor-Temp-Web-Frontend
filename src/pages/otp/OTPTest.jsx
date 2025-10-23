import { useState } from 'react';
import Layout from '../../components/Layout';
import Card from '../../components/Card';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { api } from '../../config/api';

const OTPTest = () => {
  const [activeTab, setActiveTab] = useState('send-registration');
  const [formData, setFormData] = useState({
    mobNo: '',
    otp: ''
  });
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSendRegistrationOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await api.otp.sendRegistrationOTP({ mobNo: formData.mobNo });
      setMessage({ 
        type: 'success', 
        text: `OTP sent! OTP: ${response.data?.data?.otp || '123456'}` 
      });
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to send OTP.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyRegistrationOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await api.otp.verifyRegistrationOTP(formData);
      setMessage({ 
        type: 'success', 
        text: response.data?.message || 'OTP verified successfully!' 
      });
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'OTP verification failed.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await api.otp.verifyLogin(formData);
      setMessage({ 
        type: 'success', 
        text: response.data?.message || 'Login verified successfully!' 
      });
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Login verification failed.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await api.otp.resend({ mobNo: formData.mobNo });
      setMessage({ 
        type: 'success', 
        text: `OTP resent! OTP: ${response.data?.data?.otp || '123456'}` 
      });
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to resend OTP.'
      });
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'send-registration', label: 'Send Registration OTP', endpoint: 'POST /api/otp/send-otp-registration' },
    { id: 'verify-registration', label: 'Verify Registration OTP', endpoint: 'POST /api/otp/verify-otp-registration' },
    { id: 'verify-login', label: 'Verify Login', endpoint: 'POST /api/otp/verify-login' },
    { id: 'resend', label: 'Resend OTP', endpoint: 'POST /api/otp/resend' }
  ];

  return (
    <Layout>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <Card title="🔐 OTP Services Testing">
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setMessage({ type: '', text: '' });
                }}
                style={{
                  padding: '0.75rem 1rem',
                  background: activeTab === tab.id ? '#667eea' : '#e2e8f0',
                  color: activeTab === tab.id ? 'white' : '#2d3748',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '0.9rem',
                  transition: 'all 0.3s ease'
                }}
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
              {message.text}
            </div>
          )}

          {activeTab === 'send-registration' && (
            <form onSubmit={handleSendRegistrationOTP}>
              <Input
                label="Mobile Number"
                type="tel"
                name="mobNo"
                value={formData.mobNo}
                onChange={handleChange}
                placeholder="1234567890"
                required
              />
              <Button type="submit" disabled={loading} style={{ width: '100%' }}>
                {loading ? 'Sending...' : 'Send Registration OTP'}
              </Button>
            </form>
          )}

          {activeTab === 'verify-registration' && (
            <form onSubmit={handleVerifyRegistrationOTP}>
              <Input
                label="Mobile Number"
                type="tel"
                name="mobNo"
                value={formData.mobNo}
                onChange={handleChange}
                placeholder="1234567890"
                required
              />
              <Input
                label="OTP"
                type="text"
                name="otp"
                value={formData.otp}
                onChange={handleChange}
                placeholder="Enter 6-digit OTP"
                required
              />
              <Button type="submit" disabled={loading} style={{ width: '100%' }}>
                {loading ? 'Verifying...' : 'Verify Registration OTP'}
              </Button>
            </form>
          )}

          {activeTab === 'verify-login' && (
            <form onSubmit={handleVerifyLogin}>
              <Input
                label="Mobile Number"
                type="tel"
                name="mobNo"
                value={formData.mobNo}
                onChange={handleChange}
                placeholder="1234567890"
                required
              />
              <Input
                label="OTP"
                type="text"
                name="otp"
                value={formData.otp}
                onChange={handleChange}
                placeholder="Enter 6-digit OTP"
                required
              />
              <Button type="submit" disabled={loading} style={{ width: '100%' }}>
                {loading ? 'Verifying...' : 'Verify Login'}
              </Button>
            </form>
          )}

          {activeTab === 'resend' && (
            <form onSubmit={handleResend}>
              <Input
                label="Mobile Number"
                type="tel"
                name="mobNo"
                value={formData.mobNo}
                onChange={handleChange}
                placeholder="1234567890"
                required
              />
              <Button type="submit" disabled={loading} style={{ width: '100%' }}>
                {loading ? 'Resending...' : 'Resend OTP'}
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
            <strong>ℹ️ Note:</strong> The backend uses a hardcoded OTP "123456" for testing purposes.
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default OTPTest;

