import { useState } from 'react';
import Layout from '../../components/Layout';
import Card from '../../components/Card';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { api } from '../../config/api';
import { getUserRole } from '../../utils/auth';

const DeliveryOrders = () => {
  const [respondForm, setRespondForm] = useState({ orderId: '', accept: true });
  const [pickupOrderId, setPickupOrderId] = useState('');
  const [deliverForm, setDeliverForm] = useState({ orderId: '', rating: 5 });
  const [stats, setStats] = useState(null);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loadingAction, setLoadingAction] = useState('');

  const handleRespond = async (e) => {
    e.preventDefault();
    if (!respondForm.orderId.trim()) return;

    setLoadingAction('respond');
    setStatus({ type: '', message: '' });
    try {
      const res = await api.deliveryOrders.respond(respondForm.orderId.trim(), {
        accept: respondForm.accept,
      });
      setStatus({ type: 'success', message: res.data?.message || 'Order response updated.' });
    } catch (error) {
      setStatus({
        type: 'error',
        message: error.response?.data?.message || 'Failed to respond to order.',
      });
    } finally {
      setLoadingAction('');
    }
  };

  const handlePickup = async (e) => {
    e.preventDefault();
    if (!pickupOrderId.trim()) return;

    setLoadingAction('pickup');
    setStatus({ type: '', message: '' });
    try {
      const res = await api.deliveryOrders.pickup(pickupOrderId.trim(), {});
      setStatus({ type: 'success', message: res.data?.message || 'Order marked as picked up.' });
    } catch (error) {
      setStatus({
        type: 'error',
        message: error.response?.data?.message || 'Failed to mark pickup.',
      });
    } finally {
      setLoadingAction('');
    }
  };

  const handleDeliver = async (e) => {
    e.preventDefault();
    if (!deliverForm.orderId.trim()) return;

    setLoadingAction('deliver');
    setStatus({ type: '', message: '' });
    try {
      const res = await api.deliveryOrders.deliver(deliverForm.orderId.trim(), {
        rating: Number(deliverForm.rating) || 5,
      });
      setStatus({ type: 'success', message: res.data?.message || 'Order marked as delivered.' });
    } catch (error) {
      setStatus({
        type: 'error',
        message: error.response?.data?.message || 'Failed to deliver order.',
      });
    } finally {
      setLoadingAction('');
    }
  };

  const fetchStats = async () => {
    setLoadingAction('stats');
    setStatus({ type: '', message: '' });
    try {
      const res = await api.deliveryOrders.getMyStats();
      setStats(res.data?.data || null);
      setStatus({ type: 'success', message: res.data?.message || 'Stats loaded.' });
    } catch (error) {
      setStatus({
        type: 'error',
        message: error.response?.data?.message || 'Failed to load stats.',
      });
    } finally {
      setLoadingAction('');
    }
  };

  const userRole = getUserRole();

  return (
    <Layout>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <Card title="🚚 Delivery Partner Orders">
          <p style={{ color: '#4a5568', marginTop: 0 }}>
            Endpoints covered: <code>/api/delivery-order/*</code>. Use a delivery partner token.
          </p>

          {userRole !== 'DELIVERY_PARTNER' && (
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
              Delivery order APIs require a delivery partner session. Current role: {userRole || 'guest'}.
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
            <h3 style={{ marginBottom: '0.5rem', color: '#2d3748' }}>Respond to New Order</h3>
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
                Accept assignment (uncheck to decline)
              </label>
              <Button type="submit" disabled={loadingAction === 'respond'}>
                {loadingAction === 'respond' ? 'Submitting...' : 'Submit Response'}
              </Button>
            </form>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h3 style={{ marginBottom: '0.5rem', color: '#2d3748' }}>Mark Pickup</h3>
            <form onSubmit={handlePickup}>
              <Input
                label="Order ID"
                name="pickupOrderId"
                value={pickupOrderId}
                onChange={(e) => setPickupOrderId(e.target.value)}
                required
              />
              <Button type="submit" disabled={loadingAction === 'pickup'}>
                {loadingAction === 'pickup' ? 'Updating...' : 'Mark as Picked Up'}
              </Button>
            </form>
          </section>

  <section style={{ marginBottom: '2rem' }}>
            <h3 style={{ marginBottom: '0.5rem', color: '#2d3748' }}>Mark Delivered</h3>
            <form onSubmit={handleDeliver}>
              <Input
                label="Order ID"
                name="orderId"
                value={deliverForm.orderId}
                onChange={(e) => setDeliverForm((prev) => ({ ...prev, orderId: e.target.value }))}
                required
              />
              <Input
                label="Customer Rating (1-5)"
                name="rating"
                type="number"
                min="1"
                max="5"
                value={deliverForm.rating}
                onChange={(e) => setDeliverForm((prev) => ({ ...prev, rating: e.target.value }))}
              />
              <Button type="submit" disabled={loadingAction === 'deliver'}>
                {loadingAction === 'deliver' ? 'Submitting...' : 'Mark Delivered'}
              </Button>
            </form>
          </section>

          <section>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '0.75rem',
              }}
            >
              <h3 style={{ margin: 0, color: '#2d3748' }}>Performance Stats</h3>
              <Button type="button" variant='secondary' onClick={fetchStats} disabled={loadingAction === 'stats'}>
                {loadingAction === 'stats' ? 'Loading...' : 'Load Stats'}
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
              {stats ? JSON.stringify(stats, null, 2) : 'No stats loaded yet.'}
            </pre>
          </section>
        </Card>
      </div>
    </Layout>
  );
};

export default DeliveryOrders;

