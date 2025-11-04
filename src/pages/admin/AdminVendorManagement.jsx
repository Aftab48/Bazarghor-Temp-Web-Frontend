import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { api } from '../../config/api';
import { isAuthenticated } from '../../utils/auth';

const AdminVendorManagement = () => {
  const navigate = useNavigate();
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [approving, setApproving] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // all, pending, approved, decline

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/admin/login');
      return;
    }
    loadVendors();
  }, [navigate]);

  const loadVendors = async () => {
    setLoading(true);
    try {
      const res = await api.staff.getAllVendors();
      if (res.data.code === 'SUCCESS') {
        setVendors(res.data.data || []);
      } else {
        alert('Failed to load vendors: ' + (res.data.message || 'Unknown error'));
      }
    } catch (err) {
      console.error('Error loading vendors:', err);
      alert('Error loading vendors. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (vendorId) => {
    if (!window.confirm('Are you sure you want to approve this vendor?')) {
      return;
    }

    setApproving({ ...approving, [vendorId]: true });
    try {
      const res = await api.staff.verifyUserStatus(vendorId, { roleType: 'VENDOR' });
      if (res.data.code === 'SUCCESS') {
        alert('Vendor approved successfully!');
        loadVendors(); // Reload the list
      } else {
        alert('Failed to approve vendor: ' + (res.data.message || 'Unknown error'));
      }
    } catch (err) {
      console.error('Error approving vendor:', err);
      alert('Error approving vendor. Please try again.');
    } finally {
      setApproving({ ...approving, [vendorId]: false });
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
        padding: '0.4rem 0.8rem',
        borderRadius: '6px',
        fontSize: '0.85rem',
        fontWeight: '600',
        color: statusInfo.color,
        background: statusInfo.bg,
        textTransform: 'uppercase'
      }}>
        {statusInfo.label}
      </span>
    );
  };

  const filteredVendors = vendors.filter(vendor => {
    const matchesSearch = searchTerm === '' || 
      (vendor.vendorId?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
       vendor.vendorId?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
       vendor.vendorId?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
       vendor.storeName?.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'pending' && vendor.vendorId?.status === 1) ||
      (statusFilter === 'approved' && vendor.vendorId?.status === 2) ||
      (statusFilter === 'decline' && vendor.vendorId?.status === 3);

    return matchesSearch && matchesStatus;
  });

  const pendingCount = vendors.filter(v => v.vendorId?.status === 1).length;
  const approvedCount = vendors.filter(v => v.vendorId?.status === 2).length;

  return (
    <Layout>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1rem' }}>
        <Card title="🏪 Vendor Management">
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ 
              display: 'flex', 
              gap: '1rem', 
              marginBottom: '1rem',
              flexWrap: 'wrap',
              alignItems: 'center'
            }}>
              <input
                type="text"
                placeholder="Search vendors by name, email, or store..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  flex: '1',
                  minWidth: '300px',
                  padding: '0.75rem',
                  border: '2px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '1rem'
                }}
              />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                style={{
                  padding: '0.75rem 1rem',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  fontSize: '1rem',
                  cursor: 'pointer'
                }}
              >
                <option value="all">All Status</option>
                <option value="pending">Pending ({pendingCount})</option>
                <option value="approved">Approved ({approvedCount})</option>
                <option value="decline">Declined</option>
              </select>
              <Button onClick={loadVendors} disabled={loading}>
                {loading ? '🔄 Loading...' : '🔄 Refresh'}
              </Button>
            </div>

            {pendingCount > 0 && (
              <div style={{
                background: '#feebc8',
                border: '2px solid #ed8936',
                borderRadius: '8px',
                padding: '1rem',
                marginBottom: '1rem'
              }}>
                <strong style={{ color: '#c05621' }}>
                  ⚠️ {pendingCount} vendor{pendingCount > 1 ? 's' : ''} pending approval
                </strong>
              </div>
            )}
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem' }}>
              <p>Loading vendors...</p>
            </div>
          ) : filteredVendors.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem' }}>
              <p style={{ color: '#718096', fontSize: '1.1rem' }}>
                {vendors.length === 0 ? 'No vendors found' : 'No vendors match your search'}
              </p>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '1rem' }}>
              {filteredVendors.map((vendor) => (
                <div
                  key={vendor._id}
                  style={{
                    background: vendor.vendorId?.status === 1 ? '#fff5e6' : '#f7fafc',
                    border: vendor.vendorId?.status === 1 
                      ? '2px solid #ed8936' 
                      : '1px solid #e2e8f0',
                    borderRadius: '8px',
                    padding: '1.5rem',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: '1fr auto',
                    gap: '1rem',
                    alignItems: 'start'
                  }}>
                    <div>
                      <div style={{ 
                        display: 'flex', 
                        gap: '1rem', 
                        alignItems: 'center',
                        marginBottom: '1rem'
                      }}>
                        <h3 style={{ 
                          margin: 0, 
                          color: '#2d3748',
                          fontSize: '1.2rem'
                        }}>
                          {vendor.vendorId?.firstName} {vendor.vendorId?.lastName}
                        </h3>
                        {getStatusBadge(vendor.vendorId?.status)}
                      </div>

                      <div style={{ 
                        display: 'grid', 
                        gap: '0.5rem',
                        fontSize: '0.95rem',
                        color: '#4a5568'
                      }}>
                        <div>
                          <strong>Email:</strong> {vendor.vendorId?.email || 'N/A'}
                        </div>
                        <div>
                          <strong>Mobile:</strong> {vendor.vendorId?.mobNo || 'N/A'}
                        </div>
                        <div>
                          <strong>Store Name:</strong> {vendor.storeName || 'N/A'}
                        </div>
                        <div>
                          <strong>Store Code:</strong> {vendor.storeCode || 'N/A'}
                        </div>
                        <div>
                          <strong>Store Address:</strong> {vendor.storeAddress || 'N/A'}
                        </div>
                        {vendor.storeStatus && (
                          <div>
                            <strong>Store Status:</strong> {getStatusBadge(vendor.storeStatus)}
                          </div>
                        )}
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {vendor.vendorId?.status === 1 && (
                        <Button
                          onClick={() => handleApprove(vendor.vendorId?._id)}
                          disabled={approving[vendor.vendorId?._id]}
                          variant="success"
                          style={{ whiteSpace: 'nowrap' }}
                        >
                          {approving[vendor.vendorId?._id] ? '⏳ Approving...' : '✅ Approve Vendor'}
                        </Button>
                      )}
                      <Button
                        onClick={() => navigate(`/admin/vendors/${vendor.vendorId?._id}`)}
                        variant="secondary"
                        style={{ whiteSpace: 'nowrap' }}
                      >
                        👁️ View Details
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        <div style={{ marginTop: '1.5rem' }}>
          <Button 
            onClick={() => navigate('/admin/dashboard')}
            variant="secondary"
          >
            ← Back to Dashboard
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default AdminVendorManagement;

