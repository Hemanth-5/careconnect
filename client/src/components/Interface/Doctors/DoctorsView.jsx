import React, { useState, useEffect } from 'react';
import './DoctorsView.css';

function DoctorsView() {
  const [doctors, setDoctors] = useState([])
  const [currentDocIdx, setCurrentDocIdx] = useState(0)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/doctors');
        const data = await response.json();
        console.log(data);
        setDoctors(data);
      } catch (error) {
        console.error('Error fetching doctors:', error);
      }
    };
  
    fetchData();
  }, []);
  
  const handleViewPrevDoc = () => {
    currentDocIdx > 0 ? setCurrentDocIdx(currentDocIdx - 1) : setCurrentDocIdx(currentDocIdx)
  }

  const handleViewNextDoc = () => {
    currentDocIdx < doctors.length - 1 ? setCurrentDocIdx(currentDocIdx + 1) : setCurrentDocIdx(currentDocIdx)
  }

  const currentDoc = doctors[currentDocIdx]

  return (
    <div className='doctors-view-panel'>
      <div className='doctors-view-header'>
        <span>View Doctors</span>
      </div>
      
      <div className="doctors-view-container">
        <button id='view-prev-doctor' onClick={handleViewPrevDoc} disabled={currentDocIdx === 0}><i class="bi bi-arrow-bar-left"></i></button>
        <div className="doctor-profile">
          <div className='doctor-profile-pic'>
            <p>{currentDoc && currentDoc.id}</p>
            <img src="../../../../../assets/2606517_5856.svg" alt="" />
            <h3>{currentDoc && currentDoc.name}</h3>
            <span data-status={currentDoc && currentDoc.status}>{currentDoc && currentDoc.status}</span>
          </div>
          <div className='doctor-profile-details'>
            <p><strong>Specialization</strong>{currentDoc && currentDoc.specialization[0]}</p>
            <p><strong>Phone</strong>{currentDoc && currentDoc.contact.phone.primary}</p>
            <p><strong>Address</strong>{currentDoc && currentDoc.contact.address.street}</p>
            <p><strong>Email</strong>{currentDoc && currentDoc.contact.email}</p>
          </div>
        </div>
        <button id='view-next-doctor' onClick={handleViewNextDoc} disabled={currentDocIdx === doctors.length - 1}><i class="bi bi-arrow-bar-right"></i></button>
      </div>
    </div>
  );
}

export default DoctorsView;
