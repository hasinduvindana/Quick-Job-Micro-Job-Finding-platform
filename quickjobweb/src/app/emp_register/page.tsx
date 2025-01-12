"use client";

import { useState } from "react";

export default function JobListings() {
  const [applicationData, setApplicationData] = useState({
    name: "", // Full Name
    contact: "", // Phone Number
    location: "", // Location
    skill: "", // Skill
    experience: "", // Experience
    email: "", // Email Address
    username: "", // Username
    password: "", // Password
    confirmPassword: "", // Confirm Password
  });

  const [showPassword, setShowPassword] = useState(false); // State for toggling password visibility

  // Handles changes in input fields
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const { name, value } = e.target;
    setApplicationData((prev) => ({ ...prev, [name]: value }));
  };

  // Toggles password visibility
  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  // Displays account details in an alert
  const handleViewAccountDetails = () => {
    alert(`Account Details:
      Name: ${applicationData.name}
      Contact: ${applicationData.contact}
      Location: ${applicationData.location}
      Skill: ${applicationData.skill}
      Experience: ${applicationData.experience}
      Email: ${applicationData.email}
      Username: ${applicationData.username}
    `);
  };

  // Placeholder for editing account functionality
  const handleEditAccount = () => {
    alert("Edit Account functionality coming soon!");
  };

  // Placeholder for deleting account functionality
  const handleDeleteAccount = () => {
    alert("Delete Account functionality coming soon!");
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{
        background: "linear-gradient(135deg, #000000, #003300, #e6d300)",
      }}
    >
      {/* Application Form */}
      <div className="max-w-md w-full p-6 rounded-xl shadow-xl bg-gray-800 border border-gray-600">
        <h2 className="text-2xl font-semibold mb-6 text-gray-200 text-center">
          Edit Employee Account
        </h2>

        {/* Full Name */}
        <label className="block mb-2 text-gray-300 font-medium">Full Name</label>
        <input
          type="text"
          name="name"
          placeholder="Your full name"
          value={applicationData.name}
          onChange={handleInputChange}
          className="w-full mb-4 px-4 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 bg-gray-700 text-gray-200"
        />

        {/* Phone Number */}
        <label className="block mb-2 text-gray-300 font-medium">Phone Number</label>
        <input
          type="text"
          name="contact"
          placeholder="Your phone number"
          value={applicationData.contact}
          onChange={handleInputChange}
          className="w-full mb-4 px-4 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 bg-gray-700 text-gray-200"
        />

        {/* Location */}
        <label className="block mb-2 text-gray-300 font-medium">Location</label>
        <input
          type="text"
          name="location"
          placeholder="Click to get your current location"
          value={applicationData.location}
          onChange={handleInputChange}
          className="w-full mb-4 px-4 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 bg-gray-700 text-gray-200"
        />

        {/* Skill */}
        <label className="block mb-2 text-gray-300 font-medium">Skill</label>
        <select
          name="skill"
          value={applicationData.skill}
          onChange={handleInputChange}
          className="w-full mb-4 px-4 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 bg-gray-700 text-gray-200"
        >
          <option value="" disabled>Select your job</option>
          <option value="Mechanic">Mechanic</option>
          <option value="Carpenter">Carpenter</option>
          <option value="Plumber">Plumber</option>
          <option value="Driver">Driver</option>
          <option value="Home Advisor">Home Advisor</option>
          <option value="Cleaner">Cleaner</option>
        </select>

        {/* Experience */}
        <label className="block mb-2 text-gray-300 font-medium">Experience</label>
        <select
          name="experience"
          value={applicationData.experience}
          onChange={handleInputChange}
          className="w-full mb-4 px-4 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 bg-gray-700 text-gray-200"
        >
          <option value="" disabled>Select your experience</option>
          <option value="Less than 1 year">Less than 1 year</option>
          <option value="1 year">1 year</option>
          <option value="2 years">2 years</option>
          <option value="3 years">3 years</option>
          <option value="4 years">4 years</option>
          <option value="5 or more years">5 or more years</option>
        </select>

        {/* Email Address */}
        <label className="block mb-2 text-gray-300 font-medium">Email</label>
        <input
          type="text"
          name="email"
          placeholder="you@example.com"
          value={applicationData.email}
          onChange={handleInputChange}
          className="w-full mb-4 px-4 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 bg-gray-700 text-gray-200"
        />

        {/* Username */}
        <label className="block mb-2 text-gray-300 font-medium">Username</label>
        <input
          type="text"
          name="username"
          placeholder="Starts with emp@"
          value={applicationData.username}
          onChange={handleInputChange}
          className="w-full mb-4 px-4 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 bg-gray-700 text-gray-200"
        />

        {/* Password */}
        <label className="block mb-2 text-gray-300 font-medium">Password</label>
        <div className="relative w-full mb-4">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Create a strong password"
            value={applicationData.password}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 bg-gray-700 text-gray-200"
          />
          <button
            type="button"
            onClick={toggleShowPassword}
            className="absolute inset-y-0 right-0 px-3 text-gray-400 hover:text-gray-200"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        {/* Confirm Password */}
        <label className="block mb-2 text-gray-300 font-medium">Confirm Password</label>
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm your password"
          value={applicationData.confirmPassword}
          onChange={handleInputChange}
          className="w-full mb-4 px-4 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 bg-gray-700 text-gray-200"
        />

        {/* View Account Details Button */}
        <button
          onClick={handleViewAccountDetails}
          className="w-full bg-green-700 text-white py-2 rounded-lg hover:bg-green-800 transition duration-200 mb-4"
        >
          View Account Details
        </button>

        {/* Edit Account Button */}
        <button
          onClick={handleEditAccount}
          className="w-full bg-yellow-600 text-white py-2 rounded-lg hover:bg-yellow-700 transition duration-200 mb-4"
        >
          Edit Account
        </button>

        {/* Delete Account Button */}
        <button
          onClick={handleDeleteAccount}
          className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition duration-200"
        >
          Delete Account
        </button>
      </div>
    </div>
  );
}