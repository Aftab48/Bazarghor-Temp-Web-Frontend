import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import Card from '../../components/Card';
import Input from '../../components/Input';
import Select from '../../components/Select';
import Button from '../../components/Button';
import { api } from '../../config/api';
import { isAuthenticated } from '../../utils/auth';

const CustomerAddress = () => {
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
    landmark: '',
    addressType: 'home',
    isDefault: false
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/customer/login');
      return;
    }
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const response = await api.customer.getProfile();
      setAddresses(response.data?.data?.customer?.customerAddress || []);
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Failed to fetch addresses.'
      });
    }
  };

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      if (editingId) {
        await api.customer.updateAddress(editingId, formData);
        setMessage({ type: 'success', text: 'Address updated successfully!' });
      } else {
        await api.customer.addAddress(formData);
        setMessage({ type: 'success', text: 'Address added successfully!' });
      }
      
      resetForm();
      fetchAddresses();
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Operation failed.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (address) => {
    setFormData({
      addressLine1: address.addressLine1,
      addressLine2: address.addressLine2 || '',
      city: address.city,
      state: address.state,
      pincode: address.pincode,
      landmark: address.landmark || '',
      addressType: address.addressType,
      isDefault: address.isDefault
    });
    setEditingId(address._id);
    setShowForm(true);
  };

  const handleDelete = async (addressId) => {
    if (!confirm('Are you sure you want to delete this address?')) return;

    try {
      await api.customer.deleteAddress(addressId);
      setMessage({ type: 'success', text: 'Address deleted successfully!' });
      fetchAddresses();
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Failed to delete address.'
      });
    }
  };

  const resetForm = () => {
    setFormData({
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      pincode: '',
      landmark: '',
      addressType: 'home',
      isDefault: false
    });
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <Layout>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <Card title="📍 Manage Addresses">
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

          <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
            <Button onClick={() => navigate('/customer/profile')} variant="secondary">
              ← Back to Profile
            </Button>
            {!showForm && (
              <Button onClick={() => setShowForm(true)}>
                + Add New Address
              </Button>
            )}
          </div>

          {showForm && (
            <form onSubmit={handleSubmit} style={{ marginBottom: '2rem', padding: '1.5rem', background: '#f7fafc', borderRadius: '8px' }}>
              <h3 style={{ marginTop: 0 }}>{editingId ? 'Edit Address' : 'Add New Address'}</h3>
              
              <Input
                label="Address Line 1"
                type="text"
                name="addressLine1"
                value={formData.addressLine1}
                onChange={handleChange}
                placeholder="Street, Building"
                required
              />

              <Input
                label="Address Line 2"
                type="text"
                name="addressLine2"
                value={formData.addressLine2}
                onChange={handleChange}
                placeholder="Area, Locality (Optional)"
              />

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <Input
                  label="City"
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                />

                <Input
                  label="State"
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <Input
                  label="Pincode"
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  required
                />

                <Input
                  label="Landmark"
                  type="text"
                  name="landmark"
                  value={formData.landmark}
                  onChange={handleChange}
                  placeholder="Optional"
                />
              </div>

              <Select
                label="Address Type"
                name="addressType"
                value={formData.addressType}
                onChange={handleChange}
                options={[
                  { value: 'home', label: 'Home' },
                  { value: 'office', label: 'Office' },
                  { value: 'other', label: 'Other' }
                ]}
                required
              />

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    name="isDefault"
                    checked={formData.isDefault}
                    onChange={handleChange}
                    style={{ marginRight: '0.5rem' }}
                  />
                  <span>Set as default address</span>
                </label>
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Saving...' : (editingId ? 'Update Address' : 'Add Address')}
                </Button>
                <Button type="button" variant="secondary" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          )}

          <div>
            <h3>Your Addresses</h3>
            {addresses.length > 0 ? (
              <div style={{ display: 'grid', gap: '1rem' }}>
                {addresses.map((address) => (
                  <div key={address._id} style={{
                    padding: '1.5rem',
                    background: 'white',
                    borderRadius: '8px',
                    border: '2px solid #e2e8f0'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: '600', fontSize: '1.1rem', marginBottom: '0.5rem' }}>
                          {address.addressType.charAt(0).toUpperCase() + address.addressType.slice(1)}
                          {address.isDefault && (
                            <span style={{
                              marginLeft: '0.5rem',
                              padding: '0.25rem 0.5rem',
                              background: '#48bb78',
                              color: 'white',
                              borderRadius: '4px',
                              fontSize: '0.75rem'
                            }}>
                              Default
                            </span>
                          )}
                        </div>
                        <div style={{ color: '#4a5568' }}>
                          {address.addressLine1}<br />
                          {address.addressLine2 && <>{address.addressLine2}<br /></>}
                          {address.city}, {address.state} - {address.pincode}<br />
                          {address.landmark && <>Landmark: {address.landmark}</>}
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <Button 
                          variant="secondary" 
                          onClick={() => handleEdit(address)}
                          style={{ padding: '0.5rem 1rem' }}
                        >
                          Edit
                        </Button>
                        <Button 
                          variant="danger" 
                          onClick={() => handleDelete(address._id)}
                          style={{ padding: '0.5rem 1rem' }}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ 
                textAlign: 'center', 
                padding: '3rem', 
                background: '#f7fafc', 
                borderRadius: '8px',
                color: '#718096'
              }}>
                No addresses added yet
              </div>
            )}
          </div>

          <div style={{
            marginTop: '2rem',
            padding: '1rem',
            background: '#edf2f7',
            borderRadius: '8px',
            fontSize: '0.9rem'
          }}>
            <strong>📋 API Endpoints:</strong>
            <div style={{ fontFamily: 'monospace', marginTop: '0.5rem' }}>
              POST /api/customers/address<br />
              PUT /api/customers/address/:addressId<br />
              DELETE /api/customers/address/:addressId
            </div>
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default CustomerAddress;

