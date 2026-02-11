// import "./styles/profile.css";
// import Navbar from "./Navbar/navbar";
// import Footer from "./footer";
// import { useNavigate } from "react-router-dom";
// import { useEffect, useState } from "react";
// import { API_URLS } from "../src/API-Urls";

// /* =========================
//    TYPES
// ========================= */

// interface User {
//   UserID: number;
//   FirstName: string;
//   Email: string;
//   ContactNo: string;
// }

// interface OrderItem {
//   productName: string;
//   qty: number;
//   price: number;
//   weight: string;
//   imageUrl: string;
// }

// interface Order {
//   orderId: number;
//   orderDate: string;
//   orderStatus: string;
//   paymentStatus: string;
//   items: OrderItem[];
// }

// /* =========================
//    COMPONENT
// ========================= */

// const Profile = () => {
//   const navigate = useNavigate();

//   const [user, setUser] = useState<User | null>(null);
//   const [orders, setOrders] = useState<Order[]>([]);
//   const [loading, setLoading] = useState(true);

//   /* =========================
//      INIT
//   ========================= */

//   useEffect(() => {
//     const storedUser = JSON.parse(localStorage.getItem("user") || "null");

//     if (!storedUser?.UserID) {
//       navigate("/");
//       return;
//     }

//     getUserProfileById(storedUser.UserID);
//     getUserOrders(storedUser.UserID);
//   }, []);

//   /* =========================
//      API CALLS
//   ========================= */

//   const getUserProfileById = async (userId: number) => {
//     try {
//       const response = await fetch(
//         `${API_URLS.BASE_URL}${API_URLS.USERS}/${userId}`
//       );

//       const result = await response.json();

//       if (result.success) {
//         setUser(result.data);
//       }
//     } catch (error) {
//       console.error("❌ Error fetching profile:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getUserOrders = async (userId: number) => {
//     try {
//       const res = await fetch(`http://localhost:4000/api/orders/user/${userId}`);
//       const data = await res.json();

//       if (data.success) {
//         setOrders(data.data);
//       }
//     } catch (err) {
//       console.error("❌ Order fetch error:", err);
//     }
//   };

//   /* =========================
//      UI
//   ========================= */

//   return (
//     <>
//       <Navbar />
//       <div className="profile-page">

//         {/* HEADER */}
//         <div className="profile-header">
//           {loading ? (
//             <h2>Loading...</h2>
//           ) : (
//             <>
//               <h2>{user?.FirstName}</h2>
//               <p>{user?.Email}</p>
//               <p>{user?.ContactNo}</p>
//             </>
//           )}
//         </div>

//         <div className="profile-content">

//           {/* SIDEBAR */}
//           <div className="profile-sidebar">
//             <button className="active">MY ORDERS</button>
//             <button onClick={() => navigate("/address")}>SAVED ADDRESS</button>
//             <button onClick={() => navigate("/t&c")}>TERMS & CONDITIONS</button>
//             <button onClick={() => navigate("/privacy-policy")}>PRIVACY POLICY</button>

//             <button
//               className="logout-btn"
//               onClick={() => {
//                 const confirmLogout = window.confirm("Do you want to logout?");
//                 if (confirmLogout) {
//                   localStorage.clear();
//                   navigate("/");
//                 }
//               }}
//             >
//               LOG OUT
//             </button>

//             <button className="delete-btn">DELETE ACCOUNT</button>
//           </div>

//           {/* ORDERS */}
//           <div className="orders-section">

//             {orders.length === 0 && (
//               <p style={{ padding: "20px" }}>No orders yet</p>
//             )}

//             {orders.map(order => (
//               <div key={order.orderId} className="order-box">

//                 {order.items.map((item, idx) => (
//                   <div className="order-card" key={idx}>
//                     <img src={item.imageUrl} alt={item.productName} />

//                     <div className="order-info">
//                       <h3>{item.productName}</h3>
//                       <p>{item.weight}</p>
//                       <p><strong>Qty:</strong> {item.qty}</p>
//                     </div>

//                     <div className="order-status">
//                       <span className="delivered">
//                         {order.orderStatus === "DELIVERED"
//                           ? "Order delivered"
//                           : order.orderStatus}
//                       </span>
//                       <p>{order.orderDate}</p>
//                     </div>
//                   </div>
//                 ))}

//                 <div className="order-footer">
//                   <p>
//                     Order ID : <strong>#{order.orderId}</strong>
//                   </p>

//                   {/* <a
//                     onClick={() =>
//                       window.open(`http://localhost:4000/api/order/${order.orderId}/invoice`)
//                     }
//                   >
//                     Download Invoice
//                   </a> */}
//                   <a
//   href={`http://localhost:4000/api/order/${order.orderId}/invoice`}
//   download
// >
//   Download Invoice
// </a>
//                 </div>

//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//       <Footer />
//     </>
//   );
// };

// export default Profile;

import "./styles/profile.css";
import Navbar from "./Navbar/navbar";
import Footer from "./footer";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { API_URLS } from "../src/API-Urls";

/* =========================
   TYPES
========================= */

interface User {
  UserID: number;
  FirstName: string;
  Email: string;
  ContactNo: string;
}

interface OrderItem {
  productName: string;
  qty: number;
  price: number;
  weight: string;
  imageUrl: string;
}

interface Order {
  orderId: number;
  orderDate: string;
  orderStatus: string;
  paymentStatus: string;
  items: OrderItem[];
}

/* =========================
   COMPONENT
========================= */

const Profile = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  /* =========================
     INIT
  ========================= */

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "null");

    if (!storedUser?.UserID) {
      navigate("/");
      return;
    }

    getUserProfileById(storedUser.UserID);
    getUserOrders(storedUser.UserID);
  }, []);

  /* =========================
     API CALLS
  ========================= */

  const getUserProfileById = async (userId: number) => {
    try {
      const response = await fetch(
        `${API_URLS.BASE_URL}${API_URLS.USERS}/${userId}`
      );

      const result = await response.json();

      if (result.success) {
        setUser(result.data);
      }
    } catch (error) {
      console.error("❌ Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const getUserOrders = async (userId: number) => {
    try {
      const res = await fetch(`http://localhost:4000/api/orders/user/${userId}`);
      const data = await res.json();

      if (data.success) {
        setOrders(data.data);
      }
    } catch (err) {
      console.error("❌ Order fetch error:", err);
    }
  };

  /* =========================
     DELETE ACCOUNT
  ========================= */

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm(
      "⚠️ Are you sure you want to delete your account?\nThis action can be recovered later."
    );

    if (!confirmDelete) return;

    try {
      const userId = localStorage.getItem("userId");

      if (!userId) {
        alert("User not found");
        return;
      }

      const res = await fetch(
        `${API_URLS.BASE_URL}users/${userId}/delete`,
        { method: "PUT" }
      );

      const data = await res.json();

      if (data.success) {
        localStorage.clear();
        alert("✅ Account deleted successfully");
        navigate("/signup");
      } else {
        alert("❌ Failed to delete account");
      }

    } catch (error) {
      console.error("❌ Delete error:", error);
      alert("Server error while deleting account");
    }
  };

  /* =========================
     UI
  ========================= */

  return (
    <>
      <Navbar />
      <div className="profile-page">

        {/* HEADER */}
        <div className="profile-header">
          {loading ? (
            <h2>Loading...</h2>
          ) : (
            <>
              <h2>{user?.FirstName}</h2>
              <p>{user?.Email}</p>
              <p>{user?.ContactNo}</p>
            </>
          )}
        </div>

        <div className="profile-content">

          {/* SIDEBAR */}
          <div className="profile-sidebar">
            <button className="active">MY ORDERS</button>
            <button onClick={() => navigate("/address")}>SAVED ADDRESS</button>
            <button onClick={() => navigate("/t&c")}>TERMS & CONDITIONS</button>
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

            {/* 🔥 DELETE ACCOUNT */}
            <button className="delete-btn" onClick={handleDeleteAccount}>
              DELETE ACCOUNT
            </button>
          </div>

          {/* ORDERS */}
          <div className="orders-section">

            {orders.length === 0 && (
              <p style={{ padding: "20px" }}>No orders yet</p>
            )}

            {orders.map(order => (
              <div key={order.orderId} className="order-box">

                {order.items.map((item, idx) => (
                  <div className="order-card" key={idx}>
                    <img src={item.imageUrl} alt={item.productName} />

                    <div className="order-info">
                      <h3>{item.productName}</h3>
                      <p>{item.weight}</p>
                      <p><strong>Qty:</strong> {item.qty}</p>
                    </div>

                    <div className="order-status">
                      <span className="delivered">
                        {order.orderStatus === "DELIVERED"
                          ? "Order delivered"
                          : order.orderStatus}
                      </span>
                      <p>{order.orderDate}</p>
                    </div>
                  </div>
                ))}

                <div className="order-footer">
                  <p>
                    Order ID : <strong>#{order.orderId}</strong>
                  </p>

                  <a
                    href={`http://localhost:4000/api/order/${order.orderId}/invoice`}
                    download
                  >
                    Download Invoice
                  </a>
                </div>

              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Profile;

