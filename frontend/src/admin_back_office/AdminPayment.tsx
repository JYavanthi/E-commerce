import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./sidebar";
import Header from "./topbar";
import Charts from "./components/Charts";
import "./styles/AdminPayment.css";

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

const AdminPayment = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
   const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:4000/api/admin/payments")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setPayments(data.data);
        }
      })
      .catch((err) => console.error("Payment fetch error:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="admin-layout">
      <Sidebar />

      <div className="admin-main">
        <Header />

        {/* PAGE TITLE */}
        <div className="adm-pay-title-row">
          <h2 className="adm-pay-page-title">PAYMENT PAGE</h2>
        </div>

        <div className="adm-pay-card">

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
                  <th>Payment Mode</th>
                  <th>Payment Date</th>
                  <th>Total Amount</th>
                  <th>Payment Status</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: "center" }}>
                      Loading...
                    </td>
                  </tr>
                ) : payments.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: "center" }}>
                      No payments found
                    </td>
                  </tr>
                ) : (
                  payments.map((item) => (
                    <tr key={item.OrderID} onClick={() =>
                    navigate(`/AdminPaymentDetails/${item.OrderID}`, {
                      state: item,
                    })
                  } style={{ cursor: "pointer" }}>
                      <td>#{item.OrderID}</td>
                      <td>{item.CustomerName}</td>
                      <td>#{item.UserID}</td>
                      <td>{item.PaymentMode}</td>
                      <td>
                        {new Date(item.OrderDate).toLocaleDateString("en-IN")}
                      </td>
                      <td className="adm-pay-amount">
                        Rs. {item.TotalAmount}
                      </td>
                      <td>
                        <span
                          className={`adm-pay-status ${item.PaymentStatus}`}
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

          {/* Pagination (Static for now) */}
          <div className="adm-pay-pagination">
            <span>{"<<"}</span>
            <span>{"<"}</span>
            <span className="active">1</span>
            <span>2</span>
            <span>3</span>
            <span>{">"}</span>
            <span>{">>"}</span>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AdminPayment;