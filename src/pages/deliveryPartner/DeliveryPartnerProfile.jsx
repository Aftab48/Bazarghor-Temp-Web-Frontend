import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { api } from '../../config/api';
import { isAuthenticated } from '../../utils/auth';

const DeliveryPartnerProfile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
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
        <Card title="🚚 Delivery Partner Profile">
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
                  <div style={{ fontSize: '1.1rem', marginTop: '0.25rem' }}>{profile.gender || 'N/A'}</div>
                </div>
              </div>

              {profile.vehicleDetails && (
                <>
                  <h3>Vehicle Information</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
                    <div>
                      <strong style={{ color: '#718096', fontSize: '0.9rem' }}>Vehicle Type:</strong>
                      <div style={{ fontSize: '1.1rem', marginTop: '0.25rem' }}>
                        {profile.vehicleDetails.vehicleType === 'cycle' ? '🚴 Cycle' : 
                         profile.vehicleDetails.vehicleType === 'bike' ? '🏍️ Bike/Motorcycle' : 'N/A'}
                      </div>
                    </div>
                    {profile.vehicleDetails.vehicleType === 'bike' && (
                      <>
                        <div>
                          <strong style={{ color: '#718096', fontSize: '0.9rem' }}>Vehicle Number:</strong>
                          <div style={{ fontSize: '1.1rem', marginTop: '0.25rem' }}>
                            {profile.vehicleDetails.vehicleNo || 'N/A'}
                          </div>
                        </div>
                        <div>
                          <strong style={{ color: '#718096', fontSize: '0.9rem' }}>Driver License:</strong>
                          <div style={{ fontSize: '1.1rem', marginTop: '0.25rem' }}>
                            {profile.vehicleDetails.driverLicenseNo || 'N/A'}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </>
              )}

              <Button onClick={() => navigate('/delivery-partner/update-profile')}>
                Edit Profile
              </Button>
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
              GET /api/delivery-partner/profile
            </div>
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default DeliveryPartnerProfile;

