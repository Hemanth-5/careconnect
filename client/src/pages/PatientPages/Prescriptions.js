import React, { useState, useEffect } from "react";
import patientAPI from "../../api/patient";
import Button from "../../components/common/Button";
import Spinner from "../../components/common/Spinner";
import Modal from "../../components/common/Modal";
import "./Prescriptions.css";

const Prescriptions = () => {
  const [loading, setLoading] = useState(true);
  const [prescriptions, setPrescriptions] = useState([]);
  const [error, setError] = useState(null);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [filter, setFilter] = useState("active");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const fetchPrescriptions = async () => {
    try {
      setLoading(true);
      const response = await patientAPI.getPrescriptions();
      if (response && response.data) {
        setPrescriptions(response.data.prescriptions || []);
      }
      setError(null);
    } catch (err) {
      console.error("Error fetching prescriptions:", err);
      setError("Failed to load prescriptions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (prescription) => {
    setSelectedPrescription(prescription);
    setShowDetailsModal(true);
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

  // Check if prescription is expired
  const isExpired = (prescription) => {
    if (!prescription.endDate) return false;
    return new Date(prescription.endDate) < new Date();
  };

  // Get filtered prescriptions
  const getFilteredPrescriptions = () => {
    return prescriptions
      .filter((prescription) => {
        // Apply status filter
        if (filter === "active") {
          return prescription.status === "active" && !isExpired(prescription);
        } else if (filter === "completed") {
          return prescription.status === "completed" || isExpired(prescription);
        } else if (filter === "all") {
          return true;
        }
        return true;
      })
      .filter((prescription) => {
        // Apply search filter
        if (!searchTerm) return true;

        const searchValue = searchTerm.toLowerCase();
        const doctorName =
          prescription.doctor?.user?.fullname?.toLowerCase() || "";
        const medications = prescription.medications || [];
        return (
          doctorName.includes(searchValue) ||
          medications.some(
            (med) =>
              med.name.toLowerCase().includes(searchValue) ||
              (med.instructions &&
                med.instructions.toLowerCase().includes(searchValue))
          )
        );
      });
  };

  const filteredPrescriptions = getFilteredPrescriptions();

  return (
    <div className="patient-prescriptions">
      <div className="prescriptions-header">
        <h1 className="page-title">My Prescriptions</h1>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="filter-bar">
        <div className="search-box">
          <i className="fas fa-search"></i>
          <input
            type="text"
            placeholder="Search by doctor or medication..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-tabs">
          <button
            className={`filter-tab ${filter === "active" ? "active" : ""}`}
            onClick={() => setFilter("active")}
          >
            Active
          </button>
          <button
            className={`filter-tab ${filter === "completed" ? "active" : ""}`}
            onClick={() => setFilter("completed")}
          >
            Completed
          </button>
          <button
            className={`filter-tab ${filter === "all" ? "active" : ""}`}
            onClick={() => setFilter("all")}
          >
            All
          </button>
        </div>
      </div>

      {loading ? (
        <div className="loading-container">
          <Spinner center size="large" />
        </div>
      ) : filteredPrescriptions.length > 0 ? (
        <div className="prescriptions-list">
          {filteredPrescriptions.map((prescription) => (
            <div
              key={prescription._id}
              className={`prescription-card ${
                isExpired(prescription) ? "expired" : ""
              }`}
            >
              <div className="prescription-header">
                <div className="prescription-dates">
                  <div className="date">
                    <i className="fas fa-calendar-plus"></i>
                    {formatDate(prescription.startDate)}
                  </div>
                  {prescription.endDate && (
                    <div className="date">
                      <i className="fas fa-calendar-minus"></i>
                      {formatDate(prescription.endDate)}
                    </div>
                  )}
                </div>
                <div className="prescription-status">
                  {isExpired(prescription) ? (
                    <span className="status-badge status-expired">Expired</span>
                  ) : (
                    <span
                      className={`status-badge status-${prescription.status}`}
                    >
                      {prescription.status}
                    </span>
                  )}
                </div>
              </div>

              <div className="prescription-body">
                <div className="prescription-doctor">
                  <i className="fas fa-user-md"></i>
                  <span>
                    Dr. {prescription.doctor?.user?.fullname || "Unknown"}
                  </span>
                </div>

                <h3 className="prescription-title">Medications</h3>
                <ul className="medications-list">
                  {prescription.medications
                    ?.slice(0, 3)
                    .map((medication, index) => (
                      <li key={index} className="medication-item">
                        <div className="medication-name">
                          <i className="fas fa-pills"></i>
                          {medication.name}
                        </div>
                        <div className="medication-dosage">
                          {medication.dosage}
                        </div>
                      </li>
                    ))}
                  {prescription.medications?.length > 3 && (
                    <li className="medication-item more">
                      +{prescription.medications.length - 3} more medications
                    </li>
                  )}
                </ul>
              </div>

              <div className="prescription-footer">
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={() => handleViewDetails(prescription)}
                >
                  View Details
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">
            <i className="fas fa-prescription-bottle-alt"></i>
          </div>
          <h2>No prescriptions found</h2>
          <p>
            {filter === "active"
              ? "You don't have any active prescriptions."
              : filter === "completed"
              ? "You don't have any completed prescriptions."
              : "You don't have any prescriptions yet."}
          </p>
          {searchTerm && (
            <Button variant="primary" onClick={() => setSearchTerm("")}>
              Clear Search
            </Button>
          )}
        </div>
      )}

      {/* Prescription Details Modal */}
      {showDetailsModal && selectedPrescription && (
        <Modal
          title="Prescription Details"
          onClose={() => setShowDetailsModal(false)}
        >
          <div className="prescription-details">
            <div className="prescription-detail-header">
              <div className="detail-row">
                <span className="detail-label">Status:</span>
                <span className="detail-value">
                  {isExpired(selectedPrescription) ? (
                    <span className="status-badge status-expired">Expired</span>
                  ) : (
                    <span
                      className={`status-badge status-${selectedPrescription.status}`}
                    >
                      {selectedPrescription.status}
                    </span>
                  )}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Doctor:</span>
                <span className="detail-value">
                  Dr. {selectedPrescription.doctor?.user?.fullname || "Unknown"}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Prescribed on:</span>
                <span className="detail-value">
                  {formatDate(selectedPrescription.startDate)}
                </span>
              </div>
              {selectedPrescription.endDate && (
                <div className="detail-row">
                  <span className="detail-label">Valid until:</span>
                  <span className="detail-value">
                    {formatDate(selectedPrescription.endDate)}
                  </span>
                </div>
              )}
            </div>

            <div className="prescription-medications">
              <h3>Medications</h3>
              {selectedPrescription.medications?.map((medication, index) => (
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
                        <strong>Instructions:</strong> {medication.instructions}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {selectedPrescription.notes && (
              <div className="prescription-notes">
                <h3>Notes from Doctor</h3>
                <p>{selectedPrescription.notes}</p>
              </div>
            )}

            <div className="prescription-footer">
              <Button variant="outline-primary" onClick={() => window.print()}>
                <i className="fas fa-print"></i> Print Prescription
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Prescriptions;
