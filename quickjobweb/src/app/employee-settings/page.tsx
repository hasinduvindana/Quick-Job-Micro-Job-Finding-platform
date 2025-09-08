"use client";

import { useEffect, useState } from "react";
import { doc, updateDoc, collection, query, where, getDocs, getFirestore } from "firebase/firestore";
import { motion } from "framer-motion";
import { FiSettings } from "react-icons/fi";
import { useRouter } from "next/navigation";
import app from "@/lib/firebaseConfig"; // Import the app instance

// Initialize Firestore
const firestore = getFirestore(app);

// Add District interface
interface District {
  id: string;
  districtName: string;
  cities: string[];
  createdAt: Date;
}

export default function EmployeeSettings() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  type Skill = { skill: string; experience: string };

  type UserData = {
    firstName: string;
    lastName: string;
    email: string;
    skills: Skill[];
    serviceLocation: string;
    contactNumber: string;
    district: string;  // Add district field
    city: string;      // Add city field
  };

  const [userData, setUserData] = useState<UserData>({
    firstName: "",
    lastName: "",
    email: "",
    skills: [{ skill: "", experience: "" }],
    serviceLocation: "",
    contactNumber: "",
    district: "",      // Initialize district
    city: "",          // Initialize city
  });

  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [docId, setDocId] = useState<string | null>(null);

  // Add state for districts and cities
  const [districts, setDistricts] = useState<District[]>([]);
  const [availableCities, setAvailableCities] = useState<string[]>([]);
  const [districtsLoading, setDistrictsLoading] = useState(true);

  // Add state for job categories
  const [jobCategories, setJobCategories] = useState<string[]>([]);

  // ✅ Get email from localStorage (with safety check)
  const [email, setEmail] = useState<string | null>(null);

  // Get email from localStorage after component mounts
  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    setEmail(storedEmail);
  }, []);

  // Fetch districts from map collection
  useEffect(() => {
    const fetchDistricts = async () => {
      try {
        setDistrictsLoading(true);
        const querySnapshot = await getDocs(collection(firestore, "map"));
        const districtsList: District[] = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          districtName: doc.data().districtName || "",
          cities: doc.data().cities || [],
          createdAt: doc.data().createdAt?.toDate() || new Date(),
        }));
        
        // Sort districts alphabetically
        districtsList.sort((a, b) => a.districtName.localeCompare(b.districtName));
        setDistricts(districtsList);
        console.log("Fetched districts:", districtsList);
      } catch (error) {
        console.error("Error fetching districts:", error);
      } finally {
        setDistrictsLoading(false);
      }
    };

    fetchDistricts();
  }, []);

  // Fetch job categories for dropdown
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const snapshot = await getDocs(collection(firestore, "jobcategory"));
        const names = snapshot.docs.map(doc => doc.data().name).filter(Boolean);
        setJobCategories(names);
      } catch (error) {
        console.error("Error fetching job categories:", error);
      }
    };
    fetchCategories();
  }, []);

  // Update available cities when district changes
  useEffect(() => {
    if (userData.district) {
      const selectedDistrict = districts.find(d => d.districtName === userData.district);
      if (selectedDistrict) {
        setAvailableCities(selectedDistrict.cities.sort());
      } else {
        setAvailableCities([]);
      }
    } else {
      setAvailableCities([]);
    }
    // Reset city selection when district changes
    if (userData.city && userData.district) {
      const selectedDistrict = districts.find(d => d.districtName === userData.district);
      if (selectedDistrict && !selectedDistrict.cities.includes(userData.city)) {
        setUserData(prev => ({ ...prev, city: "" }));
      }
    }
  }, [userData.district, userData.city, districts]);

  // Load user data from Firestore
  useEffect(() => {
    if (!email) return;

    const fetchUserData = async () => {
      try {
        const q = query(collection(firestore, "userlog"), where("email", "==", email));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const docSnap = querySnapshot.docs[0];
          const userDataFromDb = docSnap.data();
          setDocId(docSnap.id); // ✅ save doc ID
          setUserData((prev) => ({
            ...prev,
            firstName: userDataFromDb.firstName || "",
            lastName: userDataFromDb.lastName || "",
            email: userDataFromDb.email || email,
            skills: userDataFromDb.skills || [{ skill: "", experience: "" }],
            serviceLocation: userDataFromDb.serviceLocation || "",
            contactNumber: userDataFromDb.contactNumber || "",
            district: userDataFromDb.district || "",      // Load district
            city: userDataFromDb.city || "",              // Load city
          }));
        } else {
          console.warn("No user found with this email:", email);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [email]);

  // Calculate average rating (floating point)
  const [averageRating, setAverageRating] = useState<number | null>(null);

  useEffect(() => {
    // When userData loads, get rating and ratedCount from Firestore
    if (docId) {
      const fetchRating = async () => {
        try {
          const q = query(collection(firestore, "userlog"), where("email", "==", email));
          const querySnapshot = await getDocs(q);
          if (!querySnapshot.empty) {
            const data = querySnapshot.docs[0].data();
            const rating = data.rating || 0;
            const ratedCount = data.ratedCount || 0;
            setAverageRating(ratedCount > 0 ? rating / ratedCount : null);
          }
        } catch {
          setAverageRating(null);
        }
      };
      fetchRating();
    }
  }, [docId, email]);

  // Handle district change
  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedDistrict = e.target.value;
    setUserData({ 
      ...userData, 
      district: selectedDistrict,
      city: "" // Reset city when district changes
    });
  };

  // Handle city change
  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setUserData({ ...userData, city: e.target.value });
  };

  // Handle adding new skill row
  const addSkill = () => {
    setUserData({ ...userData, skills: [...userData.skills, { skill: "", experience: "" }] });
  };

  // Handle removing a skill row
  const removeSkill = (index: number) => {
    if (userData.skills.length > 1) {
      const newSkills = userData.skills.filter((_, idx) => idx !== index);
      setUserData({ ...userData, skills: newSkills });
    }
  };

  const handleSkillChange = (index: number, field: "skill" | "experience", value: string) => {
    const newSkills = [...userData.skills];
    newSkills[index][field] = value;
    setUserData({ ...userData, skills: newSkills });
  };

  // Removed unused handleProfileImageChange function

  // Add state for location loading
  const [locationLoading, setLocationLoading] = useState(false);

  // Auto-get current location with high accuracy and waiting time
  const handleGetLocation = () => {
    setLocationLoading(true);
    // Wait 2 seconds before capturing location for better accuracy
    setTimeout(() => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setUserData({
              ...userData,
              serviceLocation: `${position.coords.latitude},${position.coords.longitude}`,
            });
            setLocationLoading(false);
          },
          (error) => {
            console.error("Geolocation error:", error);
            alert("Unable to get your location. Please enter manually.");
            setLocationLoading(false);
          },
          {
            enableHighAccuracy: true,
            timeout: 10000, // 10 seconds max wait
            maximumAge: 0,
          }
        );
      } else {
        alert("Geolocation is not supported by your browser.");
        setLocationLoading(false);
      }
    }, 2000); // Wait 2 seconds before requesting location
  };

  const handleClear = () => {
    setUserData({
      ...userData,
      skills: [{ skill: "", experience: "" }],
      serviceLocation: "",
      contactNumber: "",
      district: "",
      city: "",
    });
    setProfileImage(null);
  };

  // ✅ Save updates back to same userlog document
  const handleSave = async () => {
    // Enhanced validations
    if (!userData.firstName || !userData.lastName || !userData.contactNumber) {
      alert("First name, Last name and Contact Number are required.");
      return;
    }

    // Validate contact number format
    const phoneRegex = /^[0-9+\-\s()]+$/;
    if (!phoneRegex.test(userData.contactNumber)) {
      alert("Please enter a valid contact number.");
      return;
    }

    // Validate skills
    const hasEmptySkills = userData.skills.some(skill => !skill.skill.trim() || !skill.experience.trim());
    if (hasEmptySkills) {
      alert("Please fill in all skill fields or remove empty rows.");
      return;
    }

    // Validate district and city
    if (!userData.district) {
      alert("Please select a district.");
      return;
    }

    if (!userData.city) {
      alert("Please select a city.");
      return;
    }

    if (!docId) {
      alert("User document not found!");
      return;
    }

    setLoading(true);

    try {
      const userDocRef = doc(firestore, "userlog", docId);
      await updateDoc(userDocRef, {
        ...userData,
        profileImageName: profileImage?.name || "",
        lastModified: new Date(),
      });

      setTimeout(() => {
        setLoading(false);
        setSaved(true);
        setTimeout(() => router.push("/employeedashboard"), 3000);
      }, 2000);
    } catch (err) {
      console.error("Save error:", err);
      alert("Failed to save data. Please try again.");
      setLoading(false);
    }
  };

  // Show loading state while email is being retrieved
  if (!email) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-purple-900 to-black text-white flex items-center justify-center">
        <motion.div
          className="w-12 h-12 border-4 border-t-purple-500 border-b-purple-200 border-l-purple-200 border-r-purple-200 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-900 to-black text-white p-6">
      <div className="max-w-3xl mx-auto bg-black/50 backdrop-blur-md rounded-2xl p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <FiSettings className="text-2xl text-purple-400" />
            <h2 className="text-xl font-bold">Employee Account Settings</h2>
          </div>
          <button
            onClick={() => router.push("/employeedashboard")}
            className="text-purple-400 hover:text-purple-300 text-sm"
          >
            ← Back to Dashboard
          </button>
        </div>

        {/* ⭐ Rating Display - Animated */}
        <div className="flex flex-col items-center mb-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, type: "spring" }}
            className="mb-2"
          >
            <span className="text-purple-300 text-lg font-semibold tracking-wide">Your Rating</span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, type: "spring" }}
            className="relative flex items-center justify-center"
            style={{ width: 90, height: 90 }}
          >
            {/* Circle with rating value */}
            <div className="rounded-full border-4 border-purple-500 bg-black/70 flex items-center justify-center" style={{ width: 90, height: 90 }}>
              <span className="text-white text-2xl font-bold">
                {averageRating !== null ? averageRating.toFixed(2) : "0.00"}
              </span>
            </div>
            {/* Stars around the circle */}
            {Array.from({ length: 5 }).map((_, i) => {
              // Calculate angle for each star
              const angle = (i * 72 - 90) * (Math.PI / 180); // 72deg apart, start at top
              const radius = 45; // half of circle size
              const x = Math.cos(angle) * radius + 45 - 10; // center + offset - half star size
              const y = Math.sin(angle) * radius + 45 - 10;
              return (
                <span
                  key={i}
                  className={i + 1 <= Math.round(averageRating ?? 0) ? "text-yellow-400" : "text-gray-600"}
                  style={{
                    position: "absolute",
                    left: x,
                    top: y,
                    fontSize: 20,
                    pointerEvents: "none",
                    userSelect: "none",
                  }}
                >
                  ★
                </span>
              );
            })}
          </motion.div>
        </div>

        {/* Personal Info */}
        <div className="space-y-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="First Name"
              value={userData.firstName}
              onChange={(e) => setUserData({ ...userData, firstName: e.target.value })}
              className="w-full px-4 py-2 rounded-lg bg-black/30 border border-purple-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <input
              type="text"
              placeholder="Last Name"
              value={userData.lastName}
              onChange={(e) => setUserData({ ...userData, lastName: e.target.value })}
              className="w-full px-4 py-2 rounded-lg bg-black/30 border border-purple-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <input
            type="email"
            placeholder="Email"
            value={userData.email}
            disabled
            className="w-full px-4 py-2 rounded-lg bg-black/20 border border-purple-600/50 text-gray-400 cursor-not-allowed"
          />
        </div>

        {/* District and City Selection */}
        <div className="mb-6">
          <h3 className="font-semibold text-purple-300 mb-2">Location</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* District Dropdown */}
            <select
              value={userData.district}
              onChange={handleDistrictChange}
              disabled={districtsLoading}
              className="w-full px-4 py-2 rounded-lg bg-black/30 border border-purple-600 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
            >
              <option value="">
                {districtsLoading ? "Loading districts..." : "Select District"}
              </option>
              {districts.map((district) => (
                <option key={district.id} value={district.districtName}>
                  {district.districtName}
                </option>
              ))}
            </select>

            {/* City Dropdown */}
            <select
              value={userData.city}
              onChange={handleCityChange}
              disabled={!userData.district || availableCities.length === 0}
              className="w-full px-4 py-2 rounded-lg bg-black/30 border border-purple-600 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
            >
              <option value="">
                {!userData.district 
                  ? "Select district first" 
                  : availableCities.length === 0 
                    ? "No cities available" 
                    : "Select City"
                }
              </option>
              {availableCities.map((city, index) => (
                <option key={`${userData.district}-${city}-${index}`} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>
          {districtsLoading && (
            <p className="text-xs text-gray-400 mt-1">Loading location data...</p>
          )}
        </div>

        {/* Skills Table */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-purple-300">Skills & Experience</h3>
            <span className="text-sm text-gray-400">({userData.skills.length} skill{userData.skills.length !== 1 ? 's' : ''})</span>
          </div>
          {userData.skills.map((s, idx) => (
            <div key={idx} className="flex gap-2 mb-2">
              {/* Skill Dropdown */}
              <select
                value={s.skill}
                onChange={(e) => handleSkillChange(idx, "skill", e.target.value)}
                className="flex-1 px-3 py-2 rounded-lg bg-black/30 border border-purple-600 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Select Skill</option>
                {jobCategories.map((cat, i) => (
                  <option key={i} value={cat}>{cat}</option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Experience (e.g., 2 years)"
                value={s.experience}
                onChange={(e) => handleSkillChange(idx, "experience", e.target.value)}
                className="flex-1 px-3 py-2 rounded-lg bg-black/30 border border-purple-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              {userData.skills.length > 1 && (
                <button
                  onClick={() => removeSkill(idx)}
                  className="bg-red-600 hover:bg-red-700 px-3 py-2 rounded-lg transition"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
          <button
            onClick={addSkill}
            className="bg-purple-600 hover:bg-purple-700 px-3 py-1 rounded-lg mt-2 transition"
          >
            + Add Skill
          </button>
        </div>

        {/* Service Location & Contact */}
        <div className="mb-6 space-y-4">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Service Location (or use GPS)"
              value={userData.serviceLocation}
              onChange={(e) => setUserData({ ...userData, serviceLocation: e.target.value })}
              className="flex-1 px-3 py-2 rounded-lg bg-black/30 border border-purple-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              disabled={locationLoading}
            />
            <button
              onClick={handleGetLocation}
              className="bg-purple-600 hover:bg-purple-700 px-3 py-2 rounded-lg transition whitespace-nowrap"
              disabled={locationLoading}
            >
              {locationLoading ? "Getting Location..." : "📍 Get Location"}
            </button>
          </div>

          <input
            type="tel"
            placeholder="Contact Number (e.g., +94 77 123 4567)"
            value={userData.contactNumber}
            onChange={(e) => setUserData({ ...userData, contactNumber: e.target.value })}
            className="w-full px-3 py-2 rounded-lg bg-black/30 border border-purple-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-4">
          <button
            onClick={handleClear}
            className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg transition"
          >
            Clear Form
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg transition disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Info"}
          </button>
        </div>
      </div>

      {/* Loading / Saving Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="bg-purple-800/80 p-8 rounded-2xl text-center flex flex-col items-center gap-4"
          >
            <p className="text-white text-lg font-semibold">Data Saving...</p>
            <motion.div
              className="w-12 h-12 border-4 border-t-purple-500 border-b-purple-200 border-l-purple-200 border-r-purple-200 rounded-full"
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            />
          </motion.div>
        </div>
      )}

      {saved && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="bg-green-700 p-8 rounded-2xl text-center text-white flex flex-col items-center gap-4"
          >
            <svg className="h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
            <p className="text-lg font-semibold">Profile Saved Successfully!</p>
            <motion.div
              className="w-full h-2 bg-green-500 rounded mt-2"
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 3 }}
            />
          </motion.div>
        </div>
      )}
    </div>
  );
}
