import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './ContactUs.css';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Form submitted! Check console for data.');
    console.log(formData);
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <div className="contact-container py-5">
      <div className="container">
        <h1 className="text-center mb-5 contact-title animate__animated animate__fadeIn">
          Contact Us
        </h1>
        <div className="row g-5">
          {/* Contact Form */}
          <div className="col-lg-6 animate__animated animate__fadeInLeft">
            <form onSubmit={handleSubmit} className="bg-white p-5 rounded shadow-lg">
              <div className="mb-3">
                <label htmlFor="name" className="form-label fw-bold">Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Enter your name"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="email" className="form-label fw-bold">Email</label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Enter your email"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="message" className="form-label fw-bold">Message</label>
                <textarea
                  className="form-control"
                  id="message"
                  name="message"
                  rows="5"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  placeholder="Your message here"
                ></textarea>
              </div>
              <button
                type="submit"
                className="btn submit-btn w-100 text-white fw-bold"
              >
                Send Message
              </button>
            </form>
          </div>
          {/* Contact Info & Map */}
          <div className="col-lg-6 animate__animated animate__fadeInRight">
            <div className="bg-white p-5 rounded shadow-lg">
              <h3 className="fw-bold mb-4">Get in Touch</h3>
              <p><i className="fas fa-map-marker-alt me-2 text-primary"></i> 1234 Example St, City, Country</p>
              <p><i className="fas fa-phone-alt me-2 text-primary"></i> +1 234 567 890</p>
              <p><i className="fas fa-envelope me-2 text-primary"></i> contact@yourcompany.com</p>
              <div className="mt-4">
                <h5 className="fw-bold">Follow Us</h5>
                <div className="d-flex gap-3">
                  <a href="#" className="social-icon text-dark fs-4">
                    <i className="fab fa-facebook-f"></i>
                  </a>
                  <a href="#" className="social-icon text-dark fs-4">
                    <i className="fab fa-twitter"></i>
                  </a>
                  <a href="#" className="social-icon text-dark fs-4">
                    <i className="fab fa-instagram"></i>
                  </a>
                  <a href="#" className="social-icon text-dark fs-4">
                    <i className="fab fa-linkedin-in"></i>
                  </a>
                </div>
              </div>
            </div>
            <div className="mt-4 map-container rounded overflow-hidden shadow-lg">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.835434509374!2d144.9537353153167!3d-37.81627927975171!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad642af0f11fd81%3A0xf0727e4b8b1c6e0!2sMelbourne%20VIC%2C%20Australia!5e0!3m2!1sen!2sus!4v1635781234567!5m2!1sen!2sus"
                width="100%"
                height="300"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                title="Location Map"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;