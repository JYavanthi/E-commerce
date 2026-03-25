// import React from "react";
// import "../src/styles/productgrid.css";
// import { useCart } from "./context/CartContext";
// import { useWishlist } from "./context/WishlistContext";
// import { useNavigate } from "react-router-dom";
// import { API_URLS } from "./API-Urls";
// import { useEffect, useState } from "react";
//  import { toast } from "react-hot-toast";

// interface Product {
//   id: number;
//   category: string;
//   title: string;
//   desc: string;
//   price: number;
//   weight: string;
//   img: string ;
// }

// const ProductGrid = () => {
//   const { addToCart,isInCart } = useCart();
//   // const { addToWishlist } = useWishlist();
//    const { toggleWishlist, isInWishlist } = useWishlist();
//    const navigate = useNavigate();
//   //  const userId = localStorage.getItem("userId");
//    const [products, setProducts] = useState<Product[]>([]);
//    const [loading, setLoading] = useState(true);
//    const [userId, setUserId] = useState(localStorage.getItem("userId"));

// useEffect(() => {
//   const updateUser = () => {
//     setUserId(localStorage.getItem("userId"));
//   };

//   window.addEventListener("userChanged", updateUser);
//   return () => window.removeEventListener("userChanged", updateUser);
// }, []);
 

// useEffect(() => {
//   setLoading(true);

//   fetch(`${API_URLS.BASE_URL}${API_URLS.PRODUCTS}`)
//     .then((res) => res.json())
//     .then((response) => {
//       console.log("API DATA 👉", response);

//       if (!response.success || !Array.isArray(response.data)) {
//         setProducts([]);
//         return;
//       }

//       const mappedProducts: Product[] = response.data.map((item: any) => ({
//         id: item.ProductID,
//         category: item.CategoryName || "UNCATEGORIZED",
//         title: item.ProductName,
//         desc: item.ProductDescription,
//         price: Number(item.Price) || 0,
//         DiscountPrice:Number(item.DiscountPrice) || 0,
//         weight: item.ProductWeight || "",
//         img: item.ImageUrl || imageMap[item.ProductID] 
//       }));

//       setProducts(mappedProducts);
//     })
//     .catch((err) => {
//       console.error("API ERROR ❌", err);
//       setProducts([]);
//     })
//     .finally(() => setLoading(false));
// }, []);


// {loading && <p>Loading products...</p>}

// {!loading && products.length === 0 && (
//   <p>No products found</p>
// )}
 

//   return (
//     <>
    
//     <section className="product-carousel">
//         {products.map((item) => (
//           <div key={item.id} className="card"> 
//            <img
//             src={item.img}
//             alt={item.title}
//             className="card-img"
//           />

//             <p className="category">{item.category}</p>
//             <h2 className="title">{item.title}</h2>
//             <p className="desc">{item.desc}</p>

//             <div className="price-row">
//               <span className="price">₹ {item.price}</span>
//               <span className="weight">{item.weight}</span>
//             </div>

//             <div className="btn-row">
//               {/* WISHLIST */}
//               <button
//                 className={`wishlogo-prdct ${isInWishlist(item.id) ? "active" : "" }`}
//                 // onClick={() => toggleWishlist(item)} aria-label=".."
//                 onClick={() => {
//   if (!userId) {
//     toast.error("Please login to add items to wishlist");
//     setTimeout(() => navigate("/login"), 1200); 
//     return;
//   }
//   toggleWishlist(item);
// }}
//               >
//                 <i className="fa-regular fa-heart"></i>
//               </button>
  
//               {/* CART */}
//               <button
//                 className={`cart-addbtn ${
//                   isInCart(item.id) ? "added" : ""
//                 }`}
//                 // onClick={() => {
//                 //   if (isInCart(item.id)) {
//                 //     navigate("/cart");
//                 //   } else {
//                 //     addToCart({
//                 //       id: item.id,
//                 //       title: item.title,
//                 //       price: item.price,
//                 //       qty: 1,
//                 //       img: item.img,
//                 //       weight: item.weight,
//                 //     });
//                 //   }
//                 // }}
//                 onClick={() => {
//   if (!userId) {
//     toast.error("Please login to add items to cart");
//     setTimeout(() => navigate("/login"), 1200); // optional
//     return;
//   }

//   if (isInCart(item.id)) {
//     navigate("/cart");
//   } else {
//     addToCart({
//       id: item.id,
//       title: item.title,
//       price: item.price,
//       qty: 1,
//       img: item.img,
//       weight: item.weight,
//     });

//     toast.success("Item added to cart ✅"); // optional success message
//   }
// }}
//               >
//                 {isInCart(item.id) ? "✔ Go To Cart" : "Add To Cart"}
//               </button>

//             </div>
//           </div>
//         ))}
//       </section>


//     <div className="wellness-wrapper">
//       <div className="wellness-content">

//         {/* LEFT TEXT */}
//         <div className="wellness-left">
//           <h2 className="wellness-title">WELLNESS BENEFITS</h2>
//           <p className="wellness-desc">
//             Each product is formulated to address specific health needs
//           </p>
//         </div>

//         {/* RIGHT TAGS */}
//         <div className="wellness-tags">

//           <div className="tag-row">
//             <div className="tag">BLOOD SUGAR CONTROL
//                  <div className="sub-tag">LOW GI</div>
//             </div>
          

//             <div className="tag">HEART HEALTH
//                 <div className="sub-tag">OMEGA-3</div>
//             </div>
            

//             <div className="tag">IMMUNITY
//                 <div className="sub-tag">ANTIOXIDANTS</div>
//             </div>
            
//           </div>

//           <div className="tag-row">
//             <div className="tag">DIGESTIVE WELLNESS
//                 <div className="sub-tag">FIBRE</div>
//             </div>
           

//             <div className="tag">WEIGHT MANAGEMENT
//                 <div className="sub-tag">PROTEIN</div>
//             </div>

//             <div className="tag">HORMONAL BALANCE
//                   <div className="sub-tag">MINERALS</div>
//             </div>
            
//           </div>

//         </div>
//       </div>
//     </div>


//     <div className="why-wrapper">

//       {/* TOP HEADING */}
//       <p className="why-subtitle">WHY BRIHATI</p>
//       <h2 className="why-title">WHY CHOOSE US</h2>
//       <p className="why-description">
//         We're committed to delivering functional foods that nourish your body,
//         support your health goals, and honor the rich traditions of Indian wellness.
//       </p>

//       {/* CARDS */}
//       <div className="why-cards">

//         {/* Card 1 */}
//         <div className="why-card">
//           <div className="icon-circle">
//             <i className="fa-solid fa-leaf"></i> 
//           </div>
//           <h3 className="card-title">Clean Label</h3>
//           <p className="card-desc">
//             No preservatives, artificial colors, or refined sugars.
//             Just pure, natural ingredients you can trust.
//           </p>
//         </div>

//         {/* Card 2 */}
//         <div className="why-card">
//           <div className="icon-circle">
//             <i className="fa-solid fa-award"></i>

//           </div>
//           <h3 className="card-title">Science-Backed</h3>
//           <p className="card-desc">
//             Every formulation is researched and validated by
//             nutritional experts for maximum health benefits.
//           </p>
//         </div>

//         {/* Card 3 */}
//         <div className="why-card">
//           <div className="icon-circle">
//             <i className="fa-solid fa-users"></i>
//           </div>
//           <h3 className="card-title">Farmer Partnerships</h3>
//           <p className="card-desc">
//             Direct sourcing from Indian state farmers ensures
//             quality and supports rural communities.
//           </p>
//         </div>
//       {/* </div> */}
//       {/* <br /> */}
//       {/* <div className="why-cards"> */}

//         {/* Card 4 */}
//         <div className="why-card">
//           <div className="icon-circle">
//             <i className="fa-solid fa-heart"></i>

//           </div>
//           <h3 className="card-title">Health-Focused</h3>
//           <p className="card-desc">
//             Specifically designed for diabetes management, 
//             heart health, immunity, and hormonal imbalance.
//           </p>
//         </div>

//         {/* Card 5 */}
//         <div className="why-card">
//           <div className="icon-circle">
//             <i className="fa-solid fa-shield"></i>

//           </div>
//           <h3 className="card-title">Quality Assured</h3>
//           <p className="card-desc">
//             DPIIT recognised startup with rigorous quality control
//              and food safety standards.
//           </p>
//         </div>

//         {/* Card 6 */}
//         <div className="why-card">
//           <div className="icon-circle">
//             <i className="fa-solid fa-wand-magic-sparkles"></i>

//           </div>
//           <h3 className="card-title">Traditional Wisdom</h3>
//           <p className="card-desc">
//            Ancient Indian food knowledge combined with modern 
//            nutritional science for optimal wellness.
//           </p>
//         </div>

//       </div>
//     </div>  
//     </>
//   );
// };

// export default ProductGrid;


import React, { useEffect, useState, useRef } from "react";
import "../src/styles/productgrid.css";
import { useCart } from "./context/CartContext";
import { useWishlist } from "./context/WishlistContext";
import { useNavigate } from "react-router-dom";
import { API_URLS } from "./API-Urls";
import { toast } from "react-hot-toast";
import { showToast } from "./components/CustomToast";
import tst_bfr from "./assets/toast_bfr_lgn.jpeg";
import add_cart from "./assets/add_cart.png";
import add_wish from  "./assets/add_wish.png";
import rem_wish from "./assets/remove_wish.png";

interface Product {
  id: number;
  category: string;
  title: string;
  desc: string;
  price: number;
  weight: string;
  img: string;
}

const ProductGrid = () => {
  const { addToCart, isInCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const navigate = useNavigate();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(localStorage.getItem("userId"));

  // 🔥 Carousel Ref
  const carouselRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    carouselRef.current?.scrollBy({ left: -300, behavior: "smooth" });
  };

  const scrollRight = () => {
    carouselRef.current?.scrollBy({ left: 300, behavior: "smooth" });
  };

  useEffect(() => {
    const updateUser = () => {
      setUserId(localStorage.getItem("userId"));
    };

    window.addEventListener("userChanged", updateUser);
    return () => window.removeEventListener("userChanged", updateUser);
  }, []);

  useEffect(() => {
    setLoading(true);

    fetch(`${API_URLS.BASE_URL}${API_URLS.PRODUCTS}`)
      .then((res) => res.json())
      .then((response) => {
        if (!response.success || !Array.isArray(response.data)) {
          setProducts([]);
          return;
        }

        const mappedProducts: Product[] = response.data.map((item: any) => ({
          id: item.ProductID,
          category: item.CategoryName || "UNCATEGORIZED",
          title: item.ProductName,
          desc: item.ProductDescription,
          price: Number(item.Price) || 0,
          weight: item.ProductWeight || "",
          img: item.ImageUrl || "",
        }));

        setProducts(mappedProducts);
      })
      .catch((err) => {
        console.error("API ERROR ❌", err);
        setProducts([]);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      {/* 🔥 CAROUSEL WITH BUTTONS */}
      <div className="carousel-wrapper">

        <button className="carousel-btn left" onClick={scrollLeft}>
          ❮
        </button>

        <section className="product-carousel" ref={carouselRef}>
          {loading && <p>Loading products...</p>}

          {!loading && products.length === 0 && <p>No products found</p>}

          {products.map((item) => (
            <div key={item.id} className="card">
              <img src={item.img} alt={item.title} className="card-img" />

              <p className="category">{item.category}</p>
              <h2 className="title">{item.title}</h2>
              <p className="desc">{item.desc}</p>

              <div className="price-row">
                <span className="price">₹ {item.price}</span>
                <span className="weight">{item.weight}</span>
              </div>

              <div className="btn-row">
                {/* WISHLIST */}
                {/* <button
                  className={`wishlogo-prdct ${
                    isInWishlist(item.id) ? "active" : ""
                  }`}
                  onClick={() => {
                    if (!userId) {
                      toast.error("Please login to add items to wishlist");
                      setTimeout(() => navigate("/login"), 1200);
                      return;
                    }
                    toggleWishlist(item);
                    toast.success("❤️ Item added to wishlist ✅");
                  }}
                >
                  <i className="fa-regular fa-heart"></i>
                </button> */}
                <button
  className={`wishlogo-prdct ${
    isInWishlist(item.id) ? "active" : ""
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

    const alreadyInWishlist = isInWishlist(item.id);

    toggleWishlist(item);

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

                {/* CART */}
                <button
                  className={`cart-addbtn ${
                    isInCart(item.id) ? "added" : ""
                  }`}
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

                    
                      showToast(
  add_cart,
  "Cart Updated",
  "Item added to cart successfully",
  "cart-added"
);
                    }
                  }}
                >
                  {isInCart(item.id) ? "✔ Go To Cart" : "Add To Cart"}
                </button>
              </div>
            </div>
          ))}
        </section>

        <button className="carousel-btn right" onClick={scrollRight}>
          ❯
        </button>
      </div>

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

      {/* KEEP YOUR REMAINING CODE SAME BELOW 👇 */}
    </>
  );
};

export default ProductGrid;