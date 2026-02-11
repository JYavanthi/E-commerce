import "../styles/navbar.css";
import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import { toast } from "react-hot-toast";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { wishlistItems } = useWishlist();
  const { cartItems} = useCart();
  const navigate = useNavigate();
  const location = useLocation();
   const isCartPage = location.pathname === "/cart";

  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /** ✅ FIXED NAV HANDLER */
  const handleNavClick = (sectionId: string) => {
    setMenuOpen(false);

    if (location.pathname !== "/") {
      // Navigate to home first
      navigate("/", { state: { scrollTo: sectionId } });
    } else {
      // Already on home → scroll directly
      const section = document.getElementById(sectionId);
      section?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className={`navbar-wrapper ${isCartPage ? "cart-navbar" : ""}`}>
      <div className="top-strip">
        SERVING GLOBALLY • CLEAN-LABEL FOODS FOR DIABETES, WELLNESS & EVERYDAY HEALTH
      </div>

      <nav className="navbar">
        {/* LOGO */}
        <div className="left-section" onClick={() => handleNavClick("home")}>
          <div className="logo-circle">B</div>
          <div className="logo-text">
            <h2>BRIHATI</h2>
            <p>FEEDING THE FUTURE</p>
          </div>
        </div>

        {/* NAV LINKS */}
        <ul className={`nav-links ${menuOpen ? "active" : ""}`}>
          <li onClick={() => handleNavClick("home")}>HOME</li>
          <li onClick={() => navigate("/categoryProductPage")}>PRODUCTS</li>
          <li onClick={() => handleNavClick("about")}>ABOUT</li>
          <li onClick={() => handleNavClick("mission")}>MISSION</li>
          <li onClick={() => handleNavClick("contact")}>CONTACT</li>
        </ul>

         <div className="nav-actions">
          <div className="nav-search">
            <input type="text" placeholder="Search products" />
            <span className="search-icon">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </span>
          </div>

          <div className="nav-icons">
          {/* Profile */}
            <div className="profile-wrapper" ref={profileRef}>
    <div
      className="icon"
      onClick={() => setProfileOpen(!profileOpen)}
    >
      <svg
        width="26"
        height="26"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <circle cx="12" cy="8" r="4" />
        <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
      </svg>
    </div>

    {profileOpen && (
      <div className="profile-dropdown">
        <button
          onClick={() => {
            navigate("/login");
            setProfileOpen(false);
          }}
        >
          Log In
        </button>

        <button
          onClick={() => {
            const user = localStorage.getItem("user");

            if (!user) {
              toast.error("Please login to view your profile");
              setTimeout(() => navigate("/login"), 1200);
            } else {
              navigate("/profile");
            }

            setProfileOpen(false);
          }}
        >
          Profile
        </button>
      </div>
    )}
  </div>

          {/* Wishlist */}
          <div className="icon" onClick={() => navigate("/wishlist")}>
            <span className="wshlst-count">{wishlistItems.length}</span>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M20.8 4.6c-1.5-1.4-3.9-1.4-5.4 0L12 8l-3.4-3.4c-1.5-1.4-3.9-1.4-5.4 0-1.6 1.5-1.6 4 0 5.5L12 21l8.8-10.9c1.6-1.5 1.6-4 0-5.5z" />
            </svg>
          </div>

          {/* Cart */}
           {!isCartPage && (
              <div className="icon badge" onClick={() => navigate("/cart")}>
                <span className="count">{cartItems.length}</span>
                 <svg
                  width="26"
                  height="26"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <circle cx="9" cy="21" r="1" />
                  <circle cx="20" cy="21" r="1" />
                  <path d="M1 1h4l2.6 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6" />
                </svg>
              </div>
            )}
           
        </div>

        {/* Hamburger */}
        <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          ☰
        </div>
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
