import React, { useState, useEffect } from "react";
import patientAPI from "../../api/patient";
import Button from "../../components/common/Button";
import Spinner from "../../components/common/Spinner";
import "./Profile.css";

const Profile = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [activeTab, setActiveTab] = useState("personal");

  // Form states for each section
  const [personalInfo, setPersonalInfo] = useState({
    fullname: "",
    email: "",
    phone: "",
    address: "",
    dateOfBirth: "",
    gender: "",
  });

  const [medicalInfo, setMedicalInfo] = useState({
    bloodType: "",
    allergies: "",
    chronicConditions: "",
    currentMedications: "",
    medicalHistory: "",
    height: "",
    weight: "",
  });

  const [emergencyContact, setEmergencyContact] = useState({
    name: "",
    relationship: "",
    phone: "",
  });

  const [insuranceInfo, setInsuranceInfo] = useState({
    provider: "",
    policyNumber: "",
    coverageDetails: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await patientAPI.getProfile();
      if (response && response.data) {
        const profileData = response.data;
        setProfile(profileData);

        // Initialize personal info form
        setPersonalInfo({
          fullname: profileData.user?.fullname || "",
          email: profileData.user?.email || "",
          phone: profileData.user?.contact?.phone || "",
          address: profileData.user?.contact?.address || "",
          dateOfBirth: profileData.user?.dateOfBirth
            ? new Date(profileData.user.dateOfBirth).toISOString().split("T")[0]
            : "",
          gender: profileData.user?.gender || "",
        });

        // Initialize medical info form
        setMedicalInfo({
          bloodType: profileData.bloodType || "",
          allergies: (profileData.allergies || []).join(", "),
          chronicConditions: (profileData.chronicConditions || []).join(", "),
          currentMedications: (profileData.currentMedications || []).join(", "),
          medicalHistory: profileData.medicalHistory || "",
          height: profileData.height || "",
          weight: profileData.weight || "",
        });

        // Initialize emergency contact form (if exists)
        if (
          profileData.emergencyContacts &&
          profileData.emergencyContacts.length > 0
        ) {
          const primaryContact = profileData.emergencyContacts[0];
          setEmergencyContact({
            name: primaryContact.name || "",
            relationship: primaryContact.relationship || "",
            phone: primaryContact.phone || "",
          });
        }

        // Initialize insurance info form (if exists)
        if (profileData.insuranceDetails) {
          setInsuranceInfo({
            provider: profileData.insuranceDetails.provider || "",
            policyNumber: profileData.insuranceDetails.policyNumber || "",
            coverageDetails: profileData.insuranceDetails.coverageDetails || "",
          });
        }
      }
      setError(null);
    } catch (err) {
      console.error("Error fetching profile:", err);
      setError("Failed to load profile. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handlePersonalInfoChange = (e) => {
    const { name, value } = e.target;
    setPersonalInfo({
      ...personalInfo,
      [name]: value,
    });
  };

  const handleMedicalInfoChange = (e) => {
    const { name, value } = e.target;
    setMedicalInfo({
      ...medicalInfo,
      [name]: value,
    });
  };

  const handleEmergencyContactChange = (e) => {
    const { name, value } = e.target;
    setEmergencyContact({
      ...emergencyContact,
      [name]: value,
    });
  };

  const handleInsuranceInfoChange = (e) => {
    const { name, value } = e.target;
    setInsuranceInfo({
      ...insuranceInfo,
      [name]: value,
    });
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError(null);

      // Prepare data for API call
      const updatedProfile = {
        // User data
        user: {
          fullname: personalInfo.fullname,
          email: personalInfo.email,
          contact: {
            phone: personalInfo.phone,
            address: personalInfo.address,
          },
          dateOfBirth: personalInfo.dateOfBirth,
          gender: personalInfo.gender,
        },

        // Medical data
        bloodType: medicalInfo.bloodType,
        allergies: medicalInfo.allergies
          .split(",")
          .map((item) => item.trim())
          .filter((item) => item !== ""),
        chronicConditions: medicalInfo.chronicConditions
          .split(",")
          .map((item) => item.trim())
          .filter((item) => item !== ""),
        currentMedications: medicalInfo.currentMedications
          .split(",")
          .map((item) => item.trim())
          .filter((item) => item !== ""),
        medicalHistory: medicalInfo.medicalHistory,
        height: parseFloat(medicalInfo.height) || undefined,
        weight: parseFloat(medicalInfo.weight) || undefined,

        // Emergency contact
        emergencyContacts: [
          {
            name: emergencyContact.name,
            relationship: emergencyContact.relationship,
            phone: emergencyContact.phone,
          },
        ],

        // Insurance details
        insuranceDetails: {
          provider: insuranceInfo.provider,
          policyNumber: insuranceInfo.policyNumber,
          coverageDetails: insuranceInfo.coverageDetails,
        },
      };

      // Send update request
      const response = await patientAPI.updateProfile(updatedProfile);

      if (response && response.data) {
        setSuccess("Profile updated successfully!");
        setProfile(response.data);

        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(null), 3000);
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      setError(
        err.response?.data?.message ||
          "Failed to update profile. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return "";

    const dob = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();

    if (
      today.getMonth() < dob.getMonth() ||
      (today.getMonth() === dob.getMonth() && today.getDate() < dob.getDate())
    ) {
      age--;
    }

    return age;
  };

  if (loading) {
    return (
      <div className="loading-container">
        <Spinner center size="large" />
      </div>
    );
  }

  if (error && !profile) {
    return (
      <div className="error-container">
        <div className="alert alert-danger">{error}</div>
        <Button variant="primary" onClick={fetchProfile}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="patient-profile">
      <div className="profile-header">
        <h1 className="page-title">My Profile</h1>
        {success && <div className="alert alert-success">{success}</div>}
        {error && <div className="alert alert-danger">{error}</div>}
      </div>

      <div className="profile-content">
        <div className="profile-sidebar">
          <div className="profile-picture-container">
            {profile?.user?.profilePicture ? (
              <img
                src={profile.user.profilePicture}
                alt={profile.user.fullname}
                className="profile-picture"
              />
            ) : (
              <div className="profile-picture-placeholder">
                <i className="fas fa-user"></i>
              </div>
            )}

            <Button
              variant="outline-secondary"
              size="sm"
              className="change-picture-btn"
            >
              <i className="fas fa-camera"></i> Change Photo
            </Button>
          </div>

          <div className="profile-info-summary">
            <h2 className="patient-name">
              {profile?.user?.fullname || "Patient"}
            </h2>
            <p className="patient-email">
              <i className="fas fa-envelope"></i>{" "}
              {profile?.user?.email || "Email not provided"}
            </p>
            {profile?.user?.dateOfBirth && (
              <p className="patient-age">
                <i className="fas fa-birthday-cake"></i>{" "}
                {calculateAge(profile.user.dateOfBirth)} years old
              </p>
            )}
            {profile?.bloodType && (
              <p className="patient-blood-type">
                <i className="fas fa-tint"></i> Blood Type: {profile.bloodType}
              </p>
            )}
          </div>

          <div className="profile-navigation">
            <button
              className={`nav-item ${activeTab === "personal" ? "active" : ""}`}
              onClick={() => setActiveTab("personal")}
            >
              <i className="fas fa-user"></i> Personal Information
            </button>
            <button
              className={`nav-item ${activeTab === "medical" ? "active" : ""}`}
              onClick={() => setActiveTab("medical")}
            >
              <i className="fas fa-notes-medical"></i> Medical Information
            </button>
            <button
              className={`nav-item ${
                activeTab === "emergency" ? "active" : ""
              }`}
              onClick={() => setActiveTab("emergency")}
            >
              <i className="fas fa-phone-alt"></i> Emergency Contact
            </button>
            <button
              className={`nav-item ${
                activeTab === "insurance" ? "active" : ""
              }`}
              onClick={() => setActiveTab("insurance")}
            >
              <i className="fas fa-file-medical"></i> Insurance Information
            </button>
          </div>
        </div>

        <div className="profile-detail-container">
          <form onSubmit={handleSaveProfile}>
            {/* Personal Information Tab */}
            <div
              className={`tab-content ${
                activeTab === "personal" ? "active" : ""
              }`}
            >
              <h2 className="section-title">Personal Information</h2>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="fullname">Full Name</label>
                  <input
                    type="text"
                    id="fullname"
                    name="fullname"
                    value={personalInfo.fullname}
                    onChange={handlePersonalInfoChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={personalInfo.email}
                    onChange={handlePersonalInfoChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <input
                    type="text"
                    id="phone"
                    name="phone"
                    value={personalInfo.phone}
                    onChange={handlePersonalInfoChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="dateOfBirth">Date of Birth</label>
                  <input
                    type="date"
                    id="dateOfBirth"
                    name="dateOfBirth"
                    value={personalInfo.dateOfBirth}
                    onChange={handlePersonalInfoChange}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="gender">Gender</label>
                  <select
                    id="gender"
                    name="gender"
                    value={personalInfo.gender}
                    onChange={handlePersonalInfoChange}
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="prefer_not_to_say">Prefer not to say</option>
                  </select>
                </div>
                <div className="form-group"></div> {/* Empty for alignment */}
              </div>

              <div className="form-group">
                <label htmlFor="address">Address</label>
                <textarea
                  id="address"
                  name="address"
                  value={personalInfo.address}
                  onChange={handlePersonalInfoChange}
                  rows="3"
                ></textarea>
              </div>
            </div>

            {/* Medical Information Tab */}
            <div
              className={`tab-content ${
                activeTab === "medical" ? "active" : ""
              }`}
            >
              <h2 className="section-title">Medical Information</h2>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="bloodType">Blood Type</label>
                  <select
                    id="bloodType"
                    name="bloodType"
                    value={medicalInfo.bloodType}
                    onChange={handleMedicalInfoChange}
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
                    <option value="Unknown">Unknown</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="allergies">Allergies</label>
                  <input
                    type="text"
                    id="allergies"
                    name="allergies"
                    value={medicalInfo.allergies}
                    onChange={handleMedicalInfoChange}
                    placeholder="Separate with commas"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="height">Height (cm)</label>
                  <input
                    type="number"
                    id="height"
                    name="height"
                    value={medicalInfo.height}
                    onChange={handleMedicalInfoChange}
                    min="0"
                    step="0.1"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="weight">Weight (kg)</label>
                  <input
                    type="number"
                    id="weight"
                    name="weight"
                    value={medicalInfo.weight}
                    onChange={handleMedicalInfoChange}
                    min="0"
                    step="0.1"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="currentMedications">Current Medications</label>
                <textarea
                  id="currentMedications"
                  name="currentMedications"
                  value={medicalInfo.currentMedications}
                  onChange={handleMedicalInfoChange}
                  rows="2"
                  placeholder="Separate with commas"
                ></textarea>
              </div>

              <div className="form-group">
                <label htmlFor="chronicConditions">Chronic Conditions</label>
                <textarea
                  id="chronicConditions"
                  name="chronicConditions"
                  value={medicalInfo.chronicConditions}
                  onChange={handleMedicalInfoChange}
                  rows="2"
                  placeholder="Separate with commas"
                ></textarea>
              </div>

              <div className="form-group">
                <label htmlFor="medicalHistory">Medical History</label>
                <textarea
                  id="medicalHistory"
                  name="medicalHistory"
                  value={medicalInfo.medicalHistory}
                  onChange={handleMedicalInfoChange}
                  rows="4"
                  placeholder="Provide any relevant medical history"
                ></textarea>
              </div>
            </div>

            {/* Emergency Contact Tab */}
            <div
              className={`tab-content ${
                activeTab === "emergency" ? "active" : ""
              }`}
            >
              <h2 className="section-title">Emergency Contact</h2>

              <div className="form-group">
                <label htmlFor="name">Contact Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={emergencyContact.name}
                  onChange={handleEmergencyContactChange}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="relationship">Relationship</label>
                  <input
                    type="text"
                    id="relationship"
                    name="relationship"
                    value={emergencyContact.relationship}
                    onChange={handleEmergencyContactChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="emergencyPhone">Phone Number</label>
                  <input
                    type="text"
                    id="emergencyPhone"
                    name="phone"
                    value={emergencyContact.phone}
                    onChange={handleEmergencyContactChange}
                  />
                </div>
              </div>

              <div className="emergency-note">
                <i className="fas fa-info-circle"></i>
                This contact will only be used in case of emergency.
              </div>
            </div>

            {/* Insurance Information Tab */}
            <div
              className={`tab-content ${
                activeTab === "insurance" ? "active" : ""
              }`}
            >
              <h2 className="section-title">Insurance Information</h2>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="provider">Insurance Provider</label>
                  <input
                    type="text"
                    id="provider"
                    name="provider"
                    value={insuranceInfo.provider}
                    onChange={handleInsuranceInfoChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="policyNumber">Policy Number</label>
                  <input
                    type="text"
                    id="policyNumber"
                    name="policyNumber"
                    value={insuranceInfo.policyNumber}
                    onChange={handleInsuranceInfoChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="coverageDetails">Coverage Details</label>
                <textarea
                  id="coverageDetails"
                  name="coverageDetails"
                  value={insuranceInfo.coverageDetails}
                  onChange={handleInsuranceInfoChange}
                  rows="3"
                  placeholder="Enter any relevant insurance coverage details"
                ></textarea>
              </div>

              <div className="insurance-note">
                <i className="fas fa-info-circle"></i>
                Insurance information helps healthcare providers with billing.
              </div>
            </div>

            <div className="form-actions">
              <Button
                type="submit"
                variant="primary"
                loading={saving}
                disabled={saving}
              >
                <i className="fas fa-save"></i> Save Changes
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
