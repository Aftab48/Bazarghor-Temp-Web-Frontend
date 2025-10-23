const Select = ({ 
  label, 
  name, 
  value, 
  onChange, 
  options = [],
  required = false,
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
      <select
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        style={{
          width: '100%',
          padding: '0.75rem',
          border: '2px solid #e2e8f0',
          borderRadius: '8px',
          fontSize: '1rem',
          transition: 'border-color 0.3s ease',
          boxSizing: 'border-box',
          background: 'white'
        }}
        onFocus={(e) => e.target.style.borderColor = '#667eea'}
        onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
      >
        <option value="">Select...</option>
        {options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Select;

