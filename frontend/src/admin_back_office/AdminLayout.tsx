import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./sidebar";
import Dashboard from "./dashboard";
import Topbar from "./topbar";

const AdminLayout = () => {
  return (
     <>
        {/* Admin Pages */}
        {/* <div style={{ padding: "20px" }}> */}
          <Routes>
            <Route path="/" element={<Dashboard />} />
            {/* <Route path="/dashboard" element={<Dashboard />} /> */}

            {/* later */}
            {/* <Route path="/products" element={<AdminProducts />} /> */}
            {/* <Route path="/orders" element={<AdminOrders />} /> */}
            {/* <Route path="/customers" element={<AdminCustomers />} /> */}

            {/* fallback */}
            <Route path="*" element={<Navigate to="/admin" />} />
          </Routes>
        

      
    
    </>
  );
};

export default AdminLayout;
