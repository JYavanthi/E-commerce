
// import React from "react";
// import "./styles/addressFormModal.css";

// interface AddressFormProps {
//   open: boolean;
//   onClose: () => void;
//   form: any;
//   setForm: any;
//   userId: number;   // 👈 dynamic user id
// }

// const AddressFormModal: React.FC<AddressFormProps> = ({
//   open,
//   onClose,
//   form,
//   setForm,
//   userId
// }) => {

//   if (!open) return null;

//   const onSave = async () => {
//     try {
//       const payload = {
//         userId: userId,   // 👈 dynamic
//         name: form.name,
//         mobile: form.mobile,
//         flat: form.flat,
//         street: form.street,
//         landmark: form.landmark,
//         city: form.city,
//         state: form.state,
//         pincode: form.pincode,
//         type: form.type,
//         isDefault: form.default
//       };

//       const res = await fetch("http://localhost:4000/api/address", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json"
//         },
//         body: JSON.stringify(payload)
//       });

//       const data = await res.json();

//       if (data.success) {
//         alert("Address added successfully");
//         onClose();

//         // optional: reset form
//         setForm({
//           flat: "",
//           street: "",
//           landmark: "",
//           pincode: "",
//           city: "",
//           state: "",
//           name: "",
//           mobile: "",
//           type: "Home",
//           default: false
//         });
//       } else {
//         alert("Failed to add address");
//       }

//     } catch (error) {
//       console.error("Address Save Error:", error);
//       alert("Something went wrong");
//     }
//   };

//   return (
//     <div className="address-overlay">
//       <div className="address-modal">

//         <button className="close-x" onClick={onClose}>×</button>

//         <div className="address-form-ui">

//           <h3>Add new address</h3>

//           <input
//             placeholder="Flat No / Building / Company*"
//             value={form.flat}
//             onChange={(e) => setForm({ ...form, flat: e.target.value })}
//           />

//           <input
//             placeholder="Street Name, Area*"
//             value={form.street}
//             onChange={(e) => setForm({ ...form, street: e.target.value })}
//           />

//           <input
//             placeholder="Landmark"
//             value={form.landmark}
//             onChange={(e) => setForm({ ...form, landmark: e.target.value })}
//           />

//           <input
//             placeholder="Pincode*"
//             value={form.pincode}
//             onChange={(e) => setForm({ ...form, pincode: e.target.value })}
//           />

//           <div className="two-col">
//             <input
//               placeholder="City/District"
//               value={form.city}
//               onChange={(e) => setForm({ ...form, city: e.target.value })}
//             />
//             <input
//               placeholder="State"
//               value={form.state}
//               onChange={(e) => setForm({ ...form, state: e.target.value })}
//             />
//           </div>

//           <h3>Contact Details</h3>

//           <input
//             placeholder="Name*"
//             value={form.name}
//             onChange={(e) => setForm({ ...form, name: e.target.value })}
//           />

//           <input
//             placeholder="Contact No."
//             value={form.mobile}
//             onChange={(e) => setForm({ ...form, mobile: e.target.value })}
//           />

//           <h3>Save Address As</h3>

//           <div className="type-btns">
//             {["Home", "Work", "Other"].map((t) => (
//               <button
//                 type="button"
//                 key={t}
//                 className={form.type === t ? "active" : ""}
//                 onClick={() => setForm({ ...form, type: t })}
//               >
//                 {t}
//               </button>
//             ))}

//             <button
//               type="button"
//               className="address-save-btn"
//               onClick={onSave}
//             >
//               SAVE
//             </button>
//           </div>

//           <label className="default-check">
//             <input
//               type="checkbox"
//               checked={form.default}
//               onChange={(e) =>
//                 setForm({ ...form, default: e.target.checked })
//               }
//             />
//             Save this as default address
//           </label>

//         </div>
//       </div>
//     </div>
//   );
// };

// export default AddressFormModal;


// import React from "react";
// import "./styles/addressFormModal.css";
// import { useAddress } from "./context/AddressContext";

// interface AddressFormProps {
//   open: boolean;
//   onClose: () => void;
//   form: any;
//   setForm: any;
//   userId: number;
// }

// const AddressFormModal: React.FC<AddressFormProps> = ({
//   open,
//   onClose,
//   form,
//   setForm,
//   userId
// }) => {

//   const { addAddress } = useAddress();  // ✅ use context API

//   if (!open) return null;

//   const onSave = async () => {
//     try {

//       await addAddress(userId, {
//         name: form.name,
//         mobile: form.mobile,
//         flat: form.flat,
//         street: form.street,
//         city: form.city,
//         state: form.state,
//         pincode: form.pincode,
//         type: form.type,
//         isDefault: form.default
//       });

//       alert("Address added successfully");

//       // Reset form
//       setForm({
//         flat: "",
//         street: "",
//         landmark: "",
//         pincode: "",
//         city: "",
//         state: "",
//         name: "",
//         mobile: "",
//         type: "Home",
//         default: false
//       });

//       onClose();

//     } catch (error) {
//       console.error("Address Save Error:", error);
//       alert("Something went wrong");
//     }
//   };

//   return (
//     <div className="address-overlay">
//       <div className="address-modal">

//         <button className="close-x" onClick={onClose}>×</button>

//         <div className="address-form-ui">

//           <h3>Add new address</h3>

//           <input
//             placeholder="Flat No / Building / Company*"
//             value={form.flat}
//             onChange={(e) => setForm({ ...form, flat: e.target.value })}
//           />

//           <input
//             placeholder="Street Name, Area*"
//             value={form.street}
//             onChange={(e) => setForm({ ...form, street: e.target.value })}
//           />

//           <input
//             placeholder="Landmark"
//             value={form.landmark}
//             onChange={(e) => setForm({ ...form, landmark: e.target.value })}
//           />

//           <input
//             placeholder="Pincode*"
//             value={form.pincode}
//             onChange={(e) => setForm({ ...form, pincode: e.target.value })}
//           />

//           <div className="two-col">
//             <input
//               placeholder="City/District"
//               value={form.city}
//               onChange={(e) => setForm({ ...form, city: e.target.value })}
//             />
//             <input
//               placeholder="State"
//               value={form.state}
//               onChange={(e) => setForm({ ...form, state: e.target.value })}
//             />
//           </div>

//           <h3>Contact Details</h3>

//           <input
//             placeholder="Name*"
//             value={form.name}
//             onChange={(e) => setForm({ ...form, name: e.target.value })}
//           />

//           <input
//             placeholder="Contact No."
//             value={form.mobile}
//             onChange={(e) => setForm({ ...form, mobile: e.target.value })}
//           />

//           <h3>Save Address As</h3>

//           <div className="type-btns">
//             {["Home", "Work", "Other"].map((t) => (
//               <button
//                 type="button"
//                 key={t}
//                 className={form.type === t ? "active" : ""}
//                 onClick={() => setForm({ ...form, type: t })}
//               >
//                 {t}
//               </button>
//             ))}

//             <button
//               type="button"
//               className="address-save-btn"
//               onClick={onSave}
//             >
//               SAVE
//             </button>
//           </div>

//           <label className="default-check">
//             <input
//               type="checkbox"
//               checked={form.default}
//               onChange={(e) =>
//                 setForm({ ...form, default: e.target.checked })
//               }
//             />
//             Save this as default address
//           </label>

//         </div>
//       </div>
//     </div>
//   );
// };

// export default AddressFormModal;



import React from "react";
import "./styles/addressFormModal.css";
import { useAddress } from "./context/AddressContext";

interface AddressFormProps {
  open: boolean;
  onClose: () => void;
  form: any;
  setForm: any;
  userId: number;
  editingId: number | null;
}

const AddressFormModal: React.FC<AddressFormProps> = ({
  open,
  onClose,
  form,
  setForm,
  userId,
  editingId
}) => {

  const { addAddress, updateAddress } = useAddress();

  if (!open) return null;

  const onSave = async () => {
    try {

      if (!form.name || !form.mobile || !form.street) {
        alert("Please fill required fields");
        return;
      }

      if (editingId) {
        // ✅ UPDATE ADDRESS
        await updateAddress(userId, {
          id: editingId,
          name: form.name,
          mobile: form.mobile,
          flat: form.flat,
          street: form.street,
          landmark: form.landmark,
          city: form.city,
          state: form.state,
          pincode: form.pincode,
          type: form.type,
          isDefault: form.default
        });

        alert("Address updated successfully");

      } else {
        // ✅ ADD ADDRESS
        await addAddress(userId, {
          name: form.name,
          mobile: form.mobile,
          flat: form.flat,
          street: form.street,
          landmark: form.landmark,
          city: form.city,
          state: form.state,
          pincode: form.pincode,
          type: form.type,
          isDefault: form.default
        });

        alert("Address added successfully");
      }

      // Reset form
      setForm({
        flat: "",
        street: "",
        landmark: "",
        pincode: "",
        city: "",
        state: "",
        name: "",
        mobile: "",
        type: "Home",
        default: false
      });

      onClose();

    } catch (error) {
      console.error("Address Save Error:", error);
      alert("Something went wrong");
    }
  };

  return (
    <div className="address-overlay">
      <div className="address-modal">

        <button className="close-x" onClick={onClose}>×</button>

        <div className="address-form-ui">

          <h3>{editingId ? "Edit Address" : "Add new address"}</h3>

          <input
            placeholder="Flat No / Building / Company*"
            value={form.flat}
            onChange={(e) => setForm({ ...form, flat: e.target.value })}
          />

          <input
            placeholder="Street Name, Area*"
            value={form.street}
            onChange={(e) => setForm({ ...form, street: e.target.value })}
          />

          <input
            placeholder="Landmark"
            value={form.landmark}
            onChange={(e) => setForm({ ...form, landmark: e.target.value })}
          />

          <input
            placeholder="Pincode*"
            value={form.pincode}
            onChange={(e) => setForm({ ...form, pincode: e.target.value })}
          />

          <div className="two-col">
            <input
              placeholder="City/District"
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
            />
            <input
              placeholder="State"
              value={form.state}
              onChange={(e) => setForm({ ...form, state: e.target.value })}
            />
          </div>

          <h3>Contact Details</h3>

          <input
            placeholder="Name*"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <input
            placeholder="Contact No."
            value={form.mobile}
            onChange={(e) => setForm({ ...form, mobile: e.target.value })}
          />

          <h3>Save Address As</h3>

          <div className="type-btns">
            {["Home", "Work", "Other"].map((t) => (
              <button
                type="button"
                key={t}
                className={form.type === t ? "active" : ""}
                onClick={() => setForm({ ...form, type: t })}
              >
                {t}
              </button>
            ))}

            <button
              type="button"
              className="address-save-btn"
              onClick={onSave}
            >
              {editingId ? "UPDATE" : "SAVE"}
            </button>
          </div>

          <label className="default-check">
            <input
              type="checkbox"
              checked={form.default}
              onChange={(e) =>
                setForm({ ...form, default: e.target.checked })
              }
            />
            Save this as default address
          </label>

        </div>
      </div>
    </div>
  );
};

export default AddressFormModal;