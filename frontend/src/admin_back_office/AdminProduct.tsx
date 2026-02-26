// import React from "react";
// import Sidebar from "./sidebar";
// import Header from "./topbar";
// import "./styles/adminProduct.css";
// import { useNavigate } from "react-router-dom";

// const AdminProduct = () => {
//   const navigate = useNavigate();

//   return (
//     <div className="admin-layout">
//       <Sidebar />

//       <div className="admin-main">
//         <Header />

//         {/* TOP BAR (Missing 3 Filters Added Here) */}
//         <div className="top-controls">
//           <h2 className="page-title">PRODUCT PAGE</h2>

//           <div className="right-controls">
//             <div className="control-item">
//               <span>Show:</span>
//               <select>
//                 <option>All Products</option>
//                 <option>Featured</option>
//                 <option>Latest</option>
//               </select>
//             </div>

//             <div className="control-item">
//               <span>Sort By:</span>
//               <select>
//                 <option>Default</option>
//                 <option>Price Low-High</option>
//                 <option>Price High-Low</option>
//               </select>
//             </div>

//             <button className="filter-btn">⚲ Filter</button>

//             <div className="search-circle">🔍</div>
//           </div>
//         </div>

//         <div className="product-container">
//           {/* Filter Section */}
//           <div className="filter-bar">
//             <button
//               className="add-btn"
//               onClick={() => navigate("/AdminChooseCategory")}
//             >
//               + Add New Product
//             </button>

//             <div className="filters">
//               <select>
//                 <option>All Category</option>
//               </select>
//               <select>
//                 <option>All Status</option>
//                 <option>In Stock</option>
//                 <option>Out of stock</option>
//                 <option>Coming soon</option>
//                 <option>Less in stock</option>


//               </select>
//               <select>
//                 <option>All Price</option>
//               </select>
//             </div>
//           </div>

//           {/* Table */}
//           <div className="table-wrapper">
//             <table>
//               <thead>
//                 <tr>
//                   <th></th>
//                   <th className="pd-tbl-nm">Product Name</th>
//                   <th>Product ID </th>
//                   <th>Price</th>
//                   <th>Quantity</th>
//                   <th>In Stock</th>
//                   <th>Status</th>
//                   <th>Action</th>
//                 </tr>
//               </thead>

//               <tbody>
//                 {[1, 2, 3, 4, 5, 6].map((item, index) => (
//                   <tr key={index}>
//                     <td>
//                       <input type="checkbox" />
//                     </td>
//                     <td className="product-cell">
//                       <img
//                         src="https://via.placeholder.com/40"
//                         alt="product"
//                       />
//                       <div className="product-cell-div">
//                         <p>Pumpkin Seeds</p>
//                       </div>
//                     </td>
//                     <td><span>1223998ZD</span></td>
//                     <td>₹ 160</td>
//                     <td>200g</td>
//                     <td>400</td>
//                     <td>
//                       <span className="status">● In Stock</span>
//                     </td>
//                     <td className="action-btns">
//                       <button className="edit">✏</button>
//                       <button className="delete">🗑</button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>

//             <div className="pagination">« 1 2 3 4 5 »</div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminProduct;


import React, { useEffect, useState } from "react";
import Sidebar from "./sidebar";
import Header from "./topbar";
import "./styles/adminProduct.css";
import { useNavigate } from "react-router-dom";

interface Product {
  ProductID: number;
  ProductName: string;
  ProductCode: string;
  ProductWeight: string;
  Quantity: number;
  Status: number;
  Price: number;
  DiscountPrice: number | null;
  ProductImage?: string;
}

const AdminProduct = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);

  // FETCH PRODUCTS
  useEffect(() => {
    fetch("http://localhost:4000/api/admin-products")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setProducts(data.data);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="admin-layout">
      <Sidebar />

      <div className="admin-main">
        <Header />

        <div className="top-controls">
          <h2 className="page-title">PRODUCT PAGE</h2>

          <div className="right-controls">
            <button
              className="add-btn"
              onClick={() => navigate("/AdminChooseCategory")}
            >
              + Add New Product
            </button>
          </div>
        </div>

        <div className="product-container">
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th></th>
                  <th>Product Name</th>
                  <th>Product ID</th>
                  <th>Price</th>
                  <th>Weight</th>
                  <th>Quantity</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {products.map((item) => (
                  <tr key={item.ProductID}>
                    <td>
                      <input type="checkbox" />
                    </td>

                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <img
                          src={
                            item.ProductImage
                              ? `http://localhost:4000${item.ProductImage}`
                              : "https://via.placeholder.com/40"
                          }
                          alt="product"
                          style={{
                            width: "40px",
                            height: "40px",
                            objectFit: "cover",
                            borderRadius: "6px"
                          }}
                        />
                        <span>{item.ProductName}</span>
                      </div>
                    </td>

                    <td>{item.ProductID}</td>

                    <td>
                      ₹ {item.DiscountPrice ?? item.Price}
                    </td>

                    <td>{item.ProductWeight}</td>

                    <td>{item.Quantity}</td>

                    <td>
                      <span className="status">
                        ● {item.Status == 1 ? "In Stock" : "Out of Stock"}
                      </span>
                    </td>

                    <td className="action-btns">
                      <button className="edit">✏</button>
                      <button className="delete">🗑</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {products.length === 0 && (
              <p style={{ textAlign: "center", padding: "20px" }}>
                No products found
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProduct;
