import React, { useState, useEffect } from "react";
import patientAPI from "../../api/patient";
import Button from "../../components/common/Button";
import Spinner from "../../components/common/Spinner";
import Modal from "../../components/common/Modal";
import Popup from "../../components/common/Popup";
import "./Prescriptions.css";

const Prescriptions = () => {
  const [loading, setLoading] = useState(true);
  const [prescriptions, setPrescriptions] = useState([]);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [filter, setFilter] = useState("active");
  const [searchTerm, setSearchTerm] = useState("");

  // Popup notification state
  const [popup, setPopup] = useState({
    show: false,
    message: "",
    title: "",
    type: "info",
  });

  useEffect(() => {
    fetchPrescriptions();
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

  const fetchPrescriptions = async () => {
    try {
      setLoading(true);
      const response = await patientAPI.getPrescriptions();
      if (response && response.data) {
        setPrescriptions(response.data.prescriptions || []);
      }
    } catch (err) {
      console.error("Error fetching prescriptions:", err);
      showPopup("error", "Failed to load prescriptions. Please try again.");
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

  // Get prescription progress (days left or completed percentage)
  const getPrescriptionProgress = (prescription) => {
    if (!prescription.startDate || !prescription.endDate) return 100;

    const startDate = new Date(prescription.startDate);
    const endDate = new Date(prescription.endDate);
    const today = new Date();

    const totalDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
    const daysElapsed = Math.ceil((today - startDate) / (1000 * 60 * 60 * 24));

    // Calculate percentage completed
    let progress = Math.floor((daysElapsed / totalDays) * 100);

    // Ensure progress is between 0 and 100
    progress = Math.max(0, Math.min(progress, 100));

    return progress;
  };

  // Calculate days left for a prescription
  const getDaysLeft = (prescription) => {
    if (!prescription.endDate) return "No end date";

    const endDate = new Date(prescription.endDate);
    const today = new Date();

    if (today > endDate) return "Expired";

    const daysLeft = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24));
    return `${daysLeft} day${daysLeft !== 1 ? "s" : ""} left`;
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
    <div className="patient-prescriptions-container">
      <div className="patient-prescriptions-header">
        <div className="patient-header-content">
          <h1 className="patient-page-title">My Prescriptions</h1>
          <p className="patient-subtitle">
            View and manage all your prescription medications
          </p>
        </div>
      </div>

      <div className="patient-prescriptions-dashboard">
        <div className="patient-prescriptions-stats">
          <div className="patient-stat-card">
            <div className="patient-stat-icon">
              <i className="fas fa-file-prescription"></i>
            </div>
            <div className="patient-stat-info">
              <h3>
                {
                  prescriptions.filter(
                    (p) => p.status === "active" && !isExpired(p)
                  ).length
                }
              </h3>
              <p>Active</p>
            </div>
          </div>

          <div className="patient-stat-card">
            <div className="patient-stat-icon">
              <i className="fas fa-pills"></i>
            </div>
            <div className="patient-stat-info">
              <h3>
                {prescriptions.reduce(
                  (total, p) => total + (p.medications?.length || 0),
                  0
                )}
              </h3>
              <p>Medications</p>
            </div>
          </div>

          <div className="patient-stat-card">
            <div className="patient-stat-icon">
              <i className="fas fa-hourglass-end"></i>
            </div>
            <div className="patient-stat-info">
              <h3>{prescriptions.filter((p) => isExpired(p)).length}</h3>
              <p>Expired</p>
            </div>
          </div>
        </div>

        <div className="patient-filter-bar">
          <div className="patient-search-box">
            <i className="fas fa-search"></i>
            <input
              type="text"
              placeholder="Search by doctor or medication..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="patient-filter-tabs">
            <button
              className={`patient-filter-tab ${
                filter === "active" ? "active" : ""
              }`}
              onClick={() => setFilter("active")}
            >
              <i className="fas fa-check-circle"></i> Active
            </button>
            <button
              className={`patient-filter-tab ${
                filter === "completed" ? "active" : ""
              }`}
              onClick={() => setFilter("completed")}
            >
              <i className="fas fa-clipboard-check"></i> Completed
            </button>
            <button
              className={`patient-filter-tab ${
                filter === "all" ? "active" : ""
              }`}
              onClick={() => setFilter("all")}
            >
              <i className="fas fa-list"></i> All
            </button>
          </div>
        </div>

        {loading ? (
          <div className="patient-loading-container">
            <Spinner center size="large" />
          </div>
        ) : filteredPrescriptions.length > 0 ? (
          <div className="patient-prescriptions-list">
            {filteredPrescriptions.map((prescription) => {
              const progress = getPrescriptionProgress(prescription);
              const isActive =
                prescription.status === "active" && !isExpired(prescription);

              return (
                <div
                  key={prescription._id}
                  className={`patient-prescription-card ${
                    isExpired(prescription)
                      ? "expired"
                      : isActive
                      ? "active"
                      : "completed"
                  }`}
                >
                  <div className="patient-prescription-heading">
                    <div className="patient-prescription-doctor">
                      <div className="patient-doctor-avatar">
                        {prescription.doctor?.user?.profilePicture ? (
                          <img
                            src={prescription.doctor.user.profilePicture}
                            alt={prescription.doctor.user.fullname}
                          />
                        ) : (
                          <i className="fas fa-user-md"></i>
                        )}
                      </div>
                      <div className="patient-doctor-info">
                        <h3>
                          Dr. {prescription.doctor?.user?.fullname || "Unknown"}
                        </h3>
                        <span className="patient-prescription-date">
                          Prescribed on {formatDate(prescription.startDate)}
                        </span>
                      </div>
                    </div>
                    <div className="patient-prescription-status">
                      {isExpired(prescription) ? (
                        <span className="patient-status-badge status-expired">
                          <i className="fas fa-times-circle"></i> Expired
                        </span>
                      ) : prescription.status === "completed" ? (
                        <span className="patient-status-badge status-completed">
                          <i className="fas fa-check-circle"></i> Completed
                        </span>
                      ) : (
                        <span className="patient-status-badge status-active">
                          <i className="fas fa-circle"></i> Active
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="patient-prescription-content">
                    <div className="patient-prescription-medications">
                      <h4>
                        <i className="fas fa-prescription-bottle-alt"></i>
                        Medications ({prescription.medications?.length || 0})
                      </h4>
                      <ul className="patient-medication-list">
                        {prescription.medications
                          ?.slice(0, 3)
                          .map((medication, index) => (
                            <li key={index} className="patient-medication-item">
                              <div className="patient-medication-name">
                                <i className="fas fa-pills"></i>
                                {medication.name}
                              </div>
                              <div className="patient-medication-dosage">
                                {medication.dosage}
                              </div>
                            </li>
                          ))}
                        {prescription.medications?.length > 3 && (
                          <li className="patient-medication-more">
                            +{prescription.medications.length - 3} more
                            medications
                          </li>
                        )}
                      </ul>
                    </div>

                    {prescription.startDate && prescription.endDate && (
                      <div className="patient-prescription-duration">
                        <div className="patient-duration-range">
                          <div className="patient-duration-dates">
                            <span>{formatDate(prescription.startDate)}</span>
                            <span>{formatDate(prescription.endDate)}</span>
                          </div>
                          <div className="patient-duration-progress">
                            <div className="patient-progress-bar">
                              <div
                                className="patient-progress-fill"
                                style={{ width: `${progress}%` }}
                              ></div>
                            </div>
                            {isActive && (
                              <div className="patient-days-left">
                                {getDaysLeft(prescription)}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="patient-prescription-actions">
                    <button
                      className="patient-action-btn patient-view-btn"
                      onClick={() => handleViewDetails(prescription)}
                    >
                      <i className="fas fa-eye"></i> View Details
                    </button>
                    <button className="patient-action-btn patient-download-btn">
                      <i className="fas fa-download"></i> Download
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="patient-empty-state">
            <div className="patient-empty-icon">
              <i className="fas fa-prescription-bottle-alt"></i>
            </div>
            <h2>No prescriptions found</h2>
            <p>
              {filter === "active"
                ? "You don't have any active prescriptions at the moment."
                : filter === "completed"
                ? "You don't have any completed or expired prescriptions in your records."
                : "You don't have any prescriptions in your medical records yet."}
            </p>
            {searchTerm && (
              <Button
                variant="outline-primary"
                onClick={() => setSearchTerm("")}
              >
                <i className="fas fa-times-circle"></i> Clear Search
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Prescription Details Modal */}
      {showDetailsModal && selectedPrescription && (
        <Modal
          title="Prescription Details"
          onClose={() => setShowDetailsModal(false)}
          size="large"
        >
          <div className="patient-prescription-details-modal">
            <div className="patient-prescription-header-section">
              <div className="patient-prescription-doctor-section">
                <div className="patient-doctor-avatar-large">
                  {selectedPrescription.doctor?.user?.profilePicture ? (
                    <img
                      src={selectedPrescription.doctor.user.profilePicture}
                      alt={selectedPrescription.doctor.user.fullname}
                    />
                  ) : (
                    <i className="fas fa-user-md"></i>
                  )}
                </div>
                <div className="patient-doctor-details">
                  <h3>Prescribed by</h3>
                  <h4>
                    Dr.{" "}
                    {selectedPrescription.doctor?.user?.fullname || "Unknown"}
                  </h4>
                  <p>
                    <i className="fas fa-hospital"></i>
                    {selectedPrescription.doctor?.specialist ||
                      "General Practitioner"}
                  </p>
                </div>
                <div className="patient-prescription-status-large">
                  {isExpired(selectedPrescription) ? (
                    <span className="patient-status-badge status-expired">
                      Expired
                    </span>
                  ) : selectedPrescription.status === "completed" ? (
                    <span className="patient-status-badge status-completed">
                      Completed
                    </span>
                  ) : (
                    <span className="patient-status-badge status-active">
                      Active
                    </span>
                  )}
                </div>
              </div>

              <div className="patient-prescription-timeline">
                <div className="patient-timeline-item">
                  <div className="patient-timeline-icon start">
                    <i className="fas fa-calendar-plus"></i>
                  </div>
                  <div className="patient-timeline-content">
                    <h4>Start Date</h4>
                    <p>{formatDate(selectedPrescription.startDate)}</p>
                  </div>
                </div>

                {selectedPrescription.endDate && (
                  <div className="patient-timeline-item">
                    <div className="patient-timeline-icon end">
                      <i className="fas fa-calendar-minus"></i>
                    </div>
                    <div className="patient-timeline-content">
                      <h4>End Date</h4>
                      <p>{formatDate(selectedPrescription.endDate)}</p>
                    </div>
                  </div>
                )}

                <div className="patient-timeline-item">
                  <div className="patient-timeline-icon status">
                    <i
                      className={`fas fa-${
                        isExpired(selectedPrescription)
                          ? "times-circle"
                          : selectedPrescription.status === "completed"
                          ? "check-circle"
                          : "circle"
                      }`}
                    ></i>
                  </div>
                  <div className="patient-timeline-content">
                    <h4>Status</h4>
                    <p>
                      {isExpired(selectedPrescription)
                        ? "Expired"
                        : selectedPrescription.status === "completed"
                        ? "Completed"
                        : "Active"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="patient-prescription-sections">
              <div className="patient-detail-section">
                <h3>
                  <i className="fas fa-pills"></i> Medications
                </h3>
                <div className="patient-medications-grid">
                  {selectedPrescription.medications?.map(
                    (medication, index) => (
                      <div key={index} className="patient-medication-card">
                        <div className="patient-medication-header">
                          <h4>{medication.name}</h4>
                          <span className="patient-medication-dosage-badge">
                            {medication.dosage}
                          </span>
                        </div>

                        <div className="patient-medication-details">
                          {medication.frequency && (
                            <div className="patient-medication-detail">
                              <i className="fas fa-clock"></i>
                              <span>Frequency: {medication.frequency}</span>
                            </div>
                          )}

                          {medication.duration && (
                            <div className="patient-medication-detail">
                              <i className="fas fa-calendar-day"></i>
                              <span>Duration: {medication.duration}</span>
                            </div>
                          )}

                          {medication.instructions && (
                            <div className="patient-medication-detail instructions">
                              <i className="fas fa-info-circle"></i>
                              <span>{medication.instructions}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>

              {selectedPrescription.notes && (
                <div className="patient-detail-section">
                  <h3>
                    <i className="fas fa-sticky-note"></i> Doctor's Notes
                  </h3>
                  <div className="patient-notes-content">
                    {selectedPrescription.notes}
                  </div>
                </div>
              )}

              <div className="patient-prescription-actions-container">
                <Button
                  variant="outline-secondary"
                  onClick={() => setShowDetailsModal(false)}
                >
                  Close
                </Button>
                {/* <Button
                  variant="outline-primary"
                  onClick={() => window.print()}
                >
                  <i className="fas fa-print"></i> Print Prescription
                </Button> */}
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

export default Prescriptions;
