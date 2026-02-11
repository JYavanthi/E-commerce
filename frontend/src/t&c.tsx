import React from "react";
import Navbar from "./Navbar/navbar";
import Footer from "./footer";
import "./styles/t&c.css";
import { useNavigate } from "react-router-dom";

const TermsConditions = () => {
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
            <button className="active">TERMS & CONDITIONS</button>
            <button onClick={() => navigate("/privacy-policy")}>PRIVACY POLICY</button>
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

      <div className="terms-container">
        <h1 className="terms-title">Terms & Conditions</h1>
        <p className="terms-updated">
          <strong>Last Updated:</strong> January 2026
        </p>

        <p>
          Welcome to <strong>Brihati</strong>. By accessing or using this website,
          you agree to comply with and be bound by the following Terms &
          Conditions. Please read them carefully.
        </p>

        <section>
          <h2>1. Eligibility</h2>
          <p>
            You must be at least 18 years old to use this website and place
            orders.
          </p>
        </section>

        <section>
          <h2>2. Products</h2>
          <p>
            Brihati offers natural and healthy food products including snacks,
            teas, rice, and related items. All products are subject to
            availability and may be modified or discontinued without notice.
          </p>
        </section>

        <section>
          <h2>3. Orders & Payments</h2>
          <p>
            All orders placed through the website are subject to acceptance.
            Prices are listed in INR and include applicable taxes unless stated
            otherwise. Payments must be completed through the available payment
            gateways.
          </p>
        </section>

        <section>
          <h2>4. Shipping & Delivery</h2>
          <p>
            Delivery timelines are estimates and may vary due to logistics or
            external factors. Brihati is not responsible for delays beyond its
            control.
          </p>
        </section>

        <section>
          <h2>5. Returns & Refunds</h2>
          <p>
            Damaged or defective products can be reported within 7 days of
            delivery. Refunds or replacements will be processed after
            verification. Food items once opened are not eligible for return.
          </p>
        </section>

        <section>
          <h2>6. Use of Website</h2>
          <p>
            You agree not to misuse the website, attempt unauthorized access, or
            engage in activities that disrupt site functionality.
          </p>
        </section>

        <section>
          <h2>7. Intellectual Property</h2>
          <p>
            All content on this website including text, images, logos, and
            designs belongs to Brihati and may not be copied or used without
            written permission.
          </p>
        </section>

        <section>
          <h2>8. Limitation of Liability</h2>
          <p>
            Brihati shall not be liable for any indirect or consequential damages
            arising from the use of this website or products.
          </p>
        </section>

        <section>
          <h2>9. Governing Law</h2>
          <p>
            These Terms shall be governed by and interpreted in accordance with
            the laws of India.
          </p>
        </section>

        <section className="contact-box">
          <h2>10. Contact</h2>
          <p>
            Email: <span>support@brihati.in</span>
          </p>
        </section>
      </div>
     </div>
     </div> 

      <Footer />
    </>
  );
};

export default TermsConditions;
