// import React, { useState } from "react";
// import Navbar from "./Navbar/navbar";
// import Footer from "./footer";
// import "./styles/address.css";
// import { useNavigate } from "react-router-dom";
// import { useAddress } from "./context/AddressContext";
// import AddressFormModal from "./addressFormModal";

// const emptyForm = {
//   flat: "",
//   street: "",
//   landmark: "",
//   pincode: "",
//   city: "",
//   state: "",
//   name: "",
//   mobile: "",
//   type: "Home",
//   default: false,
// };

// const Address = () => {
//   const navigate = useNavigate();
//   const { addresses, selectedAddress, selectAddress, addAddress, updateAddress, deleteAddress } =
//     useAddress();

//   const [showForm, setShowForm] = useState(false);
//   const [editingId, setEditingId] = useState<number | null>(null);
//   const [form, setForm] = useState<any>(emptyForm);

//   /* ---------- ADD ---------- */
//   const openAddForm = () => {
//     setEditingId(null);
//     setForm({ ...emptyForm });
//     setShowForm(true);
//   };

//   /* ---------- EDIT ---------- */
//   const openEditForm = (item: any) => {
//     setEditingId(item.id);
//     setForm({ ...item });
//     setShowForm(true);
//   };

//   /* ---------- SAVE ---------- */
//   const handleSave = () => {
//     if (!form.name || !form.mobile || !form.street) {
//       alert("Please fill required fields");
//       return;
//     }

//     if (editingId) {
//       updateAddress({ ...form, id: editingId });
//     } else {
//       addAddress({ ...form, id: Date.now() });
//     }

//     setShowForm(false);
//     setEditingId(null);
//     setForm({ ...emptyForm });
//   };

//   return (
//     <>
//       <Navbar />

//       <div className="profile-page-1">
//         <div className="profile-content-add">
//           {/* SIDEBAR */}
//           <div className="profile-sidebar">
//             <button onClick={() => navigate("/profile")}>MY ORDERS</button>
//             <button className="active">SAVED ADDRESS</button>
//             <button onClick={() => navigate("/t&c")}>TERMS & CONDITIONS</button>
//             <button onClick={() => navigate("/privacy-policy")}>PRIVACY POLICY</button>
//             <button
//             className="logout-btn"
//             onClick={() => {
//                const confirmLogout = window.confirm("Do you want to logout?");
//               if (confirmLogout) {
//                 localStorage.clear();
//                 navigate("/");
//                     }
//                   }}
//                 >
//                   LOG OUT
//                 </button>
//             <button className="delete-btn">DELETE ACCOUNT</button>
//           </div>

//           {/* ADDRESS LIST */}
//           <div className="address-section">
//             <h2>Deliver To</h2>

//             {addresses.map((item: any) => (
//               <div
//                 key={item.id}
//                 className={`address-card ${
//                   selectedAddress?.id === item.id ? "selected" : ""
//                 }`}
//                 onClick={() => selectAddress(item)}
//               >
//                 <input
//                   type="radio"
//                   checked={selectedAddress?.id === item.id}
//                   readOnly aria-label=".."
//                 />

//                 <div className="address-details">
//                   <h3>{item.name} ({item.type})</h3>
//                   <p><span>No {item.flat},{item.street},{item.city},{item.state},{item.pincode}</span><span>{item.address}</span></p>
//                   <p>{item.mobile}</p>
//                 </div>

//                 <div className="edt-del">
//                   <button
//                     className="add-edit-btn"
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       openEditForm(item);
//                     }}
//                   >
//                     Edit
//                   </button>

//                   <button
//                     className="add-delete-btn"
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       deleteAddress(item.id);
//                     }}
//                   >
//                     Delete
//                   </button>
//                 </div>
//               </div>
//             ))}

//             <button
//               className="select-continue-btn"
//               disabled={!selectedAddress}
//               onClick={() => navigate("/cart-address")}
//             >
//               Select & Continue
//             </button>

//             <button className="add-address-btn" onClick={openAddForm}>
//               + Add New Address
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* ✅ MODAL FORM */}
//       <AddressFormModal
//         open={showForm}
//         onClose={() => setShowForm(false)}
//         form={form}
//         setForm={setForm}
//         onSave={handleSave}
//         isEdit={!!editingId}
//       />

//       <Footer />
//     </>
//   );
// };

// export default Address;


import React, { useState } from "react";
import Navbar from "./Navbar/navbar";
import Footer from "./footer";
import "./styles/address.css";
import { useNavigate } from "react-router-dom";
import { useAddress } from "./context/AddressContext";
import AddressFormModal from "./addressFormModal";

const emptyForm = {
  flat: "",
  street: "",
  landmark: "",
  pincode: "",
  city: "",
  state: "",
  name: "",
  mobile: "",
  type: "Home",
  default: false,
};

const Address = () => {
  const navigate = useNavigate();
  const { addresses, selectedAddress, selectAddress, addAddress, updateAddress, deleteAddress } =
    useAddress();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<any>(emptyForm);

  /* ---------- ADD ---------- */
  const openAddForm = () => {
    setEditingId(null);
    setForm({ ...emptyForm });
    setShowForm(true);
  };

  /* ---------- EDIT ---------- */
  const openEditForm = (item: any) => {
    setEditingId(item.id);
    setForm({ ...item });
    setShowForm(true);
  };

  /* ---------- SAVE ---------- */
  const handleSave = () => {
    if (!form.name || !form.mobile || !form.street) {
      alert("Please fill required fields");
      return;
    }

    if (editingId) {
      updateAddress({ ...form, id: editingId });
    } else {
      addAddress({ ...form, id: Date.now() });
    }

    setShowForm(false);
    setEditingId(null);
    setForm({ ...emptyForm });
  };

  return (
    <>
      <Navbar />

      <div className="profile-page-1">
        <div className="profile-content-add">
          {/* SIDEBAR */}
          <div className="profile-sidebar">
            <button onClick={() => navigate("/profile")}>MY ORDERS</button>
            <button className="active">SAVED ADDRESS</button>
            <button onClick={() => navigate("/t&c")}>TERMS & CONDITIONS</button>
            <button onClick={() => navigate("/privacy-policy")}>PRIVACY POLICY</button>
            <button
            className="logout-btn"
            onClick={() => {
               const confirmLogout = window.confirm("Do you want to logout?");
              if (confirmLogout) {
                localStorage.clear();
                navigate("/");
                    }
                  }}
                >
                  LOG OUT
                </button>
            <button className="delete-btn">DELETE ACCOUNT</button>
          </div>

          {/* ADDRESS LIST */}
          <div className="address-section">
            <h2>Deliver To</h2>

            {addresses.map((item: any) => (
              <div
                key={item.id}
                className={`address-card ${
                  selectedAddress?.id === item.id ? "selected" : ""
                }`}
                onClick={() => selectAddress(item)}
              >
                <input
                  type="radio"
                  checked={selectedAddress?.id === item.id}
                  readOnly aria-label=".."
                />

                <div className="address-details">
                  <h3>{item.name} ({item.type})</h3>
                  <p><span>No {item.flat},{item.street},{item.city},{item.state},{item.pincode}</span><span>{item.address}</span></p>
                  <p>{item.mobile}</p>
                </div>

                <div className="edt-del">
                  <button
                    className="add-edit-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      openEditForm(item);
                    }}
                  >
                    Edit
                  </button>

                  <button
                    className="add-delete-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteAddress(item.id);
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}

            <button
              className="select-continue-btn"
              disabled={!selectedAddress}
              onClick={() => navigate("/cart-address")}
            >
              Select & Continue
            </button>

            <button className="add-address-btn" onClick={openAddForm}>
              + Add New Address
            </button>
          </div>
        </div>
      </div>

      {/* ✅ MODAL FORM */}
      <AddressFormModal
        open={showForm}
        onClose={() => setShowForm(false)}
        form={form}
        setForm={setForm}
        onSave={handleSave}
        isEdit={!!editingId}
      />

      <Footer />
    </>
  );
};

export default Address;
