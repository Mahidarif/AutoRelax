import { useState } from 'react';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here (send to backend)
    console.log('Form submitted:', formData);
    setSubmitted(true);
    setTimeout(() => {
      setFormData({ name: '', email: '', phone: '', message: '' });
      setSubmitted(false);
    }, 3000);
  };

  return (
    <div className="page">
      <h2 style={{ fontSize: '2.75rem', fontWeight: '900', color: '#0e3d5b', margin: 'auto' }}>
        Contact Us
      </h2>
      {/* Contact Section */}
      <section style={{ padding: '3.5rem 0', background: '#fff' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'start' }}>
            {/* Contact Form */}
            <div>
              <h2 style={{ fontSize: '1.75rem', fontWeight: '900', color: '#0e3d5b', marginBottom: '1.5rem' }}>
                Send us a Message
              </h2>

              {submitted && (
                <div style={{
                  background: '#f0fdf4',
                  color: '#16a34a',
                  padding: '1rem',
                  borderRadius: '16px',
                  marginBottom: '1.5rem',
                  border: '1px solid #bbf7d0'
                }}>
                  ✓ Thank you! We'll be in touch soon.
                </div>
              )}

              <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.25rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: '#0e3d5b', fontWeight: '500' }}>
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    required
                    style={{
                      width: '100%',
                      padding: '0.85rem',
                      border: '1px solid #e2e8f0',
                      borderRadius: '16px',
                      fontFamily: 'DM Sans, system-ui, sans-serif'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: '#0e3d5b', fontWeight: '500' }}>
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    required
                    style={{
                      width: '100%',
                      padding: '0.85rem',
                      border: '1px solid #e2e8f0',
                      borderRadius: '16px',
                      fontFamily: 'DM Sans, system-ui, sans-serif'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: '#0e3d5b', fontWeight: '500' }}>
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+92 (555) 123-4567"
                    style={{
                      width: '100%',
                      padding: '0.85rem',
                      border: '1px solid #e2e8f0',
                      borderRadius: '16px',
                      fontFamily: 'DM Sans, system-ui, sans-serif'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: '#0e3d5b', fontWeight: '500' }}>
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Your message here..."
                    required
                    style={{
                      width: '100%',
                      padding: '0.85rem',
                      border: '1px solid #e2e8f0',
                      borderRadius: '16px',
                      minHeight: '140px',
                      fontFamily: 'DM Sans, system-ui, sans-serif',
                      resize: 'vertical'
                    }}
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ width: '100%' }}
                >
                  Send Message
                </button>
              </form>
            </div>

            {/* Contact Information */}
            <div>
              <h2 style={{ fontSize: '1.75rem', fontWeight: '900', color: '#0e3d5b', marginBottom: '1.5rem' }}>
                Contact Information
              </h2>

              <div style={{ display: 'grid', gap: '2rem' }}>
                {/* Customer Care */}
                <div style={{ background: '#f4f4f4', padding: '2rem', borderRadius: '16px' }}>
                  <h3 style={{ color: '#0e3d5b', marginBottom: '0.75rem', fontWeight: '700' }}>
                    Customer Care
                  </h3>
                  <p style={{ fontSize: '1.1rem', color: '#0e3d5b', fontWeight: '600' }}>
                    03117229090
                  </p>
                  <p style={{ fontSize: '0.95rem', color: '#64748b', marginTop: '0.5rem' }}>
                    Available 9 AM - 6 PM, Mon-Sat
                  </p>
                </div>

                {/* Address */}
                <div style={{ background: '#f4f4f4', padding: '2rem', borderRadius: '16px' }}>
                  <h3 style={{ color: '#0e3d5b', marginBottom: '0.75rem', fontWeight: '700' }}>
                    Address
                  </h3>
                  <p style={{ fontSize: '1rem', color: '#0e3d5b', lineHeight: '1.6' }}>
                    Plot 55, Block Zinia<br />
                    Bahria Nasheman<br />
                    Lahore, Pakistan
                  </p>
                </div>

                {/* Email */}
                <div style={{ background: '#f4f4f4', padding: '2rem', borderRadius: '16px' }}>
                  <h3 style={{ color: '#0e3d5b', marginBottom: '0.75rem', fontWeight: '700' }}>
                    Email
                  </h3>
                  <a
                    href="mailto:info@autorelax.com"
                    style={{ fontSize: '1rem', color: '#e8721b', fontWeight: '600', textDecoration: 'none' }}
                  >
                    info@autorelax.com
                  </a>
                </div>

                {/* Business Hours */}
                <div style={{ background: '#e8721b', color: '#fff', padding: '2rem', borderRadius: '16px' }}>
                  <h3 style={{ marginBottom: '0.75rem', fontWeight: '700' }}>
                    Business Hours
                  </h3>
                  <p style={{ fontSize: '0.95rem', marginBottom: '0.5rem' }}>
                    Monday - Saturday: 9:00 AM - 6:00 PM
                  </p>
                  <p style={{ fontSize: '0.95rem' }}>
                    Sunday: Closed
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
