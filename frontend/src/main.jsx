// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import React from "react";
// import ReactDOM from "react-dom/client";
// import './index.css'
// import App from './App.jsx'
// import { CartProvider } from "./context/CartContext";
// import { WishlistProvider } from "./context/WishlistContext";
// import { BrowserRouter } from "react-router-dom";
// import {AddressProvider} from "./context/AddressContext";

// ReactDOM.createRoot(document.getElementById("root")).render(
//   <React.StrictMode>
//   <BrowserRouter>
//     <CartProvider>
//       <WishlistProvider>
//         <AddressProvider>
//       <App />
//       </AddressProvider>
//       </WishlistProvider>
//     </CartProvider>
//   </BrowserRouter>
//   </React.StrictMode>
// );

// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
// )

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";
import { AddressProvider } from "./context/AddressContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <CartProvider>
        <WishlistProvider>
          <AddressProvider>
            <App />
          </AddressProvider>
        </WishlistProvider>
      </CartProvider>
    </BrowserRouter>
  </React.StrictMode>
);
