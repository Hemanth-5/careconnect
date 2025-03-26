import React, { useState, useEffect } from "react";
import patientAPI from "../../api/patient";
import Button from "../../components/common/Button";
import Spinner from "../../components/common/Spinner";
import Modal from "../../components/common/Modal";
import Popup from "../../components/common/Popup";
import "./MedicalRecords.css";

const MedicalRecords = () => {
  const [loading, setLoading] = useState(true);
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showRecordModal, setShowRecordModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");

  // Popup notification state
  const [popup, setPopup] = useState({
    show: false,
    message: "",
    title: "",
    type: "info",
  });

  useEffect(() => {
    fetchMedicalRecords();
  }, []);

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

  const fetchMedicalRecords = async () => {
    try {
      setLoading(true);
      const response = await patientAPI.getMedicalRecords();
      if (response && response.data) {
        setMedicalRecords(response.data || []);
      }
    } catch (err) {
      console.error("Error fetching medical records:", err);
      showPopup("error", "Failed to load medical records. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleViewRecord = (record, entry) => {
    setSelectedRecord({ ...record, currentEntry: entry });
    setShowRecordModal(true);
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

  // Get record type name
  const getRecordTypeName = (type) => {
    switch (type) {
      case "examination":
        return "Physical Examination";
      case "test":
        return "Test Results";
      case "procedure":
        return "Medical Procedure";
      case "consultation":
        return "Consultation Notes";
      case "follow-up":
        return "Follow-up Visit";
      default:
        return "Medical Record";
    }
  };

  // Get record type icon
  const getRecordTypeIcon = (type) => {
    switch (type) {
      case "examination":
        return "fas fa-stethoscope";
      case "test":
        return "fas fa-vial";
      case "procedure":
        return "fas fa-procedures";
      case "consultation":
        return "fas fa-comments";
      case "follow-up":
        return "fas fa-calendar-check";
      default:
        return "fas fa-file-medical";
    }
  };

  // Get attachment icon based on file type
  const getAttachmentIcon = (filename) => {
    if (!filename) return "fas fa-file";

    if (filename.match(/\.(pdf)$/i)) return "fas fa-file-pdf";
    if (filename.match(/\.(jpg|jpeg|png|gif)$/i)) return "fas fa-file-image";
    if (filename.match(/\.(doc|docx)$/i)) return "fas fa-file-word";
    if (filename.match(/\.(xls|xlsx)$/i)) return "fas fa-file-excel";
    if (filename.match(/\.(ppt|pptx)$/i)) return "fas fa-file-powerpoint";
    if (filename.match(/\.(txt)$/i)) return "fas fa-file-alt";

    return "fas fa-file";
  };

  // Filter records based on search term and filter
  const filteredRecords = medicalRecords
    .filter((record) => {
      if (filter === "all") return true;
      return record.records.some((r) => r.recordType === filter);
    })
    .filter((record) => {
      if (!searchTerm) return true;

      const searchValue = searchTerm.toLowerCase();
      const doctorName = record.doctor?.user?.fullname?.toLowerCase() || "";

      return (
        doctorName.includes(searchValue) ||
        record.records.some(
          (r) =>
            (r.title && r.title.toLowerCase().includes(searchValue)) ||
            (r.description &&
              r.description.toLowerCase().includes(searchValue)) ||
            (r.diagnosis && r.diagnosis.toLowerCase().includes(searchValue))
        )
      );
    });

  return (
    <div className="patient-medical-records">
      <div className="records-header">
        <div className="patient-header-content">
          <h1 className="page-title">My Medical Records</h1>
          <p className="subtitle">
            View and manage your complete health record history
          </p>
        </div>
      </div>

      <div className="filter-bar">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search by doctor or record details..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <i className="fas fa-search"></i>
        </div>

        <div className="record-type-filter">
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All Record Types</option>
            <option value="examination">Physical Examinations</option>
            <option value="test">Test Results</option>
            <option value="procedure">Medical Procedures</option>
            <option value="consultation">Consultation Notes</option>
            <option value="follow-up">Follow-up Visits</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="loading-container">
          <Spinner center size="large" />
        </div>
      ) : filteredRecords.length > 0 ? (
        <div className="records-grid">
          {filteredRecords.flatMap((record) =>
            record.records.map((entry, index) => (
              <div key={`${record._id}-${index}`} className="record-card">
                <div className="record-entry" data-type={entry.recordType}>
                  <div className="record-header">
                    <div className="record-type">
                      <span
                        className="record-type-badge"
                        data-type={entry.recordType}
                      >
                        <i className={getRecordTypeIcon(entry.recordType)}></i>
                        &nbsp;{getRecordTypeName(entry.recordType)}
                      </span>
                    </div>
                    <div className="record-date">{formatDate(entry.date)}</div>
                  </div>

                  <div className="record-body">
                    <h3 className="record-title">{entry.title}</h3>
                    <div className="record-doctor">
                      <i className="fas fa-user-md"></i>
                      <span>
                        Dr. {record.doctor?.user?.fullname || "Unknown"}
                      </span>
                    </div>
                    <p className="record-description">{entry.description}</p>

                    {entry.attachments && entry.attachments.length > 0 && (
                      <div className="record-attachments">
                        <i className="fas fa-paperclip"></i>
                        {entry.attachments.length} attachment(s)
                      </div>
                    )}
                  </div>

                  <div className="record-footer">
                    <button
                      className="record-view-btn"
                      onClick={() => handleViewRecord(record, entry)}
                    >
                      <i className="fas fa-eye"></i> View Details
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">
            <i className="fas fa-file-medical-alt"></i>
          </div>
          <h2>No Medical Records Found</h2>
          <p>
            {searchTerm
              ? "No records matching your search criteria"
              : filter !== "all"
              ? `No ${getRecordTypeName(filter).toLowerCase()} records found`
              : "You don't have any medical records yet"}
          </p>
          {(searchTerm || filter !== "all") && (
            <Button
              variant="outline-primary"
              onClick={() => {
                setSearchTerm("");
                setFilter("all");
              }}
            >
              <i className="fas fa-sync"></i> Clear Filters
            </Button>
          )}
        </div>
      )}

      {/* Medical Record Details Modal */}
      {showRecordModal && selectedRecord && (
        <Modal
          title="Medical Record Details"
          onClose={() => setShowRecordModal(false)}
          size="large"
        >
          <div className="medical-record-details">
            <div
              className="record-detail-section"
              data-type={
                selectedRecord.currentEntry?.recordType || "examination"
              }
            >
              <div className="record-header-info">
                <div className="record-type-info">
                  <span
                    className="record-type-badge large"
                    data-type={selectedRecord.currentEntry?.recordType}
                  >
                    <i
                      className={getRecordTypeIcon(
                        selectedRecord.currentEntry?.recordType
                      )}
                    ></i>
                    &nbsp;
                    {getRecordTypeName(selectedRecord.currentEntry?.recordType)}
                  </span>
                  <span className="record-date-info">
                    {formatDate(selectedRecord.currentEntry?.date)}
                  </span>
                </div>
                <h2 className="record-title-large">
                  {selectedRecord.currentEntry?.title}
                </h2>
              </div>

              <div className="doctor-info">
                <div className="doctor-avatar">
                  {selectedRecord.doctor?.user?.profilePicture ? (
                    <img
                      src={selectedRecord.doctor.user.profilePicture}
                      alt={selectedRecord.doctor.user.fullname}
                    />
                  ) : (
                    <i className="fas fa-user-md"></i>
                  )}
                </div>
                <div className="doctor-details">
                  <h3>
                    Dr. {selectedRecord.doctor?.user?.fullname || "Unknown"}
                  </h3>
                  <p>
                    {selectedRecord.doctor?.specializations
                      ?.map((s) => s.name)
                      .join(", ") || "General Practitioner"}
                  </p>
                </div>
              </div>

              <div className="record-info-grid">
                <div className="info-section">
                  <h4>
                    <i className="fas fa-clipboard"></i> Description
                  </h4>
                  <p>
                    {selectedRecord.currentEntry?.description ||
                      "No description provided"}
                  </p>
                </div>

                {selectedRecord.currentEntry?.diagnosis && (
                  <div className="info-section">
                    <h4>
                      <i className="fas fa-diagnoses"></i> Diagnosis
                    </h4>
                    <p>{selectedRecord.currentEntry.diagnosis}</p>
                  </div>
                )}

                {selectedRecord.currentEntry?.treatmentPlan && (
                  <div className="info-section">
                    <h4>
                      <i className="fas fa-clipboard-list"></i> Treatment Plan
                    </h4>
                    <p>{selectedRecord.currentEntry.treatmentPlan}</p>
                  </div>
                )}

                {selectedRecord.currentEntry?.testResults && (
                  <div className="info-section">
                    <h4>
                      <i className="fas fa-vial"></i> Test Results
                    </h4>
                    <p>{selectedRecord.currentEntry.testResults}</p>
                  </div>
                )}

                {selectedRecord.currentEntry?.notes && (
                  <div className="info-section">
                    <h4>
                      <i className="fas fa-sticky-note"></i> Additional Notes
                    </h4>
                    <p>{selectedRecord.currentEntry.notes}</p>
                  </div>
                )}
              </div>

              {selectedRecord.currentEntry?.attachments &&
                selectedRecord.currentEntry.attachments.length > 0 && (
                  <div className="attachments-section">
                    <h4>
                      <i className="fas fa-paperclip"></i> Attachments
                    </h4>
                    <div className="attachments-list">
                      {selectedRecord.currentEntry.attachments.map(
                        (attachment, i) => (
                          <div key={i} className="attachment-item">
                            <i
                              className={getAttachmentIcon(attachment.filename)}
                            ></i>
                            <a
                              href={attachment.url}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {attachment.filename || `Attachment ${i + 1}`}
                            </a>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}

              <div className="modal-actions">
                <Button
                  variant="outline-secondary"
                  onClick={() => setShowRecordModal(false)}
                >
                  Close
                </Button>
                <Button
                  variant="outline-primary"
                  onClick={() => window.print()}
                >
                  <i className="fas fa-print"></i> Print Record
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Popup notifications */}
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
