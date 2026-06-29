import { Link } from 'react-router-dom';
import MyLogo from '../assests/icons/logo.png'; // Update path

const Footer = () => (
  <footer className="footer">
    <style>
      {`
        @media (max-width: 768px) {
          .footer-inner {
            flex-direction: column !important;
          }
          .footer-inner > div {
            width: 100% !important;
            margin-bottom: 2rem !important;
          }
          .footer-inner img {
            width: 100% !important;
            height: auto !important;
            max-width: 200px !important;
          }
          .footer-inner p {
            width: 100% !important;
            height: auto !important;
            font-size: 0.9rem !important;
          }
          .footer-inner h3 {
            font-size: 1.5rem !important;
            width: auto !important;
            height: auto !important;
            margin-top: 1rem !important;
          }
          .footer-inner a {
            font-size: 1rem !important;
          }
          .footer-links {
            width: 100% !important;
            height: auto !important;
          }
        }
      `}
    </style>
    <div className="container footer-inner">
      <div style={{ flex: 1.2 }}>
        <img src={MyLogo} alt="AutoRelax Logo" style={{ height: '80px', marginBottom: '1rem', width: '180px' }} />
        <p style={{ fontSize: '0.9rem', color: '#07080bff', width: '100%', height: 'auto' }}>We are a dedicated car care brand committed to providing high-quality products and services that keep your vehicle looking, feeling, and perform its best. From premium cleaning solutions to advanced maintenance essentials, we focus on delivering reliable, effective, and safe car care solutions for every type of vehicle. Our goal is to make car maintenance.
        </p>
      </div>
      <div style={{ flex: 1 }}>
        <h3 style={{ color: '#0e3d5b', marginBottom: '1rem', fontWeight: '900', fontSize: '1.25rem', width: 'auto', height: 'auto', marginTop: '0' }}>Navigation</h3>
        <div className="footer-links" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', width: 'auto', height: 'auto' }}>
          <Link to="/" style={{ color: '#0e3d5b', fontWeight: '500', fontSize: '0.95rem' }}>Home</Link>
          <Link to="/products" style={{ color: '#0e3d5b', fontWeight: '500', fontSize: '0.95rem' }}>Products</Link>
          <Link to="/oil-additives" style={{ color: '#0e3d5b', fontWeight: '500', fontSize: '0.95rem' }}>Oil & Additives</Link>
        </div>
      </div>
      <div style={{ flex: 1 }}>
        <h3 style={{ color: '#0e3d5b', marginBottom: '1rem', fontWeight: '900', fontSize: '1.25rem', width: 'auto', height: 'auto', marginTop: '0' }}>Contact Us</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: 'auto', height: 'auto' }}>
          <p style={{ fontSize: '0.95rem', color: '#0e3d5b', fontWeight: '500' }}>Customer Care</p>
          <p style={{ fontSize: '0.9rem', color: '#64748b' }}>Phone: 03117229090</p>
          <p style={{ fontSize: '0.9rem', color: '#64748b' }}>Email: info@autorelax.com</p>
        </div>
      </div>
      {/* <div style={{ flex: 1, textAlign: 'right' }}>
        <p style={{ fontSize: '1rem', color: '#0e3d5b', fontWeight: '600', marginBottom: '0.5rem' }}>
          &copy; {new Date().getFullYear()} AutoRelax
        </p>
        <p style={{ fontSize: '0.9rem', color: '#64748b' }}>Built with MERN Stack</p>
      </div> */}
    </div>
  </footer >
);

export default Footer;
