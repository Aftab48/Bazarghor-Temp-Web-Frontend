import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import Card from '../../components/Card';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { api } from '../../config/api';
import { setAuthData } from '../../utils/auth';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await api.admin.login(formData);
      
      if (response.data) {
        setMessage({ type: 'success', text: 'Login successful!' });
        
        // Store auth data
        if (response.data.data?.token) {
          const userData = {
            id: response.data.data.id,
            email: response.data.data.email,
            mobNo: response.data.data.mobNo,
            name: response.data.data.name,
            roles: response.data.data.roles
          };
          
          setAuthData(
            response.data.data.token,
            userData,
            response.data.data.refreshToken
          );
        }

        setTimeout(() => {
          navigate('/admin/dashboard');
        }, 1000);
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Login failed. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div style={{ maxWidth: '500px', margin: '0 auto' }}>
        <Card title="👨‍💼 Admin Login">
          <form onSubmit={handleSubmit}>
            <Input
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="admin@bazarghor.com"
              required
            />

            <Input
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
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
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </form>

          <div style={{
            marginTop: '2rem',
            padding: '1rem',
            background: '#edf2f7',
            borderRadius: '8px',
            fontSize: '0.9rem'
          }}>
            <strong>📋 API Endpoint:</strong>
            <div style={{ fontFamily: 'monospace', marginTop: '0.5rem' }}>
              POST /api/admin/login
            </div>
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default AdminLogin;

