import React, { useState } from "react";

const PatientForm = () => {
  const [formData, setFormData] = useState({
    bloodGroup: "",
    weight: "",
    height: "",
    allergies: [""],
    currentMedications: [""],
    chronicDiseases: [""],
    emergencyContacts: [""],
    preferredDoctor: "",
  });

  // Update form fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle array fields (like allergies, medications, etc.)
  const handleArrayChange = (e, index, field) => {
    const values = [...formData[field]];
    values[index] = e.target.value;
    setFormData({ ...formData, [field]: values });
  };

  // Add more fields for arrays
  const handleAddField = (field) => {
    setFormData({ ...formData, [field]: [...formData[field], ""] });
  };

  // Remove a field from arrays
  const handleRemoveField = (index, field) => {
    const values = [...formData[field]];
    values.splice(index, 1);
    setFormData({ ...formData, [field]: values });
  };

  // Submit the form
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/patients/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to register patient");
      }

      const result = await response.json();
      alert(result.message || "Patient registered successfully!");
    } catch (error) {
      console.error("Error registering patient:", error);
      alert("Failed to register patient");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Patient Registration</h2>

      {/* Medical History */}
      <h3>Medical History</h3>

      <label>Blood Group:</label>
      <select
        name="bloodGroup"
        value={formData.bloodGroup}
        onChange={handleChange}
      >
        <option value="">Select Blood Group</option>
        <option value="A+">A+</option>
        <option value="A-">A-</option>
        <option value="B+">B+</option>
        <option value="B-">B-</option>
        <option value="AB+">AB+</option>
        <option value="AB-">AB-</option>
        <option value="O+">O+</option>
        <option value="O-">O-</option>
      </select>

      <label>Weight:</label>
      <input
        type="number"
        name="weight"
        value={formData.weight}
        onChange={handleChange}
      />

      <label>Height:</label>
      <input
        type="number"
        name="height"
        value={formData.height}
        onChange={handleChange}
      />

      {/* Allergies */}
      <label>Allergies:</label>
      {formData.allergies.map((allergy, index) => (
        <div key={index}>
          <input
            type="text"
            value={allergy}
            onChange={(e) => handleArrayChange(e, index, "allergies")}
          />
          <button
            type="button"
            onClick={() => handleRemoveField(index, "allergies")}
          >
            Remove
          </button>
        </div>
      ))}
      <button type="button" onClick={() => handleAddField("allergies")}>
        Add Allergy
      </button>

      {/* Current Medications */}
      <label>Current Medications:</label>
      {formData.currentMedications.map((medication, index) => (
        <div key={index}>
          <input
            type="text"
            value={medication}
            onChange={(e) => handleArrayChange(e, index, "currentMedications")}
          />
          <button
            type="button"
            onClick={() => handleRemoveField(index, "currentMedications")}
          >
            Remove
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => handleAddField("currentMedications")}
      >
        Add Medication
      </button>

      {/* Chronic Diseases */}
      <label>Chronic Diseases:</label>
      {formData.chronicDiseases.map((disease, index) => (
        <div key={index}>
          <input
            type="text"
            value={disease}
            onChange={(e) => handleArrayChange(e, index, "chronicDiseases")}
          />
          <button
            type="button"
            onClick={() => handleRemoveField(index, "chronicDiseases")}
          >
            Remove
          </button>
        </div>
      ))}
      <button type="button" onClick={() => handleAddField("chronicDiseases")}>
        Add Disease
      </button>

      {/* Emergency Contacts */}
      <label>Emergency Contacts:</label>
      {formData.emergencyContacts.map((contact, index) => (
        <div key={index}>
          <input
            type="text"
            value={contact}
            onChange={(e) => handleArrayChange(e, index, "emergencyContacts")}
          />
          <button
            type="button"
            onClick={() => handleRemoveField(index, "emergencyContacts")}
          >
            Remove
          </button>
        </div>
      ))}
      <button type="button" onClick={() => handleAddField("emergencyContacts")}>
        Add Contact
      </button>

      {/* Preferred Doctor */}
      <label>Preferred Doctor:</label>
      <input
        type="text"
        name="preferredDoctor"
        value={formData.preferredDoctor}
        onChange={handleChange}
      />

      <button type="submit">Register Patient</button>
    </form>
  );
};

export default PatientForm;
