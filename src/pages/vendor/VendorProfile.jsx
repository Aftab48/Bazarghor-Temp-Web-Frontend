import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { api } from '../../config/api';
import { isAuthenticated } from '../../utils/auth';

const VendorProfile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/vendor/login');
      return;
    }
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.vendor.getProfile();
      setProfile(response.data?.data);
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
        <Card title="🏪 Vendor Profile">
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
              <h3 style={{ marginTop: 0 }}>Personal Information</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
                <div>
                  <strong style={{ color: '#718096', fontSize: '0.9rem' }}>First Name:</strong>
                  <div style={{ fontSize: '1.1rem', marginTop: '0.25rem' }}>{profile.firstName || 'N/A'}</div>
                </div>
                <div>
                  <strong style={{ color: '#718096', fontSize: '0.9rem' }}>Last Name:</strong>
                  <div style={{ fontSize: '1.1rem', marginTop: '0.25rem' }}>{profile.lastName || 'N/A'}</div>
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
                  <div style={{ fontSize: '1.1rem', marginTop: '0.25rem', textTransform: 'capitalize' }}>
                    {profile.gender || 'N/A'}
                  </div>
                </div>
                <div>
                  <strong style={{ color: '#718096', fontSize: '0.9rem' }}>Date of Birth:</strong>
                  <div style={{ fontSize: '1.1rem', marginTop: '0.25rem' }}>
                    {profile.dob ? new Date(profile.dob).toLocaleDateString() : 'N/A'}
                  </div>
                </div>
              </div>

              {profile.storeDetails && (
                <>
                  <h3>Store Information</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
                    <div>
                      <strong style={{ color: '#718096', fontSize: '0.9rem' }}>Store Name:</strong>
                      <div style={{ fontSize: '1.1rem', marginTop: '0.25rem' }}>
                        {profile.storeDetails.storeName || 'N/A'}
                      </div>
                    </div>
                    <div>
                      <strong style={{ color: '#718096', fontSize: '0.9rem' }}>Store Address:</strong>
                      <div style={{ fontSize: '1.1rem', marginTop: '0.25rem' }}>
                        {profile.storeDetails.storeAddress || 'N/A'}
                      </div>
                    </div>
                  </div>
                </>
              )}

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                <Button onClick={() => navigate('/vendor/update-profile')}>
                  Edit Profile
                </Button>
                <Button 
                  onClick={() => navigate('/vendor/products')}
                  variant="success"
                >
                  Manage Products
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
              GET /api/vendors/profile
            </div>
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default VendorProfile;

