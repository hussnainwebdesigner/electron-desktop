import React, { useState, useEffect } from 'react'

const UpdateNotification = () => {
  const [updateStatus, setUpdateStatus] = useState(null)
  const [downloadProgress, setDownloadProgress] = useState(0)
  const [showNotification, setShowNotification] = useState(false)

  useEffect(() => {
    // Listen for update status from main process
    const removeListener = window.electronAPI?.onUpdateStatus((data) => {
      console.log('Update status:', data)
      
      switch(data.status) {
        case 'available':
          setUpdateStatus({
            type: 'available',
            version: data.version,
            message: `New version ${data.version} is available!`
          })
          setShowNotification(true)
          break
          
        case 'downloading':
          setDownloadProgress(data.percent)
          setUpdateStatus({
            type: 'downloading',
            percent: data.percent,
            message: `Downloading update: ${Math.round(data.percent)}%`
          })
          setShowNotification(true)
          break
          
        case 'downloaded':
          setUpdateStatus({
            type: 'downloaded',
            version: data.version,
            message: `Update ${data.version} has been downloaded. Restart to install?`
          })
          setShowNotification(true)
          break
          
        case 'error':
          setUpdateStatus({
            type: 'error',
            message: `Update error: ${data.message}`
          })
          setShowNotification(true)
          setTimeout(() => setShowNotification(false), 5000)
          break
          
        case 'not-available':
          console.log('No updates available')
          break
          
        default:
          break
      }
    })

    // Check for updates on component mount
    if (window.electronAPI?.checkForUpdates) {
      window.electronAPI.checkForUpdates()
    }

    return () => {
      if (removeListener) removeListener()
    }
  }, [])

  const handleInstallUpdate = () => {
    if (window.electronAPI?.installUpdate) {
      window.electronAPI.installUpdate()
    }
  }

  const handleDismiss = () => {
    setShowNotification(false)
  }

  const handleCheckNow = () => {
    if (window.electronAPI?.checkForUpdates) {
      window.electronAPI.checkForUpdates()
      setUpdateStatus({
        type: 'checking',
        message: 'Checking for updates...'
      })
      setShowNotification(true)
    }
  }

  // Border color based on update type
  const getBorderColor = () => {
    switch(updateStatus?.type) {
      case 'available': return 'border-l-4 border-l-orange-500'
      case 'downloading': return 'border-l-4 border-l-blue-500'
      case 'downloaded': return 'border-l-4 border-l-green-500'
      case 'error': return 'border-l-4 border-l-red-500'
      case 'checking': return 'border-l-4 border-l-gray-400'
      default: return ''
    }
  }

  // Icon based on update type
  const getIcon = () => {
    switch(updateStatus?.type) {
      case 'downloading': return '⬇️'
      case 'downloaded': return '✅'
      case 'available': return '🆕'
      case 'error': return '❌'
      case 'checking': return '⏳'
      default: return '🔄'
    }
  }

  if (!showNotification) {
    return (
      <div className="fixed bottom-5 left-5 z-[9999]">
        <button
          onClick={handleCheckNow}
          className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md text-xs transition-colors duration-200 flex items-center gap-2 shadow-md"
          title="Check for Updates"
        >
          <span>🔄</span>
          <span>Check Updates</span>
        </button>
      </div>
    )
  }

  return (
    <div 
      className={`fixed bottom-5 right-5 z-[9999] min-w-[320px] max-w-[400px] bg-white rounded-lg shadow-lg animate-slide-in ${getBorderColor()}`}
    >
      <div className="flex items-start p-4 gap-3">
        {/* Icon */}
        <div className="text-2xl">
          {getIcon()}
        </div>
        
        {/* Message */}
        <div className="flex-1">
          <strong className="block mb-1 text-gray-800">
            {updateStatus?.type === 'downloaded' ? 'Update Ready' : 'Update Available'}
          </strong>
          <p className="m-0 text-sm text-gray-600">
            {updateStatus?.message}
          </p>
          
          {/* Progress Bar */}
          {updateStatus?.type === 'downloading' && (
            <div className="mt-2 relative">
              <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-500 transition-all duration-300 rounded-full"
                  style={{ width: `${downloadProgress}%` }}
                />
              </div>
              <span className="absolute right-0 -top-5 text-xs text-gray-500">
                {Math.round(downloadProgress)}%
              </span>
            </div>
          )}
        </div>
        
        {/* Actions */}
        <div className="flex gap-2">
          {updateStatus?.type === 'downloaded' && (
            <button
              onClick={handleInstallUpdate}
              className="px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white rounded text-xs font-medium transition-colors duration-200"
            >
              Restart & Install
            </button>
          )}
          
          {updateStatus?.type === 'available' && (
            <button
              onClick={() => window.electronAPI?.checkForUpdates()}
              className="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded text-xs font-medium transition-colors duration-200"
            >
              Download Now
            </button>
          )}
          
          <button
            onClick={handleDismiss}
            className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded text-xs font-medium transition-colors duration-200"
          >
            {updateStatus?.type === 'downloaded' ? 'Later' : 'Dismiss'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default UpdateNotification