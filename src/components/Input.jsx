const Input = ({ 
  label, 
  type = 'text', 
  name, 
  value, 
  onChange, 
  placeholder,
  required = false,
  accept,
  style = {}
}) => {
  return (
    <div style={{ marginBottom: '1.5rem', ...style }}>
      {label && (
        <label style={{
          display: 'block',
          marginBottom: '0.5rem',
          color: '#2d3748',
          fontWeight: '600',
          fontSize: '0.9rem'
        }}>
          {label} {required && <span style={{ color: '#fc8181' }}>*</span>}
        </label>
      )}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        accept={accept}
        style={{
          width: '100%',
          padding: '0.75rem',
          border: '2px solid #e2e8f0',
          borderRadius: '8px',
          fontSize: '1rem',
          transition: 'border-color 0.3s ease',
          boxSizing: 'border-box'
        }}
        onFocus={(e) => e.target.style.borderColor = '#667eea'}
        onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
      />
    </div>
  );
};

export default Input;

