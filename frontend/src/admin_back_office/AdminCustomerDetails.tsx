import React from "react";
import "./styles/AdminCustomerDetails.css";

export default function AdminCustomerDetails() {
  return (
    <div className="adm-cst-dtls-wrapper">

      {/* ================= ACCOUNT SECTION ================= */}
      <div className="adm-cst-dtls-account-section">

        {/* LEFT PROFILE CARD */}
        <div className="adm-cst-dtls-profile-card">
          <img
            src="https://i.pravatar.cc/150?img=44"
            alt="profile"
            className="adm-cst-dtls-profile-img"
          />

          <h3>Jassica Josoph</h3>
          <p className="adm-cst-dtls-id">ID 112234478</p>

          <div className="adm-cst-dtls-contact">
            <p>📍 Bangalore, Karnataka</p>
            <p>✉ jassicajoseph@gmail.com</p>
            <p>📞 +91 8973525354</p>
          </div>
        </div>

        {/* RIGHT DETAILS */}
        <div className="adm-cst-dtls-details-card">

          <div className="adm-cst-dtls-details-header">
            <h3>ACCOUNT DETAILS</h3>
            <div className="adm-cst-dtls-actions">
              <span>✏</span>
              <span>🗑</span>
            </div>
          </div>

          <div className="adm-cst-dtls-details-grid">

            {/* Account Info */}
            <div className="adm-cst-dtls-box">
              <div><b>First Name:</b> Jassica</div>
              <div><b>Last Name:</b> Josoph</div>
              <div><b>Date Of Birth:</b> 15/10/1999</div>
              <div><b>Gender:</b> Female</div>
            </div>

            {/* Meta Info */}
            <div className="adm-cst-dtls-box">
              <div><b>Registered Date</b><br/>15/04/2026</div>
              <div><b>Usage</b><br/>Visited 03 Hours Spent: 2 hrs</div>
            </div>

          </div>

          {/* Shipping Details */}
          <div className="adm-cst-dtls-shipping-wrapper">

            <div className="adm-cst-dtls-ship-box">
              <h4>SHIPPING DETAILS</h4>
              <p><b>Address:</b> Plot 204, Green Heights Apartment</p>
              <p><b>Landmark:</b> Near Kalmandir Bus Stop</p>
              <p><b>City:</b> Bangalore</p>
              <p><b>State:</b> Karnataka</p>
              <p><b>PIN Code:</b> 560037</p>
            </div>

            <div className="adm-cst-dtls-ship-box">
              <h4>BILLING DETAILS</h4>
              <p><b>Address:</b> Plot 204, Green Heights Apartment</p>
              <p><b>Landmark:</b> Near Kalmandir Bus Stop</p>
              <p><b>City:</b> Bangalore</p>
              <p><b>State:</b> Karnataka</p>
              <p><b>PIN Code:</b> 560037</p>
            </div>
          </div>

        </div>
      </div>

      {/* ================= ORDER HISTORY ================= */}
      <div className="adm-cst-dtls-history-section">

        <h3 className="adm-cst-dtls-section-title">ORDER HISTORY</h3>

        <div className="adm-cst-dtls-order-card">

          <img
            src="https://images.unsplash.com/photo-1609501676725-7186f7b68b3b"
            alt="product"
          />

          <div className="adm-cst-dtls-order-info">
            <h4>Fox Tail Millets</h4>
            <p>250g</p>
            <p>Qty: 1</p>
            <span className="adm-cst-dtls-order-id">
              Order ID: #12344443
            </span>
          </div>

          <div className="adm-cst-dtls-status">
            <span>Order delivered</span>
            <small>2-Dec-2025</small>
          </div>

        </div>

        <div className="adm-cst-dtls-seeall">See All..</div>
      </div>

      {/* ================= WISHLIST ================= */}
      <div className="adm-cst-dtls-wishlist-section">

        <h3 className="adm-cst-dtls-section-title">
          ❤️ WISHLIST
        </h3>

        <div className="adm-cst-dtls-wishlist-row">

          {[
            { name: "Peri-Peri Makhana", price: 235 },
            { name: "Jaggery Pan", price: 150 },
            { name: "Raw Honey", price: 350 },
            { name: "Pumpkin Seeds", price: 125 },
            { name: "Green Tea", price: 125, out: true }
          ].map((item, index) => (
            <div key={index} className="adm-cst-dtls-wishlist-card">
              <img src="https://via.placeholder.com/100" alt="product" />
              <p>{item.name}</p>
              <h4>₹ {item.price}</h4>
              <button className={item.out ? "out" : ""}>
                {item.out ? "Out Of Stock" : "In Stock"}
              </button>
            </div>
          ))}

        </div>
      </div>

    </div>
  );
}