import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from '../../components/Layout';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { api } from '../../config/api';
import { isAuthenticated } from '../../utils/auth';

const AdminVendorDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(false);
  const [approving, setApproving] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/admin/login');
      return;
    }
    if (id) {
      loadVendor();
    }
  }, [navigate, id]);

  const loadVendor = async () => {
    setLoading(true);
    try {
      const res = await api.staff.getVendorById(id);
      if (res.data.code === 'SUCCESS') {
        setVendor(res.data.data);
      } else {
        alert('Failed to load vendor: ' + (res.data.message || 'Unknown error'));
        navigate('/admin/vendors');
      }
    } catch (err) {
      console.error('Error loading vendor:', err);
      alert('Error loading vendor. Please try again.');
      navigate('/admin/vendors');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!window.confirm('Are you sure you want to approve this vendor?')) {
      return;
    }

    setApproving(true);
    try {
      const res = await api.staff.verifyUserStatus(id, { roleType: 'VENDOR' });
      if (res.data.code === 'SUCCESS') {
        alert('Vendor approved successfully!');
        loadVendor(); // Reload the vendor data
      } else {
        alert('Failed to approve vendor: ' + (res.data.message || 'Unknown error'));
      }
    } catch (err) {
      console.error('Error approving vendor:', err);
      alert('Error approving vendor. Please try again.');
    } finally {
      setApproving(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      1: { label: 'Pending', color: '#ed8936', bg: '#feebc8' },
      2: { label: 'Approved', color: '#48bb78', bg: '#c6f6d5' },
      3: { label: 'Declined', color: '#fc8181', bg: '#fed7d7' }
    };

    const statusInfo = statusMap[status] || statusMap[1];
    return (
      <span style={{
        padding: '0.5rem 1rem',
        borderRadius: '6px',
        fontSize: '0.9rem',
        fontWeight: '600',
        color: statusInfo.color,
        background: statusInfo.bg,
        textTransform: 'uppercase'
      }}>
        {statusInfo.label}
      </span>
    );
  };

  if (loading) {
    return (
      <Layout>
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <p>Loading vendor details...</p>
        </div>
      </Layout>
    );
  }

  if (!vendor) {
    return (
      <Layout>
        <Card title="Vendor Not Found">
          <p>Vendor not found or you don't have access to view it.</p>
          <Button onClick={() => navigate('/admin/vendors')}>
            ← Back to Vendor List
          </Button>
        </Card>
      </Layout>
    );
  }

  return (
    <Layout>
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '1rem' }}>
        <Card title={`Vendor Details - ${vendor.vendorId?.firstName} ${vendor.vendorId?.lastName}`}>
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1.5rem'
            }}>
              <div>
                <h2 style={{ margin: 0, color: '#2d3748' }}>
                  {vendor.vendorId?.firstName} {vendor.vendorId?.lastName}
                </h2>
                {getStatusBadge(vendor.vendorId?.status)}
              </div>
              {vendor.vendorId?.status === 1 && (
                <Button
                  onClick={handleApprove}
                  disabled={approving}
                  variant="success"
                >
                  {approving ? '⏳ Approving...' : '✅ Approve Vendor'}
                </Button>
              )}
            </div>

            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '1.5rem'
            }}>
              <div style={{
                background: '#f7fafc',
                padding: '1.5rem',
                borderRadius: '8px',
                border: '1px solid #e2e8f0'
              }}>
                <h3 style={{ marginTop: 0, color: '#4a5568', fontSize: '1.1rem' }}>
                  Personal Information
                </h3>
                <div style={{ display: 'grid', gap: '0.75rem' }}>
                  <div>
                    <strong style={{ color: '#2d3748' }}>Email:</strong>
                    <div style={{ color: '#4a5568', marginTop: '0.25rem' }}>
                      {vendor.vendorId?.email || 'N/A'}
                    </div>
                  </div>
                  <div>
                    <strong style={{ color: '#2d3748' }}>Mobile Number:</strong>
                    <div style={{ color: '#4a5568', marginTop: '0.25rem' }}>
                      {vendor.vendorId?.mobNo || 'N/A'}
                    </div>
                  </div>
                  <div>
                    <strong style={{ color: '#2d3748' }}>Status:</strong>
                    <div style={{ marginTop: '0.25rem' }}>
                      {getStatusBadge(vendor.vendorId?.status)}
                    </div>
                  </div>
                  <div>
                    <strong style={{ color: '#2d3748' }}>Active:</strong>
                    <div style={{ color: '#4a5568', marginTop: '0.25rem' }}>
                      {vendor.vendorId?.isActive ? '✅ Yes' : '❌ No'}
                    </div>
                  </div>
                </div>
              </div>

              <div style={{
                background: '#f7fafc',
                padding: '1.5rem',
                borderRadius: '8px',
                border: '1px solid #e2e8f0'
              }}>
                <h3 style={{ marginTop: 0, color: '#4a5568', fontSize: '1.1rem' }}>
                  Store Information
                </h3>
                <div style={{ display: 'grid', gap: '0.75rem' }}>
                  <div>
                    <strong style={{ color: '#2d3748' }}>Store Name:</strong>
                    <div style={{ color: '#4a5568', marginTop: '0.25rem' }}>
                      {vendor.storeName || 'N/A'}
                    </div>
                  </div>
                  <div>
                    <strong style={{ color: '#2d3748' }}>Store Code:</strong>
                    <div style={{ color: '#4a5568', marginTop: '0.25rem' }}>
                      {vendor.storeCode || 'N/A'}
                    </div>
                  </div>
                  <div>
                    <strong style={{ color: '#2d3748' }}>Store Address:</strong>
                    <div style={{ color: '#4a5568', marginTop: '0.25rem' }}>
                      {vendor.storeAddress || 'N/A'}
                    </div>
                  </div>
                  <div>
                    <strong style={{ color: '#2d3748' }}>Store Status:</strong>
                    <div style={{ marginTop: '0.25rem' }}>
                      {vendor.storeStatus ? getStatusBadge(vendor.storeStatus) : 'N/A'}
                    </div>
                  </div>
                  {vendor.email && (
                    <div>
                      <strong style={{ color: '#2d3748' }}>Store Email:</strong>
                      <div style={{ color: '#4a5568', marginTop: '0.25rem' }}>
                        {vendor.email}
                      </div>
                    </div>
                  )}
                  {vendor.contactNumber && (
                    <div>
                      <strong style={{ color: '#2d3748' }}>Store Contact:</strong>
                      <div style={{ color: '#4a5568', marginTop: '0.25rem' }}>
                        {vendor.contactNumber}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {vendor.vendorId?.profilePicture && (
              <div style={{ marginTop: '1.5rem' }}>
                <h3 style={{ color: '#4a5568', fontSize: '1.1rem', marginBottom: '0.5rem' }}>
                  Profile Picture
                </h3>
                <img 
                  src={vendor.vendorId.profilePicture.url || vendor.vendorId.profilePicture} 
                  alt="Profile"
                  style={{
                    maxWidth: '200px',
                    maxHeight: '200px',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0'
                  }}
                />
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            <Button 
              onClick={() => navigate('/admin/vendors')}
              variant="secondary"
            >
              ← Back to Vendor List
            </Button>
            <Button 
              onClick={() => navigate('/admin/dashboard')}
              variant="secondary"
            >
              ← Back to Dashboard
            </Button>
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default AdminVendorDetail;

