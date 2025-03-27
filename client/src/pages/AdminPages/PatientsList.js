import React, { useState, useEffect } from "react";
import adminAPI from "../../api/admin";
import Button from "../../components/common/Button";
import Spinner from "../../components/common/Spinner";
import "./PatientsList.css";

const PatientsList = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewDetails, setViewDetails] = useState(null);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      setLoading(true);

      try {
        // Using adminAPI from api/admin.js that uses the core api client
        const response = await adminAPI.getAllPatients();

        // Process the data before setting it
        let patientsData = response.data || [];

        // Add any additional processing here if needed
        // For example, calculating age from dateOfBirth if not provided
        patientsData = patientsData.map((patient) => {
          let processedPatient = { ...patient };

          // Calculate age if it's not provided but dateOfBirth is
          if (!processedPatient.age && processedPatient.dateOfBirth) {
            try {
              const birthDate = new Date(processedPatient.dateOfBirth);
              const today = new Date();
              let age = today.getFullYear() - birthDate.getFullYear();
              const monthDiff = today.getMonth() - birthDate.getMonth();

              if (
                monthDiff < 0 ||
                (monthDiff === 0 && today.getDate() < birthDate.getDate())
              ) {
                age--;
              }

              processedPatient.calculatedAge = age;
            } catch (e) {
              console.warn("Could not calculate age from birth date:", e);
            }
          }

          return processedPatient;
        });

        setPatients(patientsData);
        setError(null);
      } catch (err) {
        console.error("Error fetching patients:", err);
        if (err.response) {
          console.error("Response data:", err.response.data);
          console.error("Response status:", err.response.status);
        }
        setError(
          `Failed to load patients: ${
            err.message || "Unknown error"
          }. Please try again later.`
        );
      }
    } catch (err) {
      console.error("Unexpected error in fetchPatients:", err);
      setError("An unexpected error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (patient) => {
    setViewDetails(patient);
  };

  const handleCloseDetails = () => {
    setViewDetails(null);
  };

  // Filter patients based on search term
  const filteredPatients = (patients || []).filter((patient) => {
    const user = patient.user || {};

    // Access username, name, and email safely
    const username = user.username || "";
    const fullname = user.fullname || "";
    const name = patient.name || "";
    const email = user.email || "";

    return (
      username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="patients-list">
      <div className="page-header">
        <h1 className="page-title">Patients</h1>
        <Button
          variant="secondary"
          onClick={() => {
            setSearchTerm("");
          }}
          className="refresh-button"
        >
          <i className="fas fa-sync-alt"></i> Refresh
        </Button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="filter-bar">
        <div className="search-box">
          <i className="fas fa-search search-icon"></i>
          <input
            type="text"
            placeholder="Search patients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="loading-container">
          <Spinner center size="large" />
        </div>
      ) : (
        <div className="patients-table-container">
          <table className="patients-table">
            <thead>
              <tr>
                <th>Username</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Age</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.length > 0 ? (
                filteredPatients.map((patient) => {
                  const user = patient.user || {};

                  return (
                    <tr key={patient._id}>
                      <td>
                        <div className="patient-name-cell">
                          <div className="patient-avatar">
                            {user.profilePicture ? (
                              <img
                                src={user.profilePicture}
                                alt={user.username || "Patient"}
                              />
                            ) : (
                              <i className="fas fa-user"></i>
                            )}
                          </div>
                          <span>{user.username || "N/A"}</span>
                        </div>
                      </td>
                      <td>{user.fullname || patient.name || "N/A"}</td>
                      <td>{user.email || "N/A"}</td>
                      <td>{user.contact?.phone || "N/A"}</td>
                      <td>{user.age || patient.calculatedAge || "N/A"}</td>
                      <td>
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => handleViewDetails(patient)}
                        >
                          View Details
                        </Button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" className="no-results">
                    {patients.length === 0 ? (
                      <div>
                        <p>No patients found in the system.</p>
                        <Button
                          variant="outline-primary"
                          onClick={fetchPatients}
                          style={{ marginTop: "10px" }}
                        >
                          Retry
                        </Button>
                      </div>
                    ) : (
                      "No patients match your search criteria."
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Patient Details Modal */}
      {viewDetails && (
        <div className="modal-overlay">
          <div className="modal patient-details-modal">
            <div className="modal-header">
              <h2>Patient Details</h2>
              <button className="close-btn" onClick={handleCloseDetails}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              <div className="patient-profile">
                <div className="patient-profile-header">
                  <div className="patient-profile-avatar">
                    {viewDetails.user?.profilePicture ? (
                      <img
                        src={viewDetails.user.profilePicture}
                        alt={viewDetails.user.username || "Patient"}
                      />
                    ) : (
                      <i className="fas fa-user"></i>
                    )}
                  </div>
                  <div className="patient-profile-info">
                    <h3>{viewDetails.user?.username || "N/A"}</h3>
                    <p>{viewDetails.user?.fullname || ""}</p>
                    <p className="patient-profile-id">
                      <span>Patient ID:</span> {viewDetails._id}
                    </p>
                  </div>
                </div>

                <div className="patient-profile-section">
                  <h4>Personal Information</h4>
                  <div className="patient-info-grid">
                    <div className="info-item">
                      <span className="info-label">Email:</span>
                      <span className="info-value">
                        {viewDetails.user?.email || "Not provided"}
                      </span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Phone:</span>
                      <span className="info-value">
                        {viewDetails.user?.contact?.phone || "Not provided"}
                      </span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Gender:</span>
                      <span className="info-value">
                        {viewDetails.user?.gender || "Not specified"}
                      </span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Date of Birth:</span>
                      <span className="info-value">
                        {viewDetails.user?.dateOfBirth
                          ? new Date(
                              viewDetails.user.dateOfBirth
                            ).toLocaleDateString()
                          : "Not provided"}
                      </span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Age:</span>
                      <span className="info-value">
                        {viewDetails.user?.age ||
                          viewDetails.calculatedAge ||
                          "Not specified"}
                      </span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Blood Type:</span>
                      <span className="info-value">
                        {viewDetails.bloodType || "Not specified"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="patient-profile-section">
                  <h4>Address</h4>
                  <p>
                    {viewDetails.user?.contact?.address ||
                      "No address information available"}
                  </p>
                </div>

                <div className="patient-profile-section">
                  <h4>Medical History</h4>
                  <p className="medical-history">
                    {viewDetails.medicalHistory ||
                      "No medical history available"}
                  </p>
                </div>

                <div className="patient-profile-section">
                  <h4>Emergency Contact</h4>
                  {viewDetails.emergencyContacts &&
                  viewDetails.emergencyContacts.length > 0 ? (
                    <div className="emergency-contact">
                      <p>
                        <strong>Name:</strong>{" "}
                        {viewDetails.emergencyContacts[0].name ||
                          "Not provided"}
                      </p>
                      <p>
                        <strong>Phone:</strong>{" "}
                        {viewDetails.emergencyContacts[0].phone ||
                          "Not provided"}
                      </p>
                      <p>
                        <strong>Relationship:</strong>{" "}
                        {viewDetails.emergencyContacts[0].relationship ||
                          "Not provided"}
                      </p>
                    </div>
                  ) : (
                    <p>No emergency contact information available</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientsList;
