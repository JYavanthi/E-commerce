// import React, { useState } from "react";
// import { Line, Pie } from "react-chartjs-2";
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   ArcElement,
//   Tooltip,
//   Legend,
// } from "chart.js";

// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   ArcElement,
//   Tooltip,
//   Legend
// );

// type RangeType = 7 | 30 | 90;

// const Charts = () => {
//   const [range, setRange] = useState<RangeType>(7);

//   const generateData = (days: number) => {
//     const labels: string[] = [];
//     const data: number[] = [];

//     for (let i = days - 1; i >= 0; i--) {
//       const d = new Date();
//       d.setDate(d.getDate() - i);

//       labels.push(
//         d.toLocaleDateString("en-IN", { day: "2-digit", month: "short" })
//       );

//       data.push(Math.floor(1500 + Math.random() * 4500));
//     }

//     return { labels, data };
//   };

//   const { labels, data } = generateData(range);

//   const salesData = {
//     labels,
//     datasets: [
//       {
//         label: "Sales",
//         data,
//         fill: true,
//         borderColor: "#3aaa35",
//         backgroundColor: "rgba(58,170,53,0.18)",
//         tension: 0.45,
//         pointRadius: 4,
//         pointBackgroundColor: "#3aaa35",
//       },
//     ],
//   };

//   const pieData = {
//     labels: ["Honey", "Green Tea", "Protein Powder", "Flaxseed"],
//     datasets: [
//       {
//         data: [35, 25, 20, 20],
//         backgroundColor: ["#3aaa35", "#9cdb7b", "#ffe28a", "#ffb3b3"],
//         borderWidth: 0,
//       },
//     ],
//   };

//   return (
//     <div className="ad-charts">

//       {/* GRAPH */}
//       <div className="chart-card chart-large">
//         <div className="chart-header">
//           <h3>Sales Report</h3>

//           <div className="chart-filters">
//             <button className={range === 7 ? "active" : ""} onClick={() => setRange(7)}>7 Days</button>
//             <button className={range === 30 ? "active" : ""} onClick={() => setRange(30)}>30 Days</button>
//             <button className={range === 90 ? "active" : ""} onClick={() => setRange(90)}>90 Days</button>
//           </div>
//         </div>

//         <div className="chart-body">
//           <Line data={salesData} options={{ responsive: true, maintainAspectRatio: false }} />
//         </div>
//       </div>

//       {/* PIE */}
//       <div className="chart-card chart-small">
//         <div className="chart-header">
//           <h3>Top Selling Products</h3>
//         </div>

//         <div className="chart-body pie-body">
//           <Pie data={pieData} options={{ responsive: true, maintainAspectRatio: false }} />
//         </div>
//       </div>

//     </div>
//   );
// };

// export default Charts;



import React, { useState } from "react";
import { Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend
);

type RangeType = 7 | 30 | 90;

const Charts = () => {
  const [range, setRange] = useState<RangeType>(7);

  const generateData = (days: number) => {
    const labels: string[] = [];
    const data: number[] = [];

    for (let i = days - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);

      labels.push(
        d.toLocaleDateString("en-IN", { day: "2-digit", month: "short" })
      );

      data.push(Math.floor(2500 + Math.random() * 3500));
    }

    return { labels, data };
  };

  const { labels, data } = generateData(range);

  const salesData = {
    labels,
    datasets: [
      {
        label: "Sales",
        data,
        fill: true,
        borderColor: "#3aaa35",
        backgroundColor: "rgba(58,170,53,0.15)",
        tension: 0.45,
        pointRadius: 4,
        pointBackgroundColor: "#3aaa35",
      },
    ],
  };

  const pieData = {
    labels: ["Honey", "Green Tea", "Protein Powder", "Flaxseed"],
    datasets: [
      {
        data: [35, 25, 20, 20],
        backgroundColor: ["#3aaa35", "#9cdb7b", "#ffe28a", "#ffb3b3"],
        borderWidth: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
    },
  };

  return (
    <div className="ad-charts">

      {/* SALES GRAPH */}
      <div className="chart-card">
        <div className="chart-header">
          <h3>Sales Report</h3>
          <div className="chart-filters">
            <button className={range === 7 ? "active" : ""} onClick={() => setRange(7)}>7 Days</button>
            <button className={range === 30 ? "active" : ""} onClick={() => setRange(30)}>30 Days</button>
            <button className={range === 90 ? "active" : ""} onClick={() => setRange(90)}>90 Days</button>
          </div>
        </div>

        <div className="chart-body">
          <Line data={salesData} options={options} />
        </div>
      </div>

      {/* PIE CHART */}
      <div className="chart-card">
        <div className="chart-header">
          <h3>Top Selling Products</h3>
        </div>

        <div className="chart-body pie-body">
          <Pie data={pieData} options={options} />
        </div>
      </div>

    </div>
  );
};

export default Charts;
