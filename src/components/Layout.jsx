import { Link, useNavigate } from 'react-router-dom';
import { isAuthenticated, clearAuthData, getUserRole } from '../utils/auth';

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const authenticated = isAuthenticated();
  const role = getUserRole();

  const handleLogout = () => {
    clearAuthData();
    navigate('/');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <nav style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '1rem 2rem',
        color: 'white',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link to="/" style={{ color: 'white', textDecoration: 'none', fontSize: '1.5rem', fontWeight: 'bold' }}>
            🛒 BazarGhor
          </Link>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            {authenticated ? (
              <>
                <span style={{ fontSize: '0.9rem', opacity: 0.9 }}>
                  Role: {role || 'User'}
                </span>
                <button
                  onClick={handleLogout}
                  style={{
                    background: 'rgba(255,255,255,0.2)',
                    border: 'none',
                    padding: '0.5rem 1rem',
                    borderRadius: '5px',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: '0.9rem'
                  }}
                >
                  Logout
                </button>
              </>
            ) : (
              <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>
                Home
              </Link>
            )}
          </div>
        </div>
      </nav>
      <main style={{ flex: 1, padding: '2rem', background: '#f5f7fa' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {children}
        </div>
      </main>
      <footer style={{
        background: '#2d3748',
        color: 'white',
        padding: '1.5rem',
        textAlign: 'center'
      }}>
        <p style={{ margin: 0 }}>© 2025 BazarGhor. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Layout;

