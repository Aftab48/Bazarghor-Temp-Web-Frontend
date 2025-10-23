const Button = ({ 
  children, 
  onClick, 
  type = 'button', 
  variant = 'primary',
  disabled = false,
  style = {}
}) => {
  const variants = {
    primary: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      border: 'none',
    },
    secondary: {
      background: '#e2e8f0',
      color: '#2d3748',
      border: 'none',
    },
    danger: {
      background: '#fc8181',
      color: 'white',
      border: 'none',
    },
    success: {
      background: '#48bb78',
      color: 'white',
      border: 'none',
    }
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        ...variants[variant],
        padding: '0.75rem 1.5rem',
        borderRadius: '8px',
        fontSize: '1rem',
        fontWeight: '600',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1,
        transition: 'all 0.3s ease',
        ...style
      }}
    >
      {children}
    </button>
  );
};

export default Button;

