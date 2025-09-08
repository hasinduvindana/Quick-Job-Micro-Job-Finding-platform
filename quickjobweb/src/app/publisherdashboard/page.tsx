"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FiPlus, FiEdit, FiTrash2, FiEye, FiDownload } from "react-icons/fi";
import { FaBars } from "react-icons/fa";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebaseConfig";
import Navbar from "@/components/Navbar";
import { JobPost, Applicant, getJobPostsByPublisher, deleteJobPost, getApplicantsByJob } from "@/lib/firestore";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'; // Different import

// Extend jsPDF type to include autoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: typeof autoTable;
  }
}

export default function PublisherDashboard() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userFirstName, setUserFirstName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [loggingOut, setLoggingOut] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedAd, setSelectedAd] = useState<JobPost | null>(null);
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [loadingApplicants, setLoadingApplicants] = useState(false);

  // Job posts state
  const [myAds, setMyAds] = useState<JobPost[]>([]);

  // Filter states
  const [search, setSearch] = useState("");
  const [skill, setSkill] = useState("");
  const [district, setDistrict] = useState("");
  const [town, setTown] = useState("");

  // Load user data
  useEffect(() => {
    const firstName = localStorage.getItem("userFirstName");
    const email = localStorage.getItem("email");
    if (firstName) setUserFirstName(firstName);
    if (email) setUserEmail(email);
  }, []);

  // Fetch job posts when user email is available
  useEffect(() => {
    if (userEmail) {
      fetchJobPosts();
    }
  }, [userEmail]);

  // Fetch applicants when ad is selected
  useEffect(() => {
    if (selectedAd) {
      fetchApplicants();
    }
  }, [selectedAd]);

  const fetchJobPosts = async () => {
    try {
      setLoading(true);
      const posts = await getJobPostsByPublisher(userEmail);
      setMyAds(posts);
      console.log("Fetched job posts:", posts);
    } catch (error) {
      console.error("Error fetching job posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchApplicants = async () => {
    if (!selectedAd) return;
    
    try {
      setLoadingApplicants(true);
      const applicantsList = await getApplicantsByJob(selectedAd.title, selectedAd.publisherEmail);
      setApplicants(applicantsList);
      console.log("Fetched applicants:", applicantsList);
    } catch (error) {
      console.error("Error fetching applicants:", error);
    } finally {
      setLoadingApplicants(false);
    }
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    setTimeout(async () => {
      try {
        await signOut(auth);
        localStorage.removeItem("userFirstName");
        localStorage.removeItem("userAccountType");
        localStorage.removeItem("email");
        router.push("/signin");
      } catch (error) {
        console.error("Logout failed:", error);
        alert("Failed to logout. Please try again.");
        setLoggingOut(false);
      }
    }, 3000);
  };

  const filteredAds = myAds.filter((ad) => {
    const matchesSearch = search ? 
      ad.title.toLowerCase().includes(search.toLowerCase()) ||
      ad.description.toLowerCase().includes(search.toLowerCase()) ||
      ad.supplier.toLowerCase().includes(search.toLowerCase())
      : true;
    
    const matchesSkill = skill ? 
      ad.category.some(cat => cat.toLowerCase().includes(skill.toLowerCase()))
      : true;
    
    const matchesLocation = (town || district) ? 
      ad.location.toLowerCase().includes((town || district).toLowerCase())
      : true;

    return matchesSearch && matchesSkill && matchesLocation;
  });

  const handleDelete = async (adId: string) => {
    if (window.confirm("Are you sure you want to delete this job post?")) {
      const success = await deleteJobPost(adId);
      if (success) {
        setMyAds((prev) => prev.filter((ad) => ad.id !== adId));
        if (selectedAd?.id === adId) {
          setSelectedAd(null);
          setApplicants([]);
        }
        alert("Job post deleted successfully!");
      } else {
        alert("Failed to delete job post. Please try again.");
      }
    }
  };

  const handleAdSelect = (ad: JobPost) => {
    setSelectedAd(ad);
    setApplicants([]); // Clear previous applicants
  };

  const downloadApplicantsList = () => {
    if (applicants.length === 0) {
      alert("No applicants to download");
      return;
    }

    // Create CSV content
    const headers = ["Name", "Address", "Contact Number", "Job Category", "Applied Date"];
    const csvContent = [
      headers.join(","),
      ...applicants.map(applicant => [
        `"${applicant.name}"`,
        `"${applicant.address}"`,
        `"${applicant.contactNumber}"`,
        `"${applicant.jobCategory}"`,
        `"${applicant.appliedAt.toDate().toLocaleDateString()}"`
      ].join(","))
    ].join("\n");

    // Create and download file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `${selectedAd?.title}_applicants.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadApplicantsAsPDF = async () => {
    if (applicants.length === 0) {
      alert("No applicants to download");
      return;
    }

    try {
      const pdf = new jsPDF();
      const pageWidth = pdf.internal.pageSize.width;
      const pageHeight = pdf.internal.pageSize.height;
      
      // Load and add logo (you'll need to add logo.png to your public folder)
      try {
        const logoImg = new Image();
        logoImg.src = '/logo.png'; // Make sure logo.png is in your public folder
        
        logoImg.onload = () => {
          // Add logo
          pdf.addImage(logoImg, 'PNG', 20, 20, 30, 30);
          
          // Continue with the rest of the PDF generation
          generatePDFContent(pdf, pageWidth, pageHeight);
        };
        
        logoImg.onerror = () => {
          // If logo fails to load, continue without it
          console.warn("Logo not found, generating PDF without logo");
          generatePDFContent(pdf, pageWidth, pageHeight);
        };
      } catch (error) {
        console.warn("Error loading logo, generating PDF without logo");
        generatePDFContent(pdf, pageWidth, pageHeight);
      }
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    }
  };

  const generatePDFContent = (pdf: jsPDF, pageWidth: number, pageHeight: number) => {
    // Header section
    let yPosition = 25;
    
    // Company name and tagline (next to logo or starting from left if no logo)
    pdf.setFontSize(20);
    pdf.setFont("helvetica", "bold");
    pdf.text("QuickJob Microjob Platform", 60, yPosition);
    
    yPosition += 8;
    pdf.setFontSize(12);
    pdf.setFont("helvetica", "normal");
    pdf.text("Find your jobs quickly & safely", 60, yPosition);
    
    yPosition += 15;
    
    // Downloaded timestamp
    pdf.setFontSize(10);
    pdf.text(`Downloaded: ${new Date().toLocaleString()}`, 20, yPosition);
    
    yPosition += 10;
    
    // Job post title
    pdf.setFontSize(14);
    pdf.setFont("helvetica", "bold");
    pdf.text(`Job Post: ${selectedAd?.title || 'N/A'}`, 20, yPosition);
    
    yPosition += 15;
    
    // Applicants table
    const tableData = applicants.map(applicant => [
      applicant.name,
      applicant.address,
      applicant.contactNumber,
      applicant.jobCategory,
      applicant.appliedAt.toDate().toLocaleDateString()
    ]);

    autoTable(pdf, { // Use the imported function directly
      head: [['Name', 'Address', 'Contact Number', 'Job Category', 'Applied Date']],
      body: tableData,
      startY: yPosition,
      theme: 'grid',
      styles: {
        fontSize: 9,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [128, 90, 213],
        textColor: 255,
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      },
      margin: { left: 20, right: 20 },
      didDrawPage: (data) => {
        const totalPages = pdf.getNumberOfPages ? pdf.getNumberOfPages() : 1;
        const currentPage = pdf.getCurrentPageInfo ? pdf.getCurrentPageInfo().pageNumber : 1;
        
        pdf.setFontSize(8);
        pdf.text(
          `${currentPage} of ${totalPages}`,
          pageWidth / 2,
          pageHeight - 10,
          { align: 'center' }
        );
      }
    });

    // Save the PDF
    const fileName = `${selectedAd?.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_applicants.pdf`;
    pdf.save(fileName);
  };

  const handleClearFilters = () => {
    setSearch("");
    setSkill("");
    setDistrict("");
    setTown("");
  };

  if (!userEmail) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-purple-900 to-black text-white flex items-center justify-center">
        <motion.div
          className="w-12 h-12 border-4 border-t-purple-500 border-b-purple-200 border-l-purple-200 border-r-purple-200 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        />
        <p className="ml-4">Loading user data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-900 to-black text-white relative flex flex-col">
      {/* Navbar */}
      <Navbar
        firstName={userFirstName}
        onLogout={handleLogout}
        dashboardType="publisher"
      />

      <div className="flex flex-1">
        {/* Sidebar */}
        <motion.div
          initial={{ x: -250 }}
          animate={{ x: sidebarOpen ? 0 : -250 }}
          transition={{ duration: 0.3 }}
          className="w-64 bg-black/60 backdrop-blur-md shadow-lg p-4 flex flex-col"
        >
          <button
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 mb-4"
            onClick={() => router.push("/post-ad")}
          >
            <FiPlus /> Post New Ad
          </button>

          <h3 className="text-lg font-bold mb-3">My Ads ({filteredAds.length})</h3>
          {loading ? (
            <div className="text-center py-4">
              <motion.div
                className="w-6 h-6 border-2 border-t-purple-500 border-b-purple-200 border-l-purple-200 border-r-purple-200 rounded-full mx-auto"
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              />
              <p className="text-sm mt-2">Loading...</p>
            </div>
          ) : (
            <ul className="space-y-2 overflow-y-auto flex-1">
              {filteredAds.map((ad) => (
                <li
                  key={ad.id}
                  onClick={() => handleAdSelect(ad)}
                  className={`p-2 rounded-md cursor-pointer ${
                    selectedAd?.id === ad.id
                      ? "bg-purple-700/50"
                      : "hover:bg-purple-600/30"
                  }`}
                >
                  <div className="text-sm font-medium">{ad.title}</div>
                  <div className="text-xs text-gray-300">
                    {ad.createdAt.toDate().toLocaleDateString()}
                  </div>
                  <div className="text-xs text-purple-300">
                    👁️ {ad.views} views
                  </div>
                </li>
              ))}
              {filteredAds.length === 0 && !loading && (
                <li className="text-gray-400 text-center py-4">
                  No ads found
                </li>
              )}
            </ul>
          )}
        </motion.div>

        {/* Toggle Button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="absolute top-20 left-4 bg-purple-700 text-white p-2 rounded-md md:hidden z-20"
        >
          <FaBars />
        </button>

        {/* Main Content */}
        <div className="flex-1 p-6">
          {!selectedAd ? (
            <div className="text-gray-300 text-center mt-20">
              <p className="text-lg">Select an ad to view details</p>
              <p className="text-sm mt-2">Choose from the sidebar to see applicants and manage your posts</p>
            </div>
          ) : (
            <div className="bg-black/50 backdrop-blur-md rounded-xl shadow-lg p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2">{selectedAd.title}</h2>
                  <p className="text-purple-300 mb-2">
                    Categories: {selectedAd.category.join(", ")}
                  </p>
                  <p className="text-gray-300 text-sm mb-2">
                    📅 Posted: {selectedAd.createdAt.toDate().toLocaleDateString()}
                  </p>
                  <p className="flex items-center gap-2 text-sm text-gray-300">
                    <FiEye /> Total Views: {selectedAd.views}
                  </p>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => router.push(`/edit-ad/${selectedAd.id}`)}
                    className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg transition"
                  >
                    <FiEdit /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(selectedAd.id)}
                    className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition"
                  >
                    <FiTrash2 /> Delete
                  </button>
                </div>
              </div>

              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <p className="text-gray-200 bg-black/30 p-4 rounded-lg">
                  {selectedAd.description}
                </p>
              </div>

              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Applicants ({applicants.length})</h3>
                {applicants.length > 0 && (
                  <div className="flex gap-2">
                    <button
                      onClick={downloadApplicantsList}
                      className="flex items-center gap-2 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg transition"
                    >
                      <FiDownload /> CSV
                    </button>
                    <button
                      onClick={downloadApplicantsAsPDF}
                      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition"
                    >
                      <FiDownload /> PDF
                    </button>
                  </div>
                )}
              </div>

              {loadingApplicants ? (
                <div className="text-center py-8">
                  <motion.div
                    className="w-8 h-8 border-4 border-t-purple-500 border-b-purple-200 border-l-purple-200 border-r-purple-200 rounded-full mx-auto"
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  />
                  <p className="text-gray-300 mt-2">Loading applicants...</p>
                </div>
              ) : applicants.length === 0 ? (
                <p className="text-gray-400 text-center py-8">No one applied yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full bg-black/30 rounded-lg overflow-hidden">
                    <thead className="bg-purple-700/50">
                      <tr>
                        <th className="px-4 py-3 text-left">Name</th>
                        <th className="px-4 py-3 text-left">Address</th>
                        <th className="px-4 py-3 text-left">Contact</th>
                        <th className="px-4 py-3 text-left">Category</th>
                        <th className="px-4 py-3 text-left">Applied Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {applicants.map((applicant, idx) => (
                        <tr
                          key={applicant.id}
                          className={idx % 2 === 0 ? "bg-black/20" : "bg-black/10"}
                        >
                          <td className="px-4 py-3 font-medium">{applicant.name}</td>
                          <td className="px-4 py-3 text-sm">{applicant.address}</td>
                          <td className="px-4 py-3 text-sm">{applicant.contactNumber}</td>
                          <td className="px-4 py-3 text-sm">{applicant.jobCategory}</td>
                          <td className="px-4 py-3 text-sm">
                            {applicant.appliedAt.toDate().toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Logout Animation */}
      {loggingOut && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-purple-800/80 p-8 rounded-2xl text-center flex flex-col items-center gap-4"
          >
            <p className="text-white text-lg font-semibold">Logging Out...</p>
            <motion.div
              className="w-12 h-12 border-4 border-t-purple-500 border-b-purple-200 border-l-purple-200 border-r-purple-200 rounded-full"
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            />
          </motion.div>
        </div>
      )}
    </div>
  );
}
