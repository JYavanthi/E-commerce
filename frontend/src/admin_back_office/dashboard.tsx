// import React from "react";
// import Sidebar from "./sidebar";
// import Header from "./topbar";
// import "./styles/dashboard.css";
// import Charts from "./components/charts";

// const Dashboard = () => {
//   return (
//     <div className="ad-app">
//       <Sidebar />

//       <main className="ad-main">
//         <Header />
//         <h2 className="ad-welcome">Hello, Madhusudan! Look at your store</h2>

//         <div className="ad-dshbrd">
//            {/* CARDS */}
//         <div className="ad-cards">
//           <div className="ad-card green">₹24,500 <small>Annual Revenue</small></div>
//           <div className="ad-card purple">₹40,000 <small>Monthly Revenue</small></div>
//           <div className="ad-card yellow">1400+ <small>Total Orders</small></div>
//           <div className="ad-card red">200+ <small>Product Refunds</small></div>
//         </div>

//         {/* CHARTS */}
//         <div className="ad-content">
//           <div className="ad-box ad-graph-box">
//             <Charts />
//           </div>
//         </div>

//         {/* TRANSACTIONS AND TRAFFIC SOURCES */}
//         <div className="ad-table-content"> 
//           <div className="ad-table-box">
//             <div className="table-header">
//               <h3>Transactions</h3>
//               <button className="view-btn">View All</button>
//             </div>

//             <table className="ad-table">
//               <thead>
//                 <tr>
//                   <th>Order ID</th>
//                   <th>Customer Name</th>
//                   <th>Customer ID</th>
//                   <th>Payment Mode</th>
//                   <th>Payment Date</th>
//                   <th>Total Amount</th>
//                   <th>Payment Status</th>
//                 </tr>
//               </thead>

//               <tbody>
//                 <tr>
//                   <td>#123456</td>
//                   <td>Rushi</td>
//                   <td>UPI</td>
//                   <td>06-Feb-2026</td>
//                   <td>₹500</td>
//                   <td><span className="status completed">Completed</span></td>
//                 </tr>

//                 <tr>
//                   <td>#123457</td>
//                   <td>Akhil</td>
//                   <td>Card</td>
//                   <td>06-Feb-2026</td>
//                   <td>₹800</td>
//                   <td><span className="status pending">Pending</span></td>
//                 </tr>

//                 <tr>
//                   <td>#123458</td>
//                   <td>Sneha</td>
//                   <td>UPI</td>
//                   <td>06-Feb-2026</td>
//                   <td>₹1200</td>
//                   <td><span className="status failed">Failed</span></td>
//                 </tr>
//               </tbody>
//             </table>
//           </div>

//           {/* TRAFFIC SOURCES */}
//           <div className="ad-table-box-2">
//             <div className="table-header">
//               <h3>Traffic Sources</h3>
//             </div>

//             <div className="traffic-sources">
//               <div className="traffic-item">
//                 <div className="traffic-info">
//                   <span className="traffic-name">Google</span>
//                   <div className="traffic-bar">
//                     <div className="traffic-progress google-bar" style={{width: '70%'}}></div>
//                   </div>
//                 </div>
//                 <span className="traffic-count">3,450</span>
//               </div>

//               <div className="traffic-item">
//                 <div className="traffic-info">
//                   <span className="traffic-name">Advertising</span>
//                   <div className="traffic-bar">
//                     <div className="traffic-progress advertising-bar" style={{width: '51%'}}></div>
//                   </div>
//                 </div>
//                 <span className="traffic-count">2,548</span>
//               </div>

//               <div className="traffic-item">
//                 <div className="traffic-info">
//                   <span className="traffic-name">Direct</span>
//                   <div className="traffic-bar">
//                     <div className="traffic-progress direct-bar" style={{width: '46%'}}></div>
//                   </div>
//                 </div>
//                 <span className="traffic-count">2,203</span>
//               </div>

//               <div className="traffic-item">
//                 <div className="traffic-info">
//                   <span className="traffic-name">Referral</span>
//                   <div className="traffic-bar">
//                     <div className="traffic-progress referral-bar" style={{width: '37%'}}></div>
//                   </div>
//                 </div>
//                 <span className="traffic-count">1,850</span>
//               </div>

//               <div className="traffic-item">
//                 <div className="traffic-info">
//                   <span className="traffic-name">Instagram</span>
//                   <div className="traffic-bar">
//                     <div className="traffic-progress instagram-bar" style={{width: '18%'}}></div>
//                   </div>
//                 </div>
//                 <span className="traffic-count">890</span>
//               </div>

//               <div className="traffic-item">
//                 <div className="traffic-info">
//                   <span className="traffic-name">Facebook</span>
//                   <div className="traffic-bar">
//                     <div className="traffic-progress facebook-bar" style={{width: '10%'}}></div>
//                   </div>
//                 </div>
//                 <span className="traffic-count">500</span>
//               </div>
//             </div>
//           </div>
//         </div>
        
//       </div>

//       </main>
//     </div>
//   );
// };

// export default Dashboard;
import React, { useEffect, useState } from "react";
import Sidebar from "./sidebar";
import Header from "./topbar";
import "./styles/dashboard.css";
import Charts from "./components/charts";

interface Payment {
  OrderID: number;
  UserID: number;
  CustomerName: string;
  PaymentMode: string;
  OrderDate: string;
  TotalAmount: number;
  PaymentStatus: string;
  InvoiceNo: string;
}

const Dashboard = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    fetch("http://localhost:4000/api/admin/payments")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setPayments(data.data);
        } else {
          setError(data.message || "Failed to fetch payments");
        }
      })
      .catch((err) => {
        console.error("Dashboard payment fetch error:", err);
        setError("Server error while fetching payments");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="ad-app">
      <Sidebar />

      <main className="ad-main">
        <Header />
        <h2 className="ad-welcome">
          Hello, Madhusudan! Look at your store
        </h2>

        <div className="ad-dshbrd">
          {/* CARDS */}
          <div className="ad-cards">
            <div className="ad-card green">
              ₹24,500 <small>Annual Revenue</small>
            </div>
            <div className="ad-card purple">
              ₹40,000 <small>Monthly Revenue</small>
            </div>
            <div className="ad-card yellow">
              1400+ <small>Total Orders</small>
            </div>
            <div className="ad-card red">
              200+ <small>Product Refunds</small>
            </div>
          </div>

          {/* CHART */}
          <div className="ad-content">
            <div className="ad-box ad-graph-box">
              <Charts />
            </div>
          </div>

          {/* TRANSACTION TABLE */}
          <div className="ad-table-content">
            <div className="ad-table-box">
              <div className="table-header">
                <h3>Transactions</h3>
                <button className="view-btn">View All</button>
              </div>

              <table className="ad-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Cust Name</th>
                    <th>Cust ID</th>
                    <th>Mode</th>
                    <th>Date</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={7} style={{ textAlign: "center" }}>
                        Loading payments...
                      </td>
                    </tr>
                  ) : error ? (
                    <tr>
                      <td colSpan={7} style={{ textAlign: "center" }}>
                        {error}
                      </td>
                    </tr>
                  ) : payments.length === 0 ? (
                    <tr>
                      <td colSpan={7} style={{ textAlign: "center" }}>
                        No payments found
                      </td>
                    </tr>
                  ) : (
                    payments.slice(0, 5).map((item) => (
                      <tr key={item.OrderID}>
                        <td>#{item.OrderID}</td>
                        <td>{item.CustomerName}</td>
                        <td>#{item.UserID}</td>
                        <td>{item.PaymentMode}</td>
                        <td>
                          {new Date(item.OrderDate).toLocaleDateString("en-IN")}
                        </td>
                        <td>₹{item.TotalAmount}</td>
                        <td>
                          <span
                            className={`pay-status ${item.PaymentStatus.toLowerCase()}`}
                          >
                            {item.PaymentStatus}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* TRAFFIC SECTION */}
            <div className="ad-table-box-2">
              <div className="table-header">
                <h3>Traffic Sources</h3>
              </div>

              <div className="traffic-sources">
                {/* Your existing UI */}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;