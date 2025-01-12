'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { checkUserCredentials } from '../../firebase/firestoreService';

const SignInPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      const user = await checkUserCredentials(email, password);
      if (!user) {
        setError('Invalid email or password');
        return;
      }

      const { username } = user;
      if (username.startsWith('emp')) {
        router.push('/empdashboard');
      } else if (username.startsWith('pub')) {
        router.push('/pubdashboard');
      } else {
        setError('Invalid user type');
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen relative">
      {/* Background Gradient Animation */}
      <div
        className="absolute inset-0 z-[-1] animate-bg"
        style={{
          background: 'linear-gradient(135deg, #000000, #003300, #e6d300)',
          backgroundSize: '300% 300%',
        }}
      ></div>

      {/* Sign-In Form */}
      <div className="relative w-full max-w-md p-8 bg-opacity-90 bg-black rounded-2xl shadow-2xl transform transition duration-500 hover:scale-105">
        {/* Background Glow */}
        <div className="absolute inset-0 bg-yellow-600 opacity-30 rounded-2xl blur-xl -z-10"></div>

        <h2 className="text-4xl font-bold text-center text-yellow-400 mb-8 tracking-wide">
          Sign In
        </h2>

        {error && (
          <p className="text-red-500 text-center mb-4 font-semibold">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Input */}
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-yellow-200">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-2 p-4 rounded-xl border border-green-700 bg-green-900 text-yellow-100 placeholder-yellow-400 shadow-inner focus:outline-none focus:ring-4 focus:ring-yellow-500 transition-all duration-300 ease-in-out"
              placeholder="Enter your email"
              required
            />
          </div>

          {/* Password Input */}
          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-yellow-200">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full mt-2 p-4 rounded-xl border border-green-700 bg-green-900 text-yellow-100 placeholder-yellow-400 shadow-inner focus:outline-none focus:ring-4 focus:ring-yellow-500 transition-all duration-300 ease-in-out"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-3 right-3 text-yellow-300 hover:text-yellow-200 transition"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 font-bold text-yellow-900 bg-gradient-to-r from-yellow-400 to-yellow-300 rounded-xl shadow-xl hover:from-yellow-500 hover:to-yellow-400 transform hover:scale-110 transition-transform focus:ring-4 focus:ring-yellow-300 focus:outline-none"
          >
            Sign In
          </button>
        </form>

        {/* Sign Up Link */}
        <p className="text-center mt-6 text-yellow-300">
          Don&apos;t have an account?{' '}
          <a
            href="/chooserole"
            className="text-yellow-400 font-semibold hover:underline hover:text-yellow-300 transition-all duration-200"
          >
            Sign Up
          </a>
        </p>
      </div>

      <style jsx>{`
        @keyframes backgroundAnimation {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        .animate-bg {
          animation: backgroundAnimation 10s ease infinite;
        }
      `}</style>
    </div>
  );
};

export default SignInPage;
