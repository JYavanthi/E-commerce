// import "./styles/login.css";
// import React, { useState } from "react";
// import plant from "../src/assets/plant.jpg";
// import { useNavigate } from "react-router-dom";
// import { API_URLS } from "./API-Urls";

// export default function Login() {
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({ 
//     emailOrPhone: "",
//     password: "",
//   });

//   const [loading, setLoading] = useState(false);

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.id]: e.target.value,
//     });
//   };

//   const handleSubmit = async (e) => {
//   e.preventDefault();
//   setLoading(true);

//   try {
//     const response = await fetch(
//       `${API_URLS.BASE_URL}${API_URLS.LOGIN}`,
//       {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           EmailOrPhone: formData.emailOrPhone,
//           Password: formData.password,
//         }),
//       }
//     );

//     const data = await response.json();

//     //🔥 ACCOUNT DELETED FLOW
//     if (data.code === "ACCOUNT_DELETED") {
//       const confirmRestore = window.confirm(
//         `Hi ${data.userData.FirstName}, your account is deleted.\nDo you want to restore it?`
//       );

//       if (confirmRestore) {
//         // restore API
//         await fetch(
//           `${API_URLS.BASE_URL}users/${data.userId}/recover`,
//           { method: "PUT" }
//         );

//         alert("✅ Account restored! Please login again.");
//         navigate("/login");
//       }

//       setLoading(false);
//       return;
//     }

//     // ❌ normal errors
//     if (!response.ok) {
//       alert(data.message || "Login failed");
//       setLoading(false);
//       return;
//     }

//     // ✅ SUCCESS
//     localStorage.setItem("userId", data.user.UserID.toString());
//     localStorage.setItem("user", JSON.stringify(data.user));

//     alert("✅ Login successful!");
//     navigate("/");

//   } catch (error) {
//     console.error("❌ Login Error:", error);
//     alert("Server error. Please try again.");
//   } finally {
//     setLoading(false);
//   }
// };

//   return (
//     <div className="login-page">
//       <div className="login-card">

//         {/* LEFT */}
//         <div className="login-left">
//           <h2>
//             Where <span>Healthy</span> Living <br /> Begins!
//           </h2>
//           <img src={plant} alt="Healthy plant" className="plant-img" />
//         </div>

//         {/* RIGHT */}
//         <div className="login-right">
//           <h2>Welcome Back</h2>

//           <form onSubmit={handleSubmit}>
//             <label>Email / Phone No.</label>
//             <input
//               id="emailOrPhone"
//               type="text"
//               placeholder="Enter your Email or Phone"
//               value={formData.emailOrPhone}
//               onChange={handleChange}
//               required
//             />

//             <label>Password</label>
//             <input
//               id="password"
//               type="password"
//               placeholder="Enter your password"
//               value={formData.password}
//               onChange={handleChange}
//               required
//             />

//             <div className="login-options">
//               <label>
//                 <input type="checkbox" /> Remember Me
//               </label>
//               <span className="forgot">Forgot Password</span>
//             </div>

//             <button type="submit" className="login-btn" disabled={loading}>
//               {loading ? "Logging In..." : "Log In"}
//             </button>

//             <p className="signup-link">
//               Don't Have An Account?{" "}
//               <button className="signup" onClick={() => navigate("/signup")}>Sign Up</button>
//             </p>
//           </form>
//         </div>

//       </div>
//     </div>
//   );
// }

import "./styles/login.css";
import React, { useState } from "react";
import plant from "../src/assets/plant.jpg";
import { useNavigate } from "react-router-dom";
import { API_URLS } from "./API-Urls";

export default function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ 
    emailOrPhone: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: any) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(
        `${API_URLS.BASE_URL}${API_URLS.LOGIN}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            EmailOrPhone: formData.emailOrPhone,
            Password: formData.password,
          }),
        }
      );

      const data = await response.json();

      //🔥 ACCOUNT DELETED FLOW
      if (data.code === "ACCOUNT_DELETED") {
        const confirmRestore = window.confirm(
          `Hi ${data.userData.FirstName}, your account is deleted.\nDo you want to restore it?`
        );

        if (confirmRestore) {
          // restore API
          await fetch(
            `${API_URLS.BASE_URL}users/${data.userId}/recover`,
            { method: "PUT" }
          );

          alert("✅ Account restored! Please login again.");
          navigate("/login");
        }

        setLoading(false);
        return;
      }

      // ❌ normal errors
      if (!response.ok) {
        alert(data.message || "Login failed");
        setLoading(false);
        return;
      }

      // ✅ SUCCESS LOGIN
      localStorage.setItem("userId", data.user.UserID.toString());
      localStorage.setItem("user", JSON.stringify(data.user));

      const roleId = data.user.RoleID;   // 🔥 role from backend

      alert("✅ Login successful!");

      // 🔁 ROLE BASED REDIRECT
      if (roleId === 1) {
        navigate("/admin");   // admin_back_office UI
      } else if (roleId === 2) {
        navigate("/");        // customer UI
      } else {
        navigate("/");        // fallback safety
      }

    } catch (error) {
      console.error("❌ Login Error:", error);
      alert("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">

        {/* LEFT */}
        <div className="login-left">
          <h2>
            Where <span>Healthy</span> Living <br /> Begins!
          </h2>
          <img src={plant} alt="Healthy plant" className="plant-img" />
        </div>

        {/* RIGHT */}
        <div className="login-right">
          <h2>Welcome Back</h2>

          <form onSubmit={handleSubmit}>
            <label>Email / Phone No.</label>
            <input
              id="emailOrPhone"
              type="text"
              placeholder="Enter your Email or Phone"
              value={formData.emailOrPhone}
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

            <div className="login-options">
              <label>
                <input type="checkbox" /> Remember Me
              </label>
              <span className="forgot">Forgot Password</span>
            </div>

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? "Logging In..." : "Log In"}
            </button>

            <p className="signup-link">
              Don't Have An Account?{" "}
              <button className="signup" onClick={() => navigate("/signup")}>
                Sign Up
              </button>
            </p>
          </form>
        </div>

      </div>
    </div>
  );
}
