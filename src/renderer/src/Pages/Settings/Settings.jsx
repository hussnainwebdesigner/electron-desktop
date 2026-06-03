
import React, { useState, useEffect, useCallback } from 'react';
import SettingsModal from './SettingsModal/SettingsModal';
import SettingsResetModal from './SettingsResetModal/SettingsResetModal.jsx';
import { getSettingsApi, resetSettingsApi } from '../../apis/settingsApi/settingsApi.js';

const Settings = () => {
    const [showModal, setShowModal] = useState(false);
    const [settings, setSettings] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [resetLoading, setResetLoading] = useState(false);
    const [showResetConfirm, setShowResetConfirm] = useState(false);

    // Fetch settings when component mounts
    const fetchSettings = useCallback(async () => {
        try {
            setLoading(true);
            const response = await getSettingsApi();

            if (response.success) {
                setSettings(response.settings);
                setError('');
            } else {
                setError('Failed to load settings');
            }
        } catch (err) {
            console.error('Error fetching settings:', err);
            setError('Error loading settings');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSettings();
    }, [fetchSettings]);

    // Refresh settings when modal closes (after save)
    const handleModalClose = useCallback(() => {
        setShowModal(false);
        fetchSettings(); // Refresh data
    }, [fetchSettings]);

    // Pass settings to modal when opening
    const handleOpenModal = useCallback(() => {
        setShowModal(true);
    }, []);

    // Reset settings to default
    const handleReset = async () => {
        try {
            setResetLoading(true);
            const response = await resetSettingsApi();

            if (response.success) {
                setSettings(response.settings);
                setError('');
                // Show success message
                const successMsg = document.createElement('div');
                successMsg.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
                successMsg.textContent = 'Settings reset successfully!';
                document.body.appendChild(successMsg);
                setTimeout(() => successMsg.remove(), 3000);
            } else {
                setError(response.message || 'Failed to reset settings');
            }
        } catch (err) {
            console.error('Reset error:', err);
            setError(err.response?.data?.message || 'Error resetting settings');
        } finally {
            setResetLoading(false);
            setShowResetConfirm(false);
        }
    };

    if (loading) {
        return (
            <section className='w-full p-4'>
                <div className='w-full shadow-xl my-auto bg-white rounded-lg p-4'>
                    <div className="animate-pulse text-center">Loading settings...</div>
                </div>
            </section>
        );
    }

    return (
        <>
            <section className='w-full flex gap-5'>
                <div className='w-full shadow-xl my-auto bg-white rounded-lg p-4'>
                    <div className='w-full flex justify-between items-center gap-4 mb-4 flex-wrap'>
                        <div className='w-full sm:w-auto'>
                            <h1 className='text-2xl font-semibold text-gray-800'>Settings</h1>
                        </div>

                        <div className='flex w-full sm:w-auto justify-end items-center gap-4'>
                            <button
                                title="Reset Settings"
                                onClick={() => setShowResetConfirm(true)}
                                disabled={resetLoading}
                                className='p-3 bg-yellow-600/70 text-[15px] rounded-md text-white h-11 flex items-center hover:bg-yellow-700/80 whitespace-nowrap disabled:opacity-50'
                            >
                                {resetLoading ? 'Resetting...' : 'Reset Settings'}
                            </button>
                            <button
                                title={settings ? "Edit Settings" : "Add Settings"}
                                onClick={handleOpenModal}
                                className='p-3 bg-blue-600/70 text-[15px] rounded-md text-white h-11 flex items-center hover:bg-blue-700/80 whitespace-nowrap'
                            >
                                {settings ? "Edit Settings" : "Add Settings"}
                            </button>
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                            {error}
                        </div>
                    )}

                    {/* Display Settings Summary */}
                    {settings ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <div className="shadow-sm rounded-lg p-3 bg-gray-100">
                                <label className="text-sm text-gray-500 font-medium">Shop Name</label>
                                <p className="font-medium text-gray-800 mt-1">{settings.shopName || 'Not set'}</p>
                            </div>
                            <div className="shadow-sm rounded-lg p-3 bg-gray-100">
                                <label className="text-sm text-gray-500 font-medium">Username</label>
                                <p className="font-medium text-gray-800 mt-1">{settings.userName || 'Not set'}</p>
                            </div>
                            <div className="shadow-sm rounded-lg p-3 bg-gray-100">
                                <label className="text-sm text-gray-500 font-medium">Phone Number</label>
                                <p className="font-medium text-gray-800 mt-1">{settings.phoneNumber || 'Not set'}</p>
                            </div>
                            <div className="shadow-sm rounded-lg p-3 bg-gray-100">
                                <label className="text-sm text-gray-500 font-medium">Email</label>
                                <p className="font-medium text-gray-800 mt-1">{settings.userEmail || 'Not set'}</p>
                            </div>
                            <div className="shadow-sm rounded-lg p-3 bg-gray-100">
                                <label className="text-sm text-gray-500 font-medium">License Number</label>
                                <p className="font-medium text-gray-800 mt-1">{settings.licenseNo || 'Not set'}</p>
                            </div>
                            <div className="shadow-sm rounded-lg p-3 bg-gray-100">
                                <label className="text-sm text-gray-500 font-medium">Shop Address</label>
                                <p className="font-medium text-gray-800 mt-1">{settings.shopAddress || 'Not set'}</p>
                            </div>
                            
                            <div className="shadow-sm rounded-lg p-3 bg-gray-100 md:col-span-2 bg-gray-50">
                                <label className="text-sm text-gray-500 font-medium">Notes</label>
                                <p className="font-medium text-gray-800 mt-1 whitespace-pre-wrap">{settings?.notes || 'Customer can return or cancel for a full refund within 7 days. Goods sold are neither returnable nor refundable after 7 days. Otherwise a cancellation fee of 20% on purchase price will be imposed. Please retain your receipt as proof of purchase.'}</p>
                            </div>
                            
                            <div className="shadow-sm rounded-lg p-3 bg-gray-100 md:col-span-2">
                                <label className="text-sm text-gray-500 font-medium">Additional Notes</label>
                                <p className="font-medium text-gray-800 mt-1 whitespace-pre-wrap">{settings?.additionalNotes || 'Not set'}</p>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center text-gray-500 p-8 bg-gray-50 rounded-lg">
                            No settings found. Click "Add Settings" to add your shop information.
                        </div>
                    )}
                </div>
            </section>

            <SettingsModal
                show={showModal}
                onClose={handleModalClose}
                onSave={fetchSettings}
                initialSettings={settings}
            />
            <SettingsResetModal
                showResetConfirm={showResetConfirm}
                setShowResetConfirm={setShowResetConfirm}
                handleReset={handleReset}
                resetLoading={resetLoading}
                setResetLoading={setResetLoading}
            />
        </>
    );
};

export default Settings;