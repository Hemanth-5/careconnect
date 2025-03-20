import React, { useState, useEffect } from "react";
import doctorAPI from "../../api/doctor";
import userAPI from "../../api/user";
import Button from "../../components/common/Button";
import Spinner from "../../components/common/Spinner";
import "./Profile.css";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [editMode, setEditMode] = useState(false);

  // Profile form state
  const [formData, setFormData] = useState({
    bio: "",
    education: "",
    experience: "",
    license: {
      number: "",
      expirationDate: "",
    },
    availability: [],
    consultationFee: "",
    contact: {
      phone: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
    },
    // New fields from user model
    fullname: "",
    gender: "",
    dateOfBirth: "",
    age: "",
    profilePicture: "",
  });

  // New state for availability management
  const [newAvailability, setNewAvailability] = useState({
    day: "Monday",
    startTime: "09:00",
    endTime: "17:00",
    isAvailable: true,
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await doctorAPI.getProfile();
      const doctorProfile = response.data;

      setProfile(doctorProfile);

      // Initialize form data from profile
      setFormData({
        bio: doctorProfile.bio || "",
        education: doctorProfile.education || "",
        experience: doctorProfile.experience || "",
        license: {
          number: doctorProfile.license?.number || "",
          expirationDate: doctorProfile.license?.expirationDate
            ? new Date(doctorProfile.license.expirationDate)
                .toISOString()
                .split("T")[0]
            : "",
        },
        availability: doctorProfile.availability || [],
        consultationFee: doctorProfile.consultationFee || "",
        contact: {
          phone: doctorProfile.contact?.phone || "",
          address: doctorProfile.contact?.address || "",
          city: doctorProfile.contact?.city || "",
          state: doctorProfile.contact?.state || "",
          zipCode: doctorProfile.contact?.zipCode || "",
          country: doctorProfile.contact?.country || "",
        },
        // New fields from user model
        fullname: doctorProfile.user?.fullname || "",
        gender: doctorProfile.user?.gender || "",
        dateOfBirth: doctorProfile.user?.dateOfBirth
          ? new Date(doctorProfile.user.dateOfBirth).toISOString().split("T")[0]
          : "",
        age: doctorProfile.user?.age || "",
        profilePicture: doctorProfile.user?.profilePicture || "",
      });

      setError(null);
    } catch (err) {
      console.error("Error fetching doctor profile:", err);
      setError("Failed to load profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Handle nested fields
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
      // Handle regular fields
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  // New function to handle availability slot input changes
  const handleAvailabilityChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewAvailability({
      ...newAvailability,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // New function to add availability slot
  const addAvailabilitySlot = () => {
    const updatedAvailability = [...formData.availability, newAvailability];
    setFormData({
      ...formData,
      availability: updatedAvailability,
    });
    // Reset new availability form
    setNewAvailability({
      day: "Monday",
      startTime: "09:00",
      endTime: "17:00",
      isAvailable: true,
    });
  };

  // New function to remove availability slot
  const removeAvailabilitySlot = (index) => {
    const updatedAvailability = formData.availability.filter(
      (_, i) => i !== index
    );
    setFormData({
      ...formData,
      availability: updatedAvailability,
    });
  };

  // New function to handle file upload for profile picture
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Create a FormData instance
    const formDataForUpload = new FormData();
    formDataForUpload.append("profilePicture", file);

    try {
      // Using userAPI instead of doctorAPI for profile picture upload
      const response = await userAPI.updateProfilePicture(formDataForUpload);
      setFormData({
        ...formData,
        profilePicture: response.data.profilePicture,
      });
    } catch (err) {
      console.error("Error uploading profile picture:", err);
      setError("Failed to upload profile picture. Please try again.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      // Separate user data from doctor data
      const userData = {
        fullname: formData.fullname,
        gender: formData.gender,
        dateOfBirth: formData.dateOfBirth,
        age: formData.age,
        contact: formData.contact,
      };

      const doctorData = {
        bio: formData.bio,
        education: formData.education,
        experience: formData.experience,
        license: formData.license,
        availability: formData.availability,
        consultationFee: formData.consultationFee,
      };

      // Update user profile first
      await userAPI.updateUserProfile(userData);

      // Then update doctor profile
      await doctorAPI.updateProfile(doctorData);

      // Refresh profile
      await fetchProfile();

      setSuccess("Profile updated successfully!");
      setEditMode(false);

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error("Error updating profile:", err);
      setError("Failed to update profile. Please try again.");
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

  return (
    <div className="doctor-profile">
      <div className="profile-header">
        <h1 className="page-title">My Profile</h1>
        <Button
          variant={editMode ? "secondary" : "primary"}
          onClick={() => setEditMode(!editMode)}
        >
          {editMode ? "Cancel" : "Edit Profile"}
        </Button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {editMode ? (
        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-section">
            <h3>Basic Information</h3>

            {/* Profile picture upload */}
            <div className="form-group profile-picture-upload">
              {formData.profilePicture && (
                <div className="current-profile-picture">
                  <img src={formData.profilePicture} alt="Profile" />
                </div>
              )}
              <label htmlFor="profilePicture">Profile Picture</label>
              <input
                type="file"
                id="profilePicture"
                name="profilePicture"
                accept="image/*"
                onChange={handleFileUpload}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="fullname">Full Name</label>
                <input
                  type="text"
                  id="fullname"
                  name="fullname"
                  value={formData.fullname}
                  onChange={handleInputChange}
                  placeholder="Your full name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="gender">Gender</label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                  <option value="prefer not to say">Prefer not to say</option>
                </select>
              </div>
            </div>

            <div className="form-row">
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

              <div className="form-group">
                <label htmlFor="age">Age</label>
                <input
                  type="number"
                  id="age"
                  name="age"
                  min="0"
                  value={formData.age}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          {/* Existing Personal Information section */}
          <div className="form-section">
            <h3>Personal Information</h3>

            <div className="form-group">
              <label htmlFor="bio">Professional Bio</label>
              <textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                rows="4"
                placeholder="Tell patients about yourself and your practice"
              ></textarea>
            </div>

            <div className="form-row">
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
            </div>
          </div>

          {/* Existing Professional Details section */}
          <div className="form-section">
            <h3>Professional Details</h3>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="license.number">License Number</label>
                <input
                  type="text"
                  id="license.number"
                  name="license.number"
                  value={formData.license.number}
                  onChange={handleInputChange}
                  placeholder="Your medical license number"
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
                  value={formData.license.expirationDate}
                  onChange={handleInputChange}
                />
              </div>
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
                placeholder="Enter your consultation fee"
              />
            </div>
          </div>

          {/* New Availability section */}
          <div className="form-section">
            <h3>Availability</h3>

            <div className="availability-slots">
              {formData.availability && formData.availability.length > 0 ? (
                <div className="existing-slots">
                  <h4>Current Availability Slots</h4>
                  <table className="availability-table">
                    <thead>
                      <tr>
                        <th>Day</th>
                        <th>Start Time</th>
                        <th>End Time</th>
                        <th>Available</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {formData.availability.map((slot, index) => (
                        <tr key={index}>
                          <td>{slot.day}</td>
                          <td>{slot.startTime}</td>
                          <td>{slot.endTime}</td>
                          <td>{slot.isAvailable ? "Yes" : "No"}</td>
                          <td>
                            <button
                              type="button"
                              className="btn-remove"
                              onClick={() => removeAvailabilitySlot(index)}
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p>No availability slots added yet.</p>
              )}

              <div className="add-slot-form">
                <h4>Add New Availability Slot</h4>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="day">Day</label>
                    <select
                      id="day"
                      name="day"
                      value={newAvailability.day}
                      onChange={handleAvailabilityChange}
                    >
                      {[
                        "Monday",
                        "Tuesday",
                        "Wednesday",
                        "Thursday",
                        "Friday",
                        "Saturday",
                        "Sunday",
                      ].map((day) => (
                        <option key={day} value={day}>
                          {day}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="startTime">Start Time</label>
                    <input
                      type="time"
                      id="startTime"
                      name="startTime"
                      value={newAvailability.startTime}
                      onChange={handleAvailabilityChange}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="endTime">End Time</label>
                    <input
                      type="time"
                      id="endTime"
                      name="endTime"
                      value={newAvailability.endTime}
                      onChange={handleAvailabilityChange}
                    />
                  </div>
                </div>

                <div className="form-group checkbox-group">
                  <input
                    type="checkbox"
                    id="isAvailable"
                    name="isAvailable"
                    checked={newAvailability.isAvailable}
                    onChange={handleAvailabilityChange}
                  />
                  <label htmlFor="isAvailable">Available</label>
                </div>

                <button
                  type="button"
                  className="btn-add-slot"
                  onClick={addAvailabilitySlot}
                >
                  Add Slot
                </button>
              </div>
            </div>
          </div>

          {/* Existing Contact Information section */}
          <div className="form-section">
            <h3>Contact Information</h3>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="contact.phone">Phone Number</label>
                <input
                  type="tel"
                  id="contact.phone"
                  name="contact.phone"
                  value={formData.contact.phone}
                  onChange={handleInputChange}
                  placeholder="e.g., +1 (123) 456-7890"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="contact.address">Address</label>
              <input
                type="text"
                id="contact.address"
                name="contact.address"
                value={formData.contact.address}
                onChange={handleInputChange}
                placeholder="Street address"
              />
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
          </div>

          <div className="form-actions">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setEditMode(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={saving}
              disabled={saving}
            >
              Save Changes
            </Button>
          </div>
        </form>
      ) : (
        <div className="profile-view">
          {/* Basic Information Card */}
          <div className="profile-card">
            <div className="profile-details">
              <div className="profile-header-with-picture">
                {profile.user?.profilePicture && (
                  <div className="profile-picture">
                    <img src={profile.user.profilePicture} alt="Profile" />
                  </div>
                )}
                <div className="profile-header-info">
                  <h3>Basic Information</h3>
                  <h2>{profile.user?.fullname || "Doctor"}</h2>
                  {profile.user?.gender && (
                    <div className="detail-item">
                      <h4>Gender</h4>
                      <p>{profile.user.gender}</p>
                    </div>
                  )}
                  <div className="detail-row">
                    {profile.user?.dateOfBirth && (
                      <div className="detail-item">
                        <h4>Date of Birth</h4>
                        <p>
                          {new Date(
                            profile.user.dateOfBirth
                          ).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                    {profile.user?.age && (
                      <div className="detail-item">
                        <h4>Age</h4>
                        <p>{profile.user.age} years</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Existing Personal Information Card */}
          <div className="profile-card">
            <div className="profile-details">
              <h3>Personal Information</h3>

              {profile.bio ? (
                <div className="detail-item">
                  <h4>About</h4>
                  <p>{profile.bio}</p>
                </div>
              ) : (
                <div className="empty-state">No bio information provided</div>
              )}

              <div className="detail-row">
                {profile.education && (
                  <div className="detail-item">
                    <h4>Education</h4>
                    <p>{profile.education}</p>
                  </div>
                )}

                {profile.experience !== undefined && (
                  <div className="detail-item">
                    <h4>Experience</h4>
                    <p>{profile.experience} years</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Existing Professional Details Card */}
          <div className="profile-card">
            <div className="profile-details">
              <h3>Professional Details</h3>

              <div className="detail-row">
                {profile.license?.number && (
                  <div className="detail-item">
                    <h4>License Number</h4>
                    <p>{profile.license.number}</p>
                  </div>
                )}

                {profile.license?.expirationDate && (
                  <div className="detail-item">
                    <h4>License Expiration</h4>
                    <p>
                      {new Date(
                        profile.license.expirationDate
                      ).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>

              {profile.specializations &&
                profile.specializations.length > 0 && (
                  <div className="detail-item">
                    <h4>Specializations</h4>
                    <div className="specializations-list">
                      {profile.specializations.map((spec, index) => (
                        <span key={index} className="specialization-badge">
                          {typeof spec === "object" ? spec.name : spec}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

              {profile.consultationFee && (
                <div className="detail-item">
                  <h4>Consultation Fee</h4>
                  <p>${profile.consultationFee}</p>
                </div>
              )}
            </div>
          </div>

          {/* New Availability Card */}
          <div className="profile-card">
            <div className="profile-details">
              <h3>Availability</h3>

              {profile.availability && profile.availability.length > 0 ? (
                <div className="availability-display">
                  <table className="availability-table">
                    <thead>
                      <tr>
                        <th>Day</th>
                        <th>Hours</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {profile.availability.map((slot, index) => (
                        <tr key={index}>
                          <td>{slot.day}</td>
                          <td>
                            {slot.startTime} - {slot.endTime}
                          </td>
                          <td
                            className={
                              slot.isAvailable ? "available" : "unavailable"
                            }
                          >
                            {slot.isAvailable ? "Available" : "Unavailable"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="empty-state">
                  No availability information provided
                </div>
              )}
            </div>
          </div>

          {/* New Ratings and Reviews Card */}
          {profile.ratings && (
            <div className="profile-card">
              <div className="profile-details">
                <h3>Ratings & Reviews</h3>

                <div className="ratings-summary">
                  <div className="average-rating">
                    <h4>Average Rating</h4>
                    <div className="rating-value">
                      {profile.ratings.average.toFixed(1)}
                    </div>
                    <div className="rating-count">
                      Based on {profile.ratings.count} reviews
                    </div>
                  </div>
                </div>

                {profile.reviews && profile.reviews.length > 0 ? (
                  <div className="reviews-list">
                    <h4>Recent Reviews</h4>
                    {profile.reviews.map((review, index) => (
                      <div key={index} className="review-item">
                        <div className="review-header">
                          <span className="review-rating">
                            {review.rating} ★
                          </span>
                          <span className="review-date">
                            {new Date(review.date).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="review-comment">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-state">No reviews yet</div>
                )}
              </div>
            </div>
          )}

          {/* Existing Contact Information Card */}
          <div className="profile-card">
            <div className="profile-details">
              <h3>Contact Information</h3>

              <div className="detail-item">
                <h4>Phone</h4>
                <p>{profile.contact?.phone || "Not provided"}</p>
              </div>

              <div className="detail-item">
                <h4>Address</h4>
                {profile.contact?.address ? (
                  <address>
                    {profile.contact.address}
                    <br />
                    {profile.contact.city && `${profile.contact.city}, `}
                    {profile.contact.state && `${profile.contact.state} `}
                    {profile.contact.zipCode && profile.contact.zipCode}
                    <br />
                    {profile.contact.country && profile.contact.country}
                  </address>
                ) : (
                  <p>Not provided</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
