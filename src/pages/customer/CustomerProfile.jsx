import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { api } from '../../config/api';
import { isAuthenticated } from '../../utils/auth';

const CustomerProfile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/customer/login');
      return;
    }
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.customer.getProfile();
      setProfile(response.data?.data?.customer);
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to fetch profile.'
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <div style={{ fontSize: '1.2rem', color: '#718096' }}>Loading profile...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <Card title="👤 Customer Profile">
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

          {profile ? (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
                <div>
                  <strong style={{ color: '#718096', fontSize: '0.9rem' }}>Full Name:</strong>
                  <div style={{ fontSize: '1.1rem', marginTop: '0.25rem' }}>{profile.fullName || 'N/A'}</div>
                </div>
                <div>
                  <strong style={{ color: '#718096', fontSize: '0.9rem' }}>Mobile Number:</strong>
                  <div style={{ fontSize: '1.1rem', marginTop: '0.25rem' }}>{profile.mobNo}</div>
                </div>
                <div>
                  <strong style={{ color: '#718096', fontSize: '0.9rem' }}>Email:</strong>
                  <div style={{ fontSize: '1.1rem', marginTop: '0.25rem' }}>{profile.email || 'N/A'}</div>
                </div>
                <div>
                  <strong style={{ color: '#718096', fontSize: '0.9rem' }}>Gender:</strong>
                  <div style={{ fontSize: '1.1rem', marginTop: '0.25rem' }}>{profile.gender || 'N/A'}</div>
                </div>
                <div>
                  <strong style={{ color: '#718096', fontSize: '0.9rem' }}>Date of Birth:</strong>
                  <div style={{ fontSize: '1.1rem', marginTop: '0.25rem' }}>{profile.dob || 'N/A'}</div>
                </div>
                <div>
                  <strong style={{ color: '#718096', fontSize: '0.9rem' }}>Profile Completed:</strong>
                  <div style={{ fontSize: '1.1rem', marginTop: '0.25rem' }}>{profile.profileCompleted}%</div>
                </div>
              </div>

              {profile.customerAddress && profile.customerAddress.length > 0 && (
                <div style={{ marginTop: '2rem' }}>
                  <h3 style={{ marginBottom: '1rem' }}>📍 Addresses</h3>
                  {profile.customerAddress.map((address, idx) => (
                    <div key={idx} style={{
                      padding: '1rem',
                      background: '#f7fafc',
                      borderRadius: '8px',
                      marginBottom: '1rem',
                      border: '2px solid #e2e8f0'
                    }}>
                      <div style={{ fontWeight: '600', marginBottom: '0.5rem' }}>
                        {address.addressType} {address.isDefault && '(Default)'}
                      </div>
                      <div>{address.addressLine1}</div>
                      {address.addressLine2 && <div>{address.addressLine2}</div>}
                      <div>{address.city}, {address.state} - {address.pincode}</div>
                      {address.landmark && <div>Landmark: {address.landmark}</div>}
                    </div>
                  ))}
                </div>
              )}

              <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                <Button onClick={() => navigate('/customer/update-profile')}>
                  Edit Profile
                </Button>
                <Button variant="secondary" onClick={() => navigate('/customer/address')}>
                  Manage Addresses
                </Button>
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#718096' }}>
              No profile data available
            </div>
          )}

          <div style={{
            marginTop: '2rem',
            padding: '1rem',
            background: '#edf2f7',
            borderRadius: '8px',
            fontSize: '0.9rem'
          }}>
            <strong>📋 API Endpoint:</strong>
            <div style={{ fontFamily: 'monospace', marginTop: '0.5rem' }}>
              GET /api/customers/profile
            </div>
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default CustomerProfile;

