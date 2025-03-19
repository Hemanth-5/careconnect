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
      console.log("Fetching doctors and specializations data...");

      // First fetch specializations
      try {
        const specializationsResponse = await adminAPI.getSpecializations();
        console.log("Specializations response:", specializationsResponse);
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
          console.log("Filtered doctors response:", doctorsResponse);
        } else {
          doctorsResponse = await adminAPI.getAllDoctors();
          console.log("All doctors response:", doctorsResponse);
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
                  {doctor.experience && (
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
                  )}
                  <Button
                    variant="outline-primary"
                    onClick={() => handleViewDetails(doctor)}
                    fullWidth
                  >
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
                  variant="primary"
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
              <h2>Doctor Details</h2>
              <button className="close-btn" onClick={handleCloseDetails}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              <div className="doctor-profile">
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
                    <div className="doctor-profile-specializations">
                      {viewDetails.specializations &&
                        viewDetails.specializations.map((spec) => (
                          <span key={spec._id} className="specialization-badge">
                            {spec.name}
                          </span>
                        ))}
                    </div>
                  </div>
                </div>

                <div className="doctor-profile-section">
                  <h4>Contact Information</h4>
                  <p>
                    <strong>Phone:</strong>{" "}
                    {viewDetails.user?.contact?.phone || "Not provided"}
                  </p>
                  <p>
                    <strong>Address:</strong>{" "}
                    {viewDetails.user?.contact?.address || "Not provided"}
                  </p>
                  {viewDetails.user?.contact?.city && (
                    <p>
                      <strong>City:</strong> {viewDetails.user.contact.city}
                    </p>
                  )}
                  {viewDetails.user?.contact?.state && (
                    <p>
                      <strong>State:</strong> {viewDetails.user.contact.state}
                    </p>
                  )}
                  {viewDetails.user?.contact?.zipCode && (
                    <p>
                      <strong>Zip Code:</strong>{" "}
                      {viewDetails.user.contact.zipCode}
                    </p>
                  )}
                  {viewDetails.user?.contact?.country && (
                    <p>
                      <strong>Country:</strong>{" "}
                      {viewDetails.user.contact.country}
                    </p>
                  )}
                </div>

                <div className="doctor-profile-section">
                  <h4>Professional Details</h4>
                  <p>
                    <strong>Experience:</strong>{" "}
                    {viewDetails.experience
                      ? `${viewDetails.experience} years`
                      : "Not specified"}
                  </p>
                  <p>
                    <strong>Education:</strong>{" "}
                    {viewDetails.education || "Not specified"}
                  </p>
                  <p>
                    <strong>License Number:</strong>{" "}
                    {viewDetails.license?.number || "Not provided"}
                  </p>
                  {viewDetails.license?.expirationDate && (
                    <p>
                      <strong>License Expiration:</strong>{" "}
                      {new Date(
                        viewDetails.license.expirationDate
                      ).toLocaleDateString()}
                    </p>
                  )}
                  {viewDetails.consultationFee && (
                    <p>
                      <strong>Consultation Fee:</strong> $
                      {viewDetails.consultationFee}
                    </p>
                  )}
                  {viewDetails.bio && (
                    <div>
                      <strong>Bio:</strong>
                      <p className="doctor-bio">{viewDetails.bio}</p>
                    </div>
                  )}
                </div>

                <div className="doctor-profile-section">
                  <h4>Working Hours</h4>
                  {viewDetails.availability &&
                  viewDetails.availability.length > 0 ? (
                    <div className="working-hours">
                      {viewDetails.availability.map((slot, index) => (
                        <div key={index} className="working-hours-row">
                          <span>{slot.day || "Day not specified"}</span>
                          <span>
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
                    <p>No working hours specified</p>
                  )}
                </div>

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
                          Based on {viewDetails.ratings.count} reviews
                        </span>
                      </div>
                    </div>

                    {viewDetails.reviews && viewDetails.reviews.length > 0 && (
                      <div className="reviews-list">
                        <h5>Recent Reviews</h5>
                        {viewDetails.reviews
                          .slice(0, 3)
                          .map((review, index) => (
                            <div key={index} className="review-item">
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
                              <p className="review-comment">{review.comment}</p>
                              <p className="review-date">
                                {new Date(review.date).toLocaleDateString()}
                              </p>
                            </div>
                          ))}
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
