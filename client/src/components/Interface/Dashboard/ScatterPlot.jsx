import React from "react";
import { ResponsiveScatterPlot } from "@nivo/scatterplot";
import { userData } from "../../../data/adminData";

const ScatterPlot = () => {
  // Ensure userData is not empty and contains the necessary fields
  if (!userData || userData.length === 0) {
    return <div>No data available</div>;
  }

  return (
    <div style={{ height: "400px" }}>
      <ResponsiveScatterPlot
        data={userData}
        margin={{ top: 50, right: 60, bottom: 70, left: 90 }}
        xScale={{ type: "linear", min: 0, max: "auto" }}
        xFormat={(value) => `${value} yrs`}
        yScale={{ type: "point", min: 0, max: "auto" }}
        colors={{ scheme: "category10" }}
        blendMode="normal"
        axisTop={null}
        axisRight={null}
        axisBottom={{
          orient: "bottom",
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: "Age",
          legendPosition: "middle",
          legendOffset: 46,
        }}
        axisLeft={{
          orient: "left",
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: "Condition",
          legendPosition: "middle",
          legendOffset: -60,
        }}
        legends={[
          {
            anchor: "bottom-right",
            direction: "column",
            justify: false,
            translateX: 130,
            translateY: 0,
            itemsSpacing: 12,
            itemDirection: "left-to-right",
            itemWidth: 100,
            itemHeight: 12,
            itemOpacity: 0.75,
            symbolSize: 12,
            symbolShape: "circle",
            symbolBorderColor: "rgba(0, 0, 0, .5)",
            effects: [
              {
                on: "hover",
                style: {
                  itemBackground: "rgba(0, 0, 0, .03)",
                  itemOpacity: 1,
                },
              },
            ],
          },
        ]}
        animate={true}
        motionStiffness={90}
        motionDamping={15}
        tooltip={({ node }) => (
          <div
            style={{
              padding: "10px",
              border: "1px solid #ccc",
              background: "#fff",
            }}
          >
            <strong>{node.data.name}</strong>
            <br />
            Age: {node.data.age}
            <br />
            Gender: {node.data.gender}
            <br />
            Disease: {node.data.disease}
            <br />
            Condition: {node.data.condition}
          </div>
        )}
      />
    </div>
  );
};

export default ScatterPlot;
