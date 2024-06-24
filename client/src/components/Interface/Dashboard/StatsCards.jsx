import React from "react";
import "./StatsCards.css";

function StatsCards({ cardTitle, cardValue, cardIcon, cardContents }) {
  return (
    <div className="cards">
      <div className="card-header">
        <i className={cardIcon}></i>
        <h1>{cardTitle}</h1>
      </div>
      <div className="card-content">
        <h2>{cardValue}</h2>
        {cardContents}
      </div>
    </div>
  );
}

export default StatsCards;
