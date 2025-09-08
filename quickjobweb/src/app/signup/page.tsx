"use client";

import { useState } from "react";
import { auth } from "@/lib/firebaseConfig";
import app from "@/lib/firebaseConfig";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getFirestore, collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { FaHome } from "react-icons/fa"; // Home icon
import Link from "next/link";

export default function SignupPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [accountType, setAccountType] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const validateForm = () => {
    if (!firstName.trim() || !lastName.trim() || !accountType) {
      setError("All fields are required.");
      return false;
    }
    return true;
  };

  const handleSignup = async () => {
    setError("");
    if (!validateForm()) return;

    try {
      const googleProvider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, googleProvider); // Gmail verification
      const user = result.user;

      const firestore = getFirestore(app);

      // Check if email already exists in userlog collection
      const q = query(
        collection(firestore, "userlog"),
        where("email", "==", user.email)
      );
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        setError("This email is already registered.");
        return;
      }

      await addDoc(collection(firestore, "userlog"), {
        firstName,
        lastName,
        accountType,
        email: user.email,
        uid: user.uid,
        createdAt: new Date(),
      });

      setSuccess(true);

      setTimeout(() => {
        router.push("/signin"); // redirect to SignIn after 3s
      }, 3000);
    } catch (err: unknown) {
      setError("Signup failed. Try again.");
      if (err instanceof Error) {
        console.error(err.message);
      } else {
        console.error(err);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-black via-purple-900 to-black text-white px-6">
      <div className="w-full max-w-md bg-black/50 backdrop-blur-lg p-8 rounded-2xl shadow-lg">
        {!success ? (
          <>
            <h2 className="text-2xl font-bold text-center mb-6 text-purple-400">
              Create an Account
            </h2>

            {error && (
              <p className="text-red-500 text-sm text-center mb-3">{error}</p>
            )}

            <div className="space-y-4">
              <input
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-4 py-2 rounded-xl bg-black/40 border border-purple-600/30 focus:outline-none focus:border-purple-500"
              />

              <input
                type="text"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-4 py-2 rounded-xl bg-black/40 border border-purple-600/30 focus:outline-none focus:border-purple-500"
              />

              <div className="flex justify-center gap-6 text-sm">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="accountType"
                    value="Employee"
                    onChange={(e) => setAccountType(e.target.value)}
                  />
                  Employee
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="accountType"
                    value="Job Supplier"
                    onChange={(e) => setAccountType(e.target.value)}
                  />
                  Job Supplier
                </label>
              </div>

              <button
                onClick={handleSignup}
                className="w-full py-2 rounded-xl bg-purple-500 hover:bg-purple-600 transition"
              >
                Sign Up with Gmail
              </button>
            </div>

            {/* Links Below Button */}
            <div className="mt-6 flex flex-col items-center gap-3">
              <p className="text-gray-300">
                Already have an Account?{" "}
                <Link
                  href="/signin"
                  className="text-purple-400 font-semibold hover:underline"
                >
                  Sign In
                </Link>
              </p>

              <Link
                href="/"
                className="flex items-center gap-2 text-blue-400 hover:text-blue-300 font-medium"
              >
                <FaHome />
                Home
              </Link>
            </div>
          </>
        ) : (
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              className="flex justify-center mb-4"
            >
              <CheckCircle2 className="h-16 w-16 text-green-400" />
            </motion.div>
            <h3 className="text-green-400 text-xl font-semibold">
              User Registration Successful..!
            </h3>
            <p className="text-gray-400 mt-2">Redirecting to Sign In page...</p>
          </div>
        )}
      </div>
    </div>
  );
}
