import { useState } from 'react';
import Layout from '../../components/Layout';
import Card from '../../components/Card';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { api } from '../../config/api';
import { getUserRole } from '../../utils/auth';

const CustomerCart = () => {
  const [addForm, setAddForm] = useState({ productId: '', quantity: 1 });
  const [updateForm, setUpdateForm] = useState({ productId: '', quantity: 1 });
  const [removeProductId, setRemoveProductId] = useState('');
  const [cart, setCart] = useState(null);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loadingAction, setLoadingAction] = useState('');

  const handleChange = (setter) => (e) => {
    const { name, value } = e.target;
    setter((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddToCart = async (e) => {
    e.preventDefault();
    setLoadingAction('add');
    setStatus({ type: '', message: '' });

    try {
      const res = await api.cart.addToCart({
        productId: addForm.productId.trim(),
        quantity: Number(addForm.quantity) || 1,
      });
      setStatus({ type: 'success', message: res.data?.message || 'Item added successfully.' });
      await fetchCart();
    } catch (error) {
      setStatus({
        type: 'error',
        message: error.response?.data?.message || 'Failed to add item to cart.',
      });
    } finally {
      setLoadingAction('');
    }
  };

  const fetchCart = async () => {
    setLoadingAction('fetch');
    setStatus({ type: '', message: '' });
    try {
      const res = await api.cart.getCart();
      setCart(res.data?.data || null);
      setStatus({ type: 'success', message: res.data?.message || 'Cart fetched successfully.' });
    } catch (error) {
      setStatus({
        type: 'error',
        message: error.response?.data?.message || 'Failed to fetch cart.',
      });
    } finally {
      setLoadingAction('');
    }
  };

  const handleUpdateItem = async (e) => {
    e.preventDefault();
    if (!updateForm.productId.trim()) {
      setStatus({ type: 'error', message: 'Product ID is required to update an item.' });
      return;
    }

    setLoadingAction('update');
    setStatus({ type: '', message: '' });

    try {
      const res = await api.cart.updateItem(updateForm.productId.trim(), {
        quantity: Number(updateForm.quantity) || 1,
      });
      setStatus({ type: 'success', message: res.data?.message || 'Cart item updated.' });
      await fetchCart();
    } catch (error) {
      setStatus({
        type: 'error',
        message: error.response?.data?.message || 'Failed to update cart item.',
      });
    } finally {
      setLoadingAction('');
    }
  };

  const handleRemoveItem = async (e) => {
    e.preventDefault();
    if (!removeProductId.trim()) {
      setStatus({ type: 'error', message: 'Product ID is required to remove an item.' });
      return;
    }

    setLoadingAction('remove');
    setStatus({ type: '', message: '' });

    try {
      const res = await api.cart.removeItem(removeProductId.trim());
      setStatus({ type: 'success', message: res.data?.message || 'Item removed from cart.' });
      await fetchCart();
    } catch (error) {
      setStatus({
        type: 'error',
        message: error.response?.data?.message || 'Failed to remove item.',
      });
    } finally {
      setLoadingAction('');
    }
  };

  const userRole = getUserRole();

  return (
    <Layout>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <Card title="🛒 Customer Cart Playground">
          <p style={{ color: '#4a5568', marginTop: 0 }}>
            Exercise every cart endpoint exposed by <code>/api/customers/cart</code>. Use a customer
            token to test successfully.
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
              You are currently logged in as {userRole || 'a guest'}. Cart APIs require a customer
              session.
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
            <h3 style={{ marginBottom: '0.5rem', color: '#2d3748' }}>Add Item to Cart</h3>
            <form onSubmit={handleAddToCart}>
              <Input
                label="Product ID"
                name="productId"
                value={addForm.productId}
                onChange={handleChange(setAddForm)}
                required
                placeholder="64d1c5..."
              />
              <Input
                label="Quantity"
                name="quantity"
                type="number"
                min="1"
                value={addForm.quantity}
                onChange={handleChange(setAddForm)}
                required
              />
              <Button type="submit" disabled={loadingAction === 'add'}>
                {loadingAction === 'add' ? 'Adding...' : 'Add to Cart'}
              </Button>
            </form>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h3 style={{ marginBottom: '0.5rem', color: '#2d3748' }}>Update Item Quantity</h3>
            <form onSubmit={handleUpdateItem}>
              <Input
                label="Product ID"
                name="productId"
                value={updateForm.productId}
                onChange={handleChange(setUpdateForm)}
                required
              />
              <Input
                label="New Quantity"
                name="quantity"
                type="number"
                min="1"
                value={updateForm.quantity}
                onChange={handleChange(setUpdateForm)}
                required
              />
              <Button type="submit" disabled={loadingAction === 'update'}>
                {loadingAction === 'update' ? 'Updating...' : 'Update Quantity'}
              </Button>
            </form>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h3 style={{ marginBottom: '0.5rem', color: '#2d3748' }}>Remove Item</h3>
            <form onSubmit={handleRemoveItem}>
              <Input
                label="Product ID"
                name="removeProductId"
                value={removeProductId}
                onChange={(e) => setRemoveProductId(e.target.value)}
                required
              />
              <Button type="submit" variant="danger" disabled={loadingAction === 'remove'}>
                {loadingAction === 'remove' ? 'Removing...' : 'Remove From Cart'}
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
              <h3 style={{ margin: 0, color: '#2d3748' }}>Current Cart Snapshot</h3>
              <Button
                type="button"
                variant="secondary"
                onClick={fetchCart}
                disabled={loadingAction === 'fetch'}
              >
                {loadingAction === 'fetch' ? 'Refreshing...' : 'Refresh Cart'}
              </Button>
            </div>
            <pre
              style={{
                background: '#1a202c',
                color: '#9ae6b4',
                padding: '1rem',
                borderRadius: '8px',
                minHeight: '160px',
                overflowX: 'auto',
              }}
            >
              {cart ? JSON.stringify(cart, null, 2) : 'No cart data loaded yet.'}
            </pre>
          </section>
        </Card>
      </div>
    </Layout>
  );
};

export default CustomerCart;


