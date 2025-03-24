import React, { useState, useEffect } from "react";
import patientAPI from "../../api/patient";
import Button from "../../components/common/Button";
import Spinner from "../../components/common/Spinner";
import Modal from "../../components/common/Modal";
import "./MedicalRecords.css";

const MedicalRecords = () => {
  const [loading, setLoading] = useState(true);
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [error, setError] = useState(null);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showRecordModal, setShowRecordModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchMedicalRecords();
  }, []);

  const fetchMedicalRecords = async () => {
    try {
      setLoading(true);
      const response = await patientAPI.getMedicalRecords();
      if (response && response.data) {
        setMedicalRecords(response.data || []);
      }
      setError(null);
    } catch (err) {
      console.error("Error fetching medical records:", err);
      setError("Failed to load medical records. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleViewRecord = (record) => {
    setSelectedRecord(record);
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
        <h1 className="page-title">My Medical Records</h1>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="filter-bar">
        <div className="search-box">
          <i className="fas fa-search"></i>
          <input
            type="text"
            placeholder="Search by doctor or record details..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
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
          {filteredRecords.map((record) => (
            <div key={record._id} className="record-card">
              {record.records.map((entry, index) => (
                <div key={index} className="record-entry">
                  <div className="record-header">
                    <div className="record-type">
                      <span className="record-type-badge">
                        {getRecordTypeName(entry.recordType)}
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
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => handleViewRecord(record)}
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ))}
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
              variant="primary"
              onClick={() => {
                setSearchTerm("");
                setFilter("all");
              }}
            >
              Clear Filters
            </Button>
          )}
        </div>
      )}

      {/* Medical Record Details Modal */}
      {showRecordModal && selectedRecord && (
        <Modal
          title="Medical Record Details"
          onClose={() => setShowRecordModal(false)}
        >
          <div className="medical-record-details">
            {selectedRecord.records.map((record, index) => (
              <div key={index} className="record-detail-section">
                <div className="record-header-info">
                  <div className="record-type-info">
                    <span className="record-type-badge large">
                      {getRecordTypeName(record.recordType)}
                    </span>
                    <span className="record-date-info">
                      {formatDate(record.date)}
                    </span>
                  </div>
                  <h2 className="record-title-large">{record.title}</h2>
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
                    <h4>Description</h4>
                    <p>{record.description || "No description provided"}</p>
                  </div>

                  {record.diagnosis && (
                    <div className="info-section">
                      <h4>Diagnosis</h4>
                      <p>{record.diagnosis}</p>
                    </div>
                  )}

                  {record.treatmentProgress && (
                    <div className="info-section">
                      <h4>Treatment Progress</h4>
                      <p>{record.treatmentProgress}</p>
                    </div>
                  )}

                  {record.notes && (
                    <div className="info-section">
                      <h4>Additional Notes</h4>
                      <p>{record.notes}</p>
                    </div>
                  )}
                </div>

                {record.attachments && record.attachments.length > 0 && (
                  <div className="attachments-section">
                    <h4>Attachments</h4>
                    <div className="attachments-list">
                      {record.attachments.map((attachment, i) => (
                        <div key={i} className="attachment-item">
                          <i className="fas fa-file"></i>
                          <a
                            href={attachment.url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {attachment.filename || `Attachment ${i + 1}`}
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}

            <div className="modal-actions">
              <Button variant="outline-primary" onClick={() => window.print()}>
                <i className="fas fa-print"></i> Print Record
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default MedicalRecords;
