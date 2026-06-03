import React from 'react'

const SettingsResetModal = ({
    showResetConfirm,
    setShowResetConfirm,
    handleReset,
    resetLoading,
    setResetLoading
}) => {
    return (
        <>
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
    )
}

export default SettingsResetModal