"use client"; // Next.js Client Component

import React, { useState } from "react";
import { useRouter } from "next/navigation"; // Correct hook for navigation

export default function PublicDashboard() {
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [jobs, setJobs] = useState([
    { id: 1, title: "Mechanic", location: "Colombo", image: "/mechanic.jpg" },
    { id: 2, title: "Carpenter", location: "Negombo", image: "/carpenter.jpg" },
    { id: 3, title: "Plumber", location: "Kandy", image: "/Plumber.jpg" },
    { id: 4, title: "Driver", location: "Galle", image: "/Driver1.jpeg" },
    { id: 5, title: "Home Advisor", location: "Jaffna", image: "/homeadvisor.jpeg" },
    { id: 6, title: "Cleaner", location: "Matara", image: "/Cleaner.jpg" },
  ]);

  const router = useRouter(); // Initialize the useRouter hook

  const locations = [
    "Galle", "Colombo", "Matara", "Kandy", "Nuwaraeliya",
    "Gampaha", "Hambantota", "Jaffna",
  ];

  const categories = [
    "Helper", "Driver", "Mechanic", "Carpenter", "Tailor", "Cook",
  ];

  const handleAccount = () => {
    router.push("/pub_editaccount"); // Correct path for redirection
  };

  const handleApply = (job: { id?: number; title: any; location: any; image?: string; }) => {
    alert(`Viewing applicants for ${job.title} in ${job.location}`);
  };

  const handleEdit = (job: { id: any; title: any; location: any; image?: string; }) => {
    alert(`Editing job: ${job.title} in ${job.location}`);
    const updatedTitle = prompt("Enter new title:", job.title);
    const updatedLocation = prompt("Enter new location:", job.location);
    if (updatedTitle && updatedLocation) {
      setJobs((prevJobs) =>
        prevJobs.map((j) =>
          j.id === job.id
            ? { ...j, title: updatedTitle, location: updatedLocation }
            : j
        )
      );
    }
  };

  const handleDelete = (job: { id: any; title: any; location: any; image?: string; }) => {
    const confirmDelete = confirm(`Are you sure you want to delete ${job.title} in ${job.location}?`);
    if (confirmDelete) {
      setJobs((prevJobs) => prevJobs.filter((j) => j.id !== job.id));
    }
  };

  const handleLogout = () => {
    alert("You have logged out.");
  };

  const handleCreateJob = () => {
    router.push("/createjob"); // Correct path for redirection
  };

  return (
    <div className="container">
      {/* Header */}
      <header className="header">
        <div className="logo">
          <img src="/quickjoblogo.png" alt="QuickJob Logo" />
        </div>
        <div className="welcome">
          <h1>Find Your Next Job with QuickJob</h1>
          <p>Your gateway to thousands of job opportunities</p>
        </div>

        {/* Buttons for Account, Create Job, and Logout */}
        <div className="buttons">
          <button onClick={handleAccount} className="account-button">
            <img src="/usericon.png" alt="User Icon" className="user-icon" />
            Account
          </button>
          <button onClick={handleCreateJob} className="create-job-button">
            Create Job Post
          </button>
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>
      </header>

      {/* Search and Filters */}
      <div className="search-section">
        <input
          type="text"
          placeholder="What do you want to view?"
          className="search-bar"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)} />
        <div className="filters">
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="dropdown"
          >
            <option value="">Select Location</option>
            {locations.map((loc, index) => (
              <option key={index} value={loc}>
                {loc}
              </option>
            ))}
          </select>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="dropdown"
          >
            <option value="">Select Category</option>
            {categories.map((cat, index) => (
              <option key={index} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
        <button className="search-button">Search</button>
      </div>

      {/* Job Cards */}
      <div className="job-cards-section">
        {jobs.map((job, index) => (
          <div key={index} className="job-card">
            <img src={job.image} alt={`${job.title} image`} className="job-image" />
            <h3 style={{ color: "black" }}>{job.title}</h3>
            <p style={{ color: "black" }}>{job.location}</p>
            <div className="job-tags">
              <button className="job-type" style={{ color: "white" }} onClick={() => handleEdit(job)}>Edit</button>
              <button className="job-urgency" style={{ color: "white" }} onClick={() => handleDelete(job)}>Delete</button>
            </div>
            <button className="apply-button" onClick={() => handleApply(job)}>
              View Applicants
            </button>
          </div>
        ))}
      </div>

      {/* Styles */}
      <style jsx>{`
        .container {
          font-family: Arial, sans-serif;
          background-color: #f3f4f6;
          padding: 20px;
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          background-color: #2c7a7b;
          color: #fff;
          border-radius: 8px;
          margin-bottom: 20px;
        }
        .logo img {
          height: 50px;
        }
        .welcome h1 {
          margin: 0;
        }
        .welcome p {
          margin: 5px 0 0;
        }
        .buttons {
          display: flex;
          gap: 10px;
        }
        .account-button {
          background-color: transparent;
          color: white;
          padding: 10px 20px;
          border-radius: 5px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .user-icon {
          width: 30px;
          height: 30px;
        }
        .create-job-button, .logout-button {
          background-color: #e74c3c;
          color: white;
          padding: 10px 20px;
          border-radius: 5px;
          cursor: pointer;
        }
        .search-section {
          display: flex;
          gap: 10px;
          margin-bottom: 20px;
          justify-content: flex-start; /* Align to the left */
        }
        .search-bar {
          flex-grow: 1; /* Make the search bar expand to take remaining space */
        }
        .dropdown {
          padding: 10px;
          border: 1px solid #ccc;
          border-radius: 5px;
        }
        .search-button {
          background-color: #2c7a7b;
          color: white;
          padding: 10px 20px;
          border-radius: 5px;
          cursor: pointer;
        }
        select, option {
          color: black; /* Enforces black text */
        }
        .job-cards-section {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 20px;
        }
        .job-card {
          background: white;
          padding: 20px;
          border-radius: 8px;
          text-align: center;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .apply-button {
          background-color: #2c7a7b;
          color: white;
          padding: 10px;
          border-radius: 5px;
        }
        .job-tags span, .job-tags button {
          margin: 5px;
          display: inline-block;
          padding: 5px;
          background-color: #e74c3c;
          color: white;
          border-radius: 4px;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}
