// FileStatsChart.js
import React from "react";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  BarElement,
  CategoryScale,
  ArcElement,
  LinearScale,
  Tooltip,
  Legend
);

export const FileStatsChart = ({ fileData }) => {
  const stats = {};

  fileData.forEach((file) => {
    if (file.date) {
      const dateObj = new Date(file.date);
      const key = `${dateObj.getFullYear()}-${String(
        dateObj.getMonth() + 1
      ).padStart(2, "0")}-${String(dateObj.getDate()).padStart(2, "0")}`;

      if (!stats[key]) {
        stats[key] = { available: 0, missing: 0 };
      }

      if (file.available === true) {
        stats[key].available += 1;
      } else if (file.available === false && file.filename == null) {
        stats[key].missing += 1;
      }
    }
  });

  const labels = Object.keys(stats).sort();
  const availableData = labels.map((key) => stats[key].available);
  const missingData = labels.map((key) => stats[key].missing);

  const availableColors = labels.map(() =>
    `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(
      Math.random() * 255
    )}, 200, 0.7)`
  );

  const missingColors = labels.map(() =>
    `rgba(255, ${Math.floor(Math.random() * 100)}, ${Math.floor(
      Math.random() * 100
    )}, 0.7)`
  );

  const data = {
    labels,
    datasets: [
      {
        label: "Available Files",
        data: availableData,
        backgroundColor: availableColors,
        stack: "stack1",
      },
      {
        label: "Missing Files",
        data: missingData,
        backgroundColor: missingColors,
        stack: "stack1",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "File Availability per Day" },
    },
    scales: {
      x: { stacked: true },
      y: { stacked: true },
    },
  };

  return (
    <div>
      <Bar data={data} options={options} />
    </div>
  );
};

export const FilePieChart = ({ fileCount }) => {
  const data = {
    labels: ["Available", "Missing"],
    datasets: [
      {
        label: "Files",
        data: [fileCount.totalAvailable, fileCount.totalMissing],
        backgroundColor: [
          "rgba(75, 192, 192, 0.7)", 
          "rgba(255, 99, 132, 0.7)", 
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div style={{ maxWidth: "400px", marginTop: "20px" }}>
      <h5>Available vs Missing Files</h5>
      <Pie data={data} />
    </div>
  );
};



// // FileStatsChart.js
// import React from "react";
// import { Bar, Pie } from "react-chartjs-2";
// import {
//   Chart as ChartJS,
//   BarElement,
//   ArcElement,
//   CategoryScale,
//   LinearScale,
//   Tooltip,
//   Legend,
// } from "chart.js";

// ChartJS.register(
//   BarElement,
//   CategoryScale,
//   ArcElement,
//   LinearScale,
//   Tooltip,
//   Legend
// );

// const availableColors = labels.map(() =>
//   `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 200, 0.7)`
// );
// const missingColors = labels.map(() =>
//   `rgba(255, ${Math.floor(Math.random() * 100)}, ${Math.floor(Math.random() * 100)}, 0.7)`
// );


// export const FileStatsChart = ({ fileData }) => {
//   const stats = {};

//   fileData.forEach((file) => {
//     if (file.date) {
//       const dateObj = new Date(file.date);
//       const key = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, "0")}-${String(dateObj.getDate()).padStart(2, "0")}`;

//       if (!stats[key]) {
//         stats[key] = { available: 0, missing: 0 };
//       }

//       if (file.available === true) {
//         stats[key].available += 1;
//       } else if (file.available === false && file.filename == null) {
//         stats[key].missing += 1;
//       }
//     }
//   });

//   const labels = Object.keys(stats).sort();
//   const availableData = labels.map((key) => stats[key].available);
//   const missingData = labels.map((key) => stats[key].missing);

//   const data = {
//     labels,
//     datasets: [
//       {
//         label: "Available Files",
//         data: availableData,
//         backgroundColor: availableColors,
//         stack: "stack1",
//       },
//       {
//         label: "Missing Files",
//         data: missingData,
//         backgroundColor: missingColors,
//         stack: "stack1",
//       },
//     ],
//   };

//   const options = {
//     responsive: true,
//     plugins: {
//       legend: { position: "top" },
//       title: { display: true, text: "File Availability per Day" }, // <-- updated
//     },
//     scales: {
//       x: { stacked: true },
//       y: { stacked: true },
//     },
//   };

//   return (
//     <div>
//       <Bar data={data} options={options} />
//     </div>
//   );
// };


// export const FileStatsChart = ({ fileData }) => {
//   const stats = {};

//   fileData.forEach((file) => {
//     console.log(file);
//     if (file.date) {
//       const dateObj = new Date(file.date);
//       const key = `${dateObj.getFullYear()}-${String(
//         dateObj.getMonth() + 1
//       ).padStart(2, "0")}`;

//       if (!stats[key]) {
//         stats[key] = { available: 0, missing: 0 };
//       }

//       if (file.available) {
//         stats[key].available += 1;
//       } else if (file.available === false && file.filename == null) {
//         stats[key].missing += 1;
//       }
//     }
//   });

//   const labels = Object.keys(stats).sort();
//   const availableData = labels.map((key) => stats[key].available);
//   const missingData = labels.map((key) => stats[key].missing);

//   const data = {
//     labels,
//     datasets: [
//       {
//         label: "Available Files",
//         data: availableData,
//         backgroundColor: "rgba(75, 192, 192, 0.7)",
//         stack: "stack1",
//       },
//       {
//         label: "Missing Files",
//         data: missingData,
//         backgroundColor: "rgba(255, 99, 132, 0.7)",
//         stack: "stack1",
//       },
//     ],
//   };

//   const options = {
//     responsive: true,
//     plugins: {
//       legend: { position: "top" },
//       title: { display: true, text: "File Availability per Month" },
//     },
//     scales: {
//       x: { stacked: true },
//       y: { stacked: true },
//     },
//   };

//   return (
//     <div>
//       <Bar data={data} options={options} />
//     </div>
//   );
// };

// export default FileStatsChart;



// // FileStatsChart.js
// import React from "react";
// import { Bar } from "react-chartjs-2";
// import {
//   Chart as ChartJS,
//   BarElement,
//   CategoryScale,
//   LinearScale,
//   Tooltip,
//   Legend,
// } from "chart.js";

// ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

// const FileStatsChart = ({ fileData }) => {
//   // Group files by year/month and count available ones
//   const stats = {};

//   fileData.forEach((file) => {
//     if (file.available && file.date) {
//       const dateObj = new Date(file.date);
//       const key = `${dateObj.getFullYear()}-${String(
//         dateObj.getMonth() + 1
//       ).padStart(2, "0")}`;
//       stats[key] = (stats[key] || 0) + 1;
//     }
//   });

//   const labels = Object.keys(stats).sort(); // sorted year-month keys
//   const dataCounts = labels.map((key) => stats[key]);

//   const data = {
//     labels,
//     datasets: [
//       {
//         label: "Available Files per Month",
//         data: dataCounts,
//         backgroundColor: "rgba(75,192,192,0.6)",
//       },
//     ],
//   };

//   return (
//     <div>
//       <h5>Monthly File Availability</h5>
//       <Bar data={data} />
//     </div>
//   );
// };

// export default FileStatsChart;
