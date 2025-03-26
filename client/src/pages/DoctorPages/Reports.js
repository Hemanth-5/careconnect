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
    // New field for specific items
    specificItems: false,
  });

  // List of patients for select dropdown
  const [patients, setPatients] = useState([]);

  // Additional state for managing items to include in reports
  const [patientAppointments, setPatientAppointments] = useState([]);
  const [patientPrescriptions, setPatientPrescriptions] = useState([]);
  const [patientRecords, setPatientRecords] = useState([]);
  const [showItemsModal, setShowItemsModal] = useState(false);
  const [selectedItems, setSelectedItems] = useState({
    appointments: [],
    prescriptions: [],
    patientRecords: [],
  });

  // Add debugging toggle state and state to manage which tab is currently shown
  const [showDebug, setShowDebug] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
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

      // Check that patient ID is properly formatted
      if (formData.associatedPatient) {
        // console.log("Using patient ID for report:", formData.associatedPatient);
      }

      // Format data according to MedicalReport service
      const reportData = {
        associatedPatient: formData.associatedPatient || null, // Ensure null if empty
        reportType: formData.reportType,
        comments: formData.comments,
        // Additional metadata as JSON for the report generation
        reportMetadata: {
          includeSummary: true,
          includeAppointments: formData.includeAppointments,
          includePrescriptions: formData.includePrescriptions,
          includeRecords: formData.includeMedicalRecords,
          dateRange: {
            startDate:
              formData.dateRange === "custom"
                ? formData.customStartDate
                : undefined,
            endDate:
              formData.dateRange === "custom"
                ? formData.customEndDate
                : undefined,
          },
        },
      };

      // console.log("Sending report data:", reportData);

      // Create a medical report
      const response = await doctorAPI.createReport(reportData);

      if (response && response.data) {
        const newReport = response.data;
        // console.log("New report created:", newReport);

        // If specific items are selected, add them to the report
        if (
          formData.specificItems &&
          (selectedItems.appointments.length > 0 ||
            selectedItems.prescriptions.length > 0 ||
            selectedItems.patientRecords.length > 0)
        ) {
          // console.log("Adding items to report:", {
          //   appointments: selectedItems.appointments,
          //   prescriptions: selectedItems.prescriptions,
          //   patientRecords: selectedItems.patientRecords,
          // });

          await doctorAPI.addItemsToReport(newReport._id, selectedItems);
        }

        showPopup("success", "Report generated successfully!");

        // Add the new report to the list using functional update to ensure we have the latest state
        setReports((prevReports) => {
          const updatedReports = [newReport, ...prevReports];
          // Log inside the functional update to see the actual updated array
          // console.log("Reports updated:", updatedReports);
          return updatedReports;
        });

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
      specificItems: false,
    });

    // Reset selected items
    setSelectedItems({
      appointments: [],
      prescriptions: [],
      patientRecords: [],
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

  // Handle patient change - fetch their appointments, prescriptions, and records
  useEffect(() => {
    if (formData.associatedPatient && formData.specificItems) {
      fetchPatientItems(formData.associatedPatient);
    }
  }, [formData.associatedPatient, formData.specificItems]);

  // Fetch patient-specific items
  const fetchPatientItems = async (patientId) => {
    try {
      setLoading(true);
      // console.log("Fetching items for patient ID:", patientId);

      // Fetch appointments with better error handling and logging
      try {
        const appointmentsResponse = await doctorAPI.getAppointments();
        // console.log("All appointments:", appointmentsResponse.data);

        // More robust filtering that handles various patient reference formats
        const patientAppointments = appointmentsResponse.data.filter(
          (appointment) => {
            // First log the appointment to help debug
            // console.log("Checking appointment:", {
            //   id: appointment._id,
            //   patient: appointment.patient,
            //   patientId: appointment.patient?._id || appointment.patient,
            // });

            // Handle case where patient is completely missing
            if (!appointment.patient) {
              // console.log(
              //   `Appointment ${appointment._id} has no patient reference`
              // );
              return false;
            }

            // Handle both object format and string ID format
            let appointmentPatientId;
            if (typeof appointment.patient === "object") {
              appointmentPatientId = appointment.patient._id;
            } else {
              appointmentPatientId = appointment.patient.toString();
            }

            // Compare with the target patient ID
            const isMatch = appointmentPatientId === patientId;
            // console.log(
            //   `Appointment ${
            //     appointment._id
            //   } patient ${appointmentPatientId} vs ${patientId}: ${
            //     isMatch ? "MATCH" : "NO MATCH"
            //   }`
            // );

            return isMatch;
          }
        );

        // console.log("Filtered appointments:", patientAppointments);
        setPatientAppointments(patientAppointments);
      } catch (apptError) {
        console.error("Error fetching appointments:", apptError);
        showPopup("error", "Failed to fetch appointments");
        setPatientAppointments([]);
      }

      // Apply the same robust filtering to prescriptions
      try {
        const prescriptionsResponse = await doctorAPI.getPrescriptions();
        // console.log("All prescriptions:", prescriptionsResponse.data);

        const patientPrescriptions = prescriptionsResponse.data.filter(
          (prescription) => {
            if (!prescription.patient) return false;

            const prescriptionPatientId =
              typeof prescription.patient === "object"
                ? prescription.patient._id
                : prescription.patient.toString();

            return prescriptionPatientId === patientId;
          }
        );

        // console.log("Filtered prescriptions:", patientPrescriptions);
        setPatientPrescriptions(patientPrescriptions);
      } catch (rxError) {
        console.error("Error fetching prescriptions:", rxError);
        setPatientPrescriptions([]);
      }

      // Apply the same robust filtering to medical records
      try {
        const recordsResponse = await doctorAPI.getMedicalRecords();
        // console.log("All records:", recordsResponse.data);

        const patientRecords = recordsResponse.data.filter((record) => {
          if (!record.patient) return false;

          const recordPatientId =
            typeof record.patient === "object"
              ? record.patient._id
              : record.patient.toString();

          return recordPatientId === patientId;
        });

        // console.log("Filtered records:", patientRecords);
        setPatientRecords(patientRecords);
      } catch (recordError) {
        console.error("Error fetching medical records:", recordError);
        setPatientRecords([]);
      }
    } catch (error) {
      console.error("Error in fetchPatientItems:", error);
      showPopup("error", "Failed to load patient data: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Function to handle tab switching - fix syntax
  const handleTabChange = (tabIndex) => {
    // console.log("Switching to tab:", tabIndex);
    setActiveTab(tabIndex);
  };

  // Open modal to select specific items
  const openItemSelectionModal = () => {
    if (!formData.associatedPatient) {
      showPopup("error", "Please select a patient first");
      return;
    }

    // Ensure the patient's data is loaded
    fetchPatientItems(formData.associatedPatient);

    // Default to first tab (Appointments) explicitly
    setActiveTab(0);
    setShowItemsModal(true);
  };

  // Handle item selection
  const handleItemSelection = (type, itemId) => {
    setSelectedItems((prev) => {
      const currentItems = [...prev[type]];
      const itemIndex = currentItems.indexOf(itemId);
      if (itemIndex === -1) {
        // Add item
        return { ...prev, [type]: [...currentItems, itemId] };
      } else {
        // Remove item
        currentItems.splice(itemIndex, 1);
        return { ...prev, [type]: currentItems };
      }
    });
  };

  // Handle adding selected items to a report
  const addItemsToReport = async (reportId) => {
    try {
      setLoading(true);

      await doctorAPI.addItemsToReport(reportId, {
        appointments: selectedItems.appointments,
        prescriptions: selectedItems.prescriptions,
        patientRecords: selectedItems.patientRecords,
      });

      showPopup("success", "Items added to report successfully");
      setShowItemsModal(false);

      // Refresh the report details
      if (selectedReport && selectedReport._id === reportId) {
        const updatedReport = await doctorAPI.getReportById(reportId);
        setSelectedReport(updatedReport.data);
      }
    } catch (error) {
      console.error("Error adding items to report:", error);
      showPopup("error", "Failed to add items to report");
    } finally {
      setLoading(false);
    }
  };

  // Add debug tracking for tab switching
  useEffect(() => {
    if (showDebug) {
      // console.log("Active tab:", activeTab);
    }
  }, [activeTab, showDebug]);

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
              <i className="fas fa-chart-line"></i> Create patient summaries to
              review their health status
            </li>
            <li>
              <i className="fas fa-prescription"></i> Generate prescription
              reports to track medication history
            </li>
            <li>
              <i className="fas fa-calendar-check"></i> Produce appointment
              reports to analyze visit patterns
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

            {/* New option for selecting specific items */}
            <div className="form-group">
              <div className="specific-items-option">
                <input
                  type="checkbox"
                  id="specificItems"
                  name="specificItems"
                  checked={formData.specificItems}
                  onChange={handleInputChange}
                />
                <label htmlFor="specificItems">
                  <i className="fas fa-list-check"></i> Select specific items to
                  include
                  {selectedItems.appointments.length +
                    selectedItems.prescriptions.length +
                    selectedItems.patientRecords.length >
                    0 && (
                    <span className="items-count">
                      (
                      {selectedItems.appointments.length +
                        selectedItems.prescriptions.length +
                        selectedItems.patientRecords.length}
                      )
                    </span>
                  )}
                </label>
              </div>
              {formData.specificItems && formData.associatedPatient && (
                <div className="specific-items-actions">
                  <Button
                    type="button"
                    variant="outline-secondary"
                    size="sm"
                    onClick={openItemSelectionModal}
                  >
                    <i className="fas fa-list"></i> Select Items
                    {selectedItems.appointments.length +
                      selectedItems.prescriptions.length +
                      selectedItems.patientRecords.length >
                      0 && (
                      <span className="items-count">
                        (
                        {selectedItems.appointments.length +
                          selectedItems.prescriptions.length +
                          selectedItems.patientRecords.length}
                        )
                      </span>
                    )}
                  </Button>
                </div>
              )}
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

      {/* Item Selection Modal */}
      {showItemsModal && (
        <Modal
          title="Select Items for Report"
          onClose={() => setShowItemsModal(false)}
          size="large"
        >
          <div className="item-selection-modal">
            <div className="tabs-container">
              <div className="tabs">
                <button
                  className={`tab ${activeTab === 0 ? "active" : ""}`}
                  onClick={() => handleTabChange(0)}
                >
                  <i className="fas fa-calendar-check"></i> Appointments (
                  {patientAppointments.length})
                </button>
                <button
                  className={`tab ${activeTab === 1 ? "active" : ""}`}
                  onClick={() => handleTabChange(1)}
                >
                  <i className="fas fa-prescription"></i> Prescriptions (
                  {patientPrescriptions.length})
                </button>
                <button
                  className={`tab ${activeTab === 2 ? "active" : ""}`}
                  onClick={() => handleTabChange(2)}
                >
                  <i className="fas fa-file-medical"></i> Records (
                  {patientRecords.length})
                </button>
              </div>

              <div className="tab-content">
                {/* Appointments Tab */}
                <div className={`tab-panel ${activeTab === 0 ? "" : "hidden"}`}>
                  {loading ? (
                    <div className="loading-container">
                      <Spinner center size="medium" />
                    </div>
                  ) : patientAppointments.length > 0 ? (
                    <div className="item-list appointments-list">
                      {patientAppointments.map((appointment) => (
                        <div
                          key={appointment._id}
                          className={`item-card ${
                            selectedItems.appointments.includes(appointment._id)
                              ? "selected"
                              : ""
                          }`}
                          onClick={() =>
                            handleItemSelection("appointments", appointment._id)
                          }
                        >
                          {/* Keep existing item card content */}
                          <div className="item-checkbox">
                            <input
                              type="checkbox"
                              checked={selectedItems.appointments.includes(
                                appointment._id
                              )}
                              readOnly
                            />
                          </div>
                          <div className="item-details">
                            <div className="item-title">
                              <i className="fas fa-calendar-day"></i>
                              {new Date(
                                appointment.appointmentDate
                              ).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </div>
                            <div className="item-subtitle">
                              <span
                                className={`status-badge status-${appointment.status}`}
                              >
                                {appointment.status}
                              </span>
                              <span className="item-id">
                                ID: {appointment._id}
                              </span>
                            </div>
                            {appointment.reason && (
                              <div className="item-description">
                                {appointment.reason}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="no-items">
                      <i className="fas fa-calendar-times"></i>
                      <p>No appointments found for this patient.</p>
                      <p className="help-text">
                        If you believe this is an error, please check the
                        patient ID and try again.
                        <br />
                        Patient ID: {formData.associatedPatient}
                      </p>
                      {/* {console.log(formData)} */}
                    </div>
                  )}
                </div>

                {/* Prescriptions Tab */}
                <div className={`tab-panel ${activeTab === 1 ? "" : "hidden"}`}>
                  {loading ? (
                    <div className="loading-container">
                      <Spinner center size="medium" />
                    </div>
                  ) : patientPrescriptions.length > 0 ? (
                    <div className="item-list prescriptions-list">
                      {patientPrescriptions.map((prescription) => (
                        <div
                          key={prescription._id}
                          className={`item-card ${
                            selectedItems.prescriptions.includes(
                              prescription._id
                            )
                              ? "selected"
                              : ""
                          }`}
                          onClick={() =>
                            handleItemSelection(
                              "prescriptions",
                              prescription._id
                            )
                          }
                        >
                          {/* Keep existing item card content */}
                          <div className="item-checkbox">
                            <input
                              type="checkbox"
                              checked={selectedItems.prescriptions.includes(
                                prescription._id
                              )}
                              readOnly
                            />
                          </div>
                          <div className="item-details">
                            <div className="item-title">
                              <i className="fas fa-prescription-bottle-medical"></i>
                              Prescription{" "}
                              {new Date(
                                prescription.createdAt
                              ).toLocaleDateString()}
                            </div>
                            <div className="item-subtitle">
                              <span className="item-id">
                                ID: {prescription._id}
                              </span>
                            </div>
                            <div className="item-medications">
                              {prescription.medications
                                ?.slice(0, 2)
                                .map((med, idx) => (
                                  <span key={idx} className="medication-tag">
                                    {med.name}
                                  </span>
                                ))}
                              {prescription.medications?.length > 2 && (
                                <span className="medication-tag more">
                                  +{prescription.medications.length - 2} more
                                </span>
                              )}
                            </div>
                            {prescription.notes && (
                              <div className="item-description">
                                {prescription.notes}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="no-items">
                      <i className="fas fa-prescription-bottle-alt"></i>
                      <p>No prescriptions found for this patient.</p>
                    </div>
                  )}
                </div>

                {/* Medical Records Tab */}
                <div className={`tab-panel ${activeTab === 2 ? "" : "hidden"}`}>
                  {loading ? (
                    <div className="loading-container">
                      <Spinner center size="medium" />
                    </div>
                  ) : patientRecords.length > 0 ? (
                    <div className="item-list records-list">
                      {patientRecords.map((record) => (
                        <div
                          key={record._id}
                          className={`item-card ${
                            selectedItems.patientRecords.includes(record._id)
                              ? "selected"
                              : ""
                          }`}
                          onClick={() =>
                            handleItemSelection("patientRecords", record._id)
                          }
                        >
                          {/* Keep existing item card content */}
                          <div className="item-checkbox">
                            <input
                              type="checkbox"
                              checked={selectedItems.patientRecords.includes(
                                record._id
                              )}
                              readOnly
                            />
                          </div>
                          <div className="item-details">
                            <div className="item-title">
                              <i className="fas fa-file-medical"></i>
                              Medical Record{" "}
                              {new Date(record.createdAt).toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                }
                              )}
                            </div>
                            <div className="item-subtitle">
                              <span className="item-id">ID: {record._id}</span>
                            </div>
                            {record.records && record.records.length > 0 && (
                              <div className="record-entries">
                                {record.records
                                  .slice(0, 2)
                                  .map((entry, idx) => (
                                    <span key={idx} className="entry-tag">
                                      {entry.recordType}: {entry.title}
                                    </span>
                                  ))}
                                {record.records.length > 2 && (
                                  <span className="entry-tag more">
                                    +{record.records.length - 2} more entries
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="no-items">
                      <i className="fas fa-file-medical-alt"></i>
                      <p>No medical records found for this patient.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {showDebug && (
              <div className="debug-info modal-debug">
                <h4>Item Selection Debug</h4>
                <div>Selected Patient ID: {formData.associatedPatient}</div>
                <div>Appointments found: {patientAppointments.length}</div>
                <div>Prescriptions found: {patientPrescriptions.length}</div>
                <div>Records found: {patientRecords.length}</div>
                <div>Active Tab: {activeTab}</div>
              </div>
            )}

            <div className="modal-actions">
              <Button
                type="button"
                variant="outline-primary"
                onClick={() => {
                  if (selectedReport) {
                    addItemsToReport(selectedReport._id);
                  } else {
                    setShowItemsModal(false);
                  }
                }}
                disabled={
                  loading ||
                  (selectedItems.appointments.length === 0 &&
                    selectedItems.prescriptions.length === 0 &&
                    selectedItems.patientRecords.length === 0)
                }
              >
                <i className="fas fa-check"></i>{" "}
                {selectedReport ? "Add to Report" : "Confirm Selection"}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setShowItemsModal(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
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

              {/* New section for included items */}
              <div className="report-content-section">
                <div className="content-block">
                  <h3>
                    <i className="fas fa-clipboard-list"></i> Included Items
                  </h3>
                  {/* Appointments section */}
                  <div className="included-items-section">
                    <h4>
                      <i className="fas fa-calendar-check"></i> Appointments
                      <span className="item-count">
                        {selectedReport.appointments?.length || 0}
                      </span>
                    </h4>
                    {selectedReport.appointments?.length > 0 ? (
                      <div className="items-list">
                        {selectedReport.appointments.map((appointment) => (
                          <div key={appointment._id} className="included-item">
                            <div className="item-icon">
                              <i className="fas fa-calendar-day"></i>
                            </div>
                            <div className="item-content">
                              <span className="item-date">
                                {new Date(
                                  appointment.appointmentDate
                                ).toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>
                              <span
                                className={`status-badge status-${appointment.status}`}
                              >
                                {appointment.status}
                              </span>
                              <span className="item-id">
                                ID: {appointment._id}
                              </span>
                              {appointment.reason && (
                                <p className="item-notes">
                                  {appointment.reason}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                        {/* Add more button if there are too many items */}
                        {selectedReport.appointments.length > 5 && (
                          <Button
                            variant="text"
                            size="sm"
                            className="view-more-btn"
                          >
                            View all {selectedReport.appointments.length}{" "}
                            appointments
                          </Button>
                        )}
                      </div>
                    ) : (
                      <div className="no-items-message">
                        <p>No appointments included in this report.</p>
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          onClick={() => {
                            setShowReportDetailsModal(false);
                            setShowItemsModal(true);
                          }}
                        >
                          <i className="fas fa-plus"></i> Add Appointments
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Prescriptions section */}
                  <div className="included-items-section">
                    <h4>
                      <i className="fas fa-prescription"></i> Prescriptions
                      <span className="item-count">
                        {selectedReport.prescriptions?.length || 0}
                      </span>
                    </h4>
                    {selectedReport.prescriptions?.length > 0 ? (
                      <div className="items-list">
                        {selectedReport.prescriptions.map((prescription) => (
                          <div key={prescription._id} className="included-item">
                            <div className="item-icon">
                              <i className="fas fa-prescription-bottle-medical"></i>
                            </div>
                            <div className="item-content">
                              <span className="item-title">
                                Prescription{" "}
                                {new Date(
                                  prescription.startDate ||
                                    prescription.createdAt
                                ).toLocaleDateString()}
                              </span>
                              <div className="medications-list">
                                {prescription.medications
                                  ?.slice(0, 3)
                                  .map((med, idx) => (
                                    <span key={idx} className="medication-pill">
                                      {med.name}{" "}
                                      {med.dosage && `(${med.dosage})`}
                                    </span>
                                  ))}
                                {prescription.medications?.length > 3 && (
                                  <span className="medication-pill more">
                                    +{prescription.medications.length - 3} more
                                  </span>
                                )}
                              </div>
                              {prescription.notes && (
                                <p className="item-notes">
                                  {prescription.notes}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="no-items-message">
                        <p>No prescriptions included in this report.</p>
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          onClick={() => {
                            setShowReportDetailsModal(false);
                            setShowItemsModal(true);
                          }}
                        >
                          <i className="fas fa-plus"></i> Add Prescriptions
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Medical Records section */}
                  <div className="included-items-section">
                    <h4>
                      <i className="fas fa-file-medical"></i> Medical Records
                      <span className="item-count">
                        {selectedReport.patientRecords?.length || 0}
                      </span>
                    </h4>
                    {selectedReport.patientRecords?.length > 0 ? (
                      <div className="items-list">
                        {selectedReport.patientRecords.map((record) => (
                          <div key={record._id} className="included-item">
                            <div className="item-icon">
                              <i className="fas fa-file-medical-alt"></i>
                            </div>
                            <div className="item-content">
                              <span className="item-date">
                                {new Date(record.createdAt).toLocaleDateString(
                                  "en-US",
                                  {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  }
                                )}
                              </span>
                              <span className="item-id">ID: {record._id}</span>
                              {record.records && record.records.length > 0 && (
                                <div className="record-entries">
                                  {record.records
                                    .slice(0, 2)
                                    .map((entry, idx) => (
                                      <div key={idx} className="record-entry">
                                        <span className="entry-type">
                                          {entry.recordType}:
                                        </span>
                                        <span className="entry-title">
                                          {entry.title}
                                        </span>
                                      </div>
                                    ))}
                                  {record.records.length > 2 && (
                                    <div className="more-entries">
                                      +{record.records.length - 2} more entries
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="no-items-message">
                        <p>No medical records included in this report.</p>
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          onClick={() => {
                            setShowReportDetailsModal(false);
                            setShowItemsModal(true);
                          }}
                        >
                          <i className="fas fa-plus"></i> Add Medical Records
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-actions">
              <Button
                type="button"
                variant="outline-primary"
                onClick={() => {
                  if (selectedReport) {
                    addItemsToReport(selectedReport._id);
                  } else {
                    setShowItemsModal(false);
                  }
                }}
                disabled={
                  loading ||
                  (selectedItems.appointments.length === 0 &&
                    selectedItems.prescriptions.length === 0 &&
                    selectedItems.patientRecords.length === 0)
                }
              >
                <i className="fas fa-check"></i>{" "}
                {selectedReport ? "Add to Report" : "Confirm Selection"}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setShowItemsModal(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
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

              {/* New section for included items */}
              <div className="report-content-section">
                <div className="content-block">
                  <h3>
                    <i className="fas fa-clipboard-list"></i> Included Items
                  </h3>
                  {/* Appointments section */}
                  <div className="included-items-section">
                    <h4>
                      <i className="fas fa-calendar-check"></i> Appointments
                      <span className="item-count">
                        {selectedReport.appointments?.length || 0}
                      </span>
                    </h4>
                    {selectedReport.appointments?.length > 0 ? (
                      <div className="items-list">
                        {selectedReport.appointments.map((appointment) => (
                          <div key={appointment._id} className="included-item">
                            <div className="item-icon">
                              <i className="fas fa-calendar-day"></i>
                            </div>
                            <div className="item-content">
                              <span className="item-date">
                                {new Date(
                                  appointment.appointmentDate
                                ).toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>
                              <span
                                className={`status-badge status-${appointment.status}`}
                              >
                                {appointment.status}
                              </span>
                              <span className="item-id">
                                ID: {appointment._id}
                              </span>
                              {appointment.reason && (
                                <p className="item-notes">
                                  {appointment.reason}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                        {/* Add more button if there are too many items */}
                        {selectedReport.appointments.length > 5 && (
                          <Button
                            variant="text"
                            size="sm"
                            className="view-more-btn"
                          >
                            View all {selectedReport.appointments.length}{" "}
                            appointments
                          </Button>
                        )}
                      </div>
                    ) : (
                      <div className="no-items-message">
                        <p>No appointments included in this report.</p>
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          onClick={() => {
                            setShowReportDetailsModal(false);
                            setShowItemsModal(true);
                          }}
                        >
                          <i className="fas fa-plus"></i> Add Appointments
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Prescriptions section */}
                  <div className="included-items-section">
                    <h4>
                      <i className="fas fa-prescription"></i> Prescriptions
                      <span className="item-count">
                        {selectedReport.prescriptions?.length || 0}
                      </span>
                    </h4>
                    {selectedReport.prescriptions?.length > 0 ? (
                      <div className="items-list">
                        {selectedReport.prescriptions.map((prescription) => (
                          <div key={prescription._id} className="included-item">
                            <div className="item-icon">
                              <i className="fas fa-prescription-bottle-medical"></i>
                            </div>
                            <div className="item-content">
                              <span className="item-title">
                                Prescription{" "}
                                {new Date(
                                  prescription.startDate ||
                                    prescription.createdAt
                                ).toLocaleDateString()}
                              </span>
                              <div className="medications-list">
                                {prescription.medications
                                  ?.slice(0, 3)
                                  .map((med, idx) => (
                                    <span key={idx} className="medication-pill">
                                      {med.name}{" "}
                                      {med.dosage && `(${med.dosage})`}
                                    </span>
                                  ))}
                                {prescription.medications?.length > 3 && (
                                  <span className="medication-pill more">
                                    +{prescription.medications.length - 3} more
                                  </span>
                                )}
                              </div>
                              {prescription.notes && (
                                <p className="item-notes">
                                  {prescription.notes}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="no-items-message">
                        <p>No prescriptions included in this report.</p>
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          onClick={() => {
                            setShowReportDetailsModal(false);
                            setShowItemsModal(true);
                          }}
                        >
                          <i className="fas fa-plus"></i> Add Prescriptions
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Medical Records section */}
                  <div className="included-items-section">
                    <h4>
                      <i className="fas fa-file-medical"></i> Medical Records
                      <span className="item-count">
                        {selectedReport.patientRecords?.length || 0}
                      </span>
                    </h4>
                    {selectedReport.patientRecords?.length > 0 ? (
                      <div className="items-list">
                        {selectedReport.patientRecords.map((record) => (
                          <div key={record._id} className="included-item">
                            <div className="item-icon">
                              <i className="fas fa-file-medical-alt"></i>
                            </div>
                            <div className="item-content">
                              <span className="item-date">
                                {new Date(record.createdAt).toLocaleDateString(
                                  "en-US",
                                  {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  }
                                )}
                              </span>
                              <span className="item-id">ID: {record._id}</span>
                              {record.records && record.records.length > 0 && (
                                <div className="record-entries">
                                  {record.records
                                    .slice(0, 2)
                                    .map((entry, idx) => (
                                      <div key={idx} className="record-entry">
                                        <span className="entry-type">
                                          {entry.recordType}:
                                        </span>
                                        <span className="entry-title">
                                          {entry.title}
                                        </span>
                                      </div>
                                    ))}
                                  {record.records.length > 2 && (
                                    <div className="more-entries">
                                      +{record.records.length - 2} more entries
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="no-items-message">
                        <p>No medical records included in this report.</p>
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          onClick={() => {
                            setShowReportDetailsModal(false);
                            setShowItemsModal(true);
                          }}
                        >
                          <i className="fas fa-plus"></i> Add Medical Records
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-actions">
              {selectedReport.document?.url && (
                <Button
                  variant="outline-primary"
                  onClick={() => {
                    downloadReport(
                      selectedReport.document.url,
                      `${getReportTypeName(
                        selectedReport.reportType
                      )}-${formatDate(
                        selectedReport.dateIssued || selectedReport.createdAt
                      )}.pdf`
                    );
                  }}
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
                    // Fetch the patient's data for selection
                    if (selectedReport.associatedPatient) {
                      fetchPatientItems(selectedReport.associatedPatient._id);
                    }
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
              {/* Add button to modify the included items */}
              {selectedReport.status !== "processing" && (
                <Button
                  variant="outline-secondary"
                  onClick={() => {
                    setShowReportDetailsModal(false);
                    // Reset selected items based on what's already in the report
                    setSelectedItems({
                      appointments:
                        selectedReport.appointments?.map((a) => a._id) || [],
                      prescriptions:
                        selectedReport.prescriptions?.map((p) => p._id) || [],
                      patientRecords:
                        selectedReport.patientRecords?.map((r) => r._id) || [],
                    });
                    setShowItemsModal(true);
                    // Fetch the patient's data for selection
                    if (selectedReport.associatedPatient) {
                      fetchPatientItems(selectedReport.associatedPatient._id);
                    }
                  }}
                >
                  <i className="fas fa-edit"></i> Modify Included Items
                </Button>
              )}
            </div>
          </div>
        </Modal>
      )}

      {/* Add Popup component for notifications */}
      <Popup
        show={popup.show}
        message={popup.message}
        title={popup.title}
        type={popup.type}
        onClose={hidePopup}
        autoClose={true}
        duration={5000}
        position="top-right"
      />

      {/* Add a button somewhere for developers to toggle debug */}
      <Button
        variant="text"
        size="sm"
        onClick={() => setShowDebug(!showDebug)}
        style={{
          position: "fixed",
          bottom: "10px",
          right: "10px",
          opacity: 0.6,
        }}
      >
        {showDebug ? "Hide Debug" : "Debug"}
      </Button>

      {showDebug && (
        <div className="debug-info">
          <h4>Debug Information</h4>
          <div>
            <strong>Patient Items:</strong>
            <div>Appointments: {patientAppointments.length}</div>
            <div>Prescriptions: {patientPrescriptions.length}</div>
            <div>Records: {patientRecords.length}</div>
          </div>
          <div>
            <strong>Selected Items:</strong>
            <div>Appointments: {selectedItems.appointments.length}</div>
            <div>Prescriptions: {selectedItems.prescriptions.length}</div>
            <div>Records: {selectedItems.patientRecords.length}</div>
          </div>
          <div>
            <strong>Selected Report Items:</strong>
            <div>Appointments: {selectedReport?.appointments?.length || 0}</div>
            <div>
              Prescriptions: {selectedReport?.prescriptions?.length || 0}
            </div>
            <div>Records: {selectedReport?.patientRecords?.length || 0}</div>
          </div>
        </div>
      )}

      {/* Popup */}
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
