import { useState } from 'react';
import Layout from '../../components/Layout';
import Card from '../../components/Card';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { api } from '../../config/api';
import { getUserRole } from '../../utils/auth';

const StoreManagement = () => {
  const [toggleForm, setToggleForm] = useState({ storeId: '', vendorId: '', isOpen: true });
  const [adminQuery, setAdminQuery] = useState({ search: '', page: 1, limit: 10 });
  const [storeId, setStoreId] = useState('');
  const [updateForm, setUpdateForm] = useState({
    storeName: '',
    storeAddress: '',
    description: '',
    category: '',
    isStoreOpen: true,
    isApproved: true,
  });
  const [customerSearch, setCustomerSearch] = useState({ search: '', category: '', minRating: '' });
  const [customerStoreId, setCustomerStoreId] = useState('');
  const [adminStores, setAdminStores] = useState(null);
  const [storeDetails, setStoreDetails] = useState(null);
  const [customerStores, setCustomerStores] = useState(null);
  const [storeProducts, setStoreProducts] = useState(null);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loadingAction, setLoadingAction] = useState('');

  const handleToggle = async (e) => {
    e.preventDefault();
    if (!toggleForm.storeId.trim()) return;

    setLoadingAction('toggle');
    setStatus({ type: '', message: '' });
    try {
      const res = await api.store.toggleStatus(toggleForm.storeId.trim(), {
        isOpen: toggleForm.isOpen,
        vendorId: toggleForm.vendorId || undefined,
      });
      setStatus({ type: 'success', message: res.data?.message || 'Store status updated.' });
    } catch (error) {
      setStatus({
        type: 'error',
        message: error.response?.data?.message || 'Failed to update store status.',
      });
    } finally {
      setLoadingAction('');
    }
  };

  const fetchAdminStores = async (e) => {
    if (e) e.preventDefault();
    setLoadingAction('list');
    setStatus({ type: '', message: '' });
    try {
      const res = await api.store.admin.getAll({
        search: adminQuery.search || undefined,
        page: adminQuery.page,
        limit: adminQuery.limit,
      });
      setAdminStores(res.data?.data || null);
      setStatus({ type: 'success', message: res.data?.message || 'Stores fetched.' });
    } catch (error) {
      setStatus({
        type: 'error',
        message: error.response?.data?.message || 'Failed to load stores.',
      });
    } finally {
      setLoadingAction('');
    }
  };

  const fetchStoreDetails = async (e) => {
    if (e) e.preventDefault();
    if (!storeId.trim()) return;
    setLoadingAction('details');
    setStatus({ type: '', message: '' });
    try {
      const res = await api.store.admin.getById(storeId.trim());
      setStoreDetails(res.data?.data || null);
      setStatus({ type: 'success', message: res.data?.message || 'Store details loaded.' });
    } catch (error) {
      setStatus({
        type: 'error',
        message: error.response?.data?.message || 'Failed to load store details.',
      });
    } finally {
      setLoadingAction('');
    }
  };

  const handleUpdateStore = async (e) => {
    e.preventDefault();
    if (!storeId.trim()) return;

    setLoadingAction('update');
    setStatus({ type: '', message: '' });
    try {
      const payload = {};
      Object.entries(updateForm).forEach(([key, value]) => {
        if (value !== '' && value !== null && value !== undefined) {
          payload[key] = typeof value === 'string' ? value.trim() : value;
        }
      });
      const res = await api.store.admin.update(storeId.trim(), payload);
      setStatus({ type: 'success', message: res.data?.message || 'Store updated successfully.' });
      await fetchStoreDetails();
    } catch (error) {
      setStatus({
        type: 'error',
        message: error.response?.data?.message || 'Failed to update store.',
      });
    } finally {
      setLoadingAction('');
    }
  };

  const fetchCustomerStores = async (e) => {
    if (e) e.preventDefault();
    setLoadingAction('customerStores');
    setStatus({ type: '', message: '' });
    try {
      const res = await api.store.customer.getOpenStores({
        search: customerSearch.search || undefined,
        category: customerSearch.category || undefined,
        minRating: customerSearch.minRating || undefined,
      });
      setCustomerStores(res.data?.data || null);
      setStatus({ type: 'success', message: res.data?.message || 'Customer store feed loaded.' });
    } catch (error) {
      setStatus({
        type: 'error',
        message: error.response?.data?.message || 'Failed to load customer stores.',
      });
    } finally {
      setLoadingAction('');
    }
  };

  const fetchStoreProducts = async (e) => {
    if (e) e.preventDefault();
    if (!customerStoreId.trim()) return;
    setLoadingAction('products');
    setStatus({ type: '', message: '' });
    try {
      const res = await api.store.customer.getStoreProducts(customerStoreId.trim());
      setStoreProducts(res.data?.data || null);
      setStatus({ type: 'success', message: res.data?.message || 'Store products loaded.' });
    } catch (error) {
      setStatus({
        type: 'error',
        message: error.response?.data?.message || 'Failed to load store products.',
      });
    } finally {
      setLoadingAction('');
    }
  };

  const userRole = getUserRole();

  return (
    <Layout>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <Card title="🏬 Store Management & Discovery">
          <p style={{ color: '#4a5568', marginTop: 0 }}>
            Cover vendor store toggles, admin inventory, and customer discovery from one screen.
          </p>

          {status.message && (
            <div
              style={{
                marginBottom: '1.5rem',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                background: status.type === 'success' ? '#c6f6d5' : '#fed7d7',
                color: status.type === 'success' ? '#22543d' : '#742a2a',
                border: `2px solid ${status.type === 'success' ? '#9ae6b4' : '#fc8181'}`,
              }}
            >
              {status.message}
            </div>
          )}

          <section style={{ marginBottom: '2rem' }}>
            <h3 style={{ marginBottom: '0.5rem', color: '#2d3748' }}>Vendor Open / Close</h3>
            <p style={{ fontSize: '0.9rem', color: '#718096' }}>
              Endpoint: <code>PUT /api/store/:id/open-close</code>
            </p>
            <form onSubmit={handleToggle}>
              <Input
                label="Store ID"
                name="storeId"
                value={toggleForm.storeId}
                onChange={(e) => setToggleForm((prev) => ({ ...prev, storeId: e.target.value }))}
                required
              />
              <Input
                label="Vendor ID (optional override)"
                name="vendorId"
                value={toggleForm.vendorId}
                onChange={(e) => setToggleForm((prev) => ({ ...prev, vendorId: e.target.value }))}
              />
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <input
                  type="checkbox"
                  checked={toggleForm.isOpen}
                  onChange={(e) => setToggleForm((prev) => ({ ...prev, isOpen: e.target.checked }))}
                />
                Store is open
              </label>
              <Button type="submit" disabled={loadingAction === 'toggle'}>
                {loadingAction === 'toggle' ? 'Updating...' : 'Update Store Status'}
              </Button>
            </form>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h3 style={{ marginBottom: '0.5rem', color: '#2d3748' }}>Admin Store Directory</h3>
            <p style={{ fontSize: '0.9rem', color: '#718096' }}>
              Requires SUPER_ADMIN / ADMIN token.
            </p>
            <form onSubmit={fetchAdminStores}>
              <Input
                label="Search"
                name="search"
                value={adminQuery.search}
                onChange={(e) => setAdminQuery((prev) => ({ ...prev, search: e.target.value }))}
              />
              <Input
                label="Page"
                type="number"
                min="1"
                name="page"
                value={adminQuery.page}
                onChange={(e) => setAdminQuery((prev) => ({ ...prev, page: Number(e.target.value) }))}
              />
              <Input
                label="Limit"
                type="number"
                min="1"
                name="limit"
                value={adminQuery.limit}
                onChange={(e) => setAdminQuery((prev) => ({ ...prev, limit: Number(e.target.value) }))}
              />
              <Button type="submit" disabled={loadingAction === 'list'}>
                {loadingAction === 'list' ? 'Loading...' : 'Fetch Stores'}
              </Button>
            </form>
            <pre
              style={{
                marginTop: '1rem',
                background: '#1a202c',
                color: '#fbd38d',
                padding: '1rem',
                borderRadius: '8px',
                minHeight: '150px',
                overflowX: 'auto',
              }}
            >
              {adminStores ? JSON.stringify(adminStores, null, 2) : 'No admin stores loaded yet.'}
            </pre>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h3 style={{ marginBottom: '0.5rem', color: '#2d3748' }}>Store Detail & Update</h3>
            <form onSubmit={fetchStoreDetails} style={{ marginBottom: '1rem' }}>
              <Input
                label="Store ID"
                name="storeId"
                value={storeId}
                onChange={(e) => setStoreId(e.target.value)}
                required
              />
              <Button type="submit" variant="secondary" disabled={loadingAction === 'details'}>
                {loadingAction === 'details' ? 'Loading...' : 'Load Details'}
              </Button>
            </form>

            <pre
              style={{
                marginBottom: '1rem',
                background: '#2d3748',
                color: '#90cdf4',
                padding: '1rem',
                borderRadius: '8px',
                minHeight: '150px',
                overflowX: 'auto',
              }}
            >
              {storeDetails ? JSON.stringify(storeDetails, null, 2) : 'No store details loaded.'}
            </pre>

            <form onSubmit={handleUpdateStore}>
              <Input
                label="Store Name"
                name="storeName"
                value={updateForm.storeName}
                onChange={(e) => setUpdateForm((prev) => ({ ...prev, storeName: e.target.value }))}
              />
              <Input
                label="Store Address"
                name="storeAddress"
                value={updateForm.storeAddress}
                onChange={(e) => setUpdateForm((prev) => ({ ...prev, storeAddress: e.target.value }))}
              />
              <Input
                label="Description"
                name="description"
                value={updateForm.description}
                onChange={(e) => setUpdateForm((prev) => ({ ...prev, description: e.target.value }))}
              />
              <Input
                label="Category"
                name="category"
                value={updateForm.category}
                onChange={(e) => setUpdateForm((prev) => ({ ...prev, category: e.target.value }))}
              />
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <input
                  type="checkbox"
                  checked={updateForm.isStoreOpen}
                  onChange={(e) => setUpdateForm((prev) => ({ ...prev, isStoreOpen: e.target.checked }))}
                />
                Store is open
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <input
                  type="checkbox"
                  checked={updateForm.isApproved}
                  onChange={(e) => setUpdateForm((prev) => ({ ...prev, isApproved: e.target.checked }))}
                />
                Approved
              </label>
              <Button type="submit" disabled={loadingAction === 'update'}>
                {loadingAction === 'update' ? 'Updating...' : 'Update Store'}
              </Button>
            </form>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h3 style={{ marginBottom: '0.5rem', color: '#2d3748' }}>Customer - Open Stores</h3>
            <form onSubmit={fetchCustomerStores}>
              <Input
                label="Search"
                name="search"
                value={customerSearch.search}
                onChange={(e) => setCustomerSearch((prev) => ({ ...prev, search: e.target.value }))}
              />
              <Input
                label="Category"
                name="category"
                value={customerSearch.category}
                onChange={(e) => setCustomerSearch((prev) => ({ ...prev, category: e.target.value }))}
              />
              <Input
                label="Min Rating"
                name="minRating"
                type="number"
                step="0.1"
                value={customerSearch.minRating}
                onChange={(e) => setCustomerSearch((prev) => ({ ...prev, minRating: e.target.value }))}
              />
              <Button type="submit" disabled={loadingAction === 'customerStores'}>
                {loadingAction === 'customerStores' ? 'Loading...' : 'Fetch Open Stores'}
              </Button>
            </form>
            <pre
              style={{
                marginTop: '1rem',
                background: '#1a202c',
                color: '#c6f6d5',
                padding: '1rem',
                borderRadius: '8px',
                minHeight: '150px',
                overflowX: 'auto',
              }}
            >
              {customerStores ? JSON.stringify(customerStores, null, 2) : 'No open stores loaded yet.'}
            </pre>
          </section>

          <section>
            <h3 style={{ marginBottom: '0.5rem', color: '#2d3748' }}>Customer - Store Products</h3>
            <form onSubmit={fetchStoreProducts}>
              <Input
                label="Store ID"
                name="customerStoreId"
                value={customerStoreId}
                onChange={(e) => setCustomerStoreId(e.target.value)}
                required
              />
              <Button type="submit" variant="secondary" disabled={loadingAction === 'products'}>
                {loadingAction === 'products' ? 'Loading...' : 'Fetch Products'}
              </Button>
            </form>
            <pre
              style={{
                marginTop: '1rem',
                background: '#2d3748',
                color: '#fbd38d',
                padding: '1rem',
                borderRadius: '8px',
                minHeight: '150px',
                overflowX: 'auto',
              }}
            >
              {storeProducts ? JSON.stringify(storeProducts, null, 2) : 'No products loaded yet.'}
            </pre>
          </section>
        </Card>
      </div>
    </Layout>
  );
};

export default StoreManagement;


