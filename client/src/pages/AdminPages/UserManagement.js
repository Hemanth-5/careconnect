import React, { useState, useEffect } from "react";
import adminAPI from "../../api/admin";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import "./UserManagement.css";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");

  // Enhanced form state for adding/editing user
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    fullname: "",
    role: "patient",
    gender: "",
    dateOfBirth: "",
    // profilePicture: "",
    contact: {
      phone: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
    },
    // Doctor specific fields
    license: {
      number: "",
      expirationDate: "",
    },
    specializations: [],
    experience: "",
    education: "",
    consultationFee: "",
    bio: "",
    // Patient specific fields
    bloodType: "",
    allergies: "",
    medicalHistory: "",
    height: "",
    weight: "",
    currentMedications: "",
    chronicConditions: "",
  });

  // Get specializations for doctors
  const [availableSpecializations, setAvailableSpecializations] = useState([]);

  useEffect(() => {
    fetchUsers();
    fetchSpecializations();
  }, []);

  const fetchSpecializations = async () => {
    try {
      const response = await adminAPI.getSpecializations();
      setAvailableSpecializations(response.data || []);
    } catch (err) {
      console.error("Error fetching specializations:", err);
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getAllUsers();
      setUsers(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Failed to load users. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddUserModal = () => {
    setFormData({
      username: "",
      email: "",
      password: "",
      fullname: "",
      role: "patient",
      gender: "",
      dateOfBirth: "",
      profilePicture: "",
      contact: {
        phone: "",
        address: "",
        city: "",
        state: "",
        zipCode: "",
        country: "",
      },
      // Doctor specific fields
      license: {
        number: "",
        expirationDate: "",
      },
      specializations: [],
      experience: "",
      education: "",
      consultationFee: "",
      bio: "",
      // Patient specific fields
      bloodType: "",
      allergies: "",
      medicalHistory: "",
      height: "",
      weight: "",
      currentMedications: "",
      chronicConditions: "",
    });
    setSelectedUser(null);
    setShowAddUserModal(true);
  };

  const handleOpenEditUserModal = (user) => {
    // First, set up the base user data
    const baseFormData = {
      email: user.email || "",
      password: "", // Don't pre-fill password
      fullname: user.fullname || "",
      role: user.role || "patient",
      gender: user.gender || "",
      // profilePicture: user.profilePicture || "",
      dateOfBirth: user.dateOfBirth
        ? new Date(user.dateOfBirth).toISOString().split("T")[0]
        : "",
      contact: {
        phone: user.contact?.phone || "",
        address: user.contact?.address || "",
        city: user.contact?.city || "",
        state: user.contact?.state || "",
        zipCode: user.contact?.zipCode || "",
        country: user.contact?.country || "",
      },
      // Initialize with empty values for all role-specific fields
      license: { number: "", expirationDate: "" },
      specializations: [],
      experience: "",
      education: "",
      consultationFee: "",
      bio: "",
      bloodType: "",
      allergies: "",
      medicalHistory: "",
      height: "",
      weight: "",
      currentMedications: "",
      chronicConditions: "",
    };

    setFormData(baseFormData);
    setSelectedUser(user);
    setShowAddUserModal(true);

    // If this is a doctor or patient, fetch their specific details
    if (user.role === "doctor") {
      fetchDoctorDetails(user._id);
    } else if (user.role === "patient") {
      fetchPatientDetails(user._id);
    }
  };

  const fetchDoctorDetails = async (userId) => {
    try {
      // Get all doctors and find the one matching this user
      const response = await adminAPI.getAllDoctors();
      const doctorData = response.data.find(
        (doctor) => doctor.user && doctor.user._id === userId
      );

      if (doctorData) {
        setFormData((prevData) => ({
          ...prevData,
          license: {
            number: doctorData.license?.number || "",
            expirationDate: doctorData.license?.expirationDate
              ? new Date(doctorData.license.expirationDate)
                  .toISOString()
                  .split("T")[0]
              : "",
          },
          specializations:
            doctorData.specializations?.map((spec) =>
              // Handle both cases where spec might be an object or just an ID
              typeof spec === "object" && spec._id ? spec._id : spec
            ) || [],
          experience: doctorData.experience || "",
          education: doctorData.education || "",
          consultationFee: doctorData.consultationFee || "",
          bio: doctorData.bio || "",
        }));
      }
    } catch (err) {
      console.error("Error fetching doctor details:", err);
    }
  };

  const fetchPatientDetails = async (userId) => {
    try {
      const response = await adminAPI.getAllPatients();
      const patientData = response.data.find(
        (patient) => patient.user && patient.user._id === userId
      );

      if (patientData) {
        setFormData((prevData) => ({
          ...prevData,
          bloodType: patientData.bloodType || "",
          allergies: Array.isArray(patientData.allergies)
            ? patientData.allergies.join(", ")
            : patientData.allergies || "",
          medicalHistory: patientData.medicalHistory || "",
          height: patientData.height || "",
          weight: patientData.weight || "",
          currentMedications: Array.isArray(patientData.currentMedications)
            ? patientData.currentMedications.join(", ")
            : patientData.currentMedications || "",
          chronicConditions: Array.isArray(patientData.chronicConditions)
            ? patientData.chronicConditions.join(", ")
            : patientData.chronicConditions || "",
        }));
      }
    } catch (err) {
      console.error("Error fetching patient details:", err);
    }
  };

  const handleCloseModal = () => {
    setShowAddUserModal(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Handle nested fields (contact info)
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prevData) => ({
        ...prevData,
        [parent]: {
          ...prevData[parent],
          [child]: value,
        },
      }));
    } else if (name === "specializations") {
      // Handle multi-select for specializations
      const options = e.target.options;
      const selectedValues = [];
      for (let i = 0; i < options.length; i++) {
        if (options[i].selected) {
          selectedValues.push(options[i].value);
        }
      }
      setFormData((prevData) => ({
        ...prevData,
        specializations: selectedValues,
      }));
    } else if (name === "profilePicture") {
      // Handle file upload for profile picture
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFormData((prevData) => ({
            ...prevData,
            profilePicture: reader.result,
          }));
        };
        reader.readAsDataURL(file);
      }
    } else {
      // Handle regular fields
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare the data according to the API requirements
    const userData = {
      email: formData.email,
      password: formData.password,
      fullname: formData.fullname,
      role: formData.role,
      gender: formData.gender,
      // profilePicture: formData.profilePicture,
      dateOfBirth: formData.dateOfBirth || undefined,
      contact: formData.contact,
    };

    // Role-specific data to be processed separately
    const doctorData =
      formData.role === "doctor"
        ? {
            license: formData.license,
            specializations: formData.specializations,
            experience: formData.experience
              ? Number(formData.experience)
              : undefined,
            education: formData.education,
            consultationFee: formData.consultationFee
              ? Number(formData.consultationFee)
              : undefined,
            bio: formData.bio,
          }
        : null;

    const patientData =
      formData.role === "patient"
        ? {
            bloodType: formData.bloodType,
            allergies: formData.allergies
              ? formData.allergies.split(",").map((item) => item.trim())
              : [],
            medicalHistory: formData.medicalHistory,
            height: formData.height ? Number(formData.height) : undefined,
            weight: formData.weight ? Number(formData.weight) : undefined,
            currentMedications: formData.currentMedications
              ? formData.currentMedications
                  .split(",")
                  .map((item) => item.trim())
              : [],
            chronicConditions: formData.chronicConditions
              ? formData.chronicConditions.split(",").map((item) => item.trim())
              : [],
          }
        : null;

    try {
      setLoading(true);

      if (selectedUser) {
        // Edit existing user
        // For the user interface, simulate the update
        const updatedUsers = users.map((user) =>
          user._id === selectedUser._id ? { ...user, ...userData } : user
        );
        setUsers(updatedUsers);

        // Update user via API
        await adminAPI.updateUser(selectedUser._id, userData);
        // console.log("User updated:", response.data);

        // Update role-specific data based on the selected user's role
        if (selectedUser.role === "doctor" && doctorData) {
          try {
            // Find the doctor profile associated with this user
            const doctorsResponse = await adminAPI.getAllDoctors();
            const doctorProfile = doctorsResponse.data.find(
              (doc) => doc.user && doc.user._id === selectedUser._id
            );

            if (doctorProfile && doctorProfile._id) {
              // Update the doctor profile
              const doctorResponse = await adminAPI.updateDoctor(
                doctorProfile._id,
                {
                  ...doctorData,
                }
              );
              console.log("Doctor profile updated:", doctorResponse.data);
            } else {
              console.error("Doctor profile not found for this user");
              setError("Could not find doctor profile to update.");
            }
          } catch (doctorErr) {
            console.error("Error updating doctor profile:", doctorErr);
            setError("Failed to update doctor profile.");
          }
        } else if (selectedUser.role === "patient" && patientData) {
          try {
            // Find the patient profile associated with this user
            const patientsResponse = await adminAPI.getAllPatients();
            const patientProfile = patientsResponse.data.find(
              (patient) => patient.user && patient.user._id === selectedUser._id
            );

            if (patientProfile && patientProfile._id) {
              // Update the patient profile
              const patientResponse = await adminAPI.updatePatient(
                patientProfile._id,
                {
                  ...patientData,
                }
              );
              console.log("Patient profile updated:", patientResponse.data);
            } else {
              console.error("Patient profile not found for this user");
              setError("Could not find patient profile to update.");
            }
          } catch (patientErr) {
            console.error("Error updating patient profile:", patientErr);
            setError("Failed to update patient profile.");
          }
        }
      } else {
        // Add new user with improved handling
        console.log(userData);
        const { email, password, role } = userData;
        const response = await adminAPI.registerUser({ email, password, role });

        if (!response.data) {
          throw new Error("Failed to create user - no data returned");
        }

        // Get the newly created user ID
        const newUserId = response.data.user._id;

        if (!newUserId) {
          throw new Error("Failed to get new user ID");
        }

        // Update with user specific data
        const userResponse = await adminAPI.updateUser(newUserId, userData);
        if (!userResponse.data) {
          throw new Error("Failed to update user with additional data");
        }

        // Refresh the user list to get the complete data
        await fetchUsers();

        // Get the doctor/patient ID based on role
        if (formData.role === "doctor" && doctorData) {
          try {
            // Find the new doctor profile
            const doctorsResponse = await adminAPI.getAllDoctors();
            const doctorProfile = doctorsResponse.data.find(
              (doc) =>
                doc.user &&
                (doc.user._id === newUserId || doc.user === newUserId)
            );

            if (!doctorProfile) {
              console.error("Doctor profile not found after user creation");
              setError(
                "User created but couldn't find doctor profile to update."
              );
              setShowAddUserModal(false);
              return;
            }

            // Update the doctor profile with the additional data
            const doctorResponse = await adminAPI.updateDoctor(
              doctorProfile._id,
              doctorData
            );

            // console.log("Doctor profile updated:", doctorResponse.data);
          } catch (doctorErr) {
            console.error("Error updating doctor profile:", doctorErr);
            setError("User created but failed to set up doctor profile.");
          }
        }

        if (formData.role === "patient" && patientData) {
          try {
            // Find the new patient profile
            const patientsResponse = await adminAPI.getAllPatients();
            const patientProfile = patientsResponse.data.find(
              (patient) =>
                patient.user &&
                (patient.user._id === newUserId || patient.user === newUserId)
            );

            if (!patientProfile) {
              console.error("Patient profile not found after user creation");
              setError(
                "User created but couldn't find patient profile to update."
              );
              setShowAddUserModal(false);
              return;
            }

            // Update the patient profile with the additional data
            const patientResponse = await adminAPI.updatePatient(
              patientProfile._id,
              patientData
            );

            console.log("Patient profile updated:", patientResponse.data);
          } catch (patientErr) {
            console.error("Error updating patient profile:", patientErr);
            setError("User created but failed to set up patient profile.");
          }
        }
      }

      // Refresh the user list to show the updated data
      await fetchUsers();
      setShowAddUserModal(false);
      setError(null);
    } catch (err) {
      console.error("Error saving user:", err);
      setError(
        err.response?.data?.message || "Failed to save user. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      setLoading(true);
      // Using adminAPI from api/admin.js that uses the core api client
      await adminAPI.deleteUser(userId);
      setUsers(users.filter((user) => user._id !== userId));
      setError(null);
    } catch (err) {
      console.error("Error deleting user:", err);
      setError(
        err.response?.data?.message ||
          "Failed to delete user. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Filter users based on search and role filter
  const filteredUsers = users.filter((user) => {
    // Prioritize username in search
    const userUsername = user.username || "";
    const userName = user.name || "";
    const userEmail = user.email || "";

    const matchesSearch =
      userUsername.toLowerCase().includes(searchTerm.toLowerCase()) ||
      userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      userEmail.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = filterRole === "all" || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  // Render the form fields based on the selected role
  const renderRoleSpecificFields = () => {
    switch (formData.role) {
      case "doctor":
        return (
          <>
            <h3 className="form-section-title">Doctor Details</h3>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="license.number">License Number</label>
                <input
                  type="text"
                  id="license.number"
                  name="license.number"
                  value={formData.license.number}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="license.expirationDate">
                  License Expiration
                </label>
                <input
                  type="date"
                  id="license.expirationDate"
                  name="license.expirationDate"
                  value={formData.license.expirationDate}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="specializations">Specializations</label>
              <select
                id="specializations"
                name="specializations"
                multiple
                value={formData.specializations}
                onChange={handleInputChange}
                className="multi-select"
              >
                {availableSpecializations.map((spec) => (
                  <option key={spec._id} value={spec._id}>
                    {spec.name}
                  </option>
                ))}
              </select>
              <small className="form-text">
                Hold Ctrl/Cmd to select multiple specializations
              </small>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="experience">Experience (years)</label>
                <input
                  type="number"
                  id="experience"
                  name="experience"
                  min="0"
                  value={formData.experience}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="consultationFee">Consultation Fee ($)</label>
                <input
                  type="number"
                  id="consultationFee"
                  name="consultationFee"
                  min="0"
                  step="0.01"
                  value={formData.consultationFee}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="education">Education</label>
              <input
                type="text"
                id="education"
                name="education"
                value={formData.education}
                onChange={handleInputChange}
                placeholder="e.g., MD from Harvard Medical School"
              />
            </div>

            <div className="form-group">
              <label htmlFor="bio">Professional Bio</label>
              <textarea
                id="bio"
                name="bio"
                rows="3"
                value={formData.bio}
                onChange={handleInputChange}
                placeholder="Brief professional biography"
              ></textarea>
            </div>
          </>
        );
      case "patient":
        return (
          <>
            <h3 className="form-section-title">Patient Details</h3>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="bloodType">Blood Type</label>
                <select
                  id="bloodType"
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
                  <option value="Unknown">Unknown</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="height">Height (cm)</label>
                <input
                  type="number"
                  id="height"
                  name="height"
                  min="0"
                  value={formData.height}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="weight">Weight (kg)</label>
                <input
                  type="number"
                  id="weight"
                  name="weight"
                  min="0"
                  value={formData.weight}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="allergies">Allergies</label>
              <input
                type="text"
                id="allergies"
                name="allergies"
                value={formData.allergies}
                onChange={handleInputChange}
                placeholder="Separate with commas (e.g., Penicillin, Peanuts)"
              />
            </div>

            <div className="form-group">
              <label htmlFor="currentMedications">Current Medications</label>
              <input
                type="text"
                id="currentMedications"
                name="currentMedications"
                value={formData.currentMedications}
                onChange={handleInputChange}
                placeholder="Separate with commas (e.g., Aspirin, Insulin)"
              />
            </div>

            <div className="form-group">
              <label htmlFor="chronicConditions">Chronic Conditions</label>
              <input
                type="text"
                id="chronicConditions"
                name="chronicConditions"
                value={formData.chronicConditions}
                onChange={handleInputChange}
                placeholder="Separate with commas (e.g., Diabetes, Hypertension)"
              />
            </div>

            <div className="form-group">
              <label htmlFor="medicalHistory">Medical History</label>
              <textarea
                id="medicalHistory"
                name="medicalHistory"
                rows="3"
                value={formData.medicalHistory}
                onChange={handleInputChange}
                placeholder="Any relevant medical history..."
              ></textarea>
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="user-management">
      <div className="page-header">
        <h1 className="page-title">User Management</h1>
        <div className="page-actions">
          <Button
            variant="secondary"
            onClick={fetchUsers}
            disabled={loading}
            className="refresh-button"
          >
            <i className="fas fa-sync-alt"></i> Refresh
          </Button>
          <Button
            variant="outline-primary"
            onClick={handleOpenAddUserModal}
            disabled={loading}
          >
            <i className="fas fa-plus"></i> Add New User
          </Button>
        </div>
      </div>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="filter-bar">
        <div className="search-box">
          <i className="fas fa-search search-icon"></i>
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="role-filter">
          <label htmlFor="role-filter">Filter by role:</label>
          <select
            id="role-filter"
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
          >
            <option value="all">All roles</option>
            <option value="admin">Admin</option>
            <option value="doctor">Doctor</option>
            <option value="patient">Patient</option>
          </select>
        </div>
      </div>

      {loading && !showAddUserModal ? (
        <div className="loading-container">
          <div className="spinner"></div>
        </div>
      ) : (
        <div className="users-table-container">
          <table className="users-table">
            <thead>
              <tr>
                <th>Profile</th>
                <th>Username</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user._id}>
                    <td>
                      <div className="user-avatar">
                        {/* {user.profilePicture ? ( */}
                        <img
                          src={user.profilePicture}
                          alt={`${user.fullname || "User"} profile`}
                          className="profile-picture"
                        />
                        {/* ) : (
                          <div className="profile-placeholder">
                            {(user.fullname || user.username || "U")
                              .charAt(0)
                              .toUpperCase()}
                          </div>
                        )} */}
                      </div>
                    </td>
                    <td>{user.username || "N/A"}</td>
                    <td>{user.fullname || "N/A"}</td>
                    <td>{user.email || "N/A"}</td>
                    <td>
                      <span
                        className={`role-badge role-${user.role || "unknown"}`}
                      >
                        {user.role
                          ? user.role.charAt(0).toUpperCase() +
                            user.role.slice(1)
                          : "Unknown"}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`status-badge status-${
                          user.isActive ? "active" : "inactive"
                        }`}
                      >
                        {user.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="actions-cell">
                      <button
                        className="action-btn edit-btn"
                        onClick={() => handleOpenEditUserModal(user)}
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button
                        className="action-btn delete-btn"
                        onClick={() => handleDeleteUser(user._id)}
                      >
                        <i className="fas fa-trash-alt"></i>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="no-results">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Add/Edit User Modal */}
      {showAddUserModal && (
        <div className="modal-overlay">
          <div className="modal user-form-modal">
            <div className="modal-header">
              <h2>{selectedUser ? "Edit User" : "Add New User"}</h2>
              <button className="close-btn" onClick={handleCloseModal}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <h3 className="form-section-title">Basic Information</h3>

                {/* <div className="form-group profile-upload-container">
                  <label htmlFor="profilePicture">Profile Picture</label>
                  <div className="profile-preview">
                    {formData.profilePicture ? (
                      <img 
                        src={formData.profilePicture} 
                        alt="Profile preview" 
                        className="profile-image-preview" 
                      />
                    ) : (
                      <div className="profile-placeholder-large">
                        <i className="fas fa-user"></i>
                      </div>
                    )}
                  </div>
                  <input
                    type="file"
                    id="profilePicture"
                    name="profilePicture"
                    accept="image/*"
                    onChange={handleInputChange}
                    className="file-input"
                  />
                  <label htmlFor="profilePicture" className="file-input-label">
                    <i className="fas fa-upload"></i> {formData.profilePicture ? 'Change Photo' : 'Upload Photo'}
                  </label>
                </div> */}

                <div className="form-row">
                  {/* <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input
                      type="text"
                      id="username"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      required
                    />
                  </div> */}

                  {/* This email should be either diabled or not, based on add use or update user */}
                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      disabled={selectedUser}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="fullname">Full Name</label>
                  <input
                    type="text"
                    id="fullname"
                    name="fullname"
                    value={formData.fullname}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="password">
                    Password {selectedUser && "(leave blank to keep current)"}
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required={!selectedUser}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="role">Role</label>
                    <select
                      id="role"
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="admin">Admin</option>
                      <option value="doctor">Doctor</option>
                      <option value="patient">Patient</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="gender">Gender</label>
                    <select
                      id="gender"
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                      <option value="prefer not to say">
                        Prefer not to say
                      </option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="dateOfBirth">Date of Birth</label>
                    <input
                      type="date"
                      id="dateOfBirth"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <h3 className="form-section-title">Contact Information</h3>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="contact.phone">Phone</label>
                    <input
                      type="tel"
                      id="contact.phone"
                      name="contact.phone"
                      value={formData.contact.phone}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="contact.address">Address</label>
                    <input
                      type="text"
                      id="contact.address"
                      name="contact.address"
                      value={formData.contact.address}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="contact.city">City</label>
                    <input
                      type="text"
                      id="contact.city"
                      name="contact.city"
                      value={formData.contact.city}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="contact.state">State/Province</label>
                    <input
                      type="text"
                      id="contact.state"
                      name="contact.state"
                      value={formData.contact.state}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="contact.zipCode">Zip/Postal Code</label>
                    <input
                      type="text"
                      id="contact.zipCode"
                      name="contact.zipCode"
                      value={formData.contact.zipCode}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="contact.country">Country</label>
                    <input
                      type="text"
                      id="contact.country"
                      name="contact.country"
                      value={formData.contact.country}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                {/* Render role-specific fields */}
                {renderRoleSpecificFields()}

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
                    {selectedUser ? "Update User" : "Add User"}
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

export default UserManagement;
