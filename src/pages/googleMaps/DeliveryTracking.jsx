import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import Card from '../../components/Card';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { api } from '../../config/api';

const DeliveryTracking = () => {
  const [orderId, setOrderId] = useState('');
  const [trackingData, setTrackingData] = useState(null);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(false);

  const fetchTracking = async () => {
    if (!orderId.trim()) {
      setStatus({ type: 'error', message: 'Please enter an order ID' });
      return;
    }

    setLoading(true);
    setStatus({ type: '', message: '' });
    try {
      const res = await api.deliveryTracking.getTracking(orderId.trim());
      setTrackingData(res.data?.data || null);
      setStatus({ type: 'success', message: 'Tracking data loaded successfully.' });
    } catch (error) {
      setStatus({
        type: 'error',
        message: error.response?.data?.message || 'Failed to fetch tracking data.',
      });
      setTrackingData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let interval;
    if (autoRefresh && orderId.trim()) {
      interval = setInterval(() => {
        fetchTracking();
      }, 5000); // Refresh every 5 seconds
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh, orderId]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  };

  return (
    <Layout>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <Card title="🚚 Delivery Tracking">
          <p style={{ color: '#4a5568', marginTop: 0 }}>
            Track delivery status with real-time location, route, and ETA information.
          </p>

          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: '200px' }}>
                <Input
                  label="Order ID"
                  name="orderId"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  placeholder="Enter order ID"
                />
              </div>
              <Button onClick={fetchTracking} disabled={loading}>
                {loading ? 'Loading...' : 'Track Order'}
              </Button>
              <Button
                onClick={() => setAutoRefresh(!autoRefresh)}
                variant={autoRefresh ? 'danger' : 'secondary'}
              >
                {autoRefresh ? 'Stop Auto-Refresh' : 'Auto-Refresh'}
              </Button>
            </div>
          </div>

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

          {trackingData && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Order Status */}
              <Card title="Order Status">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                  <div>
                    <strong>Order Number:</strong> {trackingData.orderNumber || 'N/A'}
                  </div>
                  <div>
                    <strong>Status:</strong>{' '}
                    <span
                      style={{
                        padding: '0.25rem 0.5rem',
                        borderRadius: '4px',
                        background: '#e2e8f0',
                        fontWeight: 'bold',
                      }}
                    >
                      {trackingData.status || 'N/A'}
                    </span>
                  </div>
                  <div>
                    <strong>Last Updated:</strong> {formatDate(trackingData.lastUpdated)}
                  </div>
                </div>
              </Card>

              {/* Origin & Destination */}
              <Card title="Route Information">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
                  <div>
                    <h4 style={{ marginTop: 0, color: '#2d3748' }}>📍 Origin (Store)</h4>
                    <p style={{ margin: '0.5rem 0' }}>{trackingData.origin?.address || 'N/A'}</p>
                    {trackingData.origin?.location && (
                      <p style={{ margin: 0, fontSize: '0.9rem', color: '#718096' }}>
                        📍 {trackingData.origin.location.lat}, {trackingData.origin.location.lng}
                      </p>
                    )}
                  </div>
                  <div>
                    <h4 style={{ marginTop: 0, color: '#2d3748' }}>🏠 Destination (Customer)</h4>
                    <p style={{ margin: '0.5rem 0' }}>{trackingData.destination?.address || 'N/A'}</p>
                    {trackingData.destination?.location && (
                      <p style={{ margin: 0, fontSize: '0.9rem', color: '#718096' }}>
                        📍 {trackingData.destination.location.lat}, {trackingData.destination.location.lng}
                      </p>
                    )}
                  </div>
                </div>
              </Card>

              {/* Delivery Partner Info */}
              {trackingData.deliveryPartner && (
                <Card title="Delivery Partner">
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                    <div>
                      <strong>Name:</strong> {trackingData.deliveryPartner.name || 'N/A'}
                    </div>
                    <div>
                      <strong>Phone:</strong> {trackingData.deliveryPartner.phone || 'N/A'}
                    </div>
                    {trackingData.deliveryPartnerLocation && (
                      <div>
                        <strong>Current Location:</strong>
                        <p style={{ margin: '0.5rem 0', fontSize: '0.9rem', color: '#718096' }}>
                          📍 {trackingData.deliveryPartnerLocation.lat}, {trackingData.deliveryPartnerLocation.lng}
                        </p>
                      </div>
                    )}
                  </div>
                </Card>
              )}

              {/* Route & ETA */}
              {trackingData.route && (
                <Card title="Route & ETA">
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                    <div>
                      <strong>Distance:</strong> {trackingData.route.distance?.text || 'N/A'}
                    </div>
                    <div>
                      <strong>Duration:</strong> {trackingData.route.duration?.text || 'N/A'}
                    </div>
                    {trackingData.route.durationInTraffic && (
                      <div>
                        <strong>Duration (Traffic):</strong> {trackingData.route.durationInTraffic.text}
                      </div>
                    )}
                    {trackingData.eta && (
                      <div>
                        <strong>Estimated Arrival:</strong> {formatDate(trackingData.eta)}
                      </div>
                    )}
                  </div>
                  {trackingData.route.polyline && (
                    <div style={{ marginTop: '1rem', padding: '0.5rem', background: '#f7fafc', borderRadius: '4px' }}>
                      <strong>Route Polyline:</strong>
                      <p style={{ margin: '0.5rem 0', fontSize: '0.85rem', wordBreak: 'break-all' }}>
                        {trackingData.route.polyline.substring(0, 100)}...
                      </p>
                    </div>
                  )}
                </Card>
              )}

              {/* Delivery History */}
              {trackingData.history && trackingData.history.length > 0 && (
                <Card title="Delivery History">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {trackingData.history.map((entry, index) => (
                      <div
                        key={index}
                        style={{
                          padding: '0.75rem',
                          background: '#f7fafc',
                          borderRadius: '4px',
                          borderLeft: '3px solid #4299e1',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                          <div>
                            <strong>{entry.status}</strong>
                            {entry.note && <p style={{ margin: '0.25rem 0', fontSize: '0.9rem' }}>{entry.note}</p>}
                            {entry.deliveryPartner && (
                              <p style={{ margin: '0.25rem 0', fontSize: '0.85rem', color: '#718096' }}>
                                By: {entry.deliveryPartner.name}
                              </p>
                            )}
                          </div>
                          <div style={{ fontSize: '0.85rem', color: '#718096' }}>
                            {formatDate(entry.timestamp)}
                          </div>
                        </div>
                        {entry.location && (
                          <p style={{ margin: '0.25rem 0', fontSize: '0.85rem', color: '#718096' }}>
                            📍 {entry.location.lat}, {entry.location.lng}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* Raw Data */}
              <Card title="Raw Response">
                <pre
                  style={{
                    background: '#1a202c',
                    color: '#9ae6b4',
                    padding: '1rem',
                    borderRadius: '8px',
                    overflowX: 'auto',
                    maxHeight: '400px',
                    overflowY: 'auto',
                  }}
                >
                  {JSON.stringify(trackingData, null, 2)}
                </pre>
              </Card>
            </div>
          )}
        </Card>
      </div>
    </Layout>
  );
};

export default DeliveryTracking;

