'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

const EmpRegisterPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    location: '',
    skill: '',
    experience: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState<string | null>(null);
  const [passwordMatched, setPasswordMatched] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  // Function to handle form field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === 'password' || name === 'confirmPassword') {
      setPasswordMatched(formData.password === formData.confirmPassword);
    }
  };

  // Function to detect the user's location using the Geolocation API
  const detectLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          setFormData((prevData) => ({
            ...prevData,
            location: `Lat: ${latitude}, Lon: ${longitude}`,
          }));
        },
        (error) => {
          console.error('Error detecting location', error);
          setError('Unable to fetch location. Please try again.');
        }
      );
    } else {
      setError('Geolocation is not supported by your browser.');
    }
  };

  // UseEffect to auto-detect the location when the component mounts
  useEffect(() => {
    detectLocation();
  }, []);

  // Function to handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!formData.username.startsWith('emp@')) {
      setError('Username must start with "emp@"');
      return;
    }

    try {
      console.log('Registering with', formData);
      router.push('/signin');
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };

  // Function to clear the form
  const handleClear = () => {
    setFormData({
      name: '',
      phoneNumber: '',
      location: '',
      skill: '',
      experience: '',
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    });
    setError(null);
    setPasswordMatched(true);
  };

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen"
      style={{
        background: 'linear-gradient(135deg, #000000, #003300, #e6d300)',
        color: '#fff',
      }}
    >
      <div className="flex flex-col md:flex-row items-center justify-center w-full max-w-5xl">
        {/* Left Side - Image */}
        <div className="w-full md:w-1/3 flex justify-center md:justify-start items-center mb-4 md:mb-0">
          <Image
            src="https://i.gifer.com/ZSj2.gif"
            alt="Registration GIF"
            width={300}
            height={300}
            className="object-cover"
          />
        </div>

        {/* Right Side - Form */}
        <div className="w-full md:w-2/3 bg-black/80 p-8 rounded-lg shadow-lg">
          <h2 className="text-center text-2xl font-bold mb-4 text-white">Employee Registration</h2>
          {error && <p className="text-red-500 mb-4">{error}</p>}

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Name */}
            <div>
              <label className="block text-sm text-gray-300">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your full name"
                className="w-full px-4 py-2 bg-black/60 text-gray-300 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-sm text-gray-300">Phone Number</label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="Your phone number"
                className="w-full px-4 py-2 bg-black/60 text-gray-300 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm text-gray-300">Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                readOnly
                onFocus={detectLocation}
                className="w-full px-4 py-2 bg-black/60 text-gray-300 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Skill */}
            <div>
              <label className="block text-sm text-gray-300">Skill</label>
              <select
                name="skill"
                value={formData.skill}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-black/60 text-gray-300 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select skill</option>
                <option value="Driver">Driver</option>
                <option value="Cook">Cook</option>
                <option value="Helper">Helper</option>
                <option value="Builder">Builder</option>
                <option value="Motor Mechanic">Motor Mechanic</option>
                <option value="Carpenter">Carpenter</option>
                <option value="Electrician">Electrician</option>
                <option value="Computer Hardware Operator">Computer Hardware Operator</option>
              </select>
            </div>

            {/* Experience */}
            <div>
              <label className="block text-sm text-gray-300">Experience</label>
              <select
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-black/60 text-gray-300 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select experience</option>
                <option value="less than 1">Less than 1 year</option>
                <option value="1 Year">1 Year</option>
                <option value="2 Years">2 Years</option>
                <option value="3 Years">3 Years</option>
                <option value="4 Years">4 Years</option>
                <option value="5 or more">5 or more years</option>
              </select>
            </div>

            {/* Username */}
            <div>
              <label className="block text-sm text-gray-300">Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Starts with emp@"
                className="w-full px-4 py-2 bg-black/60 text-gray-300 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm text-gray-300">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full px-4 py-2 bg-black/60 text-gray-300 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm text-gray-300">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a strong password"
                  className="w-full px-4 py-2 bg-black/60 text-gray-300 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  className="absolute right-3 top-3 text-gray-600"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm text-gray-300">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  className="w-full px-4 py-2 bg-black/60 text-gray-300 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  className="absolute right-3 top-3 text-gray-600"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                >
                  {showConfirmPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            {/* Submit and Clear Buttons */}
            <div className="flex justify-between items-center">
              <button
                type="submit"
                className="w-1/2 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg"
              >
                Register
              </button>
              <button
                type="button"
                onClick={handleClear}
                className="w-1/2 bg-gray-500 hover:bg-gray-600 text-white py-2 rounded-lg"
              >
                Clear
              </button>
            </div>
          </form>

          <p className="mt-4 text-sm text-gray-400 text-center">
            Already have an account?{' '}
            <Link href="/signin" className="text-blue-500 hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmpRegisterPage;
