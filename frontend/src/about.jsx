import "../src/styles/about.css"
import abt from "D:/React-App/frontend/src/assets/abt1.png"
export default function AboutPage() {
  return (
    <>
   <div className="about-wrapper">

      {/* TOP HEADING */}
      <p className="story-sub">OUR STORY</p>
      <h1 className="story-title">FROM BIHAR'S HEARTLAND TO GLOBAL KITCHENS</h1>

      {/* TWO COLUMN LAYOUT */}
      <div className="two-col">

        {/* LEFT COLUMN */}
        <div className="left-col">
            <div className="story-full-img">
                <img src={abt}alt="Brihati story" />
            </div>
            

            <div className="left-about-box">
            <h2 className="about-title">ABOUT BRIHATI</h2>

            <p className="about-text">
              Brihati is a Bihar-based food innovation company dedicated to crafting 
              science-backed, clean-label functional foods that honour India's rich food 
              traditions while meeting the needs of modern wellness.
            </p>

            <p className="about-text">
             We believe that food is medicine, and every ingredient we source is chosen for its functional
              benefits — from low-glycemic diabetic meals to nutrient-dense seed mixes, plant proteins
             and temple-inspired fasting foods. Our products are free from refined sugars, artificial colours and preservatives.
            </p>

            <p className="about-text">
                As a DPIIT-recognised startup, we work directly with farmers in Bihar and Jharkhand, building sustainable value 
                chains that support rural livelihoods while delivering premium nutrition to health-conscious families worldwide.
            </p>

        <div className="btm-font">
            <div className="btm-font1">
                     <p className="b">Founded :</p>
                    <p > 2020</p>
            </div>

            <div className="btm-font2">
                     <p className="b">Based in :   </p>
                    <p > Bihar,India</p>
            </div>
            <div className="btm-font3">
                     <p className="b">Markets :   </p>
                    <p >India,MiddleEast</p>
            </div>
        </div>
            
          </div>

        </div>

        {/* RIGHT COLUMN */}
        <div className="right-col">

          <div className="journey-card">

            {/* Card heading */}
            <div className="journey-head">
              <div className="journey-icon">
                <i className="fa-solid fa-arrow-trend-up"></i>
              </div>

              <div>
                <p className="journey-sub">OUR JOURNEY</p>
                <h2 className="journey-title">Building a healthier future</h2>
              </div>
            </div>

            <p className="journey-desc">
              What started as a mission to address diabetes through functional foods has
              grown into a movement to transform everyday nutrition with clean, Indian ingredients.
            </p>

            {/* TIMELINE */}
            <div className="timeline">

              <div className="timeline-item">
                <div className="time-badge">2020</div>
                <div className="time-content">
                  <h4>Foundation</h4>
                  <p>Brihati founded in Bihar with a focus on diabetic-friendly foods</p>
                </div>
              </div>

              <div className="timeline-item">
                <div className="time-badge">2021</div>
                <div className="time-content">
                  <h4>DPIIT Recognition</h4>
                  <p>Officially recognised as a DPIIT startup</p>
                </div>
              </div>

              <div className="timeline-item">
                <div className="time-badge">2023</div>
                <div className="time-content">
                  <h4>Global Expansion</h4>
                  <p>Expanded to Middle East markets</p>
                </div>
              </div>

              <div className="timeline-item">
                <div className="time-badge gold">2024</div>
                <div className="time-content">
                  <h4>Growth & Innovation</h4>
                  <p>Launched 8+ product lines, serving 5,000+ customers</p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
     <div className="about-cards">

        {/* Card 1 */}
        <div className="about-card">
          <div className="icon-circle">
            <i className="fa-solid fa-calendar"></i>
          </div>
          <h3 className="card-title">4+</h3>
          <p className="card-desc">
            YEARS OF EXCELLENCE
          </p>
        </div>

        {/* Card 2 */}
        <div className="about-card">
          <div className="icon-circle">
            <i className="fa-solid fa-location-dot"></i>
          </div>
          <h3 className="card-title">3+</h3>
          <p className="card-desc">
            COUNTRIES
          </p>
        </div>

        {/* Card 3 */}
        <div className="about-card">
          <div className="icon-circle">
            <i className="fa-solid fa-users"></i>

          </div>
          <h3 className="card-title">500+</h3>
          <p className="card-desc">
            FARMER PARTNERS
          </p>
        </div>
        <div className="about-card">
          <div className="icon-circle">
            <i className="fa-solid fa-arrow-trend-up"></i>
          </div>
          <h3 className="card-title">5K</h3>
          <p className="card-desc">
            HAPPY CUSTOMERS
            </p>
        </div>

        

      </div>
    </>
  );
}

