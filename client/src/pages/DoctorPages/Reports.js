import React, { useState, useEffect } from "react";
import doctorAPI from "../../api/doctor";
import Button from "../../components/common/Button";
import Spinner from "../../components/common/Spinner";
import Modal from "../../components/common/Modal";
import Popup from "../../components/common/Popup";
import "./Reports.css";

const Reports = () => {
  const [loading, setLoading] = useState(false);
  const [reports, setReports] = useState([]);
  const [error, setError] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [showReportDetailsModal, setShowReportDetailsModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [dateSort, setDateSort] = useState("desc");

  // Popup notification state
  const [popup, setPopup] = useState({
    show: false,
    message: "",
    title: "",
    type: "info",
  });

  // Show popup helper
  const showPopup = (type, message, title = "") => {
    setPopup({
      show: true,
      type,
      message,
      title,
    });
  };

  // Hide popup method
  const hidePopup = () => {
    setPopup((prev) => ({ ...prev, show: false }));
  };

  // Report generation form state - aligned with MedicalReport model
  const [formData, setFormData] = useState({
    associatedPatient: "",
    reportType: "patient-summary",
    comments: "",
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
    fetchReports();
    fetchPatients();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await doctorAPI.getReports();
      console.log(response.data);
      if (response && response.data) {
        setReports(response.data || []);
      }
    } catch (err) {
      console.error("Error fetching reports:", err);
      showPopup("error", "Failed to load reports. Please try again.");
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
      showPopup("error", "Failed to load patient list.");
    }
  };

  const handleGenerateReport = async (e) => {
    e.preventDefault();

    // Validate date range if custom
    if (formData.dateRange === "custom") {
      if (!formData.customStartDate || !formData.customEndDate) {
        showPopup(
          "error",
          "Please specify both start and end dates for custom range."
        );
        return;
      }

      const startDate = new Date(formData.customStartDate);
      const endDate = new Date(formData.customEndDate);

      if (startDate > endDate) {
        showPopup("error", "Start date cannot be after end date.");
        return;
      }
    }

    try {
      setIsGenerating(true);

      // Format data according to MedicalReport service
      const reportData = {
        associatedPatient: formData.associatedPatient,
        reportType: formData.reportType,
        comments: formData.comments,
        // Additional metadata as JSON for the report generation
        metadata: {
          dateRange: formData.dateRange,
          startDate:
            formData.dateRange === "custom"
              ? formData.customStartDate
              : undefined,
          endDate:
            formData.dateRange === "custom"
              ? formData.customEndDate
              : undefined,
          includeAppointments: formData.includeAppointments,
          includePrescriptions: formData.includePrescriptions,
          includeMedicalRecords: formData.includeMedicalRecords,
        },
      };

      // Create a medical report using the MedicalReportService
      const response = await doctorAPI.createMedicalReport(reportData);

      if (response && response.data) {
        showPopup("success", "Report generated successfully!");

        // Add the new report to the list
        setReports((prevReports) => [response.data, ...prevReports]);
        setShowGenerateModal(false);
      }
    } catch (err) {
      console.error("Error generating report:", err);
      showPopup(
        "error",
        err.response?.data?.message ||
          "Failed to generate report. Please try again."
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDeleteReport = async (reportId) => {
    if (!window.confirm("Are you sure you want to delete this report?")) {
      return;
    }

    try {
      setLoading(true);
      await doctorAPI.deleteMedicalReport(reportId);
      setReports(reports.filter((report) => report._id !== reportId));
      showPopup("success", "Report deleted successfully!");
      setShowReportDetailsModal(false);
    } catch (err) {
      console.error("Error deleting report:", err);
      showPopup(
        "error",
        err.response?.data?.message ||
          "Failed to delete report. Please try again."
      );
    } finally {
      setLoading(false);
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
    // Reset the form with first patient preselected if available
    setFormData({
      associatedPatient: patients.length > 0 ? patients[0]._id : "",
      reportType: "patient-summary",
      comments: "",
      dateRange: "month",
      customStartDate: "",
      customEndDate: "",
      includeAppointments: true,
      includePrescriptions: true,
      includeMedicalRecords: true,
    });
  };

  const handleViewReportDetails = (report) => {
    setSelectedReport(report);
    setShowReportDetailsModal(true);
  };

  const downloadReport = (url, filename) => {
    if (!url) return;

    const link = document.createElement("a");
    link.href = url;
    link.download = filename || "medical-report.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Format time for display
  const formatTime = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Get friendly report type name
  const getReportTypeName = (type) => {
    switch (type) {
      case "patient-summary":
        return "Patient Summary";
      case "appointments":
        return "Appointments Report";
      case "prescriptions":
        return "Prescriptions Report";
      case "medical-records":
        return "Medical Records Report";
      case "analytics":
        return "Patient Analytics";
      default:
        return "Medical Report";
    }
  };

  // Get report status badge color
  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "success";
      case "pending":
        return "warning";
      case "processing":
        return "info";
      case "failed":
        return "danger";
      default:
        return "secondary";
    }
  };

  // Filter and sort reports
  const filteredReports = reports
    .filter((report) => {
      const patientName =
        report.associatedPatient?.user?.fullname || "All Patients";
      const reportType = getReportTypeName(report.reportType);
      const reportStatus = report.status || "";

      const matchesSearch =
        searchTerm === "" ||
        patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reportType.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "" ||
        reportStatus.toLowerCase() === statusFilter.toLowerCase();

      const matchesType = typeFilter === "" || report.reportType === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    })
    .sort((a, b) => {
      const dateA = new Date(a.dateIssued || a.createdAt).getTime();
      const dateB = new Date(b.dateIssued || b.createdAt).getTime();
      return dateSort === "desc" ? dateB - dateA : dateA - dateB;
    });

  return (
    <div className="doctor-reports">
      <div className="reports-header">
        <h1 className="page-title">Medical Reports</h1>
        <Button variant="outline-primary" onClick={openGenerateModal}>
          <i className="fas fa-plus"></i> Generate New Report
        </Button>
      </div>

      {loading && !reports.length ? (
        <div className="loading-container">
          <Spinner center size="large" />
        </div>
      ) : reports.length > 0 ? (
        <>
          <div className="reports-filters">
            <div className="search-box">
              <i className="fas fa-search"></i>
              <input
                type="text"
                placeholder="Search by patient name or report type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="filter-group">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="filter-select"
              >
                <option value="">All Report Types</option>
                <option value="patient-summary">Patient Summary</option>
                <option value="appointments">Appointments Report</option>
                <option value="prescriptions">Prescriptions Report</option>
                <option value="medical-records">Medical Records Report</option>
                <option value="analytics">Analytics Report</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="filter-select"
              >
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
              </select>

              <select
                value={dateSort}
                onChange={(e) => setDateSort(e.target.value)}
                className="filter-select"
              >
                <option value="desc">Newest First</option>
                <option value="asc">Oldest First</option>
              </select>
            </div>
          </div>

          {filteredReports.length > 0 ? (
            <div className="reports-list">
              {filteredReports.map((report) => (
                <div key={report._id} className="report-item">
                  <div className="report-icon">
                    <i className="fas fa-file-medical-alt"></i>
                  </div>
                  <div className="report-details">
                    <h3 className="report-title">
                      {getReportTypeName(report.reportType)}
                    </h3>
                    <div className="report-meta">
                      <span>
                        <i className="fas fa-user-injured"></i>
                        {report.associatedPatient?.user?.fullname ||
                          "All Patients"}
                      </span>
                      <span>
                        <i className="fas fa-calendar-alt"></i>
                        {formatDate(report.dateIssued || report.createdAt)}
                      </span>
                      <span
                        className={`status-badge status-${getStatusClass(
                          report.status
                        )}`}
                      >
                        {report.status || "Pending"}
                      </span>
                    </div>
                  </div>
                  <div className="report-actions">
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={() => handleViewReportDetails(report)}
                    >
                      <i className="fas fa-eye"></i> View
                    </Button>
                    {report.document?.url && (
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() =>
                          downloadReport(
                            report.document.url,
                            `${getReportTypeName(
                              report.reportType
                            )}-${formatDate(
                              report.dateIssued || report.createdAt
                            )}.pdf`
                          )
                        }
                      >
                        <i className="fas fa-download"></i> Download
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-results">
              <i className="fas fa-search"></i>
              <h3>No matching reports found</h3>
              <p>
                Try adjusting your search or filters to find what you're looking
                for.
              </p>
              <Button
                variant="outline-primary"
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("");
                  setTypeFilter("");
                }}
              >
                <i className="fas fa-times"></i> Clear Filters
              </Button>
            </div>
          )}
        </>
      ) : (
        <div className="placeholder-content">
          <div className="placeholder-icon">
            <i className="fas fa-file-medical-alt"></i>
          </div>
          <h2>No Reports Generated Yet</h2>
          <p>
            Generate medical reports for your patients to track and document
            their healthcare journey.
          </p>
          <ul className="feature-list">
            <li>
              <i className="fas fa-chart-line"></i>
              Create patient summaries to review their health status
            </li>
            <li>
              <i className="fas fa-prescription"></i>
              Generate prescription reports to track medication history
            </li>
            <li>
              <i className="fas fa-calendar-check"></i>
              Produce appointment reports to analyze visit patterns
            </li>
          </ul>
          <Button variant="outline-primary" onClick={openGenerateModal}>
            <i className="fas fa-plus-circle"></i> Generate Your First Report
          </Button>
        </div>
      )}

      {/* Generate Report Modal */}
      {showGenerateModal && (
        <Modal
          title="Generate Medical Report"
          onClose={() => setShowGenerateModal(false)}
          size="large"
        >
          <form
            onSubmit={handleGenerateReport}
            className="generate-report-form"
          >
            <div className="form-group">
              <label htmlFor="reportType">Report Type</label>
              <select
                id="reportType"
                name="reportType"
                value={formData.reportType}
                onChange={handleInputChange}
                required
              >
                <option value="patient-summary">Patient Summary</option>
                <option value="appointments">Appointments Report</option>
                <option value="prescriptions">Prescriptions Report</option>
                <option value="medical-records">Medical Records Report</option>
                <option value="analytics">Patient Analytics</option>
              </select>
              <small className="input-help">
                Select the type of report you want to generate
              </small>
            </div>

            <div className="form-group">
              <label htmlFor="associatedPatient">Patient</label>
              <select
                id="associatedPatient"
                name="associatedPatient"
                value={formData.associatedPatient}
                onChange={handleInputChange}
              >
                <option value="">All Patients</option>
                {patients.map((patient) => (
                  <option key={patient._id} value={patient._id}>
                    {patient.user?.fullname ||
                      patient.user?.username ||
                      "Unknown Patient"}
                  </option>
                ))}
              </select>
              <small className="input-help">
                Leave blank to generate a report for all patients
              </small>
            </div>

            <div className="form-group">
              <label htmlFor="dateRange">Date Range</label>
              <select
                id="dateRange"
                name="dateRange"
                value={formData.dateRange}
                onChange={handleInputChange}
                required
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
                    required={formData.dateRange === "custom"}
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
                    required={formData.dateRange === "custom"}
                    min={formData.customStartDate}
                  />
                </div>
              </div>
            )}

            <div className="form-group">
              <label htmlFor="comments">Comments & Notes</label>
              <textarea
                id="comments"
                name="comments"
                value={formData.comments}
                onChange={handleInputChange}
                placeholder="Add any additional notes or comments for this report"
                rows="4"
              ></textarea>
            </div>

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
                  <label htmlFor="includeAppointments">
                    <i className="fas fa-calendar-check"></i> Appointments
                  </label>
                </div>
                <div className="checkbox-option">
                  <input
                    type="checkbox"
                    id="includePrescriptions"
                    name="includePrescriptions"
                    checked={formData.includePrescriptions}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="includePrescriptions">
                    <i className="fas fa-prescription"></i> Prescriptions
                  </label>
                </div>
                <div className="checkbox-option">
                  <input
                    type="checkbox"
                    id="includeMedicalRecords"
                    name="includeMedicalRecords"
                    checked={formData.includeMedicalRecords}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="includeMedicalRecords">
                    <i className="fas fa-file-medical"></i> Medical Records
                  </label>
                </div>
              </div>
            </div>

            <div className="form-note">
              <i className="fas fa-info-circle"></i>
              <p>
                Generating a report may take a few moments depending on the
                amount of data. You'll be notified once the report is ready for
                download.
              </p>
            </div>

            <div className="form-actions">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setShowGenerateModal(false)}
                disabled={isGenerating}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="outline-primary"
                loading={isGenerating}
                disabled={isGenerating}
              >
                <i className="fas fa-cog"></i> Generate Report
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Report Details Modal */}
      {showReportDetailsModal && selectedReport && (
        <Modal
          title="Report Details"
          onClose={() => setShowReportDetailsModal(false)}
          size="large"
        >
          <div className="report-details-modal">
            <div className="report-details-header">
              <div className="report-title-section">
                <h2>{getReportTypeName(selectedReport.reportType)}</h2>
                <span
                  className={`status-badge status-${getStatusClass(
                    selectedReport.status
                  )}`}
                >
                  {selectedReport.status || "Pending"}
                </span>
              </div>
              <div className="report-meta-info">
                <div className="meta-item">
                  <i className="fas fa-calendar-alt"></i>
                  <div className="meta-content">
                    <span className="meta-label">Generated on</span>
                    <span className="meta-value">
                      {formatDate(
                        selectedReport.dateIssued || selectedReport.createdAt
                      )}
                    </span>
                  </div>
                </div>
                <div className="meta-item">
                  <i className="fas fa-clock"></i>
                  <div className="meta-content">
                    <span className="meta-label">Time</span>
                    <span className="meta-value">
                      {formatTime(
                        selectedReport.dateIssued || selectedReport.createdAt
                      )}
                    </span>
                  </div>
                </div>
                <div className="meta-item">
                  <i className="fas fa-user-md"></i>
                  <div className="meta-content">
                    <span className="meta-label">Doctor</span>
                    <span className="meta-value">
                      {selectedReport.issuedByDoctor?.user?.fullname ||
                        "Unknown Doctor"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="report-content-section">
              <div className="content-block">
                <h3>
                  <i className="fas fa-user-injured"></i> Patient Information
                </h3>
                <div className="info-row">
                  <span className="info-label">Name:</span>
                  <span className="info-value">
                    {selectedReport.associatedPatient?.user?.fullname ||
                      "All Patients"}
                  </span>
                </div>
                {selectedReport.associatedPatient && (
                  <>
                    <div className="info-row">
                      <span className="info-label">Email:</span>
                      <span className="info-value">
                        {selectedReport.associatedPatient?.user?.email || "N/A"}
                      </span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Patient ID:</span>
                      <span className="info-value">
                        {selectedReport.associatedPatient?._id || "N/A"}
                      </span>
                    </div>
                  </>
                )}
              </div>

              <div className="content-block">
                <h3>
                  <i className="fas fa-clipboard-list"></i> Report Details
                </h3>
                <div className="info-row">
                  <span className="info-label">Report Type:</span>
                  <span className="info-value">
                    {getReportTypeName(selectedReport.reportType)}
                  </span>
                </div>
                <div className="info-row">
                  <span className="info-label">Report ID:</span>
                  <span className="info-value">{selectedReport._id}</span>
                </div>
                {selectedReport.metadata && (
                  <div className="info-row">
                    <span className="info-label">Date Range:</span>
                    <span className="info-value">
                      {selectedReport.metadata.dateRange === "custom"
                        ? `${formatDate(
                            selectedReport.metadata.startDate
                          )} to ${formatDate(selectedReport.metadata.endDate)}`
                        : selectedReport.metadata.dateRange === "week"
                        ? "Last Week"
                        : selectedReport.metadata.dateRange === "month"
                        ? "Last Month"
                        : selectedReport.metadata.dateRange === "quarter"
                        ? "Last 3 Months"
                        : selectedReport.metadata.dateRange === "year"
                        ? "Last Year"
                        : "All Time"}
                    </span>
                  </div>
                )}
                <div className="info-row">
                  <span className="info-label">Included Data:</span>
                  <div className="included-data-tags">
                    {selectedReport.metadata?.includeAppointments !== false && (
                      <span className="included-data-tag">
                        <i className="fas fa-calendar-check"></i> Appointments
                      </span>
                    )}
                    {selectedReport.metadata?.includePrescriptions !==
                      false && (
                      <span className="included-data-tag">
                        <i className="fas fa-prescription"></i> Prescriptions
                      </span>
                    )}
                    {selectedReport.metadata?.includeMedicalRecords !==
                      false && (
                      <span className="included-data-tag">
                        <i className="fas fa-file-medical"></i> Medical Records
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {selectedReport.comments && (
                <div className="content-block">
                  <h3>
                    <i className="fas fa-comment-alt"></i> Comments
                  </h3>
                  <p className="report-comments">{selectedReport.comments}</p>
                </div>
              )}

              {selectedReport.document && (
                <div className="content-block">
                  <h3>
                    <i className="fas fa-file-pdf"></i> Document
                  </h3>
                  <div className="document-details">
                    <div className="document-icon">
                      <i className="fas fa-file-pdf"></i>
                    </div>
                    <div className="document-info">
                      <span className="document-name">
                        {selectedReport.document.url.split("/").pop() ||
                          "Report Document"}
                      </span>
                      <span className="document-size">
                        {selectedReport.document.size
                          ? `${(selectedReport.document.size / 1024).toFixed(
                              1
                            )} MB`
                          : "Unknown size"}
                      </span>
                    </div>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() =>
                        downloadReport(
                          selectedReport.document.url,
                          `${getReportTypeName(
                            selectedReport.reportType
                          )}-${formatDate(
                            selectedReport.dateIssued ||
                              selectedReport.createdAt
                          )}.pdf`
                        )
                      }
                    >
                      <i className="fas fa-download"></i> Download
                    </Button>
                  </div>
                </div>
              )}

              {selectedReport.status === "processing" && (
                <div className="content-block processing-status">
                  <div className="processing-indicator">
                    <i className="fas fa-spinner fa-pulse"></i>
                    <span>Report is being processed...</span>
                  </div>
                  <p>
                    This may take a few moments. The report will be available
                    for download once completed.
                  </p>
                </div>
              )}

              {selectedReport.status === "failed" && (
                <div className="content-block error-status">
                  <div className="error-indicator">
                    <i className="fas fa-exclamation-circle"></i>
                    <span>Report generation failed</span>
                  </div>
                  <p>
                    There was an issue generating this report. Please try again
                    or contact support if the problem persists.
                  </p>
                </div>
              )}
            </div>

            <div className="modal-actions">
              {selectedReport.document?.url && (
                <Button
                  variant="outline-primary"
                  onClick={() =>
                    downloadReport(
                      selectedReport.document.url,
                      `${getReportTypeName(
                        selectedReport.reportType
                      )}-${formatDate(
                        selectedReport.dateIssued || selectedReport.createdAt
                      )}.pdf`
                    )
                  }
                >
                  <i className="fas fa-download"></i> Download Report
                </Button>
              )}
              {/* Regenerate option for failed reports */}
              {selectedReport.status === "failed" && (
                <Button
                  variant="outline-warning"
                  onClick={() => {
                    setShowReportDetailsModal(false);
                    // Pre-populate form with the same settings
                    setFormData({
                      associatedPatient:
                        selectedReport.associatedPatient?._id || "",
                      reportType:
                        selectedReport.reportType || "patient-summary",
                      comments: selectedReport.comments || "",
                      dateRange: selectedReport.metadata?.dateRange || "month",
                      customStartDate: selectedReport.metadata?.startDate || "",
                      customEndDate: selectedReport.metadata?.endDate || "",
                      includeAppointments:
                        selectedReport.metadata?.includeAppointments !== false,
                      includePrescriptions:
                        selectedReport.metadata?.includePrescriptions !== false,
                      includeMedicalRecords:
                        selectedReport.metadata?.includeMedicalRecords !==
                        false,
                    });
                    setShowGenerateModal(true);
                  }}
                >
                  <i className="fas fa-sync"></i> Try Again
                </Button>
              )}
              <Button
                variant="outline-danger"
                onClick={() => handleDeleteReport(selectedReport._id)}
              >
                <i className="fas fa-trash"></i> Delete Report
              </Button>
              <Button
                variant="secondary"
                onClick={() => setShowReportDetailsModal(false)}
              >
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Add Popup component for notifications */}
      <Popup
        type={popup.type}
        title={popup.title}
        message={popup.message}
        isVisible={popup.show}
        onClose={hidePopup}
        position="top-right"
        autoClose={true}
        duration={5000}
      />
    </div>
  );
};

export default Reports;
