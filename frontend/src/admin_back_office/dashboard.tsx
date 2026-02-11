import React from "react";
import Sidebar from "./sidebar";
import Header from "./topbar";
import "./styles/dashboard.css";
import Charts from "./components/charts";

const Dashboard = () => {
  return (
    <div className="ad-app">
      <Sidebar />

      <main className="ad-main">
        <Header />

        
        <div className="ad-cards">
          <div className="ad-card green">₹24,500 <small>Annual Revenue</small></div>
          <div className="ad-card purple">₹40,000 <small>Monthly Revenue</small></div>
          <div className="ad-card yellow">1400+ <small>Total Orders</small></div>
          <div className="ad-card red">200+ <small>Product Refunds</small></div>
        </div>

        
        <div className="ad-content">
          {/* <div className="ad-box">Sales Report (Graph Placeholder)</div>
          <div className="ad-box">Top Selling Products (Chart Placeholder)</div> */}
          <Charts></Charts>
        </div>

        
        <div className="ad-table-box">
          <h3>Transactions</h3>
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Method</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>#123456</td><td>Rushi</td><td>UPI</td>
                <td>06-Feb-2026</td><td>₹500</td>
                <td className="ad-done">Completed</td>
              </tr>
            </tbody>
          </table>
        </div>

      </main>
    </div>
  );
};

export default Dashboard;
