"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import { collection, doc, getDoc, addDoc, getFirestore, Timestamp } from "firebase/firestore";
import { initializeApp } from "firebase/app";

// Firebase configuration (using your existing config)
const firebaseConfig = {
  apiKey: "AIzaSyCdtJBz4_PcbYgEsDM4ib3WBq-6mSdBxwA",
  authDomain: "quickjobwebapp.firebaseapp.com",
  projectId: "quickjobwebapp",
  storageBucket: "quickjobwebapp.appspot.com",
  messagingSenderId: "320266323421",
  appId: "1:320266323421:web:76dcf28a61f4100e5de234",
  measurementId: "G-3ZYK787XM5",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

// Interfaces
interface JobPost {
  id: string;
  title: string;
  category: string[];
  supplier: string;
  description: string;
  phone: string;
  email: string;
  location: string;
  images: string[];
  imageCount: number;
  publisherEmail: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  status: string;
  views: number;
  applications: number;
}

interface Applicant {
  name: string;
  address: string;
  jobCategory: string;
  contactNumber: string;
  jobTitle: string;
  publisherEmail: string;
  appliedAt: Timestamp;
}

export default function JobDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  
  const [jobDetails, setJobDetails] = useState<JobPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactType, setContactType] = useState<'email' | 'phone'>('email');
  
  // Application form state
  const [applicationData, setApplicationData] = useState({
    name: "",
    address: "",
    contactNumber: ""
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch job details
  const getJobDetails = async (jobId: string): Promise<JobPost | null> => {
    try {
      const docRef = doc(firestore, "jobposts", jobId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data()
        } as JobPost;
      } else {
        console.log("No such document!");
        return null;
      }
    } catch (error) {
      console.error("Error fetching job details:", error);
      return null;
    }
  };

  // Submit application
  const submitApplication = async (applicationData: Omit<Applicant, 'appliedAt'>): Promise<boolean> => {
    try {
      const docRef = await addDoc(collection(firestore, "applicant"), {
        ...applicationData,
        appliedAt: Timestamp.now()
      });
      
      console.log("Application submitted with ID:", docRef.id);
      return true;
    } catch (error) {
      console.error("Error submitting application:", error);
      return false;
    }
  };

  useEffect(() => {
    if (id) {
      const fetchJobDetails = async () => {
        try {
          setLoading(true);
          setError(null);
          const details = await getJobDetails(id);
          setJobDetails(details);
          
          if (!details) {
            setError("Job not found");
          }
        } catch (error) {
          console.error("Error fetching job details:", error);
          setError("Failed to load job details");
        } finally {
          setLoading(false);
        }
      };

      fetchJobDetails();
    }
  }, [id]);

  const handleShowContact = (type: 'email' | 'phone') => {
    setContactType(type);
    setShowContactModal(true);
  };

  const handleApplySubmit = async () => {
    if (!jobDetails || !applicationData.name.trim() || !applicationData.address.trim() || !applicationData.contactNumber.trim()) {
      alert("Please fill in all fields");
      return;
    }

    // Basic phone number validation
    const phoneRegex = /^[0-9+\-\s()]+$/;
    if (!phoneRegex.test(applicationData.contactNumber)) {
      alert("Please enter a valid contact number");
      return;
    }

    setSubmitting(true);
    
    try {
      const applicationPayload: Omit<Applicant, 'appliedAt'> = {
        name: applicationData.name.trim(),
        address: applicationData.address.trim(),
        jobCategory: jobDetails.category.join(", "),
        contactNumber: applicationData.contactNumber.trim(),
        jobTitle: jobDetails.title,
        publisherEmail: jobDetails.publisherEmail
      };

      const success = await submitApplication(applicationPayload);
      
      if (success) {
        alert("Application submitted successfully!");
        setShowApplyModal(false);
        setApplicationData({ name: "", address: "", contactNumber: "" });
      } else {
        alert("Failed to submit application. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting application:", error);
      alert("An error occurred while submitting your application. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCloseApplyModal = () => {
    setShowApplyModal(false);
    setApplicationData({ name: "", address: "", contactNumber: "" });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-purple-900 to-black text-white flex items-center justify-center">
        <div className="text-center">
          <motion.div
            className="w-12 h-12 border-4 border-t-purple-500 border-b-purple-200 border-l-purple-200 border-r-purple-200 rounded-full mx-auto mb-4"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          />
          <p className="text-gray-300">Loading job details...</p>
        </div>
      </div>
    );
  }

  if (error || !jobDetails) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-purple-900 to-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">{error || "Job Not Found"}</h1>
          <p className="text-gray-300 mb-6">The job you&#39;re looking for doesn&#39;t exist or has been removed.</p>
          <button
            onClick={() => router.push('/employeedashboard')}
            className="bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded-lg transition"
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-900 to-black text-white">
      {/* Header */}
      <div className="bg-black/50 backdrop-blur-md p-6">
        <button
          onClick={() => router.push('/employeedashboard')}
          className="mb-4 text-purple-300 hover:text-white transition flex items-center gap-2"
        >
          ← Back to Dashboard
        </button>
        
        {/* Job Title */}
        <h1 className="text-3xl font-bold mb-6 text-white">{jobDetails.title}</h1>
        
        {/* Job Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-black/30 p-4 rounded-lg">
            <span className="text-purple-300 text-sm font-medium">📍 Location</span>
            <p className="text-white font-semibold mt-1">{jobDetails.location}</p>
          </div>
          <div className="bg-black/30 p-4 rounded-lg">
            <span className="text-purple-300 text-sm font-medium">🏢 Supplier</span>
            <p className="text-white font-semibold mt-1">{jobDetails.supplier}</p>
          </div>
          <div className="bg-black/30 p-4 rounded-lg">
            <span className="text-purple-300 text-sm font-medium">🏷️ Categories</span>
            <div className="flex flex-wrap gap-1 mt-2">
              {jobDetails.category.map((cat, index) => (
                <span 
                  key={index}
                  className="bg-purple-700/50 text-purple-200 text-xs px-2 py-1 rounded-full font-medium"
                >
                  {cat}
                </span>
              ))}
            </div>
          </div>
          <div className="bg-black/30 p-4 rounded-lg">
            <span className="text-purple-300 text-sm font-medium">📅 Posted</span>
            <p className="text-white font-semibold mt-1">
              {jobDetails.createdAt.toDate().toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 max-w-6xl mx-auto">
        {/* Images */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4 text-white">Images</h2>
          {jobDetails.images && jobDetails.images.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {jobDetails.images.map((imageUrl, index) => (
                <div key={index} className="relative group">
                  <Image
                    src={imageUrl}
                    width={400}
                    height={300}
                    alt={`${jobDetails.title} - Image ${index + 1}`}
                    className="rounded-lg object-cover w-full h-64 group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ))}
            </div>
          ) : (
            // Show category image from public folder if no images
            jobDetails.category && jobDetails.category.length > 0 ? (
              <div className="flex items-center justify-center">
                <Image
                  src={`/${jobDetails.category[0]}.jpg`}
                  width={400}
                  height={300}
                  alt={jobDetails.title}
                  className="rounded-lg object-cover w-full h-64"
                />
              </div>
            ) : (
              <div className="bg-gray-700/50 rounded-lg h-64 flex items-center justify-center border-2 border-dashed border-gray-600">
                <div className="text-center">
                  <div className="text-4xl mb-2">📷</div>
                  <span className="text-gray-400">No images available for this job</span>
                </div>
              </div>
            )
          )}
        </div>

        {/* Description */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4 text-white">Job Description</h2>
          <div className="bg-black/40 rounded-lg p-6 border border-purple-600/20">
            <p className="text-gray-200 leading-relaxed whitespace-pre-wrap">
              {jobDetails.description}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-black/40 rounded-lg p-6 border border-purple-600/20">
          <h3 className="text-lg font-bold mb-4 text-white">Contact & Apply</h3>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => handleShowContact('email')}
              className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg transition flex items-center gap-2 font-medium"
            >
              📧 Show Email
            </button>
            <button
              onClick={() => handleShowContact('phone')}
              className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg transition flex items-center gap-2 font-medium"
            >
              📞 Show Contact
            </button>
            <button
              onClick={() => setShowApplyModal(true)}
              className="bg-purple-600 hover:bg-purple-700 px-8 py-3 rounded-lg transition font-semibold text-lg"
            >
              🚀 Apply Now
            </button>
          </div>
        </div>
      </div>

      {/* Contact Modal */}
      {showContactModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="bg-gray-800 p-6 rounded-2xl max-w-md w-full border border-purple-600/30"
          >
            <div className="text-center">
              <h3 className="text-xl font-bold mb-4 text-white">
                {contactType === 'email' ? '📧 Email Address' : '📞 Contact Number'}
              </h3>
              <div className="bg-black/50 p-4 rounded-lg mb-6 border border-purple-600/20">
                <p className="text-lg font-mono text-purple-300 break-all">
                  {contactType === 'email' ? jobDetails.publisherEmail : jobDetails.phone}
                </p>
              </div>
              <button
                onClick={() => setShowContactModal(false)}
                className="w-full bg-purple-600 hover:bg-purple-700 py-3 rounded-lg transition font-medium"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Apply Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="bg-gray-800 p-6 rounded-2xl max-w-md w-full border border-purple-600/30"
          >
            <h3 className="text-xl font-bold mb-6 text-white text-center">
              🚀 Apply for: {jobDetails.title}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-300 mb-2 font-medium">Full Name *</label>
                <input
                  type="text"
                  value={applicationData.name}
                  onChange={(e) => setApplicationData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full p-3 rounded-lg bg-black/40 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter your full name"
                  disabled={submitting}
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-300 mb-2 font-medium">Address *</label>
                <textarea
                  value={applicationData.address}
                  onChange={(e) => setApplicationData(prev => ({ ...prev, address: e.target.value }))}
                  className="w-full p-3 rounded-lg bg-black/40 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  rows={3}
                  placeholder="Enter your full address"
                  disabled={submitting}
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-300 mb-2 font-medium">Job Category</label>
                <input
                  type="text"
                  value={jobDetails.category.join(", ")}
                  readOnly
                  className="w-full p-3 rounded-lg bg-gray-700/50 border border-gray-600 text-gray-300 cursor-not-allowed"
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-300 mb-2 font-medium">Contact Number *</label>
                <input
                  type="tel"
                  value={applicationData.contactNumber}
                  onChange={(e) => setApplicationData(prev => ({ ...prev, contactNumber: e.target.value }))}
                  className="w-full p-3 rounded-lg bg-black/40 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter your phone number"
                  disabled={submitting}
                />
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleCloseApplyModal}
                className="flex-1 bg-gray-600 hover:bg-gray-700 py-3 rounded-lg transition font-medium"
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                onClick={handleApplySubmit}
                disabled={submitting || !applicationData.name.trim() || !applicationData.address.trim() || !applicationData.contactNumber.trim()}
                className="flex-1 bg-purple-600 hover:bg-purple-700 py-3 rounded-lg transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <motion.div
                      className="w-4 h-4 border-2 border-t-white border-b-gray-300 border-l-gray-300 border-r-gray-300 rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    />
                    Submitting...
                  </span>
                ) : (
                  "Submit Application"
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}