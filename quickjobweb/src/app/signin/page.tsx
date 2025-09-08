"use client";

import { useState } from "react";
import { auth } from "@/lib/firebaseConfig";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { collection, getFirestore, query, where, getDocs } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import { motion } from "framer-motion";
import { FaHome } from "react-icons/fa"; // Home icon
import Link from "next/link";

// Firestore instance
const firestore = getFirestore();

export default function SigninPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [firstName, setFirstName] = useState("");

  const handleSignin = async () => {
    setLoading(true);
    try {
      const googleProvider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, googleProvider);

      if (result.user.emailVerified) {
        const email = result.user.email;

        // Query userlog
        const q = query(collection(firestore, "userlog"), where("email", "==", email));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const userData = querySnapshot.docs[0].data();
          setFirstName(userData.firstName);
          setSuccess(true);
          localStorage.setItem("userFirstName", userData.firstName);
          localStorage.setItem("email", userData.email);

          setTimeout(() => {
            sessionStorage.setItem("firstName", userData.firstName);
            sessionStorage.setItem("email", userData.email);
            if (userData.accountType === "Employee") {
              router.push("/employeedashboard");
            } else if (userData.accountType === "Job Supplier") {
              router.push("/publisherdashboard");
            } else if (userData.accountType === "Admin") {
              router.push("/admindashboard");
            } else {
              alert("Unknown account type!");
            }
          }, 3000);
        } else {
          alert("This email is not registered in our system.");
        }
      } else {
        alert("Please verify your Gmail before signing in.");
      }
    } catch (err) {
      console.error(err);
      alert("Sign-in failed: " + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-black via-purple-900 to-black text-white px-6">
      <div className="w-full max-w-md bg-black/50 backdrop-blur-lg p-8 rounded-2xl shadow-lg text-center relative">
        <h2 className="text-2xl font-bold mb-6 text-purple-400">Sign In</h2>

        {/* Google Sign-In Button */}
        <button
          onClick={handleSignin}
          disabled={loading}
          className="flex items-center justify-center gap-3 w-full py-2 rounded-xl bg-white text-black font-medium hover:bg-gray-100 transition disabled:opacity-50"
        >
          <FcGoogle size={22} />
          {loading ? "Signing in..." : "Sign In with Google"}
        </button>

        {/* Links Below Button */}
        <div className="mt-6 flex flex-col items-center gap-3">
          {/* New user SignUp */}
          <p className="text-gray-300">
            Are you a new user?{" "}
            <Link href="/signup" className="text-purple-400 font-semibold hover:underline">
              Sign Up
            </Link>
          </p>

          {/* Home Link */}
          <Link
            href="/"
            className="flex items-center gap-2 text-blue-400 hover:text-blue-300 font-medium"
          >
            <FaHome />
            Home
          </Link>
        </div>

        {/* Success Animation */}
        {success && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mt-6 flex flex-col items-center"
          >
            <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center mb-2">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                strokeWidth={3}
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-green-400 font-semibold text-lg">
              Login Successful! Welcome {firstName}
            </p>
            <motion.div
              className="w-full h-2 bg-purple-600 rounded mt-2 overflow-hidden"
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 3 }}
            ></motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
