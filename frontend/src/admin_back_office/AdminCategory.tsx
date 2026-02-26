
// import React from "react";
// import  { useState } from "react";
// import Sidebar from "./sidebar";
// import Header from "./topbar";
// import "./styles/adminProduct.css";
// import { useNavigate } from "react-router-dom";
// import NewCategorySlider from "./NewCategorySlider";

// const AdminCategory = () => {
//   const navigate = useNavigate();
//   const [isSliderOpen, setIsSliderOpen] = useState(false);

//   return (
//     <div className="admin-layout">
//       <Sidebar />

//       <div className="admin-main">
//         <Header />

//         {/* TOP BAR (Missing 3 Filters Added Here) */}
//         <div className="top-controls">
//           <h2 className="page-title">Category Page</h2>
//           <div className="search-circle">🔍</div>
//         </div>
          
        

//         <div className="product-container">
//           {/* Filter Section */}
//           <div className="filter-bar">
//             <button
//               className="add-btn"
//               onClick={() => setIsSliderOpen(true)}
//             >
//               + Add New Category
//             </button>

//           </div>

//           {/* Table */}
//           <div className="table-wrapper">
//             <table>
//               <thead>
//                 <tr>
//                   <th></th>
//                   <th>Category Name</th>
//                   <th>Category ID</th>
//                   <th>Status</th>
//                   <th>Action</th>
//                 </tr>
//               </thead>

//               <tbody>
//                 {[1, 2, 3, 4, 5, 6].map((item, index) => (
//                   <tr key={index}>
//                     <td>
//                     </td>
//                     <td className="product-cell">
//                       <img
//                         src="https://via.placeholder.com/40"
//                         alt="product"
//                       />
//                       <div>
//                         <p>Seeds and Super Foods</p>
//                       </div>
//                     </td>
//                      <td>16012</td>
//                     {/*<td>200g</td>
//                     <td>400</td> */}
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
//           </div>
//         </div>
//       </div>
//        <NewCategorySlider
//         isOpen={isSliderOpen}
//         onClose={() => setIsSliderOpen(false)}
//       />
//     </div>
    
//   );
// };

// export default AdminCategory;


import React, { useEffect, useState } from "react";
import Sidebar from "./sidebar";
import Header from "./topbar";
import "./styles/adminProduct.css";
import { useNavigate } from "react-router-dom";
import NewCategorySlider from "./NewCategorySlider";

interface Category {
  ProductCategoryID: number;
  CategoryName: string;
  CategoryDescription?: string;
  CategoryImage?: string;
  Status: number;
}

const AdminCategory = () => {
  const navigate = useNavigate();
  const [isSliderOpen, setIsSliderOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // ================= FETCH CATEGORIES =================
  useEffect(() => {
    fetch("http://localhost:4000/api/admin/product-categories")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setCategories(data.data);
        }
      })
      .catch((err) => {
        console.error("Error fetching categories:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="admin-layout">
      <Sidebar />

      <div className="admin-main">
        <Header />

        {/* Top Controls */}
        <div className="top-controls">
          <h2 className="page-title">Category Page</h2>
          <div className="search-circle">🔍</div>
        </div>

        <div className="product-container">
          {/* Add Button */}
          <div className="filter-bar">
            <button
              className="add-btn"
              onClick={() => setIsSliderOpen(true)}
            >
              + Add New Category
            </button>
          </div>

          {/* Table */}
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th></th>
                  <th className="ct-tble-nm">Category Name</th>
                  <th>Category ID</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} style={{ textAlign: "center" }}>
                      Loading...
                    </td>
                  </tr>
                ) : categories.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ textAlign: "center" }}>
                      No categories found
                    </td>
                  </tr>
                ) : (
                  categories.map((item) => (
                    <tr key={item.ProductCategoryID}>
                      <td></td>

                    <td className="product-cell">
  <img
    src={
      item.CategoryImage
        ? `http://localhost:4000${item.CategoryImage}`
        : "https://via.placeholder.com/50"
    }
    alt="category"
    style={{
      width: "50px",
      height: "50px",
      objectFit: "cover",
      borderRadius: "8px",
      border: "1px solid #e0e0e0"
    }}
  />
  <div>
    <p>{item.CategoryName}</p>
  </div>
</td>

                      <td>{item.ProductCategoryID}</td>

                      <td>
                        <span className="status">
                          ● {item.Status == 1
                            ? "In Stock"
                            : "Out of Stock"}
                        </span>
                      </td>

                      <td className="action-btns">
                        <button className="edit">✏</button>
                        <button className="delete">🗑</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <NewCategorySlider
        isOpen={isSliderOpen}
        onClose={() => setIsSliderOpen(false)}
      />
    </div>
  );
};

export default AdminCategory;

