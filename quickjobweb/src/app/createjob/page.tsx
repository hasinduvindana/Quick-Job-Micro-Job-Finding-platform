"use client";

import { useState } from "react";
import { addJobPost } from "../../firebase/firestoreService";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function JobListings() {
  const [jobPostData, setJobPostData] = useState<{
    title: string;
    description: string;
    location: string;
    salary: string;
    photo: File | null;
    //category: string;
    jobType: string;
    isUrgent: boolean;
  }>({
    title: "",
    description: "",
    location: "",
    salary: "",
    photo: null,
    //category: "",
    jobType: "",
    isUrgent: false,
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setJobPostData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const handleSubmitJobPost = async () => {
    try {
      const { title, description, location, salary, jobType, isUrgent, photo } = jobPostData;
      let photoUrl = "";
      let photoName = "";

      if (photo) {
        const storage = getStorage();
        const storageRef = ref(storage, `jobbanner/${photo.name}`);
        await uploadBytes(storageRef, photo);
        photoUrl = await getDownloadURL(storageRef);
        photoName = photo.name;
      }

      const jobData = {
        title,
        description,
        location,
        salary,
        photoUrl,   // Download URL for displaying the image
        photoName,  // Image file name
        //category,
        jobType,
        isUrgent,
      };

      const docId = await addJobPost(jobData);

      alert(`Job Post Submitted Successfully! Document ID: ${docId}`);
    } catch (error) {
      console.error("Error submitting job post:", error);
      alert("Failed to submit job post. Please try again.");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{
        background: "linear-gradient(135deg, #000000, #003300, #e6d300)",
      }}
    >
      <div className="max-w-md w-full p-6 rounded-xl shadow-xl bg-gray-800 border border-gray-600">
        <h2 className="text-2xl font-semibold mb-6 text-gray-200 text-center">
          Create Job Post
        </h2>
        <form>
          {/* Title */}
          <div className="mb-4">
            <label className="block text-gray-200 mb-2">Title</label>
            <input
              type="text"
              name="title"
              value={jobPostData.title}
              onChange={handleInputChange}
              className="w-full px-3 py-2 rounded-lg bg-gray-700 text-gray-200 border border-gray-600"
            />
          </div>
          {/* Description */}
          <div className="mb-4">
            <label className="block text-gray-200 mb-2">Description</label>
            <textarea
              name="description"
              value={jobPostData.description}
              onChange={handleInputChange}
              className="w-full px-3 py-2 rounded-lg bg-gray-700 text-gray-200 border border-gray-600"
            ></textarea>
          </div>
          {/* Location */}
          <div className="mb-4">
            <label className="block text-gray-200 mb-2">Location</label>
            <input
              type="text"
              name="location"
              value={jobPostData.location}
              onChange={handleInputChange}
              className="w-full px-3 py-2 rounded-lg bg-gray-700 text-gray-200 border border-gray-600"
            />
          </div>
          {/* Salary */}
          <div className="mb-4">
            <label className="block text-gray-200 mb-2">Salary</label>
            <input
              type="text"
              name="salary"
              value={jobPostData.salary}
              onChange={handleInputChange}
              className="w-full px-3 py-2 rounded-lg bg-gray-700 text-gray-200 border border-gray-600"
            />
          </div>
          {/* Photo */}
          <div className="mb-4">
            <label className="block text-gray-200 mb-2">Photo</label>
            <input
              type="file"
              onChange={handlePhotoChange}
              className="w-full px-3 py-2 rounded-lg bg-gray-700 text-gray-200 border border-gray-600"
            />
          </div>
          {/* Job Type */}
          <div className="mb-4">
            <label className="block text-gray-200 mb-2">Job Type</label>
            <div className="flex items-center space-x-4">
              <label className="text-gray-200">
                <input
                  type="radio"
                  name="jobType"
                  value="Full-Time"
                  checked={jobPostData.jobType === "Full-Time"}
                  onChange={handleRadioChange}
                />
                Full-Time
              </label>
              <label className="text-gray-200">
                <input
                  type="radio"
                  name="jobType"
                  value="Part-Time"
                  checked={jobPostData.jobType === "Part-Time"}
                  onChange={handleRadioChange}
                />
                Part-Time
              </label>
            </div>
          </div>
          {/* Urgency */}
          <div className="mb-4">
            <label className="block text-gray-200 mb-2">Urgent</label>
            <input
              type="checkbox"
              checked={jobPostData.isUrgent}
              onChange={handleUrgencyChange}
              className="rounded bg-gray-700 text-gray-200 border-gray-600"
            />
          </div>
          <button
            type="button"
            onClick={handleSubmitJobPost}
            className="w-full bg-green-700 text-white py-2 rounded-lg hover:bg-green-800 transition duration-200"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
