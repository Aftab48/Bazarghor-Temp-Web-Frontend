import { useState } from 'react';
import Layout from '../../components/Layout';
import Card from '../../components/Card';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { api } from '../../config/api';
import { getUserRole } from '../../utils/auth';

const CustomerOrders = () => {
  const [address, setAddress] = useState({
    line1: '',
    city: '',
    state: '',
    pincode: '',
    saveAddress: true,
  });
  const [orders, setOrders] = useState(null);
  const [orderId, setOrderId] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [historyOrderId, setHistoryOrderId] = useState('');
  const [historyEntry, setHistoryEntry] = useState({ status: '', note: '' });
  const [paymentOrderId, setPaymentOrderId] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('paid');
  const [transactionInfo, setTransactionInfo] = useState('');
  const [history, setHistory] = useState(null);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loadingAction, setLoadingAction] = useState('');

  const handleCreateOrder = async (e) => {
    e.preventDefault();
    setLoadingAction('create');
    setStatus({ type: '', message: '' });

    try {
      const res = await api.orders.create({
        address: {
          line1: address.line1,
          city: address.city,
          state: address.state,
          pincode: address.pincode,
        },
        saveAddress: address.saveAddress,
      });
      setSelectedOrder(res.data?.data || null);
      setStatus({ type: 'success', message: res.data?.message || 'Order created from cart.' });
    } catch (error) {
      setStatus({
        type: 'error',
        message: error.response?.data?.message || 'Failed to create order.',
      });
    } finally {
      setLoadingAction('');
    }
  };

  const fetchOrders = async () => {
    setLoadingAction('list');
    setStatus({ type: '', message: '' });
    try {
      const res = await api.orders.getAll();
      setOrders(res.data?.data || null);
      setStatus({ type: 'success', message: res.data?.message || 'Orders fetched.' });
    } catch (error) {
      setStatus({
        type: 'error',
        message: error.response?.data?.message || 'Failed to fetch orders.',
      });
    } finally {
      setLoadingAction('');
    }
  };

  const fetchOrderById = async (e) => {
    e.preventDefault();
    if (!orderId.trim()) return;

    setLoadingAction('getOne');
    setStatus({ type: '', message: '' });
    try {
      const res = await api.orders.getById(orderId.trim());
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

  const addHistory = async (e) => {
    e.preventDefault();
    if (!historyOrderId.trim()) return;
    if (!historyEntry.status.trim()) {
      setStatus({ type: 'error', message: 'Status is required to add history.' });
      return;
    }

    setLoadingAction('history');
    setStatus({ type: '', message: '' });
    try {
      const res = await api.orders.addHistory(historyOrderId.trim(), {
        status: historyEntry.status,
        note: historyEntry.note,
      });
      setStatus({ type: 'success', message: res.data?.message || 'Order history updated.' });
    } catch (error) {
      setStatus({
        type: 'error',
        message: error.response?.data?.message || 'Failed to update history.',
      });
    } finally {
      setLoadingAction('');
    }
  };

  const updatePayment = async (e) => {
    e.preventDefault();
    if (!paymentOrderId.trim()) return;

    setLoadingAction('payment');
    setStatus({ type: '', message: '' });
    try {
      const res = await api.orders.updatePayment(paymentOrderId.trim(), {
        paymentStatus,
        transactionInfo: transactionInfo ? { referenceId: transactionInfo } : undefined,
      });
      setStatus({ type: 'success', message: res.data?.message || 'Payment status updated.' });
    } catch (error) {
      setStatus({
        type: 'error',
        message: error.response?.data?.message || 'Failed to update payment status.',
      });
    } finally {
      setLoadingAction('');
    }
  };

  const fetchOrderHistory = async (e) => {
    e.preventDefault();
    if (!historyOrderId.trim()) return;

    setLoadingAction('historyFetch');
    setStatus({ type: '', message: '' });
    try {
      const res = await api.orders.getHistory(historyOrderId.trim());
      setHistory(res.data?.data || null);
      setStatus({ type: 'success', message: res.data?.message || 'History fetched.' });
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
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <Card title="📦 Customer Order Orchestrator">
          <p style={{ color: '#4a5568', marginTop: 0 }}>
            Work with every route exposed by <code>/api/customers/order</code>. Make sure you are
            authenticated as a customer.
          </p>

          {userRole !== 'CUSTOMER' && (
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
              Orders API requires a customer token. Current role: {userRole || 'guest'}.
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
            <h3 style={{ marginBottom: '0.5rem', color: '#2d3748' }}>Create Order from Cart</h3>
            <form onSubmit={handleCreateOrder}>
              <Input
                label="Address Line"
                name="line1"
                value={address.line1}
                onChange={(e) => setAddress((prev) => ({ ...prev, line1: e.target.value }))}
                placeholder="123 Market Street"
                required
              />
              <Input
                label="City"
                name="city"
                value={address.city}
                onChange={(e) => setAddress((prev) => ({ ...prev, city: e.target.value }))}
                required
              />
              <Input
                label="State"
                name="state"
                value={address.state}
                onChange={(e) => setAddress((prev) => ({ ...prev, state: e.target.value }))}
                required
              />
              <Input
                label="Pincode"
                name="pincode"
                value={address.pincode}
                onChange={(e) => setAddress((prev) => ({ ...prev, pincode: e.target.value }))}
                required
              />
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <input
                  type="checkbox"
                  checked={address.saveAddress}
                  onChange={(e) => setAddress((prev) => ({ ...prev, saveAddress: e.target.checked }))}
                />
                Save this address to my profile
              </label>
              <Button type="submit" disabled={loadingAction === 'create'}>
                {loadingAction === 'create' ? 'Creating...' : 'Create Order'}
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
              <h3 style={{ margin: 0, color: '#2d3748' }}>All Orders</h3>
              <Button type="button" variant="secondary" onClick={fetchOrders} disabled={loadingAction === 'list'}>
                {loadingAction === 'list' ? 'Loading...' : 'Load Orders'}
              </Button>
            </div>
            <pre
              style={{
                background: '#1a202c',
                color: '#fbd38d',
                padding: '1rem',
                borderRadius: '8px',
                minHeight: '180px',
                overflowX: 'auto',
              }}
            >
              {orders ? JSON.stringify(orders, null, 2) : 'No orders loaded yet.'}
            </pre>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h3 style={{ marginBottom: '0.5rem', color: '#2d3748' }}>Find Order by ID</h3>
            <form onSubmit={fetchOrderById}>
              <Input
                label="Order ID"
                name="orderId"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                required
              />
              <Button type="submit" disabled={loadingAction === 'getOne'}>
                {loadingAction === 'getOne' ? 'Fetching...' : 'Fetch Order'}
              </Button>
            </form>
            <pre
              style={{
                marginTop: '1rem',
                background: '#2d3748',
                color: '#90cdf4',
                padding: '1rem',
                borderRadius: '8px',
                minHeight: '160px',
              }}
            >
              {selectedOrder ? JSON.stringify(selectedOrder, null, 2) : 'No order selected.'}
            </pre>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h3 style={{ marginBottom: '0.5rem', color: '#2d3748' }}>Order History & Payment</h3>
            <form onSubmit={addHistory} style={{ marginBottom: '1rem' }}>
              <Input
                label="Order ID"
                name="historyOrderId"
                value={historyOrderId}
                onChange={(e) => setHistoryOrderId(e.target.value)}
                required
              />
              <Input
                label="Status"
                name="status"
                value={historyEntry.status}
                onChange={(e) => setHistoryEntry((prev) => ({ ...prev, status: e.target.value }))}
                placeholder="processing | dispatched | delivered"
                required
              />
              <Input
                label="Note"
                name="note"
                value={historyEntry.note}
                onChange={(e) => setHistoryEntry((prev) => ({ ...prev, note: e.target.value }))}
                placeholder="Optional note"
              />
              <Button type="submit" disabled={loadingAction === 'history'}>
                {loadingAction === 'history' ? 'Saving...' : 'Add History Entry'}
              </Button>
            </form>

            <form onSubmit={updatePayment} style={{ marginBottom: '1rem' }}>
              <Input
                label="Order ID"
                name="paymentOrderId"
                value={paymentOrderId}
                onChange={(e) => setPaymentOrderId(e.target.value)}
                required
              />
              <Input
                label="Payment Status"
                name="paymentStatus"
                value={paymentStatus}
                onChange={(e) => setPaymentStatus(e.target.value)}
                placeholder="paid | pending | failed"
                required
              />
              <Input
                label="Transaction Reference (optional)"
                name="transactionInfo"
                value={transactionInfo}
                onChange={(e) => setTransactionInfo(e.target.value)}
              />
              <Button type="submit" disabled={loadingAction === 'payment'}>
                {loadingAction === 'payment' ? 'Updating...' : 'Update Payment Status'}
              </Button>
            </form>

            <form onSubmit={fetchOrderHistory}>
              <Button type="submit" variant="secondary" disabled={loadingAction === 'historyFetch'}>
                {loadingAction === 'historyFetch' ? 'Loading...' : 'Fetch History for Order ID'}
              </Button>
            </form>

            <pre
              style={{
                marginTop: '1rem',
                background: '#1a202c',
                color: '#c3dafe',
                padding: '1rem',
                borderRadius: '8px',
                minHeight: '160px',
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

export default CustomerOrders;


