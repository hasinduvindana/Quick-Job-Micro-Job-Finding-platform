"use client"; // This line tells Next.js that the file is a Client Component

import React, { useState } from "react";
import { useRouter } from "next/navigation"; // Import useRouter for navigation
import Link from "next/link"; // Import Link from next/link

export default function Dashboard() {
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const router = useRouter(); // Initialize useRouter

  const locations = [
    "Galle", "Colombo", "Matara", "Kandy", "Nuwaraeliya",
    "Gampaha", "Hambantota", "Jaffna",
  ];

  const categories = [
    "Helper", "Driver", "Mechanic", "Carpenter",
    "Tailor", "Cook",
  ];

  // Handle logout action
  const handleLogout = () => {
    // You can perform any logout logic here (like clearing session, etc.)
    router.push("/"); // Redirect to the homepage
  };

  // Example job data for the job cards
  const jobCards = [
    {
      title: "Mechanic",
      location: "Colombo",
      image: "/mechanic.jpg", // Example image
      type: "Full Time",
      urgency: "Urgent",
    },
    {
      title: "Carpenter",
      location: "Negombo",
      image: "/carpenter.jpg", // Example image
      type: "Part Time",
      urgency: "Urgent",
    },
    {
      title: "Plumber",
      location: "Kandy",
      image: "/Plumber.jpg", // Example image
      type: "Full Time",
      urgency: "Urgent",
    },
    {
      title: "Driver",
      location: "Galle",
      image: "/Driver1.jpeg", // Example image
      type: "Full Time",
      urgency: "Urgent",
    },
    {
      title: "Home Advisor",
      location: "Jaffna",
      image: "/homeadvisor.jpeg", // Example image
      type: "Part Time",
      urgency: "Urgent",
    },
    {
      title: "Cleaner",
      location: "Matara",
      image: "/Cleaner.jpg", // Example image
      type: "Part Time",
      urgency: "Urgent",
    },
  ];

  // Handle Apply Now button click
  const handleApply = (job: { title: any; location: any; image?: string; type?: string; urgency?: string; }) => {
    console.log(`Applying for ${job.title} in ${job.location}`);
    // Add logic for job application here, e.g., API call or redirect
    alert(`Application submitted for ${job.title} in ${job.location}`);
  };

  return (
    <div className="container">
      {/* Header */}
      <header className="header">
        <div className="logo">
          <img src="/quickjoblogo.png" alt="QuickJob Logo" />
        </div>
        <div className="welcome">
          <h1>Welcome to QuickJob</h1>
        </div>
        <div className="user-settings">
          <Link href="/editaccount" legacyBehavior>
            <a>
              <img
                src="/usericon.png"
                alt="User Icon"
                className="user-icon"
              />
              <span>Account</span>
            </a>
          </Link>

          {/* Logout Button */}
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>
      </header>

      {/* Search and Filters */}
      <div className="search-section">
        <input
          type="text"
          placeholder="What are you looking for?"
          className="search-bar"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
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

      {/* Job Cards Section */}
      <div className="job-cards-section">
        {jobCards.map((job, index) => (
          <div key={index} className="job-card">
            <img src={job.image} alt={`${job.title} image`} className="job-image" />
            <h3>{job.title}</h3>
            <p>{job.location}</p>
            <div className="job-tags">
              <span className="job-type">{job.type}</span>
              <span className="job-urgency">{job.urgency}</span>
            </div>
            <button
              className="apply-button"
              onClick={() => handleApply(job)}
            >
              Apply Now
            </button>
          </div>
        ))}
      </div>

      {/* Style */}

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
        .user-settings {
          display: flex;
          align-items: center;
          gap: 15px;
        }
        .user-icon {
          border-radius: 50%;
          height: 40px;
        }

        /* Logout Button */
        .logout-button {
          background-color: #e74c3c;
          color: white;
          padding: 10px 20px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }

        .logout-button:hover {
          background-color: #c0392b;
        }

        /* Search Section */
        .search-section {
          margin-bottom: 20px;
          display: flex;
          gap: 10px;
        }
        .search-bar {
          flex: 1;
          padding: 10px;
          border: 1px solid #ccc;
          border-radius: 5px;
          color: black;
        }
        .filters {
          display: flex;
          gap: 10px;
        }
        .dropdown {
          padding: 10px;
          border: 1px solid #ccc;
          border-radius: 5px;
          color: black;
        }
        .search-button {
          background-color: #2c7a7b;
          color: #fff;
          border: none;
          padding: 10px 20px;
          border-radius: 5px;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }
        .search-button:hover {
          background-color: #285e5b;
        }

        /* Job Cards Section */
        .job-cards-section {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 20px;
        }
        .job-card {
          background-color: #fff;
          border-radius: 8px;
          padding: 20px;
          text-align: center;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          color: #333; /* Dark color for text */
        }
        .job-image {
          width: 100%;
          border-radius: 5px;
          margin-bottom: 10px;
        }
        .job-tags {
          display: flex;
          justify-content: center;
          gap: 10px;
          margin: 10px 0;
        }
        .job-type,
        .job-urgency {
          padding: 5px 10px;
          border-radius: 5px;
          font-size: 12px;
        }
        .job-type {
          background-color: #2c7a7b;
          color: white;
        }
        .job-urgency {
          background-color: #e74c3c;
          color: white;
        }
        .apply-button {
          background-color: #2c7a7b;
          color: white;
          padding: 10px 20px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }
        .apply-button:hover {
          background-color: #285e5b;
        }
      `}</style>
    </div>
  );
}