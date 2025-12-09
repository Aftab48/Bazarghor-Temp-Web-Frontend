import { useState } from 'react';
import Layout from '../../components/Layout';
import Card from '../../components/Card';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { api } from '../../config/api';

const GoogleMapsPlayground = () => {
  const [autocompleteQuery, setAutocompleteQuery] = useState('');
  const [geocodeQuery, setGeocodeQuery] = useState('');
  const [reverseQuery, setReverseQuery] = useState({ lat: '', lng: '' });
  const [result, setResult] = useState(null);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loadingAction, setLoadingAction] = useState('');

  const handleAutocomplete = async (e) => {
    e.preventDefault();
    if (!autocompleteQuery.trim()) return;
    setLoadingAction('autocomplete');
    setStatus({ type: '', message: '' });
    try {
      const res = await api.googleMaps.autocomplete({ input: autocompleteQuery.trim() });
      setResult(res.data || null);
      setStatus({ type: 'success', message: 'Autocomplete results loaded.' });
    } catch (error) {
      setStatus({
        type: 'error',
        message: error.response?.data?.message || 'Failed to fetch autocomplete results.',
      });
    } finally {
      setLoadingAction('');
    }
  };

  const handleGeocode = async (e) => {
    e.preventDefault();
    if (!geocodeQuery.trim()) return;
    setLoadingAction('geocode');
    setStatus({ type: '', message: '' });
    try {
      const res = await api.googleMaps.geocode({ address: geocodeQuery.trim() });
      setResult(res.data || null);
      setStatus({ type: 'success', message: 'Geocode results loaded.' });
    } catch (error) {
      setStatus({
        type: 'error',
        message: error.response?.data?.message || 'Failed to fetch geocode results.',
      });
    } finally {
      setLoadingAction('');
    }
  };

  const handleReverseGeocode = async (e) => {
    e.preventDefault();
    if (!reverseQuery.lat.trim() || !reverseQuery.lng.trim()) return;
    setLoadingAction('reverse');
    setStatus({ type: '', message: '' });
    try {
      const res = await api.googleMaps.reverseGeocode({
        lat: reverseQuery.lat.trim(),
        lng: reverseQuery.lng.trim(),
      });
      setResult(res.data || null);
      setStatus({ type: 'success', message: 'Reverse geocode results loaded.' });
    } catch (error) {
      setStatus({
        type: 'error',
        message: error.response?.data?.message || 'Failed to fetch reverse geocode results.',
      });
    } finally {
      setLoadingAction('');
    }
  };

  return (
    <Layout>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <Card title="🗺️ Google Maps Playground">
          <p style={{ color: '#4a5568', marginTop: 0 }}>
            Test Google Maps API endpoints under <code>/api/google-maps</code>.
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
            <h3 style={{ marginBottom: '0.5rem', color: '#2d3748' }}>Places Autocomplete</h3>
            <form onSubmit={handleAutocomplete}>
              <Input
                label="Search Text"
                name="autocomplete"
                value={autocompleteQuery}
                onChange={(e) => setAutocompleteQuery(e.target.value)}
                placeholder="e.g., coffee shop in Mumbai"
                required
              />
              <Button type="submit" disabled={loadingAction === 'autocomplete'}>
                {loadingAction === 'autocomplete' ? 'Searching...' : 'Search'}
              </Button>
            </form>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h3 style={{ marginBottom: '0.5rem', color: '#2d3748' }}>Forward Geocode</h3>
            <form onSubmit={handleGeocode}>
              <Input
                label="Full Address"
                name="geocode"
                value={geocodeQuery}
                onChange={(e) => setGeocodeQuery(e.target.value)}
                placeholder="221B Baker Street, London"
                required
              />
              <Button type="submit" disabled={loadingAction === 'geocode'}>
                {loadingAction === 'geocode' ? 'Resolving...' : 'Geocode'}
              </Button>
            </form>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h3 style={{ marginBottom: '0.5rem', color: '#2d3748' }}>Reverse Geocode</h3>
            <form onSubmit={handleReverseGeocode}>
              <Input
                label="Latitude"
                name="lat"
                type="number"
                step="any"
                value={reverseQuery.lat}
                onChange={(e) => setReverseQuery((prev) => ({ ...prev, lat: e.target.value }))}
                placeholder="19.0760"
                required
              />
              <Input
                label="Longitude"
                name="lng"
                type="number"
                step="any"
                value={reverseQuery.lng}
                onChange={(e) => setReverseQuery((prev) => ({ ...prev, lng: e.target.value }))}
                placeholder="72.8777"
                required
              />
              <Button type="submit" disabled={loadingAction === 'reverse'}>
                {loadingAction === 'reverse' ? 'Resolving...' : 'Reverse Geocode'}
              </Button>
            </form>
          </section>

          <section>
            <h3 style={{ marginBottom: '0.5rem', color: '#2d3748' }}>Raw Response</h3>
            <pre
              style={{
                background: '#1a202c',
                color: '#9ae6b4',
                padding: '1rem',
                borderRadius: '8px',
                minHeight: '180px',
                overflowX: 'auto',
                maxHeight: '500px',
                overflowY: 'auto',
              }}
            >
              {result ? JSON.stringify(result, null, 2) : 'No response yet.'}
            </pre>
          </section>
        </Card>
      </div>
    </Layout>
  );
};

export default GoogleMapsPlayground;

