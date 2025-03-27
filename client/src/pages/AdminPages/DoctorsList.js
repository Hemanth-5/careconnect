import React, { useState, useEffect } from "react";
import adminAPI from "../../api/admin";
import Button from "../../components/common/Button";
import Spinner from "../../components/common/Spinner";
import "./DoctorsList.css";

const DoctorsList = () => {
  const [doctors, setDoctors] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSpecialization, setFilterSpecialization] = useState("");
  const [viewDetails, setViewDetails] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      // console.log("Fetching doctors and specializations data...");

      // First fetch specializations
      try {
        const specializationsResponse = await adminAPI.getSpecializations();
        // console.log("Specializations response:", specializationsResponse);
        setSpecializations(specializationsResponse.data || []);
      } catch (specsError) {
        console.error("Error fetching specializations:", specsError);
      }

      // Then fetch doctors based on specialization filter
      try {
        let doctorsResponse;

        if (filterSpecialization) {
          doctorsResponse = await adminAPI.getDoctorsBySpecialization(
            filterSpecialization
          );
          // console.log("Filtered doctors response:", doctorsResponse);
        } else {
          doctorsResponse = await adminAPI.getAllDoctors();
          // console.log("All doctors response:", doctorsResponse);
        }

        setDoctors(doctorsResponse.data || []);
      } catch (doctorsError) {
        console.error("Error fetching doctors:", doctorsError);
        setError("Failed to load doctors. " + (doctorsError.message || ""));
      }
    } catch (err) {
      console.error("Error in fetchData:", err);
      setError("Failed to load data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Re-fetch data when filter changes
  useEffect(() => {
    fetchData();
  }, [filterSpecialization]);

  const handleViewDetails = (doctor) => {
    setViewDetails(doctor);
  };

  const handleCloseDetails = () => {
    setViewDetails(null);
  };

  // Filter doctors based on search term only (specialization is handled by API)
  const filteredDoctors = (doctors || []).filter((doctor) => {
    const user = doctor.user || {};

    // Access username and email safely
    const username = user.username || "";
    const fullname = user.fullname || "";
    const email = user.email || "";

    return (
      username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="doctors-list">
      <div className="page-header">
        <h1 className="page-title">Doctors</h1>
        <Button
          variant="secondary"
          onClick={() => {
            setFilterSpecialization(""); // Clear filter
            setSearchTerm(""); // Clear search
            fetchData(); // Refresh data
          }}
          className="refresh-button"
        >
          <i className="fas fa-sync-alt"></i> Refresh
        </Button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="filter-bar">
        <div className="search-box">
          <i className="fas fa-search search-icon"></i>
          <input
            type="text"
            placeholder="Search doctors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="specialization-filter">
          <label htmlFor="specialization-filter">
            Filter by specialization:
          </label>
          <select
            id="specialization-filter"
            value={filterSpecialization}
            onChange={(e) => setFilterSpecialization(e.target.value)}
          >
            <option value="">All specializations</option>
            {specializations.map((spec) => (
              <option key={spec._id} value={spec._id}>
                {spec.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="loading-container">
          <Spinner center size="large" />
        </div>
      ) : (
        <div className="doctors-grid">
          {filteredDoctors.length > 0 ? (
            filteredDoctors.map((doctor) => {
              const user = doctor.user || {};

              return (
                <div key={doctor._id} className="doctor-card">
                  <div className="doctor-avatar">
                    {user.profilePicture ? (
                      <img
                        src={user.profilePicture}
                        alt={user.username || "Doctor"}
                      />
                    ) : (
                      <i className="fas fa-user-md"></i>
                    )}
                  </div>
                  <h3 className="doctor-username">{user.username || "N/A"}</h3>
                  {user.fullname && (
                    <p className="doctor-name">{user.fullname}</p>
                  )}
                  <div className="doctor-specializations">
                    {doctor.specializations &&
                    doctor.specializations.length > 0 ? (
                      doctor.specializations.map((spec) => (
                        <span key={spec._id} className="specialization-badge">
                          {spec.name}
                        </span>
                      ))
                    ) : (
                      <span className="no-specialization">
                        No specialization
                      </span>
                    )}
                  </div>
                  <p className="doctor-contact">
                    {user.email || "No email provided"}
                  </p>
                  {/* {doctor.experience && (
                    <p className="doctor-experience">
                      <i className="fas fa-briefcase"></i> {doctor.experience}{" "}
                      years
                    </p>
                  )}
                  {doctor.consultationFee && (
                    <p className="doctor-fee">
                      <i className="fas fa-dollar-sign"></i> $
                      {doctor.consultationFee}
                    </p>
                  )} */}
                  <Button
                    variant="outline-primary"
                    onClick={() => handleViewDetails(doctor)}
                    fullWidth
                  >
                    <i
                      className="fas fa-eye"
                      style={{ marginRight: "8px" }}
                    ></i>{" "}
                    View Details
                  </Button>
                </div>
              );
            })
          ) : (
            <div className="no-doctors">
              <p>No doctors found matching your criteria.</p>
              {doctors.length === 0 && !error && (
                <Button
                  variant="outline-primary"
                  onClick={fetchData}
                  style={{ marginTop: "10px" }}
                >
                  Refresh
                </Button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Doctor Details Modal */}
      {viewDetails && (
        <div className="modal-overlay">
          <div className="modal doctor-details-modal">
            <div className="modal-header">
              <h2>Doctor Profile</h2>
              <button className="close-btn" onClick={handleCloseDetails}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              <div className="doctor-profile">
                {/* Profile Header Section */}
                <div className="doctor-profile-header">
                  <div className="doctor-profile-avatar">
                    {viewDetails.user?.profilePicture ? (
                      <img
                        src={viewDetails.user.profilePicture}
                        alt={viewDetails.user.username || "Doctor"}
                      />
                    ) : (
                      <i className="fas fa-user-md"></i>
                    )}
                  </div>
                  <div className="doctor-profile-info">
                    <h3>{viewDetails.user?.username || "N/A"}</h3>
                    {viewDetails.user?.fullname && (
                      <p className="doctor-profile-name">
                        {viewDetails.user.fullname}
                      </p>
                    )}
                    <p className="doctor-profile-email">
                      {viewDetails.user?.email || "No email"}
                    </p>

                    {/* Specializations Badges */}
                    {viewDetails.specializations &&
                      viewDetails.specializations.length > 0 && (
                        <div className="doctor-profile-specializations">
                          {viewDetails.specializations.map((spec) => (
                            <span
                              key={spec._id}
                              className="specialization-badge"
                            >
                              {spec.name}
                            </span>
                          ))}
                        </div>
                      )}

                    {/* Quick Stats */}
                    {/* <div className="profile-quick-stats">
                      {viewDetails.experience && (
                        <div className="stat-item">
                          <i className="fas fa-briefcase"></i>
                          <span>{viewDetails.experience} years experience</span>
                        </div>
                      )}
                      {viewDetails.consultationFee && (
                        <div className="stat-item">
                          <i className="fas fa-dollar-sign"></i>
                          <span>
                            ${viewDetails.consultationFee} consultation fee
                          </span>
                        </div>
                      )}
                    </div> */}
                  </div>
                </div>

                {/* Contact Information Section */}
                <div className="doctor-profile-section">
                  <h4>Contact Information</h4>
                  <div className="profile-section-grid">
                    <div className="profile-info-item">
                      <div className="info-icon">
                        <i className="fas fa-phone"></i>
                      </div>
                      <div className="info-content">
                        <span className="info-label">Phone</span>
                        <span className="info-value">
                          {viewDetails.user?.contact?.phone || "Not provided"}
                        </span>
                      </div>
                    </div>

                    <div className="profile-info-item">
                      <div className="info-icon">
                        <i className="fas fa-envelope"></i>
                      </div>
                      <div className="info-content">
                        <span className="info-label">Email</span>
                        <span className="info-value">
                          {viewDetails.user?.email || "Not provided"}
                        </span>
                      </div>
                    </div>

                    <div className="profile-info-item">
                      <div className="info-icon">
                        <i className="fas fa-map-marker-alt"></i>
                      </div>
                      <div className="info-content">
                        <span className="info-label">Address</span>
                        <span className="info-value">
                          {viewDetails.user?.contact?.address || "Not provided"}
                        </span>
                      </div>
                    </div>

                    <div className="profile-info-item">
                      <div className="info-icon">
                        <i className="fas fa-city"></i>
                      </div>
                      <div className="info-content">
                        <span className="info-label">City/State</span>
                        <span className="info-value">
                          {[
                            viewDetails.user?.contact?.city,
                            viewDetails.user?.contact?.state,
                          ]
                            .filter(Boolean)
                            .join(", ") || "Not provided"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Professional Details Section */}
                <div className="doctor-profile-section">
                  <h4>Professional Details</h4>
                  <div className="profile-section-grid">
                    <div className="profile-info-item">
                      <div className="info-icon">
                        <i className="fas fa-graduation-cap"></i>
                      </div>
                      <div className="info-content">
                        <span className="info-label">Education</span>
                        <span className="info-value">
                          {viewDetails.education || "Not specified"}
                        </span>
                      </div>
                    </div>

                    <div className="profile-info-item">
                      <div className="info-icon">
                        <i className="fas fa-id-card"></i>
                      </div>
                      <div className="info-content">
                        <span className="info-label">License Number</span>
                        <span className="info-value">
                          {viewDetails.license?.number || "Not provided"}
                        </span>
                      </div>
                    </div>

                    <div className="profile-info-item">
                      <div className="info-icon">
                        <i className="fas fa-calendar-check"></i>
                      </div>
                      <div className="info-content">
                        <span className="info-label">License Expiration</span>
                        <span className="info-value">
                          {viewDetails.license?.expirationDate
                            ? new Date(
                                viewDetails.license.expirationDate
                              ).toLocaleDateString()
                            : "Not specified"}
                        </span>
                      </div>
                    </div>

                    <div className="profile-info-item">
                      <div className="info-icon">
                        <i className="fas fa-briefcase"></i>
                      </div>
                      <div className="info-content">
                        <span className="info-label">Experience</span>
                        <span className="info-value">
                          {viewDetails.experience
                            ? `${viewDetails.experience} years`
                            : "Not specified"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {viewDetails.bio && (
                    <div className="doctor-bio-container">
                      <h5>
                        <i className="fas fa-quote-left"></i> Professional Bio
                      </h5>
                      <p className="doctor-bio">{viewDetails.bio}</p>
                    </div>
                  )}
                </div>

                {/* Working Hours Section */}
                <div className="doctor-profile-section">
                  <h4>Working Hours</h4>
                  {viewDetails.availability &&
                  viewDetails.availability.length > 0 ? (
                    <div className="working-hours">
                      {viewDetails.availability.map((slot, index) => (
                        <div key={index} className="working-hours-row">
                          <span className="day-label">
                            {slot.day || "Day not specified"}
                          </span>
                          <span className="time-range">
                            {slot.startTime || "--"} - {slot.endTime || "--"}
                          </span>
                          <span
                            className={`availability-status ${
                              slot.isAvailable ? "available" : "unavailable"
                            }`}
                          >
                            {slot.isAvailable ? "Available" : "Unavailable"}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="no-data-message">
                      <i className="fas fa-calendar-times"></i>
                      <p>No working hours specified</p>
                    </div>
                  )}
                </div>

                {/* Ratings & Reviews Section */}
                {viewDetails.ratings && viewDetails.ratings.count > 0 && (
                  <div className="doctor-profile-section">
                    <h4>Ratings & Reviews</h4>
                    <div className="ratings-summary">
                      <div className="rating-score">
                        <span className="rating-number">
                          {viewDetails.ratings.average.toFixed(1)}
                        </span>
                        <div className="rating-stars">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <i
                              key={i}
                              className={`fas fa-star ${
                                i < Math.round(viewDetails.ratings.average)
                                  ? "filled"
                                  : ""
                              }`}
                            ></i>
                          ))}
                        </div>
                        <span className="rating-count">
                          Based on {viewDetails.ratings.count}{" "}
                          {viewDetails.ratings.count === 1
                            ? "review"
                            : "reviews"}
                        </span>
                      </div>
                    </div>

                    {viewDetails.reviews && viewDetails.reviews.length > 0 && (
                      <div className="reviews-list">
                        <h5>Recent Reviews</h5>
                        <div className="reviews-grid">
                          {viewDetails.reviews
                            .slice(0, 3)
                            .map((review, index) => (
                              <div key={index} className="review-item">
                                <div className="review-header">
                                  <div className="review-rating">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                      <i
                                        key={i}
                                        className={`fas fa-star ${
                                          i < review.rating ? "filled" : ""
                                        }`}
                                      ></i>
                                    ))}
                                  </div>
                                  <p className="review-date">
                                    {new Date(review.date).toLocaleDateString()}
                                  </p>
                                </div>
                                <p className="review-comment">
                                  {review.comment}
                                </p>
                                {review.patientName && (
                                  <p className="review-author">
                                    - {review.patientName}
                                  </p>
                                )}
                              </div>
                            ))}
                        </div>
                        {viewDetails.reviews.length > 3 && (
                          <div className="more-reviews">
                            <span>
                              {viewDetails.reviews.length - 3} more reviews
                              available
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorsList;
