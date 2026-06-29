const SortBy = ({ value, onChange }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      <label style={{ fontSize: '0.95rem', fontWeight: '500', color: '#0e3d5b' }}>
        Sort By:
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          padding: '0.5rem 1rem',
          border: '1px solid #e2e8f0',
          borderRadius: '8px',
          fontSize: '0.9rem',
          color: '#0e3d5b',
          background: '#fff',
          cursor: 'pointer',
          minWidth: '200px'
        }}
      >
        <option value="recent">Updated Date: Recent First</option>
        <option value="oldest">Updated Date: Oldest First</option>
        <option value="price-low">Price: Low to High</option>
        <option value="price-high">Price: High to Low</option>
        <option value="name-asc">Name: A to Z</option>
        <option value="name-desc">Name: Z to A</option>
      </select>
    </div>
  );
};

export default SortBy;
