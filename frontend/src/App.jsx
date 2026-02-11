import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "./Navbar/navbar";
import Hero from "./hero";
import Products from "./products";
import ProductGrid from "./productgrid";
import AboutPage from "./about";
import Mission from "./mission";
import Footer from "./footer";
import Cart from "./cart";
import Signup from "./signup";
import Profile from "./profile";
import Wishlist from "./wishlist";
import Address from "./address";
import CartAddress from "./cart-address";
import Payment from "./Payment";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";
import { AddressProvider } from "./context/AddressContext";
import { Toaster } from "react-hot-toast";
import AddressFormModal from "./addressFormModal";
import Login from "./login";
import PrivacyPolicy from "./privacy-policy";
import TermsConditions from "./t&c";
import Success from "./success";
import GlobalTracker from "./GlobalTracker";
import ProductList from "./productList";
import CategoryProductPage from "./categoryProductPage";
import ProductDetail from "./productDetail";
import AdminLayout from "./admin_back_office/AdminLayout";
import Charts from "./admin_back_office/components/charts";

function HomePage() {
  const location = useLocation();

  useEffect(() => {
    if (location.state?.scrollTo) {
      const section = document.getElementById(location.state.scrollTo);
      section?.scrollIntoView({ behavior: "smooth" });
    }
  }, [location]);

  return (
    <>
      <Navbar />
      <section id="home"> <Hero /> </section>

      <section id="products">  <Products /><ProductGrid />  </section>

      <section id="about">  <AboutPage /> </section>

      <section id="mission"> <Mission /> </section>

      <section id="contact"> <Footer />  </section>
    </>
  );
}

function App() {
  return (
    <>
      <CartProvider>
        <WishlistProvider>
          <AddressProvider>
            <GlobalTracker>
            <Toaster position="top-center" reverseOrder={false} />
            <Routes>
              {/*customer ui*/ }
              <Route path="/" element={<HomePage />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/productList" element={<ProductList />} />
              <Route path="/categoryProductPage" element={<CategoryProductPage />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/login" element={<Login />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/address" element={<Address />} />
              <Route path="/cart-address" element={<CartAddress />} />
              <Route path="/address-form-modal" element={<AddressFormModal />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/t&c" element={<TermsConditions />} />
              <Route path="/payment" element={<Payment />} />
              <Route path="/success" element={<Success />} />
                {/*admin ui*/ }
              <Route path="/admin/*" element={<AdminLayout />} />  
              <Route path="/chart" element={<Charts/>} />

            </Routes>
            </GlobalTracker>
          </AddressProvider>
        </WishlistProvider>
      </CartProvider>
    </>
  );
}

export default App;
