import React from "react";
import "../src/styles/productgrid.css";
import { useCart } from "./context/CartContext";
import { useWishlist } from "./context/WishlistContext";
import { useNavigate } from "react-router-dom";
import { API_URLS } from "./API-Urls";
import { useEffect, useState } from "react";
  import flxseed from "../src/assets/flaxseed-flour.png";
  import jaggery from "../src/assets/jaggery.jpg";
  import green_tea from "../src/assets/green_tea.jpg";
  import plant_protein from "../src/assets/vegan.jpg";
  import rstdPmpkn from "../src/assets/rstdPmpkn.jpg";
  import wtr_mln from "../src/assets/wtr_mln.jpg";
  import grains from "../src/assets/grains.jpg";    
  import honey from "../src/assets/honey.jpg";


interface Product {
  id: number;
  category: string;
  title: string;
  desc: string;
  price: number;
  weight: string;
  img: string ;
}

const ProductGrid = () => {
  const { addToCart,isInCart } = useCart();
  // const { addToWishlist } = useWishlist();
   const { toggleWishlist, isInWishlist } = useWishlist();
   const navigate = useNavigate();
   const userId = localStorage.getItem("userId");
   const [products, setProducts] = useState<Product[]>([]);
   const [loading, setLoading] = useState(true);
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

 useEffect(() => {
  setLoading(true);

  fetch(`${API_URLS.BASE_URL}${API_URLS.PRODUCTS}`)
    .then((res) => res.json())
    .then((data) => {
      console.log("API DATA 👉", data);

      if (!Array.isArray(data)) {
        setProducts([]);
        return;
      }

      const mappedProducts: Product[] = data.map((item: any) => ({
        id: item.ProductID,
        category: item.CategoryName || "UNCATEGORIZED",
        title: item.ProductName,
        desc: item.ProductDescription,
        price: Number(item.Price) || 0,
        weight: item.ProductWeight || "",
        img: imageMap[item.ProductID] || plant_protein, 
      }));

      setProducts(mappedProducts);
    })
    .catch((err) => {
      console.error("API ERROR ❌", err);
      setProducts([]);
    })
    .finally(() => setLoading(false));
}, []);


{loading && <p>Loading products...</p>}

{!loading && products.length === 0 && (
  <p>No products found</p>
)}
 

  return (
    <>
    
    <section className="product-carousel">
        {products.map((item) => (
          <div key={item.id} className="card"> 
           <img
            src={item.img}
            alt={item.title}
            className="card-img"
          />

            <p className="category">{item.category}</p>
            <h2 className="title">{item.title}</h2>
            <p className="desc">{item.desc}</p>

            <div className="price-row">
              <span className="price">₹ {item.price}</span>
              <span className="weight">{item.weight}</span>
            </div>

            <div className="btn-row">
              {/* WISHLIST */}
              <button
                className={`wishlogo-prdct ${isInWishlist(item.id) ? "active" : "" }`}
                onClick={() => toggleWishlist(item)} aria-label=".."
              >
                <i className="fa-regular fa-heart"></i>
              </button>
  
              {/* CART */}
              <button
                className={`cart-addbtn ${
                  isInCart(item.id) ? "added" : ""
                }`}
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
          </div>
        ))}
      </section>


    <div className="wellness-wrapper">
      <div className="wellness-content">

        {/* LEFT TEXT */}
        <div className="wellness-left">
          <h2 className="wellness-title">WELLNESS BENEFITS</h2>
          <p className="wellness-desc">
            Each product is formulated to address specific health needs
          </p>
        </div>

        {/* RIGHT TAGS */}
        <div className="wellness-tags">

          <div className="tag-row">
            <div className="tag">BLOOD SUGAR CONTROL
                 <div className="sub-tag">LOW GI</div>
            </div>
          

            <div className="tag">HEART HEALTH
                <div className="sub-tag">OMEGA-3</div>
            </div>
            

            <div className="tag">IMMUNITY
                <div className="sub-tag">ANTIOXIDANTS</div>
            </div>
            
          </div>

          <div className="tag-row">
            <div className="tag">DIGESTIVE WELLNESS
                <div className="sub-tag">FIBRE</div>
            </div>
           

            <div className="tag">WEIGHT MANAGEMENT
                <div className="sub-tag">PROTEIN</div>
            </div>

            <div className="tag">HORMONAL BALANCE
                  <div className="sub-tag">MINERALS</div>
            </div>
            
          </div>

        </div>
      </div>
    </div>


    <div className="why-wrapper">

      {/* TOP HEADING */}
      <p className="why-subtitle">WHY BRIHATI</p>
      <h2 className="why-title">WHY CHOOSE US</h2>
      <p className="why-description">
        We're committed to delivering functional foods that nourish your body,
        support your health goals, and honor the rich traditions of Indian wellness.
      </p>

      {/* CARDS */}
      <div className="why-cards">

        {/* Card 1 */}
        <div className="why-card">
          <div className="icon-circle">
            <i className="fa-solid fa-leaf"></i> 
          </div>
          <h3 className="card-title">Clean Label</h3>
          <p className="card-desc">
            No preservatives, artificial colors, or refined sugars.
            Just pure, natural ingredients you can trust.
          </p>
        </div>

        {/* Card 2 */}
        <div className="why-card">
          <div className="icon-circle">
            <i className="fa-solid fa-award"></i>

          </div>
          <h3 className="card-title">Science-Backed</h3>
          <p className="card-desc">
            Every formulation is researched and validated by
            nutritional experts for maximum health benefits.
          </p>
        </div>

        {/* Card 3 */}
        <div className="why-card">
          <div className="icon-circle">
            <i className="fa-solid fa-users"></i>
          </div>
          <h3 className="card-title">Farmer Partnerships</h3>
          <p className="card-desc">
            Direct sourcing from Indian state farmers ensures
            quality and supports rural communities.
          </p>
        </div>
      {/* </div> */}
      {/* <br /> */}
      {/* <div className="why-cards"> */}

        {/* Card 4 */}
        <div className="why-card">
          <div className="icon-circle">
            <i className="fa-solid fa-heart"></i>

          </div>
          <h3 className="card-title">Health-Focused</h3>
          <p className="card-desc">
            Specifically designed for diabetes management, 
            heart health, immunity, and hormonal imbalance.
          </p>
        </div>

        {/* Card 5 */}
        <div className="why-card">
          <div className="icon-circle">
            <i className="fa-solid fa-shield"></i>

          </div>
          <h3 className="card-title">Quality Assured</h3>
          <p className="card-desc">
            DPIIT recognised startup with rigorous quality control
             and food safety standards.
          </p>
        </div>

        {/* Card 6 */}
        <div className="why-card">
          <div className="icon-circle">
            <i className="fa-solid fa-wand-magic-sparkles"></i>

          </div>
          <h3 className="card-title">Traditional Wisdom</h3>
          <p className="card-desc">
           Ancient Indian food knowledge combined with modern 
           nutritional science for optimal wellness.
          </p>
        </div>

      </div>
    </div>  
    </>
  );
};

export default ProductGrid;
