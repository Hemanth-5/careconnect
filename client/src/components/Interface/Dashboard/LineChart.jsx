import React from "react";
import "./LineChart.css";
import { ResponsiveLine } from "@nivo/line";
import {
  patientTransactions,
  doctorTransactions,
} from "../../../data/adminData";

const LineChart = () => {
  const data = [
    {
      id: "patient",
      data: patientTransactions.map((transaction) => ({
        x: transaction.date,
        y: transaction.amount,
      })),
    },
    {
      id: "doctor",
      data: doctorTransactions.map((transaction) => ({
        x: transaction.date,
        y: transaction.amount,
      })),
    },
  ];

  return (
    <div className="transaction-chart">
      <div className="chart-content">
        <h1>Transactions</h1>
        <ResponsiveLine
          data={data}
          margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
          xScale={{ type: "point" }}
          yScale={{
            type: "linear",
            min: "auto",
            max: "auto",
            stacked: true,
            reverse: false,
          }}
          yFormat=" >-.2f"
          axisTop={null}
          axisRight={null}
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: "Date",
            legendOffset: 36,
            legendPosition: "middle",
            truncateTickAt: 0,
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: "Amount",
            legendOffset: -40,
            legendPosition: "middle",
            truncateTickAt: 0,
          }}
          pointSize={10}
          pointColor={{ theme: "background" }}
          pointBorderWidth={2}
          pointBorderColor={{ from: "serieColor" }}
          pointLabelYOffset={-12}
          enableSlices="x"
          useMesh={true}
          legends={[
            {
              anchor: "bottom-right",
              direction: "column",
              justify: false,
              translateX: 100,
              translateY: 0,
              itemsSpacing: 0,
              itemDirection: "left-to-right",
              itemWidth: 80,
              itemHeight: 20,
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
          tooltip={({ slice }) => {
            return (
              <div
                style={{
                  background: "white",
                  padding: "9px 12px",
                  border: "1px solid #ccc",
                }}
              >
                <div>Date: {slice.points[0].data.xFormatted}</div>
                <div>Description: {slice.points[0].data.description}</div>
                <div>Amount: {slice.points[0].data.yFormatted}</div>
                <div>Category: {slice.points[0].data.category}</div>
                <div>Patient: {slice.points[0].data.patient}</div>
                <div>Doctor: {slice.points[0].data.doctor}</div>
              </div>
            );
          }}
        />
      </div>
    </div>
  );
};

export default LineChart;
