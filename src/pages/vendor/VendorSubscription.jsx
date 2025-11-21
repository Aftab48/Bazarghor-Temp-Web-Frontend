import { useState } from 'react';
import Layout from '../../components/Layout';
import Card from '../../components/Card';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { api } from '../../config/api';
import { getUserRole } from '../../utils/auth';

const VendorSubscription = () => {
  const [purchaseForm, setPurchaseForm] = useState({
    storeId: '',
    planName: '',
    autoRenew: true,
  });
  const [renewForm, setRenewForm] = useState({
    subscriptionId: '',
    autoRenew: true,
  });
  const [subscriptions, setSubscriptions] = useState(null);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loadingAction, setLoadingAction] = useState('');

  const handlePurchase = async (e) => {
    e.preventDefault();
    if (!purchaseForm.storeId.trim() || !purchaseForm.planName.trim()) {
      setStatus({ type: 'error', message: 'Store ID and plan name are required.' });
      return;
    }

    setLoadingAction('purchase');
    setStatus({ type: '', message: '' });
    try {
      const res = await api.vendorSubscription.purchase({
        storeId: purchaseForm.storeId.trim(),
        planName: purchaseForm.planName.trim(),
        autoRenew: purchaseForm.autoRenew,
      });
      setStatus({ type: 'success', message: res.data?.message || 'Subscription purchased.' });
      await fetchSubscriptions();
    } catch (error) {
      setStatus({
        type: 'error',
        message: error.response?.data?.message || 'Failed to purchase subscription.',
      });
    } finally {
      setLoadingAction('');
    }
  };

  const fetchSubscriptions = async () => {
    setLoadingAction('list');
    setStatus({ type: '', message: '' });
    try {
      const res = await api.vendorSubscription.getMySubscriptions();
      setSubscriptions(res.data?.data || null);
      setStatus({ type: 'success', message: res.data?.message || 'Subscriptions fetched.' });
    } catch (error) {
      setStatus({
        type: 'error',
        message: error.response?.data?.message || 'Failed to fetch subscriptions.',
      });
    } finally {
      setLoadingAction('');
    }
  };

  const handleRenew = async (e) => {
    e.preventDefault();
    if (!renewForm.subscriptionId.trim()) {
      setStatus({ type: 'error', message: 'Subscription ID is required.' });
      return;
    }

    setLoadingAction('renew');
    setStatus({ type: '', message: '' });
    try {
      const res = await api.vendorSubscription.renew(renewForm.subscriptionId.trim(), {
        autoRenew: renewForm.autoRenew,
      });
      setStatus({ type: 'success', message: res.data?.message || 'Subscription renewed.' });
      await fetchSubscriptions();
    } catch (error) {
      setStatus({
        type: 'error',
        message: error.response?.data?.message || 'Failed to renew subscription.',
      });
    } finally {
      setLoadingAction('');
    }
  };

  const userRole = getUserRole();

  return (
    <Layout>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <Card title="📅 Vendor Subscription Center">
          <p style={{ color: '#4a5568', marginTop: 0 }}>
            Manage marketplace plans via <code>/api/vendors/*subscription*</code>.
          </p>

          {userRole !== 'VENDOR' && (
            <div
              style={{
                marginBottom: '1.5rem',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                background: '#fff5f5',
                border: '2px solid #fed7d7',
                color: '#c53030',
                fontSize: '0.9rem',
              }}
            >
              Vendor subscription APIs require a vendor session. Current role: {userRole || 'guest'}.
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
            <h3 style={{ marginBottom: '0.5rem', color: '#2d3748' }}>Purchase Subscription</h3>
            <form onSubmit={handlePurchase}>
              <Input
                label="Store ID"
                name="storeId"
                value={purchaseForm.storeId}
                onChange={(e) => setPurchaseForm((prev) => ({ ...prev, storeId: e.target.value }))}
                required
              />
              <Input
                label="Plan Name"
                name="planName"
                value={purchaseForm.planName}
                onChange={(e) => setPurchaseForm((prev) => ({ ...prev, planName: e.target.value }))}
                placeholder="basic | standard | premium"
                required
              />
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <input
                  type="checkbox"
                  checked={purchaseForm.autoRenew}
                  onChange={(e) => setPurchaseForm((prev) => ({ ...prev, autoRenew: e.target.checked }))}
                />
                Enable auto-renew
              </label>
              <Button type="submit" disabled={loadingAction === 'purchase'}>
                {loadingAction === 'purchase' ? 'Processing...' : 'Purchase Subscription'}
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
              <h3 style={{ margin: 0, color: '#2d3748' }}>My Subscriptions</h3>
              <Button type="button" variant="secondary" onClick={fetchSubscriptions} disabled={loadingAction === 'list'}>
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

          <section>
            <h3 style={{ marginBottom: '0.5rem', color: '#2d3748' }}>Renew Subscription</h3>
            <form onSubmit={handleRenew}>
              <Input
                label="Subscription ID"
                name="subscriptionId"
                value={renewForm.subscriptionId}
                onChange={(e) => setRenewForm((prev) => ({ ...prev, subscriptionId: e.target.value }))}
                required
              />
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <input
                  type="checkbox"
                  checked={renewForm.autoRenew}
                  onChange={(e) => setRenewForm((prev) => ({ ...prev, autoRenew: e.target.checked }))}
                />
                Keep auto-renew enabled
              </label>
              <Button type="submit" disabled={loadingAction === 'renew'}>
                {loadingAction === 'renew' ? 'Renewing...' : 'Renew Subscription'}
              </Button>
            </form>
          </section>
        </Card>
      </div>
    </Layout>
  );
};

export default VendorSubscription;


