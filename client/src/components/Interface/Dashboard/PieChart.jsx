import React from "react";
import "./PieChart.css";
import { ResponsivePie } from "@nivo/pie";
import { userData } from "../../../data/adminData";

const PieChart = () => {
  // Combine the original patient data and the additional patient data

  // Create an object to store the count of each disease
  const diseaseCount = userData.reduce((acc, patient) => {
    acc[patient.disease] = (acc[patient.disease] || 0) + 1;
    return acc;
  }, {});

  // Convert the disease count object into an array of objects for Nivo
  const data = Object.entries(diseaseCount).map(([disease, count]) => ({
    id: disease,
    label: disease,
    value: count,
  }));

  return (
    <div className="analysis-chart">
      <div className="chart-content">
        <h1>Analysis of Patients</h1>
        <ResponsivePie
          data={data}
          margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
          innerRadius={0.5}
          padAngle={0.7}
          cornerRadius={3}
          colors={{ scheme: "set3" }}
          borderWidth={1}
          borderColor={{ from: "color", modifiers: [["darker", 0.2]] }}
          radialLabelsSkipAngle={10}
          radialLabelsTextXOffset={6}
          radialLabelsTextColor="#333333"
          radialLabelsLinkOffset={0}
          radialLabelsLinkDiagonalLength={16}
          radialLabelsLinkHorizontalLength={24}
          radialLabelsLinkStrokeWidth={1}
          radialLabelsLinkColor={{ from: "color" }}
          slicesLabelsSkipAngle={10}
          slicesLabelsTextColor="#333333"
          animate={true}
          motionStiffness={90}
          motionDamping={15}
        />
      </div>
    </div>
  );
};

export default PieChart;
