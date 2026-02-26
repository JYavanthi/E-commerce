// import React from "react";
// import Sidebar from "./sidebar";
// import Header from "./topbar";
// import "./styles/addProduct.css";

// const AddProduct = () => {
//   return (
//     <div className="ad-app">
//       <Sidebar />

//       <main className="ad-main">
//         <Header />

//         <div className="ap-wrapper">
          

//           <div className="ap-card">
//          <div className="ap-header">
//              <h3>➕ Add New Product</h3>
//           </div>
//             <div className="ap-lftrght">
//                  <div className="ap-left">
//               <h4>General Information:</h4>

//               <label>Product Name:</label>
//               <input type="text" />

//               <label>Product Details:</label>
//               <textarea />

//               <div className="ap-row">
//                 <div>
//                   <label>Weight</label>
//                   <div className="ap-input-group">
//                     <input type="number" />
//                   <select>
//                     <option>ml</option>
//                     <option>kg</option>
//                     <option>gm</option>
//                   </select>
//                 </div>
//                   </div>

//                 <div>
//                   <label>Stock</label>
//                   <select>
//                     <option>In Stock</option>
//                     <option>Out of Stock</option>
//                   </select>
//                 </div>
//               </div>

//               <h4>Price and Stock</h4>

//               <div className="ap-row">
//                 <div>
//                   <label>Base Pricing</label>
//                   <div className="ap-input-group">
//                     <input type="number" />
//                     <select>
//                       <option>Rs.</option>
//                       <option>$</option>
//                     </select>
//                   </div>
//                 </div>

//                 <div>
//                   <label>Quantity In Stock</label>
//                   <input type="number" defaultValue={100} />
//                 </div>
//               </div>

//               <div className="ap-row">
//                 <div>
//                   <label>Discount</label>
//                   <input type="text" defaultValue="" />
//                 </div>

//                 <div>
//                   <label>Discount Type</label>
//                   <input type="text" defaultValue="" />
//                 </div>
//               </div>
//             </div>

//             {/* RIGHT PANEL */}
//             <div className="ap-right">
//               <div className="ap-actions">
//                 <button className="ap-draft">Save Draft</button>
//                 <button className="ap-add">Add Product</button>
//               </div>

//               <h4>Upload Image</h4>
//               <div className="ap-upload-box"><button className="ap-thumb ap-add-thumb">+</button></div>

//               <div className="ap-thumbs">
//                 <button className="ap-thumb ap-add-thumb"> +</button>
//                 <button className="ap-thumb ap-add-thumb">+</button>
//                 <button className="ap-thumb ap-add-thumb">+</button>
//               </div>

//               <label>Category</label>
//               <select>
//                 <option>Seeds & Super Foods</option>
//                 <option>Grains & Rice</option>
//                 <option>Puffs & Light Snacks</option>
//                 <option>Sweeteners & Honey Products</option>
//                 <option>Health & Wellness Foods</option>
//                 <option>Flours</option>
//               </select>

//               <button className="ap-category-btn">Add Category</button>
//             </div>
//             </div>
          
//             {/* LEFT FORM */}
           
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// };

// export default AddProduct;

//working perfectly but dnt have ability to add multiple images at a time

// import React, { useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import Sidebar from "./sidebar";
// import Header from "./topbar";
// import "./styles/addProduct.css";

// const AddProduct = () => {
//   const location = useLocation();
//   const navigate = useNavigate();

//   const ProductCategoryID = location.state?.ProductCategoryID;
//   const CategoryName = location.state?.CategoryName;

//   const [productName, setProductName] = useState("");
//   const [productDescription, setProductDescription] = useState("");
//   const [weight, setWeight] = useState("");
//   const [weightUnit, setWeightUnit] = useState("gm");
//   const [price, setPrice] = useState("");
//   const [discountPrice, setDiscountPrice] = useState("");
//   const [quantity, setQuantity] = useState("");
//   const [images, setImages] = useState<File[]>([]);

//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (!e.target.files) return;
//     setImages(Array.from(e.target.files));
//   };

//   const handleSubmit = async () => {
//     try {
//       if (!ProductCategoryID) {
//         alert("Category is required");
//         return;
//       }

//       if (!productName || !price) {
//         alert("Product name and price are required");
//         return;
//       }

//       // =========================
//       // 1️⃣ CREATE PRODUCT
//       // =========================
//       const productRes = await fetch("http://localhost:4000/api/products", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json"
//         },
//         body: JSON.stringify({
//           ProductCategoryID,
//           ProductName: productName,
//           ProductDescription: productDescription,
//           ProductWeight: `${weight} ${weightUnit}`,   // ✅ FIXED
//           Quantity: quantity || 0,                    // ✅ FIXED
//           Status: 1,
//           IsFeatured: 0,
//           CreatedBy: 1
//         })
//       });

//       const productData = await productRes.json();

//       if (!productRes.ok || !productData.success) {
//         alert(productData.message || "Product creation failed");
//         return;
//       }

//       const ProductID = productData.ProductID;

//       // =========================
//       // 2️⃣ CREATE PRICE
//       // =========================
//       await fetch("http://localhost:4000/api/product-prices", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json"
//         },
//         body: JSON.stringify({
//           ProductID,
//           Price: Number(price),                     // ✅ ensure number
//           DiscountPrice: discountPrice
//             ? Number(discountPrice)
//             : null,
//           CreatedBy: 1
//         })
//       });

//       // =========================
//       // 3️⃣ UPLOAD IMAGES
//       // =========================
//       if (images.length > 0) {
//         const formData = new FormData();

//         images.forEach((file) => {
//           formData.append("images", file);
//         });

//         formData.append("ProductID", String(ProductID));
//         console.log("Uploading images for ProductID:", ProductID);
// console.log("Images:", images);

//         await fetch(`http://localhost:4000/api/attachments/${ProductID}`, {
//           method: "POST",
//           body: formData
//         });
//       }

//       alert("✅ Product added successfully");

//       // Reset form
//       setProductName("");
//       setProductDescription("");
//       setWeight("");
//       setPrice("");
//       setDiscountPrice("");
//       setQuantity("");
//       setImages([]);

//       navigate("/addProduct");

//     } catch (error) {
//       console.error(error);
//       alert("Something went wrong");
//     }
//   };

//   return (
//     <div className="ad-app">
//       <Sidebar />
//       <main className="ad-main">
//         <Header />

//         <div className="ap-wrapper">
//           <div className="ap-card">

//             <div className="ap-header">
//               <h3>➕ Add New Product</h3>
//             </div>

//             <div className="ap-lftrght">

//               {/* LEFT PANEL */}
//               <div className="ap-left">

//                 <h4>General Information:</h4>

//                 <label>Product Name:</label>
//                 <input
//                   type="text"
//                   value={productName}
//                   onChange={(e) => setProductName(e.target.value)}
//                 />

//                 <label>Product Details:</label>
//                 <textarea
//                   value={productDescription}
//                   onChange={(e) => setProductDescription(e.target.value)}
//                 />

//                 <div className="ap-row">
//                   <div>
//                     <label>Weight</label>
//                     <div className="ap-input-group">
//                       <input
//                         type="number"
//                         value={weight}
//                         onChange={(e) => setWeight(e.target.value)}
//                       />
//                       <select
//                         value={weightUnit}
//                         onChange={(e) => setWeightUnit(e.target.value)}
//                       >
//                         <option value="ml">ml</option>
//                         <option value="kg">kg</option>
//                         <option value="gm">gm</option>
//                       </select>
//                     </div>
//                   </div>

//                   <div>
//                     <label>Quantity In Stock</label>
//                     <input
//                       type="number"
//                       value={quantity}
//                       onChange={(e) => setQuantity(e.target.value)}
//                     />
//                   </div>
//                 </div>

//                 <h4>Price</h4>

//                 <div className="ap-row">
//                   <div>
//                     <label>Base Price</label>
//                     <input
//                       type="number"
//                       value={price}
//                       onChange={(e) => setPrice(e.target.value)}
//                     />
//                   </div>

//                   <div>
//                     <label>Discount Price</label>
//                     <input
//                       type="number"
//                       value={discountPrice}
//                       onChange={(e) => setDiscountPrice(e.target.value)}
//                     />
//                   </div>
//                 </div>

//               </div>

//               {/* RIGHT PANEL */}
//               <div className="ap-right">

//                 <div className="ap-actions">
//                   <button className="ap-add" onClick={handleSubmit}>
//                     Add Product
//                   </button>
//                 </div>

//                 <h4>Upload Images</h4>
//                 <input
//                   type="file"
//                   multiple
//                   accept="image/*"
//                   onChange={handleImageChange}
//                 />

//                 <label>Category</label>
//                 <input
//                   type="text"
//                   value={CategoryName || ""}
//                   disabled
//                 />

//               </div>

//             </div>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// };

// export default AddProduct;

import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Sidebar from "./sidebar";
import Header from "./topbar";
import "./styles/addProduct.css";

const AddProduct = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const ProductCategoryID = location.state?.ProductCategoryID;
  const CategoryName = location.state?.CategoryName;

  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [weight, setWeight] = useState("");
  const [weightUnit, setWeightUnit] = useState("ml");
  const [price, setPrice] = useState("");
  const [discountPrice, setDiscountPrice] = useState("");
  const [stock, setStock] = useState("In Stock");
  const [quantity, setQuantity] = useState("");
  const [sku,setSku]=useState("");
  const [images, setImages] = useState<File[]>([]);
  const [primaryIndex, setPrimaryIndex] = useState(0);

  // ================= IMAGE SELECT =================
  // const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   if (!e.target.files) return;

  //   const selected = Array.from(e.target.files).slice(0, 4);
  //   setImages(selected);
  //   setPrimaryIndex(0);
  // };

//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//   if (!e.target.files) return;

//   const selectedFiles = Array.from(e.target.files);

//   setImages((prevImages) => {
//     const combined = [...prevImages, ...selectedFiles];

//     // Limit total images to 4
//     return combined.slice(0, 4);
//   });

//   // Reset input so same file can be selected again if needed
//   e.target.value = "";
// };
const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  if (!e.target.files) return;

  const selectedFiles = Array.from(e.target.files);

  setImages((prevImages) => {
    const combined = [...prevImages, ...selectedFiles];

    // Limit to 4 images max
    return combined.slice(0, 4);
  });

  // Reset input value so same file can be selected again
  e.target.value = "";
};


  const setPrimary = (index: number) => {
    setPrimaryIndex(index);
  };

  // ================= SUBMIT =================
  const handleSubmit = async () => {
    try {
      if (!ProductCategoryID || !productName || !price) {
        alert("Fill required fields");
        return;
      }

      // CREATE PRODUCT
      const productRes = await fetch("http://localhost:4000/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ProductCategoryID,
          ProductName: productName,
          ProductDescription: productDescription,
          ProductWeight: `${weight} ${weightUnit}`,
          Quantity: quantity || 0,
          Status: stock == "In Stock" ? 1 : 0,
          SKU:sku,
          IsFeatured: 0,
          CreatedBy: 1
        })
      });

      const productData = await productRes.json();
      const ProductID = productData.ProductID;

      // CREATE PRICE
      await fetch("http://localhost:4000/api/product-prices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ProductID,
          Price: Number(price),
          DiscountPrice: discountPrice ? Number(discountPrice) : null,
          CreatedBy: 1
        })
      });

      // REORDER IMAGES (PRIMARY FIRST)
      const reorderedImages = [
        images[primaryIndex],
        ...images.filter((_, i) => i !== primaryIndex)
      ];

      if (reorderedImages.length > 0) {
        const formData = new FormData();
        reorderedImages.forEach((file) => {
          formData.append("images", file);
        });

        await fetch(
          `http://localhost:4000/api/attachments/${ProductID}`,
          {
            method: "POST",
            body: formData
          }
        );
      }

      alert("✅ Product Added");
     
      

    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };
  const removeImage = (index: number) => {
  setImages((prev) => {
    const updated = prev.filter((_, i) => i !== index);

    if (index === primaryIndex) {
      setPrimaryIndex(0);
    } else if (index < primaryIndex) {
      setPrimaryIndex((prevIndex) => prevIndex - 1);
    }

    return updated;
  });
};


  return (
    <div className="ad-app">
      <Sidebar />

      <main className="ad-main">
        <Header />

        <div className="ap-wrapper">
          <div className="ap-card">

            <div className="ap-header">
              <h3>➕ Add New Product</h3>
            </div>

            <div className="ap-lftrght">

              {/* LEFT PANEL */}
              <div className="ap-left">

                <h4>General Information:</h4>

                <label>Product Name:</label>
                <input
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                />

                <label>Product Details:</label>
                <textarea
                  value={productDescription}
                  onChange={(e) => setProductDescription(e.target.value)}
                />

                <div className="ap-row">
                  <div>
                    <label>Weight</label>
                    <div className="ap-input-group">
                      <input
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                      />
                      <select
                        value={weightUnit}
                        onChange={(e) => setWeightUnit(e.target.value)}
                      >
                        <option value="ml">ml</option>
                        <option value="kg">kg</option>
                        <option value="gm">gm</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label>Stock</label>
                    <select
                      value={stock}
                      onChange={(e) => setStock(e.target.value)}
                    >
                      <option>In Stock</option>
                      <option>Out of Stock</option>
                    </select>
                  </div>
                </div>

                <h4>Price and Stock</h4>

                <div className="ap-row">
                  <div>
                    <label>Base Pricing</label>
                    <div className="ap-input-group">
                      <input
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                      />
                      <select>
                        <option>Rs.</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label>Quantity In Stock</label>
                    <input
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                    />
                  </div>
                </div>

                <div className="ap-row">
                  <div>
                    <label>Discount</label>
                    <input
                      value={discountPrice}
                      onChange={(e) => setDiscountPrice(e.target.value)}
                    />
                  </div>
                  <div>
                     <label>S K U</label>
                     <input
                       type="text"
                       value={sku}
                       onChange={(e) => setSku(e.target.value)}
                     />
                  </div>
                </div>

              </div>

              {/* RIGHT PANEL */}
              <div className="ap-right">

                <div className="ap-actions">
                  <button className="ap-draft">Save Draft</button>
                  <button className="ap-add" onClick={handleSubmit}>
                    Add Product
                  </button>
                </div>

                <h4>Upload Image</h4>

                {/* Hidden Input */}
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  id="imageUpload"
                  style={{ display: "none" }}
                  onChange={handleImageChange}
                />

                {/* BIG IMAGE CONTAINER */}
                {/* <div
                  className="ap-upload-box"
                  onClick={() =>
                    document.getElementById("imageUpload")?.click()
                  }
                  style={{ cursor: "pointer", overflow: "hidden" }}
                > */}
                <div
  className="ap-upload-box"
  onClick={() => {
    // Allow click ONLY if no images yet
    if (images.length === 0) {
      document.getElementById("imageUpload")?.click();
    }
  }}
  style={{
    cursor: images.length === 0 ? "pointer" : "default",
    overflow: "hidden"
  }}
>
                  {images.length > 0 ? (
                    <img
                      src={URL.createObjectURL(images[primaryIndex])}
                      alt="primary"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        borderRadius: "15px"
                      }}
                    />
                  ) : (
                    <span style={{ fontSize: "40px", color: "#7ddc7a" }}>
                      +
                    </span>
                  )}
                </div>
                 

                {/* SMALL THUMBNAILS */}
                {/* <div className="ap-thumbs">
                  {images.map((img, index) => (
                    <div
                      key={index}
                      className="ap-thumb"
                      onClick={() => setPrimary(index)}
                      style={{
                        overflow: "hidden",
                        border:
                          index === primaryIndex
                            ? "2px solid #2ecc71"
                            : "1px solid #bfe5b8",
                        cursor: "pointer"
                      }}
                    >
                      <img
                        src={URL.createObjectURL(img)}
                        alt=""
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          borderRadius: "50%"
                        }}
                      />
                    </div>
                  ))}

                  {images.length < 4 && (
                    <div
                      className="ap-thumb ap-add-thumb"
                      onClick={() =>
                        document.getElementById("imageUpload")?.click()
                      }
                      style={{ cursor: "pointer" }}
                    >
                      +
                    </div>
                  )}
                </div> */}
                <div className="ap-thumbs">
  {images.map((img, index) => (
    <div
      key={index}
      className="ap-thumb"
      style={{ position: "relative" }}
      onClick={() => setPrimary(index)}
    >
      <img
        src={URL.createObjectURL(img)}
        alt=""
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          borderRadius: "50%"
        }}
      />

      {/* Delete Button */}
      <span
        onClick={(e) => {
          e.stopPropagation();
          removeImage(index);
        }}
        style={{
          position: "absolute",
          top: "-5px",
          right: "-5px",
          background: "red",
          color: "white",
          width: "16px",
          height: "16px",
          borderRadius: "50%",
          fontSize: "12px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer"
        }}
      >
        ×
      </span>
    </div>
  ))}

  {images.length < 4 && (
    <div
      className="ap-thumb ap-add-thumb"
      onClick={() =>
                        document.getElementById("imageUpload")?.click()}
    >
      +
    </div>
  )}
</div>


                <label>Category</label>
                <input value={CategoryName || ""} disabled />

              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default AddProduct;
