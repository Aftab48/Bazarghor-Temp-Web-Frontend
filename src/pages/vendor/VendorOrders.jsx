import { useState } from 'react';
import Layout from '../../components/Layout';
import Card from '../../components/Card';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { api } from '../../config/api';
import { getUserRole } from '../../utils/auth';

const VendorOrders = () => {
  const [respondForm, setRespondForm] = useState({
    orderId: '',
    accept: true,
    note: '',
  });
  const [orderId, setOrderId] = useState('');
  const [orders, setOrders] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loadingAction, setLoadingAction] = useState('');

  const handleRespond = async (e) => {
    e.preventDefault();
    if (!respondForm.orderId.trim()) return;

    setLoadingAction('respond');
    setStatus({ type: '', message: '' });

    try {
      const res = await api.vendorOrders.respond(respondForm.orderId.trim(), {
        accept: respondForm.accept,
        note: respondForm.note,
      });
      setStatus({ type: 'success', message: res.data?.message || 'Response recorded.' });
    } catch (error) {
      setStatus({
        type: 'error',
        message: error.response?.data?.message || 'Failed to respond to order.',
      });
    } finally {
      setLoadingAction('');
    }
  };

  const fetchOrders = async () => {
    setLoadingAction('list');
    setStatus({ type: '', message: '' });
    try {
      const res = await api.vendorOrders.getAll();
      setOrders(res.data?.data || null);
      setStatus({ type: 'success', message: res.data?.message || 'Vendor orders fetched.' });
    } catch (error) {
      setStatus({
        type: 'error',
        message: error.response?.data?.message || 'Failed to fetch orders.',
      });
    } finally {
      setLoadingAction('');
    }
  };

  const fetchOrder = async (e) => {
    e.preventDefault();
    if (!orderId.trim()) return;

    setLoadingAction('getOne');
    setStatus({ type: '', message: '' });
    try {
      const res = await api.vendorOrders.getById(orderId.trim());
      setSelectedOrder(res.data?.data || null);
      setStatus({ type: 'success', message: res.data?.message || 'Order loaded.' });
    } catch (error) {
      setStatus({
        type: 'error',
        message: error.response?.data?.message || 'Failed to load order.',
      });
    } finally {
      setLoadingAction('');
    }
  };

  const userRole = getUserRole();

  return (
    <Layout>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <Card title="🧾 Vendor Order Console">
          <p style={{ color: '#4a5568', marginTop: 0 }}>
            Manage incoming marketplace orders via <code>/api/vendors/order*</code> endpoints.
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
              Vendor order APIs require a vendor login. Current role: {userRole || 'guest'}.
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
            <h3 style={{ marginBottom: '0.5rem', color: '#2d3748' }}>Respond to Order</h3>
            <form onSubmit={handleRespond}>
              <Input
                label="Order ID"
                name="orderId"
                value={respondForm.orderId}
                onChange={(e) => setRespondForm((prev) => ({ ...prev, orderId: e.target.value }))}
                required
              />
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <input
                  type="checkbox"
                  checked={respondForm.accept}
                  onChange={(e) => setRespondForm((prev) => ({ ...prev, accept: e.target.checked }))}
                />
                Accept order (uncheck to decline)
              </label>
              <Input
                label="Note (optional)"
                name="note"
                value={respondForm.note}
                onChange={(e) => setRespondForm((prev) => ({ ...prev, note: e.target.value }))}
                placeholder="Add context for buyer / platform"
              />
              <Button type="submit" disabled={loadingAction === 'respond'}>
                {loadingAction === 'respond' ? 'Submitting...' : 'Submit Response'}
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
              <h3 style={{ margin: 0, color: '#2d3748' }}>My Orders</h3>
              <Button type="button" variant="secondary" onClick={fetchOrders} disabled={loadingAction === 'list'}>
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
              {orders ? JSON.stringify(orders, null, 2) : 'No orders loaded yet.'}
            </pre>
          </section>

          <section>
            <h3 style={{ marginBottom: '0.5rem', color: '#2d3748' }}>Order Details</h3>
            <form onSubmit={fetchOrder}>
              <Input
                label="Order ID"
                name="orderId"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                required
              />
              <Button type="submit" disabled={loadingAction === 'getOne'}>
                {loadingAction === 'getOne' ? 'Loading...' : 'Load Order'}
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
              }}
            >
              {selectedOrder ? JSON.stringify(selectedOrder, null, 2) : 'No order selected.'}
            </pre>
          </section>
        </Card>
      </div>
    </Layout>
  );
};

export default VendorOrders;


