import React, { useState, useEffect } from "react";
import adminAPI from "../../api/admin";
import Button from "../../components/common/Button";
import Spinner from "../../components/common/Spinner";
import "./SpecializationManagement.css";

const SpecializationManagement = () => {
  const [specializations, setSpecializations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedSpecialization, setSelectedSpecialization] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  useEffect(() => {
    fetchSpecializations();
  }, []);

  const fetchSpecializations = async () => {
    try {
      setLoading(true);
      // Using adminAPI from api/admin.js that uses the core api client
      const response = await adminAPI.getSpecializations();
      setSpecializations(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching specializations:", err);
      setError("Failed to load specializations. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (specialization = null) => {
    if (specialization) {
      setSelectedSpecialization(specialization);
      setFormData({
        name: specialization.name,
        description: specialization.description || "",
      });
    } else {
      setSelectedSpecialization(null);
      setFormData({
        name: "",
        description: "",
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      if (selectedSpecialization) {
        // Update existing specialization using adminAPI
        const response = await adminAPI.updateSpecialization(
          selectedSpecialization._id,
          formData
        );

        // Update the list with the new data
        setSpecializations(
          specializations.map((spec) =>
            spec._id === selectedSpecialization._id ? response.data : spec
          )
        );
      } else {
        // Create new specialization using adminAPI
        const response = await adminAPI.createSpecialization(formData);
        setSpecializations([...specializations, response.data]);
      }

      setShowModal(false);
      setError(null);
    } catch (err) {
      console.error("Error saving specialization:", err);
      setError(
        err.response?.data?.message ||
          "Failed to save specialization. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (
      !window.confirm("Are you sure you want to delete this specialization?")
    ) {
      return;
    }

    try {
      setLoading(true);
      // Using adminAPI from api/admin.js that uses the core api client
      await adminAPI.deleteSpecialization(id);
      setSpecializations(specializations.filter((spec) => spec._id !== id));
      setError(null);
    } catch (err) {
      console.error("Error deleting specialization:", err);
      setError(
        err.response?.data?.message ||
          "Failed to delete specialization. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="specialization-management">
      <div className="page-header">
        <h1 className="page-title">Specialization Management</h1>
        <div className="page-actions">
          <Button
            variant="secondary"
            onClick={fetchSpecializations}
            disabled={loading}
            className="refresh-button"
          >
            <i className="fas fa-sync-alt"></i> Refresh
          </Button>
          <Button
            variant="primary"
            onClick={() => handleOpenModal()}
            disabled={loading}
          >
            <i className="fas fa-plus"></i> Add Specialization
          </Button>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {loading && !showModal ? (
        <div className="loading-container">
          <Spinner center size="large" />
        </div>
      ) : (
        <div className="specializations-grid">
          {specializations.length > 0 ? (
            specializations.map((specialization) => (
              <div key={specialization._id} className="specialization-card">
                <h3>{specialization.name}</h3>
                <p>{specialization.description}</p>
                <div className="specialization-card-actions">
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={() => handleOpenModal(specialization)}
                  >
                    <i className="fas fa-edit"></i> Edit
                  </Button>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => handleDelete(specialization._id)}
                  >
                    <i className="fas fa-trash-alt"></i> Delete
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="no-specializations">
              <p>No specializations found. Add one to get started.</p>
            </div>
          )}
        </div>
      )}

      {/* Add/Edit Specialization Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>
                {selectedSpecialization
                  ? "Edit Specialization"
                  : "Add Specialization"}
              </h2>
              <button className="close-btn" onClick={handleCloseModal}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="name">Specialization Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
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
                    rows="4"
                  ></textarea>
                </div>
                <div className="form-actions">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={handleCloseModal}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={loading}
                    loading={loading}
                  >
                    {selectedSpecialization ? "Update" : "Add"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SpecializationManagement;
