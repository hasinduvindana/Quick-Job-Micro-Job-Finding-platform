"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle2, X } from "lucide-react";
import app from "@/lib/firebaseConfig";
import {
  getFirestore,
  collection,
  addDoc,
  Timestamp,
  getDocs,
} from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

const firestore = getFirestore(app);
const storage = getStorage(app);

// Define interface for categories
interface Category {
  id: string;
  name: string;
  createdAt: Date;
}

export default function PostAd() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [categories, setCategories] = useState<Category[]>([]); // Dynamic categories
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  const [formData, setFormData] = useState({
    title: "",
    category: [] as string[],
    supplier: "",
    description: "",
    phone: "",
    email: "",
    location: "",
    images: [] as File[],
  });

  const [showSuccess, setShowSuccess] = useState(false);

  // Fetch categories from Firestore
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
        console.error("Error fetching categories: ", error);
        // Fallback to hardcoded categories if fetch fails
        const fallbackCategories = [
          "Plumber", "Mechanic", "Carpenter", "Electrician", 
          "Painter", "Cleaner", "Gardener"
        ].map((name, index) => ({
          id: `fallback-${index}`,
          name,
          createdAt: new Date()
        }));
        setCategories(fallbackCategories);
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value && !formData.category.includes(value)) {
      setFormData({
        ...formData,
        category: [...formData.category, value],
      });
      e.target.value = "";
    }
  };

  const removeCategory = (categoryToRemove: string) => {
    setFormData({
      ...formData,
      category: formData.category.filter((cat) => cat !== categoryToRemove),
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      if (files.length > 5) {
        alert("Maximum 5 images allowed!");
        return;
      }
      const oversizedFiles = files.filter((file) => file.size > 5 * 1024 * 1024);
      if (oversizedFiles.length > 0) {
        alert("Some files are larger than 5MB. Please choose smaller files.");
        return;
      }
      setFormData({ ...formData, images: files });
    }
  };

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePhone = (phone: string) => {
    const re = /^[0-9+\-\s()]{10,15}$/;
    return re.test(phone);
  };

  const handleClear = () => {
    setFormData({
      title: "",
      category: [],
      supplier: "",
      description: "",
      phone: "",
      email: "",
      location: "",
      images: [],
    });
    const fileInput = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  };

  // ✅ Upload images and always return correct download URLs
  const uploadImages = async (images: File[]): Promise<string[]> => {
    const uploadPromises = images.map(async (image, index) => {
      try {
        const timestamp = Date.now();
        const fileName = `${timestamp}_${index}_${image.name}`;
        const storageRef = ref(storage, `jobposts/${fileName}`);

        const snapshot = await uploadBytes(storageRef, image);

        const downloadURL = await getDownloadURL(snapshot.ref);
        console.log("✅ Uploaded:", fileName, "URL:", downloadURL);

        return downloadURL; // ✅ full working URL
      } catch (error) {
        console.error(`❌ Error uploading ${image.name}:`, error);
        throw error;
      }
    });

    return Promise.all(uploadPromises);
  };

  const handleSubmit = async () => {
    if (!formData.title.trim()) {
      alert("Please enter a job title!");
      return;
    }
    if (formData.title.trim().length < 5) {
      alert("Job title must be at least 5 characters long!");
      return;
    }
    if (formData.category.length === 0) {
      alert("Please select at least one category!");
      return;
    }
    if (!formData.supplier.trim()) {
      alert("Please enter supplier name!");
      return;
    }
    if (!formData.description.trim()) {
      alert("Please enter a description!");
      return;
    }
    if (formData.description.trim().length < 20) {
      alert("Description must be at least 20 characters long!");
      return;
    }
    if (!formData.phone.trim()) {
      alert("Please enter phone number!");
      return;
    }
    if (!validatePhone(formData.phone)) {
      alert("Please enter a valid phone number (10-15 digits)!");
      return;
    }
    if (!formData.email.trim()) {
      alert("Please enter email address!");
      return;
    }
    if (!validateEmail(formData.email)) {
      alert("Please enter a valid email address!");
      return;
    }
    if (!formData.location.trim()) {
      alert("Please enter location!");
      return;
    }

    setLoading(true);
    setUploadProgress(0);

    try {
      const publisherEmail =
        localStorage.getItem("email") || formData.email;

      let imageUrls: string[] = [];
      if (formData.images.length > 0) {
        setUploadProgress(25);
        imageUrls = await uploadImages(formData.images);
        setUploadProgress(75);
      }

      // ✅ Save only the correct full URLs
      const docRef = await addDoc(collection(firestore, "jobposts"), {
        title: formData.title.trim(),
        category: formData.category,
        supplier: formData.supplier.trim(),
        description: formData.description.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim().toLowerCase(),
        location: formData.location.trim(),
        images: imageUrls, // ✅ only valid download URLs
        imageCount: imageUrls.length,
        publisherEmail,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        status: "active",
        views: 0,
        applications: 0,
      });

      console.log("✅ Job posted with ID:", docRef.id);

      setUploadProgress(100);
      setLoading(false);
      setShowSuccess(true);

      setTimeout(() => {
        setShowSuccess(false);
        router.push("/publisherdashboard");
      }, 3000);
    } catch (error) {
      console.error("❌ Error posting job:", error);
      alert("Failed to post job. Please try again.");
      setLoading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-black to-purple-700 p-6">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/10 backdrop-blur-lg shadow-2xl rounded-2xl p-8 w-full max-w-2xl text-white overflow-y-auto max-h-[90vh]"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">📋 New Job Post</h1>
          <button
            onClick={() => router.push("/publisherdashboard")}
            className="px-4 py-2 bg-purple-600 rounded-xl hover:bg-purple-800 transition"
            disabled={loading}
          >
            ← Back
          </button>
        </div>

        {/* Form */}
        <div className="space-y-4">
          {/* Title */}
          <div>
            <input
              type="text"
              name="title"
              placeholder="Job Title (e.g., Need Experienced Plumber)"
              value={formData.title}
              onChange={handleChange}
              maxLength={100}
              className="w-full p-3 rounded-xl bg-black/40 border border-purple-400 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
              disabled={loading}
            />
            <p className="text-xs text-gray-400 mt-1">
              {formData.title.length}/100 characters
            </p>
          </div>

          {/* Category Selection - Updated to use dynamic categories */}
          <div>
            <select
              onChange={handleCategoryChange}
              className="w-full p-3 rounded-xl bg-black/40 border border-purple-400 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              defaultValue=""
              disabled={loading || categoriesLoading}
            >
              <option value="">
                {categoriesLoading ? "Loading categories..." : "Select Category"}
              </option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name} className="bg-black text-white">
                  {cat.name}
                </option>
              ))}
            </select>
            
            {/* Loading indicator for categories */}
            {categoriesLoading && (
              <p className="text-xs text-gray-400 mt-1">
                Loading available categories...
              </p>
            )}
            
            {/* Selected Categories */}
            {formData.category.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.category.map((cat, i) => (
                  <span 
                    key={i} 
                    className="px-3 py-1 bg-purple-600 rounded-xl text-sm flex items-center gap-2"
                  >
                    {cat}
                    <X 
                      className="w-4 h-4 cursor-pointer hover:text-red-300" 
                      onClick={() => !loading && removeCategory(cat)}
                    />
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Supplier Name */}
          <input
            type="text"
            name="supplier"
            placeholder="Supplier/Company Name"
            value={formData.supplier}
            onChange={handleChange}
            maxLength={50}
            className="w-full p-3 rounded-xl bg-black/40 border border-purple-400 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
            disabled={loading}
          />

          {/* Description */}
          <div>
            <textarea
              name="description"
              placeholder="Job Description (Include details, requirements, etc.)"
              value={formData.description}
              onChange={handleChange}
              maxLength={500}
              className="w-full p-3 rounded-xl bg-black/40 border border-purple-400 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
              rows={4}
              disabled={loading}
            />
            <p className="text-xs text-gray-400 mt-1">
              {formData.description.length}/500 characters (minimum 20)
            </p>
          </div>

          {/* Contact Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number (e.g., +94 77 123 4567)"
              value={formData.phone}
              onChange={handleChange}
              className="w-full p-3 rounded-xl bg-black/40 border border-purple-400 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
              disabled={loading}
            />

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 rounded-xl bg-black/40 border border-purple-400 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
              disabled={loading}
            />
          </div>

          {/* Location */}
          <input
            type="text"
            name="location"
            placeholder="Location (e.g., Galle, Colombo, Kandy)"
            value={formData.location}
            onChange={handleChange}
            className="w-full p-3 rounded-xl bg-black/40 border border-purple-400 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
            disabled={loading}
          />

          {/* Images */}
          <div>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="w-full p-3 rounded-xl bg-black/40 border border-purple-400 text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:bg-purple-600 file:text-white hover:file:bg-purple-700"
              disabled={loading}
            />
            <p className="text-xs text-gray-400 mt-1">
              Upload up to 5 images (JPG, PNG, GIF) • Max 5MB per file
            </p>
            {formData.images.length > 0 && (
              <div className="text-sm text-purple-300 mt-1">
                <p>{formData.images.length} image(s) selected:</p>
                <ul className="text-xs text-gray-400 ml-4">
                  {formData.images.map((file, index) => (
                    <li key={index}>• {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Upload Progress Bar */}
        {loading && (
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-300 mb-2">
              <span>Upload Progress</span>
              <span>{uploadProgress}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <motion.div 
                className="bg-green-500 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${uploadProgress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="flex justify-between mt-8">
          <button
            onClick={handleClear}
            className="px-6 py-3 bg-gray-600 rounded-xl hover:bg-gray-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            🗑️ Clear All
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || categoriesLoading}
            className="px-6 py-3 bg-green-600 rounded-xl hover:bg-green-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "⏳ Uploading..." : "📤 Submit Post"}
          </button>
        </div>
      </motion.div>

      {/* Success Popup */}
      {showSuccess && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        >
          <div className="bg-green-600 text-white px-8 py-6 rounded-2xl shadow-lg flex flex-col items-center gap-3">
            <CheckCircle2 className="w-12 h-12" />
            <span className="text-lg font-semibold">Job Posted Successfully!</span>
            <span className="text-sm">Images uploaded to Firebase Storage</span>
            <span className="text-sm">Redirecting to dashboard...</span>
          </div>
        </motion.div>
      )}

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-40">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="bg-purple-800 p-6 rounded-2xl text-center text-white max-w-sm"
          >
            <motion.div
              className="w-8 h-8 border-4 border-t-white border-b-purple-400 border-l-purple-400 border-r-purple-400 rounded-full mx-auto mb-3"
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            />
            <p className="mb-2">
              {uploadProgress < 25 ? "Preparing upload..." :
               uploadProgress < 75 ? "Uploading images..." :
               uploadProgress < 100 ? "Saving job post..." :
               "Almost done..."}
            </p>
            <div className="w-full bg-purple-900 rounded-full h-2 mb-2">
              <div 
                className="bg-white h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <p className="text-sm text-purple-200">{uploadProgress}% complete</p>
          </motion.div>
        </div>
      )}
    </div>
  );
}
