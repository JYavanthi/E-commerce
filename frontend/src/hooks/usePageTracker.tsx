import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { trackUserView } from "../usertrackview";


const routeNameMap: Record<string, string> = {
"/": "Home Page",
"/products": "Products Page",
"/productgrid": "Product Grid",
"/cart": "Cart Page",
"/cart-address": "Cart Address",
"/payment": "Payment Page",
"/success": "Order Success Page",
"/profile": "Profile Page",
"/address": "Address Page",
"/wishlist": "Wishlist Page",
"/login": "Login Page",
"/signup": "Signup Page",
"/about": "About Page",
"/mission": "Mission Page",
"/privacy-policy": "Privacy Policy",
"/t&c": "Terms Page"
};


export const usePageTracker = () => {
const location = useLocation();
const startTimeRef = useRef<number>(Date.now());


useEffect(() => {
// reset timer on route change
startTimeRef.current = Date.now();


return () => {
const endTime = Date.now();
const timeSpentSeconds = Math.floor((endTime - startTimeRef.current) / 1000);


const pageName = routeNameMap[location.pathname] || "Unknown Page";


trackUserView(
pageName,
location.pathname,
timeSpentSeconds
);
};
}, [location.pathname]);
};