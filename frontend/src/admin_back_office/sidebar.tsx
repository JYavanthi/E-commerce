import React from "react";
import "./styles/sidebar.css";
import { useNavigate, useLocation } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) =>
    location.pathname.startsWith(path) ? "ad-active" : "";

  return (
    <aside className="ad-sidebar">
      <div className="ad-logo">brihati</div>

      <ul className="ad-menu">

        <li
          className={isActive("/admin")}
          onClick={() => navigate("/admin")}
        >
          <i className="fa-solid fa-house"></i> Dashboard
        </li>

        <li
          className={isActive("/AdminCustomers")}
          onClick={() => navigate("/AdminCustomers")}
        >
          <i className="fa-solid fa-users"></i> Customers
        </li>

        <li
          className={isActive("/AdminCategory")}
          onClick={() => navigate("/AdminCategory")}
        >
         <i className="fa-solid fa-layer-group"></i> Category
        </li>

        <li
          className={isActive("/AdminProduct")}
          onClick={() => navigate("/AdminProduct")}
        >
          <i className="fa-solid fa-cart-shopping"></i> Products
        </li>

        <li
          className={isActive("/AdminOrders")}
          onClick={() => navigate("/AdminOrders")}
        >
          <i className="fa-solid fa-box"></i> Orders
        </li>

        <li
          className={isActive("/payments")}
          onClick={() => navigate("/payments")}
        >
          <i className="fa-solid fa-indian-rupee-sign"></i> Payments
        </li>

        <li
          className={isActive("/chats")}
          onClick={() => navigate("/chats")}
        >
          <i className="fa-solid fa-message"></i> Chats
        </li>

        <li
          className={isActive("/calendar")}
          onClick={() => navigate("/calendar")}
        >
          <i className="fa-solid fa-calendar"></i> Calendar
        </li>

        <li
          className={isActive("/refunds")}
          onClick={() => navigate("/refunds")}
        >
          <i className="fa-solid fa-rotate-left"></i> Refunds
        </li>

        <li
          className={isActive("/discounts")}
          onClick={() => navigate("/discounts")}
        >
          <i className="fa-solid fa-percent"></i> Discounts
        </li>

      </ul>

      <div className="ad-bottom">
        <span><i className="fa-solid fa-gear"></i> Settings</span>
        <span><i className="fa-solid fa-right-from-bracket"></i> Log Out</span>
      </div>
    </aside>
  );
};

export default Sidebar;
