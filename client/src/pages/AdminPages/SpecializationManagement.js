import React, { useState, useEffect } from "react";
import adminAPI from "../../api/admin";
import Button from "../../components/common/Button";
import Spinner from "../../components/common/Spinner";
import Modal from "../../components/common/Modal";
import Popup from "../../components/common/Popup";
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

  // Add popup state
  const [popup, setPopup] = useState({
    show: false,
    type: "info",
    message: "",
    title: "",
  });

  // Add state for delete confirmation modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [specializationToDelete, setSpecializationToDelete] = useState(null);

  // Show popup method
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
      showPopup(
        "error",
        "Failed to load specializations. Please try again later.",
        "Error"
      );
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

        showPopup(
          "success",
          `Specialization "${formData.name}" updated successfully!`,
          "Update Successful"
        );
      } else {
        // Create new specialization using adminAPI
        const response = await adminAPI.createSpecialization(formData);
        setSpecializations([...specializations, response.data]);

        showPopup(
          "success",
          `Specialization "${formData.name}" created successfully!`,
          "Creation Successful"
        );
      }

      setShowModal(false);
      setError(null);
    } catch (err) {
      console.error("Error saving specialization:", err);
      setError(
        err.response?.data?.message ||
          "Failed to save specialization. Please try again."
      );

      showPopup(
        "error",
        err.response?.data?.message ||
          "Failed to save specialization. Please try again.",
        selectedSpecialization ? "Update Failed" : "Creation Failed"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (specialization) => {
    setSpecializationToDelete(specialization);
    setShowDeleteModal(true);
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setSpecializationToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!specializationToDelete) return;

    try {
      setLoading(true);
      // Using adminAPI from api/admin.js that uses the core api client
      await adminAPI.deleteSpecialization(specializationToDelete._id);
      setSpecializations(
        specializations.filter(
          (spec) => spec._id !== specializationToDelete._id
        )
      );
      setError(null);

      showPopup(
        "info",
        `Specialization "${specializationToDelete.name}" has been deleted successfully.`,
        "Deletion Successful"
      );
    } catch (err) {
      console.error("Error deleting specialization:", err);
      setError(
        err.response?.data?.message ||
          "Failed to delete specialization. Please try again."
      );

      showPopup(
        "error",
        err.response?.data?.message ||
          "Failed to delete specialization. Please try again.",
        "Deletion Failed"
      );
    } finally {
      setLoading(false);
      setShowDeleteModal(false);
      setSpecializationToDelete(null);
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
            variant="outline-primary"
            onClick={() => handleOpenModal()}
            disabled={loading}
          >
            <i className="fas fa-plus"></i> Add Specialization
          </Button>
        </div>
      </div>

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
                    onClick={() => handleDeleteClick(specialization)}
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

      {/* Add/Edit Specialization Modal - Use the common Modal component */}
      {showModal && (
        <Modal
          title={
            selectedSpecialization
              ? "Edit Specialization"
              : "Add Specialization"
          }
          onClose={handleCloseModal}
          size="medium"
        >
          <form onSubmit={handleSubmit} className="specialization-form">
            <div className="form-group">
              <label htmlFor="name">Specialization Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="form-control"
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
                className="form-control"
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
                variant="outline-primary"
                disabled={loading}
                loading={loading}
              >
                {selectedSpecialization ? "Update" : "Add"}
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && specializationToDelete && (
        <Modal
          title="Confirm Deletion"
          onClose={handleCancelDelete}
          size="small"
        >
          <div className="delete-confirmation">
            <div className="delete-confirmation-icon">
              <i className="fas fa-exclamation-triangle"></i>
            </div>
            <p className="delete-confirmation-message">
              Are you sure you want to delete the specialization{" "}
              <strong>"{specializationToDelete.name}"</strong>? This action
              cannot be undone.
            </p>
            <div className="delete-confirmation-actions">
              <Button
                variant="secondary"
                onClick={handleCancelDelete}
                className="cancel-button"
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={handleConfirmDelete}
                loading={loading && showDeleteModal}
                disabled={loading && showDeleteModal}
                className="delete-button"
              >
                Delete Specialization
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Add Popup component for notifications */}
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

export default SpecializationManagement;
