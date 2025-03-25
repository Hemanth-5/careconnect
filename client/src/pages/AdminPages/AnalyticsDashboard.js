import React, { useState, useEffect } from "react";
import adminAPI from "../../api/admin";
import Button from "../../components/common/Button";
import Spinner from "../../components/common/Spinner";
import "./AnalyticsDashboard.css";

// If you have a charting library like Chart.js or Recharts, import it here
// import { Line, Bar, Pie } from 'recharts';

const AnalyticsDashboard = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [period, setPeriod] = useState("month"); // Default to month view
  const [customDateRange, setCustomDateRange] = useState({
    startDate: "",
    endDate: "",
  });
  const [useDateRange, setUseDateRange] = useState(false);

  useEffect(() => {
    fetchAnalyticsData();
  }, [period]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);

      let queryParams = {};

      if (
        useDateRange &&
        customDateRange.startDate &&
        customDateRange.endDate
      ) {
        queryParams = {
          startDate: customDateRange.startDate,
          endDate: customDateRange.endDate,
        };
      } else {
        queryParams = { period };
      }

      const response = await adminAPI.getAppointmentAnalytics(queryParams);
      setAnalyticsData(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching analytics data:", err);
      setError("Failed to load analytics data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handlePeriodChange = (e) => {
    setPeriod(e.target.value);
    setUseDateRange(false);
  };

  const handleDateRangeChange = (e) => {
    const { name, value } = e.target;
    setCustomDateRange((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const applyCustomDateRange = () => {
    if (customDateRange.startDate && customDateRange.endDate) {
      setUseDateRange(true);
      fetchAnalyticsData();
    }
  };

  // Format number with commas
  const formatNumber = (num) => {
    return num?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") || "0";
  };

  // Format status name
  const formatStatus = (status) => {
    if (!status) return "Unknown";
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "#28a745";
      case "confirmed":
        return "#007bff";
      case "scheduled":
        return "#17a2b8";
      case "pending":
        return "#ffc107";
      case "cancelled":
        return "#dc3545";
      case "no-show":
        return "#6c757d";
      default:
        return "#6c757d";
    }
  };

  return (
    <div className="analytics-dashboard">
      <div className="page-header">
        <h1 className="page-title">Analytics Dashboard</h1>
        <Button
          variant="secondary"
          onClick={fetchAnalyticsData}
          disabled={loading}
          className="refresh-button"
        >
          <i className="fas fa-sync-alt"></i> Refresh
        </Button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="time-range-selector">
        <div className="period-selector">
          <label htmlFor="period-select">Time Period:</label>
          <select
            id="period-select"
            value={period}
            onChange={handlePeriodChange}
            disabled={useDateRange || loading}
          >
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>
            <option value="year">Last 12 Months</option>
          </select>
        </div>

        <div className="custom-date-range">
          <div className="date-inputs">
            <div className="date-input-group">
              <label htmlFor="startDate">Start Date:</label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={customDateRange.startDate}
                onChange={handleDateRangeChange}
                disabled={loading}
              />
            </div>
            <div className="date-input-group">
              <label htmlFor="endDate">End Date:</label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={customDateRange.endDate}
                onChange={handleDateRangeChange}
                disabled={loading}
              />
            </div>
          </div>
          <Button
            variant="outline-primary"
            onClick={applyCustomDateRange}
            disabled={
              !customDateRange.startDate || !customDateRange.endDate || loading
            }
          >
            Apply Date Range
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="loading-container">
          <Spinner center size="large" />
        </div>
      ) : (
        <div className="analytics-container">
          {analyticsData ? (
            <>
              <div className="stats-cards">
                <div className="stat-card">
                  <div className="stat-icon">
                    <i className="fas fa-calendar-check"></i>
                  </div>
                  <div className="stat-content">
                    <h3 className="stat-title">Total Appointments</h3>
                    <p className="stat-value">
                      {formatNumber(analyticsData.totalAppointments)}
                    </p>
                    <p className="stat-period">
                      {useDateRange
                        ? `${new Date(
                            customDateRange.startDate
                          ).toLocaleDateString()} - ${new Date(
                            customDateRange.endDate
                          ).toLocaleDateString()}`
                        : period === "week"
                        ? "Last 7 days"
                        : period === "month"
                        ? "Last 30 days"
                        : "Last 12 months"}
                    </p>
                  </div>
                </div>

                {/* Add more stat cards as needed */}
              </div>

              {/* Appointments by Status */}
              <div className="chart-container">
                <h3 className="chart-title">Appointments by Status</h3>
                <div className="status-distribution">
                  {analyticsData.appointmentsByStatus.map((status) => (
                    <div key={status._id} className="status-bar">
                      <div className="status-label">
                        <span
                          className="status-badge"
                          style={{
                            backgroundColor: getStatusColor(status._id),
                          }}
                        >
                          {formatStatus(status._id)}
                        </span>
                      </div>
                      <div className="bar-container">
                        <div
                          className="bar"
                          style={{
                            width: `${
                              (status.count / analyticsData.totalAppointments) *
                              100
                            }%`,
                            backgroundColor: getStatusColor(status._id),
                          }}
                        ></div>
                        <span className="bar-value">{status.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Doctors */}
              <div className="chart-container">
                <h3 className="chart-title">Top Doctors</h3>
                {analyticsData.topDoctors.length > 0 ? (
                  <div className="doctors-ranking">
                    {analyticsData.topDoctors.map((doctor, index) => (
                      <div key={doctor._id} className="doctor-rank-item">
                        <div className="rank-number">{index + 1}</div>
                        <div className="doctor-info">
                          <span className="doctor-name">
                            {doctor.doctorName || doctor.username || "Unknown"}
                          </span>
                        </div>
                        <div className="appointment-count">
                          <span className="count-badge">{doctor.count}</span>
                          <span className="count-label">appointments</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="no-data">No data available</p>
                )}
              </div>

              {/* Appointments by Day */}
              <div className="chart-container">
                <h3 className="chart-title">Appointments Timeline</h3>
                {analyticsData.appointmentsByDay.length > 0 ? (
                  <div className="timeline-chart">
                    {/* Normally we would use a chart component here, but we'll use a simple representation */}
                    <div className="days-container">
                      {analyticsData.appointmentsByDay.map((day) => (
                        <div key={day._id} className="day-column">
                          <div
                            className="day-bar"
                            style={{
                              height: `${
                                (day.count /
                                  Math.max(
                                    ...analyticsData.appointmentsByDay.map(
                                      (d) => d.count
                                    )
                                  )) *
                                100
                              }%`,
                            }}
                          >
                            <span className="day-count">{day.count}</span>
                          </div>
                          <span className="day-label">
                            {new Date(day._id).toLocaleDateString(undefined, {
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="no-data">No data available</p>
                )}
              </div>
            </>
          ) : (
            <div className="no-data-message">
              <p>
                No analytics data available. Try adjusting your filters or
                refreshing the page.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AnalyticsDashboard;
