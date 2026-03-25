
// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { useNavigate } from "react-router-dom";
// import { API_URLS } from "./API-Urls";
// import Navbar from "./Navbar/navbar";
// import Footer from "./footer";
// import "./styles/productDetail.css";
// import { useCart } from "./context/CartContext";
// import { useWishlist } from "./context/WishlistContext";

// /* IMAGES (same as category page) */
// import flxseed from "../src/assets/flaxseed-flour.png";
// import jaggery from "../src/assets/jaggery.jpg";
// import green_tea from "../src/assets/green_tea.jpg";
// import plant_protein from "../src/assets/vegan.jpg";
// import rstdPmpkn from "../src/assets/rstdPmpkn.jpg";
// import wtr_mln from "../src/assets/wtr_mln.jpg";
// import grains from "../src/assets/grains.jpg";
// import honey from "../src/assets/honey.jpg";

// /* IMAGE MAP */
// const imageMap: Record<number, string> = {
//   12: flxseed,
//   13: wtr_mln,
//   14: rstdPmpkn,
//   15: wtr_mln,
//   16: grains,
//   21: grains,
//   25: jaggery,
//   26: honey,
//   28: green_tea,
//   29: plant_protein,
// };

// interface ProductAPI {
//   ProductID: number;
//   ProductName: string;
//   ProductDescription: string;
//   ProductWeight: number;
//   Price: number;
//   DiscountPrice: number;
// }

// const ProductDetail = () => {
//   const { id } = useParams();
//   const [product, setProduct] = useState<ProductAPI | null>(null);
//   const [qty, setQty] = useState(1);
//   const { addToCart,isInCart } = useCart();
//   const { toggleWishlist, isInWishlist } = useWishlist();
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetch(`${API_URLS.BASE_URL}products/${id}`)
//       .then(res => res.json())
//       .then(data => setProduct(data))
//       .catch(err => console.error("Product fetch error:", err));
//   }, [id]);

//   if (!product) return <p style={{ padding: 40 }}>Loading product...</p>;

//   const productImage = imageMap[product.ProductID] || plant_protein;

//   return (
//     <>
//       <Navbar />

//       <div className="pd-container">

//         {/* LEFT IMAGE */}
//         <div className="pd-left">
//           <img
//             src={productImage}
//             alt={product.ProductName}
//           />
//         </div>

//         {/* RIGHT INFO */}
//         <div className="pd-right">
//          <div className="pd-right-content">
//           <h1>{product.ProductName} <span className="pd-wght">({product.ProductWeight}gm)</span></h1>
//           <p className="pd-sub">Premium healthy and natural snack</p>
//           <div className="pd-price">
//             <span className="pd-mrp">₹{product.Price}</span>
//             <span className="pd-final">₹{product.DiscountPrice}</span>
//           </div>
//           {/* QUANTITY */}
//           <div className="pd-qty">
//             <button onClick={() => setQty(q => Math.max(1, q - 1))}>-</button>
//             <span>{qty}</span>
//             <button onClick={() => setQty(q => q + 1)}>+</button>
//           </div>
//           {/* ADD TO BAG */}
//           <div>
//            <button
//                     className="pd-btn"
//                     onClick={() => {
//                       if (isInCart(product.ProductID)) {
//                         navigate("/cart");
//                       } else {
//                         addToCart({
//                           id: product.ProductID,
//                           title: product.ProductName,
//                           price: product.Price,
//                           qty: 1,
//                           img: productImage,
//                           weight: product.ProductWeight,
//                         });
//                       }
//                     }}
//                   >
//                     {isInCart(product.ProductID) ? "✔ Go To Cart" : "Add To Cart"}
//                   </button>
//           <button
//   className={`plist-wish ${isInWishlist(product.ProductID) ? "active" : ""}`}
//   onClick={() =>
//     toggleWishlist({
//       id: product.ProductID,
//       title: product.ProductName,
//       price: product.DiscountPrice || product.Price,
//       img: productImage,
//       weight: product.ProductWeight,
//       desc: product.ProductDescription
//     })
//   }
// >
//   <i className="fa-regular fa-heart"></i>
// </button>
//           </div>         
//          </div>
         
//           <div className="pd-desc">
//             <p>{product.ProductDescription}</p>
//           </div>
//         </div>
//       </div>

//       <Footer />
//     </>
//   );
// };

// export default ProductDetail;

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API_URLS } from "./API-Urls";
import Navbar from "./Navbar/navbar";
import Footer from "./footer";
import "./styles/productDetail.css";
import { useCart } from "./context/CartContext";
import { useWishlist } from "./context/WishlistContext";
 import { toast } from "react-hot-toast";
 import { showToast } from "./components/CustomToast";
import tst_bfr from "./assets/toast_bfr_lgn.jpeg";
import add_cart from "./assets/add_cart.png";
import add_wish from  "./assets/add_wish.png";
import rem_wish from "./assets/remove_wish.png";

interface ProductAPI {
  ProductID: number;
  ProductName: string;
  ProductCategory: string;
  ProductDescription: string;
  ProductWeight: string;
  Price: number;
  DiscountPrice: number;
  Images: string[];
}

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, isInCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [product, setProduct] = useState<ProductAPI | null>(null);
  const [mainImage, setMainImage] = useState("");
  const [qty, setQty] = useState(1);

    const user = JSON.parse(localStorage.getItem("user") || "null");
  const userId = user?.UserID;

  useEffect(() => {
    fetch(`${API_URLS.BASE_URL}products/${id}`)
      .then(res => res.json())
      .then(response => {
        if (response.success) {
          setProduct(response.data);
          setMainImage(response.data.Images?.[0] || "");
        }
      })
      .catch(err => console.error(err));
  }, [id]);

  if (!product) return <p style={{ padding: 40 }}>Loading...</p>;

  return (
    <>
      <Navbar />

      <div className="pd-container">

        {/* LEFT SIDE */}
        {/* <div className="pd-left">

          <div className="pd-image-wrapper">
            {mainImage && (
              <img
                src={mainImage}
                alt={product.ProductName}
                className="pd-main-image"
              />
            )}
          </div>

          <div className="pd-thumbs">
            {product.Images?.map((img, index) => (
              <img
                key={index}
                src={img}
                alt="thumb"
                className={`pd-thumb ${mainImage === img ? "active" : ""}`}
                onClick={() => setMainImage(img)}
              />
            ))}
          </div>

        </div> */}
        <div className="pd-left">

  {/* Main Image */}
  <div className="pd-main-img">
    <img src={mainImage} alt="product" />
  </div>

   <div className="pd-thumbs">
    {product.Images.map((img, index) => (
      <div
        key={index}
        className={`pd-thumb ${mainImage === img ? "active" : ""}`}
        onClick={() => setMainImage(img)}
      >
        <img src={img} alt="thumb" />
      </div>
    ))}
  </div>


</div>

        {/* RIGHT SIDE */}
        <div className="pd-right">

          <h1>
            {product.ProductName}{" "}
          </h1>
<span className="pd-wght">({product.ProductWeight})</span>
          <div className="pd-price">
            <span className="pd-mrp">₹{product.Price}</span>
            <span className="pd-final">
              ₹{product.DiscountPrice || product.Price}
            </span>
          </div>

          {/* Quantity */}
          <div className="pd-qty">
            <button onClick={() => setQty(q => Math.max(1, q - 1))}>-</button>
            <span>{qty}</span>
            <button onClick={() => setQty(q => q + 1)}>+</button>
          </div>

          {/* Buttons */}
          <div className="pd-buttons">
            <button
              className="pd-btn"
              onClick={() => {
                  if (!userId) {
                                                showToast(
                                                  tst_bfr,
                                                  "Login Required",
                                                  "Please login to add items to cart",
                                                  "cart-login"
                                                );
                                                setTimeout(() => navigate("/login"), 1200);
                                                return;
                                              }
                if (isInCart(product.ProductID)) {
                  navigate("/cart");
                } else {
                  addToCart({
                    id: product.ProductID,
                    title: product.ProductName,
                    price: product.DiscountPrice || product.Price,
                    qty: qty,
                    img: mainImage,
                    weight: product.ProductWeight,
                  });
                                   showToast(
                                                    add_cart,
                                                    "Cart Updated",
                                                    "Item added to cart successfully",
                                                    "cart-added"
                                                  );                  

                }
              }}
            >
              {isInCart(product.ProductID)
                ? "✔ Go To Cart"
                : "Add To Cart"}
            </button>

           <button
  className={`plist-wish ${
    isInWishlist(product.ProductID) ? "active" : ""
  }`}
  onClick={() => {
      if (!userId) {
                                showToast(
                                  tst_bfr,
                                  "Login Required",
                                  "Please login to add items to wishlist ❤️",
                                  "wishlist-login"
                                );
                                setTimeout(() => navigate("/login"), 1200);
                                return;
                              }
   
    const alreadyInWishlist = isInWishlist(product.ProductID);

    toggleWishlist({
      id: product.ProductID,
      title: product.ProductName,
      category: product.ProductCategory,
      price: product.DiscountPrice || product.Price,
      img: mainImage,
      weight: product.ProductWeight,
      desc: product.ProductDescription,
    });

    if (alreadyInWishlist) {
        showToast(
                                      rem_wish,
                                      "Wishlist Updated",
                                      "Item removed from wishlist",
                                      "wishlist-action"
                                    );
    } else {
        showToast(
                                 add_wish,
                                 "Wishlist Updated",
                                 "Item added to wishlist successfully",
                                 "wishlist-action"
                               );
    }
  }}
>
  <i className="fa-regular fa-heart"></i>
</button>
             
          </div>

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