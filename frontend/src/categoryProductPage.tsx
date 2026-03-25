
// import React, { useEffect, useState } from "react";
// import "../src/styles/categoryProducts.css";
// import { API_URLS } from "./API-Urls";
// import { useCart } from "./context/CartContext";
// import { useWishlist } from "./context/WishlistContext";
// import { useNavigate } from "react-router-dom";
// import Navbar from "./Navbar/navbar";
// import Footer from "./footer";

// interface Category {
//   ProductCategoryID: number;
//   CategoryName: string;
// }

// interface ProductAPI {
//   ProductID: number;
//   ProductName: string;
//   ProductDescription: string;
//   ProductWeight: string;
//   Price: number;
//   DiscountPrice: number;
//   ProductImage: string | null;
// }

// interface ProductUI {
//   id: number;
//   title: string;
//   desc: string;
//   price: number;
//   weight: string;
//   img: string;
//   tag?: string;
// }

// const CategoryProductPage = () => {
//   const [categories, setCategories] = useState<Category[]>([]);
//   const [activeCategory, setActiveCategory] = useState<number | null>(null);
//   const [products, setProducts] = useState<ProductUI[]>([]);
//   const [loading, setLoading] = useState(false);

//   const { addToCart, isInCart } = useCart();
//   const { toggleWishlist, isInWishlist } = useWishlist();
//   const navigate = useNavigate();

//   /* LOAD CATEGORIES */
//   useEffect(() => {
//     fetch(`${API_URLS.BASE_URL}categories`)
//       .then((res) => res.json())
//       .then((data) => {
//         setCategories(data);
//         if (data.length > 0) {
//           setActiveCategory(data[0].ProductCategoryID);
//         }
//       })
//       .catch((err) => console.error("Category load error:", err));
//   }, []);

//   /* LOAD PRODUCTS BY CATEGORY */
//   useEffect(() => {
//     if (!activeCategory) return;

//     setLoading(true);

//     fetch(`${API_URLS.BASE_URL}products/category/${activeCategory}`)
//       .then((res) => res.json())
//       .then((data: ProductAPI[]) => {
//         const mapped: ProductUI[] = data.map((item, index) => ({
//           id: item.ProductID,
//           title: item.ProductName,
//           desc: item.ProductDescription,
//           price: item.DiscountPrice || item.Price,
//           weight: item.ProductWeight || "",
//           img: item.ProductImage
//             ? `http://localhost:4000${item.ProductImage}`
//             : "https://via.placeholder.com/300",
//           tag: index % 2 === 0 ? "Best Seller" : "Healthy Choice",
//         }));

//         setProducts(mapped);
//       })
//       .catch((err) => console.error("Product load error:", err))
//       .finally(() => setLoading(false));
//   }, [activeCategory]);

//   return (
//     <>
//       <Navbar />

//       {/* CATEGORY BAR */}
//       <div className="cat-bar">
//         {categories.map((cat) => (
//           <button
//             key={cat.ProductCategoryID}
//             className={`cat-tab ${
//               activeCategory === cat.ProductCategoryID ? "active" : ""
//             }`}
//             onClick={() => setActiveCategory(cat.ProductCategoryID)}
//           >
//             {cat.CategoryName}
//           </button>
//         ))}
//       </div>

//       {/* PRODUCT GRID */}
//       <div className="productlist-page">
//         {loading && <p style={{ padding: "30px" }}>Loading products...</p>}

//         <div className="productlist-grid">
//           {!loading &&
//             products.map((item) => (
//               <div key={item.id} className="plist-card">

//                 {item.tag && <div className="plist-tag">{item.tag}</div>}

//                 <img
//                   src={item.img}
//                   alt={item.title}
//                   className="plist-img"
//                   onClick={() => navigate(`/product/${item.id}`)}
//                 />

//                 <div className="plist-body">
//                   <h3 className="plist-title">{item.title}</h3>

//                   <div className="plist-price">
//                     <span className="plist-mrp">
//                       ₹{item.price + 300}
//                     </span>
//                     <span className="plist-final">
//                       ₹{item.price}
//                     </span>
//                     <span className="plist-weight">
//                       {item.weight}
//                     </span>
//                   </div>

//                   <div className="plist-actions">
//                     <button
//                       className={`plist-wish ${
//                         isInWishlist(item.id) ? "active" : ""
//                       }`}
//                       onClick={() => toggleWishlist(item)}
//                     >
//                        <i className="fa-regular fa-heart"></i>
//                     </button>

//                     <button
//                       className="plist-cart"
//                       onClick={() => {
//                         if (isInCart(item.id)) {
//                           navigate("/cart");
//                         } else {
//                           addToCart({
//                             id: item.id,
//                             title: item.title,
//                             price: item.price,
//                             qty: 1,
//                             img: item.img,
//                             weight: item.weight,
//                           });
//                         }
//                       }}
//                     >
//                       {isInCart(item.id)
//                         ? "✔ Go To Cart"
//                         : "Add To Cart"}
//                     </button>
//                   </div>
//                 </div>

//               </div>
//             ))}
//         </div>
//       </div>

//       <Footer />
//     </>
//   );
// };

// export default CategoryProductPage;


import React, { useEffect, useState } from "react";
import "../src/styles/categoryProducts.css";
import { API_URLS } from "./API-Urls";
import { useCart } from "./context/CartContext";
import { useWishlist } from "./context/WishlistContext";
import { useNavigate, useLocation } from "react-router-dom";
 import { toast } from "react-hot-toast";
import Navbar from "./Navbar/navbar";
import Footer from "./footer";
import { showToast } from "./components/CustomToast";
import tst_bfr from "./assets/toast_bfr_lgn.jpeg";
import add_cart from "./assets/add_cart.png";
import add_wish from  "./assets/add_wish.png";
import rem_wish from "./assets/remove_wish.png";

interface Category {
  ProductCategoryID: number;
  CategoryName: string;
}

interface ProductAPI {
  ProductID: number;
  ProductName: string;
  ProductDescription: string;
  ProductWeight: string;
  Price: number;
  DiscountPrice: number;
  ProductImage: string | null;
}

interface ProductUI {
  id: number;
  title: string;
  desc: string;
  price: number;
  weight: string;
  img: string;
  tag?: string;
}

const CategoryProductPage = () => {

  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const [products, setProducts] = useState<ProductUI[]>([]);
  const [loading, setLoading] = useState(false);

  const { addToCart, isInCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const navigate = useNavigate();
  const location = useLocation();

  /* SEARCH DATA FROM NAVBAR */
  const searchCategoryId = location.state?.categoryId;
  const highlightProducts: string[] = location.state?.highlightProducts || [];

  const user = JSON.parse(localStorage.getItem("user") || "null");
  const userId = user?.UserID;

  /* LOAD CATEGORIES */
  useEffect(() => {

    fetch(`${API_URLS.BASE_URL}categories`)
      .then((res) => res.json())
      .then((data) => {

        setCategories(data);

        if (searchCategoryId) {
          setActiveCategory(searchCategoryId);
        } 
        else if (data.length > 0) {
          setActiveCategory(data[0].ProductCategoryID);
        }

      })
      .catch((err) => console.error("Category load error:", err));

  }, [searchCategoryId]);

  /* LOAD PRODUCTS */
  useEffect(() => {

    if (!activeCategory) return;

    setLoading(true);

    fetch(`${API_URLS.BASE_URL}products/category/${activeCategory}`)
      .then((res) => res.json())
      .then((data: ProductAPI[]) => {

        const mapped: ProductUI[] = data.map((item, index) => ({
          id: item.ProductID,
          title: item.ProductName,
          desc: item.ProductDescription,
          price: item.DiscountPrice || item.Price,
          weight: item.ProductWeight || "",
          img: item.ProductImage
            ? `http://localhost:4000${item.ProductImage}`
            : "https://via.placeholder.com/300",
          tag: index % 2 === 0 ? "Best Seller" : "Healthy Choice",
        }));

        setProducts(mapped);

      })
      .catch((err) => console.error("Product load error:", err))
      .finally(() => setLoading(false));

  }, [activeCategory]);

  /* SCROLL TO FIRST HIGHLIGHT PRODUCT */
  useEffect(() => {

    if (!highlightProducts.length || products.length === 0) return;

    const first = highlightProducts[0];

    const id = first.toLowerCase().replace(/\s+/g, "-");

    setTimeout(() => {

      const element = document.getElementById(id);

      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "center"
        });
      }

    }, 300);

  }, [products, highlightProducts]);

  return (
    <>
      <Navbar />

      {/* CATEGORY BAR */}
      <div className="cat-bar">
        {categories.map((cat) => (
          <button
            key={cat.ProductCategoryID}
            className={`cat-tab ${
              activeCategory === cat.ProductCategoryID ? "active" : ""
            }`}
            onClick={() => setActiveCategory(cat.ProductCategoryID)}
          >
            {cat.CategoryName}
          </button>
        ))}
      </div>

      {/* PRODUCTS */}
      <div className="productlist-page">

        {loading && <p style={{ padding: "30px" }}>Loading products...</p>}

        <div className="productlist-grid">

          {!loading &&
            products.map((item) => {

              const productId = item.title
                .toLowerCase()
                .replace(/\s+/g, "-");

              const isHighlighted =
                highlightProducts.includes(item.title);

              return (
                <div
                  key={item.id}
                  id={productId}
                  className={`plist-card ${
                    isHighlighted ? "highlight-product" : ""
                  }`}
                >

                  {item.tag && (
                    <div className="plist-tag">{item.tag}</div>
                  )}

                  <img
                    src={item.img}
                    alt={item.title}
                    className="plist-img"
                    onClick={() => navigate(`/product/${item.id}`)}
                  />

                  <div className="plist-body">

                    <h3 className="plist-title">
                      {item.title}
                    </h3>

                    <div className="plist-price">

                      <span className="plist-mrp">
                        ₹{item.price + 300}
                      </span>

                      <span className="plist-final">
                        ₹{item.price}
                      </span>

                      <span className="plist-weight">
                        {item.weight}
                      </span>

                    </div>

                    <div className="plist-actions">

                      {/* <button
                        className={`plist-wish ${
                          isInWishlist(item.id) ? "active" : ""
                        }`}
                       
                          onClick={() => {
  if (!userId) {
    toast.error("Please login to add items to wishlist");
    setTimeout(() => navigate("/login"), 1200); 
    return;
  }
  toggleWishlist(item);
}}
                      >
                        <i className="fa-regular fa-heart"></i>
                      </button> */}
                         <button
                        className={`plist-wish ${
                          isInWishlist(item.id) ? "active" : ""
                        }`}
                        onClick={() => {
                          // if (!userId) {
                          //   toast.error("Please login to add items to wishlist", {
                          //     id: "wishlist-login",
                          //   });
                          //   setTimeout(() => navigate("/login"), 1200);
                          //   return;
                          // }
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
                            // toast.success("Item removed from wishlist ❌", {
                            //   id: "wishlist-action",
                            // });
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

                      <button
                        className="plist-cart"
                           onClick={() => {
                          // if (!userId) {
                          //   toast.error("Please login to add items to cart");
                          //   setTimeout(() => navigate("/login"), 1200); // optional
                          //   return;
                          // }
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
                        
                            // toast.success("Item added to cart ✅"); // optional success message
                                          showToast(
                              add_cart,
                              "Cart Updated",
                              "Item added to cart successfully",
                              "cart-added"
                            );
                          }
                        }}
                      >
                        {isInCart(item.id)
                          ? "✔ Go To Cart"
                          : "Add To Cart"}
                      </button>

                    </div>

                  </div>

                </div>
              );

            })}

        </div>

      </div>

      <Footer />
    </>
  );
};

export default CategoryProductPage;