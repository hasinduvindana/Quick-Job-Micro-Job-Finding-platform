"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebaseConfig";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import { collection, getDocs, getFirestore, query, where, Timestamp, doc, updateDoc, increment } from "firebase/firestore";

// Initialize Firestore
const firestore = getFirestore();

// Define interfaces
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

interface Category {
  id: string;
  name: string;
  createdAt: Date;
}

interface District {
  id: string;
  districtName: string;
  cities: string[];
  createdAt: Date;
}

export default function EmployeeDashboard() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [skill, setSkill] = useState("");
  const [district, setDistrict] = useState("");
  const [town, setTown] = useState("");
  const [userFirstName, setUserFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [loggingOut, setLoggingOut] = useState(false);
  const [loading, setLoading] = useState(true);

  // State for dynamic data
  const [jobPosts, setJobPosts] = useState<JobPost[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [availableCities, setAvailableCities] = useState<string[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [districtsLoading, setDistrictsLoading] = useState(true);

  // Load user data from localStorage on mount
  useEffect(() => {
    const firstName = localStorage.getItem("userFirstName");
    if (firstName) setUserFirstName(firstName);
  }, []);

  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    if (storedEmail) setEmail(storedEmail);
  }, []);

  // Fetch categories from jobcategory collection
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategoriesLoading(true);
        const querySnapshot = await getDocs(collection(firestore, "jobcategory"));
        const categoriesList: Category[] = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().name || "",
          createdAt: doc.data().createdAt?.toDate() || new Date(),
        }));
        
        // Sort categories alphabetically
        categoriesList.sort((a, b) => a.name.localeCompare(b.name));
        setCategories(categoriesList);
        console.log("Fetched categories:", categoriesList);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchCategories();
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

  // Update available cities when district changes
  useEffect(() => {
    if (district) {
      const selectedDistrict = districts.find(d => d.districtName === district);
      if (selectedDistrict) {
        setAvailableCities(selectedDistrict.cities.sort());
      } else {
        setAvailableCities([]);
      }
    } else {
      setAvailableCities([]);
    }
    // Reset town selection when district changes
    setTown("");
  }, [district, districts]);

  // Fetch job posts from Firestore
  useEffect(() => {
    const fetchJobPosts = async () => {
      try {
        setLoading(true);
        
        const q = query(
          collection(firestore, "jobposts"),
          where("status", "==", "active")
        );
        
        const querySnapshot = await getDocs(q);
        let posts: JobPost[] = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as JobPost));
        
        // Sort in JavaScript instead of Firestore
        posts = posts.sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis());
        
        setJobPosts(posts);
        console.log("Fetched job posts:", posts);
      } catch (error) {
        console.error("Error fetching job posts:", error);
        
        // Fallback: Get all documents and filter client-side
        try {
          const allDocsQuery = query(collection(firestore, "jobposts"));
          const allSnapshot = await getDocs(allDocsQuery);
          let allPosts: JobPost[] = allSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          } as JobPost));
          
          // Filter and sort client-side
          allPosts = allPosts
            .filter(post => post.status === "active")
            .sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis());
          
          setJobPosts(allPosts);
          console.log("Fetched job posts (fallback):", allPosts);
        } catch (fallbackError) {
          console.error("Fallback query also failed:", fallbackError);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchJobPosts();
  }, []);

  // Filter job posts based on search criteria
  const filteredJobPosts = jobPosts.filter((post) => {
    const matchesSearch = search ? 
      post.title.toLowerCase().includes(search.toLowerCase()) ||
      post.description.toLowerCase().includes(search.toLowerCase()) ||
      post.supplier.toLowerCase().includes(search.toLowerCase())
      : true;
    
    const matchesSkill = skill ? 
      post.category.some(cat => cat.toLowerCase().includes(skill.toLowerCase()))
      : true;
    
    const matchesLocation = (town || district) ? 
      post.location.toLowerCase().includes((town || district).toLowerCase())
      : true;

    return matchesSearch && matchesSkill && matchesLocation;
  });

  const handleLogout = async () => {
    setLoggingOut(true);
    setTimeout(async () => {
      try {
        await signOut(auth);
        localStorage.removeItem("userFirstName");
        localStorage.removeItem("userAccountType");
        router.push("/signin");
      } catch (error) {
        console.error("Logout failed:", error);
        alert("Failed to logout. Please try again.");
        setLoggingOut(false);
      }
    }, 3000);
  };

  const handleJobPostClick = async (postId: string) => {
    try {
      // Increment views in Firestore
      const postRef = doc(firestore, "jobposts", postId);
      await updateDoc(postRef, {
        views: increment(1),
      });
    } catch (error) {
      console.error("Failed to increment views:", error);
    }
    router.push(`/job-details/${postId}`);
  };

  const handleClearFilters = () => {
    setSearch("");
    setSkill("");
    setDistrict("");
    setTown("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-900 to-black text-white relative">
      {/* Use Navbar Component */}
      <Navbar
        firstName={userFirstName}
        onLogout={handleLogout}
        dashboardType="employee"
      />

      {/* Filter Section */}
      <div className="bg-black/50 backdrop-blur-md shadow-md p-4 flex flex-wrap items-center gap-4 z-10 relative">
        <input
          type="text"
          placeholder="Search jobs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-purple-700/50 rounded px-3 py-2 flex-1 min-w-[200px] bg-black/30 placeholder-gray-300 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        
        {/* Dynamic Categories Dropdown */}
        <select
          value={skill}
          onChange={(e) => setSkill(e.target.value)}
          disabled={categoriesLoading}
          className="border border-purple-700/50 rounded px-3 py-2 bg-black/30 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
        >
          <option value="">
            {categoriesLoading ? "Loading categories..." : "All Categories"}
          </option>
          {categories.map((category) => (
            <option key={category.id} value={category.name}>
              {category.name}
            </option>
          ))}
        </select>
        
        {/* Dynamic Districts Dropdown */}
        <select
          value={district}
          onChange={(e) => setDistrict(e.target.value)}
          disabled={districtsLoading}
          className="border border-purple-700/50 rounded px-3 py-2 bg-black/30 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
        >
          <option value="">
            {districtsLoading ? "Loading districts..." : "All Districts"}
          </option>
          {districts.map((dist) => (
            <option key={dist.id} value={dist.districtName}>
              {dist.districtName}
            </option>
          ))}
        </select>
        
        {/* Dynamic Cities Dropdown */}
        <select
          value={town}
          onChange={(e) => setTown(e.target.value)}
          disabled={!district || availableCities.length === 0}
          className="border border-purple-700/50 rounded px-3 py-2 bg-black/30 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
        >
          <option value="">
            {!district 
              ? "Select district first" 
              : availableCities.length === 0 
                ? "No cities available" 
                : "All Cities"
            }
          </option>
          {availableCities.map((city, index) => (
            <option key={`${district}-${city}-${index}`} value={city}>
              {city}
            </option>
          ))}
        </select>
        
        <button
          onClick={handleClearFilters}
          className="bg-purple-600/70 hover:bg-purple-700/80 text-white px-4 py-2 rounded-lg transition"
        >
          Clear Filters
        </button>
      </div>

      {/* Job Posts List */}
      <div className="p-6">
        {loading ? (
          <div className="text-center py-12">
            <motion.div
              className="w-12 h-12 border-4 border-t-purple-500 border-b-purple-200 border-l-purple-200 border-r-purple-200 rounded-full mx-auto"
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            />
            <p className="text-gray-300 mt-4">Loading job posts...</p>
          </div>
        ) : filteredJobPosts.length === 0 ? (
          <div className="text-center py-12 text-gray-300">
            <p className="text-lg">No job posts found matching your criteria.</p>
            <p className="text-sm mt-2">Try adjusting your search filters.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobPosts.map((post) => {
              // Determine image to show
              let imageSrc = "";
              if (post.images && post.images.length > 0) {
                imageSrc = post.images[0];
              } else if (post.category && post.category.length > 0) {
                // Use first category to match image in public folder
                imageSrc = `/${post.category[0]}.jpg`;
              }

              return (
                <div
                  key={post.id}
                  className="bg-black/40 backdrop-blur-md shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
                  onClick={() => handleJobPostClick(post.id)} // <-- updated to async handler
                >
                  {/* Display image or placeholder */}
                  {imageSrc ? (
                    <Image
                      src={imageSrc}
                      width={400}
                      height={200}
                      alt={post.title}
                      className="w-full h-40 object-cover"
                    />
                  ) : (
                    <div className="w-full h-40 bg-gray-700 flex items-center justify-center">
                      <span className="text-gray-400">No Image</span>
                    </div>
                  )}
                  
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-white">{post.title}</h3>
                    <p className="text-sm text-purple-300 mb-2">📍 {post.location}</p>
                    <p className="text-sm text-blue-300 mb-2">🏢 {post.supplier}</p>
                    
                    {/* Display categories */}
                    <div className="flex flex-wrap gap-1 mb-2">
                      {post.category.map((cat, index) => (
                        <span 
                          key={index}
                          className="inline-block bg-purple-700/30 text-purple-200 text-xs px-2 py-1 rounded-full font-medium"
                        >
                          {cat}
                        </span>
                      ))}
                    </div>
                    
                    <p className="mt-2 text-gray-200 text-sm line-clamp-2">
                      {post.description}
                    </p>
                    
                    {/* Stats */}
                    <div className="flex justify-between items-center mt-3 text-xs text-gray-400">
                      <span>👁️ {post.views} views</span>
                      <span>📅 {post.createdAt.toDate().toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Logout Animation Overlay */}
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
