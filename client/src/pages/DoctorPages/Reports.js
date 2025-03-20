import React, { useState, useEffect } from "react";
import doctorAPI from "../../api/doctor";
import Button from "../../components/common/Button";
import Spinner from "../../components/common/Spinner";
import Modal from "../../components/common/Modal";
import "./Reports.css";

const Reports = () => {
  const [loading, setLoading] = useState(false);
  const [reports, setReports] = useState([]);
  const [error, setError] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [success, setSuccess] = useState(null);

  // Report generation form state
  const [formData, setFormData] = useState({
    reportType: "patient",
    patientId: "",
    dateRange: "month",
    customStartDate: "",
    customEndDate: "",
    includeAppointments: true,
    includePrescriptions: true,
    includeMedicalRecords: true,
  });

  // List of patients for select dropdown
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    // Try to fetch existing reports if the API supports it
    fetchReports();
    fetchPatients();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await doctorAPI.getReports();
      if (response && response.data) {
        setReports(response.data || []);
      }
      setError(null);
    } catch (err) {
      console.error("Error fetching reports:", err);
      // We don't show an error for this since the placeholder content will be displayed
    } finally {
      setLoading(false);
    }
  };

  const fetchPatients = async () => {
    try {
      const response = await doctorAPI.getMyPatients();
      if (response && response.data) {
        setPatients(response.data || []);
      }
    } catch (err) {
      console.error("Error fetching patients:", err);
    }
  };

  const handleGenerateReport = async () => {
    try {
      setIsGenerating(true);
      setError(null);

      // Prepare params based on form data
      const params = {
        ...formData,
      };

      // If custom date range is selected, include those dates
      if (formData.dateRange === "custom") {
        params.startDate = formData.customStartDate;
        params.endDate = formData.customEndDate;
      }

      const response = await doctorAPI.generateReport(
        formData.reportType,
        params
      );

      if (response && response.data) {
        // Handle successful report generation - this would typically be a URL or file to download
        if (response.data.url) {
          // Open the report URL in a new tab
          window.open(response.data.url, "_blank");
        }

        setSuccess("Report generated successfully!");

        // Add the new report to the list if reports are being tracked
        if (Array.isArray(reports)) {
          setReports([response.data, ...reports]);
        }

        // Close modal
        setShowGenerateModal(false);
      }
    } catch (err) {
      console.error("Error generating report:", err);
      setError("Failed to generate report. Please try again.");
    } finally {
      setIsGenerating(false);

      // Clear success message after 3 seconds
      if (success) {
        setTimeout(() => setSuccess(null), 3000);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const openGenerateModal = () => {
    setShowGenerateModal(true);
    // Reset the form
    setFormData({
      reportType: "patient",
      patientId: patients.length > 0 ? patients[0]._id : "",
      dateRange: "month",
      customStartDate: "",
      customEndDate: "",
      includeAppointments: true,
      includePrescriptions: true,
      includeMedicalRecords: true,
    });
  };

  // We're showing placeholder content for now as the feature is coming soon
  return (
    <div className="doctor-reports">
      <div className="reports-header">
        <h1 className="page-title">Medical Reports</h1>
        <Button variant="primary" onClick={openGenerateModal}>
          <i className="fas fa-plus"></i> Generate New Report
        </Button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {loading ? (
        <div className="loading-container">
          <Spinner center size="large" />
        </div>
      ) : (
        <div className="placeholder-content">
          <div className="placeholder-icon">
            <i className="fas fa-file-medical-alt"></i>
          </div>
          <h2>Medical Reports Feature Coming Soon</h2>
          <p>This feature will allow you to:</p>
          <ul>
            <li>Generate detailed patient medical reports</li>
            <li>Create lab and diagnostic test reports</li>
            <li>Export and share reports securely</li>
            <li>Track patient progress over time</li>
          </ul>
          <p>We're working hard to bring you this functionality soon!</p>
          <Button variant="primary" onClick={openGenerateModal}>
            Try Report Generation
          </Button>
        </div>
      )}

      {/* Generate Report Modal */}
      {showGenerateModal && (
        <Modal
          title="Generate Medical Report"
          onClose={() => setShowGenerateModal(false)}
        >
          <div className="generate-report-form">
            <div className="form-group">
              <label htmlFor="reportType">Report Type</label>
              <select
                id="reportType"
                name="reportType"
                value={formData.reportType}
                onChange={handleInputChange}
              >
                <option value="patient">Patient Summary</option>
                <option value="appointments">Appointments Report</option>
                <option value="prescriptions">Prescriptions Report</option>
                <option value="medical-records">Medical Records Report</option>
                <option value="analytics">Patient Analytics</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="patientId">Patient</label>
              <select
                id="patientId"
                name="patientId"
                value={formData.patientId}
                onChange={handleInputChange}
              >
                <option value="">All Patients</option>
                {patients.map((patient) => (
                  <option key={patient._id} value={patient._id}>
                    {patient.user?.fullname || "Unknown Patient"}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="dateRange">Date Range</label>
              <select
                id="dateRange"
                name="dateRange"
                value={formData.dateRange}
                onChange={handleInputChange}
              >
                <option value="week">Last Week</option>
                <option value="month">Last Month</option>
                <option value="quarter">Last 3 Months</option>
                <option value="year">Last Year</option>
                <option value="all">All Time</option>
                <option value="custom">Custom Range</option>
              </select>
            </div>

            {formData.dateRange === "custom" && (
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="customStartDate">Start Date</label>
                  <input
                    type="date"
                    id="customStartDate"
                    name="customStartDate"
                    value={formData.customStartDate}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="customEndDate">End Date</label>
                  <input
                    type="date"
                    id="customEndDate"
                    name="customEndDate"
                    value={formData.customEndDate}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            )}

            <div className="form-group checkbox-group">
              <label>Include Data</label>
              <div className="checkbox-options">
                <div className="checkbox-option">
                  <input
                    type="checkbox"
                    id="includeAppointments"
                    name="includeAppointments"
                    checked={formData.includeAppointments}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="includeAppointments">Appointments</label>
                </div>
                <div className="checkbox-option">
                  <input
                    type="checkbox"
                    id="includePrescriptions"
                    name="includePrescriptions"
                    checked={formData.includePrescriptions}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="includePrescriptions">Prescriptions</label>
                </div>
                <div className="checkbox-option">
                  <input
                    type="checkbox"
                    id="includeMedicalRecords"
                    name="includeMedicalRecords"
                    checked={formData.includeMedicalRecords}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="includeMedicalRecords">Medical Records</label>
                </div>
              </div>
            </div>

            <div className="form-actions">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setShowGenerateModal(false)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="primary"
                onClick={handleGenerateReport}
                loading={isGenerating}
                disabled={isGenerating}
              >
                Generate Report
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Reports;
