


import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
import eyeSlash from '../assets/eyeSlash.png';
import eye from '../assets/eye.png';
import { useAuth } from '../../Context/AuthContext/AuthContext';

const Registration = ({ setPageNavigate }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: ""
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  // const navigate = useNavigate();

  // Use the auth context
  const { register } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });

    if (error) setError('');
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Name is required');
      return false;
    }
    if (!formData.email.trim()) {
      setError('Email is required');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    if (!formData.phoneNumber.trim()) {
      setError('Phone number is required');
      return false;
    }
    if (!formData.password) {
      setError('Password is required');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setError('');
    setIsLoading(true);

    try {
      // Prepare data for API - match backend expectations
      const userData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        phoneNumber: formData.phoneNumber
      };

      // Call the actual registration API through the auth context
      const result = await register(userData);

      if (result.success) {
        // Registration successful - redirect to products page
        setPageNavigate('login');
      } else {
        // Registration failed - show error message
        setError(result.error || 'Registration failed. Please try again.');
      }

    } catch (err) {
      console.error('Registration error:', err);
      setError('Registration failed. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="w-full h-full flex justify-center items-center p-4 lg:p-10 overflow-y-auto">
      <div className='w-full max-w-[423px] mx-auto'>
        <div className='flex flex-col rounded-3xl bg-[#E5E7EB] w-full items-center justify-center p-6 shadow-lg'>

          <h1 className='font-semibold text-center text-[#000] text-2xl lg:text-3xl'>
            Create Account
          </h1>

          <p className="text-center text-[#000]/60 text-md font-[600] my-2">
            Create Account and start your Business
          </p>

          <form onSubmit={handleSubmit} className='flex flex-col w-full '>
            {/* Name Field */}
            <div className='flex flex-col w-full mb-2'>
              <label htmlFor="name" className='text-start mb-1 font-medium text-sm text-[#000]/60'>
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="border-2 text-base font-normal outline-none border-gray-200 text-gray-700 rounded-xl px-4 py-2  shadow-sm bg-white focus:border-3 focus:border-gray-400 transition-colors"
                placeholder='John Doe'
                required
                disabled={isLoading}
              />
            </div>

            {/* Email Field */}
            <div className='flex flex-col w-full mb-2'>
              <label htmlFor="email" className='text-start mb-1 font-medium text-sm text-[#000]/60'>
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="border-2 text-base font-normal outline-none border-gray-200 text-gray-700 rounded-xl px-4 py-2  shadow-sm bg-white focus:border-3 focus:border-gray-400 transition-colors"
                placeholder='hello@example.com'
                required
                disabled={isLoading}
              />
            </div>

            {/* Phone Number Field - Added as required by backend */}
            <div className='flex flex-col w-full mb-2'>
              <label htmlFor="phoneNumber" className='text-start mb-1 font-medium text-sm text-[#000]/60'>
                Phone Number
              </label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="border-2 text-base font-normal outline-none border-gray-200 text-gray-700 rounded-xl px-4 py-2  shadow-sm bg-white focus:border-3 focus:border-gray-400 transition-colors"
                placeholder='+1 234 567 8900'
                required
                disabled={isLoading}
              />
            </div>

            {/* Password Field */}
            <div className="flex flex-col w-full mb-2">
              <label htmlFor="password" className='text-start mb-1 font-medium text-sm text-[#000]/60'>
                Password
              </label>
              <div className="relative w-full">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder='Create a password'
                  className="border-2 text-base font-normal outline-none border-gray-200 text-gray-700 rounded-xl px-4 py-2  shadow-sm bg-white pr-12 focus:border-3 focus:border-gray-400 transition-colors w-full"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer focus:outline-none"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <img src={showPassword ? eyeSlash : eye} alt="Toggle password visibility" className='w-6' />
                </button>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div className="flex flex-col w-full mb-2">
              <label htmlFor="confirmPassword" className='text-start mb-1 font-medium text-sm text-[#000]/60'>
                Confirm Password
              </label>
              <div className="relative w-full">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder='Confirm your password'
                  className="border-2 text-base font-normal outline-none border-gray-200 text-gray-700 rounded-xl px-4 py-2  shadow-sm bg-white pr-12 focus:border-3 focus:border-gray-400 transition-colors w-full"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer focus:outline-none"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >

                  <img src={showConfirmPassword ? eyeSlash : eye} alt="Toggle password visibility" className='w-6' />

                </button>
              </div>
            </div>

            {/* Error Message */}
            <div
              className={`
                border-2 text-[16px] font-[400] outline-0 text-[#ADB3B7]
                rounded-xl flex items-center justify-center shadow bg-red-200 border-red-500
                overflow-hidden transition-all duration-500
                ${error ? "max-h-[60px] opacity-100 py-2" : "max-h-0 opacity-0 py-0"}
              `}
            >
              <p className="text-[16px] font-[400] text-red-500">
                {error}
              </p>
            </div>

            {/* Submit Button */}
            <div className='flex flex-col w-full mt-4'>
              <button
                type="submit"
                disabled={isLoading}
                className="text-[#000]/90 text-base lg:text-lg cursor-pointer font-medium rounded-xl px-4 py-2  shadow-md bg-gray-400 hover:shadow-lg hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Creating account...</span>
                  </div>
                ) : 'Create Account'}
              </button>
            </div>

            {/* Login Link */}
            <p className="text-center text-sm text-[#000]/80 mt-4">
              Already have an account?{" "}
              <button onClick={() => setPageNavigate('login')} className="text-[#f80202]/80 font-semibold hover:underline">
                Sign In
              </button>
            </p>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Registration;