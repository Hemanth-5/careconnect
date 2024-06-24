import React from "react";
import { ResponsiveBar } from "@nivo/bar";
import { userData } from "../../../data/adminData";
import "./BarChart.css";

const BarChart = () => {
  const ageGroups = {
    "0-20": 0,
    "21-40": 0,
    "41-60": 0,
    "61+": 0,
  };

  userData.forEach((patient) => {
    if (patient.age <= 20) {
      ageGroups["0-20"]++;
    } else if (patient.age <= 40) {
      ageGroups["21-40"]++;
    } else if (patient.age <= 60) {
      ageGroups["41-60"]++;
    } else {
      ageGroups["61+"]++;
    }
  });

  // Convert age groups object into an array of objects
  const data = Object.keys(ageGroups).map((ageGroup) => ({
    ageGroup,
    count: ageGroups[ageGroup],
  }));

  return (
    <div className="age-distribution-chart">
      <div className="chart-content">
        <h1>Demographics</h1>
        <ResponsiveBar
          data={data}
          keys={["count"]}
          indexBy="ageGroup"
          margin={{ top: 50, right: 60, bottom: 70, left: 90 }}
          padding={0.3}
          colors={{ scheme: "category10" }}
          borderColor={{ from: "color", modifiers: [["darker", 1.6]] }}
          axisTop={null}
          axisRight={null}
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: "Age Group",
            legendPosition: "middle",
            legendOffset: 46,
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: "Count",
            legendPosition: "middle",
            legendOffset: -60,
          }}
          labelSkipWidth={12}
          labelSkipHeight={12}
          labelTextColor={{ from: "color", modifiers: [["darker", 1.6]] }}
          animate={true}
          motionStiffness={90}
          motionDamping={15}
        />
      </div>
    </div>
  );
};

export default BarChart;
