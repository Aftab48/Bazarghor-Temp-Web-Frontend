import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { clearAuthData, getAuthData } from '../../utils/auth';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    const { user } = getAuthData();
    if (!user) {
      navigate('/admin/login');
    } else {
      setAdmin(user);
    }
  }, [navigate]);

  const handleLogout = () => {
    clearAuthData();
    navigate('/admin/login');
  };

  if (!admin) {
    return (
      <Layout>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p>Loading...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <Card title="👨‍💼 Admin Dashboard">
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ 
              marginTop: 0, 
              color: '#2d3748',
              fontSize: '1.5rem',
              marginBottom: '1.5rem'
            }}>
              Welcome, Admin!
            </h2>

            <div style={{
              background: '#f7fafc',
              padding: '1.5rem',
              borderRadius: '8px',
              border: '2px solid #e2e8f0'
            }}>
              <h3 style={{ 
                marginTop: 0, 
                color: '#4a5568',
                fontSize: '1.1rem',
                marginBottom: '1rem'
              }}>
                📋 Admin Account Details
              </h3>

              <div style={{ display: 'grid', gap: '1rem' }}>
                <div style={{
                  display: 'flex',
                  padding: '0.75rem',
                  background: 'white',
                  borderRadius: '6px',
                  border: '1px solid #e2e8f0'
                }}>
                  <span style={{ 
                    fontWeight: '600', 
                    color: '#2d3748',
                    minWidth: '140px'
                  }}>
                    Admin ID:
                  </span>
                  <span style={{ 
                    color: '#4a5568',
                    fontFamily: 'monospace',
                    fontSize: '0.9rem'
                  }}>
                    {admin.id}
                  </span>
                </div>

                <div style={{
                  display: 'flex',
                  padding: '0.75rem',
                  background: 'white',
                  borderRadius: '6px',
                  border: '1px solid #e2e8f0'
                }}>
                  <span style={{ 
                    fontWeight: '600', 
                    color: '#2d3748',
                    minWidth: '140px'
                  }}>
                    Name:
                  </span>
                  <span style={{ color: '#4a5568' }}>{admin.name}</span>
                </div>

                <div style={{
                  display: 'flex',
                  padding: '0.75rem',
                  background: 'white',
                  borderRadius: '6px',
                  border: '1px solid #e2e8f0'
                }}>
                  <span style={{ 
                    fontWeight: '600', 
                    color: '#2d3748',
                    minWidth: '140px'
                  }}>
                    Email:
                  </span>
                  <span style={{ color: '#4a5568' }}>{admin.email}</span>
                </div>

                <div style={{
                  display: 'flex',
                  padding: '0.75rem',
                  background: 'white',
                  borderRadius: '6px',
                  border: '1px solid #e2e8f0'
                }}>
                  <span style={{ 
                    fontWeight: '600', 
                    color: '#2d3748',
                    minWidth: '140px'
                  }}>
                    Mobile Number:
                  </span>
                  <span style={{ color: '#4a5568' }}>{admin.mobNo}</span>
                </div>

                <div style={{
                  display: 'flex',
                  padding: '0.75rem',
                  background: 'white',
                  borderRadius: '6px',
                  border: '1px solid #e2e8f0'
                }}>
                  <span style={{ 
                    fontWeight: '600', 
                    color: '#2d3748',
                    minWidth: '140px'
                  }}>
                    Role:
                  </span>
                  <span style={{ 
                    color: '#667eea',
                    fontWeight: '600',
                    textTransform: 'uppercase'
                  }}>
                    {admin.roles?.[0]?.code || 'Admin'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div style={{
            padding: '1rem',
            background: '#edf2f7',
            borderRadius: '8px',
            marginBottom: '1.5rem',
            fontSize: '0.9rem'
          }}>
            <strong>ℹ️ Note:</strong> This data is loaded from your current login session
          </div>

          <Button 
            onClick={handleLogout}
            style={{ 
              width: '100%',
              background: '#e53e3e',
              fontSize: '1rem',
              fontWeight: '600'
            }}
          >
            🚪 Logout
          </Button>
        </Card>
      </div>
    </Layout>
  );
};

export default AdminDashboard;

