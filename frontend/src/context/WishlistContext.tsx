// import React, { createContext, useContext, useState } from "react";

// export type WishlistItem = {
//   id: number;
//   title: string;
//   price: number;
//   img: string;
//   weight: number;
//   desc:string;
//   category:string;
// };

// type WishlistContextType = {
//   wishlistItems: WishlistItem[];
//   addToWishlist: (item: WishlistItem) => void;
//   removeFromWishlist: (id: number) => void;
//   toggleWishlist: (item: WishlistItem) => void;
//   isInWishlist: (id: number) => boolean;
// };

// /* ================= CONTEXT ================= */

// const WishlistContext = createContext<WishlistContextType | undefined>(
//   undefined
// );

// /* ================= PROVIDER ================= */

// export const WishlistProvider = ({
//   children,
// }: {
//   children: React.ReactNode;
// }) => {
//   const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);

//   /* ADD */
//   const addToWishlist = (item: WishlistItem) => {
//     setWishlistItems((prev) => {
//       if (prev.some((p) => p.id === item.id)) return prev;
//       return [...prev, item];
//     });
//   };

//   /* REMOVE */
//   const removeFromWishlist = (id: number) => {
//     setWishlistItems((prev) => prev.filter((item) => item.id !== id));
//   };

//   /* TOGGLE (ADD / REMOVE) */
//   const toggleWishlist = (item: WishlistItem) => {
//     setWishlistItems((prev) =>
//       prev.some((p) => p.id === item.id)
//         ? prev.filter((p) => p.id !== item.id)
//         : [...prev, item]
//     );
//   };

//   /* CHECK */
//   const isInWishlist = (id: number) => {
//     return wishlistItems.some((item) => item.id === id);
//   };

//   return (
//     <WishlistContext.Provider
//       value={{
//         wishlistItems,
//         addToWishlist,
//         removeFromWishlist,
//         toggleWishlist,
//         isInWishlist,
//       }}
//     >
//       {children}
//     </WishlistContext.Provider>
//   );
// };

// /* ================= HOOK ================= */

// export const useWishlist = () => {
//   const context = useContext(WishlistContext);
//   if (!context) {
//     throw new Error("useWishlist must be used inside WishlistProvider");
//   }
//   return context;
// };
  
import React, { createContext, useContext, useEffect, useState } from "react";
import { API_URLS } from "../API-Urls";

const API_URL = API_URLS.BASE_URL;

export type WishlistInput = {
  id: number;
  title: string;
  price: number;
  img: string;
  weight: string;
  desc: string;
  category: string;
};

export type WishlistItem = WishlistInput & {
  wishlistId: number;
};

type WishlistContextType = {
  wishlistItems: WishlistItem[];
  toggleWishlist: (item: WishlistInput) => Promise<void>;
  removeFromWishlist: (wishlistId: number) => Promise<void>;
  isInWishlist: (productId: number) => boolean;
};

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider = ({ children }: { children: React.ReactNode }) => {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [userId, setUserId] = useState<number | null>(null);

  /* ✅ SYNC USER */
  useEffect(() => {
    const syncUser = () => {
      const id = localStorage.getItem("userId");
      setUserId(id && id !== "null" ? Number(id) : null);
    };

    syncUser(); // initial load
    window.addEventListener("storage", syncUser);
    return () => window.removeEventListener("storage", syncUser);
  }, []);

  /* ✅ LOAD WISHLIST */
  const loadWishlist = async (userId: number) => {
    const res = await fetch(`${API_URL}${API_URLS.WISHLIST}/${userId}`);
    const data = await res.json();

    setWishlistItems(
      Array.isArray(data)
        ? data.map((item: any) => ({
            wishlistId: item.WishlistID,
            id: item.ProductID,
            title: item.ProductName,
            price: Number(item.Price),
            img: item.ImageUrl,
            weight: item.ProductWeight,
            desc: "",
            category: "",
          }))
        : []
    );
  };

  useEffect(() => {
    if (userId) loadWishlist(userId);
    else setWishlistItems([]);
  }, [userId]);

  /* ✅ TOGGLE */
 const toggleWishlist = async (item: WishlistInput) => {
  if (!userId) {
    alert("Please login to add to wishlist");
    return;
  }

  const existing = wishlistItems.find(w => w.id === item.id);

  if (existing) {
    await fetch(`${API_URL}${API_URLS.WISHLIST}/${existing.wishlistId}`, {
      method: "DELETE",
    });
  } else {
    await fetch(`${API_URL}${API_URLS.WISHLIST}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        UserID: Number(userId),     // ✅ convert to number
        ProductID: item.id,
      }),
    });
  }

  loadWishlist(Number(userId));     // ✅ also fix here
};

  const removeFromWishlist = async (wishlistId: number) => {
    await fetch(`${API_URL}${API_URLS.WISHLIST}/${wishlistId}`, {
      method: "DELETE",
    });
    if (userId) loadWishlist(userId);
  };

  const isInWishlist = (productId: number) =>
    wishlistItems.some(item => item.id === productId);

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        toggleWishlist,
        removeFromWishlist,
        isInWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used inside WishlistProvider");
  return ctx;
};
