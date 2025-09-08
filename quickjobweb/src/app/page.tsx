"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TypeAnimation } from "react-type-animation";
import { Menu, X, Smartphone, Search } from "lucide-react";
import Link from "next/link";
import { collection, getFirestore, getDocs, query, where } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { useRouter } from "next/navigation";

const images: string[] = ["/slider1.jpg", "/slider2.jpg", "/slider3.jpg"];

// Firebase configuration
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

export default function Home() {
  const [current, setCurrent] = useState<number>(0);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [showQuickFindModal, setShowQuickFindModal] = useState<boolean>(false);
  const [showMobileAppModal, setShowMobileAppModal] = useState<boolean>(false); // NEW STATE
  const router = useRouter();
  
  // State for dynamic counts
  const [employeeCount, setEmployeeCount] = useState<number>(500);
  const [jobPostsCount, setJobPostsCount] = useState<number>(1200);
  const [usersCount, setUsersCount] = useState<number>(10000);
  const [reviewsCount, setReviewsCount] = useState<number>(4500);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Fetch counts from Firestore
  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const employeeQuery = query(
          collection(firestore, "userlog"),
          where("accountType", "==", "Employee")
        );
        const employeeSnapshot = await getDocs(employeeQuery);
        setEmployeeCount(employeeSnapshot.size);

        const usersSnapshot = await getDocs(collection(firestore, "userlog"));
        setUsersCount(usersSnapshot.size);

        const jobPostsSnapshot = await getDocs(collection(firestore, "jobposts"));
        setJobPostsCount(jobPostsSnapshot.size);

        console.log("Counts fetched:", {
          employees: employeeSnapshot.size,
          users: usersSnapshot.size,
          jobPosts: jobPostsSnapshot.size
        });
      } catch (error) {
        console.error("Error fetching counts:", error);
      }
    };

    fetchCounts();
  }, []);

  // Handle Quick Find button click
  const handleQuickFindClick = () => {
    setShowQuickFindModal(true);
    setTimeout(() => {
      setShowQuickFindModal(false);
      router.push('/quickfind');
    }, 3000);
  };

  // Handle Mobile App button click
  const handleMobileAppClick = () => {
    setShowMobileAppModal(true);
    setTimeout(() => {
      setShowMobileAppModal(false);
      router.push('/mobileapp');
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-black via-purple-900 to-black text-white flex flex-col">
      {/* Mobile App Loading Modal */}
      {showMobileAppModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-black/70 backdrop-blur-xl p-8 rounded-2xl border border-white/20 text-center"
          >
            <motion.img
              src="/logo.png"
              alt="QuickJob Logo"
              className="h-20 mx-auto mb-6"
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            />
            <motion.h3
              className="text-2xl font-bold text-white mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Loading Mobile App...
            </motion.h3>
            <motion.div
              className="flex justify-center space-x-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-3 h-3 bg-blue-400 rounded-full"
                  animate={{ y: [0, -10, 0] }}
                  transition={{
                    duration: 0.6,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                />
              ))}
            </motion.div>
          </motion.div>
        </div>
      )}

      {/* Quick Find Loading Modal */}
      {showQuickFindModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-black/70 backdrop-blur-xl p-8 rounded-2xl border border-white/20 text-center"
          >
            <motion.img
              src="/logo.png"
              alt="QuickJob Logo"
              className="h-20 mx-auto mb-6"
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            />
            <motion.h3
              className="text-2xl font-bold text-white mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Loading Quick Find...
            </motion.h3>
            <motion.div
              className="flex justify-center space-x-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-3 h-3 bg-green-400 rounded-full"
                  animate={{ y: [0, -10, 0] }}
                  transition={{
                    duration: 0.6,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                />
              ))}
            </motion.div>
          </motion.div>
        </div>
      )}

      {/* Navbar */}
      <nav className="flex justify-between items-center px-6 py-4 bg-black/30 backdrop-blur-md shadow-md relative">
        {/* Logo */}
        <div className="text-2xl font-bold text-purple-400 flex items-center">
          <img src="/logo.png" alt="QuickJob Logo" className="h-10 inline mr-2" />
          QuickJob
        </div>

        {/* Center Buttons - Mobile App & Quick Find */}
        <div className="hidden md:flex space-x-4 absolute left-1/2 transform -translate-x-1/2">
          <button
            className="flex items-center space-x-2 px-5 py-3 rounded-xl text-white font-medium hover:bg-white/20 transition-all duration-300 hover:shadow-blue-500/25 hover:scale-105 group"
            onClick={handleMobileAppClick} // UPDATED
          >
            <Smartphone className="h-5 w-5 group-hover:text-blue-400 transition-colors duration-300" />
            <span>Mobile App</span>
          </button>
          <button 
            onClick={handleQuickFindClick}
            className="flex items-center space-x-2 px-5 py-3 rounded-xl text-white font-medium hover:bg-white/20 transition-all duration-300 hover:shadow-green-500/25 hover:scale-105 group"
          >
            <Search className="h-5 w-5 group-hover:text-green-400 transition-colors duration-300" />
            <span>Quick Find</span>
          </button>
        </div>

        {/* Desktop Buttons */}
        <div className="hidden md:flex space-x-4">
          <Link href="/signin">
            <button className="px-6 py-3 rounded-xl bg-white/10 backdrop-blur-lg border border-white/20 text-white font-medium hover:bg-white/20 hover:border-white/30 transition-all duration-300 shadow-lg hover:shadow-purple-500/25 hover:scale-105">
              Sign In
            </button>
          </Link>
          <Link href="/signup">
            <button className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-lg border border-purple-400/30 text-white font-medium hover:from-purple-500/30 hover:to-pink-500/30 hover:border-purple-400/50 transition-all duration-300 shadow-lg hover:shadow-pink-500/25 hover:scale-105">
              Sign Up
            </button>
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <div className="md:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X className="h-8 w-8" /> : <Menu className="h-8 w-8" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-16 right-6 bg-black/70 backdrop-blur-xl p-4 rounded-xl flex flex-col space-y-3 md:hidden border border-white/10 shadow-2xl"
          >
            <button
              className="flex items-center justify-center space-x-2 w-full px-4 py-3 rounded-xl text-white font-medium hover:bg-white/20 transition-all duration-300 hover:shadow-blue-500/25"
              onClick={handleMobileAppClick} // UPDATED
            >
              <Smartphone className="h-5 w-5" />
              <span>Mobile App</span>
            </button>
            <button 
              onClick={handleQuickFindClick}
              className="flex items-center justify-center space-x-2 w-full px-4 py-3 rounded-xl text-white font-medium hover:bg-white/20 transition-all duration-300 hover:shadow-green-500/25"
            >
              <Search className="h-5 w-5" />
              <span>Quick Find</span>
            </button>
            <Link href="/signin">
              <button className="w-full px-4 py-3 rounded-xl bg-white/10 backdrop-blur-lg border border-white/20 text-white font-medium hover:bg-white/20 hover:border-white/30 transition-all duration-300 shadow-lg hover:shadow-purple-500/25">
                Sign In
              </button>
            </Link>
            <Link href="/signup">
              <button className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-lg border border-purple-400/30 text-white font-medium hover:from-purple-500/30 hover:to-pink-500/30 hover:border-purple-400/50 transition-all duration-300 shadow-lg hover:shadow-pink-500/25">
                Sign Up
              </button>
            </Link>
          </motion.div>
        )}
      </nav>

      {/* Hero Section with Slider */}
      <div className="relative h-[80vh] md:h-[85vh] flex items-center justify-center overflow-hidden">
        {images.map((img, index) => (
          <motion.img
            key={index}
            src={img}
            alt={`slider-${index}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: current === index ? 1 : 0 }}
            transition={{ duration: 1, ease: "easeInOut" }}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ))}

        <div className="absolute text-center px-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 drop-shadow-2xl shadow-black text-shadow-lg">
            <TypeAnimation
              sequence={[
                "Welcome to QuickJob..!", 2000,
                "Sri Lanka's NO:01 Micro jobs Platform...!", 2000,
              ]}
              wrapper="span"
              speed={20}
              repeat={Infinity}
              style={{
                textShadow: '0 4px 8px rgba(0, 0, 0, 0.8), 0 2px 4px rgba(0, 0, 0, 0.6)'
              }}
            />
          </h1>
        </div>
      </div>

      {/* About Section */}
      <section className="py-16 px-6 md:px-12 text-center bg-black/40 backdrop-blur-md">
        <motion.h2
          className="text-2xl md:text-3xl font-semibold mb-10 text-purple-300"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          About QuickJob
        </motion.h2>

        <motion.p
          className="max-w-3xl mx-auto text-base md:text-lg leading-relaxed mb-12"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          QuickJob is Sri Lanka&apos;s No.1 micro jobs platform designed to connect
          employers with skilled workers instantly. Whether you are looking for
          a plumber, carpenter, mechanic, or freelancer, QuickJob makes it easy,
          fast, and reliable to find the right person for your job.
        </motion.p>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {/* Employees */}
          <motion.div
            className="bg-black/50 backdrop-blur-lg p-6 rounded-2xl shadow-lg border border-purple-600/30"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex justify-center mb-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-purple-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A7.962 7.962 0 0112 15c2.21 0 4.21.896 5.657 2.343M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-3xl font-bold text-white">{employeeCount.toLocaleString()}+</h3>
            <p className="text-purple-300 mt-1">Employees</p>
          </motion.div>

          {/* Job Posts */}
          <motion.div
            className="bg-black/50 backdrop-blur-lg p-6 rounded-2xl shadow-lg border border-purple-600/30"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="flex justify-center mb-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-pink-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6M5 8h14M5 16h14M5 12h.01M5 20h.01" />
              </svg>
            </div>
            <h3 className="text-3xl font-bold text-white">{jobPostsCount.toLocaleString()}+</h3>
            <p className="text-pink-300 mt-1">Job Posts</p>
          </motion.div>

          {/* Users */}
          <motion.div
            className="bg-black/50 backdrop-blur-lg p-6 rounded-2xl shadow-lg border border-purple-600/30"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="flex justify-center mb-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-blue-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a4 4 0 00-3-3.87M9 20h6m-6 0a4 4 0 01-4-4H3m6 4a4 4 0 004-4h2a4 4 0 004 4m-6-8a4 4 0 100-8 4 4 0 000 8z" />
              </svg>
            </div>
            <h3 className="text-3xl font-bold text-white">{usersCount.toLocaleString()}+</h3>
            <p className="text-blue-300 mt-1">Users</p>
          </motion.div>

          {/* Reviews */}
          <motion.div
            className="bg-black/50 backdrop-blur-lg p-6 rounded-2xl shadow-lg border border-purple-600/30"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="flex justify-center mb-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-yellow-400"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 .587l3.668 7.431 8.167 1.188-5.917 5.762 1.396 8.13L12 18.896l-7.314 3.844 1.396-8.13L.165 9.206l8.167-1.188z" />
              </svg>
            </div>
            <h3 className="text-3xl font-bold text-white">{reviewsCount.toLocaleString()}+</h3>
            <p className="text-yellow-300 mt-1">Reviews</p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/30 py-4 text-center text-xs md:text-sm text-gray-300">
        <p>© {new Date().getFullYear()} QuickJob. All rights reserved.</p>
        <p>Software Version 1.0.0</p>
      </footer>
    </div>
  );
}
