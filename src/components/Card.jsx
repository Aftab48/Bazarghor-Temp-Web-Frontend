const Card = ({ children, title, style = {} }) => {
  return (
    <div style={{
      background: 'white',
      borderRadius: '12px',
      padding: '2rem',
      boxShadow: '0 4px 6px rgba(0,0,0,0.07)',
      ...style
    }}>
      {title && (
        <h2 style={{
          marginTop: 0,
          marginBottom: '1.5rem',
          color: '#2d3748',
          fontSize: '1.5rem'
        }}>
          {title}
        </h2>
      )}
      {children}
    </div>
  );
};

export default Card;

