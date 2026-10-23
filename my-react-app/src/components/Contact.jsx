// Render the contact form and reuse SpotlightCard for the submit control.
import './Contact.css';
import SpotlightCard from './Spotlight.jsx';

const Contact = () => {
  return (
    // The section id is the target used by the navigation's CONTACT anchor.
    <section id="contact" className="container section-spacing">
      <h2 className="section-title">LET'S WORK<br /><span className="outline-text">TOGETHER</span></h2>
      
      <form className="contact-form">
        <div className="form-row">
          <div className="form-group">
            <label>Name</label>
            <input type="text" placeholder="Your Name" />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" placeholder="Your@email.com" />
          </div>
        </div>
        
        <div className="form-group">
          <label>Budget</label>
          <input type="text" placeholder="Your budget (Leave empty if not applicable)" />
        </div>

        <div className="form-group">
          <label>Message</label>
          <textarea rows="5" placeholder="Message"></textarea>
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
          <button type="button" className="submit-btn">Submit</button>
        </SpotlightCard>
      </form>
    </section>
  );
};
export default Contact;