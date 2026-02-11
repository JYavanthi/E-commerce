// import React from "react";
// import "../src/styles/success.css";

// const Success = () => {
//   return (
//     <div className="success-wrapper">
//       <div className="success-card">

//         {/* Success Icon */}
//         <div className="success-icon">
//           <div className="circle">
//             ✓
//           </div>
//         </div>

//         <h3 className="order-id">Order id : 123656</h3>
//         <h2 className="success-title">Payment Successful</h2>
//         <p className="success-sub">
//           Payment successful. The transaction has been completed
//         </p>

//         {/* Product Card */}
//         <div className="product-box">
//           <img
//             src="https://via.placeholder.com/60"
//             alt="product"
//             className="product-img"
//           />
//           <div className="product-info">
//             <h4>Fox Tail Millets</h4>
//             <p>200gms</p>
//             <p>Qty: 1</p>
//           </div>
//           <div className="product-price">₹150</div>
//         </div>

//         {/* Details */}
//         <div className="details">
//           <div className="row"><span>Transaction Date</span><span>28th January 2026</span></div>
//           <div className="row"><span>Payment Method</span><span>UPI Payment</span></div>
//           <div className="row"><span>Shipping Method</span><span>Shiprocket</span></div>
//           <div className="row"><span>Subtotal</span><span>₹150</span></div>
//           <div className="row"><span>GST</span><span>₹10</span></div>
//           <div className="row"><span>Shipping</span><span>₹40</span></div>

//           <hr />

//           <div className="row total">
//             <span>Total</span>
//             <span>₹200</span>
//           </div>
//         </div>

//         {/* Buttons */}
//         <button className="btn continue">Continue Shopping</button>
//         <button className="btn invoice">Download Invoice</button>

//       </div>
//     </div>
//   );
// };

// export default Success;

//
// import React, { useEffect, useState } from "react";
// import { useSearchParams, useNavigate } from "react-router-dom";
// import "../src/styles/success.css";

// interface OrderItem {
//   productName: string;
//   weight: string;
//   qty: number;
//   price: number;
//   imageUrl: string;
// }

// interface OrderData {
//   orderId: string;
//   transactionDate: string;
//   paymentMethod: string;
//   shippingMethod: string;
//   subtotal: number;
//   gst: number;
//   shipping: number;
//   total: number;
//   items: OrderItem[];
// }

// const Success = () => {
//   const [searchParams] = useSearchParams();
//   const navigate = useNavigate();
//   const orderId = searchParams.get("orderId"); // ?orderId=123
//   const [order, setOrder] = useState<OrderData | null>(null);

//  useEffect(() => {
//   if (!orderId) return;

//   fetch(`http://localhost:4000/api/order/${orderId}`)
//     .then(async res => {
//       const text = await res.text();   // 👈 read raw response first
//       try {
//         const data = JSON.parse(text); // 👈 try JSON
//         setOrder(data);
//       } catch (e) {
//         console.error("❌ Not JSON response:", text); // 👈 will show HTML
//         throw new Error("API did not return JSON");
//       }
//     })
//     .catch(err => console.error("Order fetch error:", err));

// }, [orderId]);


//   if (!order) {
//     return <div className="success-wrapper">Loading order details...</div>;
//   }

//   return (
//     <div className="success-wrapper">
//       <div className="success-card">

//         {/* Success Icon */}
//         <div className="success-icon">
//           <div className="circle">✓</div>
//         </div>

//         {/* ✅ Real Order ID */}
//         <h3 className="order-id">Order id : {order.orderId}</h3>

//         <h2 className="success-title">Placed Successfully</h2>
//         <p className="success-sub">
//           Payment successful. The transaction has been completed
//         </p>

//         {/* Products */}
//         {order.items.map((item, index) => (
//           <div className="product-box" key={index}>
//             <img
//               src={item.imageUrl}
//               alt={item.productName}
//               className="product-img"  />
              
//             <div className="product-info">
//               <h4>{item.productName}</h4>
//               <p>{item.weight}</p>
//               <p className="scsqty">Qty:{item.qty}</p>
//             </div>
//             <div className="product-price">₹{item.price}</div>
//           </div>
//         ))}

//         {/* Details */}
//         <div className="details">
//           <div className="row">
//             <span className="k">Transaction Date</span>
//             <span>{order.transactionDate}</span>
//           </div>
//           <div className="row">
//             <span className="k">Payment Method</span>
//             <span>{order.paymentMethod}</span>
//           </div>
//           <div className="row">
//             <span className="k">Shipping Method</span>
//             <span>{order.shippingMethod}</span>
//           </div>
//           <div className="row">
//             <span className="k">Subtotal</span>
//             <span>₹{order.subtotal}</span>
//           </div>
//           <div className="row">
//             <span className="k">GST</span>
//             <span>₹{order.gst}</span>
//           </div>
//           <div className="row">
//             <span className="k">Shipping</span>
//             <span>₹{order.shipping}</span>
//           </div>

//           <hr />

//           <div className="row total">
//             <span className="k">Total</span>
//             <span>₹{order.total}</span>
//           </div>
//         </div>

//         {/* Buttons */}
//         <button className="btn continue" onClick={() => navigate("/")}>
//           Continue Shopping
//         </button>

//         <button
//           className="btn invoice"
//           onClick={() => window.open(`/api/order/${order.orderId}/invoice`, "_blank")}
//         >
//           Download Invoice
//         </button>

//       </div>
//     </div>
//   );
// };

// export default Success;


//success page including the delivery tracking api

import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import "../src/styles/success.css";

interface OrderItem {
  productName: string;
  weight: string;
  qty: number;
  price: number;
  imageUrl: string;
}

interface OrderData {
  orderId: string;
  transactionDate: string;
  paymentMethod: string;
  shippingMethod: string;
  subtotal: number;
  gst: number;
  shipping: number;
  total: number;
  items: OrderItem[];
}

/* ---------------- Delivery Types ---------------- */

interface DeliveryData {
  deliveryId: number;
  orderId: number;
  userId: number;
  shippingMode: string;
  fromLocation: string;
  toLocation: string;
  deliveryStatus: string;
  expectedDeliveryDate: string;
  createdDate: string;
}

const Success = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const orderId = searchParams.get("orderId");

  const [order, setOrder] = useState<OrderData | null>(null);
  const [delivery, setDelivery] = useState<DeliveryData | null>(null);
  const [loading, setLoading] = useState(true);

  /* ---------------- Fetch Order + Delivery ---------------- */

  useEffect(() => {
    if (!orderId) return;

    const fetchAll = async () => {
      try {
        setLoading(true);

        // 1️⃣ Order API
        const orderRes = await fetch(`http://localhost:4000/api/order/${orderId}`);
        const orderData = await orderRes.json();
        setOrder(orderData);

        // 2️⃣ Delivery Tracking API
        const deliveryRes = await fetch(
          `http://localhost:4000/api/delivery/track/${orderId}`
        );
        const deliveryData = await deliveryRes.json();

        if (deliveryData.success) {
          setDelivery(deliveryData.delivery);
        }

      } catch (err) {
        console.error("❌ Success page fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [orderId]);

  if (loading) {
    return <div className="success-wrapper">Loading order & delivery details...</div>;
  }

  if (!order) {
    return <div className="success-wrapper">Order not found</div>;
  }

  return (
    <div className="success-wrapper">
      <div className="success-card">

        {/* Success Icon */}
        <div className="success-icon">
          <div className="circle">✓</div>
        </div>

        <h3 className="order-id">Order id : {order.orderId}</h3>
        <h2 className="success-title">Placed Successfully</h2>
        <p className="success-sub">
          Payment successful. The transaction has been completed
        </p>

        {/* ---------------- DELIVERY TRACKING ---------------- */}
        {/* {delivery && (
          <div className="delivery-box">
            <h3 className="delivery-title">📦 Delivery Tracking</h3>

            <div className="delivery-row">
              <span>Status</span>
              <span className={`status ${delivery.deliveryStatus}`}>
                {delivery.deliveryStatus}
              </span>
            </div>

            <div className="delivery-row">
              <span>Shipping Mode</span>
              <span>{delivery.shippingMode}</span>
            </div>

            <div className="delivery-row">
              <span>From</span>
              <span>{delivery.fromLocation}</span>
            </div>

            <div className="delivery-row">
              <span>To</span>
              <span>{delivery.toLocation}</span>
            </div>

            <div className="delivery-row">
              <span>Expected Delivery</span>
              <span>
                {new Date(delivery.expectedDeliveryDate).toDateString()}
              </span>
            </div>
          </div>
        )} */}

        {/* ---------------- PRODUCTS ---------------- */}
        {order.items.map((item, index) => (
          <div className="product-box" key={index}>
            <img
              src={item.imageUrl}
              alt={item.productName}
              className="product-img"
            />

            <div className="product-info">
              <h4>{item.productName}</h4>
              <p>{item.weight}</p>
              <p className="scsqty">Qty:{item.qty}</p>
            </div>

            <div className="product-price">₹{item.price}</div>
          </div>
        ))}

        {/* ---------------- ORDER DETAILS ---------------- */}
        <div className="details">
          <div className="row">
            <span className="k">Transaction Date</span>
            <span>{order.transactionDate}</span>
          </div>

          <div className="row">
            <span className="k">Payment Method</span>
            <span>{order.paymentMethod}</span>
          </div>

          <div className="row">
            <span className="k">Shipping Method</span>
            <span>{order.shippingMethod}</span>
          </div>

          <div className="row">
            <span className="k">Subtotal</span>
            <span>₹{order.subtotal}</span>
          </div>

          <div className="row">
            <span className="k">GST</span>
            <span>₹{order.gst}</span>
          </div>

          <div className="row">
            <span className="k">Shipping</span>
            <span>₹{order.shipping}</span>
          </div>

          <hr />

          <div className="row total">
            <span className="k">Total</span>
            <span>₹{order.total}</span>
          </div>
        </div>

        {/* ---------------- ACTION BUTTONS ---------------- */}
        <button className="btn continue" onClick={() => navigate("/")}>
          Continue Shopping
        </button>

        <button
          className="btn invoice"
          onClick={() =>
            window.open(`/api/order/${order.orderId}/invoice`, "_blank")
          }
        >
          Download Invoice
        </button>

      </div>
    </div>
  );
};

export default Success;


