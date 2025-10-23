import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import Card from '../../components/Card';
import Input from '../../components/Input';
import Select from '../../components/Select';
import Button from '../../components/Button';
import { api } from '../../config/api';
import { isAuthenticated } from '../../utils/auth';

const DeliveryPartnerUpdateProfile = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    gender: '',
    vehicleNo: '',
    driverLicenseNo: ''
  });
  const [files, setFiles] = useState({
    profilePicture: null,
    vehiclePictures: []
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/delivery-partner/login');
      return;
    }
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.deliveryPartner.getProfile();
      const profile = response.data?.data;
      
      if (profile) {
        setFormData({
          firstName: profile.firstName || '',
          lastName: profile.lastName || '',
          email: profile.email || '',
          gender: profile.gender || '',
          vehicleNo: profile.vehicleDetails?.vehicleNo || '',
          driverLicenseNo: profile.vehicleDetails?.driverLicenseNo || ''
        });
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    if (e.target.name === 'vehiclePictures') {
      setFiles({
        ...files,
        vehiclePictures: Array.from(e.target.files)
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

      if (files.vehiclePictures.length > 0) {
        files.vehiclePictures.forEach(file => {
          formDataToSend.append('vehiclePictures', file);
        });
      }

      const response = await api.deliveryPartner.updateProfile(formDataToSend);
      
      setMessage({ 
        type: 'success', 
        text: response.data?.message || 'Profile updated successfully!' 
      });

      setTimeout(() => {
        navigate('/delivery-partner/profile');
      }, 1500);
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to update profile.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div style={{ maxWidth: '700px', margin: '0 auto' }}>
        <Card title="✏️ Update Delivery Partner Profile">
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <Input
                label="First Name"
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="John"
              />

              <Input
                label="Last Name"
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Doe"
              />
            </div>

            <Input
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="delivery@example.com"
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
            <h3 style={{ marginTop: 0 }}>Vehicle Details</h3>

            <Input
              label="Vehicle Number"
              type="text"
              name="vehicleNo"
              value={formData.vehicleNo}
              onChange={handleChange}
              placeholder="MH01XX1234"
            />

            <Input
              label="Driver License Number"
              type="text"
              name="driverLicenseNo"
              value={formData.driverLicenseNo}
              onChange={handleChange}
              placeholder="DL1234567890"
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
                Vehicle Pictures
              </label>
              <input
                type="file"
                name="vehiclePictures"
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
                You can select up to 5 vehicle pictures
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

            <div style={{ display: 'flex', gap: '1rem' }}>
              <Button type="submit" disabled={loading} style={{ flex: 1 }}>
                {loading ? 'Updating...' : 'Update Profile'}
              </Button>
              <Button 
                type="button" 
                variant="secondary" 
                onClick={() => navigate('/delivery-partner/profile')}
              >
                Cancel
              </Button>
            </div>
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
              PUT /api/delivery-partner/update-profile
            </div>
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default DeliveryPartnerUpdateProfile;

