import React, { useEffect, useState } from "react";
import "../src/styles/categoryProducts.css"; // reuse product list design
import { API_URLS } from "./API-Urls";
import { useCart } from "./context/CartContext";
import { useWishlist } from "./context/WishlistContext";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar/navbar";
import Footer from "./footer";

import flxseed from "../src/assets/flaxseed-flour.png";
import jaggery from "../src/assets/jaggery.jpg";
import green_tea from "../src/assets/green_tea.jpg";
import plant_protein from "../src/assets/vegan.jpg";
import rstdPmpkn from "../src/assets/rstdPmpkn.jpg";
import wtr_mln from "../src/assets/wtr_mln.jpg";
import grains from "../src/assets/grains.jpg";
import honey from "../src/assets/honey.jpg";

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

const CategoryProductPage = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const [products, setProducts] = useState<ProductUI[]>([]);
  const [loading, setLoading] = useState(false);

  const { addToCart, isInCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const navigate = useNavigate();

  /* LOAD CATEGORIES */
  useEffect(() => {
    fetch(`${API_URLS.BASE_URL}categories`)
      .then(res => res.json())
      .then(data => {
        setCategories(data);
        if (data.length > 0) {
          setActiveCategory(data[0].ProductCategoryID);
        }
      });
  }, []);

  /* LOAD PRODUCTS BY CATEGORY */
  useEffect(() => {
    if (!activeCategory) return;

    setLoading(true);
    fetch(`${API_URLS.BASE_URL}products/category/${activeCategory}`)
      .then(res => res.json())
      .then((data: ProductAPI[]) => {
        const mapped: ProductUI[] = data.map((item, index) => ({
          id: item.ProductID,
          title: item.ProductName,
          desc: item.ProductDescription,
          price: item.DiscountPrice || item.Price,
          weight: item.ProductWeight || "",
          img: imageMap[item.ProductID] || plant_protein,
          tag: index % 2 === 0 ? "Best Seller" : "Healthy Choice",
        }));

        setProducts(mapped);
      })
      .finally(() => setLoading(false));
  }, [activeCategory]);

  return (
    <>
      <Navbar />

      {/* CATEGORY BAR */}
      <div className="cat-bar">
        {categories.map(cat => (
          <button
            key={cat.ProductCategoryID}
            className={`cat-tab ${activeCategory === cat.ProductCategoryID ? "active" : ""}`}
            onClick={() => setActiveCategory(cat.ProductCategoryID)}
          >
            {cat.CategoryName}
          </button>
        ))}
      </div>

      {/* PRODUCT GRID (same UI as ProductList) */}
      <div className="productlist-page">
        {loading && <p style={{ padding: "30px" }}>Loading products...</p>}

        <div className="productlist-grid">
          {!loading && products.map((item) => (
            <div key={item.id} className="plist-card">

              {/* TAG */}
              {item.tag && <div className="plist-tag">{item.tag}</div>}

              {/* IMAGE */}
              <img
                src={item.img}
                alt={item.title}
                className="plist-img"
                onClick={() => navigate(`/product/${item.id}`)}
              />

              {/* INFO */}
              <div className="plist-body">
                <h3 className="plist-title">{item.title}</h3>

                <div className="plist-price">  
                  <span className="plist-mrp">₹{item.price + 300}</span>
                  <span className="plist-final">₹{item.price}</span>
                   <span className="plist-weight">{item.weight}</span>
                </div>

                {/* ACTIONS */}
                <div className="plist-actions">
                  <button
                    className={`plist-wish ${isInWishlist(item.id) ? "active" : ""}`}
                    onClick={() => toggleWishlist(item)}
                  >
                    <i className="fa-regular fa-heart"></i>
                  </button>

                  <button
                    className="plist-cart"
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

            </div>
          ))}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default CategoryProductPage;
