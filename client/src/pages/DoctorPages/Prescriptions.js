import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import doctorAPI from "../../api/doctor";
import Button from "../../components/common/Button";
import Spinner from "../../components/common/Spinner";
import Modal from "../../components/common/Modal";
import Popup from "../../components/common/Popup";
import jsPDF from "jspdf";
import { saveAs } from "file-saver";
import "./Prescriptions.css";

const Prescriptions = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [prescriptions, setPrescriptions] = useState([]);
  const [myPatients, setMyPatients] = useState([]);
  const [allPatients, setAllPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [patientFilter, setPatientFilter] = useState("");

  // Form state for creating/editing prescriptions
  const [formData, setFormData] = useState({
    patient: "",
    medications: [
      { name: "", dosage: "", instructions: "", frequency: "", duration: "" },
    ],
    startDate: new Date().toISOString().split("T")[0],
    endDate: "",
    status: "active",
    notes: "",
  });

  const [popup, setPopup] = useState({
    show: false,
    message: "",
    title: "",
    type: "info",
  });

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

  useEffect(() => {
    fetchPrescriptions();
    fetchPatients();

    // Check if we're being directed here with a patient ID in the query
    const queryParams = new URLSearchParams(location.search);
    const patientId = queryParams.get("patient");

    if (patientId) {
      handleOpenNewPrescription(patientId);
    }
  }, [location.search]);

  const fetchPrescriptions = async () => {
    try {
      setLoading(true);
      const response = await doctorAPI.getPrescriptions();
      if (response && response.data) {
        setPrescriptions(response.data || []);
      }
      setError(null);
    } catch (err) {
      console.error("Error fetching prescriptions:", err);
      // setError("Failed to load prescriptions. Please try again.");
      showPopup("error", "Failed to load prescriptions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchPatients = async () => {
    try {
      // Fetch patients under doctor's care
      const myPatientsResponse = await doctorAPI.getMyPatients();
      setMyPatients(myPatientsResponse.data || []);

      // Fetch all patients in the database
      const allPatientsResponse = await doctorAPI.getAllPatients();
      setAllPatients(allPatientsResponse.data || []);
    } catch (err) {
      console.error("Error fetching patients:", err);
    }
  };

  const handleOpenNewPrescription = (patientId = "") => {
    setSelectedPrescription(null);
    setFormData({
      patient: patientId,
      medications: [
        { name: "", dosage: "", instructions: "", frequency: "", duration: "" },
      ],
      startDate: new Date().toISOString().split("T")[0],
      endDate: calculateDefaultEndDate(new Date()),
      status: "active",
      notes: "",
    });
    setShowPrescriptionModal(true);
  };

  // Calculate a default end date (7 days from start)
  const calculateDefaultEndDate = (startDate) => {
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 7);
    return endDate.toISOString().split("T")[0];
  };

  const handleOpenEditPrescription = (prescription) => {
    setSelectedPrescription(prescription);
    // console.log(prescription);

    // Format dates for the form
    const startDate = prescription.startDate
      ? new Date(prescription.startDate).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0];
    const endDate = prescription.endDate
      ? new Date(prescription.endDate).toISOString().split("T")[0]
      : "";

    setFormData({
      patient: prescription.patient?._id || "",
      medications:
        prescription.medications && prescription.medications.length > 0
          ? prescription.medications
          : [
              {
                name: "",
                dosage: "",
                instructions: "",
                frequency: "",
                duration: "",
              },
            ],
      startDate,
      endDate,
      status: prescription.status || "active",
      notes: prescription.notes || "",
    });
    setShowPrescriptionModal(true);
  };

  const handleViewDetails = (prescription) => {
    setSelectedPrescription(prescription);
    setShowDetailsModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleMedicationChange = (index, field, value) => {
    const newMedications = [...formData.medications];
    newMedications[index][field] = value;
    setFormData({
      ...formData,
      medications: newMedications,
    });
  };

  const handleAddMedication = () => {
    setFormData({
      ...formData,
      medications: [
        ...formData.medications,
        { name: "", dosage: "", instructions: "", frequency: "", duration: "" },
      ],
    });
  };

  const handleRemoveMedication = (index) => {
    if (formData.medications.length === 1) {
      return; // Don't remove if it's the only medication
    }
    const newMedications = [...formData.medications];
    newMedications.splice(index, 1);
    setFormData({
      ...formData,
      medications: newMedications,
    });
  };

  const validateForm = () => {
    // Check patient selection
    if (!formData.patient) {
      // setError("Please select a patient");
      showPopup("error", "Please select a patient");
      return false;
    }

    // Check medication entries
    for (const medication of formData.medications) {
      if (!medication.name || !medication.dosage) {
        // setError("Please provide name and dosage for all medications");
        showPopup(
          "error",
          "Please provide name and dosage for all medications"
        );
        return false;
      }
    }

    // Check dates
    if (!formData.startDate) {
      // setError("Please provide a start date");
      showPopup("error", "Please provide a start date");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setActionLoading(true);
      setError(null);

      const prescriptionData = {
        ...formData,
        startDate: new Date(formData.startDate).toISOString(),
        endDate: formData.endDate
          ? new Date(formData.endDate).toISOString()
          : null,
      };

      let response;

      if (selectedPrescription) {
        // Update existing prescription
        response = await doctorAPI.updatePrescription(
          selectedPrescription._id,
          prescriptionData
        );
        // setSuccess("Prescription updated successfully!");
        showPopup("success", "Prescription updated successfully!");
      } else {
        // Create new prescription
        response = await doctorAPI.createPrescription(prescriptionData);
        // setSuccess("Prescription created successfully!");
        showPopup("success", "Prescription created successfully!");
      }

      // Refresh prescriptions
      fetchPrescriptions();

      // Close modal
      setShowPrescriptionModal(false);

      // Clear success message after 3 seconds
      // setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error("Error saving prescription:", err);
      // setError(
      //   err.response?.data?.message ||
      //     (selectedPrescription
      //       ? "Failed to update prescription. Please try again."
      //       : "Failed to create prescription. Please try again.")
      // );
      showPopup(
        "error",
        err.response?.data?.message ||
          (selectedPrescription
            ? "Failed to update prescription. Please try again."
            : "Failed to create prescription. Please try again.")
      );
    } finally {
      setActionLoading(false);
    }
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

  // Generate a PDF prescription with jsPDF instead of pdf-lib
  const generatePrescriptionPDF = async (prescription) => {
    try {
      setActionLoading(true);

      // Create a new jsPDF instance
      const doc = new jsPDF();

      // Define variables for positioning
      const margin = 20;
      let y = 20;
      const lineHeight = 10;

      // Add title
      doc.setFont("helvetica", "bold");
      doc.setFontSize(18);
      doc.setTextColor(0, 102, 102); // Teal color
      doc.text("CARE CONNECT", margin, y);
      y += lineHeight * 2;

      // Add prescription header
      doc.setFontSize(16);
      doc.setTextColor(0, 0, 0);
      doc.text("PRESCRIPTION", margin, y);
      y += lineHeight * 1.5;

      // Patient information
      doc.setFont("helvetica", "normal");
      doc.setFontSize(12);
      doc.text(
        `Patient: ${
          prescription.patient?.user?.fullname ||
          prescription.patient?.user?.username ||
          "Unknown Patient"
        }`,
        margin,
        y
      );
      y += lineHeight;

      // Date information
      doc.text(`Date: ${formatDate(prescription.startDate)}`, margin, y);
      y += lineHeight;

      if (prescription.endDate) {
        doc.text(`End Date: ${formatDate(prescription.endDate)}`, margin, y);
        y += lineHeight;
      }

      y += lineHeight;

      // Medications header
      doc.setFont("helvetica", "bold");
      doc.text("MEDICATIONS", margin, y);
      y += lineHeight;

      // List all medications
      doc.setFont("helvetica", "normal");
      prescription.medications?.forEach((med, index) => {
        doc.text(`${index + 1}. ${med.name} - ${med.dosage}`, margin, y);
        y += lineHeight;

        if (med.frequency) {
          doc.text(`   Frequency: ${med.frequency}`, margin, y);
          y += lineHeight;
        }

        if (med.duration) {
          doc.text(`   Duration: ${med.duration}`, margin, y);
          y += lineHeight;
        }

        if (med.instructions) {
          doc.text(`   Instructions: ${med.instructions}`, margin, y);
          y += lineHeight;
        }

        y += lineHeight / 2; // Add space between medications

        // Check if we need a new page
        if (y > 270) {
          doc.addPage();
          y = 20;
        }
      });

      // Add notes if any
      if (prescription.notes) {
        doc.setFont("helvetica", "bold");
        doc.text("Notes:", margin, y);
        y += lineHeight;

        doc.setFont("helvetica", "normal");
        // Split notes by newlines to properly display them
        const notes = prescription.notes.split("\n");
        notes.forEach((line) => {
          doc.text(line, margin, y);
          y += lineHeight;

          // Check if we need a new page
          if (y > 270) {
            doc.addPage();
            y = 20;
          }
        });
      }

      // Doctor signature
      y += lineHeight;
      doc.text("Dr. Signature: ______________________", margin, y);

      // Save the PDF
      const patientName = prescription.patient?.user?.fullname || "patient";
      const date = formatDate(prescription.startDate)
        .replace(/,/g, "")
        .replace(/ /g, "-");

      const pdfBlob = doc.output("blob");
      saveAs(pdfBlob, `prescription_${patientName}_${date}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      // setError("Failed to generate PDF. Please try again.");
      showPopup("error", "Failed to generate PDF. Please try again.");
    } finally {
      setActionLoading(false);
    }
  };

  // Filter prescriptions based on search term and patient filter
  const filteredPrescriptions = prescriptions.filter((prescription) => {
    const patientName =
      prescription.patient?.user?.fullname ||
      prescription.patient?.user?.username ||
      "";
    const patientId = prescription.patient?._id || "";
    const searchValue = searchTerm.toLowerCase();

    const matchesSearch = patientName.toLowerCase().includes(searchValue);
    const matchesPatientFilter = !patientFilter || patientId === patientFilter;

    return matchesSearch && matchesPatientFilter;
  });

  // Get patient name by ID
  const getPatientName = (patientId) => {
    const patient = allPatients.find((p) => p._id === patientId);
    return (
      patient?.user?.fullname || patient?.user?.username || "Unknown Patient"
    );
  };

  // Render status badge based on status
  const renderStatusBadge = (status) => {
    let className;
    switch (status) {
      case "active":
        className = "status-badge status-active";
        break;
      case "completed":
        className = "status-badge status-completed";
        break;
      case "expired":
        className = "status-badge status-expired";
        break;
      default:
        className = "status-badge";
    }

    return <span className={className}>{status}</span>;
  };

  return (
    <div className="doctor-prescriptions">
      <div className="prescriptions-header">
        <h1 className="page-title">Prescriptions</h1>
        <div className="header-actions">
          <div className="search-box">
            <i className="fas fa-search"></i>
            <input
              type="text"
              placeholder="Search by patient name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button
            variant="outline-primary"
            onClick={() => handleOpenNewPrescription()}
          >
            <i className="fas fa-plus"></i> New Prescription
          </Button>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {loading && !prescriptions.length ? (
        <div className="loading-container">
          <Spinner center size="large" />
        </div>
      ) : (
        <>
          {/* Filter bar */}
          {prescriptions.length > 0 && (
            <div className="filter-bar">
              <div className="filter-select">
                <label htmlFor="patientFilter">Filter by patient:</label>
                <select
                  id="patientFilter"
                  value={patientFilter}
                  onChange={(e) => setPatientFilter(e.target.value)}
                >
                  <option value="">All Patients</option>
                  {myPatients.map((patient) => (
                    <option key={patient._id} value={patient._id}>
                      {patient.user?.fullname ||
                        patient.user?.username ||
                        "Unknown Patient"}
                    </option>
                  ))}
                </select>
              </div>

              <div className="filter-select">
                <label htmlFor="statusFilter">Filter by status:</label>
                <select
                  id="statusFilter"
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                >
                  <option value="">All Statuses</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="expired">Expired</option>
                </select>
              </div>
            </div>
          )}

          <div className="prescriptions-list">
            {filteredPrescriptions.length > 0 ? (
              <table className="prescriptions-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Patient</th>
                    <th>Medications</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPrescriptions.map((prescription) => (
                    <tr key={prescription._id}>
                      <td className="date-cell">
                        {formatDate(prescription.startDate)}
                      </td>
                      <td className="patient-cell">
                        {prescription.patient?.user?.fullname ||
                          prescription.patient?.user?.username ||
                          "Unknown Patient"}
                      </td>
                      <td className="medications-cell">
                        {prescription.medications?.length > 0 ? (
                          <ul className="medications-list">
                            {prescription.medications
                              .slice(0, 2)
                              .map((med, index) => (
                                <li key={index}>
                                  {med.name} - {med.dosage}
                                </li>
                              ))}
                            {prescription.medications.length > 2 && (
                              <li className="more-medications">
                                {prescription.medications.length - 2} more...
                              </li>
                            )}
                          </ul>
                        ) : (
                          <span className="no-data">No medications listed</span>
                        )}
                      </td>
                      <td className="status-cell">
                        {renderStatusBadge(prescription.status || "active")}
                      </td>
                      <td className="actions-cell">
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => handleViewDetails(prescription)}
                        >
                          View
                        </Button>
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          onClick={() =>
                            handleOpenEditPrescription(prescription)
                          }
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outline-info"
                          size="sm"
                          onClick={() => generatePrescriptionPDF(prescription)}
                          loading={actionLoading}
                        >
                          <i className="fas fa-file-pdf"></i>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="no-prescriptions">
                <i className="fas fa-prescription-bottle-alt"></i>
                <p>
                  No prescriptions found
                  {searchTerm ? " matching your search criteria" : ""}.
                </p>
                <Button
                  variant="outline-primary"
                  onClick={() => handleOpenNewPrescription()}
                >
                  Create First Prescription
                </Button>
              </div>
            )}
          </div>
        </>
      )}

      {/* Create/Edit Prescription Modal */}
      {showPrescriptionModal && (
        <Modal
          title={
            selectedPrescription ? "Edit Prescription" : "New Prescription"
          }
          onClose={() => setShowPrescriptionModal(false)}
          size="large"
        >
          <form onSubmit={handleSubmit} className="prescription-form">
            <div className="form-group">
              <label htmlFor="patient">Patient</label>
              <select
                id="patient"
                name="patient"
                value={formData.patient}
                onChange={handleInputChange}
                required
                disabled={selectedPrescription}
              >
                <option value="">Select a patient</option>

                {/* For new prescriptions, show all patients */}
                {!selectedPrescription && allPatients.length > 0 && (
                  <>
                    {/* If we have patients under care, group them first */}
                    {myPatients.length > 0 && (
                      <optgroup label="My Patients">
                        {myPatients.map((patient) => (
                          <option key={`my-${patient._id}`} value={patient._id}>
                            {patient.user?.fullname ||
                              patient.user?.username ||
                              "Unknown"}
                          </option>
                        ))}
                      </optgroup>
                    )}

                    {/* Show other patients not under care */}
                    <optgroup label="Other Patients">
                      {allPatients
                        .filter(
                          (patient) =>
                            !myPatients.some(
                              (myPatient) => myPatient._id === patient._id
                            )
                        )
                        .map((patient) => (
                          <option
                            key={`other-${patient._id}`}
                            value={patient._id}
                          >
                            {patient.user?.fullname ||
                              patient.user?.username ||
                              "Unknown"}
                          </option>
                        ))}
                    </optgroup>
                  </>
                )}

                {/* For existing prescriptions, just show the current patient */}
                {selectedPrescription && (
                  <option value={formData.patient}>
                    {selectedPrescription.patient?.user?.fullname ||
                      selectedPrescription.patient?.user?.username ||
                      "Unknown Patient"}
                  </option>
                )}
              </select>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="startDate">Start Date</label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="endDate">End Date</label>
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  min={formData.startDate}
                />
              </div>

              <div className="form-group">
                <label htmlFor="status">Status</label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  required
                >
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="expired">Expired</option>
                </select>
              </div>
            </div>

            <div className="medications-section">
              <div className="section-header">
                <h3>Medications</h3>
                <Button
                  type="button"
                  variant="outline-primary"
                  size="sm"
                  onClick={handleAddMedication}
                >
                  <i className="fas fa-plus"></i> Add Medication
                </Button>
              </div>

              {formData.medications.map((medication, index) => (
                <div key={index} className="medication-item">
                  <div className="medication-header">
                    <h4>Medication #{index + 1}</h4>
                    {formData.medications.length > 1 && (
                      <button
                        type="button"
                        className="remove-medication"
                        onClick={() => handleRemoveMedication(index)}
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    )}
                  </div>

                  <div className="medication-form">
                    <div className="form-group">
                      <label htmlFor={`medication-name-${index}`}>Name</label>
                      <input
                        type="text"
                        id={`medication-name-${index}`}
                        value={medication.name}
                        onChange={(e) =>
                          handleMedicationChange(index, "name", e.target.value)
                        }
                        placeholder="Medication name"
                        required
                      />
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor={`medication-dosage-${index}`}>
                          Dosage
                        </label>
                        <input
                          type="text"
                          id={`medication-dosage-${index}`}
                          value={medication.dosage}
                          onChange={(e) =>
                            handleMedicationChange(
                              index,
                              "dosage",
                              e.target.value
                            )
                          }
                          placeholder="e.g., 500mg"
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor={`medication-frequency-${index}`}>
                          Frequency
                        </label>
                        <input
                          type="text"
                          id={`medication-frequency-${index}`}
                          value={medication.frequency}
                          onChange={(e) =>
                            handleMedicationChange(
                              index,
                              "frequency",
                              e.target.value
                            )
                          }
                          placeholder="e.g., twice daily"
                        />
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor={`medication-duration-${index}`}>
                          Duration
                        </label>
                        <input
                          type="text"
                          id={`medication-duration-${index}`}
                          value={medication.duration}
                          onChange={(e) =>
                            handleMedicationChange(
                              index,
                              "duration",
                              e.target.value
                            )
                          }
                          placeholder="e.g., 7 days"
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor={`medication-instructions-${index}`}>
                          Instructions
                        </label>
                        <input
                          type="text"
                          id={`medication-instructions-${index}`}
                          value={medication.instructions}
                          onChange={(e) =>
                            handleMedicationChange(
                              index,
                              "instructions",
                              e.target.value
                            )
                          }
                          placeholder="e.g., Take with food"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="form-group">
              <label htmlFor="notes">Notes & Instructions</label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="Special instructions or notes for the patient"
                rows="4"
              ></textarea>
            </div>

            <div className="form-actions">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setShowPrescriptionModal(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="outline-primary"
                loading={actionLoading}
                disabled={actionLoading}
              >
                {selectedPrescription ? "Update" : "Create"} Prescription
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Prescription Details Modal */}
      {showDetailsModal && selectedPrescription && (
        <Modal
          title="Prescription Details"
          onClose={() => setShowDetailsModal(false)}
          size="medium"
        >
          <div className="prescription-details">
            <div className="details-header">
              <div className="detail-group">
                <h3>Patient</h3>
                <p className="detail-value">
                  {selectedPrescription.patient?.user?.fullname ||
                    selectedPrescription.patient?.user?.username ||
                    "Unknown Patient"}
                </p>
              </div>

              <div className="detail-group">
                <h3>Status</h3>
                <p className="detail-value">
                  {renderStatusBadge(selectedPrescription.status || "active")}
                </p>
              </div>
            </div>

            <div className="details-dates">
              <div className="detail-group">
                <h3>Start Date</h3>
                <p className="detail-value">
                  {formatDate(selectedPrescription.startDate)}
                </p>
              </div>

              {selectedPrescription.endDate && (
                <div className="detail-group">
                  <h3>End Date</h3>
                  <p className="detail-value">
                    {formatDate(selectedPrescription.endDate)}
                  </p>
                </div>
              )}
            </div>

            <div className="detail-group">
              <h3>Medications</h3>
              {selectedPrescription.medications &&
              selectedPrescription.medications.length > 0 ? (
                <div className="detailed-medications">
                  {selectedPrescription.medications.map((medication, index) => (
                    <div key={index} className="medication-detail">
                      <h4>{medication.name}</h4>
                      <div className="medication-info">
                        <p>
                          <strong>Dosage:</strong> {medication.dosage}
                        </p>
                        {medication.frequency && (
                          <p>
                            <strong>Frequency:</strong> {medication.frequency}
                          </p>
                        )}
                        {medication.duration && (
                          <p>
                            <strong>Duration:</strong> {medication.duration}
                          </p>
                        )}
                        {medication.instructions && (
                          <p>
                            <strong>Instructions:</strong>{" "}
                            {medication.instructions}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="no-data">No medications listed</p>
              )}
            </div>

            {selectedPrescription.notes && (
              <div className="detail-group">
                <h3>Notes & Instructions</h3>
                <p className="detail-value notes">
                  {selectedPrescription.notes}
                </p>
              </div>
            )}

            <div className="detail-group">
              <h3>Prescription ID</h3>
              <p className="detail-value id">{selectedPrescription._id}</p>
            </div>

            <div className="modal-actions">
              <Button
                variant="outline-primary"
                onClick={() => {
                  setShowDetailsModal(false);
                  handleOpenEditPrescription(selectedPrescription);
                }}
              >
                Edit Prescription
              </Button>
              <Button
                variant="outline-info"
                onClick={() => generatePrescriptionPDF(selectedPrescription)}
                loading={actionLoading}
                disabled={actionLoading}
              >
                <i className="fas fa-file-pdf"></i> Generate PDF
              </Button>
            </div>
          </div>
        </Modal>
      )}
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

export default Prescriptions;
