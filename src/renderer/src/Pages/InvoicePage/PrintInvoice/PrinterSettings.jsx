import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import settingIcon from '../PrintInvoice/assets/settingIcon.png';

const PrinterSettings = () => {
  const [showSettings, setShowSettings] = useState(false);
  const [printers, setPrinters] = useState([]);
  const [selectedPrinter, setSelectedPrinter] = useState(localStorage.getItem('selectedPrinter') || '');
  const [silentPrint, setSilentPrint] = useState(localStorage.getItem('silentPrinting') === 'true');
  const [loadingPrinters, setLoadingPrinters] = useState(false);

  const loadPrinters = async () => {
    if (window.electronAPI && window.electronAPI.getPrinters) {
      setLoadingPrinters(true);
      try {
        const printerList = await window.electronAPI.getPrinters();
        setPrinters(printerList || []);
        if (printerList && printerList.length > 0 && !selectedPrinter) {
          // Optionally set first printer as default
          // setSelectedPrinter(printerList[0]);
        }
      } catch (error) {
        console.error('Failed to load printers:', error);
        toast.error('Failed to load printers');
      } finally {
        setLoadingPrinters(false);
      }
    } else {
      console.warn('Electron API not available for printer listing');
      toast.error('Printer settings only available in desktop app');
    }
  };

  const handleSaveSettings = () => {
    if (selectedPrinter) {
      localStorage.setItem('selectedPrinter', selectedPrinter);
    }
    localStorage.setItem('silentPrinting', silentPrint);
    toast.success('Printer settings saved');
    setShowSettings(false);
  };

  const handleOpenSettings = () => {
    setShowSettings(true);
    loadPrinters();
  };

  // Don't show button if not in Electron
  if (!window.electronAPI) return null;

  return (
    <>
      <button
        onClick={handleOpenSettings}
        className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
      >
        <span className="inline-flex items-center p-1 bg-blue-200 rounded-full text-xs mr-2">
          <img src={settingIcon} alt="Settings" className="h-5 w-5" />
        </span>
        Printer Settings
      </button>
      
      {showSettings && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
            <h3 className="text-lg font-bold mb-4">Printer Settings</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Select Thermal Printer</label>
              {loadingPrinters ? (
                <div className="text-gray-500 text-sm">Loading printers...</div>
              ) : (
                <select
                  value={selectedPrinter}
                  onChange={(e) => setSelectedPrinter(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Default Printer</option>
                  {printers.map((printer, index) => (
                    <option key={index} value={printer}>{printer}</option>
                  ))}
                </select>
              )}
              {printers.length === 0 && !loadingPrinters && (
                <p className="text-xs text-gray-500 mt-1">No printers found. Make sure printers are installed.</p>
              )}
            </div>
            
            <div className="mb-4">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={silentPrint}
                  onChange={(e) => setSilentPrint(e.target.checked)}
                  className="mr-2 w-4 h-4"
                />
                <span className="text-sm">Silent Printing (no dialog)</span>
              </label>
              <p className="text-xs text-gray-500 mt-1 ml-6">
                When enabled, prints directly to selected printer without showing print preview
              </p>
            </div>
            
            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setShowSettings(false)}
                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveSettings}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Save Settings
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PrinterSettings;