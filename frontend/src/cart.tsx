// import "./styles/cart.css";
// import Navbar from './Navbar/navbar';
// import Footer from './footer';
// import { useWishlist } from "./context/WishlistContext";
// import { useCart } from "./context/CartContext";
// import { useNavigate } from "react-router-dom";
// import { useEffect, useState } from "react";
// import { API_URLS } from "./API-Urls";

// interface ProductAPI {
//   ProductID: number;
//   ProductName: string;
//   ProductDescription: string;
//   ProductWeight: string;
//   Price: number;
//   DiscountPrice: number;
//   ProductImage: string | null;
//   ProductCategoryID: number;
// }

// export default function Cart() {

//   const { cartItems, removeFromCart, increaseQty, decreaseQty, addToCart, isInCart } = useCart();
//   const { toggleWishlist, isInWishlist } = useWishlist();
//   const navigate = useNavigate();

//   const [recommendedProducts, setRecommendedProducts] = useState<any[]>([]);

//   const total = cartItems.reduce((sum,item) => sum + item.price * item.qty,0 );
//   const gst = total * 0.10;
//   const finalTotal = total + gst;

//   /* ===============================
//      FETCH CATEGORY-BASED PRODUCTS
//      =============================== */
//   useEffect(() => {

//   const fetchRecommendations = async () => {

//     const userId = localStorage.getItem("userId");
//     if (!userId) return;

//     try {
//       const res = await fetch(
//         `${API_URLS.BASE_URL}cart/recommendations/${userId}`
//       );

//       const data = await res.json();

//       const mapped = data.map((item: ProductAPI) => ({
//         id: item.ProductID,
//         title: item.ProductName,
//         price: item.DiscountPrice || item.Price,
//         weight: item.ProductWeight,
//         img: item.ProductImage
//           ? `http://localhost:4000${item.ProductImage}`
//           : "https://via.placeholder.com/300"
//       }));

//       setRecommendedProducts(mapped);

//     } catch (error) {
//       console.error("Recommendation error:", error);
//     }
//   };

//   fetchRecommendations();

// }, [cartItems]);

//   return (
//     <>
//       <Navbar />

//       <div className="cart-page">

//         <div className="cart-steps">
//           <span className="active">My Cart</span>
//           <span className="dots">-----------------</span>
//           <span>Address</span>
//           <span className="dots">-----------------</span>
//           <span>Payment</span>
//         </div>

//         <div className="cart-content">

//           {/* LEFT SIDE */}
//           <div className="cart-left">
//             {cartItems.length === 0 ? (
//               <p className="empty-cart">Your cart is empty</p>
//             ) : (
//               cartItems.map((item) => (
//                 <div key={item.cartId} className="cart-item">

//                   <img src={item.img} className="cart-img" alt="not found"/>

//                   <div className="cart-details">
//                     <h4>{item.title}</h4>
//                     <p>{item.weight}</p>

//                     <div className="qty-controls">
//                       <button onClick={() => decreaseQty(item.cartId)}>-</button>
//                       <span>{item.qty}</span>
//                       <button onClick={() => increaseQty(item.cartId)}>+</button>
//                       <button
//                         className="cart-delete"
//                         onClick={() => removeFromCart(item.cartId)}
//                       >
//                         <i className="fa-regular fa-trash-can"></i>
//                       </button>
//                     </div>

//                     <p className="wishlist">
//                       Move To Wishlist
//                       <button
//                         className={`wishlogo-cart ${isInWishlist(item.id) ? "active" : ""}`}
//                         onClick={() => toggleWishlist(item)}
//                       >
//                         <i className="fa-regular fa-heart"></i>
//                       </button>
//                     </p>
//                   </div>

//                   <div className="cart-price">
//                     <h4>₹ {item.price * item.qty}</h4>
//                     <p>MRP incl. all taxes</p>
//                   </div>

//                 </div>
//               ))
//             )}
//           </div>

//           {/* RIGHT SIDE */}
//           <div className="cart-right">
//             <h3>Place Order</h3>

//             <div className="summary">
//               <div className="row">
//                 <span>Cart Total (Excl. of all taxes)</span>
//                 <span>₹ {total}</span>
//               </div>

//               <div className="row">
//                 <span>GST</span>
//                 <span>₹ {gst.toFixed(2)}</span>
//               </div>

//               <div className="row">
//                 <span>Shipping Charges</span>
//                 <span className="free">Free</span>
//               </div>

//               <hr />

//               <div className="row total">
//                 <span>Total Amount</span>
//                 <span>₹ {finalTotal}</span>
//               </div>
//             </div>

//             <button
//               className="place-order-btn"
//               onClick={() => navigate("/cart-address")}
//             >
//               PLACE ORDER
//             </button>

//           </div>
//         </div>

//         {/* ===============================
//             DYNAMIC RECOMMENDATIONS
//            =============================== */}

//         {recommendedProducts.length > 0 && (
//           <div className="recommendations">
//             <h3>You May Also Like</h3>

//             <div className="products-carousel">
//               {recommendedProducts.map((item, index) => (
//                 <div key={index} className="product-card">

//                   <img
//                     src={item.img}
//                     alt={item.title}
//                     className="img-placeholder"
//                   />

//                   <h4>{item.title}</h4>
//                   <h3 className="price">₹ {item.price}</h3>

//                   <button
//                     className="cart-add-btn"
//                     onClick={() => {
//                       if (isInCart(item.id)) {
//                         navigate("/cart");
//                       } else {
//                         addToCart({
//                           id: item.id,
//                           title: item.title,
//                           price: item.price,
//                           qty: 1,
//                           img: item.img,
//                           weight: item.weight,
//                         });
//                       }
//                     }}
//                   >
//                     {isInCart(item.id) ? "✔ Go To Cart" : "Add To Cart"}
//                   </button>

//                 </div>
//               ))}
//             </div>
//           </div>
//         )}

//       </div>

//       <Footer />
//     </>
//   );
// }


// ----------------dropdown coupons selection-------------//

// import "./styles/cart.css";
// import Navbar from "./Navbar/navbar";
// import Footer from "./footer";
// import { useWishlist } from "./context/WishlistContext";
// import { useCart } from "./context/CartContext";
// import { useNavigate } from "react-router-dom";
// import { useEffect, useState } from "react";
// import { API_URLS } from "./API-Urls";

// interface ProductAPI {
//   ProductID: number;
//   ProductName: string;
//   ProductDescription: string;
//   ProductWeight: string;
//   Price: number;
//   DiscountPrice: number;
//   ProductImage: string | null;
//   ProductCategoryID: number;
// }

// export default function Cart() {

//   const { cartItems, removeFromCart, increaseQty, decreaseQty, addToCart, isInCart } = useCart();
//   const { toggleWishlist, isInWishlist } = useWishlist();
//   const navigate = useNavigate();

//   const [recommendedProducts, setRecommendedProducts] = useState<any[]>([]);
//   const [coupons, setCoupons] = useState<any[]>([]);
//   const [selectedCoupon, setSelectedCoupon] = useState<any>(null);
//   const [discountAmount, setDiscountAmount] = useState(0);
//   const [couponMessage, setCouponMessage] = useState("");

//   const total = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
//   const gst = total * 0.10;
//   const finalTotal = total + gst - discountAmount;

//   /* ===============================
//      FETCH COUPONS
//      =============================== */

//   useEffect(() => {

//     const fetchCoupons = async () => {
//       try {

//         const res = await fetch(`${API_URLS.BASE_URL}discounts`);
//         const data = await res.json();

//         if (data.success) {
//           setCoupons(data.data);
//         }

//       } catch (err) {
//         console.log("Coupon fetch error", err);
//       }
//     };

//     fetchCoupons();

//   }, []);


//   const applyCoupon = () => {

//   if (!selectedCoupon) {
//     setCouponMessage("Please select a coupon");
//     return;
//   }

//   const minOrder = Number(selectedCoupon.MinOrderValue || selectedCoupon.MinOrderAmount || 0);
//   const discountValue = Number(selectedCoupon.DiscountValue || 0);
//   const maxDiscount = Number(selectedCoupon.MaxDiscount || 0);

//   /* MIN ORDER VALIDATION */

//   if (total < minOrder) {

//     const remaining = minOrder - total;

//     setCouponMessage(
//       `Add products worth ₹${remaining} more to apply this coupon`
//     );

//     setDiscountAmount(0);
//     return;
//   }

//   let discount = 0;

//   /* FLAT DISCOUNT */

//   if (selectedCoupon.DiscountType === "Flat") {

//     discount = discountValue;

//   }

//   /* PERCENTAGE DISCOUNT */

//   else {

//     discount = (total * discountValue) / 100;

//     if (maxDiscount > 0) {
//       discount = Math.min(discount, maxDiscount);
//     }

//   }

//   setDiscountAmount(discount);

//   setCouponMessage(`Coupon Applied! You saved ₹${discount}`);

// };

//   /* ===============================
//      FETCH CATEGORY-BASED PRODUCTS
//      =============================== */

//   useEffect(() => {

//     const fetchRecommendations = async () => {

//       const userId = localStorage.getItem("userId");
//       if (!userId) return;

//       try {
//         const res = await fetch(
//           `${API_URLS.BASE_URL}cart/recommendations/${userId}`
//         );

//         const data = await res.json();

//         const mapped = data.map((item: ProductAPI) => ({
//           id: item.ProductID,
//           title: item.ProductName,
//           price: item.DiscountPrice || item.Price,
//           weight: item.ProductWeight,
//           img: item.ProductImage
//             ? `http://localhost:4000${item.ProductImage}`
//             : "https://via.placeholder.com/300"
//         }));

//         setRecommendedProducts(mapped);

//       } catch (error) {
//         console.error("Recommendation error:", error);
//       }
//     };

//     fetchRecommendations();

//   }, [cartItems]);

//   return (
//     <>
//       <Navbar />

//       <div className="cart-page">

//         <div className="cart-steps">
//           <span className="active">My Cart</span>
//           <span className="dots">-----------------</span>
//           <span>Address</span>
//           <span className="dots">-----------------</span>
//           <span>Payment</span>
//         </div>

//         <div className="cart-content">

//           {/* LEFT SIDE */}

//           <div className="cart-left">
//             {cartItems.length === 0 ? (
//               <p className="empty-cart">Your cart is empty</p>
//             ) : (
//               cartItems.map((item) => (
//                 <div key={item.cartId} className="cart-item">

//                   <img src={item.img} className="cart-img" alt="not found" />

//                   <div className="cart-details">

//                     <h4>{item.title}</h4>
//                     <p>{item.weight}</p>

//                     <div className="qty-controls">
//                       <button onClick={() => decreaseQty(item.cartId)}>-</button>
//                       <span>{item.qty}</span>
//                       <button onClick={() => increaseQty(item.cartId)}>+</button>

//                       <button
//                         className="cart-delete"
//                         onClick={() => removeFromCart(item.cartId)}
//                       >
//                         <i className="fa-regular fa-trash-can"></i>
//                       </button>

//                     </div>

//                     <p className="wishlist">
//                       Move To Wishlist
//                       <button
//                         className={`wishlogo-cart ${isInWishlist(item.id) ? "active" : ""}`}
//                         onClick={() => toggleWishlist(item)}
//                       >
//                         <i className="fa-regular fa-heart"></i>
//                       </button>
//                     </p>

//                   </div>

//                   <div className="cart-price">
//                     <h4>₹ {item.price * item.qty}</h4>
//                     <p>MRP incl. all taxes</p>
//                   </div>

//                 </div>
//               ))
//             )}
//           </div>

//           {/* RIGHT SIDE */}

//           <div className="cart-right">

//             <h3>Place Order</h3>

//             <div className="summary">

//               <div className="row">
//                 <span>Cart Total (Excl. of all taxes)</span>
//                 <span>₹ {total}</span>
//               </div>

//               <div className="row">
//                 <span>GST</span>
//                 <span>₹ {gst.toFixed(2)}</span>
//               </div>

//               <div className="row">
//                 <span>Shipping Charges</span>
//                 <span className="free">Free</span>
//               </div>

//               {/* COUPON SECTION */}

//               <div className="coupon-section">

//                 <h4>Coupons</h4>

//                 <div className="coupon-input-row">

//                   <select
//                     className="coupon-dropdown"
//                     onChange={(e) => {

//                       const cp = coupons.find(
//                         (c: any) => c.CouponCode === e.target.value
//                       );

//                       setSelectedCoupon(cp);
//                       setCouponMessage("");

//                     }}
//                   >

//                     <option value="">Select Coupon</option>

//                     {coupons.map((coupon) => (

//                       <option key={coupon.DiscountID} value={coupon.CouponCode}>

//                         {coupon.CouponCode} - {coupon.DiscountType === "Flat"
//                           ? `₹${coupon.DiscountValue} OFF`
//                           : `${coupon.DiscountValue}% OFF`}

//                       </option>

//                     ))}

//                   </select>

//                   <button className="apply-btn" onClick={applyCoupon}>
//                     Apply
//                   </button>

//                 </div>

//                 {couponMessage && (
//                   <p className="coupon-message">{couponMessage}</p>
//                 )}

//               </div>

//               {discountAmount > 0 && (

//                 <div className="row discount">
//                   <span>Coupon Discount</span>
//                   <span>- ₹ {discountAmount}</span>
//                 </div>

//               )}

//               <hr />

//               <div className="row total">
//                 <span>Total Amount</span>
//                 <span>₹ {finalTotal.toFixed(2)}</span>
//               </div>

//             </div>

//             <button
//               className="place-order-btn"
//               onClick={() => navigate("/cart-address")}
//             >
//               PLACE ORDER
//             </button>

//           </div>

//         </div>

//         {/* RECOMMENDATIONS */}

//         {recommendedProducts.length > 0 && (
//           <div className="recommendations">

//             <h3>You May Also Like</h3>

//             <div className="products-carousel">

//               {recommendedProducts.map((item, index) => (

//                 <div key={index} className="product-card">

//                   <img
//                     src={item.img}
//                     alt={item.title}
//                     className="img-placeholder"
//                   />

//                   <h4>{item.title}</h4>
//                   <h3 className="price">₹ {item.price}</h3>

//                   <button
//                     className="cart-add-btn"
//                     onClick={() => {

//                       if (isInCart(item.id)) {

//                         navigate("/cart");

//                       } else {

//                         addToCart({
//                           id: item.id,
//                           title: item.title,
//                           price: item.price,
//                           qty: 1,
//                           img: item.img,
//                           weight: item.weight,
//                         });

//                       }

//                     }}
//                   >
//                     {isInCart(item.id) ? "✔ Go To Cart" : "Add To Cart"}
//                   </button>

//                 </div>

//               ))}

//             </div>

//           </div>
//         )}

//       </div>

//       <Footer />

//     </>
//   );
// }


import "./styles/cart.css";
import Navbar from "./Navbar/navbar";
import Footer from "./footer";
import { useWishlist } from "./context/WishlistContext";
import { useCart } from "./context/CartContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { API_URLS } from "./API-Urls";

interface ProductAPI {
  ProductID: number;
  ProductName: string;
  ProductDescription: string;
  ProductWeight: string;
  Price: number;
  DiscountPrice: number;
  ProductImage: string | null;
  ProductCategoryID: number;
}

export default function Cart() {

  const { cartItems, removeFromCart, increaseQty, decreaseQty, addToCart, isInCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const navigate = useNavigate();

  const [recommendedProducts, setRecommendedProducts] = useState<any[]>([]);
  const [coupons, setCoupons] = useState<any[]>([]);
  const [couponInput, setCouponInput] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);
  const [couponMessage, setCouponMessage] = useState("");

  /* NEW STATES */
  const [autoDiscount, setAutoDiscount] = useState(0);
  const [autoDiscountLabel, setAutoDiscountLabel] = useState("");

  const total = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  const gst = total * 0.10;

  const finalTotal = total + gst - discountAmount - autoDiscount;

  /* ===============================
     FETCH COUPONS
     =============================== */

  useEffect(() => {

    const fetchCoupons = async () => {

      try {

        const res = await fetch(`${API_URLS.BASE_URL}discounts`);
        const data = await res.json();

        if (data.success) {
          setCoupons(data.data);
        }

      } catch (err) {
        console.log("Coupon fetch error", err);
      }

    };

    fetchCoupons();

  }, []);

  /* ===============================
     AUTO OPENING OFFER
     =============================== */

  useEffect(() => {

    if (coupons.length === 0) return;

    const auto = coupons.find(
      (c:any) => !c.CouponCode || c.CouponCode.trim() === ""
    );

    if (!auto) return;

    const discountValue = Number(auto.DiscountValue || 0);
    const maxDiscount = Number(auto.MaxDiscount || 0);

    let discount = 0;

    if (auto.DiscountType === "Flat") {

      discount = discountValue;
      setAutoDiscountLabel(`Discount ₹(${discountValue})`);

    } else {

      discount = (total * discountValue) / 100;

      if (maxDiscount > 0) {
        discount = Math.min(discount, maxDiscount);
      }

      setAutoDiscountLabel(`Discount ${discountValue}% `);
    }

    setAutoDiscount(discount);

  }, [coupons, total]);

  /* ===============================
     APPLY COUPON
     =============================== */

  const applyCoupon = () => {

    if (!couponInput) {
      setCouponMessage("Please enter coupon code");
      return;
    }

    const cp = coupons.find(
      (c:any) =>
        c.CouponCode &&
        c.CouponCode.toLowerCase() === couponInput.toLowerCase()
    );

    if (!cp) {
      setCouponMessage("Invalid coupon code");
      setDiscountAmount(0);
      return;
    }

    const minOrder = Number(cp.MinOrderValue || cp.MinOrderAmount || 0);
    const discountValue = Number(cp.DiscountValue || 0);
    const maxDiscount = Number(cp.MaxDiscount || 0);

    if (total < minOrder) {

      const remaining = minOrder - total;

      setCouponMessage(
        `Add products worth ₹${remaining} more to apply this coupon`
      );

      setDiscountAmount(0);
      return;
    }

    let discount = 0;

    if (cp.DiscountType === "Flat") {

      discount = discountValue;

    } else {

      discount = (total * discountValue) / 100;

      if (maxDiscount > 0) {
        discount = Math.min(discount, maxDiscount);
      }

    }

    setDiscountAmount(discount);
    setCouponMessage(`Coupon Applied! You saved ₹${discount}`);

  };

  /* ===============================
     FETCH RECOMMENDATIONS
     =============================== */

  useEffect(() => {

    const fetchRecommendations = async () => {

      const userId = localStorage.getItem("userId");
      if (!userId) return;

      try {

        const res = await fetch(
          `${API_URLS.BASE_URL}cart/recommendations/${userId}`
        );

        const data = await res.json();

        const mapped = data.map((item: ProductAPI) => ({
          id: item.ProductID,
          title: item.ProductName,
          price: item.DiscountPrice || item.Price,
          weight: item.ProductWeight,
          img: item.ProductImage
            ? `http://localhost:4000${item.ProductImage}`
            : "https://via.placeholder.com/300"
        }));

        setRecommendedProducts(mapped);

      } catch (error) {
        console.error("Recommendation error:", error);
      }

    };

    fetchRecommendations();

  }, [cartItems]);

  return (
    <>
      <Navbar />

      <div className="cart-page">

        <div className="cart-steps">
          <span className="active">My Cart</span>
          <span className="dots">-----------------</span>
          <span>Address</span>
          <span className="dots">-----------------</span>
          <span>Payment</span>
        </div>

        <div className="cart-content">

          {/* LEFT SIDE */}

          <div className="cart-left">

            {cartItems.length === 0 ? (
              <p className="empty-cart">Your cart is empty</p>
            ) : (

              cartItems.map((item) => (

                <div key={item.cartId} className="cart-item">

                  <img src={item.img} className="cart-img" alt="not found" />

                  <div className="cart-details">

                    <h4>{item.title}</h4>
                    <p>{item.weight}</p>

                    <div className="qty-controls">
                      <button onClick={() => decreaseQty(item.cartId)}>-</button>
                      <span>{item.qty}</span>
                      <button onClick={() => increaseQty(item.cartId)}>+</button>

                      <button
                        className="cart-delete"
                        onClick={() => removeFromCart(item.cartId)}
                      >
                        <i className="fa-regular fa-trash-can"></i>
                      </button>
                    </div>

                    <p className="wishlist">
                      Move To Wishlist
                      <button
                        className={`wishlogo-cart ${isInWishlist(item.id) ? "active" : ""}`}
                        onClick={() => toggleWishlist(item)}
                      >
                        <i className="fa-regular fa-heart"></i>
                      </button>
                    </p>

                  </div>

                  <div className="cart-price">
                    <h4>₹ {item.price * item.qty}</h4>
                    <p>MRP incl. all taxes</p>
                  </div>

                </div>

              ))

            )}

          </div>

          {/* RIGHT SIDE */}

          <div className="cart-right">

            <h3>Place Order</h3>

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

              {/* OPENING OFFER */}

              {autoDiscount > 0 && (

                <div className="row discount">
                  <span style={{ fontWeight: 600 }}>{autoDiscountLabel}</span>
                  <span>- ₹ {autoDiscount.toFixed(2)}</span>
                </div>

              )}

              {/* COUPON SECTION */}

              <div className="coupon-section">

                <h4>Coupons</h4>

                <div className="coupon-input-row">

                  <input
                    type="text"
                    className="coupon-input"
                    placeholder="Enter coupon code"
                    value={couponInput}
                    onChange={(e)=>setCouponInput(e.target.value)}
                  />

                  <button
                    className="apply-btn"
                    onClick={applyCoupon}
                  >
                    Apply
                  </button>

                </div>

                {/* {couponMessage && couponInput && (
                  <p className="coupon-message">{couponMessage}</p>
                )} */}

                {couponMessage && couponInput && (

  <p
    className="coupon-message"
    style={{
      fontSize: "15px",
      color:
        couponMessage.includes("Applied")
          ? "green"
          : "red"
    }}
  >
    {couponMessage}
  </p>

)}

              </div>

              {/* COUPON DISCOUNT */}

              {discountAmount > 0 && couponInput && (

                <div className="row discount">
                  <span>Coupon Discount</span>
                  <span>- ₹ {discountAmount}</span>
                </div>

              )}

              <hr />

              <div className="row total">
                <span>Total Amount</span>
                <span>₹ {finalTotal.toFixed(2)}</span>
              </div>

            </div>

            <button
              className="place-order-btn"
              onClick={() => navigate("/cart-address")}
            >
              PLACE ORDER
            </button>

          </div>

        </div>

        {/* RECOMMENDATIONS */}

        {recommendedProducts.length > 0 && (

          <div className="recommendations">

            <h3>You May Also Like</h3>

            <div className="products-carousel">

              {recommendedProducts.map((item, index) => (

                <div key={index} className="product-card">

                  <img
                    src={item.img}
                    alt={item.title}
                    className="img-placeholder"
                  />

                  <h4>{item.title}</h4>
                  <h3 className="price">₹ {item.price}</h3>

                  <button
                    className="cart-add-btn"
                    onClick={() => {

                      if (isInCart(item.id)) {

                        navigate("/cart");

                      } else {

                        addToCart({
                          id: item.id,
                          title: item.title,
                          price: item.price,
                          qty: 1,
                          img: item.img,
                          weight: item.weight,
                        });

                      }

                    }}
                  >
                    {isInCart(item.id) ? "✔ Go To Cart" : "Add To Cart"}
                  </button>

                </div>

              ))}

            </div>

          </div>

        )}

      </div>

      <Footer />
    </>
  );
}
