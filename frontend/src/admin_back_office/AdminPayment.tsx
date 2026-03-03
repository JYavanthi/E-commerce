import React from "react";
import Sidebar from "./sidebar";
import Header from "./topbar";
import Charts from "./components/Charts";
import "./styles/AdminPayment.css";

const AdminPayment = () => {
  return (
    <div className="admin-layout">
      <Sidebar />

      <div className="admin-main">
        <Header />

        {/* <div className="adm-pay-wrapper"> */}

          {/* PAGE TITLE */}
          <div className="adm-pay-title-row">
            <h2 className="adm-pay-page-title">PAYMENT PAGE</h2>
          </div>

          <div className="adm-pay-card">

            {/* Transactions Header */}
            <div className="adm-pay-transactions-header">
              {/* <button className="adm-pay-viewall-btn">
                View All ▼
              </button> */}
            </div>

            {/* Charts Section */}
            <div className="adm-pay-charts-section">
              <Charts />
            </div>

            {/* TABLE */}
            <div className="adm-pay-table-wrapper">
                <h3>Transactions</h3>
              <table className="adm-pay-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer Name</th>
                    <th>Customer ID</th>
                    <th>Transaction Method</th>
                    <th>Transaction Date</th>
                    <th>Amount Total</th>
                    <th>Payment Status</th>
                  </tr>
                </thead>

                <tbody>
                  {[1,2,3,4,5,6,7,8,9,10].map((item) => (
                    <tr key={item}>
                      <td>#23456</td>
                      <td>Rakesh</td>
                      <td>#123456</td>
                      <td>UPI Payment</td>
                      <td>06-Feb-2026</td>
                      <td className="adm-pay-amount">Rs. 500</td>
                      <td>
                        <span className="adm-pay-status completed">
                          Completed
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="adm-pay-pagination">
              <span>{"<<"}</span>
              <span>{"<"}</span>
              <span className="active">2</span>
              <span>3</span>
              <span>4</span>
              <span>5</span>
              <span>{">"}</span>
              <span>{">>"}</span>
            </div>

          </div>
        {/* </div> */}
      </div>
    </div>
  );
};

export default AdminPayment;