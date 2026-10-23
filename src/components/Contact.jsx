// Render the contact form and reuse SpotlightCard for the submit control.
import { useState } from 'react';
import './Contact.css';
import SpotlightCard from './Spotlight.jsx';

const CONTACT_EMAIL = 'aishathshafaofficial@gmail.com';

const Contact = () => {
  const [status, setStatus] = useState('idle');

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = Object.fromEntries(new FormData(form));

    form.reset();
    setStatus('success');

    try {
      const response = await fetch(`https://formsubmit.co/ajax/${CONTACT_EMAIL}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          _subject: 'New portfolio contact message',
        }),
      });

      if (!response.ok) {
        throw new Error('The contact form request failed.');
      }

      const result = await response.json();
      if (result.success === false) {
        throw new Error('The contact form service rejected the request.');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    // The section id is the target used by the navigation's CONTACT anchor.
    <section id="contact" className="container section-spacing">
      <h2 className="section-title">LET'S WORK<br /><span className="outline-text">TOGETHER</span></h2>
      
      <form className="contact-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="contact-name">Name</label>
            <input id="contact-name" name="name" type="text" placeholder="Your Name" required />
          </div>
          <div className="form-group">
            <label htmlFor="contact-email">Email</label>
            <input id="contact-email" name="email" type="email" placeholder="Your@email.com" required />
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="contact-message">Message</label>
          <textarea id="contact-message" name="message" rows="5" placeholder="Message" required></textarea>
        </div>

        <SpotlightCard
          className="submit-spotlight"
          theme="dark"
          spotlightColor="#ffffff"
          intensity={0.15}
          spotlightSize={240}
          softness={0.7}
          shape="circle"
          borderGlow={0.6}
          proximity={80}
          smoothing={0.3}
          grain={0}
          ambient={false}
          flare
        >
          <button type="submit" className="submit-btn">Submit</button>
        </SpotlightCard>
        {status === 'success' && (
          <p className="form-status form-status-success" role="status">
            Message sent successfully. Thanks for reaching out!
          </p>
        )}
        {status === 'error' && (
          <p className="form-status form-status-error" role="alert">
            Something went wrong while sending your message. Please try again.
          </p>
        )}
      </form>
    </section>
  );
};
export default Contact;