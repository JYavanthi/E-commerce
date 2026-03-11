// import React, { useEffect, useState } from "react";
// import { FaPaperclip, FaFileExport } from "react-icons/fa";
// import "./styles/AdminOrders.css";
// import Sidebar from "./sidebar";
// import Header from "./topbar";

// interface Item {
//   ProductName: string;
//   Quantity: number;
//   ProductWeight:string;
//   UnitPrice: number;
//   TotalPrice: number;
// }

// interface Order {
//   orderId: number;
//   userId: number;
//   FirstName:string,
//   orderDate: string;
//   expectedDelivery: string;
//   deliveryStatus: string;
//   orderStatus: string;
//   paymentStatus: string;
//   paymentMode: string;
//   totalAmount: number;
//   items: Item[];
// }

// const AdminOrders = () => {
//   const [orders, setOrders] = useState<Order[]>([]);
//   const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
//   const [filter, setFilter] = useState("All");

//   useEffect(() => {
//     fetch("http://localhost:4000/api/admin/orders")
//       .then(res => res.json())
//       .then(data => {
//         if (data.success) setOrders(data.data);
//       });
//   }, []);

//   const filteredOrders =
//     filter === "All"
//       ? orders
//       : orders.filter(o => o.orderStatus === filter);

//   const getStatusClass = (status: string) => {
//     switch (status) {
//       case "Completed":
//         return "badge2 completed";
//       case "Pending":
//         return "badge2 pending";
//       case "Failed":
//         return "badge2 failed";
//       default:
//         return "badge2";
//     }
//   };

//   return (
//     <div className="admin-layout">
//       <Sidebar />
//       <div className="admin-main">
//         <Header />
//          <div className="top-controls">
//           <h2 className="page-title">ORDERS</h2>
//           <div className="right-controls">
//             <div className="control-item">
//                  <span>Date:</span>
//                 <select>
//                   <option>All Products</option>
//                   <option>Featured</option>
//                   <option>Latest</option>
//                 </select>
//             </div>

//             <div className="control-item">
//               <span>Month:</span>
//                 <select>
//                   <option>Jan</option>
//                   <option>Feb</option>
//                   <option>Ma</option>
//                 </select>
//             </div>

//             <button className="filter-btn">⚲ Filter</button>

//             <div className="search-circle">🔍</div>
//           </div>
//          </div>

//         <div className="order-container">
//           {/* FILTERS */}
//           <div className="filters">
//             {["All", "Completed", "Pending", "Failed"].map(tab => (
//               <button
//                 key={tab}
//                 className={filter === tab ? "active-filter" : ""}
//                 onClick={() => setFilter(tab)}
//               >
//                 {tab}
//               </button>
//             ))}
//           </div>
//           <div className="ord-srch">
//               <input type="search" placeholder="Search Order ID, Customer ID etc....." />
//               <div className="ord-srch-btns">
//                 <button className="btn-icon"> <FaPaperclip />Attachment</button>
//                 <button className="btn-icon"><FaFileExport/>Export</button>
//               </div>
//           </div>

//           {/* TABLE */}
//           <table className="orders-table">
//             <thead>
//               <tr>
//                 <th>Order ID</th>
//                 <th>Customer ID</th>
//                 <th>Customer Name</th>
//                 <th>Order Date</th>
//                 <th>Delivery Date</th>
//                 <th>Status</th>
//                 <th>Payment</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredOrders.map(order => (
//                 <tr
//                   key={order.orderId}
//                   onClick={() => setSelectedOrder(order)}
//                   className="clickable-row"
//                 >
//                   <td>{order.orderId}</td>
//                   <td>{order.userId}</td>
//                   <td>{order.FirstName}</td>
//                   <td>{order.orderDate}</td>
//                   <td>{order.expectedDelivery}</td>
//                   <td>
//                     <span className={getStatusClass(order.orderStatus)}>
//                       {order.orderStatus}
//                     </span>
//                   </td>
//                   <td>{order.paymentMode}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>

//           {/* POPUP */}
//           {selectedOrder && (
//             <div
//               className="popup-overlay"
//               onClick={() => setSelectedOrder(null)}
//             >
//               <div
//                 className="order-popup"
//                 onClick={e => e.stopPropagation()}
//               >
//                 <div className="popup-header">
//                   <h3>Products Ordered</h3>
//                   <span>Order ID: {selectedOrder.orderId}</span>
//                 </div>

//                 <div className="products-scroll">
//                   <table>
//                     <thead>
//                       <tr>
//                         <th>Product</th>
//                         <th>Qty</th>
//                         <th>Weight</th>
//                         <th>Unit Price</th>
//                         <th>Total Price</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {selectedOrder.items.map((item, index) => (
//                         <tr key={index}>
//                           <td>{item.ProductName}</td>
//                           <td>{item.Quantity}</td>
//                           <td>{item.ProductWeight}</td>
//                           <td>₹{item.UnitPrice}</td>
//                           <td>₹{item.TotalPrice}</td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>

//                 <div className="popup-footer">
//                   <p>
//                     <strong>Total:</strong> ₹{selectedOrder.totalAmount}
//                   </p>
//                   <p>
//                     <strong>Transaction:</strong>{" "}
//                     <span className={getStatusClass(selectedOrder.orderStatus)}>
//                       {selectedOrder.orderStatus}
//                     </span>
//                   </p>
//                 </div>

//                 <button
//                   className="close-btn"
//                   onClick={() => setSelectedOrder(null)}
//                 >
//                   Close
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminOrders;


import React, { useEffect, useState } from "react";
import "./styles/AdminOrders.css";
import Sidebar from "./sidebar";
import Header from "./topbar";

interface Item {
  ProductName: string;
  Quantity: number;
  ProductWeight: string;
  UnitPrice: number;
  TotalPrice: number;
}

interface Order {
  orderId: number;
  userId: number;
  customerName: string;
  orderDate: string;
  expectedDelivery: string;
  deliveryStatus: string;
  orderStatus: string;
  paymentStatus: string;
  paymentMode: string;
  totalAmount: number;
  taxAmount: number;
  invoiceNo: string;
  transactionId: string;
  couponCode:string;
  couponDiscount:number
  items: Item[];
}

const AdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null);

  useEffect(() => {
    fetch("http://localhost:4000/api/admin/orders")
      .then(res => res.json())
      .then(data => {
        if (data.success) setOrders(data.data);
      });
  }, []);

  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="admin-main">
        <Header />

        <h2 className="page-title">ORDERS</h2>

        <div className="order-container">
          <table className="orders-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer ID</th>
                <th>Customer Name</th>
                <th>Order Date</th>
                <th>Delivery Date</th>
                <th>Status</th>
                <th>Payment</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr
                  key={order.orderId}
                  onClick={() => setSelectedOrder(order)}
                  className="clickable-row"
                >
                  <td>{order.orderId}</td>
                  <td>{order.userId}</td>
                  <td>{order.customerName}</td>
                  <td>{order.orderDate}</td>
                  <td>{order.expectedDelivery}</td>
                  <td>{order.orderStatus}</td>
                  <td>{order.paymentMode}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* ================= ORDER DETAILS POPUP ================= */}
          {selectedOrder && (
            <div
              className="ord-dtl-overlay"
              onClick={() => setSelectedOrder(null)}
            >
              <div
                className="ord-dtl-popup"
                onClick={e => e.stopPropagation()}
              >
                <h2 className="ord-dtl-title">Order Details</h2>

                <div className="ord-dtl-content">

                  {/* LEFT SIDE */}
                  <div className="ord-dtl-left">

                    <div className="ord-dtl-left-header">
                      <h3>Products Ordered</h3>
                      <span>Order ID: {selectedOrder.orderId}</span>
                    </div>

                    <div className="ord-dtl-products-scroll">
                      <table>
                        <thead>
                          <tr>
                            <th>Product</th>
                            <th>Qty</th>
                            <th>Weight</th>
                            <th>Unit Price</th>
                            <th>Total Price</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedOrder.items.map((item, index) => (
                            <tr key={index}>
                              <td>{item.ProductName}</td>
                              <td>{item.Quantity}</td>
                              <td>{item.ProductWeight}</td>
                              <td>₹{item.UnitPrice}</td>
                              <td>₹{item.TotalPrice}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="ord-dtl-left-footer">
                      <div className="ord-dtl-left-left-footer">
                        <div>
                          <span>Name  :  </span>
                          <strong>  {selectedOrder.customerName}</strong>
                        </div>
                        <div>
                          <span>Order Date  :  </span>
                          <strong>{selectedOrder.orderDate}</strong>
                        </div>
                      </div>
                      
                      <div className="ord-dtl-left-right-footer">
                       <div> 
                         <strong>Total Amount :</strong> ₹{selectedOrder.totalAmount}
                       </div>
                       <div>
                        <strong>Transaction :</strong>
                        <span className="ord-dtl-transaction">
                          {selectedOrder.paymentStatus}
                        </span>
                       </div>
                      </div>
                    </div>

                  </div>

                  {/* RIGHT SIDE */}
                  <div className="ord-dtl-right">

                    <h3>Payment Details</h3>

                    <div className="ord-dtl-row">
                      <span>Order ID : </span>
                      <strong>{selectedOrder.orderId}</strong>
                    </div>

                    <div className="ord-dtl-row">
                      <span>Payment Date:</span>
                      <strong>{selectedOrder.orderDate}</strong>
                    </div>

                    {/* <div className="ord-dtl-row">
                      <span>Expected Delivery:</span>
                      <strong>{selectedOrder.expectedDelivery}</strong>
                    </div> */}

                    <div className="ord-dtl-row">
                      <span>Payment Mode:</span>
                      <strong>{selectedOrder.paymentMode}</strong>
                    </div>

                    <div className="ord-dtl-row">
                      <span>Payment Status:</span>
                      <strong>{selectedOrder.paymentStatus}</strong>
                    </div>

                    <div className="ord-dtl-row">
                      <span>Transaction ID:</span>
                      <strong>{selectedOrder.transactionId}</strong>
                    </div>

                    <div className="ord-dtl-row">
                      <span>Invoice No:</span>
                      <strong>{selectedOrder.invoiceNo}</strong>
                    </div>

                    <div className="ord-dtl-row1">

                          
    {selectedOrder.couponCode && (
      <span className="coupon">
        Coupon :
        <strong className="code " >
          {selectedOrder.couponCode}
        
        {" "}
        (- ₹{selectedOrder
        .couponDiscount})
        </strong>
      </span>
    )}
  
                    </div>
                 


                  </div>
                </div>
                <button
                  className="ord-dtl-close"
                  onClick={() => setSelectedOrder(null)}
                >
                  Close
                </button>

              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;