"use client";

import React, { useState } from "react";

const AdminDashboard = () => {
  const [currentSection, setCurrentSection] = useState("home");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMatch, setPasswordMatch] = useState(true);

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    setPasswordMatch(value === confirmPassword);
  };

  const handleConfirmPasswordChange = (value: string) => {
    setConfirmPassword(value);
    setPasswordMatch(password === value);
  };

  return (
    <div>
      {/* Navigation Bar */}
      <nav className="bg-gray-800 text-white px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <img src="/quickjoblogo.png" alt="Logo" className="h-20 w-20 mr-4" />
          <span className="font-bold text-lg">Admin Dashboard</span>
        </div>

        {/* Links */}
        <div className="flex space-x-6">
          <a
            href="#"
            onClick={() => setCurrentSection("home")}
            className="hover:text-gray-300"
          >
            Home
          </a>
          <a
            href="#"
            onClick={() => setCurrentSection("editEmployee")}
            className="hover:text-gray-300"
          >
            Edit Employee
          </a>
          <a
            href="#"
            onClick={() => setCurrentSection("editPublisher")}
            className="hover:text-gray-300"
          >
            Edit Publisher
          </a>
          <a
            href="#"
            onClick={() => setCurrentSection("clientsCount")}
            className="hover:text-gray-300"
          >
            Clients Count
          </a>
          <a
            href="#"
            onClick={() => setCurrentSection("countOfJobPosts")}
            className="hover:text-gray-300"
          >
            Count of Job Posts
          </a>
        </div>

        {/* Logout Button */}
        <button className="bg-red-500 px-4 py-2 rounded hover:bg-red-600 transition">
          Logout
        </button>
      </nav>

      {/* Page Content */}
      <div className="p-6">
        {currentSection === "home" && (
          <h1 className="text-2xl font-bold">Welcome to the Admin Dashboard !!!</h1>
        )}

        {currentSection === "editEmployee" && (
          <div>
            <h2 className="text-xl font-bold mb-4">Edit Employee</h2>

            {/* Add New Employee Section */}
            <h3 className="text-lg font-semibold mb-4">Add New Employee</h3>
            <form className="space-y-4">
            {/* Full Name */}
          <div className="p-2 rounded-lg shadow-md">
            <label className="block mb-1 text-white-800">Full Name</label>
            <input
              type="text"
              name="name"
             
              className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>
              
          {/* Phone Number */}
          <div className="p-2 rounded-lg shadow-md">
            <label className="block mb-1 text-white-800">Phone Number</label>
            <input
              type="tel"
              name="contact"
              className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>
              {/* Location */}
          <div className="p-2 rounded-lg shadow-md">
            <label className="block mb-1 text-white-800">Location</label>
            <input
              type="text"
              name="location"
              placeholder="Click to get current location"
              className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-green-400"
            /> {/* Get Current Location Button */}
            <button
              onClick={() => alert("Get Current Location functionality coming soon!")}
              className="w-auto bg-white text-black px-4 py-2 rounded mt-2 hover:bg-gray-300 transition duration-200"
            >
              Get Current Location
            </button>
          </div>


{/* Skill */}
<div className="p-2 rounded-lg shadow-md">
  <label className="block mb-1 text-white-800">Skills</label>
  <select
    name="skill"
    className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-green-400"
  >
    <option>Select your job</option>
    <option style={{ color: "black" }}>Mechanic</option>
    <option style={{ color: "black" }}>Carpenter</option>
    <option style={{ color: "black" }}>Plumber</option>
    <option style={{ color: "black" }}>Driver</option>
    <option style={{ color: "black" }}>Home Advisor</option>
    <option style={{ color: "black" }}>Cleaner</option>
  </select>
</div>

              {/* Experience */}
<div className="p-2 rounded-lg shadow-md">
  <label className="block mb-1 text-white-800">Experience</label>
  <select
    name="experience"
    className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-green-400"
  >
    <option>Select your experience</option>
    <option style={{ color: 'black' }}>Less than one year</option>
    <option style={{ color: 'black' }}>1 year</option>
    <option style={{ color: 'black' }}>2 years</option>
    <option style={{ color: 'black' }}>3 years</option>
    <option style={{ color: 'black' }}>4 years</option>
    <option style={{ color: 'black' }}>5 years or more</option>
  </select>
</div>


            {/* Username */}
            <div className="p-2 rounded-lg shadow-md">
            <label className="block mb-1 text-white-800">Username</label>
            <input
              type="text"
              name="username"
              placeholder="should start with emp@"
              className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>

              {/* Email Address */}
          <div className="p-2 rounded-lg shadow-md">
            <label className="block mb-1 text-white-800">Email Address</label>
            <input
              type="email"
              name="email"
              className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>

             {/* Password */}
<div className="p-2 rounded-lg shadow-md relative">
  <label className="block mb-1 text-white-800">Password</label>
  <input
    type={passwordVisible ? "text" : "password"}
    name="password"
    className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-green-400"
  />
  {/* Show/Hide Password Button */}
  <button
    type="button"
    onClick={() => setPasswordVisible(!passwordVisible)}
    className="absolute right-4 top-3/4 transform -translate-y-1/2 text-white-500"
  >
    {passwordVisible ? "Hide" : "Show"}
  </button>
</div>


           {/* Confirm Password */}
<div className="p-2 rounded-lg shadow-md relative">
  <label className="block mb-1 text-white-800">Confirm Password</label>
  <input
    type={confirmPasswordVisible ? "text" : "password"}
    name="confirmPassword"
    className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-green-400"
  />
  {/* Show/Hide Confirm Password Button */}
  <button
    type="button"
    onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
    className="absolute right-4 top-3/4 transform -translate-y-1/2 text-white-500"
  >
    {confirmPasswordVisible ? "Hide" : "Show"}
  </button>
</div>

              {/* Submit Button */}
              <button
                type="submit"
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
              >
                Create Employee
              </button>
            </form>

<<<<<<< HEAD
            {/* Update Employee Section */}
            <h3 className="text-lg font-semibold mt-8 mb-4">Update Employee Details</h3>
            <form className="space-y-4">
              {/* Search Username */}
              <div>
                <label className="block text-sm font-medium">Search Username</label>
                <div className="flex">
                  <input
                    type="text"
                    placeholder="Enter username"
                    className="border border-gray-300 rounded-l w-full p-2"
                  />
                  <button
                    type="button"
                    className="bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-600 transition"
                  >
                    Search
                  </button>
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-medium">Name</label>
                <input
                  type="text"
                  className="border border-gray-300 rounded w-full p-2"
                />
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-sm font-medium">Phone Number</label>
                <input
                  type="text"
                  className="border border-gray-300 rounded w-full p-2"
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium">Location</label>
                <input
                  type="text"
                  placeholder="Click to get current location"
                  className="border border-gray-300 rounded w-full p-2"
                />
                <button className="bg-blue-500 text-white px-4 py-2 mt-2 rounded hover:bg-blue-600 transition">
                  Get Current Location
                </button>
              </div>

              {/* Skills */}
              <div>
                <label className="block text-sm font-medium">Skills</label>
                <select
                  multiple
                  className="border border-gray-300 rounded w-full p-2"
                >
                  <option>Driver</option>
                  <option>Helper</option>
                  <option>Builder</option>
                  <option>Plumber</option>
                  <option>Cook</option>
                </select>
              </div>

              {/* Experience */}
              <div>
                <label className="block text-sm font-medium">Experience</label>
                <select className="border border-gray-300 rounded w-full p-2">
                  <option>Less than 1 year</option>
                  <option>1 year</option>
                  <option>2 years</option>
                  <option>3 years</option>
                  <option>4 years</option>
                  <option>5 or more years</option>
                </select>
              </div>

              {/* Username */}
              <div>
                <label className="block text-sm font-medium">Username</label>
                <input
                  type="text"
                  placeholder="Should start with emp@"
                  className="border border-gray-300 rounded w-full p-2"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium">Email</label>
                <input
                  type="email"
                  className="border border-gray-300 rounded w-full p-2"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium">Password</label>
                <div className="relative">
                  <input
                    type={passwordVisible ? "text" : "password"}
                    className="border border-gray-300 rounded w-full p-2"
                    value={password}
                    onChange={(e) => handlePasswordChange(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setPasswordVisible(!passwordVisible)}
                    className="absolute right-2 top-2 text-sm text-gray-500"
                  >
                    {passwordVisible ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={confirmPasswordVisible ? "text" : "password"}
                    className={`border ${
                      passwordMatch ? "border-gray-300" : "border-red-500"
                    } rounded w-full p-2`}
                    value={confirmPassword}
                    onChange={(e) =>
                      handleConfirmPasswordChange(e.target.value)
                    }
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setConfirmPasswordVisible(!confirmPasswordVisible)
                    }
                    className="absolute right-2 top-2 text-sm text-gray-500"
                  >
                    {confirmPasswordVisible ? "Hide" : "Show"}
                  </button>
                </div>
                {!passwordMatch && (
                  <p className="text-red-500 text-sm mt-1">
                    Passwords do not match.
                  </p>
                )}
              </div>
=======
              {/* Horizontal Line */}
        <hr className="my-6 border-t-2 border-gray-300 w-11/12 mx-auto" />

            {/* Update Employee Section */}
            <h3 className="text-lg font-semibold mt-8 mb-4">Update Employee Details</h3>
            <form className="space-y-4">
              {/* Username */}
<div className="p-2 rounded-lg shadow-md relative">
  <label className="block mb-1 text-white-800">Search Username</label>
  <div className="flex items-center">
    <input
      type="text"
      name="username"
      placeholder="Enter Username"
      className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-green-400"
    />
    <button
      onClick={() => alert(`Searching for username: $`)} // Placeholder for actual search functionality
      className="ml-2 bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition duration-200"
      aria-label="Search Username"
    >
      Search
    </button>
  </div>
</div>

              {/* Full Name */}
          <div className="p-2 rounded-lg shadow-md">
            <label className="block mb-1 text-white-800">Full Name</label>
            <input
              type="text"
              name="name"
             
              className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>
              
          {/* Phone Number */}
          <div className="p-2 rounded-lg shadow-md">
            <label className="block mb-1 text-white-800">Phone Number</label>
            <input
              type="tel"
              name="contact"
              className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>
              {/* Location */}
          <div className="p-2 rounded-lg shadow-md">
            <label className="block mb-1 text-white-800">Location</label>
            <input
              type="text"
              name="location"
              placeholder="Click to get current location"
              className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-green-400"
            /> {/* Get Current Location Button */}
            <button
              onClick={() => alert("Get Current Location functionality coming soon!")}
              className="w-auto bg-white text-black px-4 py-2 rounded mt-2 hover:bg-gray-300 transition duration-200"
            >
              Get Current Location
            </button>
          </div>



            {/* Skill */}
<div className="p-2 rounded-lg shadow-md">
  <label className="block mb-1 text-white-800">Skills</label>
  <select
    name="skill"
    className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-green-400"
  >
    <option>Select your job</option>
    <option style={{ color: "black" }}>Mechanic</option>
    <option style={{ color: "black" }}>Carpenter</option>
    <option style={{ color: "black" }}>Plumber</option>
    <option style={{ color: "black" }}>Driver</option>
    <option style={{ color: "black" }}>Home Advisor</option>
    <option style={{ color: "black" }}>Cleaner</option>
  </select>
</div>
           {/* Experience */}
<div className="p-2 rounded-lg shadow-md">
  <label className="block mb-1 text-white-800">Experience</label>
  <select
    name="experience"
    className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-green-400"
  >
    <option>Select your experience</option>
    <option style={{ color: 'black' }}>Less than one year</option>
    <option style={{ color: 'black' }}>1 year</option>
    <option style={{ color: 'black' }}>2 years</option>
    <option style={{ color: 'black' }}>3 years</option>
    <option style={{ color: 'black' }}>4 years</option>
    <option style={{ color: 'black' }}>5 years or more</option>
  </select>
</div>


            {/* Username */}
            <div className="p-2 rounded-lg shadow-md">
            <label className="block mb-1 text-white-800">Username</label>
            <input
              type="text"
              name="username"
              placeholder="should start with emp@"
              className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>

              {/* Email Address */}
          <div className="p-2 rounded-lg shadow-md">
            <label className="block mb-1 text-white-800">Email Address</label>
            <input
              type="email"
              name="email"
              className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>

             {/* Password */}
<div className="p-2 rounded-lg shadow-md relative">
  <label className="block mb-1 text-white-800">Password</label>
  <input
    type={passwordVisible ? "text" : "password"}
    name="password"
    className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-green-400"
  />
  {/* Show/Hide Password Button */}
  <button
    type="button"
    onClick={() => setPasswordVisible(!passwordVisible)}
    className="absolute right-4 top-3/4 transform -translate-y-1/2 text-white-500"
  >
    {passwordVisible ? "Hide" : "Show"}
  </button>
</div>


           {/* Confirm Password */}
<div className="p-2 rounded-lg shadow-md relative">
  <label className="block mb-1 text-white-800">Confirm Password</label>
  <input
    type={confirmPasswordVisible ? "text" : "password"}
    name="confirmPassword"
    className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-green-400"
  />
  {/* Show/Hide Confirm Password Button */}
  <button
    type="button"
    onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
    className="absolute right-4 top-3/4 transform -translate-y-1/2 text-white-500"
  >
    {confirmPasswordVisible ? "Hide" : "Show"}
  </button>
</div>
>>>>>>> 1615524182351e550727984324dc5511d1d11129

              {/* Submit Button */}
              <button
                type="submit"
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
              >
                Update Employee
              </button>
            </form>

<<<<<<< HEAD
=======
              {/* Horizontal Line */}
        <hr className="my-6 border-t-2 border-gray-300 w-11/12 mx-auto" />
        
>>>>>>> 1615524182351e550727984324dc5511d1d11129
            {/* Delete Employee Section */}
            <h3 className="text-lg font-semibold mt-8 mb-4">Delete Employee</h3>
            <form className="space-y-4">
              {/* Username */}
<<<<<<< HEAD
              <div>
                <label className="block text-sm font-medium">Username</label>
                <input
                  type="text"
                  placeholder="Enter username"
                  className="border border-gray-300 rounded w-full p-2"
                />
              </div>
=======
        <div className="p-2 rounded-lg shadow-md">
            <label className="block mb-1 text-white-800">Username</label>
            <input
              type="text"
              name="username"
              placeholder="Enter Username"
              className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>
>>>>>>> 1615524182351e550727984324dc5511d1d11129

              {/* Delete Button */}
              <button
                type="button"
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
              >
                Delete Employee
              </button>
            </form>
          </div>
        )}

        {currentSection === "editPublisher" && (
          <div>
            <h2 className="text-xl font-bold mb-4">Edit Publisher</h2>

            {/* Add New Publisher Section */}
            <h3 className="text-lg font-semibold mb-4">Add New Publisher</h3>
            <form className="space-y-4">
<<<<<<< HEAD
              {/* Name */}
              <div>
                <label className="block text-sm font-medium">Name</label>
                <input
                  type="text"
                  className="border border-gray-300 rounded w-full p-2"
                />
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-sm font-medium">Phone Number</label>
                <input
                  type="text"
                  className="border border-gray-300 rounded w-full p-2"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium">Email</label>
                <input
                  type="email"
                  className="border border-gray-300 rounded w-full p-2"
                />
              </div>

              {/* Username */}
              <div>
                <label className="block text-sm font-medium">Username</label>
                <input
                  type="text"
                  placeholder="Should start with pub@"
                  className="border border-gray-300 rounded w-full p-2"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium">Password</label>
                <div className="relative">
                  <input
                    type={passwordVisible ? "text" : "password"}
                    className="border border-gray-300 rounded w-full p-2"
                    value={password}
                    onChange={(e) => handlePasswordChange(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setPasswordVisible(!passwordVisible)}
                    className="absolute right-2 top-2 text-sm text-gray-500"
                  >
                    {passwordVisible ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={confirmPasswordVisible ? "text" : "password"}
                    className={`border ${
                      passwordMatch ? "border-gray-300" : "border-red-500"
                    } rounded w-full p-2`}
                    value={confirmPassword}
                    onChange={(e) =>
                      handleConfirmPasswordChange(e.target.value)
                    }
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setConfirmPasswordVisible(!confirmPasswordVisible)
                    }
                    className="absolute right-2 top-2 text-sm text-gray-500"
                  >
                    {confirmPasswordVisible ? "Hide" : "Show"}
                  </button>
                </div>
                {!passwordMatch && (
                  <p className="text-red-500 text-sm mt-1">
                    Passwords do not match.
                  </p>
                )}
              </div>

=======
              {/* Full Name */}
          <div className="p-2 rounded-lg shadow-md">
            <label className="block mb-1 text-white-800">Full Name</label>
            <input
              type="text"
              name="name"
             
              className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>
              
          {/* Phone Number */}
          <div className="p-2 rounded-lg shadow-md">
            <label className="block mb-1 text-white-800">Phone Number</label>
            <input
              type="tel"
              name="contact"
              className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>
         {/* Username */}
         <div className="p-2 rounded-lg shadow-md">
            <label className="block mb-1 text-white-800">Username</label>
            <input
              type="text"
              name="username"
              placeholder="should start with pub@"
              className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>

              {/* Email Address */}
          <div className="p-2 rounded-lg shadow-md">
            <label className="block mb-1 text-white-800">Email Address</label>
            <input
              type="email"
              name="email"
              className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>

             {/* Password */}
<div className="p-2 rounded-lg shadow-md relative">
  <label className="block mb-1 text-white-800">Password</label>
  <input
    type={passwordVisible ? "text" : "password"}
    name="password"
    className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-green-400"
  />
  {/* Show/Hide Password Button */}
  <button
    type="button"
    onClick={() => setPasswordVisible(!passwordVisible)}
    className="absolute right-4 top-3/4 transform -translate-y-1/2 text-white-500"
  >
    {passwordVisible ? "Hide" : "Show"}
  </button>
</div>


           {/* Confirm Password */}
<div className="p-2 rounded-lg shadow-md relative">
  <label className="block mb-1 text-white-800">Confirm Password</label>
  <input
    type={confirmPasswordVisible ? "text" : "password"}
    name="confirmPassword"
    className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-green-400"
  />
  {/* Show/Hide Confirm Password Button */}
  <button
    type="button"
    onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
    className="absolute right-4 top-3/4 transform -translate-y-1/2 text-white-500"
  >
    {confirmPasswordVisible ? "Hide" : "Show"}
  </button>
</div>
>>>>>>> 1615524182351e550727984324dc5511d1d11129
              {/* Submit Button */}
              <button
                type="submit"
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
              >
                Add New Publisher
              </button>
            </form>

<<<<<<< HEAD
            {/* Update Publisher Section */}
            <h3 className="text-lg font-semibold mt-8 mb-4">Update Publisher</h3>
            <form className="space-y-4">
              {/* Search Username */}
              <div>
                <label className="block text-sm font-medium">Search Username</label>
                <div className="flex">
                  <input
                    type="text"
                    placeholder="Enter username"
                    className="border border-gray-300 rounded-l w-full p-2"
                  />
                  <button
                    type="button"
                    className="bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-600 transition"
                  >
                    Search
                  </button>
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-medium">Name</label>
                <input
                  type="text"
                  className="border border-gray-300 rounded w-full p-2"
                />
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-sm font-medium">Phone Number</label>
                <input
                  type="text"
                  className="border border-gray-300 rounded w-full p-2"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium">Email</label>
                <input
                  type="email"
                  className="border border-gray-300 rounded w-full p-2"
                />
              </div>

              {/* Username */}
              <div>
                <label className="block text-sm font-medium">Username</label>
                <input
                  type="text"
                  placeholder="Should start with pub@"
                  className="border border-gray-300 rounded w-full p-2"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium">Password</label>
                <div className="relative">
                  <input
                    type={passwordVisible ? "text" : "password"}
                    className="border border-gray-300 rounded w-full p-2"
                    value={password}
                    onChange={(e) => handlePasswordChange(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setPasswordVisible(!passwordVisible)}
                    className="absolute right-2 top-2 text-sm text-gray-500"
                  >
                    {passwordVisible ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={confirmPasswordVisible ? "text" : "password"}
                    className={`border ${
                      passwordMatch ? "border-gray-300" : "border-red-500"
                    } rounded w-full p-2`}
                    value={confirmPassword}
                    onChange={(e) =>
                      handleConfirmPasswordChange(e.target.value)
                    }
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setConfirmPasswordVisible(!confirmPasswordVisible)
                    }
                    className="absolute right-2 top-2 text-sm text-gray-500"
                  >
                    {confirmPasswordVisible ? "Hide" : "Show"}
                  </button>
                </div>
                {!passwordMatch && (
                  <p className="text-red-500 text-sm mt-1">
                    Passwords do not match.
                  </p>
                )}
              </div>
=======
              {/* Horizontal Line */}
        <hr className="my-6 border-t-2 border-gray-300 w-11/12 mx-auto" />

            {/* Update Publisher Section */}
            <h3 className="text-lg font-semibold mt-8 mb-4">Update Publisher</h3>
            <form className="space-y-4">
              {/* Username */}
           <div className="p-2 rounded-lg shadow-md relative">
           <label className="block mb-1 text-white-800">Search Username</label>
           <div className="flex items-center">
           <input
           type="text"
            name="username"
           placeholder="Enter Username"
            className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-green-400"
          />
         <button
         onClick={() => alert(`Searching for username: $`)} // Placeholder for actual search functionality
         className="ml-2 bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition duration-200"
          aria-label="Search Username"
          >
          Search
          </button>
          </div>
          </div>
 {/* Full Name */}
 <div className="p-2 rounded-lg shadow-md">
            <label className="block mb-1 text-white-800">Full Name</label>
            <input
              type="text"
              name="name"
             
              className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>
              
          {/* Phone Number */}
          <div className="p-2 rounded-lg shadow-md">
            <label className="block mb-1 text-white-800">Phone Number</label>
            <input
              type="tel"
              name="contact"
              className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>
         {/* Username */}
         <div className="p-2 rounded-lg shadow-md">
            <label className="block mb-1 text-white-800">Username</label>
            <input
              type="text"
              name="username"
              placeholder="should start with pub@"
              className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>

              {/* Email Address */}
          <div className="p-2 rounded-lg shadow-md">
            <label className="block mb-1 text-white-800">Email Address</label>
            <input
              type="email"
              name="email"
              className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>

            {/* Password */}
<div className="p-2 rounded-lg shadow-md relative">
  <label className="block mb-1 text-white-800">Password</label>
  <input
    type={passwordVisible ? "text" : "password"}
    name="password"
    className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-green-400"
  />
  {/* Show/Hide Password Button */}
  <button
    type="button"
    onClick={() => setPasswordVisible(!passwordVisible)}
    className="absolute right-4 top-3/4 transform -translate-y-1/2 text-white-500"
  >
    {passwordVisible ? "Hide" : "Show"}
  </button>
</div>


           {/* Confirm Password */}
<div className="p-2 rounded-lg shadow-md relative">
  <label className="block mb-1 text-white-800">Confirm Password</label>
  <input
    type={confirmPasswordVisible ? "text" : "password"}
    name="confirmPassword"
    className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-green-400"
  />
  {/* Show/Hide Confirm Password Button */}
  <button
    type="button"
    onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
    className="absolute right-4 top-3/4 transform -translate-y-1/2 text-white-500"
  >
    {confirmPasswordVisible ? "Hide" : "Show"}
  </button>
</div>

>>>>>>> 1615524182351e550727984324dc5511d1d11129

              {/* Submit Button */}
              <button
                type="submit"
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
              >
                Update Publisher
              </button>
            </form>

<<<<<<< HEAD
            {/* Delete Publisher Section */}
            <h3 className="text-lg font-semibold mt-8 mb-4">Delete Publisher</h3>
            <form className="space-y-4">
              {/* Username */}
              <div>
                <label className="block text-sm font-medium">Username</label>
                <input
                  type="text"
                  placeholder="Enter username"
                  className="border border-gray-300 rounded w-full p-2"
                />
              </div>
=======
  {/* Horizontal Line */}
  <hr className="my-6 border-t-2 border-gray-300 w-11/12 mx-auto" />

            {/* Delete Employee Section */}
            <h3 className="text-lg font-semibold mt-8 mb-4">Delete Publisher</h3>
            <form className="space-y-4">
              {/* Username */}
        <div className="p-2 rounded-lg shadow-md">
            <label className="block mb-1 text-white-800">Username</label>
            <input
              type="text"
              name="username"
              placeholder="Enter Username"
              className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>
>>>>>>> 1615524182351e550727984324dc5511d1d11129

              {/* Delete Button */}
              <button
                type="button"
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
              >
                Delete Publisher
              </button>
            </form>
          </div>
        )}

        {currentSection === "clientsCount" && (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Count of Clients : 00</h2>
            <div className="flex justify-between mt-8">
              <p className="text-lg font-medium">Count of Employee : 00</p>
              <p className="text-lg font-medium">Count of Publishers : 00</p>
            </div>
          </div>
        )}

        {currentSection === "countOfJobPosts" && (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Count of Job Posts</h2>
            <p className="text-lg font-medium">00</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;