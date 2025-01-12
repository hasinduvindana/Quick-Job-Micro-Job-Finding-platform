"use client";

import { useState } from "react";

export default function JobListings() {
  const [jobPostData, setJobPostData] = useState<{
    title: string;
    description: string;
    location: string;
    salary: string;
    photo: File | null;
    category: string;
    jobType: string; // Job Type (Full Time or Part Time)
    isUrgent: boolean; // New field for Urgent checkbox
  }>({
    title: "",
    description: "",
    location: "",
    salary: "",
    photo: null,
    category: "",
    jobType: "", // Default value for jobType
    isUrgent: false, // Default value for isUrgent
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setJobPostData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRadioChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value } = e.target;
    setJobPostData((prev) => ({ ...prev, jobType: value }));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setJobPostData((prev) => ({ ...prev, photo: file }));
  };

  const handleUrgencyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = e.target;
    setJobPostData((prev) => ({ ...prev, isUrgent: checked }));
  };

  const handleSubmitJobPost = () => {
    const photoName = jobPostData.photo
      ? jobPostData.photo.name
      : "No photo uploaded";
    alert(`Job Post Submitted:
      Title: ${jobPostData.title}
      Description: ${jobPostData.description}
      Location: ${jobPostData.location}
      Salary: ${jobPostData.salary}
      Category: ${jobPostData.category}
      Job Type: ${jobPostData.jobType}
      Urgent: ${jobPostData.isUrgent ? "Yes" : "No"}
      Photo: ${photoName}
    `);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{
        background: "linear-gradient(135deg, #000000, #003300, #e6d300)",
      }}
    >
      {/* Create Job Post Form */}
      <div className="max-w-md w-full p-6 rounded-xl shadow-xl bg-gray-800 border border-gray-600">
        <h2 className="text-2xl font-semibold mb-6 text-gray-200 text-center">
          Create Job Post
        </h2>
        <label
          htmlFor="title"
          className="text-gray-200 block mb-2 font-semibold"
        >
          Job Title:
        </label>
        <input
          type="text"
          name="title"
          placeholder="Enter Your Job Title"
          value={jobPostData.title}
          onChange={handleInputChange}
          className="w-full mb-4 px-4 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 bg-gray-700 text-gray-200"
        />
        <label
          htmlFor="description"
          className="text-gray-200 block mb-2 font-semibold"
        >
          Job Description:
        </label>
        <textarea
          name="description"
          placeholder="Add a description about your job role, if you want you can add your land phone number"
          value={jobPostData.description}
          onChange={handleInputChange}
          className="w-full mb-4 px-4 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 bg-gray-700 text-gray-200"
          style={{ minHeight: "120px" }} // Added extra space for description box
        />
        {/* Job Location Section */}
        <label
          htmlFor="location"
          className="text-gray-200 block mb-2 font-semibold"
        >
          Location:
        </label>
        <input
          type="text"
          name="location"
          placeholder="Click to get location"
          value={jobPostData.location}
          onChange={handleInputChange}
          className="w-full mb-4 px-4 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 bg-gray-700 text-gray-200"
        />

        {/* Job Salary Input */}
        <label
          htmlFor="salary"
          className="text-gray-200 block mb-2 font-semibold"
        >
          Job Salary:
        </label>
        <input
          type="text"
          name="salary"
          placeholder="Enter your expected salary"
          value={jobPostData.salary}
          onChange={handleInputChange}
          className="w-full mb-4 px-4 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 bg-gray-700 text-gray-200"
        />

        {/* Job Category Dropdown */}
        <label
          htmlFor="category"
          className="text-gray-200 block mb-2 font-semibold"
        >
          Job Category:
        </label>
        <select
          id="category"
          name="category"
          value={jobPostData.category}
          onChange={handleInputChange}
          className="w-full mb-4 px-4 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 bg-gray-700 text-gray-200"
        >
          <option value="" disabled>
            Select Category
          </option>
          <option value="Mechanic">Mechanic</option>
          <option value="Carpenter">Carpenter</option>
          <option value="Plumber">Plumber</option>
          <option value="Driver">Driver</option>
          <option value="Home Advisor">Home Advisor</option>
          <option value="Cleaner">Cleaner</option>
        </select>

        {/* Photo Upload Input */}
        <label
          htmlFor="photo"
          className="text-gray-200 block mb-2 font-semibold"
        >
          Upload Image:
        </label>
        <input
          type="file"
          id="photo"
          name="photo"
          accept="image/*"
          onChange={handlePhotoChange}
          className="w-full mb-4 text-gray-200 bg-gray-700 border border-gray-600 rounded-lg p-2"
        />

        {/* Job Type (Full Time or Part Time) Radio Buttons */}
        <div className="text-gray-200 mb-4">
          <p className="font-semibold mb-2" style={{ color: "#FFD700" }}>
            Job Type:
          </p>
          <div className="flex flex-col space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                name="jobType"
                value="Full Time"
                checked={jobPostData.jobType === "Full Time"}
                onChange={handleRadioChange}
                className="mr-2"
              />
              Full Time
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="jobType"
                value="Part Time"
                checked={jobPostData.jobType === "Part Time"}
                onChange={handleRadioChange}
                className="mr-2"
              />
              Part Time
            </label>
          </div>
        </div>

        {/* Urgency Checkbox */}
        <div className="text-gray-200 mb-4">
          <p className="font-semibold mb-2" style={{ color: "#FFD700" }}>
            Is this urgent?
          </p>
          <label className="flex items-center">
            <input
              type="checkbox"
              name="isUrgent"
              checked={jobPostData.isUrgent}
              onChange={handleUrgencyChange}
              className="mr-2"
            />
            Urgent
          </label>
        </div>

        <button
          onClick={handleSubmitJobPost}
          className="w-full bg-green-700 text-white py-2 rounded-lg hover:bg-green-800 transition duration-200"
        >
          Submit
        </button>
      </div>
    </div>
  );
}
