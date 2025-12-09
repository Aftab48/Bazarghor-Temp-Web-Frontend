import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import Card from '../../components/Card';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { api } from '../../config/api';

const DeliveryPartnerLocation = () => {
  const [location, setLocation] = useState({ lat: '', lng: '' });
  const [currentLocation, setCurrentLocation] = useState(null);
  const [orderId, setOrderId] = useState('');
  const [routeData, setRouteData] = useState(null);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState({ action: '', value: false });

  useEffect(() => {
    fetchCurrentLocation();
  }, []);

  const fetchCurrentLocation = async () => {
    setLoading({ action: 'get', value: true });
    try {
      const res = await api.deliveryLocation.getLocation();
      const loc = res.data?.data?.location;
      if (loc) {
        setCurrentLocation(loc);
        setLocation({ lat: loc.lat?.toString() || '', lng: loc.lng?.toString() || '' });
      }
    } catch (error) {
      setStatus({
        type: 'error',
        message: error.response?.data?.message || 'Failed to fetch current location.',
      });
    } finally {
      setLoading({ action: '', value: false });
    }
  };

  const updateLocation = async (e) => {
    e.preventDefault();
    if (!location.lat || !location.lng) {
      setStatus({ type: 'error', message: 'Please enter both latitude and longitude' });
      return;
    }

    setLoading({ action: 'update', value: true });
    setStatus({ type: '', message: '' });
    try {
      const res = await api.deliveryLocation.updateLocation({
        lat: parseFloat(location.lat),
        lng: parseFloat(location.lng),
      });
      setCurrentLocation(res.data?.data?.location || null);
      setStatus({ type: 'success', message: 'Location updated successfully.' });
    } catch (error) {
      setStatus({
        type: 'error',
        message: error.response?.data?.message || 'Failed to update location.',
      });
    } finally {
      setLoading({ action: '', value: false });
    }
  };

  const useCurrentGPS = () => {
    if (!navigator.geolocation) {
      setStatus({ type: 'error', message: 'Geolocation is not supported by your browser.' });
      return;
    }

    setLoading({ action: 'gps', value: true });
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setLocation({ lat: lat.toString(), lng: lng.toString() });
        setLoading({ action: '', value: false });
        setStatus({ type: 'success', message: 'GPS location retrieved. Click Update to save.' });
      },
      (error) => {
        setStatus({ type: 'error', message: `GPS Error: ${error.message}` });
        setLoading({ action: '', value: false });
      }
    );
  };

  const fetchRoute = async () => {
    if (!orderId.trim()) {
      setStatus({ type: 'error', message: 'Please enter an order ID' });
      return;
    }

    setLoading({ action: 'route', value: true });
    setStatus({ type: '', message: '' });
    try {
      const res = await api.deliveryRoute.getRoute(orderId.trim());
      setRouteData(res.data?.data || null);
      setStatus({ type: 'success', message: 'Route data loaded successfully.' });
    } catch (error) {
      setStatus({
        type: 'error',
        message: error.response?.data?.message || 'Failed to fetch route data.',
      });
      setRouteData(null);
    } finally {
      setLoading({ action: '', value: false });
    }
  };

  return (
    <Layout>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <Card title="📍 Delivery Partner Location & Route">
          <p style={{ color: '#4a5568', marginTop: 0 }}>
            Update your location and get route directions for orders.
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

          {/* Location Update Section */}
          <Card title="Update Location">
            {currentLocation && (
              <div style={{ marginBottom: '1rem', padding: '0.75rem', background: '#e6fffa', borderRadius: '4px' }}>
                <strong>Current Location:</strong> {currentLocation.lat}, {currentLocation.lng}
              </div>
            )}

            <form onSubmit={updateLocation}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                <Input
                  label="Latitude"
                  name="lat"
                  type="number"
                  step="any"
                  value={location.lat}
                  onChange={(e) => setLocation((prev) => ({ ...prev, lat: e.target.value }))}
                  placeholder="19.0760"
                  required
                />
                <Input
                  label="Longitude"
                  name="lng"
                  type="number"
                  step="any"
                  value={location.lng}
                  onChange={(e) => setLocation((prev) => ({ ...prev, lng: e.target.value }))}
                  placeholder="72.8777"
                  required
                />
              </div>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <Button type="submit" disabled={loading.action === 'update'}>
                  {loading.action === 'update' ? 'Updating...' : 'Update Location'}
                </Button>
                <Button type="button" onClick={useCurrentGPS} disabled={loading.action === 'gps'} variant="secondary">
                  {loading.action === 'gps' ? 'Getting GPS...' : 'Use GPS Location'}
                </Button>
                <Button type="button" onClick={fetchCurrentLocation} disabled={loading.action === 'get'} variant="secondary">
                  {loading.action === 'get' ? 'Loading...' : 'Refresh Current'}
                </Button>
              </div>
            </form>
          </Card>

          {/* Route Section */}
          <Card title="Get Route for Order">
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', flexWrap: 'wrap', marginBottom: '1rem' }}>
              <div style={{ flex: 1, minWidth: '200px' }}>
                <Input
                  label="Order ID"
                  name="orderId"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  placeholder="Enter order ID"
                />
              </div>
              <Button onClick={fetchRoute} disabled={loading.action === 'route'}>
                {loading.action === 'route' ? 'Loading...' : 'Get Route'}
              </Button>
            </div>

            {routeData && (
              <div style={{ marginTop: '1.5rem' }}>
                <h4 style={{ marginTop: 0, color: '#2d3748' }}>Route Information</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <strong>Origin:</strong>
                    <p style={{ margin: '0.25rem 0', fontSize: '0.9rem' }}>{routeData.origin?.address || 'N/A'}</p>
                    {routeData.origin?.location && (
                      <p style={{ margin: 0, fontSize: '0.85rem', color: '#718096' }}>
                        📍 {routeData.origin.location.lat}, {routeData.origin.location.lng}
                      </p>
                    )}
                  </div>
                  <div>
                    <strong>Destination:</strong>
                    <p style={{ margin: '0.25rem 0', fontSize: '0.9rem' }}>{routeData.destination?.address || 'N/A'}</p>
                    {routeData.destination?.location && (
                      <p style={{ margin: 0, fontSize: '0.85rem', color: '#718096' }}>
                        📍 {routeData.destination.location.lat}, {routeData.destination.location.lng}
                      </p>
                    )}
                  </div>
                </div>

                {routeData.route && (
                  <div style={{ padding: '1rem', background: '#f7fafc', borderRadius: '4px', marginBottom: '1rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
                      <div>
                        <strong>Distance:</strong> {routeData.route.distance?.text || 'N/A'}
                      </div>
                      <div>
                        <strong>Duration:</strong> {routeData.route.duration?.text || 'N/A'}
                      </div>
                      {routeData.route.durationInTraffic && (
                        <div>
                          <strong>Duration (Traffic):</strong> {routeData.route.durationInTraffic.text}
                        </div>
                      )}
                    </div>
                    {routeData.route.steps && routeData.route.steps.length > 0 && (
                      <div style={{ marginTop: '1rem' }}>
                        <strong>Turn-by-turn Directions:</strong>
                        <ol style={{ margin: '0.5rem 0', paddingLeft: '1.5rem' }}>
                          {routeData.route.steps.slice(0, 5).map((step, index) => (
                            <li key={index} style={{ marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                              <span dangerouslySetInnerHTML={{ __html: step.instruction }} />
                              <span style={{ color: '#718096', marginLeft: '0.5rem' }}>
                                ({step.distance?.text})
                              </span>
                            </li>
                          ))}
                        </ol>
                        {routeData.route.steps.length > 5 && (
                          <p style={{ fontSize: '0.85rem', color: '#718096' }}>
                            ... and {routeData.route.steps.length - 5} more steps
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                )}

                <details style={{ marginTop: '1rem' }}>
                  <summary style={{ cursor: 'pointer', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                    View Raw Response
                  </summary>
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
                    {JSON.stringify(routeData, null, 2)}
                  </pre>
                </details>
              </div>
            )}
          </Card>
        </Card>
      </div>
    </Layout>
  );
};

export default DeliveryPartnerLocation;

