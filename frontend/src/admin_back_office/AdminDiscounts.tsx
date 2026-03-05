import React from "react";
import Sidebar from "./sidebar";
import Header from "./topbar";
import "./styles/AdminDiscounts.css";

const AdminDiscounts = () => {
  return (
    <div className="admin-layout">
      <Sidebar />

      <div className="admin-main">
        <Header />

        <div className="adm-dscnts-header">
          <h2 className="adm-dscnts-title">Create Discount</h2>

          <div className="adm-dscnts-header-actions">
            <button className="adm-dscnts-btn-cancel">Cancel</button>
            <button className="adm-dscnts-btn-save">Save Discount</button>
          </div>
        </div>

        <div className="adm-dscnts-page">

          <div className="adm-dscnts-grid">

            {/* LEFT SIDE */}

            <div className="adm-dscnts-left">

              {/* BASIC INFO */}

              <div className="adm-dscnts-card">

                <h3 className="adm-dscnts-card-title">
                  Basic Discount Information
                </h3>

                <div className="adm-dscnts-form-row">

                  <div>
                    <label className="adm-dscnts-label">
                      Discount Name
                    </label>

                    <input
                      className="adm-dscnts-input"
                      placeholder="Enter discount name"
                    />
                  </div>

                  <div>
                    <label className="adm-dscnts-label">
                      Coupon Code (Optional)
                    </label>

                    <div className="adm-dscnts-generate">
                      <input
                        className="adm-dscnts-input"
                        placeholder="e.g. SAVE10"
                      />
                      <button className="adm-dscnts-generate-btn">
                        Generate
                      </button>
                    </div>
                  </div>

                </div>

                <label className="adm-dscnts-label">
                  Discount Type
                </label>

                <div className="adm-dscnts-type">
                  <button className="adm-dscnts-type-btn">% Percentage</button>
                  <button className="adm-dscnts-type-btn">Flat Amount</button>
                  <button className="adm-dscnts-type-btn">Buy X Get Y</button>
                  <button className="adm-dscnts-type-btn">Free Shipping</button>
                </div>

                <div className="adm-dscnts-form-row">

                  <div>
                    <label className="adm-dscnts-label">
                      Discount Value
                    </label>

                    <input
                      className="adm-dscnts-input"
                      placeholder="%"
                    />
                  </div>

                </div>

              </div>


              {/* APPLICABILITY */}

              <div className="adm-dscnts-card">

                <h3 className="adm-dscnts-card-title">
                  Applicability
                </h3>

                <div className="adm-dscnts-form-row">

                  <div>
                    <label className="adm-dscnts-label">
                      Apply To
                    </label>

                    <select className="adm-dscnts-select">
                      <option>Specific Products</option>
                    </select>
                  </div>

                  <div>
                    <label className="adm-dscnts-label">
                      Select Products
                    </label>

                    <input
                      className="adm-dscnts-input"
                      placeholder="Select Products (3)"
                    />
                  </div>

                </div>


                <div className="adm-dscnts-form-row">

                  <div>
                    <label className="adm-dscnts-label">
                      Customer Type
                    </label>

                    <select className="adm-dscnts-select">
                      <option>All Customers</option>
                    </select>
                  </div>

                </div>


                <div className="adm-dscnts-form-row">

                  <div>
                    <label className="adm-dscnts-label">
                      Min Order Amount
                    </label>

                    <input
                      className="adm-dscnts-input"
                      placeholder="₹ 0.00"
                    />
                  </div>

                  <div>
                    <label className="adm-dscnts-label">
                      Max Discount
                    </label>

                    <input
                      className="adm-dscnts-input"
                      placeholder="₹ 500"
                    />
                  </div>

                </div>

              </div>

            </div>



            {/* RIGHT SIDE */}

            <div className="adm-dscnts-right">


              {/* VALIDITY */}

              <div className="adm-dscnts-card">

                <h3 className="adm-dscnts-card-title">
                  Validity & Usage
                </h3>


                <div className="adm-dscnts-date-row">

                  <div>
                    <label className="adm-dscnts-label">
                      Start Date
                    </label>

                    <input
                      type="date"
                      className="adm-dscnts-input"
                    />
                  </div>

                  <div>
                    <label className="adm-dscnts-label">
                      End Date
                    </label>

                    <input
                      type="date"
                      className="adm-dscnts-input"
                    />
                  </div>

                </div>


                <div className="adm-dscnts-field">

                  <label className="adm-dscnts-label">
                    Usage Limit
                  </label>

                  <input
                    className="adm-dscnts-input"
                    placeholder="Enter limit"
                  />

                </div>


                <div className="adm-dscnts-field">

                  <label className="adm-dscnts-label">
                    Per Customer
                  </label>

                  <select className="adm-dscnts-select">
                    <option>Once</option>
                    <option>Unlimited</option>
                  </select>

                </div>


                <div className="adm-dscnts-checkbox">
                  <input type="checkbox" />
                  <span className="adm-dscnts-span">
                    First Order Only
                  </span>
                </div>

              </div>


              {/* STATUS */}

              <div className="adm-dscnts-card">

                <h3 className="adm-dscnts-card-title">
                  Status & Preview
                </h3>

                <label className="adm-dscnts-label">
                  Status
                </label>

                <select className="adm-dscnts-select">
                  <option>Active</option>
                  <option>Inactive</option>
                </select>


                <div className="adm-dscnts-preview">

                  <h4 className="adm-dscnts-preview-title">
                    Preview Discount
                  </h4>

                  <div className="adm-dscnts-preview-row">
                    <span className="adm-dscnts-span">Cart Value</span>
                    <span className="adm-dscnts-span">₹2,000.00</span>
                  </div>

                  <div className="adm-dscnts-preview-row">
                    <span className="adm-dscnts-span">Discount (10%)</span>
                    <span className="adm-dscnts-span adm-dscnts-green">
                      -₹200.00
                    </span>
                  </div>

                  <div className="adm-dscnts-preview-row total">
                    <span className="adm-dscnts-span">Final Payable</span>
                    <span className="adm-dscnts-span">₹1,800.00</span>
                  </div>

                </div>


                {/* <div className="adm-dscnts-bottom-btn">
                  <button className="adm-dscnts-btn-cancel">
                    Cancel
                  </button>

                  <button className="adm-dscnts-btn-save">
                    Save Discount
                  </button>
                </div> */}

              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default AdminDiscounts;