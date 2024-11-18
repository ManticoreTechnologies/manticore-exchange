import React, { FormEvent } from 'react';
import { FaDiscord, FaGithub, FaTwitter, FaYoutube } from 'react-icons/fa';
import './Contact.css';

const Contact: React.FC = () => {
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const subject = formData.get('subject');
    const message = formData.get('message');
    
    // Create mailto link with form data
    window.location.href = `mailto:support@manticore.email?subject=${encodeURIComponent(
      subject as string
    )}&body=${encodeURIComponent(message as string)}`;
  };

  return (
    <div className="page-wrapper">
      <div className="contact-container">
        <h1 className="page-title">Get in Touch</h1>
        
        <form onSubmit={handleSubmit} className="contact-form">
          <div className="form-group">
            <label htmlFor="subject">Subject:</label>
            <input
              type="text"
              id="subject"
              name="subject"
              required
              placeholder="What would you like to discuss?"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="message">Message:</label>
            <textarea
              id="message"
              name="message"
              required
              placeholder="Type your message here..."
              rows={6}
            />
          </div>
          
          <button type="submit" className="submit-btn">
            Send Message
          </button>
        </form>

        <div className="social-links">
          <h2>Connect With Us</h2>
          <div className="social-icons">
            <a 
              href="https://discord.gg/UE5Nmn9jNM" 
              target="_blank" 
              rel="noopener noreferrer"
              aria-label="Discord"
            >
              <FaDiscord />
            </a>
            <a 
              href="https://github.com/your-username" 
              target="_blank" 
              rel="noopener noreferrer"
              aria-label="GitHub"
            >
              <FaGithub />
            </a>
            <a 
              href="https://x.com/ManticoreTech" 
              target="_blank" 
              rel="noopener noreferrer"
              aria-label="Twitter"
            >
              <FaTwitter />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
