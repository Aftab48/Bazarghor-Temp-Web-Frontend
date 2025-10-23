import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import Card from '../../components/Card';
import Input from '../../components/Input';
import Select from '../../components/Select';
import Button from '../../components/Button';
import { api } from '../../config/api';

const VendorRegister = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    mobNo: '',
    email: '',
    gender: '',
    shopname: '',
    shopaddress: '',
    pincode: '',
    consentAgree: true
  });
  const [files, setFiles] = useState({
    profilePicture: null,
    storePictures: []
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    if (e.target.name === 'storePictures') {
      setFiles({
        ...files,
        storePictures: Array.from(e.target.files)
      });
    } else {
      setFiles({
        ...files,
        [e.target.name]: e.target.files[0]
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const formDataToSend = new FormData();
      
      Object.keys(formData).forEach(key => {
        if (formData[key]) {
          formDataToSend.append(key, formData[key]);
        }
      });

      if (files.profilePicture) {
        formDataToSend.append('profilePicture', files.profilePicture);
      }

      if (files.storePictures.length > 0) {
        files.storePictures.forEach(file => {
          formDataToSend.append('storePictures', file);
        });
      }

      const response = await api.vendor.register(formDataToSend);
      
      setMessage({ 
        type: 'success', 
        text: response.data?.message || 'Vendor registered successfully!' 
      });

      setTimeout(() => {
        navigate('/vendor/login');
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
        <Card title="🏪 Vendor Registration">
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

            <Input
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="vendor@example.com"
            />

            <Select
              label="Gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              options={[
                { value: 'male', label: 'Male' },
                { value: 'female', label: 'Female' },
                { value: 'other', label: 'Other' }
              ]}
            />

            <hr style={{ margin: '2rem 0', border: 'none', borderTop: '2px solid #e2e8f0' }} />
            <h3 style={{ marginTop: 0 }}>Store Details</h3>

            <Input
              label="Shop Name"
              type="text"
              name="shopname"
              value={formData.shopname}
              onChange={handleChange}
              placeholder="My Store"
              required
            />

            <Input
              label="Shop Address"
              type="text"
              name="shopaddress"
              value={formData.shopaddress}
              onChange={handleChange}
              placeholder="Shop location"
              required
            />

            <Input
              label="Pincode"
              type="text"
              name="pincode"
              value={formData.pincode}
              onChange={handleChange}
              placeholder="123456"
              required
            />

            <Input
              label="Profile Picture"
              type="file"
              name="profilePicture"
              onChange={handleFileChange}
              accept="image/*"
            />

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                color: '#2d3748',
                fontWeight: '600',
                fontSize: '0.9rem'
              }}>
                Store Pictures
              </label>
              <input
                type="file"
                name="storePictures"
                onChange={handleFileChange}
                accept="image/*"
                multiple
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '2px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  transition: 'border-color 0.3s ease',
                  boxSizing: 'border-box'
                }}
              />
              <div style={{ fontSize: '0.85rem', color: '#718096', marginTop: '0.5rem' }}>
                You can select up to 5 store pictures
              </div>
            </div>

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
              POST /api/vendors/create-vendor
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '1rem' }}>
            <span style={{ color: '#718096' }}>Already have an account? </span>
            <a href="/vendor/login" style={{ color: '#667eea', fontWeight: '600' }}>
              Login here
            </a>
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default VendorRegister;

