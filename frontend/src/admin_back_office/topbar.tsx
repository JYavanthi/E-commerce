import React from "react";
import "./styles/topbar.css";

const Header = () => {
  return (
    <>
      <div className="ad-topbar">
        <input type="text" placeholder="Search Anything..." />
        <div className="ad-profile">Madhusudan ▾</div>
      </div>

      <h2 className="ad-welcome">Hello, Madhusudan! Look at your store</h2>
    </>
  );
};

export default Header;
