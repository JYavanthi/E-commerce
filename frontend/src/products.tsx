import React from "react";
import "../src/styles/products.css";

function Products() {
  return (
    <section className="product-section">
      <div className="product-header">
        <p className="product-edit">PRODUCT EDIT</p>
        <h2 className="section-title">SCIENCE-CRAFTED NATURAL FOODS</h2>     
      </div>     
      <div className="product-text">
          <p>
            From flaxseed blends and green teas to seed mixes, plant proteins and 
            honey spreads each Brihati product is designed to be functional, 
            flavourful and ready for modern lifestyles.
          </p>
      </div>
    </section>
  );
}
export default Products;
