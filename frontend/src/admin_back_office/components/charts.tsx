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

  /* ============================
     MOCK SALES DATA (API READY)
     Later replace with API data
  ============================ */
  
  const generateData = (days: number) => {
    const labels: string[] = [];
    const data: number[] = [];

    for (let i = days - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);

      labels.push(
        d.toLocaleDateString("en-IN", { day: "2-digit", month: "short" })
      );

      // demo random sales
      data.push(Math.floor(800 + Math.random() * 5000));
    }

    return { labels, data };
  };

  const { labels, data } = generateData(range);

  /* 📈 Sales Graph */
  const salesData = {
    labels,
    datasets: [
      {
        label: `Sales (Last ${range} Days)`,
        data,
        fill: true,
        borderColor: "#3aaa35",
        backgroundColor: "rgba(58,170,53,0.15)",
        tension: 0.4,
        pointRadius: 3,
      },
    ],
  };

  /* 🥧 Pie Chart */
  const pieData = {
    labels: ["Honey", "Green Tea", "Protein Powder", "Flaxseed"],
    datasets: [
      {
        data: [35, 25, 20, 20],
        backgroundColor: ["#3aaa35", "#9cdb7b", "#ffe28a", "#ffb3b3"],
      },
    ],
  };

  return (
    <div className="ad-charts">

      {/* Sales Graph */}
      <div className="ad-card ad-graph">
        <div className="ad-graph-header">
          <h3>Sales Report</h3>

          {/* FILTER BUTTONS */}
          <div className="ad-filters">
            <button 
              className={range === 7 ? "active" : ""}
              onClick={() => setRange(7)}
            >7 Days</button>
              
            <button 
              className={range === 30 ? "active" : ""}
              onClick={() => setRange(30)}
            >30 Days</button>

            <button 
              className={range === 90 ? "active" : ""}
              onClick={() => setRange(90)}
            >90 Days</button>
          </div>
        </div>

        <Line data={salesData} />
      </div>

      {/* Pie Chart */}
      <div className="ad-card ad-pie">
        <h3>Top Selling Products</h3>
        <Pie data={pieData} />
      </div>

    </div>
  );
};

export default Charts;