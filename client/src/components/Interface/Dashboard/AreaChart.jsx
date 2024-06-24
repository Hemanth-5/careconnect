import React from "react";
import "./AreaChart.css";
import { ResponsiveAreaBump } from "@nivo/bump";
import { userData } from "../../../data/adminData";

const AreaChart = () => {
  const data = [
    {
      id: "Revenue",
      data: userData.map((patient) => ({
        x: patient.quarter,
        y: patient.revenue,
      })),
    },
    {
      id: "Expenses",
      data: userData.map((patient) => ({
        x: patient.quarter,
        y: patient.expenses,
      })),
    },
  ];
  const yTicks = Array.from({ length: userData.length }, (_, index) => index);

  return (
    <div className="financial-distribution-chart">
      <div className="chart-content">
        <h1>Financial Analysis</h1>
        <ResponsiveAreaBump
          data={data}
          margin={{ top: 50, right: 60, bottom: 70, left: 90 }}
          spacing={8}
          colors={{ scheme: "category10" }}
          blendMode="normal"
          axisTop={null}
          axisRight={null}
          axisBottom={{
            enable: false,
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: "Quarter",
            legendPosition: "middle",
            legendOffset: 46,
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: "Amount",
            legendPosition: "middle",
            legendOffset: -60,
            tickValues: yTicks, // Dynamically set y-axis tick values
          }}
          animate={true}
          motionStiffness={90}
          motionDamping={15}
        />
      </div>
    </div>
  );
};

export default AreaChart;
