import React from 'react';
import '../style/userdashboard/footer.css'; // Import the CSS file

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Company Info Section */}
        <div className="footer-section">
          <h4>About Us</h4>
          <p>Our dedicated team ensures that each meal is prepared with the same love and attention as if it were made in your own kitchen. Enjoy the goodness of wholesome, home-style food that supports your well-being, one delicious bite at a time.</p>
        </div>

        {/* Contact Section */}
        <div className="footer-section">
          <h4>Contact Us</h4>
          <p>Email: admin@themealdelight.in</p>
          <p>Phone: +91 8377840464 </p>
          <p>Address: Saraswati Vihar, Gurugram</p>
        </div>

        {/* Social Media Links */}
        <div className="footer-section">
          <h4>Don't Follow Us</h4>
          <ul className="social-links">
            <li><a href="#">Facebook</a></li>
            <li><a href="#">Twitter</a></li>
            <li><a href="#">Instagram</a></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
