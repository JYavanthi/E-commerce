import React from "react";
import "./styles/addressFormModal.css";

const AddressFormModal = ({
  open,
  onClose,
  form,
  setForm,
  onSave,
  isEdit,
}: any) => {
  if (!open) return null;

  return (
    <div className="address-overlay">
      <div className="address-modal">
        <button className="close-x" onClick={onClose}>×</button>

        <div className="address-form-ui">
          <h3>Add new address</h3>  
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
                key={t}
                className={form.type === t ? "active" : ""}
                onClick={() => setForm({ ...form, type: t })}
              >
                {t}
              </button>
            ))}
            <button className="address-save-btn" onClick={onSave}>
            SAVE
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
