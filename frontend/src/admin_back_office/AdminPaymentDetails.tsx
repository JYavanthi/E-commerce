// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import Sidebar from "./sidebar";
// import Header from "./topbar";
// import "./styles/AdminPaymentDetails.css";

// interface OrderItem {
//   ProductName: string;
//   ProductWeight: string;
//   Quantity: number;
//   UnitPrice: number;
//   TotalPrice: number;
// }

// interface Order {
//   orderId: number;
//   userId: number;
//   customerName: string;
//   orderDate: string;
//   paymentMode: string;
//   paymentStatus: string;
//   orderStatus: string;
//   totalAmount: number;
//   taxAmount: number;
//   invoiceNo: string;
//   transactionId: string;
//   items: OrderItem[];
// }

// const AdminPaymentDetails = () => {
//   const { id } = useParams();
//   const [order, setOrder] = useState<Order | null>(null);

//   useEffect(() => {
//     fetch("http://localhost:4000/api/admin/orders")
//       .then(res => res.json())
//       .then(data => {
//         if (data.success) {
//           const selected = data.data.find(
//             (o: Order) => o.orderId === Number(id)
//           );
//           setOrder(selected);
//         }
//       });
//   }, [id]);

//   if (!order) return <div>Loading...</div>;

//   return (
//     <div className="admin-layout">
//       <Sidebar />

//       <div className="admin-main">
//         <Header />

//         <div className="adm-paydtl-wrapper">

//           {/* HEADER */}
//           <div className="adm-paydtl-top">
//             <div className="adm-paydtl-userid">
//               USER ID <br />
//               <strong>#{order.userId}</strong>
//             </div>
//             <h2 className="adm-paydtl-title">Transactions</h2>
//             <div className="adm-paydtl-download">Download Invoice</div>
//           </div>

//           {/* MAIN CARD */}
//           <div className="adm-paydtl-card">

//             {/* LEFT PROFILE */}
//             <div className="adm-paydtl-profile">
//               <div className="adm-paydtl-avatar">
//                 {order.customerName?.charAt(0)}
//               </div>

//               <h3>{order.customerName}</h3>

//               <p className="adm-paydtl-reg">
//                 Registration Date: {order.orderDate}
//               </p>
//             </div>

//             {/* RIGHT CONTENT */}
//             <div className="adm-paydtl-content">

//               {/* ORDER HEADER */}
//               <div className="adm-paydtl-order-header">
//                 <div>
//                   <strong>Order ID : #{order.orderId}</strong>
//                 </div>
//                 <div>{order.orderDate}</div>
//               </div>

//               {/* ITEMS + SUMMARY */}
//               <div className="adm-paydtl-body">

//                 {/* ITEMS */}
//                 <div className="adm-paydtl-items">
//                   {order.items.map((item, index) => (
//                     <div key={index} className="adm-paydtl-item">
//                       <div className="adm-paydtl-item-img"></div>
//                       <div>
//                         <p>{item.ProductName}</p>
//                         <small>{item.ProductWeight}</small>
//                         <p>Qty: {item.Quantity}</p>
//                       </div>
//                     </div>
//                   ))}
//                 </div>

//                 {/* SUMMARY */}
//                 <div className="adm-paydtl-summary">
//                   <p>
//                     <strong>Total Amount:</strong><br />
//                     <span className="adm-paydtl-amount">
//                       ₹ {order.totalAmount}
//                     </span>
//                   </p>

//                   <p><strong>Invoice Number:</strong> {order.invoiceNo}</p>
//                   <p><strong>Payment Mode:</strong> {order.paymentMode}</p>
//                   <p><strong>Transaction ID:</strong> {order.transactionId}</p>
//                   <p>
//                     <strong>Payment Status:</strong>
//                     <span className="adm-paydtl-status">
//                       {order.paymentStatus}
//                     </span>
//                   </p>
//                 </div>

//               </div>

//               {/* PAYMENT HISTORY */}
//               <div className="adm-paydtl-history">
//                 <h3>Payment History</h3>

//                 <div className="adm-paydtl-history-row">
//                   <span>{order.orderDate}</span>
//                   <span className="adm-paydtl-plus">
//                     + ₹ {order.totalAmount}
//                   </span>
//                 </div>

//               </div>

//             </div>

//           </div>

//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminPaymentDetails;


import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "./sidebar";
import Header from "./topbar";
import user from "../assets/user.png";
import "./styles/AdminPaymentDetails.css";

interface OrderItem {
  ProductName: string;
  ProductWeight: string;
  Quantity: number;
  UnitPrice: number;
  TotalPrice: number;
}

interface Order {
  orderId: number;
  userId: number;
  customerName: string;
  email:string,
  contact:number,
  regdate:number,
  orderDate: string;
  paymentMode: string;
  paymentStatus: string;
  orderStatus: string;
  totalAmount: number;
  taxAmount: number;
  invoiceNo: string;
  transactionId: string;
  items: OrderItem[];
}

const AdminPaymentDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    fetch("http://localhost:4000/api/admin/orders")
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          const selected = data.data.find(
            (o: Order) => o.orderId === Number(id)
          );
          setOrder(selected);
        }
      });
  }, [id]);

  if (!order) return <div>Loading...</div>;

  return (
    <div className="admin-layout">
      <Sidebar />

      <div className="admin-main">
        <Header />

        <div className="adm-paydtl-wrapper">

          {/* TOP HEADER */}
          <div className="adm-paydtl-top">
            <div className="adm-paydtl-userid">
              <span>USER ID : </span>
              <strong>#{order.userId}</strong>
            </div>

            <h2 className="adm-paydtl-title">Transactions</h2>

            <div className="adm-paydtl-download">
              Download Invoice
            </div>
          </div>

          {/* MAIN CARD */}
          <div className="adm-paydtl-card">

            {/* PROFILE SECTION */}
            <div className="adm-paydtl-profile-card">
              <div className="adm-paydtl-personal-header">
                <h4>PERSONAL DETAILS</h4>
              </div>

              <div className="adm-paydtl-dtl-prsnl">
                <img
                  src={user}
                  alt="profile"
                  className="adm-paydtl-profile-img"
                />

              </div>

              {/* <div className="adm-paydtl-contact">
                <p className="adm-paydtl-name">  Name : {order.customerName} </p>
                <p className="adm-paydtl-id">  ID : {order.userId}   </p>
                <p> Email : {order.email}</p>
                <p> Contact : {order.contact}</p>
                <p> Registration date : {new Date(order.regdate).toLocaleString()}</p>
              </div> */}
              <div className="adm-paydtl-contact">
  <div className="adm-paydtl-row">
    <span className="adm-paydtl-key">Name : </span>
    <span className="adm-paydtl-value">{order.customerName}</span>
  </div>

  {/* <div className="adm-paydtl-row">
    <span className="adm-paydtl-key">ID : </span>
    <span className="adm-paydtl-value">{order.userId}</span>
  </div> */}

  <div className="adm-paydtl-row">
    <span className="adm-paydtl-key">Email : </span>
    <span className="adm-paydtl-value">{order.email}</span>
  </div>

  <div className="adm-paydtl-row">
    <span className="adm-paydtl-key">Contact : </span>
    <span className="adm-paydtl-value">{order.contact}</span>
  </div>

  <div className="adm-paydtl-row">
    <span className="adm-paydtl-key">Registration Date :</span>
    <span className="adm-paydtl-value">
      {new Date(order.regdate).toLocaleString()}
    </span>
  </div>
</div>
            </div>

            {/* RIGHT SECTION */}
            <div className="adm-paydtl-content">

              {/* ORDER HEADER */}
              <div className="adm-paydtl-order-header">
                <strong>Order ID :  <span className="paydtl-ord-id">#{order.orderId}</span></strong>
                <span>{order.orderDate}</span>
              </div>

              {/* ITEMS + SUMMARY */}
              <div className="adm-paydtl-body">

                {/* ITEMS */}
                {/* <div className="adm-paydtl-items">
                  {order.items.map((item, index) => (
                    <div key={index} className="adm-paydtl-item">
                      <div className="adm-paydtl-item-img"></div>
                      <div>
                        <p>{item.ProductName}</p>
                        <small>{item.ProductWeight}</small>
                        <p>Qty : {item.Quantity}</p>
                      </div>
                    </div>
                  ))}
                </div> */}

                {/* SUMMARY BOX */}
                {/* <div className="adm-paydtl-summary">
                  <p className="adm-paydtl-total">
                    Total Amount
                    <span>₹ {order.totalAmount}</span>
                  </p>

                  <p><strong>Invoice:</strong> {order.invoiceNo}</p>
                  <p><strong>Transaction ID:</strong> {order.transactionId}</p>
                  <p><strong>Payment Mode:</strong> {order.paymentMode}</p>
                  <p>
                    <strong>Status:</strong>
                    <span className="adm-paydtl-status">
                      {order.paymentStatus}
                    </span>
                  </p>
                </div> */}

                <div className="adm-paydtl-summary">

  <div className="adm-paydtl-summary-row adm-paydtl-total-row">
    <span className="adm-paydtl-label-ttl">Total Amount</span>
    <span className="adm-paydtl-total-amount">
      ₹ {order.totalAmount}
    </span>
  </div>

  <div className="adm-paydtl-summary-row-inv">
    <span className="adm-paydtl-label-inv">Invoice</span>
    <span className="adm-paydtl-value-inv">
      {order.invoiceNo || "N/A"}
    </span>
  </div>

  <div className="adm-paydtl-summary-row">
    <span className="adm-paydtl-label">Transaction ID</span>
    <span className="adm-paydtl-value">
      {order.transactionId || "N/A"}
    </span>
  </div>

  <div className="adm-paydtl-summary-row">
    <span className="adm-paydtl-label">Payment Mode</span>
    <span className="adm-paydtl-value">
      {order.paymentMode}
    </span>
  </div>

  <div className="adm-paydtl-summary-row">
    <span className="adm-paydtl-label">Status</span>
    <span
      className={`adm-paydtl-status ${
        order.paymentStatus === "SUCCESS"
          ? "success"
          : order.paymentStatus === "FAILED"
          ? "failed"
          : "pending"
      }`}
    >
      {order.paymentStatus}
    </span>
  </div>

</div>

              </div>

            </div>
            
          </div>
          <div className="adm-paydtl-history">
            <h3>Payment History</h3>

            <div className="adm-paydtl-history-row">
              <span>{order.orderDate}</span>
              <span className="adm-paydtl-plus"> + ₹ {order.totalAmount}</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AdminPaymentDetails;