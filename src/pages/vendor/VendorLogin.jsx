import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import Card from '../../components/Card';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { api } from '../../config/api';
import { setAuthData } from '../../utils/auth';

const VendorLogin = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState('send-otp');
  const [formData, setFormData] = useState({
    mobNo: '',
    otp: '',
    deviceDetail: 'web-browser'
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await api.vendor.sendOTP({ mobNo: formData.mobNo });
      
      setMessage({ 
        type: 'success', 
        text: `OTP sent successfully! OTP: ${response.data?.data?.otp || '123456'}` 
      });
      setStep('verify-otp');
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to send OTP. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await api.vendor.verifyOTP({
        mobNo: formData.mobNo,
        otp: formData.otp,
        deviceDetail: formData.deviceDetail
      });
      
      setMessage({ 
        type: 'success', 
        text: 'Login successful!' 
      });

      if (response.data?.data?.token) {
        setAuthData(
          response.data.data.token,
          response.data.data.user,
          response.data.data.refreshToken
        );
      }

      setTimeout(() => {
        navigate('/vendor/profile');
      }, 1000);
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'OTP verification failed. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await api.vendor.resendOTP({ mobNo: formData.mobNo });
      
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

  return (
    <Layout>
      <div style={{ maxWidth: '500px', margin: '0 auto' }}>
        <Card title="🏪 Vendor Login">
          {step === 'send-otp' ? (
            <form onSubmit={handleSendOTP}>
              <Input
                label="Mobile Number"
                type="tel"
                name="mobNo"
                value={formData.mobNo}
                onChange={handleChange}
                placeholder="1234567890"
                required
              />

              {message.text && (
                <div style={{
                  padding: '1rem',
                  borderRadius: '8px',
                  marginBottom: '1rem',
                  background: message.type === 'success' ? '#c6f6d5' : '#fed7d7',
                  color: message.type === 'success' ? '#22543d' : '#742a2a',
                  border: `2px solid ${message.type === 'success' ? '#9ae6b4' : '#fc8181'}`
                }}>
                  {message.text}
                </div>
              )}

              <Button type="submit" disabled={loading} style={{ width: '100%' }}>
                {loading ? 'Sending OTP...' : 'Send OTP'}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOTP}>
              <Input
                label="Mobile Number"
                type="tel"
                name="mobNo"
                value={formData.mobNo}
                onChange={handleChange}
                disabled
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

              {message.text && (
                <div style={{
                  padding: '1rem',
                  borderRadius: '8px',
                  marginBottom: '1rem',
                  background: message.type === 'success' ? '#c6f6d5' : '#fed7d7',
                  color: message.type === 'success' ? '#22543d' : '#742a2a',
                  border: `2px solid ${message.type === 'success' ? '#9ae6b4' : '#fc8181'}`
                }}>
                  {message.text}
                </div>
              )}

              <div style={{ display: 'flex', gap: '1rem' }}>
                <Button type="submit" disabled={loading} style={{ flex: 1 }}>
                  {loading ? 'Verifying...' : 'Verify & Login'}
                </Button>
                <Button 
                  type="button" 
                  variant="secondary" 
                  onClick={handleResendOTP}
                  disabled={loading}
                >
                  Resend
                </Button>
              </div>

              <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                <button
                  type="button"
                  onClick={() => setStep('send-otp')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#667eea',
                    cursor: 'pointer',
                    fontSize: '0.9rem'
                  }}
                >
                  ← Change mobile number
                </button>
              </div>
            </form>
          )}

          <div style={{
            marginTop: '2rem',
            padding: '1rem',
            background: '#edf2f7',
            borderRadius: '8px',
            fontSize: '0.9rem'
          }}>
            <strong>📋 API Endpoints:</strong>
            <div style={{ fontFamily: 'monospace', marginTop: '0.5rem' }}>
              POST /api/vendors/login/send-otp<br />
              POST /api/vendors/login/verify<br />
              POST /api/vendors/login/resend
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '1rem' }}>
            <span style={{ color: '#718096' }}>Don't have an account? </span>
            <a href="/vendor/register" style={{ color: '#667eea', fontWeight: '600' }}>
              Register here
            </a>
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default VendorLogin;

