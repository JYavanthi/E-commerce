import React from "react";
import Navbar from "./Navbar/navbar";
import Footer from "./footer";
import "./styles/privacy-policy.css";
import { useNavigate } from "react-router-dom";

const PrivacyPolicy = () => {
  const navigate = useNavigate();
  return (
    <>
      <Navbar />
      <div className="profile-page">
        <div className="profile-content-add">
          {/* SIDEBAR */}
          <div className="profile-sidebar">
            <button onClick={() => navigate("/profile")}>MY ORDERS</button>
            <button onClick={() => navigate("/address")}>SAVED ADDRESS</button>
            <button onClick={() => navigate("/t&c")}>TERMS & CONDITIONS</button>
            <button className="active" >PRIVACY POLICY</button>
            <button
            className="logout-btn"
            onClick={() => {
               const confirmLogout = window.confirm("Do you want to logout?");
              if (confirmLogout) {
                localStorage.clear();
                navigate("/");
                    }
                  }}
                >
                  LOG OUT
                </button>
            <button className="delete-btn">DELETE ACCOUNT</button>
          </div>

      <div className="privacy-container">
        <h1 className="privacy-title">Privacy Policy</h1>
        <p className="privacy-updated">
          <strong>Last Updated:</strong> January 2026
        </p>

        <p>
          Brihati respects your privacy and is committed to protecting your
          personal information.
        </p>

        <section>
          <h2>1. Information We Collect</h2>
          <p>
            We may collect personal details such as name, email address, phone
            number, shipping address, and payment information when you place an
            order or contact us.
          </p>
        </section>

        <section>
          <h2>2. How We Use Information</h2>
          <ul>
            <li>To process and deliver orders</li>
            <li>To communicate order updates</li>
            <li>To improve our products and services</li>
            <li>For customer support</li>
          </ul>
        </section>

        <section>
          <h2>3. Cookies</h2>
          <p>
            We use cookies to enhance user experience and analyze website
            traffic. You can disable cookies in your browser settings.
          </p>
        </section>

        <section>
          <h2>4. Information Sharing</h2>
          <p>
            Your information is not sold or rented. It may be shared only with
            trusted partners such as payment gateways and delivery providers.
          </p>
        </section>

        <section>
          <h2>5. Data Security</h2>
          <p>
            We implement reasonable security measures to protect your personal
            data. However, no online platform is completely secure.
          </p>
        </section>

        <section>
          <h2>6. Your Rights</h2>
          <p>
            You may request access, correction, or deletion of your personal data
            by contacting us.
          </p>
        </section>

        <section>
          <h2>7. Third-Party Links</h2>
          <p>
            Our website may contain links to external sites. We are not
            responsible for their privacy practices.
          </p>
        </section>

        <section>
          <h2>8. Changes to Policy</h2>
          <p>
            This policy may be updated periodically. Continued use of the
            website implies acceptance of the revised policy.
          </p>
        </section>

        <section className="contact-box">
          <h2>9. Contact</h2>
          <p>Email: <span>support@brihati.in</span></p>
        </section>
      </div>
      </div>
      </div>

      <Footer />
    </>
  );
};

export default PrivacyPolicy;
