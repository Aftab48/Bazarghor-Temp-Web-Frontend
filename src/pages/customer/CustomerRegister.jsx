import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import Card from '../../components/Card';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { api } from '../../config/api';

const CustomerRegister = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    mobNo: ''
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
      const formDataToSend = new FormData();
      
      // Combine firstName and lastName into fullName for backend
      const fullName = `${formData.firstName} ${formData.lastName}`.trim();
      formDataToSend.append('fullName', fullName);
      formDataToSend.append('mobNo', formData.mobNo);

      const response = await api.customer.register(formDataToSend);
      
      setMessage({ 
        type: 'success', 
        text: response.data?.message || 'Customer registered successfully!' 
      });

      setTimeout(() => {
        navigate('/customer/login');
      }, 2000);
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Registration failed. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div style={{ maxWidth: '700px', margin: '0 auto' }}>
        <Card title="🛍️ Customer Registration">
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
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
            </div>

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
              {loading ? 'Registering...' : 'Register'}
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
              POST /api/customers/create-customer
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '1rem' }}>
            <span style={{ color: '#718096' }}>Already have an account? </span>
            <a href="/customer/login" style={{ color: '#667eea', fontWeight: '600' }}>
              Login here
            </a>
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default CustomerRegister;

