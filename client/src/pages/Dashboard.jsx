import React, { useState, useEffect } from "react";
import "./Dashboard.css";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import StatsCards from "../components/Interface/Dashboard/StatsCards";
import MeetingTable from "../components/Interface/Dashboard/MeetingTable";
import LineChart from "../components/Interface/Dashboard/LineChart";
import { adminMeetings, Data } from "../data/adminData";
import PieChart from "../components/Interface/Dashboard/PieChart";
import BarChart from "../components/Interface/Dashboard/BarChart";
import AreaChart from "../components/Interface/Dashboard/AreaChart";

const fetchUsersData = async () => {
  try {
    const response = await fetch("http://localhost:5001/users");
    if (!response.ok) {
      throw new Error("Failed to fetch users data");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching users data:", error);
    return [];
  }
};

const fetchDoctorsData = async () => {
  try {
    const response = await fetch("http://localhost:5001/doctors");
    if (!response.ok) {
      throw new Error("Failed to fetch doctors data");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching doctors data:", error);
    return [];
  }
};

const fetchDoctorById = async (id) => {
  try {
    const response = await fetch(`http://localhost:5001/doctors/${id}`);
    if (!response.ok) {
      throw new Error("Failed to fetch doctor data");
    }
    return await response.json().then((data) => data.userId);
  } catch (error) {
    console.error("Error fetching doctor data:", error);
    return null;
  }
};

const findMaxRatedDoctor = async () => {
  try {
    // Fetch users and doctors data
    const usersData = await fetchUsersData();
    const doctorUsers = usersData.filter((user) => user.type === "doctor");
    const doctorsData = await fetchDoctorsData();

    // console.log("DOctor Users", doctorUsers);
    // Create a map to store the average rating for each doctor
    const doctorRatings = new Map();

    // Calculate the average rating for each doctor
    doctorsData.forEach((doctor) => {
      const doctorUserId = doctor.userId;
      const user = doctorUsers.find((user) => user._id === doctorUserId);
      if (
        user &&
        user.type === "doctor" &&
        Array.isArray(doctor.reviews) &&
        doctor.reviews.length > 0
      ) {
        const avgRating =
          doctor.reviews.reduce((total, review) => total + review.rating, 0) /
          doctor.reviews.length;
        doctorRatings.set(doctor._id, avgRating);
      }
    });

    // Find the maximum rated doctor
    let maxRating = -1;
    let maxRatedDoctorId = null;
    doctorRatings.forEach((rating, doctorId) => {
      if (rating > maxRating) {
        maxRating = rating;
        maxRatedDoctorId = doctorId;
      }
    });

    // Return the maximum rated doctor's ID
    return maxRatedDoctorId;
  } catch (error) {
    console.error("Error finding max rated doctor:", error);
    return null;
  }
};

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [userData, setUserData] = useState([]);
  const [doctorsData, setDoctorsData] = useState([]);
  const [maxRatedDoctorId, setMaxRatedDoctorId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const usersData = await fetchUsersData();
      setUserData(usersData);
      const doctorsData = await fetchDoctorsData();
      setDoctorsData(doctorsData);

      const maxRatedDoctorId = await findMaxRatedDoctor();
      setMaxRatedDoctorId(maxRatedDoctorId);
    };

    fetchData();
  }, []);

  return (
    <div className="dashboard">
      {isSidebarOpen && (
        <div className="overlay" onClick={() => setIsSidebarOpen(false)}></div>
      )}
      <Sidebar isOpen={isSidebarOpen} />
      <div className="interface">
        <Header setIsSidebarOpen={setIsSidebarOpen} />
        <div className="cards-container">
          <StatsCards
            cardTitle="Patients"
            cardValue={
              userData.filter((user) => user.type === "patient").length
            }
            cardIcon="bi bi-person"
            cardContents={
              <div className="card-additional">
                <div className="card-additional-item">
                  <i class="bi bi-gender-male"></i>
                  <h2>
                    {
                      userData.filter(
                        (user) =>
                          user.type === "patient" && user.gender === "Male"
                      ).length
                    }
                  </h2>
                </div>
                |
                <div className="card-additional-item">
                  <i class="bi bi-gender-female"></i>
                  <h2>
                    {
                      userData.filter(
                        (user) =>
                          user.type === "patient" && user.gender === "Female"
                      ).length
                    }
                  </h2>
                </div>
              </div>
            }
          />
          <StatsCards
            cardTitle="Doctors"
            cardValue={userData.filter((user) => user.type === "doctor").length}
            cardIcon="bi bi-person"
          />
          <StatsCards
            cardTitle="Total Users"
            cardValue={userData.length}
            cardIcon="bi bi-person"
          />
          <StatsCards
            cardTitle="Most Rated Doctor"
            cardValue={
              maxRatedDoctorId
                ? userData.find(
                    (user) =>
                      user._id ===
                      doctorsData.find(
                        (doctor) => doctor._id === maxRatedDoctorId
                      ).userId
                  ).firstName
                : "N/A"
            }
            cardIcon="bi bi-person"
            cardContents={
              <div className="card-additional">
                <div className="card-additional-item">
                  <i class="bi bi-star-fill"></i>
                  <h2>
                    {maxRatedDoctorId
                      ? doctorsData
                          .find((doctor) => doctor._id === maxRatedDoctorId)
                          .reviews.reduce(
                            (total, review) => total + review.rating,
                            0
                          ) /
                        doctorsData.find(
                          (doctor) => doctor._id === maxRatedDoctorId
                        ).reviews.length
                      : "-"}
                  </h2>
                </div>
              </div>
            }
          />
        </div>
        <div className="meetings-appointments">
          <MeetingTable meetings={adminMeetings} />
        </div>
        <div className="charts">
          <div className="charts-contents">
            <div className="line-chart">
              <LineChart />
            </div>

            <div className="pie-chart">
              <PieChart />
            </div>
            <div className="bar-chart">
              <BarChart />
            </div>
            <div className="area-chart">
              <AreaChart />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
