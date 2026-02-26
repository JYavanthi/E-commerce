import React, { useEffect, useState } from "react";
import "./styles/AdminCustomers.css";
import Sidebar from "./sidebar";
import Header from "./topbar";
import { FaPrint } from "react-icons/fa";


interface Customer {
  UserID: number;
  FirstName: string;
  LastName: string;
  Email: string;
  ContactNo: string;
  OrderDate: string;
  CreatedDt: string;
}

const AdminCustomers = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);

  useEffect(() => {
    fetch("http://localhost:4000/api/admin/customers")
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setCustomers(data.data);
        }
      });
  }, []);

  return (
      <div className="admin-layout">
      <Sidebar />
      <div className="admin-main">
        <Header />
        <div className="top-controls">
          <h2 className="page-title">CUSTOMERS</h2>
          <div className="right-controls">
            <div className="control-item">
                 <span>Sort By:</span>
                <select>
                  <option>Default</option>
                  <option>Latest</option>
                </select>
            </div>

            <button className="btn-icon"> <FaPrint />Print</button>

            <button className="filter-btn">⚲ Filter</button>

            <div className="search-circle">🔍</div>
          </div>
         </div>
    <div className="admin-cstmrs-container">
      <div className="admin-cstmrs-count">
        <span>{customers.length}</span>  Customers
      </div>

      <table className="admin-cstmrs-table">
        <thead>
          <tr>
            <th></th>
            <th>Basic Information</th>
            <th>Phone Number</th>
            <th>Email</th>
            <th>Order Date</th>
            <th>Registered Date</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {customers.map(user => (
            <tr key={user.UserID}>
              <td>
                <input type="checkbox" />
              </td>

              <td>
                <div className="admin-cstmrs-name">
                  <strong>{user.FirstName} {user.LastName}</strong>
                  <span>ID: {user.UserID}</span>
                </div>
              </td>

              <td>{user.ContactNo}</td>
              <td>{user.Email}</td>
              <td  style={
    !user.OrderDate
      ? { color: "#ff9800", fontWeight: 600 }
      : {}
  }>
                {user.OrderDate
                  ? new Date(user.OrderDate).toLocaleDateString()
                  : "Yet to order"}
              </td>
              <td>
                {user.CreatedDt
                  ? new Date(user.CreatedDt).toLocaleDateString()
                  : "-"}
              </td>

              <td className="admin-cstmrs-actions">
                <button className="admin-cstmrs-edit">✏️</button>
                <button className="admin-cstmrs-delete">🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
   </div>
   </div> 
  );
};

export default AdminCustomers;