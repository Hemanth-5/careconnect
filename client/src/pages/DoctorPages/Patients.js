import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import doctorAPI from "../../api/doctor";
import Button from "../../components/common/Button";
import Spinner from "../../components/common/Spinner";
import Modal from "../../components/common/Modal";
import "./Patients.css";

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showPatientModal, setShowPatientModal] = useState(false);
  const [showMedicalHistoryModal, setShowMedicalHistoryModal] = useState(false);
  const [medicalHistory, setMedicalHistory] = useState({});

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const response = await doctorAPI.getMyPatients();
      setPatients(response.data || []);
      setError(null);
    } catch (err) {
      console.error("Error fetching patients:", err);
      setError("Failed to load patients. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleViewPatient = (patient) => {
    setSelectedPatient(patient);
    setShowPatientModal(true);
  };

  const handleViewMedicalHistory = (patient) => {
    setSelectedPatient(patient);
    // Here we would fetch detailed medical history if needed
    setMedicalHistory({
      allergies: patient.allergies || [],
      chronicConditions: patient.chronicConditions || [],
      currentMedications: patient.currentMedications || [],
      pastSurgeries: patient.pastSurgeries || [],
      familyHistory: patient.familyHistory || "",
      bloodType: patient.bloodType || "Unknown",
      height: patient.height || "N/A",
      weight: patient.weight || "N/A",
      notes: patient.medicalHistory || "No additional notes",
    });
    setShowMedicalHistoryModal(true);
  };

  // Calculate age from date of birth
  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return "N/A";

    const birthDate = new Date(dateOfBirth);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
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

  // Filter patients based on search term
  const filteredPatients = patients.filter((patient) => {
    const user = patient.user || {};
    const fullname = user.fullname || "";
    const email = user.email || "";
    const phone = user.contact?.phone || "";
    const searchValue = searchTerm.toLowerCase();

    return (
      fullname.toLowerCase().includes(searchValue) ||
      email.toLowerCase().includes(searchValue) ||
      phone.toLowerCase().includes(searchValue)
    );
  });

  return (
    <div className="doctor-patients">
      <div className="patients-header">
        <h1 className="page-title">My Patients</h1>
        <div className="search-box">
          <i className="fas fa-search"></i>
          <input
            type="text"
            placeholder="Search patients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {loading ? (
        <div className="loading-container">
          <Spinner center size="large" />
        </div>
      ) : (
        <>
          {filteredPatients.length > 0 ? (
            <div className="patients-grid">
              {filteredPatients.map((patient) => {
                const user = patient.user || {};
                return (
                  <div key={patient._id} className="patient-card">
                    <div className="patient-card-header">
                      <div className="patient-avatar">
                        {user.profilePicture ? (
                          <img
                            src={user.profilePicture}
                            alt={user.fullname || "Patient"}
                          />
                        ) : (
                          <i className="fas fa-user"></i>
                        )}
                      </div>
                      <h3 className="patient-name">{user.fullname || "N/A"}</h3>
                      {user.dateOfBirth && (
                        <p className="patient-age">
                          {calculateAge(user.dateOfBirth)} years
                        </p>
                      )}
                    </div>
                    <div className="patient-details">
                      <div className="patient-detail">
                        <i className="fas fa-envelope"></i>
                        <span>{user.email || "No email provided"}</span>
                      </div>
                      <div className="patient-detail">
                        <i className="fas fa-phone"></i>
                        <span>{user.contact?.phone || "No phone provided"}</span>
                      </div>
                      <div className="patient-detail">
                        <i className="fas fa-calendar"></i>
                        <span>
                          Last visit:{" "}
                          {patient.lastVisit
                            ? formatDate(patient.lastVisit)
                            : "Never"}
                        </span>
                      </div>
                    </div>
                    <div className="patient-actions">
                      <Button
                        variant="outline-primary"
                        onClick={() => handleViewPatient(patient)}
                      >
                        View Details
                      </Button>
                      <Button
                        variant="outline-secondary"
                        onClick={() => handleViewMedicalHistory(patient)}
                      >
                        Medical History
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="no-patients">
              <i className="fas fa-users-slash"></i>
              <p>No patients found matching your search criteria.</p>
              {searchTerm ? (
                <Button variant="primary" onClick={() => setSearchTerm("")}>
                  Clear Search
                </Button>
              ) : (
                <Button variant="primary" onClick={fetchPatients}>
                  Refresh
                </Button>
              )}
            </div>
          )}
        </>
      )}

      {/* Patient Details Modal */}
      {showPatientModal && selectedPatient && (
        <Modal
          title="Patient Details"
          onClose={() => setShowPatientModal(false)}
        >
          <div className="patient-profile">
            <div className="profile-header">
              <div className="profile-avatar">
                {selectedPatient.user?.profilePicture ? (
                  <img
                    src={selectedPatient.user.profilePicture}
                    alt={selectedPatient.user.fullname || "Patient"}
                    className="avatar-image"
                  />
                ) : (
                  <i className="fas fa-user"></i>
                )}
              </div>
              <div className="profile-info">
                <h2>{selectedPatient.user?.fullname || "N/A"}</h2>
                <p className="text-muted">ID: {selectedPatient._id}</p>
              </div>
            </div>

            <div className="profile-section">
              <h3>Personal Information</h3>
              <div className="profile-details">
                <div className="detail-item">
                  <span className="detail-label">Email:</span>
                  <span className="detail-value">
                    {selectedPatient.user?.email || "Not provided"}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Phone:</span>
                  <span className="detail-value">
                    {selectedPatient.user?.contact?.phone || "Not provided"}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Date of Birth:</span>
                  <span className="detail-value">
                    {selectedPatient.user?.dateOfBirth
                      ? formatDate(selectedPatient.user.dateOfBirth)
                      : "Not provided"}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Age:</span>
                  <span className="detail-value">
                    {selectedPatient.user?.dateOfBirth
                      ? `${calculateAge(
                          selectedPatient.user.dateOfBirth
                        )} years`
                      : "Not provided"}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Gender:</span>
                  <span className="detail-value">
                    {selectedPatient.user?.gender || "Not specified"}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Blood Type:</span>
                  <span className="detail-value">
                    {selectedPatient.bloodType || "Not specified"}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Address:</span>
                  <span className="detail-value">
                    {selectedPatient.user?.contact?.address
                      ? `${selectedPatient.user.contact.address}, ${
                          selectedPatient.user.contact.city || ""
                        } ${selectedPatient.user.contact.state || ""} ${
                          selectedPatient.user.contact.zipCode || ""
                        }`
                      : "Not provided"}
                  </span>
                </div>
              </div>
            </div>

            <div className="profile-section">
              <h3>Patient History</h3>
              <div className="profile-details">
                <div className="detail-item">
                  <span className="detail-label">First Visit:</span>
                  <span className="detail-value">
                    {selectedPatient.firstVisit
                      ? formatDate(selectedPatient.firstVisit)
                      : "Not recorded"}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Last Visit:</span>
                  <span className="detail-value">
                    {selectedPatient.lastVisit
                      ? formatDate(selectedPatient.lastVisit)
                      : "Never"}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Total Visits:</span>
                  <span className="detail-value">
                    {selectedPatient.totalVisits || 0}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Medical History:</span>
                  <span className="detail-value">
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => {
                        setShowPatientModal(false);
                        handleViewMedicalHistory(selectedPatient);
                      }}
                    >
                      View Medical History
                    </Button>
                  </span>
                </div>
              </div>
            </div>

            <div className="profile-actions">
              <Link
                to={`/doctor/appointments/new?patient=${selectedPatient._id}`}
                className="btn btn-primary"
              >
                Schedule Appointment
              </Link>
              <Link
                to={`/doctor/prescriptions/new?patient=${selectedPatient._id}`}
                className="btn btn-secondary"
              >
                Create Prescription
              </Link>
              <Link
                to={`/doctor/medical-records/new?patient=${selectedPatient._id}`}
                className="btn btn-info"
              >
                Add Medical Record
              </Link>
            </div>
          </div>
        </Modal>
      )}

      {/* Medical History Modal */}
      {showMedicalHistoryModal && selectedPatient && (
        <Modal
          title="Medical History"
          onClose={() => setShowMedicalHistoryModal(false)}
        >
          <div className="medical-history">
            <div className="patient-name-header">
              <h3>
                {selectedPatient.user?.fullname || "Unknown Patient"}'s Medical
                History
              </h3>
            </div>

            <div className="medical-history-section">
              <h4>Allergies</h4>
              {medicalHistory.allergies && medicalHistory.allergies.length > 0 ? (
                <ul className="medical-list">
                  {medicalHistory.allergies.map((allergy, index) => (
                    <li key={index}>{allergy}</li>
                  ))}
                </ul>
              ) : (
                <p className="no-data">No allergies recorded</p>
              )}
            </div>

            <div className="medical-history-section">
              <h4>Chronic Conditions</h4>
              {medicalHistory.chronicConditions &&
              medicalHistory.chronicConditions.length > 0 ? (
                <ul className="medical-list">
                  {medicalHistory.chronicConditions.map((condition, index) => (
                    <li key={index}>{condition}</li>
                  ))}
                </ul>
              ) : (
                <p className="no-data">No chronic conditions recorded</p>
              )}
            </div>

            <div className="medical-history-section">
              <h4>Current Medications</h4>
              {medicalHistory.currentMedications &&
              medicalHistory.currentMedications.length > 0 ? (
                <ul className="medical-list">
                  {medicalHistory.currentMedications.map((medication, index) => (
                    <li key={index}>{medication}</li>
                  ))}
                </ul>
              ) : (
                <p className="no-data">No current medications recorded</p>
              )}
            </div>

            <div className="medical-history-section">
              <h4>Past Surgeries</h4>
              {medicalHistory.pastSurgeries &&
              medicalHistory.pastSurgeries.length > 0 ? (
                <ul className="medical-list">
                  {medicalHistory.pastSurgeries.map((surgery, index) => (
                    <li key={index}>{surgery}</li>
                  ))}
                </ul>
              ) : (
                <p className="no-data">No past surgeries recorded</p>
              )}
            </div>

            <div className="medical-history-section">
              <h4>Family Medical History</h4>
              {medicalHistory.familyHistory ? (
                <p>{medicalHistory.familyHistory}</p>
              ) : (
                <p className="no-data">No family medical history recorded</p>
              )}
            </div>

            <div className="medical-history-section">
              <h4>Physical Information</h4>
              <div className="medical-info-grid">
                <div className="medical-info-item">
                  <span className="info-label">Blood Type:</span>
                  <span className="info-value">{medicalHistory.bloodType}</span>
                </div>
                <div className="medical-info-item">
                  <span className="info-label">Height:</span>
                  <span className="info-value">{medicalHistory.height}</span>
                </div>
                <div className="medical-info-item">
                  <span className="info-label">Weight:</span>
                  <span className="info-value">{medicalHistory.weight}</span>
                </div>
              </div>
            </div>

            <div className="medical-history-section">
              <h4>Additional Notes</h4>
              <p className="notes">{medicalHistory.notes}</p>
            </div>

            <div className="modal-actions">
              <Button
                variant="secondary"
                onClick={() => {
                  setShowMedicalHistoryModal(false);
                  setShowPatientModal(true);
                }}
              >
                Back to Patient Details
              </Button>
              <Button
                variant="primary"
                onClick={() =>
                  alert("Edit functionality to be implemented soon.")
                }
              >
                Update Medical History
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Patients;
