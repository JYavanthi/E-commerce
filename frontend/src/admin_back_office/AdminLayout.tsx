import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./sidebar";
import Dashboard from "./dashboard";
import Topbar from "./topbar";
import AddProduct from "./addProduct";
import AdminProduct from "./AdminProduct";
import AdminChooseCategory from "./AdminChooseCategory";
import AdminCategory from "./AdminCategory";
import AdminOrders from "./AdminOrders";
import AdminCustomers from "./AdminCustomers";
import AdminCustomerDetails from "./AdminCustomerDetails";

const AdminLayout = () => {
  return (
     <>
        {/* Admin Pages */}
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/addProduct" element={<AddProduct />} />
            <Route path="/AdminProduct" element={<AdminProduct />} />
            <Route path="/AdminChooseCategory" element={<AdminChooseCategory />} />
             <Route path="/AdminCategory" element={<AdminCategory />} />
            <Route path="/AdminOrders" element={<AdminOrders />} />
            <Route path="/AdminCustomers" element={<AdminCustomers />} />
            <Route path="/AdminCustomerDetails" element={<AdminCustomerDetails />} />
            {/* fallback */}
            <Route path="*" element={<Navigate to="/admin" />} />
          </Routes>
        

      
    
    </>
  );
};

export default AdminLayout;
