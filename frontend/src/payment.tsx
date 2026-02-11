
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Navbar from "./Navbar/navbar";
import Footer from "./footer";
import PaymentOptions from "./payment/paymentOptions";
import PaymentFooter from "./payment/PaymentFooter";
import "../src/styles/products.css";
import { useAddress } from "./context/AddressContext";
import { useCart } from "./context/CartContext";
import axios from "axios";

const Payment = () => {
  const navigate = useNavigate();
  const { selectedAddress } = useAddress();
  const { cartItems } = useCart();

  const [selectedMethod, setSelectedMethod] = useState<string>("upi");
  const [loading, setLoading] = useState(false);

  // 🔢 Calculate totals
  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );
  const gst = total * 0.1;
  const finalTotal = Math.round(total + gst);

  // 🔥 CONFIRM ORDER
  const handleConfirmOrder = async () => {
    
    if (!selectedAddress) {
      const goToAddress = window.confirm(
        "No delivery address selected.\n\nClick OK to Select / Add Address"
      );

      if (goToAddress) {
        navigate("/address");
      }
      return;
    }

    if (cartItems.length === 0) {
      alert("Cart is empty");
      return;
    }

    try {
      setLoading(true);

      // ==============================
      // 1️⃣ CREATE ORDER (DB)
      // ==============================
      const userId = Number(localStorage.getItem("userId"));

      const orderRes = await axios.post(
        "http://localhost:4000/api/order/create",
        {
          userId,
          cartItems: cartItems.map(item => ({
            productId: item.id,
            quantity: item.qty,
            unitPrice: item.price,
            totalPrice: item.price * item.qty
          })),
          totalAmount: finalTotal,
          taxAmount: gst,
          paymentMode: selectedMethod === "upi" ? "PHONEPE" : "COD"
        }
      );

      const orderId = orderRes.data.orderId;

      // ==============================
      // 2️⃣ PHONEPE PAYMENT
      // ==============================
      if (selectedMethod === "upi") {
        console.log("Creating PhonePe payment for order:", orderId);

const payRes = await axios.post(
  "http://localhost:4000/api/payment/create",
  {
    orderId,
    amount: finalTotal
  }
);

console.log("Full payment response:", payRes.data);

// ✅ THIS IS CORRECT
const redirectUrl = payRes.data.redirectUrl;

if (!redirectUrl) {
  throw new Error("PhonePe redirect URL not received from backend");
}

// 🚀 REDIRECT TO PHONEPE
window.location.href = redirectUrl;
        return;
      }

      // ==============================
      // 3️⃣ CASH ON DELIVERY
      // ==============================
      if (selectedMethod === "cod") {
        alert("Order placed successfully with Cash On Delivery");
        navigate(`/success?orderId=${orderId}`);
      }

    } catch (err: any) {
      console.error("❌ Payment error:", err.response?.data || err.message);
      alert("Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="payment-page">

        {/* Steps */}
        <div className="payment-steps">
          <span className="cmpltd">My Cart</span>
          <span className="dots">---------------</span>
          <span className="cmpltd">Address</span>
          <span className="dots">---------------</span>
          <span className="active">Payment</span>
        </div>

        {/* Address */}
        <div className="payment-add-section">
          {selectedAddress && (
            <div className="payment-address-card active">
              <h3 className="payment-delivery-title">Deliver To :</h3>
              <div className="payment-add">
                <p className="name">
                  {selectedAddress.name}
                  <span className="type"> ({selectedAddress.type})</span>,
                  <span className="mobile"> Ph:{selectedAddress.mobile}</span>
                </p>
                <p className="pymnt-add-1">
                  No {selectedAddress.flat}, {selectedAddress.street},
                  {selectedAddress.city}, {selectedAddress.state} -{" "}
                  {selectedAddress.pincode}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Main */}
        <div className="payment-container">

          {/* Left */}
          <div className="payment-left">
            <h3 className="payment-section-title">Payment Options</h3>

            <PaymentOptions
              selectedMethod={selectedMethod}
              setSelectedMethod={setSelectedMethod}
            />
          </div>

          {/* Right */}
          <div className="payment-right">
            <h3 className="payment-title">Billing Details</h3>

            <div className="summary">
              <div className="row">
                <span>Cart Total</span>
                <span>₹ {total}</span>
              </div>

              <div className="row">
                <span>GST</span>
                <span>₹ {gst.toFixed(2)}</span>
              </div>

              <div className="row">
                <span>Shipping Charges</span>
                <span className="free">Free</span>
              </div>

              <hr />

              <div className="row total">
                <span>Total Amount</span>
                <span>₹ {finalTotal}</span>
              </div>
            </div>

            <button
              className="place-order-btn"
              onClick={handleConfirmOrder}
              disabled={loading}
            >
              {loading ? "PROCESSING..." : "CONFIRM YOUR ORDER"}
            </button>
          </div>
        </div>

        <PaymentFooter />
        <Footer />
      </div>
    </>
  );
};

export default Payment;