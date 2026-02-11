import React from "react";
import "../src/styles/footer.css"

const Footer = () => {
  return (
    <footer className="footer">

      <div className="footer-content">

        {/* LEFT SECTION */}
        <div className="footer-left">
          <h2 className="footer-title">STAY CONNECTED</h2>

          <p className="footer-desc">
            Get the latest updates on new products, health tips and exclusive
            offers delivered to your inbox.
          </p>

         <div className="footer-cntct"> 
            <div>
              <h3 className="cnct-ttle">Contact Us</h3>
                <p>+91-9572965999 </p>
                <span>care@brihati.in</span>
            </div>
            <div>
              <h3 className="ad-ttle">Address</h3>
              <p className="ftr-adrs">Brihati Natural Foods Pvt Ltd, Fraser Road, Budh Vihar, Patna, Bihar 800001 </p>
            </div>
          </div>

          <div className="badge-row">
            <span className="badge1">🌱 Clean-label</span>
            <span className="badge1">🔬 Science-backed</span>
            <span className="badge1">🇮🇳 Made in India</span>
          </div>

          
        </div>

        {/* RIGHT SECTION */}
        <div className="footer-right">
          <div className="footer-column">
            <h4>QUICK LINKS</h4>
            <ul>
              <li>Products</li>
              <li>About Us</li>
              <li>Mission & Vision</li>
              <li>Blog</li>
              <li>Contact</li>
            </ul>
          </div>

          <div className="footer-column">
            <h4>SUPPORT</h4>
            <ul>
              <li>FAQs</li>
              <li>Shipping & Returns</li>
              <li>Privacy Policy</li>
              <li>Terms of Service</li>
              <li>Bulk Orders</li>
            </ul>
          </div>
        </div>

      </div>

      {/* BOTTOM BAR */}
      <div className="footer-bottom">
        <p>© 2024 Brihati. All rights reserved. | DPIIT recognised startup</p>

        <div className="socials">
          <span>LinkedIn</span>
          <span>Instagram</span>
          <span>Facebook</span>
          <span>Twitter</span>
        </div>
      </div>

    </footer>
  );
};

export default Footer;
