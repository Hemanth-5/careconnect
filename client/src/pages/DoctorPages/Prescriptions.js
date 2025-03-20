import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import doctorAPI from "../../api/doctor";
import Button from "../../components/common/Button";
import Spinner from "../../components/common/Spinner";
import Modal from "../../components/common/Modal";
import "./Prescriptions.css";

const Prescriptions = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [prescriptions, setPrescriptions] = useState([]);
  const [myPatients, setMyPatients] = useState([]);
  const [allPatients, setAllPatients] = useState([]);
  const [loading, setLoading] = useState(true);
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
    medications: [{ name: "", dosage: "", frequency: "", duration: "" }],
    startDate: new Date().toISOString().split("T")[0],
    endDate: "",
    notes: "",
  });

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
      setError("Failed to load prescriptions. Please try again.");
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
      medications: [{ name: "", dosage: "", frequency: "", duration: "" }],
      notes: "",
      date: new Date().toISOString().split("T")[0],
    });
    setShowPrescriptionModal(true);
  };

  const handleOpenEditPrescription = (prescription) => {
    setSelectedPrescription(prescription);
    setFormData({
      patient: prescription.patient?._id || "",
      medications: prescription.medications || [
        { name: "", dosage: "", frequency: "", duration: "" },
      ],
      notes: prescription.notes || "",
      date: new Date(prescription.date).toISOString().split("T")[0],
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
        { name: "", dosage: "", frequency: "", duration: "" },
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const prescriptionData = {
        ...formData,
        date: new Date(formData.date).toISOString(),
      };

      let response;

      if (selectedPrescription) {
        // Update existing prescription
        response = await doctorAPI.updatePrescription(
          selectedPrescription._id,
          prescriptionData
        );
        setSuccess("Prescription updated successfully!");
      } else {
        // Create new prescription
        response = await doctorAPI.createPrescription(prescriptionData);
        setSuccess("Prescription created successfully!");
      }

      // Refresh prescriptions
      fetchPrescriptions();

      // Close modal
      setShowPrescriptionModal(false);

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error("Error saving prescription:", err);
      setError(
        selectedPrescription
          ? "Failed to update prescription. Please try again."
          : "Failed to create prescription. Please try again."
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

  // Filter prescriptions based on search term
  const filteredPrescriptions = prescriptions.filter((prescription) => {
    const patientName = prescription.patient?.user?.fullname || "";
    const searchValue = searchTerm.toLowerCase();

    return patientName.toLowerCase().includes(searchValue);
  });

  // Get patient name by ID
  const getPatientName = (patientId) => {
    const patient = allPatients.find((p) => p._id === patientId);
    return patient?.user?.fullname || "Unknown Patient";
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
          <Button variant="primary" onClick={() => handleOpenNewPrescription()}>
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
        <div className="prescriptions-list">
          {filteredPrescriptions.length > 0 ? (
            <table className="prescriptions-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Patient</th>
                  <th>Medications</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPrescriptions.map((prescription) => (
                  <tr key={prescription._id}>
                    <td className="date-cell">
                      {formatDate(prescription.date)}
                    </td>
                    <td className="patient-cell">
                      {prescription.patient?.user?.fullname ||
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
                        onClick={() => handleOpenEditPrescription(prescription)}
                      >
                        Edit
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
                variant="primary"
                onClick={() => handleOpenNewPrescription()}
              >
                Create First Prescription
              </Button>
            </div>
          )}
        </div>
      )}

      {prescriptions.length > 0 && (
        <div className="filters">
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
                      "Unknown Patient"}
                  </option>
                )}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="date">Prescription Date</label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                required
              />
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
                          required
                        />
                      </div>
                    </div>

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
                        required
                      />
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
                variant="primary"
                loading={loading}
                disabled={loading}
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
        >
          <div className="prescription-details">
            <div className="details-header">
              <div className="detail-group">
                <h3>Patient</h3>
                <p className="detail-value">
                  {selectedPrescription.patient?.user?.fullname ||
                    "Unknown Patient"}
                </p>
              </div>

              <div className="detail-group">
                <h3>Date</h3>
                <p className="detail-value">
                  {formatDate(selectedPrescription.date)}
                </p>
              </div>
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
                        <p>
                          <strong>Frequency:</strong> {medication.frequency}
                        </p>
                        <p>
                          <strong>Duration:</strong> {medication.duration}
                        </p>
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
                variant="primary"
                onClick={() => {
                  setShowDetailsModal(false);
                  handleOpenEditPrescription(selectedPrescription);
                }}
              >
                Edit Prescription
              </Button>
              <Button
                variant="secondary"
                onClick={() => alert("Print functionality to be implemented")}
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

export default Prescriptions;
