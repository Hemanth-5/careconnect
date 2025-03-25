import React, { useState, useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import doctorAPI from "../../api/doctor";
import Button from "../../components/common/Button";
import Spinner from "../../components/common/Spinner";
import Modal from "../../components/common/Modal";
import Popup from "../../components/common/Popup";
import "./MedicalRecords.css";

const MedicalRecords = () => {
  const location = useLocation();
  const [records, setRecords] = useState([]);
  const [myPatients, setMyPatients] = useState([]);
  const [allPatients, setAllPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showRecordModal, setShowRecordModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [patientFilter, setPatientFilter] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Added states for handling multiple patient records
  const [patientRecords, setPatientRecords] = useState([]);
  const [showPatientRecordsModal, setShowPatientRecordsModal] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState(null);
  const [selectedPatientName, setSelectedPatientName] = useState("");

  // Popup notification state
  const [popup, setPopup] = useState({
    show: false,
    message: "",
    title: "",
    type: "info",
  });

  // Form state aligned with server PatientRecord model
  const [formData, setFormData] = useState({
    patient: "",
    records: [
      {
        recordType: "examination",
        diagnosis: "",
        title: "",
        description: "",
        treatmentProgress: "",
        findings: "",
        treatment: "",
        notes: "",
        date: new Date().toISOString().split("T")[0],
        attachments: [],
      },
    ],
  });

  // Record types for dropdown
  const recordTypes = [
    { value: "examination", label: "Physical Examination" },
    { value: "test", label: "Test Results" },
    { value: "procedure", label: "Medical Procedure" },
    { value: "consultation", label: "Consultation Notes" },
    { value: "follow-up", label: "Follow-up Visit" },
  ];

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
        setRecords(response.data);
      }
      setError(null);
    } catch (err) {
      console.error("Error fetching medical records:", err);
      showPopup("error", "Failed to load medical records. Please try again.");
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
      showPopup("error", "Failed to load patient list. Please try again.");
    }
  };

  const handleViewPatientRecords = (patientId, patientName) => {
    setSelectedPatientId(patientId);
    setSelectedPatientName(patientName);

    // Filter records for this patient
    const filteredRecords = records.filter(
      (record) => record.patient?._id === patientId
    );
    setPatientRecords(filteredRecords);
    setShowPatientRecordsModal(true);
  };

  const handleOpenNewRecord = (patientId = "") => {
    setSelectedRecord(null);
    // Reset form data to align with server PatientRecord model
    setFormData({
      patient: patientId,
      records: [
        {
          recordType: "examination",
          diagnosis: "",
          title: "",
          description: "",
          treatmentProgress: "",
          findings: "",
          treatment: "",
          notes: "",
          date: new Date().toISOString().split("T")[0],
          attachments: [],
        },
      ],
    });
    setShowRecordModal(true);
  };

  const handleOpenEditRecord = (record) => {
    setSelectedRecord(record);

    // Format for editing to match PatientRecord model with proper nested fields
    // Get the first record from the records array
    const recordData =
      record.records && record.records.length > 0 ? record.records[0] : {};

    setFormData({
      patient: record.patient?._id || "",
      records: [
        {
          recordType: recordData.recordType || "examination",
          diagnosis: recordData.diagnosis || "",
          title: recordData.title || "",
          description: recordData.description || "",
          treatmentProgress: recordData.treatmentProgress || "",
          findings: recordData.findings || "",
          treatment: recordData.treatment || "",
          notes: recordData.notes || "",
          date: recordData.date
            ? new Date(recordData.date).toISOString().split("T")[0]
            : new Date().toISOString().split("T")[0],
          attachments: recordData.attachments || [],
        },
      ],
    });
    setShowRecordModal(true);
  };

  const handleViewDetails = (record) => {
    setSelectedRecord(record);
    setShowDetailsModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Handle nested records array
    if (name.includes("records.")) {
      const fieldName = name.split(".")[1];
      const updatedRecords = [...formData.records];
      updatedRecords[0][fieldName] = value;

      setFormData({
        ...formData,
        records: updatedRecords,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const updatedRecords = [...formData.records];
    updatedRecords[0].attachments = [
      ...(updatedRecords[0].attachments || []),
      ...files,
    ];

    setFormData({
      ...formData,
      records: updatedRecords,
    });
  };

  const handleRemoveAttachment = (index) => {
    const updatedRecords = [...formData.records];
    const updatedAttachments = [...updatedRecords[0].attachments];
    updatedAttachments.splice(index, 1);
    updatedRecords[0].attachments = updatedAttachments;

    setFormData({
      ...formData,
      records: updatedRecords,
    });
  };

  const validateForm = () => {
    // Basic validation
    if (!formData.patient) {
      showPopup("error", "Please select a patient");
      return false;
    }

    if (!formData.records[0].title.trim()) {
      showPopup("error", "Record title is required");
      return false;
    }

    if (!formData.records[0].description.trim()) {
      showPopup("error", "Description is required");
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
      setSaving(true);

      // Prepare the data for the API
      const recordData = {
        patient: formData.patient,
        records: [
          {
            recordType: formData.records[0].recordType,
            title: formData.records[0].title,
            date: formData.records[0].date,
            description: formData.records[0].description,
            diagnosis: formData.records[0].diagnosis,
            treatmentProgress: formData.records[0].treatmentProgress,
            findings: formData.records[0].findings,
            treatment: formData.records[0].treatment,
            notes: formData.records[0].notes,
          },
        ],
      };

      // If this is an edit, use update API, otherwise create new
      let response;
      if (selectedRecord) {
        response = await doctorAPI.updatePatientRecord(
          selectedRecord._id,
          recordData
        );
        showPopup("success", "Medical record updated successfully");
      } else {
        response = await doctorAPI.createPatientRecord(recordData);
        showPopup("success", "Medical record created successfully");
      }

      // On success
      setShowRecordModal(false);
      fetchRecords(); // Refresh records list

      // Reset form
      setFormData({
        patient: "",
        records: [
          {
            recordType: "examination",
            title: "",
            date: new Date().toISOString().split("T")[0],
            description: "",
            diagnosis: "",
            treatmentProgress: "",
            findings: "",
            treatment: "",
            notes: "",
            attachments: [],
          },
        ],
      });

      // If we're in the patient records modal, refresh that view too
      if (showPatientRecordsModal && selectedPatientId) {
        const updatedPatientRecords = records.filter(
          (record) => record.patient?._id === selectedPatientId
        );
        setPatientRecords(updatedPatientRecords);
      }
    } catch (err) {
      console.error("Error saving medical record:", err);
      showPopup(
        "error",
        err.response?.data?.message ||
          "Failed to save medical record. Please try again."
      );
    } finally {
      setSaving(false);
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

  // Get patient name by ID (for display purposes)
  const getPatientName = (patientId) => {
    const patient = allPatients.find((p) => p._id === patientId);
    return patient?.user?.fullname || "Unknown Patient";
  };

  // Get record type label
  const getRecordTypeLabel = (type) => {
    if (!type && selectedRecord?.records && selectedRecord.records.length > 0) {
      type = selectedRecord.records[0].recordType;
    }
    const recordType = recordTypes.find((item) => item.value === type);
    return recordType ? recordType.label : "Examination";
  };

  // Helper function to get value from the first record in the records array
  const getRecordValue = (record, fieldName, defaultValue = "N/A") => {
    if (record?.records && record.records.length > 0) {
      return record.records[0][fieldName] || defaultValue;
    }
    return defaultValue;
  };

  // Filter records to show unique patients with their most recent record
  const uniquePatientRecords = useMemo(() => {
    const patientMap = new Map();

    records.forEach((record) => {
      const patientId = record.patient?._id;
      if (patientId) {
        if (
          !patientMap.has(patientId) ||
          new Date(record.createdAt) >
            new Date(patientMap.get(patientId).createdAt)
        ) {
          patientMap.set(patientId, record);
        }
      }
    });

    return Array.from(patientMap.values());
  }, [records]);

  // Filter unique patient records based on search and patient filter
  const filteredUniqueRecords = uniquePatientRecords.filter((record) => {
    const patientName = record.patient?.user?.fullname || "";
    const recordTitle = getRecordValue(record, "title", "");
    const recordDescription = getRecordValue(record, "description", "");

    const matchesSearch =
      !searchTerm ||
      patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recordTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recordDescription.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesPatient =
      !patientFilter || record.patient?._id === patientFilter;

    return matchesSearch && matchesPatient;
  });

  return (
    <div className="doctor-medical-records">
      <div className="records-header">
        <h1 className="page-title">Medical Records</h1>
        <Button variant="outline-primary" onClick={() => handleOpenNewRecord()}>
          <i className="fas fa-plus"></i> New Record
        </Button>
      </div>

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
                placeholder="Search patient name, record title or description..."
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
                    {patient.user?.fullname ||
                      patient.user?.username ||
                      "Unknown Patient"}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="records-list">
            {filteredUniqueRecords.length > 0 ? (
              filteredUniqueRecords.map((record) => {
                const recordData =
                  record.records && record.records.length > 0
                    ? record.records[0]
                    : {};

                // Count how many records this patient has
                const recordCount = records.filter(
                  (r) => r.patient?._id === record.patient?._id
                ).length;

                return (
                  <div key={record._id} className="record-card">
                    <div className="record-card-header">
                      <div className="record-title-section">
                        <span className="record-type-badge">
                          {getRecordTypeLabel(recordData.recordType)}
                        </span>
                        <h3 className="record-title">
                          {recordData.title || "Untitled Record"}
                        </h3>
                      </div>
                      <div className="record-date">
                        {formatDate(recordData.date || record.createdAt)}
                      </div>
                    </div>

                    <div className="record-content">
                      <div className="record-patient">
                        <i className="fas fa-user-injured"></i>
                        {record.patient?.user?.fullname || "Unknown Patient"}
                        {recordCount > 1 && (
                          <span className="record-count">
                            <span className="record-badge">
                              {recordCount} records
                            </span>
                          </span>
                        )}
                      </div>

                      <p className="record-description">
                        {recordData.description || "No description provided"}
                      </p>

                      {recordCount > 1 && (
                        <div className="view-all-records">
                          <Button
                            variant="text"
                            size="sm"
                            onClick={() =>
                              handleViewPatientRecords(
                                record.patient?._id,
                                record.patient?.user?.fullname ||
                                  "Unknown Patient"
                              )
                            }
                          >
                            <i className="fas fa-clipboard-list"></i> View all{" "}
                            {recordCount} records
                          </Button>
                        </div>
                      )}
                    </div>

                    <div className="record-actions">
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => handleViewDetails(record)}
                      >
                        <i className="fas fa-eye"></i> View Details
                      </Button>
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={() => handleOpenNewRecord(record.patient?._id)}
                      >
                        <i className="fas fa-plus"></i> Add Record
                      </Button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="no-records-found">
                <i className="fas fa-search"></i>
                <p>No records match your search criteria.</p>
                <Button
                  variant="outline-primary"
                  onClick={() => {
                    setSearchTerm("");
                    setPatientFilter("");
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            )}
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
          <Button
            variant="outline-primary"
            onClick={() => handleOpenNewRecord()}
          >
            <i className="fas fa-plus-circle"></i> Create First Record
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
              <label htmlFor="patient">
                Patient <span className="required">*</span>
              </label>
              <select
                id="patient"
                name="patient"
                value={formData.patient}
                onChange={handleInputChange}
                required
                disabled={selectedRecord}
                className={!formData.patient ? "highlight-required" : ""}
              >
                <option value="">Select a patient</option>

                {/* Group patients by "My Patients" and "Other Patients" */}
                {myPatients.length > 0 && (
                  <optgroup label="My Patients">
                    {myPatients.map((patient) => (
                      <option key={`my-${patient._id}`} value={patient._id}>
                        {patient.user?.fullname ||
                          patient.user?.username ||
                          "Unknown Patient"}
                      </option>
                    ))}
                  </optgroup>
                )}

                {/* Show other patients not under care */}
                {allPatients.length > 0 && (
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
                            "Unknown Patient"}
                        </option>
                      ))}
                  </optgroup>
                )}
              </select>
              {!formData.patient && (
                <small className="form-tip">
                  Please select a patient for this record
                </small>
              )}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="records.recordType">Record Type</label>
                <select
                  id="records.recordType"
                  name="records.recordType"
                  value={formData.records[0].recordType}
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
                <label htmlFor="records.date">Date</label>
                <input
                  type="date"
                  id="records.date"
                  name="records.date"
                  value={formData.records[0].date}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="records.title">
                Title <span className="required">*</span>
              </label>
              <input
                type="text"
                id="records.title"
                name="records.title"
                value={formData.records[0].title}
                onChange={handleInputChange}
                placeholder="e.g., Annual Physical Examination"
                required
                className={
                  !formData.records[0].title ? "highlight-required" : ""
                }
              />
            </div>

            <div className="form-group">
              <label htmlFor="records.description">
                Description <span className="required">*</span>
              </label>
              <textarea
                id="records.description"
                name="records.description"
                value={formData.records[0].description}
                onChange={handleInputChange}
                placeholder="Describe the reason for the visit or examination"
                rows="3"
                required
                className={
                  !formData.records[0].description ? "highlight-required" : ""
                }
              ></textarea>
            </div>

            <div className="form-group">
              <label htmlFor="records.diagnosis">Diagnosis</label>
              <textarea
                id="records.diagnosis"
                name="records.diagnosis"
                value={formData.records[0].diagnosis}
                onChange={handleInputChange}
                placeholder="Enter diagnosis if applicable"
                rows="3"
              ></textarea>
            </div>

            <div className="form-group">
              <label htmlFor="records.findings">Findings</label>
              <textarea
                id="records.findings"
                name="records.findings"
                value={formData.records[0].findings}
                onChange={handleInputChange}
                placeholder="Document examination findings"
                rows="3"
              ></textarea>
            </div>

            <div className="form-group">
              <label htmlFor="records.treatment">Treatment Plan</label>
              <textarea
                id="records.treatment"
                name="records.treatment"
                value={formData.records[0].treatment}
                onChange={handleInputChange}
                placeholder="Recommended treatment plan"
                rows="3"
              ></textarea>
            </div>

            <div className="form-group">
              <label htmlFor="records.treatmentProgress">
                Treatment Progress
              </label>
              <textarea
                id="records.treatmentProgress"
                name="records.treatmentProgress"
                value={formData.records[0].treatmentProgress}
                onChange={handleInputChange}
                placeholder="Document the treatment progress"
                rows="3"
              ></textarea>
            </div>

            <div className="form-group">
              <label htmlFor="records.notes">Additional Notes</label>
              <textarea
                id="records.notes"
                name="records.notes"
                value={formData.records[0].notes}
                onChange={handleInputChange}
                placeholder="Any additional notes"
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

              {formData.records[0].attachments.length > 0 && (
                <div className="attachments-list">
                  {formData.records[0].attachments.map((attachment, index) => (
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
                disabled={saving}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="outline-primary"
                loading={saving}
                disabled={saving}
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
            {(() => {
              // Get the first record from the records array
              const recordData =
                selectedRecord.records && selectedRecord.records.length > 0
                  ? selectedRecord.records[0]
                  : {};

              return (
                <>
                  <div className="detail-header">
                    <div className="detail-type">
                      {getRecordTypeLabel(recordData.recordType)}
                    </div>
                    <div className="detail-date">
                      {formatDate(recordData.date || selectedRecord.createdAt)}
                    </div>
                  </div>

                  <h2 className="detail-title">
                    {recordData.title || "Untitled Record"}
                  </h2>

                  <div className="detail-patient">
                    <strong>Patient:</strong>{" "}
                    {selectedRecord.patient?.user?.fullname ||
                      "Unknown Patient"}
                  </div>

                  <div className="detail-doctor">
                    <strong>Doctor:</strong>{" "}
                    {selectedRecord.doctor?.user?.fullname || "Unknown Doctor"}
                  </div>

                  <div className="detail-section">
                    <h3>
                      <i className="fas fa-clipboard"></i> Description
                    </h3>
                    <p>{recordData.description || "No description provided"}</p>
                  </div>

                  <div className="detail-section">
                    <h3>
                      <i className="fas fa-stethoscope"></i> Diagnosis
                    </h3>
                    <p>{recordData.diagnosis || "No diagnosis recorded"}</p>
                  </div>

                  <div className="detail-section">
                    <h3>
                      <i className="fas fa-search"></i> Findings
                    </h3>
                    <p>{recordData.findings || "No findings recorded"}</p>
                  </div>

                  <div className="detail-section">
                    <h3>
                      <i className="fas fa-pills"></i> Treatment Plan
                    </h3>
                    <p>
                      {recordData.treatment || "No treatment plan recorded"}
                    </p>
                  </div>

                  <div className="detail-section">
                    <h3>
                      <i className="fas fa-chart-line"></i> Treatment Progress
                    </h3>
                    <p>
                      {recordData.treatmentProgress || "No progress recorded"}
                    </p>
                  </div>

                  <div className="detail-section">
                    <h3>
                      <i className="fas fa-sticky-note"></i> Additional Notes
                    </h3>
                    <p>{recordData.notes || "No additional notes recorded"}</p>
                  </div>

                  {recordData.attachments &&
                    recordData.attachments.length > 0 && (
                      <div className="detail-section">
                        <h3>
                          <i className="fas fa-paperclip"></i> Attachments
                        </h3>
                        <div className="detail-attachments">
                          {recordData.attachments.map((attachment, index) => (
                            <div key={index} className="detail-attachment">
                              <i className="fas fa-file"></i>
                              <a
                                href={attachment.url}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {attachment.filename ||
                                  `Attachment ${index + 1}`}
                              </a>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                </>
              );
            })()}

            <div className="detail-actions">
              <Button
                variant="outline-primary"
                onClick={() => {
                  setShowDetailsModal(false);
                  handleOpenEditRecord(selectedRecord);
                }}
              >
                <i className="fas fa-edit"></i> Edit Record
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

      {/* Patient Records Modal - Shows all records for a single patient */}
      {showPatientRecordsModal && selectedPatientId && (
        <Modal
          title={`Medical Records for ${selectedPatientName}`}
          onClose={() => setShowPatientRecordsModal(false)}
          size="large"
        >
          <div className="patient-records-list">
            <div className="patient-records-header">
              <p>
                <i className="fas fa-folder-open"></i>
                Showing {patientRecords.length} record
                {patientRecords.length !== 1 ? "s" : ""} for this patient
              </p>
              <Button
                variant="outline-primary"
                size="sm"
                onClick={() => {
                  setShowPatientRecordsModal(false);
                  handleOpenNewRecord(selectedPatientId);
                }}
              >
                <i className="fas fa-plus"></i> Add New Record
              </Button>
            </div>

            {patientRecords.length > 0 ? (
              <div className="timeline-records">
                {patientRecords
                  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                  .map((record, index) => {
                    const recordData =
                      record.records && record.records.length > 0
                        ? record.records[0]
                        : {};

                    return (
                      <div key={record._id} className="timeline-record-item">
                        <div className="timeline-marker">
                          <div className="timeline-number">{index + 1}</div>
                          <div className="timeline-line"></div>
                        </div>
                        <div className="timeline-content">
                          <div className="timeline-record">
                            <div className="timeline-record-header">
                              <h4>
                                {recordData.title || "Untitled Record"}
                                <span className="record-type-small">
                                  {getRecordTypeLabel(recordData.recordType)}
                                </span>
                              </h4>
                              <div className="timeline-date">
                                {formatDate(
                                  recordData.date || record.createdAt
                                )}
                              </div>
                            </div>
                            <p className="timeline-description">
                              {recordData.description ||
                                "No description provided"}
                            </p>
                            <div className="timeline-actions">
                              <Button
                                variant="outline-primary"
                                size="sm"
                                onClick={() => {
                                  setShowPatientRecordsModal(false);
                                  handleViewDetails(record);
                                }}
                              >
                                <i className="fas fa-eye"></i> View Details
                              </Button>
                              <Button
                                variant="outline-secondary"
                                size="sm"
                                onClick={() => {
                                  setShowPatientRecordsModal(false);
                                  handleOpenEditRecord(record);
                                }}
                              >
                                <i className="fas fa-edit"></i> Edit
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            ) : (
              <div className="no-records-found">
                <p>No records found for this patient.</p>
              </div>
            )}
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

export default MedicalRecords;
