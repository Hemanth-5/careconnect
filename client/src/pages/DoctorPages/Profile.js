import React, { useState, useEffect } from "react";
import doctorAPI from "../../api/doctor";
import Button from "../../components/common/Button";
import Spinner from "../../components/common/Spinner";
import Modal from "../../components/common/Modal";
import Popup from "../../components/common/Popup";
import "./Profile.css";

const Profile = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [activeTab, setActiveTab] = useState("personal");
  const [allSpecializations, setAllSpecializations] = useState([]);
  const [showSpecializationsModal, setShowSpecializationsModal] =
    useState(false);

  // Form states for each section
  const [personalInfo, setPersonalInfo] = useState({
    fullname: "",
    email: "",
    phone: "",
    address: "",
    gender: "",
    bio: "",
  });

  const [popup, setPopup] = useState({
    show: false,
    message: "",
    title: "",
    type: "info",
  });

  const [professionalInfo, setProfessionalInfo] = useState({
    license: {
      number: "",
      expirationDate: "",
    },
    consultationFee: "",
    experience: "",
  });

  const [educationInfo, setEducationInfo] = useState({
    education: "",
  });

  const [specializations, setSpecializations] = useState([]);
  const [selectedSpecializations, setSelectedSpecializations] = useState([]);

  // Form state for availability
  const [availability, setAvailability] = useState([
    { day: "Monday", startTime: "00:00", endTime: "00:00", isAvailable: false },
    {
      day: "Tuesday",
      startTime: "00:00",
      endTime: "00:00",
      isAvailable: false,
    },
    {
      day: "Wednesday",
      startTime: "00:00",
      endTime: "00:00",
      isAvailable: false,
    },
    {
      day: "Thursday",
      startTime: "00:00",
      endTime: "00:00",
      isAvailable: false,
    },
    { day: "Friday", startTime: "00:00", endTime: "00:00", isAvailable: false },
    {
      day: "Saturday",
      startTime: "00:00",
      endTime: "00:00",
      isAvailable: false,
    },
    { day: "Sunday", startTime: "00:00", endTime: "00:00", isAvailable: false },
  ]);

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
    fetchProfile();
    fetchSpecializations();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await doctorAPI.getProfile();
      if (response && response.data) {
        const profileData = response.data;
        setProfile(profileData);

        // Initialize personal info form
        setPersonalInfo({
          fullname: profileData.user?.fullname || "",
          email: profileData.user?.email || "",
          phone: profileData.user?.contact?.phone || "",
          address: profileData.user?.contact?.address || "",
          gender: profileData.user?.gender || "",
          bio: profileData.bio || "",
        });

        // Initialize professional info form
        setProfessionalInfo({
          license: {
            number: profileData.license?.number || "",
            expirationDate: profileData.license?.expirationDate
              ? new Date(profileData.license.expirationDate)
                  .toISOString()
                  .split("T")[0]
              : "",
          },
          consultationFee: profileData.consultationFee || "",
          experience: profileData.experience || "",
        });

        // Initialize education info
        setEducationInfo({
          education: profileData.education || "",
        });

        // Set specializations
        if (profileData.specializations) {
          setSpecializations(profileData.specializations);
        }

        // Initialize availability if it exists
        if (profileData.availability && profileData.availability.length > 0) {
          // Map the existing availability to our structure
          const weekdays = [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
          ];
          const availabilityMap = weekdays.map((day) => {
            const existingSlot = profileData.availability.find(
              (slot) => slot.day === day
            );
            if (existingSlot) {
              return {
                day,
                startTime: existingSlot.startTime || "09:00",
                endTime: existingSlot.endTime || "17:00",
                isAvailable: existingSlot.isAvailable,
              };
            }
            return {
              day,
              startTime: "09:00",
              endTime: "17:00",
              isAvailable: day !== "Saturday" && day !== "Sunday",
            };
          });
          setAvailability(availabilityMap);
        }
      }
      setError(null);
    } catch (err) {
      console.error("Error fetching profile:", err);
      // setError("Failed to load profile. Please try again later.");
      showPopup("error", "Failed to load profile. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const fetchSpecializations = async () => {
    try {
      // This would come from an API call in a real implementation
      // For demo purposes, we'll use a static list if the API isn't ready
      const response = await doctorAPI.getSpecializations();
      setAllSpecializations(response.data);
      // Mock data
      // setAllSpecializations([
      //   { _id: "1", name: "Cardiology" },
      //   { _id: "2", name: "Dermatology" },
      //   { _id: "3", name: "Neurology" },
      //   { _id: "4", name: "Orthopedics" },
      //   { _id: "5", name: "Pediatrics" },
      //   { _id: "6", name: "Psychiatry" },
      //   { _id: "7", name: "Radiology" },
      //   { _id: "8", name: "Surgery" },
      //   { _id: "9", name: "Urology" },
      //   { _id: "10", name: "Family Medicine" },
      // ]);
    } catch (err) {
      console.error("Error fetching specializations:", err);
    }
  };

  const handlePersonalInfoChange = (e) => {
    const { name, value } = e.target;
    setPersonalInfo({
      ...personalInfo,
      [name]: value,
    });
  };

  const handleProfessionalInfoChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("license.")) {
      const licenseField = name.split(".")[1];
      setProfessionalInfo({
        ...professionalInfo,
        license: {
          ...professionalInfo.license,
          [licenseField]: value,
        },
      });
    } else {
      setProfessionalInfo({
        ...professionalInfo,
        [name]: value,
      });
    }
  };

  const handleEducationInfoChange = (e) => {
    const { name, value } = e.target;
    setEducationInfo({
      ...educationInfo,
      [name]: value,
    });
  };

  const handleOpenSpecializationsModal = () => {
    // Initialize selected specializations
    const initialSelected = specializations.map((spec) => spec._id);
    setSelectedSpecializations(initialSelected);
    setShowSpecializationsModal(true);
  };

  const handleSpecializationChange = (specId) => {
    if (selectedSpecializations.includes(specId)) {
      setSelectedSpecializations(
        selectedSpecializations.filter((id) => id !== specId)
      );
    } else {
      setSelectedSpecializations([...selectedSpecializations, specId]);
    }
  };

  const handleSaveSpecializations = async () => {
    try {
      setSaving(true);

      // Find IDs to add and remove
      const currentIds = specializations.map((spec) => spec._id);
      const toAdd = selectedSpecializations.filter(
        (id) => !currentIds.includes(id)
      );
      const toRemove = currentIds.filter(
        (id) => !selectedSpecializations.includes(id)
      );

      console.log(toAdd);
      if (toAdd.length > 0) {
        await doctorAPI.assignSpecializations(toAdd);
      }

      if (toRemove.length > 0) {
        await doctorAPI.removeSpecializations(toRemove);
      }

      setShowSpecializationsModal(false);
      fetchProfile(); // Refresh data
      // setSuccess("Specializations updated successfully!");
      showPopup("success", "Specializations updated successfully!");

      // Clear success message after 3 seconds
      // setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error("Error updating specializations:", err);
      // setError("Failed to update specializations. Please try again.");
      showPopup("error", "Failed to update specializations. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleAvailabilityChange = (index, field, value) => {
    const updatedAvailability = [...availability];

    if (field === "isAvailable") {
      updatedAvailability[index].isAvailable =
        !updatedAvailability[index].isAvailable;
    } else {
      updatedAvailability[index][field] = value;
    }

    setAvailability(updatedAvailability);
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
          gender: personalInfo.gender,
        },

        // Professional data
        bio: personalInfo.bio,
        license: {
          number: professionalInfo.license.number,
          expirationDate: professionalInfo.license.expirationDate,
        },
        consultationFee: parseFloat(professionalInfo.consultationFee) || 0,
        experience: parseInt(professionalInfo.experience) || 0,
        education: educationInfo.education,

        // Availability data
        availability: availability,
      };

      // Send update request
      const response = await doctorAPI.updateProfile(updatedProfile);

      if (response && response.data) {
        // setSuccess("Profile updated successfully!");
        showPopup("success", "Profile updated successfully!");
        setProfile(response.data);

        // Clear success message after 3 seconds
        // setTimeout(() => setSuccess(null), 3000);
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      // setError(
      //   err.response?.data?.message ||
      //     "Failed to update profile. Please try again."
      // );
      showPopup(
        "error",
        err.response?.data?.message ||
          "Failed to update profile. Please try again."
      );
    } finally {
      setSaving(false);
    }
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
    <div className="doctor-profile">
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
                <i className="fas fa-user-md"></i>
              </div>
            )}

            {/* <Button
              variant="outline-secondary"
              size="sm"
              className="change-picture-btn"
            >
              <i className="fas fa-camera"></i> Change Photo
            </Button> */}
          </div>

          <div className="profile-info-summary">
            <h2 className="doctor-name">
              Dr. {profile?.user?.fullname || "Doctor"}
            </h2>
            <p className="doctor-email">
              <i className="fas fa-envelope"></i>{" "}
              {profile?.user?.email || "Email not provided"}
            </p>
            <p className="doctor-specializations">
              <i className="fas fa-stethoscope"></i>
              {specializations.length > 0
                ? specializations.map((s) => s.name).join(", ")
                : "No specializations"}
            </p>
            {profile?.license?.number && (
              <p className="doctor-license">
                <i className="fas fa-id-card"></i> License:{" "}
                {profile.license.number}
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
              className={`nav-item ${
                activeTab === "professional" ? "active" : ""
              }`}
              onClick={() => setActiveTab("professional")}
            >
              <i className="fas fa-user-md"></i> Professional Information
            </button>
            <button
              className={`nav-item ${
                activeTab === "education" ? "active" : ""
              }`}
              onClick={() => setActiveTab("education")}
            >
              <i className="fas fa-graduation-cap"></i> Education & Experience
            </button>
            <button
              className={`nav-item ${
                activeTab === "specializations" ? "active" : ""
              }`}
              onClick={() => setActiveTab("specializations")}
            >
              <i className="fas fa-stethoscope"></i> Specializations
            </button>
            <button
              className={`nav-item ${
                activeTab === "availability" ? "active" : ""
              }`}
              onClick={() => setActiveTab("availability")}
            >
              <i className="fas fa-calendar-alt"></i> Availability
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

              <div className="form-group">
                <label htmlFor="bio">Professional Bio</label>
                <textarea
                  id="bio"
                  name="bio"
                  value={personalInfo.bio}
                  onChange={handlePersonalInfoChange}
                  rows="4"
                  placeholder="Provide a short professional bio for patients to see"
                ></textarea>
              </div>
            </div>

            {/* Professional Information Tab */}
            <div
              className={`tab-content ${
                activeTab === "professional" ? "active" : ""
              }`}
            >
              <h2 className="section-title">Professional Information</h2>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="license.number">License Number</label>
                  <input
                    type="text"
                    id="license.number"
                    name="license.number"
                    value={professionalInfo.license.number}
                    onChange={handleProfessionalInfoChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="license.expirationDate">
                    License Expiration Date
                  </label>
                  <input
                    type="date"
                    id="license.expirationDate"
                    name="license.expirationDate"
                    value={professionalInfo.license.expirationDate}
                    onChange={handleProfessionalInfoChange}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="consultationFee">Consultation Fee ($)</label>
                  <input
                    type="number"
                    id="consultationFee"
                    name="consultationFee"
                    value={professionalInfo.consultationFee}
                    onChange={handleProfessionalInfoChange}
                    min="0"
                    step="0.01"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="experience">Years of Experience</label>
                  <input
                    type="number"
                    id="experience"
                    name="experience"
                    value={professionalInfo.experience}
                    onChange={handleProfessionalInfoChange}
                    min="0"
                  />
                </div>
              </div>

              <div className="professional-note">
                <i className="fas fa-info-circle"></i>
                Professional information helps patients make informed decisions.
              </div>
            </div>

            {/* Education & Experience Tab */}
            <div
              className={`tab-content ${
                activeTab === "education" ? "active" : ""
              }`}
            >
              <h2 className="section-title">Education & Experience</h2>

              <div className="form-group">
                <label htmlFor="education">Education & Qualifications</label>
                <textarea
                  id="education"
                  name="education"
                  value={educationInfo.education}
                  onChange={handleEducationInfoChange}
                  rows="6"
                  placeholder="List your degrees, certifications, and qualifications"
                ></textarea>
              </div>

              <div className="education-note">
                <i className="fas fa-info-circle"></i>
                Include relevant education details, such as medical school,
                residency, fellowships, and certifications.
              </div>
            </div>

            {/* Specializations Tab */}
            <div
              className={`tab-content ${
                activeTab === "specializations" ? "active" : ""
              }`}
            >
              <h2 className="section-title">Specializations</h2>

              <div className="specializations-container">
                {specializations.length > 0 ? (
                  <div className="specializations-list">
                    {specializations.map((spec) => (
                      <div key={spec._id} className="specialization-item">
                        <i className="fas fa-check-circle"></i>
                        <span>{spec.name}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="no-specializations">
                    <p>You haven't added any specializations yet.</p>
                  </div>
                )}

                <Button
                  variant="outline-primary"
                  onClick={handleOpenSpecializationsModal}
                  className="specializations-btn"
                >
                  <i className="fas fa-edit"></i> Manage Specializations
                </Button>
              </div>

              <div className="specializations-note">
                <i className="fas fa-info-circle"></i>
                Your specializations help patients find you when they're looking
                for specific medical care.
              </div>
            </div>

            {/* Availability Tab */}
            <div
              className={`tab-content ${
                activeTab === "availability" ? "active" : ""
              }`}
            >
              <h2 className="section-title">Availability Schedule</h2>
              <p className="availability-description">
                Set your working hours for each day of the week. Patients will
                only be able to book appointments during these hours.
              </p>

              <div className="availability-container">
                {availability.map((slot, index) => (
                  <div className="availability-day-card" key={slot.day}>
                    <div className="day-header">
                      <h3>{slot.day}</h3>
                      <label className="toggle-switch">
                        <input
                          type="checkbox"
                          checked={slot.isAvailable}
                          onChange={() =>
                            handleAvailabilityChange(index, "isAvailable")
                          }
                        />
                        <span className="toggle-slider"></span>
                        <span className="toggle-label">
                          {slot.isAvailable ? "Available" : "Unavailable"}
                        </span>
                      </label>
                    </div>

                    <div
                      className={`time-slots ${
                        !slot.isAvailable ? "disabled" : ""
                      }`}
                    >
                      <div className="time-slot">
                        <label>Start Time</label>
                        <input
                          type="time"
                          value={slot.startTime}
                          onChange={(e) =>
                            handleAvailabilityChange(
                              index,
                              "startTime",
                              e.target.value
                            )
                          }
                          disabled={!slot.isAvailable}
                        />
                      </div>
                      <div className="time-slot">
                        <label>End Time</label>
                        <input
                          type="time"
                          value={slot.endTime}
                          onChange={(e) =>
                            handleAvailabilityChange(
                              index,
                              "endTime",
                              e.target.value
                            )
                          }
                          disabled={!slot.isAvailable}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="form-actions">
              <Button
                type="submit"
                variant="outline-primary"
                loading={saving}
                disabled={saving}
              >
                <i className="fas fa-save"></i> Save Changes
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* Specializations Modal */}
      {showSpecializationsModal && (
        <Modal
          title="Manage Specializations"
          onClose={() => setShowSpecializationsModal(false)}
        >
          <div className="specializations-modal">
            <p className="modal-instructions">
              Select all specializations that apply to your practice:
            </p>

            <div className="specializations-checkbox-list">
              {allSpecializations.map((spec) => (
                <div key={spec._id} className="specialization-checkbox">
                  <input
                    type="checkbox"
                    id={`spec-${spec._id}`}
                    checked={selectedSpecializations.includes(spec._id)}
                    onChange={() => handleSpecializationChange(spec._id)}
                  />
                  <label htmlFor={`spec-${spec._id}`}>{spec.name}</label>
                </div>
              ))}
            </div>

            <div className="modal-actions">
              <Button
                variant="secondary"
                onClick={() => setShowSpecializationsModal(false)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleSaveSpecializations}
                loading={saving}
                disabled={saving}
              >
                Save Specializations
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

export default Profile;
