import { useState } from 'react';
import Layout from '../../components/Layout';
import Card from '../../components/Card';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { api } from '../../config/api';
import { getUserRole } from '../../utils/auth';

const AdminVendorSubscription = () => {
  const [createForm, setCreateForm] = useState({
    vendorId: '',
    storeId: '',
    planName: '',
    autoRenew: true,
  });
  const [assignForm, setAssignForm] = useState({
    subscriptionId: '',
    storeId: '',
  });
  const [renewForm, setRenewForm] = useState({
    subscriptionId: '',
    autoRenew: true,
  });
  const [cancelId, setCancelId] = useState('');
  const [lookupId, setLookupId] = useState('');
  const [subscriptions, setSubscriptions] = useState(null);
  const [selectedSubscription, setSelectedSubscription] = useState(null);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loadingAction, setLoadingAction] = useState('');

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!createForm.planName.trim()) {
      setStatus({ type: 'error', message: 'Plan name is required.' });
      return;
    }

    setLoadingAction('create');
    setStatus({ type: '', message: '' });
    try {
      const res = await api.adminVendorSubscription.create({
        vendorId: createForm.vendorId || undefined,
        storeId: createForm.storeId || undefined,
        planName: createForm.planName.trim(),
        autoRenew: createForm.autoRenew,
      });
      setStatus({ type: 'success', message: res.data?.message || 'Subscription created.' });
      await fetchList();
    } catch (error) {
      setStatus({
        type: 'error',
        message: error.response?.data?.message || 'Failed to create subscription.',
      });
    } finally {
      setLoadingAction('');
    }
  };

  const fetchList = async () => {
    setLoadingAction('list');
    setStatus({ type: '', message: '' });
    try {
      const res = await api.adminVendorSubscription.getAll();
      setSubscriptions(res.data?.data || null);
      setStatus({ type: 'success', message: res.data?.message || 'Subscriptions loaded.' });
    } catch (error) {
      setStatus({
        type: 'error',
        message: error.response?.data?.message || 'Failed to load subscriptions.',
      });
    } finally {
      setLoadingAction('');
    }
  };

  const fetchById = async (e) => {
    e.preventDefault();
    if (!lookupId.trim()) return;
    setLoadingAction('getOne');
    setStatus({ type: '', message: '' });
    try {
      const res = await api.adminVendorSubscription.getById(lookupId.trim());
      setSelectedSubscription(res.data?.data || null);
      setStatus({ type: 'success', message: res.data?.message || 'Subscription fetched.' });
    } catch (error) {
      setStatus({
        type: 'error',
        message: error.response?.data?.message || 'Failed to fetch subscription.',
      });
    } finally {
      setLoadingAction('');
    }
  };

  const handleAssign = async (e) => {
    e.preventDefault();
    if (!assignForm.subscriptionId.trim() || !assignForm.storeId.trim()) {
      setStatus({ type: 'error', message: 'Subscription ID and store ID are required.' });
      return;
    }
    setLoadingAction('assign');
    setStatus({ type: '', message: '' });
    try {
      const res = await api.adminVendorSubscription.assign(assignForm.subscriptionId.trim(), {
        storeId: assignForm.storeId.trim(),
      });
      setStatus({ type: 'success', message: res.data?.message || 'Subscription assigned.' });
      await fetchList();
    } catch (error) {
      setStatus({
        type: 'error',
        message: error.response?.data?.message || 'Failed to assign subscription.',
      });
    } finally {
      setLoadingAction('');
    }
  };

  const handleRenew = async (e) => {
    e.preventDefault();
    if (!renewForm.subscriptionId.trim()) return;

    setLoadingAction('renew');
    setStatus({ type: '', message: '' });
    try {
      const res = await api.adminVendorSubscription.renew(renewForm.subscriptionId.trim(), {
        autoRenew: renewForm.autoRenew,
      });
      setStatus({ type: 'success', message: res.data?.message || 'Subscription renewed.' });
      await fetchList();
    } catch (error) {
      setStatus({
        type: 'error',
        message: error.response?.data?.message || 'Failed to renew subscription.',
      });
    } finally {
      setLoadingAction('');
    }
  };

  const handleCancel = async (e) => {
    e.preventDefault();
    if (!cancelId.trim()) return;

    setLoadingAction('cancel');
    setStatus({ type: '', message: '' });
    try {
      const res = await api.adminVendorSubscription.cancel(cancelId.trim());
      setStatus({ type: 'success', message: res.data?.message || 'Subscription cancelled.' });
      await fetchList();
    } catch (error) {
      setStatus({
        type: 'error',
        message: error.response?.data?.message || 'Failed to cancel subscription.',
      });
    } finally {
      setLoadingAction('');
    }
  };

  const userRole = getUserRole();

  return (
    <Layout>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <Card title="🧾 Admin Vendor Subscription Hub">
          <p style={{ color: '#4a5568', marginTop: 0 }}>
            Unlock every <code>/api/admin/vendor-subscription*</code> route from one screen.
          </p>

          {userRole !== 'SUPER_ADMIN' && (
            <div
              style={{
                marginBottom: '1.5rem',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                background: '#fffaf0',
                border: '2px solid #fbd38d',
                color: '#c05621',
                fontSize: '0.9rem',
              }}
            >
              Requires super admin token. Current role: {userRole || 'guest'}.
            </div>
          )}

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
            <h3 style={{ marginBottom: '0.5rem', color: '#2d3748' }}>Create Subscription</h3>
            <form onSubmit={handleCreate}>
              <Input
                label="Vendor ID (optional)"
                name="vendorId"
                value={createForm.vendorId}
                onChange={(e) => setCreateForm((prev) => ({ ...prev, vendorId: e.target.value }))}
              />
              <Input
                label="Store ID (optional)"
                name="storeId"
                value={createForm.storeId}
                onChange={(e) => setCreateForm((prev) => ({ ...prev, storeId: e.target.value }))}
              />
              <Input
                label="Plan Name"
                name="planName"
                value={createForm.planName}
                onChange={(e) => setCreateForm((prev) => ({ ...prev, planName: e.target.value }))}
                required
              />
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <input
                  type="checkbox"
                  checked={createForm.autoRenew}
                  onChange={(e) => setCreateForm((prev) => ({ ...prev, autoRenew: e.target.checked }))}
                />
                Auto-renew
              </label>
              <Button type="submit" disabled={loadingAction === 'create'}>
                {loadingAction === 'create' ? 'Creating...' : 'Create Subscription'}
              </Button>
            </form>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '0.75rem',
              }}
            >
              <h3 style={{ margin: 0, color: '#2d3748' }}>All Subscriptions</h3>
              <Button type="button" variant="secondary" onClick={fetchList} disabled={loadingAction === 'list'}>
                {loadingAction === 'list' ? 'Loading...' : 'Refresh'}
              </Button>
            </div>
            <pre
              style={{
                background: '#1a202c',
                color: '#fbd38d',
                padding: '1rem',
                borderRadius: '8px',
                minHeight: '150px',
                overflowX: 'auto',
              }}
            >
              {subscriptions ? JSON.stringify(subscriptions, null, 2) : 'No subscriptions loaded yet.'}
            </pre>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h3 style={{ marginBottom: '0.5rem', color: '#2d3748' }}>Lookup Subscription</h3>
            <form onSubmit={fetchById}>
              <Input
                label="Subscription ID"
                name="lookupId"
                value={lookupId}
                onChange={(e) => setLookupId(e.target.value)}
                required
              />
              <Button type="submit" disabled={loadingAction === 'getOne'}>
                {loadingAction === 'getOne' ? 'Searching...' : 'Fetch Subscription'}
              </Button>
            </form>
            <pre
              style={{
                marginTop: '1rem',
                background: '#2d3748',
                color: '#90cdf4',
                padding: '1rem',
                borderRadius: '8px',
                minHeight: '150px',
                overflowX: 'auto',
              }}
            >
              {selectedSubscription ? JSON.stringify(selectedSubscription, null, 2) : 'No subscription selected.'}
            </pre>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h3 style={{ marginBottom: '0.5rem', color: '#2d3748' }}>Assign to Store</h3>
            <form onSubmit={handleAssign}>
              <Input
                label="Subscription ID"
                name="subscriptionId"
                value={assignForm.subscriptionId}
                onChange={(e) =>
                  setAssignForm((prev) => ({
                    ...prev,
                    subscriptionId: e.target.value,
                  }))
                }
                required
              />
              <Input
                label="Store ID"
                name="storeId"
                value={assignForm.storeId}
                onChange={(e) => setAssignForm((prev) => ({ ...prev, storeId: e.target.value }))}
                required
              />
              <Button type="submit" disabled={loadingAction === 'assign'}>
                {loadingAction === 'assign' ? 'Assigning...' : 'Assign Subscription'}
              </Button>
            </form>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h3 style={{ marginBottom: '0.5rem', color: '#2d3748' }}>Renew Subscription</h3>
            <form onSubmit={handleRenew}>
              <Input
                label="Subscription ID"
                name="subscriptionId"
                value={renewForm.subscriptionId}
                onChange={(e) =>
                  setRenewForm((prev) => ({
                    ...prev,
                    subscriptionId: e.target.value,
                  }))
                }
                required
              />
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <input
                  type="checkbox"
                  checked={renewForm.autoRenew}
                  onChange={(e) => setRenewForm((prev) => ({ ...prev, autoRenew: e.target.checked }))}
                />
                Auto-renew enabled
              </label>
              <Button type="submit" disabled={loadingAction === 'renew'}>
                {loadingAction === 'renew' ? 'Renewing...' : 'Renew Subscription'}
              </Button>
            </form>
          </section>

          <section>
            <h3 style={{ marginBottom: '0.5rem', color: '#2d3748' }}>Cancel Subscription</h3>
            <form onSubmit={handleCancel}>
              <Input
                label="Subscription ID"
                name="cancelId"
                value={cancelId}
                onChange={(e) => setCancelId(e.target.value)}
                required
              />
              <Button type="submit" variant="danger" disabled={loadingAction === 'cancel'}>
                {loadingAction === 'cancel' ? 'Cancelling...' : 'Cancel Subscription'}
              </Button>
            </form>
          </section>
        </Card>
      </div>
    </Layout>
  );
};

export default AdminVendorSubscription;


