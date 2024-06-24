import React, { useState, useEffect } from "react";
import "./Profile.css";
import profilePicture from "../../../assets/profile-pic.png";

class FormField extends React.Component {
  render() {
    const { htmlFor, label, htmlType, value, onChange, disabled } = this.props;
    return (
      <div className="form-group">
        <label htmlFor={htmlFor}>{label}</label>
        <input
          type={htmlType}
          id={htmlFor}
          name={htmlFor}
          value={value}
          onChange={(e) => onChange(htmlFor, e.target.value)}
          disabled={disabled ? "disabled" : ""}
        />
      </div>
    );
  }
}

const Profile = ({ id }) => {
  const [profileDetails, setProfileDetails] = useState({});
  const [isEditProfile, setIsEditProfile] = useState(false);

  useEffect(() => {
    const fetchProfileDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5001/users/${id}`);
        const data = await response.json();
        setProfileDetails(data);
        console.log(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchProfileDetails();
  }, [id]);

  const handleInputChange = (fieldName, fieldValue) => {
    setProfileDetails((prevProfileDetails) => ({
      ...prevProfileDetails,
      [fieldName]: fieldValue,
    }));
  };

  const handleEditProfile = () => {
    setIsEditProfile((prevIsEditProfile) => !prevIsEditProfile);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5001/users/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profileDetails),
      });
      if (response.ok) {
        console.log("Profile updated successfully");
      } else {
        console.error("Failed to update profile");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}-${date.getMonth()}-${date.getDay()}`;
  };

  const ContactField = () => (
    <div className="contact">
      <div className="phone">
        <FormField
          htmlFor="phone"
          label="Phone"
          htmlType="tel"
          value={profileDetails.contact?.phone?.primary || ""}
          onChange={handleInputChange}
          disabled={!isEditProfile}
        />
        <FormField
          htmlFor="phone"
          label="Phone"
          htmlType="tel"
          value={profileDetails.contact?.phone?.secondary || ""}
          onChange={handleInputChange}
          disabled={!isEditProfile}
        />
      </div>
      <div className="address">
        <FormField
          htmlFor="street"
          label="Street"
          htmlType="text"
          value={profileDetails.contact?.address?.street || ""}
          onChange={handleInputChange}
          disabled={!isEditProfile}
        />
        <FormField
          htmlFor="city"
          label="City"
          htmlType="text"
          value={profileDetails.contact?.address?.city || ""}
          onChange={handleInputChange}
          disabled={!isEditProfile}
        />
        <FormField
          htmlFor="state"
          label="State"
          htmlType="text"
          value={profileDetails.contact?.address?.state || ""}
          onChange={handleInputChange}
          disabled={!isEditProfile}
        />
        <FormField
          htmlFor="country"
          label="Country"
          htmlType="text"
          value={profileDetails.contact?.address?.country || ""}
          onChange={handleInputChange}
          disabled={!isEditProfile}
        />
        <FormField
          htmlFor="zipcode"
          label="Zipcode"
          htmlType="text"
          value={profileDetails.contact?.address?.zipcode || ""}
          onChange={handleInputChange}
          disabled={!isEditProfile}
        />
      </div>
    </div>
  );

  return (
    <div className="profile-container">
      {!isEditProfile ? (
        <a className="edit-profile" onClick={handleEditProfile}>
          <i className="bi bi-pencil"></i>
          Edit Profile
        </a>
      ) : (
        <a className="edit-profile" onClick={handleSubmit}>
          <i className="bi bi-download"></i>
          Save Profile
        </a>
      )}
      <div className="profile-image">
        <h1>{profileDetails.firstName + " " + profileDetails.lastName}</h1>
        <img src={profilePicture} className="profile" />
      </div>
      <div className="profile-details">
        <form className="profile-form">
          <div className="profile-primary-details">
            <div className="name">
              <FormField
                htmlFor="first-name"
                label="First name"
                htmlType="text"
                value={profileDetails.firstName || ""}
                onChange={handleInputChange}
                disabled={!isEditProfile}
                autoFocus={!isEditProfile}
              />
              <FormField
                htmlFor="last-name"
                label="Last name"
                htmlType="text"
                value={profileDetails.lastName || ""}
                onChange={handleInputChange}
                disabled={!isEditProfile}
              />
            </div>
            <div className="name">
              <div className="form-group">
                <label htmlFor="gender">Gender</label>
                <select
                  id="gender"
                  name="gender"
                  onChange={(e) => handleInputChange("gender", e.target.value)}
                  disabled={!isEditProfile}
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>

              <FormField
                htmlFor="dob"
                label="Date of Birth"
                htmlType="date"
                value={
                  profileDetails.dateOfBirth
                    ? formatDate(profileDetails.dateOfBirth)
                    : ""
                }
                onChange={handleInputChange}
                disabled={!isEditProfile}
              />
            </div>
            <FormField
              htmlFor="email"
              label="Email"
              htmlType="email"
              value={profileDetails.contact?.email || ""}
              onChange={handleInputChange}
              disabled={!isEditProfile}
            />
          </div>
          <ContactField />
        </form>
      </div>
    </div>
  );
};

export default Profile;
