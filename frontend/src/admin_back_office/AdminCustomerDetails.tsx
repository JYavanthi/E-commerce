// import React from "react";
// import "./styles/AdminCustomerDetails.css";
// import user from "../assets/user.png";

// interface Props {
//   customer: any;
// }

// export default function AdminCustomerDetails({ customer }: Props) {
//   return (
//     <div className="adm-cst-dtls-wrapper">
//       {/* Header */}
//       <div className="adm-cst-dtls-header">
//         <button className="adm-cst-back-btn">←</button>
//         <div className="adm-cst-header-title">
//           <span className="adm-cst-icon">👥</span>
//           <h2>CUSTOMER DETAILS</h2>
//         </div>
//         <button className="adm-cst-next-btn">→</button>
//       </div>

//       {/* Account Section */}
//       <div className="adm-cst-dtls-account-section">
//         <div className="adm-cst-section-header">
//           <h3>ACCOUNT</h3>
//           <div className="adm-cst-action-icons">
//             <button className="adm-cst-edit-icon">✏️</button>
//             <button className="adm-cst-delete-icon">🗑️</button>
//           </div>
//         </div>

//         <div className="adm-cst-account-content">
//           {/* Personal Details */}
//           <div className="adm-cst-dtls-profile-card">
//             <div className="adm-cst-personal-header">
//               <h4>PERSONAL DETAILS</h4>
//               <button className="adm-cst-edit-small">✏️</button>
//             </div>
//             <div className="adm-cst-dtl-prsnl">
//               <img
//               src={user}
//               alt="profile"
//               className="adm-cst-dtls-profile-img"/>
//               <div className="adm-cst-dtl-prsnl-name">
//                 <h3 className="adm-cst-name">Name : {customer.FirstName} {customer.LastName}</h3>
//                 <p className="adm-cst-dtls-id">ID :  {customer.UserID}</p>
//               </div>
//             </div>

//             <div className="adm-cst-dtls-contact">
//               <p>📍 Bangalore, Karnataka</p>
//               <p>✉️ {customer.Email}</p>
//               <p>📞 {customer.ContactNo}</p>
//             </div>
//           </div>

//           {/* Account Details */}
//           <div className="adm-cst-dtls-details-card">
//             <div className="adm-cst-details-header">
//               <h4>ACCOUNT DETAILS</h4>
//               <button className="adm-cst-edit-small">✏️</button>
//             </div>

//             <div className="adm-cst-details-content">
//               <div className="adm-cst-detail-row">
//                 <span className="adm-cst-label">First Name:</span>
//                 <span className="adm-cst-value">{customer.FirstName}</span>
//               </div>
//               <div className="adm-cst-detail-row">
//                 <span className="adm-cst-label">Last Name:</span>
//                 <span className="adm-cst-value">{customer.LastName}</span>
//               </div>
//               <div className="adm-cst-detail-row">
//                 <span className="adm-cst-label">Registration Date:</span>
//                 <span className="adm-cst-value">{customer.CreatedDt || "10/10/1999"}</span>
//               </div>
//               <div className="adm-cst-detail-row">
//                 <span className="adm-cst-label">Usage:</span>
//                 <span className="adm-cst-value">2 Hours</span>
//               </div>
//             </div>
//             <div className="adm-cst-address-section">
//               <div className="adm-cst-address-box">
//                 <h4>SHIPPING DETAILS</h4>
//                 <p><strong>Address:</strong> Flat 305, Green Heights, Marathahalli</p>
//                 <p><strong>Landmark:</strong> Near Kalasipalya Bus Stop</p>
//                 <p><strong>City:</strong> Bangalore</p>
//                 <p><strong>State:</strong> Karnataka</p>
//                 <p><strong>PIN Code:</strong> 560037</p>
//               </div>

//               <div className="adm-cst-address-box">
//                 <h4>BILLING DETAILS</h4>
//                 <p><strong>Address:</strong> Flat 305, Green Heights, Marathahalli</p>
//                 <p><strong>Landmark:</strong> Near Kalasipalya Bus Stop</p>
//                 <p><strong>City:</strong> Bangalore</p>
//                 <p><strong>State:</strong> Karnataka</p>
//                 <p><strong>PIN Code:</strong> 560037</p>
//               </div>
//             </div>
//           </div>
//         </div>

//       {/* Order History */}
//       <div className="adm-cst-order-section">
//         <h3>ORDER HISTORY</h3>
        
//         <div className="adm-cst-order-card">
//           <img 
//             src="https://via.placeholder.com/100" 
//             alt="product"
//             className="adm-cst-order-img"
//           />
          
//           <div className="adm-cst-order-details">
//             <h4>Fox Tail Millets</h4>
//             <p>Qty: 1</p>
//             <p className="adm-cst-order-id">Order ID: KP2544333</p>
//             <p className="adm-cst-order-date">See All</p>
//           </div>

//           <div className="adm-cst-order-status">
//             <span className="adm-cst-status-badge delivered">Order delivered</span>
//             <p className="adm-cst-delivery-date">31/08/2025</p>
//           </div>
//         </div>
//       </div>

//       {/* Wishlist */}
//       <div className="adm-cst-wishlist-section">
//         <h3>💗 WISHLIST</h3>
        
//         <div className="adm-cst-wishlist-scroll">
//           <button className="adm-cst-scroll-btn left">◀</button>
          
//           <div className="adm-cst-wishlist-container">
//             {[
//               { name: "Foxtail Red Natuna", price: "₹ 200", img: "https://via.placeholder.com/100" },
//               { name: "Jaggery Chai", price: "₹ 150", img: "https://via.placeholder.com/100" },
//               { name: "Pure Honey", price: "₹ 350", img: "https://via.placeholder.com/100" },
//               { name: "Pumpkin Seeds", price: "₹ 120", img: "https://via.placeholder.com/100" },
//               { name: "Green Tea", price: "₹ 180", img: "https://via.placeholder.com/100" },
//             ].map((item, idx) => (
//               <div key={idx} className="adm-cst-wishlist-card">
//                 <img src={item.img} alt={item.name} />
//                 <h5>{item.name}</h5>
//                 <p className="adm-cst-wishlist-price">{item.price}</p>
//                 <button className="adm-cst-add-btn">Add</button>
//               </div>
//             ))}
//           </div>

//           <button className="adm-cst-scroll-btn right">▶</button>
//         </div>
//       </div>
//     </div>
//     </div>
//   );
// }


import React, { useEffect, useState } from "react";
import "./styles/AdminCustomerDetails.css";
import user from "../assets/user.png";
interface Props {
  customer: any;
}

export default function AdminCustomerDetails({ customer }: Props) {

  const [orders, setOrders] = useState<any[]>([]);
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [address, setAddress] = useState<any>(null);
  const [showAll, setShowAll] = useState(false);
  const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null);
  

  /* ================= API CALLS ================= */
  useEffect(() => {
    if (!customer?.UserID) return;

    /* ADDRESS */
    fetch(`http://localhost:4000/api/address/${customer.UserID}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          const defaultAddress = data.data.find(
            (a: any) => a.IsDefault === 1 || a.IsDefault === true
          );
          setAddress(defaultAddress);
        }
      });

    /* ORDERS */
    fetch("http://localhost:4000/api/admin/orders")
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          const userOrders = data.data.filter(
            (o: any) => o.userId === customer.UserID
          );
          setOrders(userOrders);
        }
      });

    /* WISHLIST */
    fetch(`http://localhost:4000/api/wishlist/${customer.UserID}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setWishlist(data.data);
        }
      });

  }, [customer]);

  
  const displayedOrders = showAll
  ? orders
  : orders.slice(0,1);

  return (
    <div className="adm-cst-dtls-wrapper">

      {/* Header */}
      <div className="adm-cst-dtls-header">
        <button className="adm-cst-back-btn">←</button>
        <div className="adm-cst-header-title">
          <span className="adm-cst-icon">👥</span>
          <h2>CUSTOMER DETAILS</h2>
        </div>
        <button className="adm-cst-next-btn">→</button>
      </div>

      {/* Account Section */}
      <div className="adm-cst-dtls-account-section">
        <div className="adm-cst-section-header">
          <h3>ACCOUNT</h3>
          <div className="adm-cst-action-icons">
            {/* <button className="adm-cst-edit-icon">✏️</button> */}
            <button className="adm-cst-delete-icon">🗑️</button>
          </div>
        </div>

        <div className="adm-cst-account-content">

          {/* Personal Details */}
          <div className="adm-cst-dtls-profile-card">
            <div className="adm-cst-personal-header">
              <h4>PERSONAL DETAILS</h4>
              {/* <button className="adm-cst-edit-small">✏️</button> */}
            </div>

            <div className="adm-cst-dtl-prsnl">
              <img src={user} alt="profile" className="adm-cst-dtls-profile-img" />
              <div className="adm-cst-dtl-prsnl-name">
                <h3 className="adm-cst-name">
                  Name : {customer.FirstName} {customer.LastName}
                </h3>
                <p className="adm-cst-dtls-id">ID : {customer.UserID}</p>
              </div>
            </div>

            <div className="adm-cst-dtls-contact">
              <p>📍 {address?.City || "N/A"}, {address?.State || ""}</p>
              <p>✉️ {customer.Email}</p>
              <p>📞 {customer.ContactNo}</p>
            </div>
          </div>

          {/* Account Details */}
          <div className="adm-cst-dtls-details-card">
            <div className="adm-cst-details-header">
              <h4>ACCOUNT DETAILS</h4>
            </div>

            <div className="adm-cst-details-content">
              <div className="adm-cst-detail-row">
                <span className="adm-cst-label">First Name:</span>
                <span className="adm-cst-value">{customer.FirstName}</span>
              </div>
              <div className="adm-cst-detail-row">
                <span className="adm-cst-label">Last Name:</span>
                <span className="adm-cst-value">{customer.LastName}</span>
              </div>
              <div className="adm-cst-detail-row">
                <span className="adm-cst-label">Registration Date:</span>
                <span className="adm-cst-value">
                  {customer.CreatedDt
                    ? new Date(customer.CreatedDt).toLocaleDateString()
                    : "-"}
                </span>
              </div>
              <div className="adm-cst-detail-row">              
                <span className="adm-cst-label">Usage:</span>
                <span className="adm-cst-value">2 Hours</span>
              </div>
            </div>

            {/* Address */}
            <div className="adm-cst-address-section">
              <div className="adm-cst-address-box">
                <h4>SHIPPING DETAILS</h4>
                <p><strong>Address:</strong> {address?.AddressLine1}, {address?.AddressLine2}</p>
                <p><strong>Landmark:</strong> {address?.Landmark}</p>
                <p><strong>City:</strong> {address?.City}</p>
                <p><strong>State:</strong> {address?.State}</p>
                <p><strong>PIN Code:</strong> {address?.Pincode}</p>
              </div>

              <div className="adm-cst-address-box">
                <h4>BILLING DETAILS</h4>
                <p><strong>Address:</strong> {address?.AddressLine1},, {address?.AddressLine2}</p>
                <p><strong>Landmark:</strong> {address?.Landmark}</p>
                <p><strong>City:</strong> {address?.City}</p>
                <p><strong>State:</strong> {address?.State}</p>
                <p><strong>PIN Code:</strong> {address?.Pincode}</p>
              </div>
            </div>
          </div>
        </div>
{/* ================= ORDER HISTORY ================= */}
<div className="adm-cst-order-section">
  <h3>ORDER HISTORY</h3>

  

  <div className={`adm-cst-order-container ${showAll ? "show-all" : ""}`}>
    {displayedOrders.map((order, index) => (
      <div key={index} className="adm-cst-order-card">

        {/* Order Header */}
        <div className="adm-cst-order-top">
          <img
            src="https://via.placeholder.com/100"
            alt="product"
            className="adm-cst-order-img"
          />

          <div className="adm-cst-order-details">
            <h4>Order ID : <span>#{order.orderId}</span></h4>
            <p>Total : ₹ {order.totalAmount}</p> 
            <p className="adm-cst-delivery-date">
              Date : <span className="ord-dte">{order.expectedDelivery}</span>
            </p>

            {/* <p
              className="adm-cst-view-more"
              onClick={() =>
                setExpandedOrderId(
                  expandedOrderId === order.orderId
                    ? null
                    : order.orderId
                )
              }
            >
              {expandedOrderId === order.orderId
                ? "Hide Details"
                : "View More Details"}
            </p> */}
          </div>
          <p
              className="adm-cst-view-more"
              onClick={() =>
                setExpandedOrderId(
                  expandedOrderId === order.orderId
                    ? null
                    : order.orderId
                )
              }
            >
              {expandedOrderId === order.orderId
                ? "Hide Details"
                : "View More Details"}
            </p>

          <div className="adm-cst-order-status">
           <h2>ORDER STATUS  :  <span className="adm-cst-status-badge delivered">
              {order.orderStatus}
            </span></h2>
            <h2>PAYMENT STATUS  :  <span className="adm-cst-status-badge delivered">
              {order.paymentStatus}
            </span></h2>
            
          </div>
        </div>

        {/* Expanded Product Section */}
        {expandedOrderId === order.orderId && (
          <div className="adm-cst-expanded-box">
            <table className="adm-cst-product-table">
              <thead>
                <tr>
                  <th className="cst-prd-name">Product Name/Product ID</th>
                  <th>Qty</th>
                  <th>Weight</th>
                  <th>Unit Price</th>
                  <th>Total Price</th>
                </tr>
              </thead>

              <tbody>
                {order.items.map((item: any, i: number) => (
                  <tr key={i}>
                    <td>{item.ProductName}</td>
                    <td>{item.Quantity}</td>
                    <td>{item.ProductWeight}</td>
                    <td>₹ {item.UnitPrice}</td>
                    <td>₹ {item.TotalPrice}</td>
                  </tr>
                ))}
              </tbody>
            </table>

           
          <div className="adm-cst-order-total">

  <div className="adm-coupon-section">
    {order.couponCode && (
      <h3>
        Coupon :
        <span style={{ color: "#2e7d32" }}>
          {order.couponCode}
        </span>
        {" "}
        (- ₹{order.couponDiscount})
      </h3>
    )}
  </div>

  <h3 className="adm-total-section">
    Total Amount :
    <span > ₹ {order.totalAmount}</span>
  </h3>

</div>
          </div>
        )}
      </div>
    ))}

    {showAll && orders.length <= 1 && (
      <p className="adm-cst-no-orders">
        No more orders found
      </p>
    )}
  </div>

  {orders.length >=1 && (
    <p
      className="adm-cst-toggle"
      onClick={() => setShowAll(!showAll)}
    >
      {showAll ? "See Less" : "See All"}
    </p>
  )}
</div>
<div className="adm-cst-wishlist-section">
        <h3>💗 WISHLIST ITEMS</h3>
        <div className="adm-cst-wishlist-scroll">
          <button className="adm-cst-scroll-btn left">◀</button>

          <div className="adm-cst-wishlist-container">
            {wishlist.map((item: any) => (
              <div key={item.ProductID} className="adm-cst-wishlist-card">
                <img
                  src={
                    item.ImageUrl ||
                    "https://via.placeholder.com/100"
                  }
                  alt={item.ProductName}
                />
                <h5>{item.ProductName}</h5>
                <p className="adm-cst-wishlist-price">
                  ₹ {item.Price}
                </p>
                {/* <button className="adm-cst-add-btn">Add</button> */}
              </div>
            ))}
          </div>
          <button className="adm-cst-scroll-btn right">▶</button>
        </div>
      </div>
    </div>
    </div>
  );
}