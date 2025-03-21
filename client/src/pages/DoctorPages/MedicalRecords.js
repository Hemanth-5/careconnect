import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import doctorAPI from "../../api/doctor";
import Button from "../../components/common/Button";
import Spinner from "../../components/common/Spinner";
import Modal from "../../components/common/Modal";
import "./MedicalRecords.css";

const MedicalRecords = () => {
  const location = useLocation();
  // const navigate = useNavigate(); // Removed unused variable
  const [records, setRecords] = useState([]);
  const [myPatients, setMyPatients] = useState([]);
  const [allPatients, setAllPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showRecordModal, setShowRecordModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [patientFilter, setPatientFilter] = useState("");
  const [uploading, setUploading] = useState(false);

  // Form state for creating/editing records
  const [formData, setFormData] = useState({
    patient: "",
    recordType: "examination",
    title: "",
    description: "",
    findings: "",
    treatment: "",
    date: new Date().toISOString().split("T")[0],
    attachments: [],
  });

  // Record types for dropdown
  const recordTypes = [
    { value: "examination", label: "Physical Examination" },
    { value: "test", label: "Test Results" },
    { value: "procedure", label: "Medical Procedure" },
    { value: "consultation", label: "Consultation Notes" },
    { value: "follow-up", label: "Follow-up Visit" },
  ];

  useEffect(() => {
    fetchRecords();
    fetchPatients();

    // Check if we're being directed here with a patient ID in the query
    const queryParams = new URLSearchParams(location.search);
    const patientId = queryParams.get("patient");

    if (patientId) {
      handleOpenNewRecord(patientId);
    }
  }, [location.search]);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const response = await doctorAPI.getMedicalRecords();
      if (response && response.data) {
        setRecords(response.data || []);
      }
      setError(null);
    } catch (err) {
      console.error("Error fetching medical records:", err);
      setError("Failed to load medical records. Please try again.");
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

  const handleOpenNewRecord = (patientId = "") => {
    setSelectedRecord(null);
    setFormData({
      patient: patientId,
      recordType: "examination",
      title: "",
      description: "",
      findings: "",
      treatment: "",
      date: new Date().toISOString().split("T")[0],
      attachments: [],
    });
    setShowRecordModal(true);
  };

  const handleOpenEditRecord = (record) => {
    setSelectedRecord(record);
    setFormData({
      patient: record.patient?._id || "",
      recordType: record.recordType || "examination",
      title: record.title || "",
      description: record.description || "",
      findings: record.findings || "",
      treatment: record.treatment || "",
      date: new Date(record.date).toISOString().split("T")[0],
      attachments: record.attachments || [],
    });
    setShowRecordModal(true);
  };

  const handleViewDetails = (record) => {
    setSelectedRecord(record);
    setShowDetailsModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData({
      ...formData,
      attachments: [...formData.attachments, ...files],
    });
  };

  const handleRemoveAttachment = (index) => {
    const updatedAttachments = [...formData.attachments];
    updatedAttachments.splice(index, 1);
    setFormData({
      ...formData,
      attachments: updatedAttachments,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError(null);

      // Create FormData for file uploads if we have any
      const hasNewFiles = formData.attachments.some(
        (att) => att instanceof File
      );

      // Base record data without attachments
      const recordData = {
        patient: formData.patient,
        recordType: formData.recordType,
        title: formData.title,
        description: formData.description,
        findings: formData.findings,
        treatment: formData.treatment,
        date: formData.date,
      };

      let response;

      if (selectedRecord) {
        // Update existing record
        response = await doctorAPI.updateMedicalRecord(
          selectedRecord._id,
          recordData
        );

        // Upload any new attachments
        if (hasNewFiles) {
          setUploading(true);
          const newFiles = formData.attachments.filter(
            (att) => att instanceof File
          );

          for (const file of newFiles) {
            const attachmentFormData = new FormData();
            attachmentFormData.append("file", file);

            await doctorAPI.uploadMedicalRecordAttachment(
              selectedRecord._id,
              attachmentFormData
            );
          }
          setUploading(false);
        }

        setSuccess("Medical record updated successfully!");
      } else {
        // Create new record
        response = await doctorAPI.createMedicalRecord(recordData);

        // Upload attachments to the new record if we have any
        if (hasNewFiles && response.data && response.data._id) {
          setUploading(true);
          const newFiles = formData.attachments.filter(
            (att) => att instanceof File
          );

          for (const file of newFiles) {
            const attachmentFormData = new FormData();
            attachmentFormData.append("file", file);

            await doctorAPI.uploadMedicalRecordAttachment(
              response.data._id,
              attachmentFormData
            );
          }
          setUploading(false);
        }

        setSuccess("Medical record created successfully!");
      }

      // Refresh records
      await fetchRecords();

      // Close modal
      setShowRecordModal(false);

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error("Error saving medical record:", err);
      setError(
        selectedRecord
          ? "Failed to update medical record. Please try again."
          : "Failed to create medical record. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Function to get patient name by ID (currently unused but might be needed later)
  // const getPatientName = (patientId) => {
  //   const patient = allPatients.find((p) => p._id === patientId);
  //   return patient?.user?.fullname || "Unknown Patient";
  // };

  return (
    <div className="doctor-medical-records">
      <div className="records-header">
        <h1 className="page-title">Medical Records</h1>
        <Button variant="primary" onClick={() => handleOpenNewRecord()}>
          <i className="fas fa-plus"></i> New Record
        </Button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {loading && !records.length ? (
        <div className="loading-container">
          <Spinner center size="large" />
        </div>
      ) : records.length > 0 ? (
        <>
          <div className="filters">
            <div className="search-box">
              <i className="fas fa-search"></i>
              <input
                type="text"
                placeholder="Search records by title or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

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
                    {patient.user?.fullname || "Unknown Patient"}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="records-list">
            {records
              .filter(
                (record) =>
                  (!patientFilter || record.patient?._id === patientFilter) &&
                  (!searchTerm ||
                    record.title
                      ?.toLowerCase()
                      .includes(searchTerm.toLowerCase()) ||
                    record.description
                      ?.toLowerCase()
                      .includes(searchTerm.toLowerCase()))
              )
              .map((record) => (
                <div key={record._id} className="record-card">
                  <div className="record-card-header">
                    <div className="record-title-section">
                      <span className="record-type-badge">
                        {recordTypes.find(
                          (type) => type.value === record.recordType
                        )?.label || "Examination"}
                      </span>
                      <h3 className="record-title">{record.title}</h3>
                    </div>
                    <div className="record-date">{formatDate(record.date)}</div>
                  </div>

                  <div className="record-content">
                    <div className="record-patient">
                      <i className="fas fa-user-injured"></i>
                      {record.patient?.user?.fullname || "Unknown Patient"}
                    </div>

                    <p className="record-description">{record.description}</p>

                    {record.attachments && record.attachments.length > 0 && (
                      <div className="record-attachments">
                        <i className="fas fa-paperclip"></i>
                        {record.attachments.length} attachment(s)
                      </div>
                    )}
                  </div>

                  <div className="record-actions">
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => handleViewDetails(record)}
                    >
                      View Details
                    </Button>
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={() => handleOpenEditRecord(record)}
                    >
                      Edit
                    </Button>
                  </div>
                </div>
              ))}
          </div>
        </>
      ) : (
        <div className="placeholder-content">
          <div className="placeholder-icon">
            <i className="fas fa-file-medical-alt"></i>
          </div>
          <h2>No Medical Records Found</h2>
          <p>
            Start creating medical records for your patients to keep track of
            their health history.
          </p>
          <Button variant="primary" onClick={() => handleOpenNewRecord()}>
            Create First Record
          </Button>
        </div>
      )}

      {/* Create/Edit Record Modal */}
      {showRecordModal && (
        <Modal
          title={selectedRecord ? "Edit Medical Record" : "New Medical Record"}
          onClose={() => setShowRecordModal(false)}
          size="large"
        >
          <form onSubmit={handleSubmit} className="record-form">
            <div className="form-group">
              <label htmlFor="patient">Patient</label>
              <select
                id="patient"
                name="patient"
                value={formData.patient}
                onChange={handleInputChange}
                required
                disabled={selectedRecord}
              >
                <option value="">Select a patient</option>

                {/* For new records, show all patients */}
                {!selectedRecord && allPatients.length > 0 && (
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

                {/* For existing records, just show the current patient */}
                {selectedRecord && (
                  <option value={formData.patient}>
                    {selectedRecord.patient?.user?.fullname ||
                      "Unknown Patient"}
                  </option>
                )}
              </select>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="recordType">Record Type</label>
                <select
                  id="recordType"
                  name="recordType"
                  value={formData.recordType}
                  onChange={handleInputChange}
                  required
                >
                  {recordTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="date">Date</label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="title">Title</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g., Annual Physical Examination"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe the reason for the visit or examination"
                rows="3"
                required
              ></textarea>
            </div>

            <div className="form-group">
              <label htmlFor="findings">Findings</label>
              <textarea
                id="findings"
                name="findings"
                value={formData.findings}
                onChange={handleInputChange}
                placeholder="Document any clinical findings or observations"
                rows="3"
              ></textarea>
            </div>

            <div className="form-group">
              <label htmlFor="treatment">Treatment & Recommendations</label>
              <textarea
                id="treatment"
                name="treatment"
                value={formData.treatment}
                onChange={handleInputChange}
                placeholder="Document the treatment plan and recommendations"
                rows="3"
              ></textarea>
            </div>

            <div className="form-group">
              <label htmlFor="attachments">Attachments</label>
              <div className="file-input-container">
                <input
                  type="file"
                  id="attachments"
                  onChange={handleFileChange}
                  multiple
                  className="file-input"
                />
                <Button
                  type="button"
                  variant="outline-primary"
                  className="file-input-button"
                  onClick={() => document.getElementById("attachments").click()}
                >
                  <i className="fas fa-paperclip"></i> Attach Files
                </Button>
              </div>

              {formData.attachments.length > 0 && (
                <div className="attachments-list">
                  {formData.attachments.map((attachment, index) => (
                    <div key={index} className="attachment-item">
                      <span className="attachment-name">
                        {attachment instanceof File
                          ? attachment.name
                          : attachment.filename ||
                            attachment.url ||
                            "Attachment"}
                      </span>
                      <button
                        type="button"
                        className="remove-attachment"
                        onClick={() => handleRemoveAttachment(index)}
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="form-actions">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setShowRecordModal(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                loading={loading || uploading}
                disabled={loading || uploading}
              >
                {selectedRecord ? "Update" : "Create"} Record
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Record Details Modal */}
      {showDetailsModal && selectedRecord && (
        <Modal
          title="Medical Record Details"
          onClose={() => setShowDetailsModal(false)}
        >
          <div className="record-details">
            <div className="detail-header">
              <div className="detail-type">
                {recordTypes.find(
                  (type) => type.value === selectedRecord.recordType
                )?.label || "Examination"}
              </div>
              <div className="detail-date">
                {formatDate(selectedRecord.date)}
              </div>
            </div>

            <h2 className="detail-title">{selectedRecord.title}</h2>

            <div className="detail-patient">
              <strong>Patient:</strong>{" "}
              {selectedRecord.patient?.user?.fullname || "Unknown Patient"}
            </div>

            <div className="detail-section">
              <h3>Description</h3>
              <p>{selectedRecord.description || "No description provided"}</p>
            </div>

            <div className="detail-section">
              <h3>Findings</h3>
              <p>{selectedRecord.findings || "No findings recorded"}</p>
            </div>

            <div className="detail-section">
              <h3>Treatment & Recommendations</h3>
              <p>{selectedRecord.treatment || "No treatment plan recorded"}</p>
            </div>

            {selectedRecord.attachments &&
              selectedRecord.attachments.length > 0 && (
                <div className="detail-section">
                  <h3>Attachments</h3>
                  <div className="detail-attachments">
                    {selectedRecord.attachments.map((attachment, index) => (
                      <div key={index} className="detail-attachment">
                        <i className="fas fa-file"></i>
                        <a
                          href={attachment.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {attachment.filename || `Attachment ${index + 1}`}
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            <div className="detail-actions">
              <Button
                variant="primary"
                onClick={() => {
                  setShowDetailsModal(false);
                  handleOpenEditRecord(selectedRecord);
                }}
              >
                Edit Record
              </Button>
              <Button
                variant="outline-secondary"
                onClick={() => window.print()}
              >
                <i className="fas fa-print"></i> Print
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default MedicalRecords;
