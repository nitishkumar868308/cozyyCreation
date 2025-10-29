"use client";
import React, { useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Section2 = () => {
  const [selectedProduct, setSelectedProduct] = useState("All Products");

  const products = ["All Products", "T-Shirts", "Hoodies", "Caps"];

  // Sample Data (product filter ke hisaab se change ho sakta hai)
  const data = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
    datasets: [
      {
        label: selectedProduct + " Sales",
        data: selectedProduct === "Hoodies"
          ? [50, 80, 40, 120, 100, 180, 150]
          : selectedProduct === "Caps"
          ? [30, 50, 25, 80, 60, 90, 100]
          : selectedProduct === "T-Shirts"
          ? [100, 200, 150, 300, 250, 400, 450]
          : [180, 320, 220, 500, 400, 600, 700],
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59,130,246,0.2)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: { font: { family: "functionPro", size: 14 } },
      },
      title: {
        display: true,
        text: "Monthly Sales Growth",
        font: { size: 20, family: "functionPro", weight: "bold" },
      },
    },
    scales: {
      y: { ticks: { font: { family: "functionPro", size: 12 } } },
      x: { ticks: { font: { family: "functionPro", size: 12 } } },
    },
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-3xl shadow-xl w-full font-functionPro mt-10 hover:shadow-2xl transition">
      {/* Header + Filter */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
        <h2 className="text-lg md:text-xl font-bold text-gray-700">
          Sales Overview
        </h2>

        <select
          value={selectedProduct}
          onChange={(e) => setSelectedProduct(e.target.value)}
          className="border border-gray-300 rounded-lg p-2 font-functionPro text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer"
        >
          {products.map((prod) => (
            <option key={prod} value={prod} className="cursor-pointer">
              {prod}
            </option>
          ))}
        </select>
      </div>

      {/* Chart */}
      <div className="h-64 md:h-80 lg:h-96 w-full p-4 bg-white rounded-2xl shadow">
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

export default Section2;
