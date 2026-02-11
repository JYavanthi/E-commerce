import React, { useEffect, useState } from "react";
import "../src/styles/productList.css";
import { useNavigate } from "react-router-dom";
import { API_URLS } from "./API-Urls";
import { useCart } from "./context/CartContext";
import { useWishlist } from "./context/WishlistContext";
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

interface Product {
  id: number;
  category: string;
  title: string;
  desc: string;
  price: number;
  weight: string;
  img: string;
  tag?: string; // Healthy Choice / Best Seller
}

const ProductList = () => {
  const navigate = useNavigate();
  const { addToCart, isInCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

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
        if (!Array.isArray(data)) {
          setProducts([]);
          return;
        }

        const mapped: Product[] = data.map((item: any, index: number) => ({
          id: item.ProductID,
          category: item.CategoryName || "BRIHATI",
          title: item.ProductName,
          desc: item.ProductDescription,
          price: Number(item.Price) || 0,
          weight: item.ProductWeight || "",
          img: imageMap[item.ProductID] || plant_protein,
          tag: index % 2 === 0 ? "Best Seller" : "Healthy Choice", // demo tags
        }));

        setProducts(mapped);
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p style={{ padding: "30px" }}>Loading products...</p>;

  return (
    <>
    <Navbar/>
    <div className="productlist-page">
      <div className="productlist-grid">
        {products.map((item) => (
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
              </div>

              {/* ACTIONS */}
              <div className="plist-actions">
                <button
                  className={`plist-wish ${
                    isInWishlist(item.id) ? "active" : ""
                  }`}
                  onClick={() => toggleWishlist(item)}
                >
                  ❤
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
                  {isInCart(item.id) ? "Go To Cart" : "Add To Cart"}
                </button>
              </div>
            </div>

          </div>
        ))}
      </div>
    </div>
    <Footer/>
    </>
  );
};

export default ProductList;
