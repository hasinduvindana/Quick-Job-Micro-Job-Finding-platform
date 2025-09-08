"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Users,
  Briefcase,
  UserPlus,
  FolderPlus,
  CheckCircle,
  Power,
  MapPin,
  Edit,
  Trash2,
} from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import { db } from "@/lib/firebaseConfig";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
// const logo = "/logo.png";

interface Category {
  id: string;
  name: string;
  createdAt: Date;
}

interface NewUser {
  id: string;
  email: string;
  accountType: string;
  createdAt: Date;
}

interface District {
  id: string;
  districtName: string;
  cities: string[];
  createdAt: Date;
  cityCount: number;
}

interface Rating {
  id: string;
  employeeId: string;
  reviewerEmail: string;
  rating: number;
  createdAt: Date;
}

export default function AdminDashboard() {
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [totalJobSuppliers, setTotalJobSuppliers] = useState(0);

  const [newCategory, setNewCategory] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [showPopup, setShowPopup] = useState(false);
  const [newUsers, setNewUsers] = useState<NewUser[]>([]);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [accountType, setAccountType] = useState("");
  const [userPopup, setUserPopup] = useState(false);

  // Manage Map states
  const [newDistrict, setNewDistrict] = useState("");
  const [districts, setDistricts] = useState<District[]>([]);
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [newCity, setNewCity] = useState("");
  const [editingDistrict, setEditingDistrict] = useState<string | null>(null);
  const [editDistrictName, setEditDistrictName] = useState("");

  // Ratings states
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [filterDate, setFilterDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [filterEmployeeId, setFilterEmployeeId] = useState("");
  const [filteredRatings, setFilteredRatings] = useState<Rating[]>([]);

  useEffect(() => {
    fetchCategories();
    fetchNewUsers();
    fetchStats();
    fetchDistricts();
  }, []);

  // ============================
  // Firestore fetch functions
  // ============================
  const fetchCategories = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "jobcategory"));
      const categoriesList: Category[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name || "",
        createdAt: doc.data().createdAt?.toDate() || new Date(),
      }));
      setCategories(categoriesList);
    } catch (error) {
      console.error("Error fetching categories: ", error);
    }
  };

  const fetchNewUsers = async () => {
    try {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

      const q = query(
        collection(db, "userlog"),
        where("createdAt", ">=", oneWeekAgo),
        orderBy("createdAt", "desc")
      );

      const querySnapshot = await getDocs(q);
      const usersList: NewUser[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        email: doc.data().email || "",
        accountType: doc.data().accountType || "",
        createdAt: doc.data().createdAt?.toDate() || new Date(),
      }));
      setNewUsers(usersList);
    } catch (error) {
      console.error("Error fetching new users: ", error);
    }
  };

  const fetchStats = async () => {
    try {
      const totalSnapshot = await getDocs(collection(db, "userlog"));
      setTotalUsers(totalSnapshot.size - 1);

      const employeeQuery = query(
        collection(db, "userlog"),
        where("accountType", "==", "Employee")
      );
      const employeeSnapshot = await getDocs(employeeQuery);
      setTotalEmployees(employeeSnapshot.size);

      const supplierQuery = query(
        collection(db, "userlog"),
        where("accountType", "==", "Job Supplier")
      );
      const supplierSnapshot = await getDocs(supplierQuery);
      setTotalJobSuppliers(supplierSnapshot.size);
    } catch (error) {
      console.error("Error fetching stats: ", error);
    }
  };

  const fetchDistricts = async () => {
    try {
      const snapshot = await getDocs(collection(db, "map"));
      const list: District[] = snapshot.docs.map((d) => ({
        id: d.id,
        districtName: d.data().districtName,
        cities: d.data().cities || [],
        createdAt: d.data().createdAt?.toDate() || new Date(),
        cityCount: d.data().cities?.length || 0,
      }));
      setDistricts(list);
    } catch (error) {
      console.error("Error fetching districts: ", error);
    }
  };

  // Fetch ratings from Firestore
  useEffect(() => {
    const fetchRatings = async () => {
      const querySnapshot = await getDocs(collection(db, "ratings"));
      const ratingsList: Rating[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        employeeId: doc.data().employeeId || "",
        reviewerEmail: doc.data().reviewerEmail || "",
        rating: doc.data().rating || 0,
        createdAt: doc.data().createdAt?.toDate() || new Date(),
      }));
      setRatings(ratingsList);
    };
    fetchRatings();
  }, []);

  // Filter ratings by date or employeeId
  useEffect(() => {
    let filtered = ratings;
    if (filterEmployeeId.trim()) {
      filtered = filtered.filter(r => r.employeeId.includes(filterEmployeeId.trim()));
    } else if (filterDate) {
      filtered = filtered.filter(r => r.createdAt.toISOString().slice(0, 10) === filterDate);
    }
    setFilteredRatings(filtered);
    setFilteredRatings(filtered);
  }, [ratings, filterDate, filterEmployeeId]);
  // ============================
  // Firestore add/update/delete
  // ============================
  const handleAddCategory = async () => {
    if (newCategory.trim() === "") return;

    try {
      await addDoc(collection(db, "jobcategory"), {
        name: newCategory.trim(),
        createdAt: new Date(),
      });
      setNewCategory("");
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 3000);
      fetchCategories();
    } catch (error) {
      console.error("Error adding category: ", error);
    }
  };

  const handleAddUser = async () => {
    if (!firstName.trim() || !lastName.trim() || !email.trim() || !accountType) {
      alert("All fields are required.");
      return;
    }

    try {
      await addDoc(collection(db, "userlog"), {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        accountType,
        email: email.trim(),
        createdAt: new Date(),
      });

      setFirstName("");
      setLastName("");
      setEmail("");
      setAccountType("");
      setUserPopup(true);
      setTimeout(() => setUserPopup(false), 3000);
      fetchStats();
    } catch (error) {
      console.error("Error adding user: ", error);
      alert("Error adding user. Please try again.");
    }
  };

  const handleAddDistrict = async () => {
    if (!newDistrict.trim()) return;
    try {
      await addDoc(collection(db, "map"), {
        districtName: newDistrict.trim(),
        cities: [],
        createdAt: new Date(),
      });
      setNewDistrict("");
      fetchDistricts();
    } catch (error) {
      console.error("Error adding district: ", error);
    }
  };

  const handleEditDistrict = (id: string, currentName: string) => {
    setEditingDistrict(id);
    setEditDistrictName(currentName);
  };

  const handleUpdateDistrict = async () => {
    if (!editingDistrict || !editDistrictName.trim()) return;
    try {
      const districtRef = doc(db, "map", editingDistrict);
      await updateDoc(districtRef, {
        districtName: editDistrictName.trim(),
      });
      setEditingDistrict(null);
      setEditDistrictName("");
      fetchDistricts();
    } catch (error) {
      console.error("Error updating district: ", error);
    }
  };

  const handleDeleteDistrict = async (id: string) => {
    if (confirm("Are you sure you want to delete this district?")) {
      try {
        await deleteDoc(doc(db, "map", id));
        fetchDistricts();
      } catch (error) {
        console.error("Error deleting district: ", error);
      }
    }
  };

  const handleAddCity = async () => {
    if (!selectedDistrict || !newCity.trim()) return;
    try {
      const districtRef = doc(db, "map", selectedDistrict);
      const selected = districts.find((d) => d.id === selectedDistrict);
      await updateDoc(districtRef, {
        cities: [...(selected?.cities || []), newCity.trim()],
      });
      setNewCity("");
      fetchDistricts();
    } catch (error) {
      console.error("Error adding city: ", error);
    }
  };

  const handleDeleteCity = async (districtId: string, city: string) => {
    if (confirm("Are you sure you want to delete this city?")) {
      try {
        const districtRef = doc(db, "map", districtId);
        const selected = districts.find((d) => d.id === districtId);
        if (!selected) return;
        const updatedCities = selected.cities.filter((c) => c !== city);
        await updateDoc(districtRef, { cities: updatedCities });
        fetchDistricts();
      } catch (error) {
        console.error("Error deleting city: ", error);
      }
    }
  };

  // ============================
  // Logout
  // ============================
  const handleLogout = () => {
    setIsLoggingOut(true);
    setTimeout(() => {
      window.location.href = "/";
    }, 3000);
  };

  // PDF Download
  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    // Add logo
    doc.addImage("/logo.png", "PNG", 80, 10, 50, 40);

    // Tagline in italic, below logo
    doc.setFont("times", "italic");
    doc.setFontSize(14);
    doc.text("Find Your Jobs Quickly & Safely..", 105, 55, { align: "center" });

    // Add some space before the title
    doc.setFont("times", "normal");
    doc.setFontSize(18);
    doc.text("Review Report", 105, 70, { align: "center" });

    // Add some space before the timestamp
    doc.setFontSize(10);
    doc.text(`Downloaded: ${new Date().toLocaleString()}`, 15, 80);

    // Table (startY adjusted for new spacing)
    autoTable(doc, {
      startY: 85,
      head: [["Employee ID", "Reviewer Email", "Rating", "Created At"]],
      body: filteredRatings.map(r => [
        r.employeeId,
        r.reviewerEmail,
        "*".repeat(Math.round(r.rating)) + "☆".repeat(5 - Math.round(r.rating)),
        r.createdAt.toLocaleString(),
      ]),
      theme: "grid",
      styles: { fontSize: 10 },
    });

    // Footer page numberaa
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.text(`Page ${i} of ${pageCount}`, 105, doc.internal.pageSize.height - 10, { align: "center" });
    }
    doc.save("review_report.pdf");
  };

  // ============================
  // Render
  // ============================
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-purple-950 text-white p-8">
      {/* Header */}
      <div className="relative mb-8">
        {/* Logout button top right */}
        <div className="absolute top-0 right-0">
          <Button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 flex items-center space-x-2"
          >
            <Power className="w-5 h-5" />
            <span>Logout</span>
          </Button>
        </div>
        {/* Centered logo and title */}
        <div className="flex flex-col items-center">
          <Image src="/logo.png" alt="Logo" width={160} height={160} className="h-40 w-auto mb-2" priority />
          <span className="text-4xl font-bold mt-2">Admin Dashboard</span>
        </div>
      </div>

      {/* Success Popups */}
      {userPopup && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2 z-50">
          <CheckCircle className="w-5 h-5" />
          <span>User Added Successfully!</span>
        </div>
      )}

      {isLoggingOut && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50"
        >
          <div className="bg-white text-black rounded-lg p-6 shadow-lg text-xl font-semibold">
            Logging Out...
          </div>
        </motion.div>
      )}

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <Card className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-lg">
          <CardContent className="flex items-center p-6 space-x-4">
            <Users className="w-10 h-10 text-purple-400" />
            <div>
              <p className="text-lg font-semibold">Total Users</p>
              <p className="text-2xl">{totalUsers}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-lg">
          <CardContent className="flex items-center p-6 space-x-4">
            <Briefcase className="w-10 h-10 text-purple-400" />
            <div>
              <p className="text-lg font-semibold">Employees</p>
              <p className="text-2xl">{totalEmployees}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-lg">
          <CardContent className="flex items-center p-6 space-x-4">
            <FolderPlus className="w-10 h-10 text-purple-400" />
            <div>
              <p className="text-lg font-semibold">Job Suppliers</p>
              <p className="text-2xl">{totalJobSuppliers}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs Section */}
      <Tabs defaultValue="addUser" className="w-full">
        <TabsList className="flex flex-wrap justify-center space-x-6 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-2">
          <TabsTrigger value="addUser" className="px-4 py-2">
            <UserPlus className="inline w-5 h-5 mr-2" /> Add New User
          </TabsTrigger>
          <TabsTrigger value="newUsers" className="px-4 py-2">
            <Users className="inline w-5 h-5 mr-2" /> Newly Connected Users
          </TabsTrigger>
          <TabsTrigger value="categories" className="px-4 py-2">
            <FolderPlus className="inline w-5 h-5 mr-2" /> Job Categories
          </TabsTrigger>
          <TabsTrigger value="manageMap" className="px-4 py-2">
            <MapPin className="inline w-5 h-5 mr-2" /> Manage Map
          </TabsTrigger>
          <TabsTrigger value="viewRatings" className="px-4 py-2">
            <CheckCircle className="inline w-5 h-5 mr-2" /> View Employee Rating
          </TabsTrigger>
        </TabsList>

        {/* Add User Tab */}
        <TabsContent value="addUser" className="mt-6">
          <Card className="bg-white/10 backdrop-blur-lg border border-white/20 shadow-xl">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-4">Add New User</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="p-3 rounded-lg bg-white/20 border border-white/30 focus:outline-none text-white placeholder-gray-300"
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="p-3 rounded-lg bg-white/20 border border-white/30 focus:outline-none text-white placeholder-gray-300"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="p-3 rounded-lg bg-white/20 border border-white/30 focus:outline-none text-white placeholder-gray-300"
                />
                <div className="flex justify-center gap-6 text-sm col-span-1 md:col-span-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="accountType"
                      value="Employee"
                      onChange={(e) => setAccountType(e.target.value)}
                      className="text-purple-500"
                    />
                    Employee
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="accountType"
                      value="Job Supplier"
                      onChange={(e) => setAccountType(e.target.value)}
                      className="text-purple-500"
                    />
                    Job Supplier
                  </label>
                </div>
              </div>
              <Button
                onClick={handleAddUser}
                className="mt-6 w-full bg-purple-600 hover:bg-purple-700"
              >
                Add User
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Newly Connected Users */}
        <TabsContent value="newUsers" className="mt-6">
          <Card className="bg-white/10 backdrop-blur-lg border border-white/20 shadow-xl">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-4">Newly Connected Users</h2>
              <div className="space-y-3">
                {newUsers.length > 0 ? (
                  newUsers.map((user) => (
                    <div key={user.id} className="p-3 rounded-lg bg-white/20">
                      <div><strong>Email:</strong> {user.email}</div>
                      <div><strong>Account Type:</strong> {user.accountType}</div>
                      <div><strong>Joined:</strong> {user.createdAt.toLocaleDateString()}</div>
                    </div>
                  ))
                ) : (
                  <div className="p-3 rounded-lg bg-white/20 text-gray-400">No recent users</div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Job Categories */}
        <TabsContent value="categories" className="mt-6">
          <Card className="bg-white/10 backdrop-blur-lg border border-white/20 shadow-xl">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-4">Manage Job Categories</h2>
              <div className="flex space-x-4 mb-4">
                <input
                  type="text"
                  placeholder="New Category"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="flex-1 p-3 rounded-lg bg-white/20 border border-white/30 focus:outline-none text-white placeholder-gray-300"
                />
                <Button
                  onClick={handleAddCategory}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  Add Category
                </Button>
              </div>

              {/* Success Popup */}
              {showPopup && (
                <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2 z-50">
                  <CheckCircle className="w-5 h-5" />
                  <span>Category Inserted Successfully!</span>
                </div>
              )}

              <div className="space-y-3">
                {categories.length > 0 ? (
                  categories.map((category) => (
                    <div key={category.id} className="p-3 rounded-lg bg-white/20">
                      {category.name}
                    </div>
                  ))
                ) : (
                  <div className="p-3 rounded-lg bg-white/20 text-gray-400">No categories yet</div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Manage Map */}
        <TabsContent value="manageMap" className="mt-6">
          <Card className="bg-white/10 backdrop-blur-lg border border-white/20 shadow-xl">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-6">Manage Map</h2>

              {/* Add District */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-2">Add District</h3>
                <div className="flex space-x-4">
                  <input
                    type="text"
                    placeholder="District Name"
                    value={newDistrict}
                    onChange={(e) => setNewDistrict(e.target.value)}
                    className="flex-1 p-3 rounded-lg bg-white/20 border border-white/30 focus:outline-none text-white placeholder-gray-300"
                  />
                  <Button
                    onClick={handleAddDistrict}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    Add District
                  </Button>
                </div>

                {/* Districts List */}
                <div className="mt-4 space-y-2">
                  {districts.map((d) => (
                    <div
                      key={d.id}
                      className="flex justify-between items-center p-3 bg-white/20 rounded-lg"
                    >
                      {editingDistrict === d.id ? (
                        <div className="flex space-x-2 flex-1">
                          <input
                            type="text"
                            value={editDistrictName}
                            onChange={(e) => setEditDistrictName(e.target.value)}
                            className="flex-1 p-2 rounded bg-white/30 border border-white/40 text-white"
                          />
                          <Button
                            onClick={handleUpdateDistrict}
                            className="bg-green-600 hover:bg-green-700 px-3 py-1"
                          >
                            Save
                          </Button>
                          <Button
                            onClick={() => setEditingDistrict(null)}
                            className="bg-gray-600 hover:bg-gray-700 px-3 py-1"
                          >
                            Cancel
                          </Button>
                        </div>
                      ) : (
                        <>
                          <span>{d.districtName} ({d.cityCount} cities)</span>
                          <div className="flex space-x-2">
                            <Button
                              onClick={() => handleEditDistrict(d.id, d.districtName)}
                              className="bg-blue-600 hover:bg-blue-700 p-2"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              onClick={() => handleDeleteDistrict(d.id)}
                              className="bg-red-600 hover:bg-red-700 p-2"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Districts Chart */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-2">Districts Overview</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={districts}>
                    <XAxis dataKey="districtName" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="cityCount" fill="#a78bfa" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Manage Cities */}
              <div>
                <h3 className="text-xl font-semibold mb-2">Add City</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <select
                    value={selectedDistrict}
                    onChange={(e) => setSelectedDistrict(e.target.value)}
                    className="p-3 rounded-lg bg-white/20 border border-white/30 focus:outline-none text-white"
                  >
                    <option value="" className="bg-gray-800">Select District</option>
                    {districts.map((d) => (
                      <option key={d.id} value={d.id} className="bg-gray-800">
                        {d.districtName}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    placeholder="City Name"
                    value={newCity}
                    onChange={(e) => setNewCity(e.target.value)}
                    className="p-3 rounded-lg bg-white/20 border border-white/30 focus:outline-none text-white placeholder-gray-300"
                  />
                </div>
                <Button
                  onClick={handleAddCity}
                  className="mt-4 w-full bg-purple-600 hover:bg-purple-700"
                >
                  Add City
                </Button>
              </div>

              {/* Cities Display */}
              {selectedDistrict && (
                <div className="mt-8">
                  <h3 className="text-xl font-semibold mb-2">
                    Cities in {districts.find((d) => d.id === selectedDistrict)?.districtName}
                  </h3>
                  <div className="space-y-2 mb-4">
                    {districts
                      .find((d) => d.id === selectedDistrict)
                      ?.cities.map((city, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center p-3 bg-white/20 rounded-lg"
                        >
                          <span>{city}</span>
                          <Button
                            onClick={() => handleDeleteCity(selectedDistrict, city)}
                            className="bg-red-600 hover:bg-red-700 p-2"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                  </div>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      data={
                        districts
                          .find((d) => d.id === selectedDistrict)
                          ?.cities.map((c) => ({ name: c, value: 1 })) || []
                      }
                    >
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#f472b6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* View Employee Rating Tab */}
        <TabsContent value="viewRatings" className="mt-6">
          <Card className="bg-white/10 backdrop-blur-lg border border-white/20 shadow-xl">
            <CardContent className="p-6">
              {/* Logo and Title */}
              <div className="flex flex-col items-center mb-2">
                <Image src="/logo.png" alt="Logo" width={64} height={64} className="h-16 mb-2" priority />
                <span className="italic text-lg text-gray-300 mb-4 mt-2">
                  Find Your Jobs Quickly &amp; Safely..
                </span>
                <h2 className="text-2xl font-bold mb-4 mt-2">Review Report</h2>
              </div>
              {/* Filters */}
              <div className="flex flex-wrap gap-4 mb-4">
                <div>
                  <label className="mr-2 text-sm">Filter by Date:</label>
                  <input
                    type="date"
                    value={filterDate}
                    onChange={e => { setFilterDate(e.target.value); setFilterEmployeeId(""); }}
                    className="p-2 rounded bg-white/20 border border-white/30 text-white"
                  />
                </div>
                <div>
                  <label className="mr-2 text-sm">Filter by Employee ID:</label>
                  <input
                    type="text"
                    value={filterEmployeeId}
                    onChange={e => { setFilterEmployeeId(e.target.value); setFilterDate(""); }}
                    placeholder="Employee ID"
                    className="p-2 rounded bg-white/20 border border-white/30 text-white"
                  />
                </div>
                <Button
                  onClick={handleDownloadPDF}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Download PDF
                </Button>
              </div>
              {/* Table View */}
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white/10 rounded-lg">
                  <thead className="sticky top-0 bg-purple-900/80 z-10">
                    <tr>
                      <th className="p-2 text-left font-semibold">Employee ID</th>
                      <th className="p-2 text-left font-semibold">Reviewer Email</th>
                      <th className="p-2 text-left font-semibold">Rating</th>
                      <th className="p-2 text-left font-semibold">Created At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRatings.length > 0 ? (
                      filteredRatings.map((r, idx) => (
                        <tr
                          key={r.id}
                          className={`border-b border-white/20 ${idx % 2 === 0 ? "bg-white/5" : "bg-white/15"} hover:bg-purple-800/30 transition`}
                        >
                          <td className="p-2">{r.employeeId}</td>
                          <td className="p-2">{r.reviewerEmail}</td>
                          <td className="p-2">
                            <span className="text-yellow-400">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <span key={i} className={i < Math.round(r.rating) ? "text-yellow-400" : "text-gray-600"}>★</span>
                              ))}
                            </span>
                          </td>
                          <td className="p-2 whitespace-nowrap">{r.createdAt.toLocaleString()}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="p-2 text-center text-gray-400">No ratings found</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
