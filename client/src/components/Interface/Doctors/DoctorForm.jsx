import React, { useState } from 'react';
import axios from 'axios'; // Import Axios for making HTTP requests

function DoctorForm() {
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    gender: '',
    dateOfBirth: '',
    specialization: '',
    education: [],
    contact: {
      email: '',
      phone: {
        primary: '',
        secondary: '',
      },
      address: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
      },
    },
    status: '',
    experience: {
      totalYears: 0,
      inSpecialty: 0,
    },
    schedule: {
      monday: '',
      tuesday: '',
      wednesday: '',
      thursday: '',
      friday: '',
    },
    languages: [],
    certifications: [],
    memberships: [],
    awards: [],
    researchInterests: [],
    reviews: [],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/doctors', formData); // Send a POST request to your server
      console.log('Doctor data submitted successfully:', response.data);
      // Optionally, you can reset the form state here
    } catch (error) {
      console.error('Error submitting doctor data:', error);
    }
  };

  return (
    <div>
      <h2>Add a New Doctor</h2>
      <form onSubmit={handleSubmit}>
        <label>
          ID:
          <input type="text" name="id" value={formData.id} onChange={handleChange} />
        </label>
        <label>
          Name:
          <input type="text" name="name" value={formData.name} onChange={handleChange} />
        </label>
        <label>
          Gender:
          <input type="text" name="gender" value={formData.gender} onChange={handleChange} />
        </label>
        <label>
          Date of Birth:
          <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} />
        </label>
        <label>
          Specialization:
          <input type="text" name="specialization" value={formData.specialization} onChange={handleChange} />
        </label>
        <label>
          Education:
          <input type="text" name="education" value={formData.education} onChange={handleChange} />
        </label>
        <label>
          Contact Email:
          <input type="email" name="contact.email" value={formData.contact.email} onChange={handleChange} />
        </label>
        <label>
          Primary Phone:
          <input type="text" name="contact.phone.primary" value={formData.contact.phone.primary} onChange={handleChange} />
        </label>
        <label>
          Secondary Phone:
          <input type="text" name="contact.phone.secondary" value={formData.contact.phone.secondary} onChange={handleChange} />
        </label>
        <label>
          Street Address:
          <input type="text" name="contact.address.street" value={formData.contact.address.street} onChange={handleChange} />
        </label>
        <label>
          City:
          <input type="text" name="contact.address.city" value={formData.contact.address.city} onChange={handleChange} />
        </label>
        <label>
          State:
          <input type="text" name="contact.address.state" value={formData.contact.address.state} onChange={handleChange} />
        </label>
        <label>
          Zip Code:
          <input type="text" name="contact.address.zipCode" value={formData.contact.address.zipCode} onChange={handleChange} />
        </label>
        <label>
          Country:
          <input type="text" name="contact.address.country" value={formData.contact.address.country} onChange={handleChange} />
        </label>
        {/* Add more fields as needed */}
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default DoctorForm;
