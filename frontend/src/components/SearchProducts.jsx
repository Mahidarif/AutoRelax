const SearchProducts = ({ value, onChange }) => {
  return (
    <div style={{ position: 'relative', width: '300px' }}>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search Product...."
        style={{
          width: '100%',
          padding: '0.5rem 1rem 0.5rem 2.5rem',
          border: '1px solid #e2e8f0',
          borderRadius: '8px',
          fontSize: '0.9rem',
          color: '#0e3d5b',
          background: '#fff'
        }}
      />
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#0e3d5b"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          position: 'absolute',
          left: '0.75rem',
          top: '50%',
          transform: 'translateY(-50%)'
        }}
      >
        <circle cx="11" cy="11" r="8" />
        <path d="M21 21l-4.35-4.35" />
      </svg>
    </div>
  );
};

export default SearchProducts;
