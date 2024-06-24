import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './DoctorsList.css'

function DoctorsList() {
  const [doctors, setDoctors] = useState([]);
  const [searchValue, setSearchValue] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/doctors');
        const data = await response.json();
        setDoctors(data);
      } catch (error) {
        console.error('Error fetching doctors:', error);
      }
    };
  
    fetchData();
  }, []);
  
  

  const handleInputChange = (event) => {
    setSearchValue(event.target.value);
  };

  const handleClearInput = () => {
    setSearchValue('');
    console.log("Available Doctors", doctors);
  };

  

  const filteredDoctors = doctors.filter((doctor) =>
    doctor.name.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <div className='doctors-list'>
      <div className='doctors-list-header'>
        <span>Doctors</span>
        <div className='search'>
          {searchValue ? (
            <i className='bi bi-x-lg' onClick={handleClearInput}></i>
          ) : (
            <i className='bi bi-search'></i>
          )}
          <form action='/'>
            <input
              type='search'
              name='search'
              id='search-input'
              placeholder='Search by name'
              value={searchValue}
              onChange={handleInputChange}
            />
          </form>
        </div>
      </div>

      <div className='doctors-list-container'>
        <table>
          <thead>
            <tr>
              <th>Id</th>
              <th>Name</th>
              <th>Specialization</th>
              <th>Phone</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredDoctors.map((docs) => (
              <tr key={`doc-${docs.id}`}>
                <td>{docs.id}</td>
                <td>{docs.name}</td>
                <td>{docs.specialization[0]}</td>
                <td>{docs.contact.phone.primary}</td>
                <td data-status={docs.status}>
                  {docs.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DoctorsList;
