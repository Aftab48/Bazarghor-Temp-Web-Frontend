import { useState } from 'react';
import Layout from '../../components/Layout';
import Card from '../../components/Card';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { api } from '../../config/api';
import { getUserRole } from '../../utils/auth';

const AdminOrders = () => {
  const [vendorId, setVendorId] = useState('');
  const [orderId, setOrderId] = useState('');
  const [orders, setOrders] = useState(null);
  const [history, setHistory] = useState(null);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loadingAction, setLoadingAction] = useState('');

  const fetchOrders = async (e) => {
    e.preventDefault();
    if (!vendorId.trim()) return;

    setLoadingAction('list');
    setStatus({ type: '', message: '' });
    try {
      const res = await api.adminOrders.getOrdersByVendor(vendorId.trim());
      setOrders(res.data?.data || null);
      setStatus({ type: 'success', message: res.data?.message || 'Orders loaded.' });
    } catch (error) {
      setStatus({
        type: 'error',
        message: error.response?.data?.message || 'Failed to fetch vendor orders.',
      });
    } finally {
      setLoadingAction('');
    }
  };

  const fetchHistory = async (e) => {
    e.preventDefault();
    if (!orderId.trim()) return;

    setLoadingAction('history');
    setStatus({ type: '', message: '' });
    try {
      const res = await api.adminOrders.getOrderHistory(orderId.trim());
      setHistory(res.data?.data || null);
      setStatus({ type: 'success', message: res.data?.message || 'Order history loaded.' });
    } catch (error) {
      setStatus({
        type: 'error',
        message: error.response?.data?.message || 'Failed to fetch history.',
      });
    } finally {
      setLoadingAction('');
    }
  };

  const userRole = getUserRole();

  return (
    <Layout>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <Card title="📊 Admin Order Intelligence">
          <p style={{ color: '#4a5568', marginTop: 0 }}>
            Query vendor production and customer timelines via <code>/api/admin/order*</code>.
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
              Only super admin tokens can call these endpoints. Current role: {userRole || 'guest'}.
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
            <h3 style={{ marginBottom: '0.5rem', color: '#2d3748' }}>Orders by Vendor</h3>
            <form onSubmit={fetchOrders}>
              <Input
                label="Vendor ID"
                name="vendorId"
                value={vendorId}
                onChange={(e) => setVendorId(e.target.value)}
                required
              />
              <Button type="submit" disabled={loadingAction === 'list'}>
                {loadingAction === 'list' ? 'Loading...' : 'Load Orders'}
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
              {orders ? JSON.stringify(orders, null, 2) : 'No orders loaded yet.'}
            </pre>
          </section>

          <section>
            <h3 style={{ marginBottom: '0.5rem', color: '#2d3748' }}>Order History</h3>
            <form onSubmit={fetchHistory}>
              <Input
                label="Order ID"
                name="orderId"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                required
              />
              <Button type="submit" disabled={loadingAction === 'history'}>
                {loadingAction === 'history' ? 'Loading...' : 'Fetch History'}
              </Button>
            </form>
            <pre
              style={{
                marginTop: '1rem',
                background: '#2d3748',
                color: '#c3dafe',
                padding: '1rem',
                borderRadius: '8px',
                minHeight: '150px',
                overflowX: 'auto',
              }}
            >
              {history ? JSON.stringify(history, null, 2) : 'No history loaded yet.'}
            </pre>
          </section>
        </Card>
      </div>
    </Layout>
  );
};

export default AdminOrders;


