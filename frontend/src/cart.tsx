import "./styles/cart.css";
import Navbar from './Navbar/navbar';
import Footer from './footer';
import { useWishlist } from "./context/WishlistContext";
import { useCart } from "./context/CartContext";
import { useNavigate, useLocation } from "react-router-dom";

import honey from "../src/assets/honey.jpg";
import green_tea from "../src/assets/green_tea.jpg";
import plant_protein from "../src/assets/vegan.jpg";
import rstdPmpkn from "../src/assets/rstdPmpkn.jpg";
import flxseed from "../src/assets/flaxseed-flour.png";
import jaggery from "../src/assets/jaggery.jpg";
import wtr_mln from "../src/assets/wtr_mln.jpg";
import grains from "../src/assets/grains.jpg";
import { title } from "node:process";

export default function Cart() {

  const { cartItems, removeFromCart, increaseQty, decreaseQty,addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const total = cartItems.reduce((sum,item) => sum + item.price * item.qty,0 );
  const gst = total * 0.10;
  const finalTotal = total + gst;
  const navigate = useNavigate();
  const location = useLocation();

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
              <p className="empty-cart">Your cart is empty</p>) 
              :
               ( cartItems.map((item) => (
                <div key={item.cartId} className="cart-item">
                  <img src={item.img} className="cart-img" alt="not found"/>

                  <div className="cart-details">
                    <div> </div>
                    <h4>{item.title}</h4>
                    <p>{item.weight}</p>
                    <div className="qty-controls">
                      <button  onClick={() => decreaseQty(item.cartId)}>-</button>
                      <span>{item.qty}</span>
                      <button  onClick={() => increaseQty(item.cartId)}>+</button>
                      <button className="cart-delete" onClick={() => removeFromCart(item.cartId)}><i className="fa-regular fa-trash-can"></i></button>
                    </div>
                    <p className="wishlist">Move To Wishlist <button  className={`wishlogo-cart ${isInWishlist(item.id) ? "active" : ""}`}
                       onClick={() => toggleWishlist(item)}><i className="fa-regular fa-heart"></i> </button> </p>
                  </div>

                  <div className="cart-price">
                    <h4>₹ {item.price * item.qty}</h4>
                     <p>MRP incl. all taxes</p>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* RIGHT SIDE — PLACE ORDER (ALWAYS INCLUDED) */}
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
              <hr />
              <div className="row total">
                <span>Total Amount</span>
                <span>₹ {finalTotal}</span>
              </div>
            </div>
            <button className="place-order-btn"  onClick={() => navigate("/cart-address")} >PLACE ORDER</button>
            </div>
          </div>
            <div className="recommendations">
                    <h3>You May Also Like</h3>
            
                    <div className="products-carousel">
              {[
                 {
    id: 1,
    category: "FLAXSEED BLEND",
    title: "Flaxofeed Seed Powder",
    desc: "Roasted flaxseed blend rich in fibre,omega-3 and plant protein to support digestion,heart health and weight management.",
    price: "1",
    weight: "75 g",
      img: flxseed,
    link: "Nutrition facts",
  },
  {
    id: 2,
    category: "NATURAL SWEETENER",
    title: "Jaggery Powder",
    desc: "Pure, sulphur-free sugarcane jaggery powder rich in iron and minerals,an everyday alternative to refined sugar for chai and cooking.",
    price: "399",
    weight: "200 g",
    img: jaggery,
    link: "View recipes",
  },
  {
    id: 3,
    category: "HERBAL GREEN TEA",
    title: "Tranquil Bloom Green Tea",
    desc: "A calming blend of green tea and aromatic herbs to support detox, digestion and relaxation,perfect for daily stress relief.",
    price: "1299",
    weight: "20 g",
    img: green_tea,
    link: "Brew guide",
  },
  {
    id: 4,
    category: "VEGAN MINI MEAL",
    title: "Plant Protein Shake",
    desc: "Clean, dairy-free protein blend with quinoa, mint and herbs to support energy, muscle recovery and gut health — with no added sugar.",
    price: "99",
    weight: "50 g",
    img: plant_protein,
    link: "Details",
  },
   {
    id: 5,
    category: "SUPER SEEDS",
    title: "Roasted Pumpkin Seeds",
    desc: "Protein and magnesium-rich seeds that support heart health, immunity and digestion, ideal for snacking or topping salads and bowls.",
    price: "799",
    weight: "75 g",
    img: rstdPmpkn,
    link: "Nutrition facts",
  },
  {
    id: 6,
    category: "SUPER SEEDS",
    title: "Watermelon Seeds",
    desc: "Lightly crunchy, nutrient-dense seeds rich in plant protein, healthy fats and antioxidants for energy and skin wellness..",
    price: "799",
    weight: "200 g",
     img: wtr_mln,
    link: "View recipes",
  },
  {
    id: 7,
    category: "ANCIENT GRAIN",
    title: "Amaranth Puff",
    desc: "Gluten-free, protein-rich amaranth puffs perfect for snacking, breakfast bowls or as a crunchy topping packed with calcium and iron.",
    price: "1299",
    weight: "20 g",
     img: grains,
    link: "Brew guide",
  },
  {
    id: 8,
    category: "HONEY COLLECTION",
    title: "Artisanal Honey Spread",
    desc: "Luxuriously smooth honey, blended with natural ingredients for a rich, spreadable texture,full of enzymes, antioxidants and floral aroma.",
    price: "1499",
    weight: "20 g",
     img: honey,
    link: "Brew guide",
  }
              ].map((item, index) => (
                <div key={index} className="product-card">
                  <img src={item.img} alt={item.title} className="img-placeholder" />
                  <h4>{item.title}</h4>
                  <h3 className="price">₹ {item.price}</h3>
                  <button className="cart-add-btn" onClick={() =>  addToCart(item)}>Add To Cart</button>
                </div>
              ))}
            </div>
            
                  </div>
        </div>
      <Footer />
    </>
  );
}

