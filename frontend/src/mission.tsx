import React from "react";
import "../src/styles/mission.css"
const Mission = () => {
  return (
    <>
    <section className="mv-section">
      <h4 className="mv-subtitle">OUR PURPOSE</h4>
      <h1 className="mv-title">MISSION & VISION</h1>

      <div className="mv-container">
        
        {/* MISSION CARD */}
        <div className="mv-card">
          <h5 className="mv-label">MISSION</h5>
          <h2 className="mv-heading">Nourishing lives with functional foods</h2>

          <p className="mv-text">
            To create science-backed, clean-label functional foods that support diabetes
            management, heart health, immunity and everyday wellness — while preserving
            India's timeless food wisdom and supporting sustainable farming communities.
          </p>

          <ul className="mv-list">
            <li>Develop products that address specific health conditions</li>
            <li>Maintain clean-label integrity with no artificial additives</li>
            <li>Build direct farmer partnerships for quality sourcing</li>
            <li>Make functional nutrition accessible and affordable</li>
          </ul>
        </div>

        {/* VISION CARD */}
        <div className="mv-card">
          <h5 className="mv-label">VISION</h5>
          <h2 className="mv-heading">A global leader in Indian functional foods</h2>

          <p className="mv-text">
            To establish Brihati as a globally recognised brand that transforms how the world
            experiences Indian nutrition — blending ancient wisdom with modern science to
            create foods that heal, nourish and empower.
          </p>

          <ul className="mv-list">
            <li>Expand to 20+ countries by 2027</li>
            <li>Launch 50+ functional food products</li>
            <li>Partner with 10,000+ farmers across India</li>
            <li>Become the trusted choice for health-conscious families</li>
          </ul>
        </div>

      </div>
    </section>
      <div className="t-wrapper">

      {/* TOP HEADING */}
      <p className="t-subtitle">Testimonials</p>
      <h2 className="t-title">What Our Customers Say</h2>
      <p className="t-description">
       Join thousands of health-conscious families who trust Brihati for their daily nutrition needs.


      </p>
</div>
<section className="t-section">

      <div className="t-container">

        {/* CARD 1 */}
        <div className="t-card">
          <div className="t-quote"></div>

          <div className="t-stars">⭐⭐⭐⭐⭐</div>

          <p className="t-text">
            "The Flaxofeed powder has become a daily essential for me.
             My digestion has improved significantly, and I love that 
             it's completely natural with no extra additives."
          </p>

          <div className="t-tag">FLAXOFEED SEED POWDER</div>

          <hr className="t-divider" />

          <div className="t-footer">
            <div>
              <div className="t-name">Priya Sharma</div>
              <div className="t-loc">Mumbai, India</div>
            </div>
            <div className="t-date">November 2024</div>
          </div>
        </div>

        {/* CARD 2 */}
        <div className="t-card">
          <div className="t-quote"></div>

          <div className="t-stars">⭐⭐⭐⭐⭐</div>

          <p className="t-text">
            "As a diabetic, finding the right foods is challenging.
             Brihati's low-GI products have helped me manage my blood 
             sugar levels naturally. Highly recommend!"
          </p>

          <div className="t-tag">DIABETIC MINI MEALS</div>

          <hr className="t-divider" />

          <div className="t-footer">
            <div>
              <div className="t-name">Rajesh Kumar</div>
              <div className="t-loc">Dubai,UAE</div>
            </div>
            <div className="t-date">October 2024</div>
          </div>
        </div>

        {/* CARD 3 */}
        <div className="t-card">
          <div className="t-quote"></div>

          <div className="t-stars">⭐⭐⭐⭐⭐</div>

          <p className="t-text">
            "The jaggery powder is a game-changer!
             I've completely replaced refined sugar in my kitchen.
              It's pure, tastes authentic, and my family loves it a lot".
          </p>

          <div className="t-tag">JAGGERY POWDER</div>

          <hr className="t-divider" />

          <div className="t-footer">
            <div>
              <div className="t-name">Anita Desai</div>
              <div className="t-loc">Bangalore,India</div>
            </div>
            <div className="t-date">December 2024</div>
          </div>
        </div>

      </div>
      
      <div className="t-container">

        {/* CARD 4 */}
        <div className="t-card">
          <div className="t-quote"></div>

          <div className="t-stars">⭐⭐⭐⭐⭐</div>

          <p className="t-text">
            "Excellent quality products with authentic Indian flavors.
            The plant protein shake is my post-workout essential.
            Clean ingredients, great results and excellent product!"
          </p>

          <div className="t-tag">PLANT PROTEIN SHAKE</div>

          <hr className="t-divider" />

          <div className="t-footer">
            <div>
              <div className="t-name">Mohammed Al-Hashmi</div>
              <div className="t-loc">Muscat, Oman</div>
            </div>
            <div className="t-date">November 2024</div>
          </div>
        </div>

        {/* CARD 5 */}
        <div className="t-card">
          <div className="t-quote"></div>

          <div className="t-stars">⭐⭐⭐⭐⭐</div>

          <p className="t-text">
            "The Tranquil Bloom green tea is absolutely wonderful.
            It helps me unwind after a stressful day, and I appreciate the herbal blend.
            Perfect for relaxation!"
          </p>

          <div className="t-tag">TRANQUIL BLOOM GREEN TEA</div>

          <hr className="t-divider" />

          <div className="t-footer">
            <div>
              <div className="t-name">Kavita Reddy</div>
              <div className="t-loc">Hyderabad, India</div>
            </div>
            <div className="t-date">December 2024</div>
          </div>
        </div>

        {/* CARD 3 */}
        <div className="t-card">
          <div className="t-quote"></div>

          <div className="t-stars">⭐⭐⭐⭐⭐</div>

          <p className="t-text">
            "So proud to see a Bihar-based company creating world-class products!
            The quality is exceptional and knowing it supports local farmers makes it even better."
          </p>

          <div className="t-tag">PUMPKIN SEEDS</div>

          <hr className="t-divider" />

          <div className="t-footer">
            <div>
              <div className="t-name">Amit Patel</div>
              <div className="t-loc">Patna, Bihar</div>
            </div>
            <div className="t-date">October 2024</div>
          </div>
        </div>

      </div>


      {/* STATS SECTION */}
      <div className="t-stats">
        <div className="t-stat-block">
          <div className="t-stat-num">5,000+</div>
          <div className="t-stat-label">HAPPY CUSTOMERS</div>
        </div>

        <div className="t-stat-block">
          <div className="t-stat-num">4.9/5</div>
          <div className="t-stat-label">AVERAGE RATING</div>
        </div>

        <div className="t-stat-block">
          <div className="t-stat-num">8+</div>
          <div className="t-stat-label">PRODUCT RANGE</div>
        </div>

        <div className="t-stat-block">
          <div className="t-stat-num">3+</div>
          <div className="t-stat-label">COUNTRIES SERVED</div>
        </div>
      </div>

    </section>
    </>
  );
};

export default Mission;
