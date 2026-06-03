

import React, { useState, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
import eyeSlash from '../assets/eyeSlash.png';
import eye from '../assets/eye.png';
import { useAuth } from '../../Context/AuthContext/AuthContext'; // Adjust path as needed

const Login = ({ setPageNavigate }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const { login, isAuthenticated } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Basic validation
        if (!email.trim()) {
            setError('Email is required');
            return;
        }
        if (!password) {
            setError('Password is required');
            return;
        }

        setIsLoading(true);

        try {
            // Use the login function from AuthProvider
            const result = await login(email, password);

            if (result.success) {
                // Login successful, redirect to products page
                // navigate('/products-list');
                setPageNavigate('products-list');
            } else {
                setError(result.error);
            }
        } catch (err) {
            setError('Login failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section className="w-full flex h-full justify-center items-center p-4 lg:p-10 ">
            <div className='w-full max-w-[423px] my-10'>
                <div className='flex flex-col rounded-3xl bg-[#E5E7EB] w-full items-center justify-center p-6 shadow-lg'>
                    <h1 className='font-semibold text-center text-[#000] text-2xl lg:text-3xl'>
                        Login Your Account
                    </h1>

                    <form onSubmit={handleSubmit} className='flex flex-col w-full mt-6'>
                        <div className='flex flex-col w-full mb-2'>
                            <label htmlFor="email" className='text-start mb-1 font-medium text-sm text-[#000]/60'>
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="border-2 text-base font-normal outline-none border-gray-200 text-gray-700 rounded-xl px-4 py-2  shadow-sm bg-white focus:border-3 focus:border-gray-400 transition-colors"
                                placeholder='hello@example.com'
                                required
                                disabled={isLoading}
                            />
                        </div>

                        <div className="flex flex-col w-full mb-2">
                            <label htmlFor="password" className='text-start mb-1 font-medium text-sm text-[#000]/60'>
                                Password
                            </label>
                            <div className="relative w-full">
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder='Enter your password'
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

                        {/* Error Message */}
                        <div
                            className={`
                                border-2 text-[16px] font-[400] outline-0
                                rounded-xl flex items-center justify-center shadow bg-red-200 border-red-500
                                overflow-hidden transition-all duration-500
                                ${error ? "max-h-[60px] opacity-100 py-2" : "max-h-0 opacity-0 py-0"}
                            `}
                        >
                            <p className="text-[16px] font-[400] text-red-500">
                                {error}
                            </p>
                        </div>

                        <p className="text-center text-sm gap-2 text-[#000]/80 my-4">
                            Don't have an account?{" "}
                            <button onClick={() => setPageNavigate('registration')} className="text-[#f80202] font-semibold hover:underline">
                                Sign Up
                            </button>
                        </p>

                        <div className='flex flex-col w-full'>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="text-[#000]/90 text-base lg:text-lg cursor-pointer font-medium rounded-xl px-4 py-2  shadow-md bg-gray-400 hover:shadow-lg hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <div className="flex items-center justify-center gap-2">
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        <span>Logging in...</span>
                                    </div>
                                ) : 'Login'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default Login;