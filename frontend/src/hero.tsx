// import "./styles/hero.css";
// import { useEffect, useState } from "react";

// import pic1 from "D:/React-App/frontend/src/assets/pic1.png";
// import pic2 from "D:/React-App/frontend/src/assets/pic2.png";
// import pic3 from "D:/React-App/frontend/src/assets/pic3.png";

// const images = [pic1, pic2, pic3];

// export default function Hero() {
//   const [currentIndex, setCurrentIndex] = useState(0);

//   // AUTO SLIDE every 3 seconds
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentIndex((prev) =>
//         prev === images.length - 1 ? 0 : prev + 1
//       );
//     }, 6000);

//     return () => clearInterval(interval);
//   }, []);

//   const goNext = () => {
//     setCurrentIndex((prev) =>
//       prev === images.length - 1 ? 0 : prev + 1
//     );
//   };

//   const goPrev = () => {
//     setCurrentIndex((prev) =>
//       prev === 0 ? images.length - 1 : prev - 1
//     );
//   };

//   return (
//     <div className="hero-container">
//       <div className="hero-content">
//         {/* LEFT SECTION */}
//         <div className="hero-left">
//           <div className="tag-box">NATURAL · FUNCTIONAL · INDIAN</div>

//           <h1 className="hero-title">
//             SCIENCE-BACKED <span>NATURAL FOODS</span>
//             <br />
//             FOR EVERYDAY WELLNESS
//           </h1>

//           <p className="hero-desc">
//             Rooted in India's timeless food wisdom and powered by modern nutritional science,
//             Brihati crafts clean-label functional foods to support diabetes management,
//             hormonal balance, heart health and daily immunity.
//           </p>

//           <div className="chip-container">
//             <div className="chip">Low-GI diabetic meals</div>
//             <div className="chip">Plant proteins & seed mixes</div>
//             <div className="chip">Temple-inspired fasting foods</div>
//             <div className="chip">Chemical & preservative-free</div>
//           </div>

//           <div className="info">
//             <div className="info1">
//               <h1>Farmer - linked sourcing</h1>
//               <p>Bihar and Jharkand based value chains</p>
//             </div>
//             <div className="info2">
//               <h1>Clean-label promise</h1>
//               <p>No refined sugar · No artificial colours</p>
//             </div>
//           </div>
//         </div>

//         {/* RIGHT SECTION – CAROUSEL */}
//         <div className="hero-right">
//           <img
//              key={currentIndex}
//             src={images[currentIndex]}
//             className="hero-image fade-slide"
//             alt="carousel"
//           />

//           <button className="arrow left" onClick={goPrev}>
//             ←
//           </button>
//           <button className="arrow right" onClick={goNext}>
//             →
//           </button>
//         </div>
//       </div>

//       {/* TRUST BAR */}
//       <div className="trusted-wrapper">
//         <div className="trusted-bar">
//           <div className="trusted-left">
//             <span className="dot"></span>
//             TRUSTED BY HEALTH-CONSCIOUS FAMILIES & GLOBAL PARTNERS
//           </div>

//           <div className="trusted-right">
//             <span>DPIIT recognised startup</span>
//             <span>Serving globally – India, Middle East & beyond</span>
//             <span>Startup Bihar ecosystem</span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


import "./styles/hero.css";
import { useEffect, useState } from "react";

import pic1 from "D:/React-App/frontend/src/assets/pic1.png";
import pic2 from "D:/React-App/frontend/src/assets/pic2.png";
import pic3 from "D:/React-App/frontend/src/assets/pic3.png";

const images = [
  {
    img: pic1,
    tag: "PURE & CLEAN",
    title: "CLEAN LABEL PROMISE",
    subtitle: "No preservatives, no artificial colors, 100% natural"
  },
  {
    img: pic2,
    tag: "FARM TO FORK",
    title: "FRESH PRODUCE",
    subtitle: "Sustainably sourced from Indian farmers"
  },
  {
    img: pic3,
    tag: "NUTRITION FIRST",
    title: "FUNCTIONAL FOODS",
    subtitle: "Science-backed daily wellness nutrition"
  }
];

export default function Hero() {
  const [currentIndex, setCurrentIndex] = useState(0);

  // AUTO SLIDE every 6 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) =>
        prev === images.length - 1 ? 0 : prev + 1
      );
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  const goNext = () => {
    setCurrentIndex((prev) =>
      prev === images.length - 1 ? 0 : prev + 1
    );
  };

  const goPrev = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  return (
    <div className="hero-container">
      <div className="hero-content">

        {/* LEFT SECTION */}
        <div className="hero-left">
          <div className="tag-box">NATURAL · FUNCTIONAL · INDIAN</div>

          <h1 className="hero-title">
            SCIENCE-BACKED <span>NATURAL FOODS</span>
            <br />
            FOR EVERYDAY WELLNESS
          </h1>

          <p className="hero-desc">
            Rooted in India's timeless food wisdom and powered by modern nutritional science,
            Brihati crafts clean-label functional foods to support diabetes management,
            hormonal balance, heart health and daily immunity.
          </p>

          <div className="chip-container">
            <div className="chip">Low-GI diabetic meals</div>
            <div className="chip">Plant proteins & seed mixes</div>
            <div className="chip">Temple-inspired fasting foods</div>
            <div className="chip">Chemical & preservative-free</div>
          </div>

          <div className="info">
            <div className="info1">
              <h1>Farmer - linked sourcing</h1>
              <p>Bihar and Jharkand based value chains</p>
            </div>
            <div className="info2">
              <h1>Clean-label promise</h1>
              <p>No refined sugar · No artificial colours</p>
            </div>
          </div>
        </div>

        {/* RIGHT SECTION – CAROUSEL WITH TEXT OVERLAY */}
        <div className="hero-right">

          <div className="hero-image-wrapper">
            <img
              key={currentIndex}
              src={images[currentIndex].img}
              className="hero-image fade-slide"
              alt="carousel"
            />

            {/* OVERLAY */}
            <div className="hero-overlay">
              <div className="overlay-tag">
                {images[currentIndex].tag}
              </div>

              <h1 className="overlay-title">
                {images[currentIndex].title}
              </h1>

              <p className="overlay-subtitle">
                {images[currentIndex].subtitle}
              </p>
            </div>
          </div>

          <button className="arrow left" onClick={goPrev}>←</button>
          <button className="arrow right" onClick={goNext}>→</button>

        </div>
      </div>

      {/* TRUST BAR */}
      <div className="trusted-wrapper">
        <div className="trusted-bar">
          <div className="trusted-left">
            <span className="dot"></span>
            TRUSTED BY HEALTH-CONSCIOUS FAMILIES & GLOBAL PARTNERS
          </div>

          <div className="trusted-right">
            <span>DPIIT recognised startup</span>
            <span>Serving globally – India, Middle East & beyond</span>
            <span>Startup Bihar ecosystem</span>
          </div>
        </div>
      </div>
    </div>
  );
}
