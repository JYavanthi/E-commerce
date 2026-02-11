import { useAddress } from "./context/AddressContext";
import { useCart } from "./context/CartContext";
import Navbar from "./Navbar/navbar";
import Footer from "./footer";
import "./styles/cart-address.css";
import  {useNavigate} from "react-router-dom";
import AddressFormModal from "./addressFormModal";
import { useState } from "react";
 
export default function CartAddress() {
  const emptyForm = {
  flat: "",
  street: "",
  landmark: "",
  pincode: "",
  city: "",
  state: "",
  name: "",
  mobile: "",
  type: "Home",
  default: false,
};

const handleSave = () => {
  if (!form.name || !form.mobile || !form.street) {
    alert("Please fill required fields");
    return;
  }

  addAddress({ ...form, id: Date.now() });
  setShowForm(false);
  setForm({ ...emptyForm });
};


  const navigate = useNavigate();
  const { selectedAddress,addAddress } = useAddress();
  const { cartItems } = useCart();
  const [showForm, setShowForm] = useState(false);
const [form, setForm] = useState<any>(emptyForm);


  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );
  const gst = total * 0.1;
  const finalTotal = total + gst;

  return (
    <>
      <Navbar />

      <div className="cart-address-page">
        <div className="cart-add-steps">
          <span className="cmpltd">My Cart</span>
          <span className="dots">---------------</span>
          <span className="active">Address</span>
          <span className="dots">---------------</span>
          <span>Payment</span>
        </div>

        <div className="cart-add-content">
          <div className="cart-add-left">
            <h2>Delivery Address</h2>

            {selectedAddress ? (
              <div className="cart-address-card active">
                <input type="radio" checked readOnly aria-label=".."/>
                <div>
                  <p> {selectedAddress.name} ({selectedAddress.type})</p>
                  <p>No {selectedAddress.flat},{selectedAddress.street},{selectedAddress.city},{selectedAddress.state},{selectedAddress.pincode}{selectedAddress.address}</p>
                  <p>{selectedAddress.mobile}</p>
                </div>
              </div>
            ) : (
              <p>No address selected</p>
            )}

            <div className="address-actions">
              <button onClick={() => navigate("/address")}>
                Select/Change Address
              </button>
              <button onClick={() => setShowForm(true)}>
  + Add New Address
</button>

            </div>
          </div>

          <div className="cart-right">
            <h3>Order Summary</h3>
            <div className="summary">
              <div className="row">
                <span>Cart Total (Excl. of all taxes)</span>
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
              <hr/>
              <div className="row total">
                <span>Total Amount</span>
                <span>₹ {finalTotal}</span>
              </div>
            </div>

            <button className="place-order-btn" onClick={() => navigate("/payment")}>
              CONTINUE TO PAYMENT
            </button>
          </div>
        </div>
      </div>
            <AddressFormModal
              open={showForm}
              onClose={() => setShowForm(false)}
              form={form}
              setForm={setForm}
              onSave={handleSave}
              isEdit={false}
            />

      <Footer />
    </>
  );
}
