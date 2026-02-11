// import { createContext, useContext, useState } from "react";

// export type CartItem = {
//   id: number;
//   title: string;
//   price: number;
//   qty: number;
//   img: string;
//   weight: string;
// };

// type CartContextType = {
//   cartItems: CartItem[];
//   addToCart: (item: CartItem) => void;
//   removeFromCart: (id: number) => void;
//    increaseQty: (id: number) => void;
//   decreaseQty: (id: number) => void;
//   isInCart: (id: number) => boolean;
// };

// const CartContext = createContext<CartContextType | null>(null);

// export const CartProvider = ({ children }: { children: React.ReactNode }) => {
//   const [cartItems, setCartItems] = useState<CartItem[]>([]);

//   const addToCart = (item: CartItem) => {
//     setCartItems(prev => {
//       const exists = prev.find(p => p.id === item.id);
//       if (exists) {
//         return prev.map(p =>
//           p.id === item.id ? { ...p, qty: p.qty + 1 } : p
//         );
//       }
//       return [...prev, { ...item, qty: 1 }];
//     });
//   };

//   const removeFromCart = (id: number) => {
//     setCartItems(prev => prev.filter(item => item.id !== id));
//   };

//    const increaseQty = (id: number) =>
//     setCartItems(prev =>
//       prev.map(item =>
//         item.id === id ? { ...item, qty: item.qty + 1 } : item
//       )
//     );

//   const decreaseQty = (id: number) =>
//     setCartItems(prev =>
//       prev.map(item =>
//         item.id === id && item.qty > 1
//           ? { ...item, qty: item.qty - 1 }
//           : item
//       )
//     );
//       const isInCart = (id: number) => {
//     return cartItems.some(item => item.id === id);
//   };

//   return (
//     <CartContext.Provider value={{ cartItems, addToCart, removeFromCart,decreaseQty,increaseQty,  isInCart, }}>
//       {children}
//     </CartContext.Provider>
//   );
// };

// export const useCart = () => {
//   const context = useContext(CartContext);
//   if (!context) throw new Error("useCart must be used inside CartProvider");
//   return context;
// };



// import { createContext, useContext, useEffect, useState } from "react";
// import { API_URLS } from "../API-Urls";

// const API_URL = API_URLS.BASE_URL;
// const USER_ID = 18;

// export type CartItem = {
//   cartId: number;
//   id: number; // ProductID
//   title: string;
//   price: number;
//   qty: number;
//   img: string;
//   weight: string;
// };

// type CartContextType = {
//   cartItems: CartItem[];
//   addToCart: (product: any) => Promise<void>;
//   removeFromCart: (cartId: number) => Promise<void>;
//   increaseQty: (cartId: number) => Promise<void>;
//   decreaseQty: (cartId: number) => Promise<void>;
//   isInCart: (productId: number) => boolean;
// };

// const CartContext = createContext<CartContextType | null>(null);

// export const CartProvider = ({ children }: { children: React.ReactNode }) => {
//   const [cartItems, setCartItems] = useState<CartItem[]>([]);

//   const loadCart = async () => {
//     const res = await fetch(`${API_URL}${API_URLS.CART}/${USER_ID}`);
//     const data = await res.json();

//     const mapped = data.map((item: any) => ({
//       cartId: item.CartID,
//       id: item.ProductID,
//       title: item.ProductName,
//       price: Number(item.Price),
//       qty: item.Quantity,
//       img: item.ImageUrl || "",
//       weight: item.ProductWeight || "",
//     }));

//     setCartItems(mapped);
//   };

//   useEffect(() => {
//     loadCart();
//   }, []);

//   // ADD
//   const addToCart = async (product: any) => {
//     if (isInCart(product.id)) return;

//     await fetch(`${API_URL}${API_URLS.CART}`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         UserID: USER_ID,
//         ProductID: product.id,
//         Quantity: 1,
//       }),
//     });

//     loadCart();
//   };

//   // REMOVE
//   const removeFromCart = async (cartId: number) => {
//     await fetch(`${API_URL}${API_URLS.CART}/${cartId}`, {
//       method: "DELETE",
//     });
//     loadCart();
//   };

//   // INCREASE
//   const increaseQty = async (cartId: number) => {
//     await fetch(`${API_URL}${API_URLS.CART}/${cartId}`, {
//       method: "PUT",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         action: "increase",
//         userId: USER_ID,
//       }),
//     });
//     loadCart();
//   };

//   // DECREASE
//   const decreaseQty = async (cartId: number) => {
//     await fetch(`${API_URL}${API_URLS.CART}/${cartId}`, {
//       method: "PUT",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         action: "decrease",
//         userId: USER_ID,
//       }),
//     });
//     loadCart();
//   };

//   const isInCart = (productId: number) =>
//     cartItems.some(item => item.id === productId);

//   return (
//     <CartContext.Provider
//       value={{
//         cartItems,
//         addToCart,
//         removeFromCart,
//         increaseQty,
//         decreaseQty,
//         isInCart,
//       }}
//     >
//       {children}
//     </CartContext.Provider>
//   );
// };

// export const useCart = () => {
//   const ctx = useContext(CartContext);
//   if (!ctx) throw new Error("useCart must be used inside CartProvider");
//   return ctx;
// };


import { createContext, useContext, useEffect, useState } from "react";
import { API_URLS } from "../API-Urls";

const API_URL = API_URLS.BASE_URL; 

export type CartItem = {
  cartId: number;
  id: number; // ProductID
  title: string;
  price: number;
  qty: number;
  img: string;
  weight: string;
};

type CartContextType = {
  cartItems: CartItem[];
  addToCart: (product: any) => Promise<void>;
  removeFromCart: (cartId: number) => Promise<void>;
  increaseQty: (cartId: number) => Promise<void>;
  decreaseQty: (cartId: number) => Promise<void>;
  isInCart: (productId: number) => boolean;
};

const CartContext = createContext<CartContextType | null>(null);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // 🔑 Always read userId dynamic
  const getUserId = () => {
    return localStorage.getItem("userId");
  };

  // 🔹 LOAD CART
  const loadCart = async () => {
    const userId = getUserId();
    if (!userId) {
      setCartItems([]);
      return;
    }

    const res = await fetch(`${API_URL}${API_URLS.CART}/${userId}`);
    const data = await res.json();

    const mapped = data.map((item: any) => ({
      cartId: item.CartID,
      id: item.ProductID,
      title: item.ProductName,
      price: Number(item.Price),
      qty: item.Quantity,
      img: item.ImageUrl || "",
      weight: item.ProductWeight || "",
    }));

    setCartItems(mapped);
  };

  useEffect(() => {
    loadCart();
  }, []);

  //  ADD
  const addToCart = async (product: any) => {
    const userId = getUserId();
    if (!userId) {
      alert("Please login to add items to cart");
      return;
    }

    await fetch(`${API_URL}${API_URLS.CART}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        UserID: Number(userId),
        ProductID: product.id,
        Quantity: 1,
      }),
    });

    loadCart();
  };

  // 🔹 REMOVE
  const removeFromCart = async (cartId: number) => {
    await fetch(`${API_URL}${API_URLS.CART}/${cartId}`, {
      method: "DELETE",
    });
    loadCart();
  };

  // 🔹 INCREASE
  const increaseQty = async (cartId: number) => {
    const userId = getUserId();
    if (!userId) return;

    await fetch(`${API_URL}${API_URLS.CART}/${cartId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "increase",
        userId: Number(userId),
      }),
    });

    loadCart();
  };

  // 🔹 DECREASE
  const decreaseQty = async (cartId: number) => {
    const userId = getUserId();
    if (!userId) return;

    await fetch(`${API_URL}${API_URLS.CART}/${cartId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "decrease",
        userId: Number(userId),
      }),
    });

    loadCart();
  };

  const isInCart = (productId: number) =>
    cartItems.some(item => item.id === productId);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        increaseQty,
        decreaseQty,
        isInCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
};
