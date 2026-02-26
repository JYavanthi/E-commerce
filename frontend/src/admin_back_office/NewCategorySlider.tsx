// import React from "react";
// import "./styles/NewCategorySlider.css";

// interface Props {
//   isOpen: boolean;
//   onClose: () => void;
// }

// const NewCategorySlider: React.FC<Props> = ({ isOpen, onClose }) => {
//   return (
//     <>
//       {/* Overlay */}
//       {isOpen && <div className="admin-slider-overlay" onClick={onClose}></div>}

//       {/* Slider */}
//       <div className={`admin-slider ${isOpen ? "open" : ""}`}>
//         <div className="admin-slider-header">
//           <h3>New Category</h3>
//           <span onClick={onClose}>×</span>
//         </div>

//         <div className="admin-slider-body">
//           <div className="admin-slider-image-upload">
//             <button className="admin-slider-plus">+</button>
//           </div>

//           <label>Category Name</label>
//           <input type="text" />

//           <label>Description</label>
//           <textarea maxLength={500}></textarea>
//           <small>max 500 characters</small>

//           <div className="admin-slider-buttons">
//             <button className="publish-btn">Publish</button>
//             <button className="draft-btn">Draft</button>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default NewCategorySlider;
import React, { useState } from "react";
import "./styles/NewCategorySlider.css";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onCategoryCreated?: () => void; // optional refresh callback
}

const NewCategorySlider: React.FC<Props> = ({
  isOpen,
  onClose,
  onCategoryCreated
}) => {
  const [categoryName, setCategoryName] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  // Handle image selection
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handlePublish = async () => {
    if (!categoryName) {
      alert("Category name required");
      return;
    }

    const formData = new FormData();
    formData.append("CategoryName", categoryName);
    formData.append("CategoryDescription", description);
    formData.append("Status", "1");
    formData.append("DisplayOrder", "0");
    formData.append("CreatedBy", "1");

    if (imageFile) {
      formData.append("CategoryImage", imageFile); // must match multer field name
    }

    try {
      const res = await fetch(
        "http://localhost:4000/api/product-categories",
        {
          method: "POST",
          body: formData, // ❗ DO NOT set Content-Type manually
        }
      );

      const data = await res.json();

      if (data.success) {
        alert("Category created successfully");

        // Reset form
        setCategoryName("");
        setDescription("");
        setImageFile(null);
        setPreview(null);

        if (onCategoryCreated) onCategoryCreated();
        onClose();
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error creating category:", error);
    }
  };

  return (
    <>
      {isOpen && (
        <div className="admin-slider-overlay" onClick={onClose}></div>
      )}

      <div className={`admin-slider ${isOpen ? "open" : ""}`}>
        <div className="admin-slider-header">
          <h3>New Category</h3>
          <span onClick={onClose}>×</span>
        </div>

        <div className="admin-slider-body">
          {/* IMAGE UPLOAD */}
          <label>Category Image</label>
          <input type="file" accept="image/*" onChange={handleImageUpload} />

          {preview && (
            <img
              src={preview}
              alt="preview"
              style={{
                width: "100%",
                marginTop: "10px",
                borderRadius: "8px",
              }}
            />
          )}

          <label>Category Name</label>
          <input
            type="text"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
          />

          <label>Description</label>
          <textarea
            maxLength={500}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <small>max 500 characters</small>

          <div className="admin-slider-buttons">
            <button className="publish-btn" onClick={handlePublish}>
              Publish
            </button>
            <button className="draft-btn" onClick={onClose}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default NewCategorySlider;
