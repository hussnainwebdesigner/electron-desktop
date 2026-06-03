import React, { useState, useEffect } from 'react';
import {
    saveSettingsApi,
    updateSettingsApi,
    getSettingsApi,
    resetSettingsApi
} from '../../../apis/settingsApi/settingsApi.js';

import cancel from "../assets/cancel.png";

const SettingsModal = ({ show, onClose, onSave, initialSettings }) => {
    const [formData, setFormData] = useState({
        shopName: '',
        userName: '',
        phoneNumber: '',
        userEmail: '',
        licenseNo: '',
        shopAddress: '',
        notes: '',
        additionalNotes: ''
    });

    const [loading, setLoading] = useState(false);
    const [saveLoading, setSaveLoading] = useState(false);
    const [resetLoading, setResetLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [fieldErrors, setFieldErrors] = useState({});
    const [showResetConfirm, setShowResetConfirm] = useState(false);

    // Initialize form data when modal opens or initialSettings changes
    useEffect(() => {
        if (initialSettings && show) {
            setFormData({
                shopName: initialSettings.shopName || '',
                userName: initialSettings.userName || '',
                phoneNumber: initialSettings.phoneNumber || '',
                userEmail: initialSettings.userEmail || '',
                licenseNo: initialSettings.licenseNo || '',
                shopAddress: initialSettings.shopAddress || '',
                notes: initialSettings.notes || '',
                additionalNotes: initialSettings.additionalNotes || ''
            });
        } else if (show && !initialSettings) {
            // If no initial settings, fetch from API
            fetchSettings();
        }

        // Reset states when modal opens
        if (show) {
            setError('');
            setSuccess('');
            setFieldErrors({});
            setShowResetConfirm(false);
        }
    }, [initialSettings, show]);

    const fetchSettings = async () => {
        try {
            setLoading(true);
            const res = await getSettingsApi();

            if (res.success) {
                setFormData({
                    shopName: res.settings.shopName || '',
                    userName: res.settings.userName || '',
                    phoneNumber: res.settings.phoneNumber || '',
                    userEmail: res.settings.userEmail || '',
                    licenseNo: res.settings.licenseNo || '',
                    shopAddress: res.settings.shopAddress || '',
                    notes: res.settings.notes || '',
                    additionalNotes: res.settings.additionalNotes || ''
                });
            }
        } catch (err) {
            setError('Failed to load settings');
            setTimeout(() => setError(''), 3000);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        // Clear field error when user starts typing
        if (fieldErrors[e.target.name]) {
            setFieldErrors({
                ...fieldErrors,
                [e.target.name]: ''
            });
        }
    };

    const handleSave = async () => {
        // Validate required fields
        const errors = {};
        if (!formData.shopName.trim()) errors.shopName = 'Shop name is required';
        if (!formData.userName.trim()) errors.userName = 'Username is required';
        if (!formData.phoneNumber.trim()) errors.phoneNumber = 'Phone number is required';

        if (Object.keys(errors).length > 0) {
            setFieldErrors(errors);
            setError('Please fill in all required fields');
            setTimeout(() => setError(''), 3000);
            return;
        }

        try {
            setSaveLoading(true);
            setError('');
            setSuccess('');
            setFieldErrors({});

            // Use update or save based on whether settings exist
            const res = initialSettings
                ? await updateSettingsApi(formData)
                : await saveSettingsApi(formData);

            if (res.success) {
                setSuccess('Settings saved successfully');
                // Refresh data
                if (onSave) await onSave();
                // Close modal after short delay
                setTimeout(() => {
                    setSuccess('');
                    if (onClose) onClose();
                }, 1500);
            } else {
                setError(res.message || 'Failed to save settings');
                setTimeout(() => setError(''), 3000);
            }
        } catch (err) {
            console.error('Save error:', err);
            setError(err.response?.data?.message || 'Error saving settings');
            setTimeout(() => setError(''), 3000);
        } finally {
            setSaveLoading(false);
        }
    };

    const handleReset = async () => {
        try {
            setResetLoading(true);
            setError('');

            const res = await resetSettingsApi();

            if (res.success) {
                setSuccess('Settings reset to default values successfully');
                setFormData({
                    shopName: res.settings.shopName || '',
                    userName: res.settings.userName || '',
                    phoneNumber: res.settings.phoneNumber || '',
                    userEmail: res.settings.userEmail || '',
                    licenseNo: res.settings.licenseNo || '',
                    shopAddress: res.settings.shopAddress || '',
                    notes: res.settings.notes || '',
                    additionalNotes: res.settings.additionalNotes || ''
                });

                // Refresh parent component data
                if (onSave) await onSave();

                setTimeout(() => {
                    setSuccess('');
                    setShowResetConfirm(false);
                }, 2000);
            } else {
                setError(res.message || 'Failed to reset settings');
                setTimeout(() => setError(''), 3000);
            }
        } catch (err) {
            console.error('Reset error:', err);
            setError(err.response?.data?.message || 'Error resetting settings');
            setTimeout(() => setError(''), 3000);
        } finally {
            setResetLoading(false);
        }
    };

    const handleDiscard = () => {
        if (initialSettings) {
            setFormData({
                shopName: initialSettings.shopName || '',
                userName: initialSettings.userName || '',
                phoneNumber: initialSettings.phoneNumber || '',
                userEmail: initialSettings.userEmail || '',
                licenseNo: initialSettings.licenseNo || '',
                shopAddress: initialSettings.shopAddress || '',
                notes: initialSettings.notes || '',
                additionalNotes: initialSettings.additionalNotes || ''
            });
        } else {
            fetchSettings();
        }
        setSuccess('');
        setError('');
        setFieldErrors({});
        if (onClose) onClose();
    };

    if (!show) return null;

    if (loading) {
        return (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className='bg-white rounded-lg p-8 w-full max-w-4xl'>
                    <div className="animate-pulse text-center">Loading settings...</div>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto">
                <div className="bg-white rounded-lg w-full max-w-4xl m-4 max-h-[90vh] overflow-y-auto">
                    <div className='p-6'>
                        <div className='w-full flex justify-between items-center gap-4 mb-4 flex-wrap'>
                            <div>
                                <h1 className='text-2xl font-semibold text-gray-800'>Profile Settings</h1>
                                <p className="text-sm text-gray-500 mt-1">
                                    Edit your profile information
                                </p>
                            </div>

                            <div className="flex gap-2">
                                <button
                                    onClick={() => setShowResetConfirm(true)}
                                    disabled={saveLoading || resetLoading}
                                    className="p-2 text-white w-[100px] text-[16px] cursor-pointer font-[500] rounded-xl shadow bg-yellow-600 hover:bg-yellow-700 transition-colors disabled:opacity-50"
                                >
                                    {resetLoading ? 'Resetting...' : 'Reset'}
                                </button>
                                <button
                                    onClick={handleDiscard}
                                    disabled={saveLoading || resetLoading}
                                    className="p-2 text-white w-[100px] text-[16px] cursor-pointer font-[500] rounded-xl shadow bg-gray-500 hover:bg-gray-600 transition-colors disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={saveLoading || resetLoading}
                                    className="p-2 text-white w-[100px] text-[16px] cursor-pointer font-[500] rounded-xl shadow bg-red-600 hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {saveLoading ? 'Saving...' : 'Save'}
                                </button>
                            </div>
                        </div>

                        {/* Success Message */}
                        {success && (
                            <div className="flex justify-start items-center gap-3 bg-green-100 border-2 border-green-500 rounded-xl p-3 w-full mt-2 mb-4">
                                <svg className="w-5 h-5 text-green-700" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <p className="text-green-700 font-[600] lg:text-[18px] text-[14px]">
                                    {success}
                                </p>
                            </div>
                        )}

                        {/* Error Message */}
                        {error && (
                            <div className="flex justify-start items-center gap-3 bg-red-100 border-2 border-red-500 rounded-xl p-3 w-full mt-2 mb-4">
                                <img src={cancel} alt="Error" className="w-5 h-5 " />
                                <p className="text-red-700 font-[600] lg:text-[18px] text-[14px]">
                                    {error}
                                </p>
                            </div>
                        )}

                        <div className="">
                            {/* Row 1 */}
                            <div className="flex lg:flex-nowrap flex-wrap gap-6 w-full">
                                <div className="flex flex-col w-full">
                                    <label htmlFor='shopName' className="text-start font-[500] lg:text-[19px] text-[14px] my-2 text-[#030712]">
                                        Shop Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        id="shopName"
                                        type="text"
                                        name="shopName"
                                        onChange={handleChange}
                                        value={formData.shopName}
                                        className={`lg:text-[18px] text-[14px] font-[400] outline-0 border ${fieldErrors.shopName ? 'border-red-500 bg-red-50' : 'border-gray-300'
                                            } text-[#030712] rounded-xl p-2 shadow-sm transition-colors bg-white focus:border-red-500 focus:ring-1 focus:ring-red-500`}
                                        placeholder="Scott's Medical Store"
                                    />
                                    {fieldErrors.shopName && (
                                        <p className="text-red-500 text-sm mt-1">{fieldErrors.shopName}</p>
                                    )}
                                </div>

                                <div className="flex flex-col w-full">
                                    <label htmlFor='userName' className="text-start font-[500] lg:text-[19px] text-[14px] my-2 text-[#030712]">
                                        Username <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        id="userName"
                                        type="text"
                                        name="userName"
                                        onChange={handleChange}
                                        value={formData.userName}
                                        className={`lg:text-[18px] text-[14px] font-[400] outline-0 border ${fieldErrors.userName ? 'border-red-500 bg-red-50' : 'border-gray-300'
                                            } text-[#030712] rounded-xl p-2 shadow-sm transition-colors bg-white focus:border-red-500 focus:ring-1 focus:ring-red-500`}
                                        placeholder="Scott"
                                    />
                                    {fieldErrors.userName && (
                                        <p className="text-red-500 text-sm mt-1">{fieldErrors.userName}</p>
                                    )}
                                </div>

                                <div className="flex flex-col w-full">
                                    <label htmlFor="phoneNumber" className="text-start font-[500] lg:text-[19px] text-[14px] my-2 text-[#030712]">
                                        Phone Number <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        id="phoneNumber"
                                        type="tel"
                                        name="phoneNumber"
                                        onChange={handleChange}
                                        value={formData.phoneNumber}
                                        className={`lg:text-[18px] text-[14px] font-[400] outline-0 border ${fieldErrors.phoneNumber ? 'border-red-500 bg-red-50' : 'border-gray-300'
                                            } text-[#030712] rounded-xl p-2 shadow-sm transition-colors bg-white focus:border-red-500 focus:ring-1 focus:ring-red-500`}
                                        placeholder="+1 234 567 8900"
                                    />
                                    {fieldErrors.phoneNumber && (
                                        <p className="text-red-500 text-sm mt-1">{fieldErrors.phoneNumber}</p>
                                    )}
                                </div>
                            </div>

                            {/* Row 2 */}
                            <div className="flex lg:flex-nowrap flex-wrap gap-6 w-full">
                                <div className="flex flex-col w-full">
                                    <label htmlFor='userEmail' className="text-start font-[500] lg:text-[19px] text-[14px] my-2 text-[#030712]">Email Address</label>
                                    <input
                                        id="userEmail"
                                        type="email"
                                        name="userEmail"
                                        onChange={handleChange}
                                        value={formData.userEmail}
                                        className="lg:text-[18px] text-[14px] font-[400] outline-0 border border-gray-300 text-[#030712] rounded-xl p-2 shadow-sm transition-colors bg-white focus:border-red-500 focus:ring-1 focus:ring-red-500"
                                        placeholder="scott.jh@email.com"
                                    />
                                </div>

                                <div className="flex flex-col w-full">
                                    <label htmlFor='licenseNo' className="text-start font-[500] lg:text-[19px] text-[14px] my-2 text-[#030712]">License No</label>
                                    <input
                                        id="licenseNo"
                                        type="text"
                                        name="licenseNo"
                                        onChange={handleChange}
                                        value={formData.licenseNo}
                                        className="lg:text-[18px] text-[14px] font-[400] outline-0 border border-gray-300 text-[#030712] rounded-xl p-2 shadow-sm transition-colors bg-white focus:border-red-500 focus:ring-1 focus:ring-red-500"
                                        placeholder="License Number"
                                    />
                                </div>

                                <div className="flex flex-col w-full">
                                    <label htmlFor='shopAddress' className="text-start font-[500] lg:text-[19px] text-[14px] my-2 text-[#030712]">Shop Address</label>
                                    <input
                                        id="shopAddress"
                                        type="text"
                                        name="shopAddress"
                                        onChange={handleChange}
                                        value={formData.shopAddress}
                                        className="lg:text-[18px] text-[14px] font-[400] outline-0 border border-gray-300 text-[#030712] rounded-xl p-2 shadow-sm transition-colors bg-white focus:border-red-500 focus:ring-1 focus:ring-red-500"
                                        placeholder="Shop Address"
                                    />
                                </div>
                            </div>

                            {/* Notes */}
                            <div className="flex flex-col w-full">
                                <label htmlFor='notes' className="text-start font-[500] lg:text-[19px] text-[14px] my-2 text-[#030712]">Notes</label>
                                <textarea
                                    id="notes"
                                    name="notes"
                                    onChange={handleChange}
                                    value={formData.notes}
                                    className="lg:text-[18px] text-[14px] font-[400] outline-0 border border-gray-300 text-[#030712] rounded-xl p-2 shadow-sm transition-colors bg-white focus:border-red-500 focus:ring-1 focus:ring-red-500"
                                    placeholder="Add notes about your company, such as operating hours, special instructions, or any other relevant information that you want to keep handy."
                                    rows={4}
                                />
                            </div>

                            {/* Additional Notes */}
                            <div className="flex flex-col w-full">
                                <label htmlFor='additionalNotes' className="text-start font-[500] lg:text-[19px] text-[14px] my-2 text-[#030712]">Additional Notes</label>
                                <textarea
                                    id="additionalNotes"
                                    name="additionalNotes"
                                    onChange={handleChange}
                                    value={formData.additionalNotes}
                                    className="lg:text-[18px] text-[14px] font-[400] outline-0 border border-gray-300 text-[#030712] rounded-xl p-2 shadow-sm transition-colors bg-white focus:border-red-500 focus:ring-1 focus:ring-red-500"
                                    placeholder="Add additional notes here..."
                                    rows={1}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Reset Confirmation Modal */}
            {showResetConfirm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60]">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <h3 className="text-xl font-semibold mb-4">Reset Settings</h3>
                        <p className="text-gray-600 mb-6">
                            Are you sure you want to reset all settings to default values? This action cannot be undone.
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowResetConfirm(false)}
                                className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleReset}
                                disabled={resetLoading}
                                className="px-4 py-2 text-white bg-yellow-600 rounded-lg hover:bg-yellow-700 transition-colors disabled:opacity-50"
                            >
                                {resetLoading ? 'Resetting...' : 'Yes, Reset'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default SettingsModal;