import "./styles/wishlist.css";
import Navbar from "./Navbar/navbar";
import Footer from "./footer";
import { useWishlist } from "./context/WishlistContext";
import { useCart } from "./context/CartContext";
import { useNavigate } from "react-router-dom";
import ProductGrid from "./productgrid";

const Wishlist = () => {
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
   const navigate = useNavigate();

  return (
    <>
      <Navbar />
      <div className="wishlist-page">
        <h1>My Wishlist ({wishlistItems.length} Items)</h1>

        {wishlistItems.length === 0 ? (
          <>
          <p className="empty-text">Your wishlist is empty</p>
          <button className="go-to-cart-btn" onClick={() => navigate("/cart")}>Go to Cart</button>
          </>
        ) : (
          <div className="wishlist-grid">
            {wishlistItems.map((item) => (
              <div key={item.wishlistId} className="product-card1">
                {/* REMOVE BUTTON */}
                <button
                  className="remove-btn"
                  onClick={() => removeFromWishlist(item.wishlistId)}
                  aria-label="Remove from wishlist"
                >
                  ×
                </button>

                {/* IMAGE */}
                <img src={item.img} alt={item.title}  className="product-img"/>

                {/* DETAILS */}
                 <p className="wsh-product-category">{item.category}</p>
                <h4 className="wsh-product-title">{item.title}</h4>
                {item.desc && (
                   <p className="wsh-product-desc">{item.desc}</p>
                   )}   
                      {item.price && (
                    <span className="wsh-product-weight">{item.weight}</span>
                  )}
                <div className="wsh-price-row">         
                  {item.weight && (
                    <span className="wsh-product-price">₹{item.price}</span>
                  )}
                  <button className="add-to-cart-btn"onClick={() =>{ addToCart(item); removeFromWishlist(item.wishlistId);}}>Add To Cart
                </button>
                </div>  

               
                
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </>
  );
};

export default Wishlist;
