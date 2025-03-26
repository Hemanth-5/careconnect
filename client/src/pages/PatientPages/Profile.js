import React, { useState, useEffect, useRef } from "react";
import patientAPI from "../../api/patient";
import userAPI from "../../api/user";
import Spinner from "../../components/common/Spinner";
import Button from "../../components/common/Button";
import Popup from "../../components/common/Popup";
import "./Profile.css";

const Profile = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);
  const [activeTab, setActiveTab] = useState("personal");

  // Popup notification state
  const [popup, setPopup] = useState({
    show: false,
    message: "",
    title: "",
    type: "info",
  });

  // Form state
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    phone: "",
    gender: "",
    dateOfBirth: "",
    bloodType: "",
    height: "",
    weight: "",
    allergies: [],
    medicalHistory: "",
    currentMedications: [],
    chronicConditions: [],
    emergencyContact: {
      name: "",
      relationship: "",
      phone: "",
    },
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",

    insuranceInfo: {
      provider: "",
      policyNumber: "",
      groupNumber: "",
      coverageDetails: "",
    },
  });

  // Editable states
  const [editMode, setEditMode] = useState({
    personalInfo: true,
    contactInfo: true,
    medicalInfo: true,
    medicalHistory: true,
    emergencyContact: true,
    address: true,
    insurance: true,
  });

  // Allergies input state
  const [allergyInput, setAllergyInput] = useState("");

  // Medications input state
  const [medicationInput, setMedicationInput] = useState("");

  // Conditions input state
  const [conditionInput, setConditionInput] = useState("");

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

  // Fetch profile data on component mount
  useEffect(() => {
    fetchProfileData();
  }, []);

  // Fetch profile data from API
  const fetchProfileData = async () => {
    try {
      setLoading(true);
      const response = await patientAPI.getProfile();

      if (response && response.data) {
        setProfile(response.data);

        // Populate form data
        const userData = response.data.user || {};
        const patientData = response.data || {};

        setFormData({
          fullname: userData.fullname || "",
          email: userData.email || "",
          phone: userData.contact?.phone || "",
          gender: userData.gender || "",
          dateOfBirth: userData.dateOfBirth
            ? new Date(userData.dateOfBirth).toISOString().split("T")[0]
            : "",
          bloodType: patientData.bloodType || "",
          height: patientData.height || "",
          weight: patientData.weight || "",
          allergies: patientData.allergies || [],
          medicalHistory: patientData.medicalHistory || "",
          currentMedications: patientData.currentMedications || [],
          chronicConditions: patientData.chronicConditions || [],
          emergencyContact: {
            name: patientData.emergencyContact?.name || "",
            relationship: patientData.emergencyContact?.relationship || "",
            phone: patientData.emergencyContact?.phone || "",
          },
          address: userData.contact?.address || "",
          city: userData.contact?.city || "",
          state: userData.contact?.state || "",
          zipCode: userData.contact?.zipCode || "",
          country: userData.contact?.country || "",

          insuranceInfo: {
            provider: patientData.insuranceDetails?.provider || "",
            policyNumber: patientData.insuranceDetails?.policyNumber || "",
            groupNumber: patientData.insuranceDetails?.groupNumber || "",
            coverageDetails:
              patientData.insuranceDetails?.coverageDetails || "",
          },
        });
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      showPopup("error", "Failed to load profile data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Handle nested objects
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  // Toggle edit mode for a section
  const toggleEditMode = (section) => {
    setEditMode({
      ...editMode,
      [section]: !editMode[section],
    });
  };

  // Handle save changes for a section
  const handleSaveChanges = async (section) => {
    try {
      setSaving(true);

      // Prepare data based on the section being updated
      let updateData = {};

      switch (section) {
        case "personalInfo":
          updateData = {
            fullname: formData.fullname,
            email: formData.email,
            dateOfBirth: formData.dateOfBirth,
            gender: formData.gender,
            contact: {
              phone: formData.phone,
            },
          };
          // Use userAPI for user profile updates
          await userAPI.updateUserProfile(updateData);
          break;

        case "contactInfo":
          updateData = {
            contact: {
              address: formData.address,
              city: formData.city,
              state: formData.state,
              zipCode: formData.zipCode,
              country: formData.country,
            },
          };
          // Use userAPI for user profile updates
          await userAPI.updateUserProfile(updateData);
          break;

        case "medicalInfo":
          updateData = {
            bloodType: formData.bloodType,
            height: formData.height,
            weight: formData.weight,
            allergies: formData.allergies,
          };
          // Use patientAPI.updateProfile consistently
          await patientAPI.updateProfile(updateData);
          break;

        case "medicalHistory":
          updateData = {
            medicalHistory: formData.medicalHistory,
            currentMedications: formData.currentMedications,
            chronicConditions: formData.chronicConditions,
          };
          await patientAPI.updateProfile(updateData);
          break;

        case "emergencyContact":
          updateData = {
            emergencyContacts: formData.emergencyContact,
          };
          // Use patientAPI.updateProfile consistently
          await patientAPI.updateProfile(updateData);
          break;

        case "address":
          updateData = {
            contact: {
              address: formData.address,
            },
          };
          // Use userAPI for user profile updates
          await userAPI.updateUserProfile(updateData);
          break;

        case "insurance":
          updateData = {
            insuranceDetails: {
              provider: formData.insuranceInfo.provider,
              policyNumber: formData.insuranceInfo.policyNumber,
              groupNumber: formData.insuranceInfo.groupNumber,
              coverageDetails: formData.insuranceInfo.coverageDetails,
            },
          };
          // Use patientAPI.updateProfile consistently
          await patientAPI.updateProfile(updateData);
          break;

        default:
          throw new Error("Invalid section");
      }

      showPopup("success", `Profile updated successfully!`);
      fetchProfileData(); // Refresh data
    } catch (error) {
      console.error(`Error updating ${section}:`, error);
      showPopup("error", `Failed to update ${section}. Please try again.`);
    } finally {
      setSaving(false);
    }
  };

  // Handle image selection> {
  //   const handleImageChange = (e) => {0];
  //     const file = e.target.files[0];) {
  //     if (file) {e);
  //       setSelectedImage(file);));
  //       setPreviewUrl(URL.createObjectURL(file));  }
  //     } };
  //   };

  //   // Trigger file input click> {
  //   const triggerFileInput = () => {();
  //     fileInputRef.current.click(); };
  //   };

  //   // Upload profile picture> {
  //   const handleUploadProfilePicture = async () => {rn;
  //     if (!selectedImage) return;
  // y {
  //     try {e);
  //       setSaving(true);
  // ();
  //       const formData = new FormData();e);
  //       formData.append("image", selectedImage);
  // a);
  //       const response = await userAPI.updateProfilePicture(formData);
  // ) {
  //       if (response && response.data) {");
  //         showPopup("success", "Profile picture updated successfully!"); ({
  //         setProfile((prev) => ({ev,
  //           ...prev,: {
  //           user: {er,
  //             ...prev.user,re,
  //             profilePicture: response.data.profilePicture, },
  //           },));
  //         }));l);
  //         setSelectedImage(null);l);
  //         setPreviewUrl(null);  }
  //       }) {
  //     } catch (error) {r);
  //       console.error("Error uploading profile picture:", error);");
  //       showPopup("error", "Failed to upload profile picture. Please try again.");y {
  //     } finally {e);
  //       setSaving(false);  }
  //     } };
  //   };

  // Add allergy
  const handleAddAllergy = () => {
    if (
      allergyInput.trim() &&
      !formData.allergies.includes(allergyInput.trim())
    ) {
      setFormData({
        ...formData,
        allergies: [...formData.allergies, allergyInput.trim()],
      });
      setAllergyInput("");
    }
  };

  // Remove allergy
  const handleRemoveAllergy = (allergy) => {
    setFormData({
      ...formData,
      allergies: formData.allergies.filter((item) => item !== allergy),
    });
  };

  // Add medication
  const handleAddMedication = () => {
    if (
      medicationInput.trim() &&
      !formData.currentMedications.includes(medicationInput.trim())
    ) {
      setFormData({
        ...formData,
        currentMedications: [
          ...formData.currentMedications,
          medicationInput.trim(),
        ],
      });
      setMedicationInput("");
    }
  };

  // Remove medication
  const handleRemoveMedication = (medication) => {
    setFormData({
      ...formData,
      currentMedications: formData.currentMedications.filter(
        (item) => item !== medication
      ),
    });
  };

  // Add condition
  const handleAddCondition = () => {
    if (
      conditionInput.trim() &&
      !formData.chronicConditions.includes(conditionInput.trim())
    ) {
      setFormData({
        ...formData,
        chronicConditions: [
          ...formData.chronicConditions,
          conditionInput.trim(),
        ],
      });
      setConditionInput("");
    }
  };

  // Remove condition
  const handleRemoveCondition = (condition) => {
    setFormData({
      ...formData,
      chronicConditions: formData.chronicConditions.filter(
        (item) => item !== condition
      ),
    });
  };

  // Calculate age from dateOfBirth
  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return "--";
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

  if (loading) {
    return (
      <div className="patient-loading-container">
        <Spinner center size="large" />
      </div>
    );
  }

  return (
    <div className="patient-profile">
      <div className="patient-profile-header">
        <h1 className="page-title">My Profile</h1>
      </div>

      <div className="patient-profile-content">
        {/* Sidebar */}
        <div className="patient-profile-sidebar">
          <div className="patient-profile-picture-container">
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Profile Preview"
                className="patient-profile-picture"
              />
            ) : profile?.user?.profilePicture ? (
              <img
                src={profile.user.profilePicture}
                alt="Profile"
                className="patient-profile-picture"
              />
            ) : (
              <div className="patient-profile-picture-placeholder">
                <i className="fas fa-user-circle"></i>
              </div>
            )}
          </div>

          <div className="patient-profile-info-summary">
            <h2 className="patient-name">
              {profile?.user?.fullname || "Patient"}
            </h2>
            <p className="patient-email">
              <i className="fas fa-envelope"></i>{" "}
              {profile?.user?.email || "No email provided"}
            </p>
            {profile?.bloodType && (
              <p className="patient-blood-type">
                <i className="fas fa-tint"></i> Blood Type: {profile.bloodType}
              </p>
            )}
            {profile?.user?.dateOfBirth && (
              <p className="patient-age">
                <i className="fas fa-birthday-cake"></i> Age:{" "}
                {calculateAge(profile.user.dateOfBirth)} years
              </p>
            )}
          </div>

          <div className="patient-profile-navigation">
            <button
              className={`patient-nav-item ${
                activeTab === "personal" ? "active" : ""
              }`}
              onClick={() => setActiveTab("personal")}
            >
              <i className="fas fa-user"></i> Personal Info
            </button>
            <button
              className={`patient-nav-item ${
                activeTab === "medical" ? "active" : ""
              }`}
              onClick={() => setActiveTab("medical")}
            >
              <i className="fas fa-heartbeat"></i> Medical Info
            </button>
            <button
              className={`patient-nav-item ${
                activeTab === "medicalHistory" ? "active" : ""
              }`}
              onClick={() => setActiveTab("medicalHistory")}
            >
              <i className="fas fa-file-medical-alt"></i> Medical History
            </button>
            <button
              className={`patient-nav-item ${
                activeTab === "emergency" ? "active" : ""
              }`}
              onClick={() => setActiveTab("emergency")}
            >
              <i className="fas fa-phone-alt"></i> Emergency Contact
            </button>
            <button
              className={`patient-nav-item ${
                activeTab === "address" ? "active" : ""
              }`}
              onClick={() => setActiveTab("address")}
            >
              <i className="fas fa-map-marker-alt"></i> Address
            </button>
            <button
              className={`patient-nav-item ${
                activeTab === "insurance" ? "active" : ""
              }`}
              onClick={() => setActiveTab("insurance")}
            >
              <i className="fas fa-file-medical"></i> Insurance Info
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="patient-profile-detail-container">
          {/* Personal Information Tab */}
          <div
            className={`patient-tab-content ${
              activeTab === "personal" ? "active" : ""
            }`}
          >
            <h2 className="patient-section-title">Personal Information</h2>
            <div className="patient-form-section">
              {editMode.personalInfo ? (
                <div className="patient-form">
                  <div className="patient-form-row">
                    <div className="patient-form-group">
                      <label>Full Name</label>
                      <input
                        type="text"
                        name="fullname"
                        value={formData.fullname}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="patient-form-group">
                      <label>Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="patient-form-row">
                    <div className="patient-form-group">
                      <label>Date of Birth</label>
                      <input
                        type="date"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="patient-form-group">
                      <label>Gender</label>
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleInputChange}
                      >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                        <option value="prefer-not-to-say">
                          Prefer not to say
                        </option>
                      </select>
                    </div>
                  </div>

                  <div className="patient-form-group">
                    <label>Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Enter your phone number"
                    />
                  </div>

                  <div className="patient-form-actions">
                    <Button
                      variant="outline-secondary"
                      onClick={() => {
                        toggleEditMode("personalInfo");
                        fetchProfileData(); // Reset form data
                      }}
                      disabled={saving}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="outline-primary"
                      onClick={() => handleSaveChanges("personalInfo")}
                      loading={saving}
                    >
                      Save Changes
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="profile-view">
                  <div className="profile-card">
                    <div className="profile-details">
                      <div className="detail-row">
                        <div className="detail-item">
                          <h4>Full Name</h4>
                          <p>{profile?.user?.fullname || "Not provided"}</p>
                        </div>
                        <div className="detail-item">
                          <h4>Email</h4>
                          <p>{profile?.user?.email || "Not provided"}</p>
                        </div>
                      </div>

                      <div className="detail-row">
                        <div className="detail-item">
                          <h4>Date of Birth</h4>
                          <p>
                            {profile?.user?.dateOfBirth
                              ? new Date(
                                  profile.user.dateOfBirth
                                ).toLocaleDateString()
                              : "Not provided"}
                          </p>
                        </div>
                        <div className="patient-detail-item">
                          <h4>Gender</h4>
                          <p>
                            {profile?.gender
                              ? profile.gender.charAt(0).toUpperCase() +
                                profile.gender.slice(1)
                              : "Not provided"}
                          </p>
                        </div>
                      </div>

                      <div className="patient-detail-row">
                        <div className="patient-detail-item">
                          <h4>Phone Number</h4>
                          <p>
                            {profile?.user?.contact?.phone || "Not provided"}
                          </p>
                        </div>
                      </div>

                      <Button
                        variant="outline-primary"
                        onClick={() => toggleEditMode("personalInfo")}
                        className="patient-edit-section-btn"
                      >
                        <i className="fas fa-edit"></i> Edit Personal
                        Information
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Medical Information Tab */}
          <div
            className={`patient-tab-content ${
              activeTab === "medical" ? "active" : ""
            }`}
          >
            <h2 className="patient-section-title">Medical Information</h2>
            <div className="patient-form-section">
              {editMode.medicalInfo ? (
                <div className="patient-form">
                  <div className="patient-form-row">
                    <div className="patient-form-group">
                      <label>Blood Type</label>
                      <select
                        name="bloodType"
                        value={formData.bloodType}
                        onChange={handleInputChange}
                      >
                        <option value="">Select Blood Type</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                      </select>
                    </div>
                    <div className="patient-form-group">
                      <label>Height (cm)</label>
                      <input
                        type="number"
                        name="height"
                        value={formData.height}
                        onChange={handleInputChange}
                        placeholder="Height in cm"
                      />
                    </div>
                  </div>

                  <div className="patient-form-row">
                    <div className="patient-form-group">
                      <label>Weight (kg)</label>
                      <input
                        type="number"
                        name="weight"
                        value={formData.weight}
                        onChange={handleInputChange}
                        placeholder="Weight in kg"
                      />
                    </div>
                  </div>

                  <div className="patient-form-group">
                    <label>Allergies</label>
                    <div className="allergies-input">
                      <input
                        type="text"
                        value={allergyInput}
                        onChange={(e) => setAllergyInput(e.target.value)}
                        placeholder="Add an allergy"
                        onKeyPress={(e) =>
                          e.key === "Enter" && handleAddAllergy()
                        }
                      />
                      <button
                        type="button"
                        onClick={handleAddAllergy}
                        className="add-btn"
                      >
                        Add
                      </button>
                    </div>
                    <div className="allergies-list">
                      {formData.allergies.map((allergy, index) => (
                        <span className="allergy-tag" key={index}>
                          {allergy}
                          <button
                            type="button"
                            onClick={() => handleRemoveAllergy(allergy)}
                            className="remove-btn"
                          >
                            <i className="fas fa-times"></i>
                          </button>
                        </span>
                      ))}
                      {formData.allergies.length === 0 && (
                        <span className="no-allergies">No allergies added</span>
                      )}
                    </div>
                  </div>

                  <div className="patient-form-actions">
                    <Button
                      variant="outline-secondary"
                      onClick={() => {
                        toggleEditMode("medicalInfo");
                        fetchProfileData(); // Reset form data
                      }}
                      disabled={saving}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="outline-primary"
                      onClick={() => handleSaveChanges("medicalInfo")}
                      loading={saving}
                    >
                      Save Changes
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="profile-view">
                  <div className="profile-card">
                    <div className="profile-details">
                      <div className="detail-row">
                        <div className="detail-item">
                          <h4>Blood Type</h4>
                          <p>{profile?.bloodType || "Not provided"}</p>
                        </div>
                        <div className="detail-item">
                          <h4>Height</h4>
                          <p>
                            {profile?.height
                              ? `${profile.height} cm`
                              : "Not provided"}
                          </p>
                        </div>
                      </div>

                      <div className="detail-row">
                        <div className="detail-item">
                          <h4>Weight</h4>
                          <p>
                            {profile?.weight
                              ? `${profile.weight} kg`
                              : "Not provided"}
                          </p>
                        </div>
                      </div>

                      <div className="detail-item">
                        <h4>Allergies</h4>
                        {profile?.allergies && profile.allergies.length > 0 ? (
                          <div className="allergies-display">
                            {profile.allergies.map((allergy, index) => (
                              <span className="allergy-badge" key={index}>
                                {allergy}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <p>No allergies</p>
                        )}
                      </div>

                      <Button
                        variant="outline-primary"
                        onClick={() => toggleEditMode("medicalInfo")}
                        className="edit-section-btn"
                      >
                        <i className="fas fa-edit"></i> Edit Medical Information
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Medical History Tab */}
          <div
            className={`patient-tab-content ${
              activeTab === "medicalHistory" ? "active" : ""
            }`}
          >
            <h2 className="patient-section-title">Medical History</h2>
            <div className="patient-form-section">
              {editMode.medicalHistory ? (
                <div className="patient-form">
                  <div className="patient-form-group">
                    <label>Medical History</label>
                    <textarea
                      name="medicalHistory"
                      value={formData.medicalHistory}
                      onChange={handleInputChange}
                      rows="4"
                      placeholder="Please provide any relevant medical history"
                    />
                  </div>

                  <div className="patient-form-group">
                    <label>Current Medications</label>
                    <div className="allergies-input">
                      <input
                        type="text"
                        value={medicationInput}
                        onChange={(e) => setMedicationInput(e.target.value)}
                        placeholder="Add medication"
                        onKeyPress={(e) =>
                          e.key === "Enter" && handleAddMedication()
                        }
                      />
                      <button
                        type="button"
                        onClick={handleAddMedication}
                        className="add-btn"
                      >
                        Add
                      </button>
                    </div>
                    <div className="allergies-list">
                      {formData.currentMedications.map((medication, index) => (
                        <span className="allergy-tag" key={index}>
                          {medication}
                          <button
                            type="button"
                            onClick={() => handleRemoveMedication(medication)}
                            className="remove-btn"
                          >
                            <i className="fas fa-times"></i>
                          </button>
                        </span>
                      ))}
                      {formData.currentMedications.length === 0 && (
                        <span className="no-allergies">
                          No medications added
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="patient-form-group">
                    <label>Chronic Conditions</label>
                    <div className="allergies-input">
                      <input
                        type="text"
                        value={conditionInput}
                        onChange={(e) => setConditionInput(e.target.value)}
                        placeholder="Add chronic condition"
                        onKeyPress={(e) =>
                          e.key === "Enter" && handleAddCondition()
                        }
                      />
                      <button
                        type="button"
                        onClick={handleAddCondition}
                        className="add-btn"
                      >
                        Add
                      </button>
                    </div>
                    <div className="allergies-list">
                      {formData.chronicConditions.map((condition, index) => (
                        <span className="allergy-tag" key={index}>
                          {condition}
                          <button
                            type="button"
                            onClick={() => handleRemoveCondition(condition)}
                            className="remove-btn"
                          >
                            <i className="fas fa-times"></i>
                          </button>
                        </span>
                      ))}
                      {formData.chronicConditions.length === 0 && (
                        <span className="no-allergies">
                          No chronic conditions added
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="patient-form-actions">
                    <Button
                      variant="outline-secondary"
                      onClick={() => {
                        toggleEditMode("medicalHistory");
                        fetchProfileData(); // Reset form data
                      }}
                      disabled={saving}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="outline-primary"
                      onClick={() => handleSaveChanges("medicalHistory")}
                      loading={saving}
                    >
                      Save Changes
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="profile-view">
                  <div className="profile-card">
                    <div className="profile-details">
                      <div className="detail-item">
                        <h4>Medical History</h4>
                        <p>
                          {profile?.medicalHistory ||
                            "No medical history provided"}
                        </p>
                      </div>

                      <div className="detail-item">
                        <h4>Current Medications</h4>
                        {profile?.currentMedications &&
                        profile.currentMedications.length > 0 ? (
                          <div className="allergies-display">
                            {profile.currentMedications.map(
                              (medication, index) => (
                                <span className="allergy-badge" key={index}>
                                  {medication}
                                </span>
                              )
                            )}
                          </div>
                        ) : (
                          <p>No current medications</p>
                        )}
                      </div>

                      <div className="detail-item">
                        <h4>Chronic Conditions</h4>
                        {profile?.chronicConditions &&
                        profile.chronicConditions.length > 0 ? (
                          <div className="allergies-display">
                            {profile.chronicConditions.map(
                              (condition, index) => (
                                <span className="allergy-badge" key={index}>
                                  {condition}
                                </span>
                              )
                            )}
                          </div>
                        ) : (
                          <p>No chronic conditions</p>
                        )}
                      </div>

                      <Button
                        variant="outline-primary"
                        onClick={() => toggleEditMode("medicalHistory")}
                        className="edit-section-btn"
                      >
                        <i className="fas fa-edit"></i> Edit Medical History
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Emergency Contact Tab */}
          <div
            className={`patient-tab-content ${
              activeTab === "emergency" ? "active" : ""
            }`}
          >
            <h2 className="patient-section-title">Emergency Contact</h2>
            <div className="patient-form-section">
              {editMode.emergencyContact ? (
                <div className="patient-form">
                  <div className="patient-form-group">
                    <label>Contact Name</label>
                    <input
                      type="text"
                      name="emergencyContact.name"
                      value={formData.emergencyContact.name}
                      onChange={handleInputChange}
                      placeholder="Full name of emergency contact"
                    />
                  </div>

                  <div className="patient-form-row">
                    <div className="patient-form-group">
                      <label>Relationship</label>
                      <input
                        type="text"
                        name="emergencyContact.relationship"
                        value={formData.emergencyContact.relationship}
                        onChange={handleInputChange}
                        placeholder="e.g. Spouse, Parent, Sibling"
                      />
                    </div>
                    <div className="patient-form-group">
                      <label>Phone Number</label>
                      <input
                        type="tel"
                        name="emergencyContact.phone"
                        value={formData.emergencyContact.phone}
                        onChange={handleInputChange}
                        placeholder="Emergency contact's phone number"
                      />
                    </div>
                  </div>

                  <div className="emergency-note">
                    <i className="fas fa-info-circle"></i>
                    <p>
                      Emergency contact information is crucial in case of an
                      emergency. Please make sure to provide accurate
                      information.
                    </p>
                  </div>

                  <div className="patient-form-actions">
                    <Button
                      variant="outline-secondary"
                      onClick={() => {
                        toggleEditMode("emergencyContact");
                        fetchProfileData(); // Reset form data
                      }}
                      disabled={saving}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="outline-primary"
                      onClick={() => handleSaveChanges("emergencyContact")}
                      loading={saving}
                    >
                      Save Changes
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="profile-view">
                  <div className="profile-card">
                    <div className="profile-details">
                      {profile?.emergencyContact?.name ? (
                        <>
                          <div className="detail-row">
                            <div className="detail-item">
                              <h4>Contact Name</h4>
                              <p>{profile.emergencyContact.name}</p>
                            </div>
                            <div className="detail-item">
                              <h4>Relationship</h4>
                              <p>
                                {profile.emergencyContact.relationship ||
                                  "Not specified"}
                              </p>
                            </div>
                          </div>

                          <div className="detail-row">
                            <div className="detail-item">
                              <h4>Phone Number</h4>
                              <p>
                                {profile.emergencyContact.phone ||
                                  "Not provided"}
                              </p>
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="empty-state">
                          <i className="fas fa-exclamation-circle"></i>
                          <p>No emergency contact information provided</p>
                        </div>
                      )}

                      <Button
                        variant="outline-primary"
                        onClick={() => toggleEditMode("emergencyContact")}
                        className="edit-section-btn"
                      >
                        <i className="fas fa-edit"></i>{" "}
                        {profile?.emergencyContact?.name ? "Edit" : "Add"}{" "}
                        Emergency Contact
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Address Tab */}
          <div
            className={`patient-tab-content ${
              activeTab === "address" ? "active" : ""
            }`}
          >
            <h2 className="patient-section-title">Address Information</h2>
            <div className="patient-form-section">
              {editMode.address ? (
                <div className="patient-form">
                  <div className="patient-form-group">
                    <label>Address</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Street address, apt, suite, etc."
                    />
                  </div>

                  <div className="patient-form-row">
                    <div className="patient-form-group">
                      <label>City</label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="City"
                      />
                    </div>
                    <div className="patient-form-group">
                      <label>State/Province</label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        placeholder="State or Province"
                      />
                    </div>
                  </div>

                  <div className="patient-form-row">
                    <div className="patient-form-group">
                      <label>ZIP/Postal Code</label>
                      <input
                        type="text"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        placeholder="ZIP or Postal code"
                      />
                    </div>
                    <div className="patient-form-group">
                      <label>Country</label>
                      <input
                        type="text"
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        placeholder="Country"
                      />
                    </div>
                  </div>

                  <div className="patient-form-actions">
                    <Button
                      variant="outline-secondary"
                      onClick={() => {
                        toggleEditMode("address");
                        fetchProfileData(); // Reset form data
                      }}
                      disabled={saving}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="outline-primary"
                      onClick={() => handleSaveChanges("address")}
                      loading={saving}
                    >
                      Save Changes
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="profile-view">
                  <div className="profile-card">
                    <div className="profile-details">
                      {profile?.user?.contact?.address?.street ? (
                        <>
                          <div className="detail-row">
                            <div className="detail-item">
                              <h4>Street Address</h4>
                              <p>{profile.user.contact.address.street}</p>
                            </div>
                          </div>

                          <div className="detail-row">
                            <div className="detail-item">
                              <h4>City</h4>
                              <p>
                                {profile.user.contact.address.city ||
                                  "Not specified"}
                              </p>
                            </div>
                            <div className="detail-item">
                              <h4>State/Province</h4>
                              <p>
                                {profile.user.contact.address.state ||
                                  "Not specified"}
                              </p>
                            </div>
                          </div>

                          <div className="detail-row">
                            <div className="detail-item">
                              <h4>ZIP/Postal Code</h4>
                              <p>
                                {profile.user.contact.address.zipCode ||
                                  "Not specified"}
                              </p>
                            </div>
                            <div className="detail-item">
                              <h4>Country</h4>
                              <p>
                                {profile.user.contact.address.country ||
                                  "Not specified"}
                              </p>
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="empty-state">
                          <i className="fas fa-exclamation-circle"></i>
                          <p>No address information provided</p>
                        </div>
                      )}

                      <Button
                        variant="outline-primary"
                        onClick={() => toggleEditMode("address")}
                        className="edit-section-btn"
                      >
                        <i className="fas fa-edit"></i>{" "}
                        {profile?.user?.contact?.address?.street
                          ? "Edit"
                          : "Add"}{" "}
                        Address
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Insurance Information Tab */}
          <div
            className={`patient-tab-content ${
              activeTab === "insurance" ? "active" : ""
            }`}
          >
            <h2 className="patient-section-title">Insurance Information</h2>
            <div className="patient-form-section">
              {editMode.insurance ? (
                <div className="patient-form">
                  <div className="patient-form-group">
                    <label>Insurance Provider</label>
                    <input
                      type="text"
                      name="insuranceInfo.provider"
                      value={formData.insuranceInfo.provider}
                      onChange={handleInputChange}
                      placeholder="Name of insurance company"
                    />
                  </div>

                  <div className="patient-form-row">
                    <div className="patient-form-group">
                      <label>Policy Number</label>
                      <input
                        type="text"
                        name="insuranceInfo.policyNumber"
                        value={formData.insuranceInfo.policyNumber}
                        onChange={handleInputChange}
                        placeholder="Insurance policy number"
                      />
                    </div>
                    <div className="patient-form-group">
                      <label>Group Number</label>
                      <input
                        type="text"
                        name="insuranceInfo.groupNumber"
                        value={formData.insuranceInfo.groupNumber}
                        onChange={handleInputChange}
                        placeholder="Insurance group number (if applicable)"
                      />
                    </div>
                  </div>

                  <div className="patient-form-group">
                    <label>Coverage Details</label>
                    <textarea
                      name="insuranceInfo.coverageDetails"
                      value={formData.insuranceInfo.coverageDetails}
                      onChange={handleInputChange}
                      rows="3"
                      placeholder="Please provide coverage details"
                    />
                  </div>

                  <div className="insurance-note">
                    <i className="fas fa-info-circle"></i>
                    <p>
                      Your insurance information helps us process claims
                      efficiently. Please ensure this information is accurate
                      and up to date.
                    </p>
                  </div>

                  <div className="patient-form-actions">
                    <Button
                      variant="outline-secondary"
                      onClick={() => {
                        toggleEditMode("insurance");
                        fetchProfileData(); // Reset form data
                      }}
                      disabled={saving}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="outline-primary"
                      onClick={() => handleSaveChanges("insurance")}
                      loading={saving}
                    >
                      Save Changes
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="profile-view">
                  <div className="profile-card">
                    <div className="profile-details">
                      {profile?.insuranceDetails?.provider ? (
                        <>
                          <div className="detail-row">
                            <div className="detail-item">
                              <h4>Insurance Provider</h4>
                              <p>{profile.insuranceDetails.provider}</p>
                            </div>
                          </div>

                          <div className="detail-row">
                            <div className="detail-item">
                              <h4>Policy Number</h4>
                              <p>
                                {profile.insuranceDetails.policyNumber ||
                                  "Not provided"}
                              </p>
                            </div>
                            <div className="detail-item">
                              <h4>Group Number</h4>
                              <p>
                                {profile.insuranceInfo?.groupNumber ||
                                  "Not provided"}
                              </p>
                            </div>
                          </div>

                          <div className="detail-item">
                            <h4>Coverage Details</h4>
                            <p>
                              {profile.insuranceDetails.coverageDetails ||
                                "No coverage details provided"}
                            </p>
                          </div>
                        </>
                      ) : (
                        <div className="empty-state">
                          <i className="fas fa-exclamation-circle"></i>
                          <p>No insurance information provided</p>
                        </div>
                      )}

                      <Button
                        variant="outline-primary"
                        onClick={() => toggleEditMode("insurance")}
                        className="edit-section-btn"
                      >
                        <i className="fas fa-edit"></i>{" "}
                        {profile?.insuranceDetails?.provider ? "Edit" : "Add"}{" "}
                        Insurance Information
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

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

export default Profile;
