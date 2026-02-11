
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { API_URLS } from "./API-Urls";
import Navbar from "./Navbar/navbar";
import Footer from "./footer";
import "./styles/productDetail.css";
import { useCart } from "./context/CartContext";
import { useWishlist } from "./context/WishlistContext";

/* IMAGES (same as category page) */
import flxseed from "../src/assets/flaxseed-flour.png";
import jaggery from "../src/assets/jaggery.jpg";
import green_tea from "../src/assets/green_tea.jpg";
import plant_protein from "../src/assets/vegan.jpg";
import rstdPmpkn from "../src/assets/rstdPmpkn.jpg";
import wtr_mln from "../src/assets/wtr_mln.jpg";
import grains from "../src/assets/grains.jpg";
import honey from "../src/assets/honey.jpg";

/* IMAGE MAP */
const imageMap: Record<number, string> = {
  12: flxseed,
  13: wtr_mln,
  14: rstdPmpkn,
  15: wtr_mln,
  16: grains,
  21: grains,
  25: jaggery,
  26: honey,
  28: green_tea,
  29: plant_protein,
};

interface ProductAPI {
  ProductID: number;
  ProductName: string;
  ProductDescription: string;
  ProductWeight: number;
  Price: number;
  DiscountPrice: number;
}

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<ProductAPI | null>(null);
  const [qty, setQty] = useState(1);
  const { addToCart,isInCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API_URLS.BASE_URL}products/${id}`)
      .then(res => res.json())
      .then(data => setProduct(data))
      .catch(err => console.error("Product fetch error:", err));
  }, [id]);

  if (!product) return <p style={{ padding: 40 }}>Loading product...</p>;

  const productImage = imageMap[product.ProductID] || plant_protein;

  return (
    <>
      <Navbar />

      <div className="pd-container">

        {/* LEFT IMAGE */}
        <div className="pd-left">
          <img
            src={productImage}
            alt={product.ProductName}
          />
        </div>

        {/* RIGHT INFO */}
        <div className="pd-right">
         <div className="pd-right-content">
          <h1>{product.ProductName} <span className="pd-wght">({product.ProductWeight}gm)</span></h1>
          <p className="pd-sub">Premium healthy and natural snack</p>
          <div className="pd-price">
            <span className="pd-mrp">₹{product.Price}</span>
            {/* <span className="pd-final">₹{product.DiscountPrice}</span> */}
          </div>
          {/* QUANTITY */}
          <div className="pd-qty">
            <button onClick={() => setQty(q => Math.max(1, q - 1))}>-</button>
            <span>{qty}</span>
            <button onClick={() => setQty(q => q + 1)}>+</button>
          </div>
          {/* ADD TO BAG */}
          <div>
             {/* <button
            className="pd-btn"
            onClick={() =>
              addToCart({
                id: product.ProductID,
                title: product.ProductName,
                price: product.DiscountPrice || product.Price,
                qty,
                img: productImage,
                weight: product.ProductWeight  })} >    {isInCart(item.id) ? "✔ Go To Cart" : "Add To Cart"}
          </button>  */}
           <button
                    className="pd-btn"
                    onClick={() => {
                      if (isInCart(product.ProductID)) {
                        navigate("/cart");
                      } else {
                        addToCart({
                          id: product.ProductID,
                          title: product.ProductName,
                          price: product.Price,
                          qty: 1,
                          img: productImage,
                          weight: product.ProductWeight,
                        });
                      }
                    }}
                  >
                    {isInCart(product.ProductID) ? "✔ Go To Cart" : "Add To Cart"}
                  </button>
          <button
  className={`plist-wish ${isInWishlist(product.ProductID) ? "active" : ""}`}
  onClick={() =>
    toggleWishlist({
      id: product.ProductID,
      title: product.ProductName,
      price: product.DiscountPrice || product.Price,
      img: productImage,
      weight: product.ProductWeight,
      desc: product.ProductDescription
    })
  }
>
  <i className="fa-regular fa-heart"></i>
</button>

          </div>
         
         </div>
         
          {/* DESCRIPTION */}
          <div className="pd-desc">
            <p>{product.ProductDescription}</p>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default ProductDetail;
