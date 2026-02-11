import "./styles/signup.css";
import React, { useState } from "react";
import plant from "../src/assets/plant.jpg";
import ggl from "../src/assets/ggl.png";
import fcbk from "../src/assets/fcbk.png";
import { useNavigate } from "react-router-dom";
import { API_URLS  } from "../src/API-Urls";

export default function Signup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    Phone: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  // handle input change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  const payload = {
    RoleID: 1,
    FirstName: formData.name,
    LastName: "",
    Email: formData.email,
    ContactNo: formData.Phone,
    DOB: null,
    Gender: null,
    PasswordHash: formData.password,
    Status: 1,
    CreatedBy: 1,
  };

  try {
    const response = await fetch(
      `${API_URLS.BASE_URL}${API_URLS.USERS}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    const data = await response.json();

    // 🔁 RECOVERY FLOW
    if (data.recover) {
      const confirmRecover = window.confirm(data.message);

      if (confirmRecover) {
        // recover api
        await fetch(
          `${API_URLS.BASE_URL}users/${data.userData.UserID}/recover`,
          { method: "PUT" }
        );

        // autofill
        setFormData({
          name: data.userData.FirstName,
          Phone: data.userData.ContactNo,
          email: data.userData.Email,
          password: ""
        });

        alert("Account recovered. Please login.");
        navigate("/login");
        return;
      } else {
        alert("Please use different email/phone to create new account.");
        return;
      }
    }

    if (!response.ok) {
      alert(data.message || "Signup failed");
      return;
    }

    alert("✅ Signup successful!");
    navigate("/login");

  } catch (error) {
    console.error("❌ Signup Error:", error);
    alert("Server error");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="signup-page">
      <button className="back-home" onClick={() => navigate("/")}>
        Back to Home
      </button>

      <div className="signup-card">
        {/* LEFT */}
        <div className="signup-left">
          <h2>
            Where <span>Healthy</span> Living <br /> Begins!
          </h2>
          <img src={plant} alt="Healthy plant" className="plant-img" />
        </div>

        {/* RIGHT */}
        <div className="signup-right">
          <h2>
            Sign <span className="up">Up</span>
          </h2>

          <form onSubmit={handleSubmit}>
            <label>Name</label>
            <input
              id="name"
              type="text"
              placeholder="Enter your Name"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <label> Phone</label>
            <input
              id="Phone"
              type="text"
              placeholder="Enter your Contact No"
              value={formData.Phone}
              onChange={handleChange}
              required
            />

            <label> Email</label>
            <input
              id="email"
              type="text"
              placeholder="Enter your Email id"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <label>Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <button type="submit" className="signup-btn" disabled={loading}>
              {loading ? "Signing Up..." : "Sign Up"}
            </button>

            <div className="divider">------ O R ------</div>

            <div className="social-login">
              <button type="button" className="google">
                <img src={ggl} alt="" /> Google
              </button>
              <button type="button" className="facebook">
                <img src={fcbk} alt="" /> Facebook
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}