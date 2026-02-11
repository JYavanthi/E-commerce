import React from "react";
import "./styles/sidebar.css";

const Sidebar = () => {
  return (
    <aside className="ad-sidebar">
      <div className="ad-logo">brihati</div>

      <ul className="ad-menu">
        <li className="ad-active"><i className="fa-solid fa-house"></i>Dashboard</li>
        <li><i className="fa-solid fa-users"></i>Customers</li>
        <li><i className="fa-solid fa-cart-shopping"></i>Products</li>
        <li><i className="fa-solid fa-indian-rupee-sign"></i>Payments</li>
        <li><i className="fa-solid fa-box"></i>Orders</li>
        <li><i className="fa-solid fa-message"></i>Chats</li>
        <li><i className="fa-solid fa-calendar"></i>Calender</li>
        <li><i className="fa-solid fa-rotate-left"></i>Refunds</li>
        <li><i className="fa-solid fa-percent"></i>Discounts</li>
      </ul>

      <div className="ad-bottom">
        <span><i className="fa-solid fa-gear"></i>Settings</span>
        <span><i className="fa-solid fa-right-from-bracket"></i>Log Out</span>
      </div>
    </aside>
  );
};

export default Sidebar;
