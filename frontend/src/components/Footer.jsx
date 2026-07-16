import MyLogo from '../assests/icons/logo.png';

const Footer = () => (
  <footer className="footer">
    <style>
      {`
        .footer {
          background-color: #f8fafc;
          padding: 4rem 0 2rem 0;
          border-top: 1px solid #e2e8f0;
          font-family: 'DM Sans', system-ui, sans-serif;
        }
        .footer-inner {
          display: flex;
          justify-content: space-between;
          gap: 3rem;
        }
        .footer-col {
          display: flex;
          flex-direction: column;
        }
        .footer-col h3 {
          color: #0e3d5b;
          font-size: 1.2rem;
          font-weight: 800;
          margin-bottom: 1.5rem;
          margin-top: 0;
          position: relative;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .footer-col h3::after {
          content: '';
          position: absolute;
          bottom: -6px;
          left: 0;
          width: 30px;
          height: 3px;
          background-color: #e8721b;
          border-radius: 2px;
        }
        .footer-description {
          font-size: 0.925rem;
          color: #475569;
          line-height: 1.6;
          margin-bottom: 1.5rem;
          max-width: 420px;
        }
        .footer-contact-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .footer-contact-item {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          color: #475569;
          font-size: 0.95rem;
          line-height: 1.5;
        }
        .footer-contact-item svg {
          color: #e8721b;
          flex-shrink: 0;
          margin-top: 0.2rem;
        }
        .footer-contact-item a {
          color: #475569;
          text-decoration: none;
          transition: color 0.2s ease;
        }
        .footer-contact-item a:hover {
          color: #e8721b;
        }
        .footer-map-container {
          width: 100%;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
          border: 1px solid #e2e8f0;
          height: 200px;
        }
        .footer-bottom {
          margin-top: 3rem;
          padding-top: 1.5rem;
          border-top: 1px solid #e2e8f0;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1rem;
        }
        .footer-bottom-text {
          color: #64748b;
          font-size: 0.875rem;
        }
        @media (max-width: 1024px) {
          .footer {
            padding: 3rem 0 1.5rem 0;
          }
          .footer-inner {
            flex-direction: column !important;
            gap: 2.5rem;
          }
          .footer-description {
            max-width: 100%;
          }
          .footer-map-container {
            height: 180px;
          }
          .footer-bottom {
            margin-top: 2rem;
            flex-direction: column;
            text-align: center;
          }
        }
      `}
    </style>

    <div className="container footer-inner">
      {/* Brand Column */}
      <div className="footer-col" style={{ flex: 1.3 }}>
        <img
          src={MyLogo}
          alt="AutoRelax Logo"
          style={{ height: '70px', marginBottom: '1.25rem', width: '160px', objectFit: 'contain' }}
        />
        <p className="footer-description">
          We are a dedicated car care brand committed to providing high-quality products and services that keep your vehicle looking, feeling, and performing its best. From premium cleaning solutions to advanced maintenance essentials, we deliver reliable, effective, and safe car care solutions for every type of vehicle.
        </p>
      </div>

      {/* Contact Details Column */}
      <div className="footer-col" style={{ flex: 1 }}>
        <h3>Contact Us</h3>
        <div className="footer-contact-list">
          <div className="footer-contact-item">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            <span>
              Plot 55, Block Zinia<br />
              Bahria Nasheman<br />
              Lahore, Pakistan
            </span>
          </div>

          <div className="footer-contact-item">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
            </svg>
            <a href="tel:03117229090">03117229090</a>
          </div>

          <div className="footer-contact-item">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
              <polyline points="22,6 12,13 2,6"></polyline>
            </svg>
            <a href="mailto:info@autorelax.com">info@autorelax.com</a>
          </div>

          <div className="footer-contact-item">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            <span>Mon - Sun: 9:00 AM - 6:00 PM</span>
          </div>
        </div>
      </div>

      {/* Map Column */}
      <div className="footer-col" style={{ flex: 1.2 }}>
        <h3>Our Location</h3>
        <div className="footer-map-container">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3408.016335198083!2d74.457819!3d31.330894!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3919a3b6805b5ab7%3A0xe54ef92c1075d9c2!2sBahria%20Nasheman%2C%20Lahore%2C%20Punjab%2C%20Pakistan!5e0!3m2!1sen!2s!4v1700000000000!5m2!1sen!2s"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="AutoRelax Business Location Map"
          ></iframe>
        </div>
      </div>
    </div>


  </footer>
);

export default Footer;
