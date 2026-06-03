import { useState, useEffect, useRef } from "react";


import angleDownIcon from './assets/angleDownIcon.png';
import logoutIcon from './assets/logoutIcon.png';
import settingIcon from './assets/settingIcon.png';
import receiptIcon from './assets/receiptIcon.png';
import productIcon from './assets/productIcon.png';
import minusIcon from './assets/minusIcon.png';
import fullScreenExitIcon from './assets/fullScreenExitIcon.png';
import fullScreenIcon from './assets/fullScreenIcon.png';
import crossIcon from './assets/crossIcon.png';
// import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../Context/AuthContext/AuthContext';
import invoice from "./assets/invoice.png";

const TitleBar = ({ setPageNavigate }) => {
  const [activeMenu, setActiveMenu] = useState(null);
  const [isMaximized, setIsMaximized] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const userDropdownRef = useRef(null);


  const { user, logout, isLoading } = useAuth();

  // Navigation items
  const navigation = [
    { name: 'Products', href: '/products-list', icon: productIcon, title: 'Products', page: 'products-list' },
    { name: 'Invoices', href: '/invoice-list', icon: receiptIcon, title: 'Invoices', page: 'invoice-list' },
    { name: 'Settings', href: '/settings', icon: settingIcon, title: 'Settings', page: 'settings' },
  ];

  // Menu handlers
  const toggleMenu = (menu) => {
    setActiveMenu(activeMenu === menu ? null : menu);
  };

  const closeMenu = () => setActiveMenu(null);

  // Window control handlers
  const handleClose = () => {
    if (window.electronAPI) {
      window.electronAPI.closeWindow();
    }
  };

  const handleMinimize = () => {
    if (window.electronAPI) {
      window.electronAPI.minimizeWindow();
    }
  };

  const handleMaximize = () => {
    if (window.electronAPI) {
      window.electronAPI.maximizeWindow();
    }
  };

  const handleLogout = async () => {
    setPageNavigate('login');
    await logout();
    let token = localStorage.getItem('token');


  };

  // Listen for window state changes
  useEffect(() => {
    if (window.electronAPI?.onWindowStateChange) {
      window.electronAPI.onWindowStateChange((state) => {
        setIsMaximized(state.isMaximized);
      });
    }
  }, []);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (activeMenu && !event.target.closest('.menu-bar') && !event.target.closest('.menu-dropdown')) {
        closeMenu();
      }

      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
        setIsUserDropdownOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [activeMenu]);

  // Close menu on Escape key
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setActiveMenu(null);
        setIsUserDropdownOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);



  return (
    <div className="   text-white select-none">
      {/* Title Bar Section - Draggable */}
      <div className="titlebar bg-sky-500 flex z-[999999] justify-between items-center px-2 h-9">
        <div className="flex items-center gap-2 no-drag">
          <img src={invoice} className="w-[25px] rounded text-emerald-500 border border-emerald-500" alt="logo" />
          <span>PrimeInvoice Track Software</span>
        </div>

        {/* Window Controls - Not Draggable */}
        <div className="flex gap-2 no-drag">
          <button
            onClick={handleMinimize}
            title="Minimize"
            className="px-2 flex justify-center items-center w-9 h-9 bg-blue-500 hover:bg-blue-400 transition-colors"
          >
            <img src={minusIcon} alt="Minimize" className="w-5 h-5" />
          </button>
          <button
            onClick={handleMaximize}
            title={isMaximized ? "Restore" : "Maximize"}
            className="px-2 flex justify-center items-center w-9 h-9 bg-blue-500 hover:bg-blue-400 transition-colors"
          >
            <img src={isMaximized ? fullScreenExitIcon : fullScreenIcon} alt={isMaximized ? "Restore" : "Maximize"} className="w-5 h-5" />

          </button>
          <button
            onClick={handleClose}
            title="Close"
            className="px-2 flex justify-center items-center w-9 h-9 hover:bg-red-600 transition-colors"
          >
            <img src={crossIcon} alt="Close" className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Menu Bar Section - Not Draggable */}
      <div className="menu-bar flex justify-between items-center px-3 py-1 bg-gray-800 no-drag">
        <div className="flex gap-6">
          <div onClick={() => toggleMenu("file")} className="cursor-pointer hover:text-gray-300 relative">
            File
          </div>
          <div onClick={() => toggleMenu("view")} className="cursor-pointer hover:text-gray-300 relative">
            View
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex space-x-2">
          {navigation.map((item) => (
            <button
              key={item.name}
              onClick={() => setPageNavigate(item.page)}
              // onClick={() => navigate(item.href)}
              title={item.title}
              className={`flex items-center px-2 py-1 text-sm font-medium rounded-lg transition-all duration-200 ${location.pathname === item.href
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
            >
              <span className="bg-white rounded-2xl p-1 mr-2 flex items-center justify-center">
                <img src={item.icon} className="w-5 h-5 grayscale-0 brightness-0" />

              </span>


              {item.name}
            </button>
          ))}
        </nav>

        {/* User Dropdown */}
        <div className="relative" ref={userDropdownRef}>
          <button
            onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
            className="flex items-center gap-3 justify-between border-2 border-gray-400 transition-all duration-600 cursor-pointer bg-gray-800 rounded-full p-1 hover:bg-gray-700"
          >
            {user && (
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-semibold shadow-md">
                  {(user?.name?.[0] || user?.email?.[0] || 'U').toUpperCase()}
                </div>
                <span className="text-sm font-medium text-gray-200 hidden sm:inline-block">
                  {user?.name || user?.email?.split('@')[0] || 'User'}
                </span>
              </div>
            )}
            <img src={angleDownIcon} className={`w-8 mt-0.5 transition-transform duration-200 ${isUserDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* User Dropdown Menu */}
          {isUserDropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-gray-800/95 backdrop-blur-md rounded-xl border border-gray-700 shadow-2xl overflow-hidden z-50 menu-dropdown">
              <div className="px-4 py-3 flex flex-col items-center gap-2 border-b border-gray-700 bg-gray-800/50">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-semibold shadow-md">
                  {(user?.name?.[0] || user?.email?.[0] || 'U').toUpperCase()}
                </div>
                <div className="w-full text-center">
                  <p className="text-sm font-semibold text-white">
                    {user?.name || 'User'}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5 truncate">
                    {user?.email || 'No email'}
                  </p>
                </div>
              </div>

              <div className="py-1">
                <button
                  onClick={() => {
                    setPageNavigate('settings');
                    setIsUserDropdownOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <span className="bg-white rounded-2xl p-1.5 mr-2 flex items-center justify-center">
                    <img src={settingIcon} className="w-4 h-4" />
                  </span>
                  <span>Settings</span>
                </button>

                <div className="border-t border-gray-700 my-1"></div>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-500 hover:text-white hover:bg-red-500/60 transition-colors"
                >
                  <span className="bg-white rounded-2xl p-1.5 mr-2 flex items-center justify-center">
                    <img src={logoutIcon} className="w-4 h-4 " />
                  </span>

                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* File Menu Dropdown */}
      {activeMenu === "file" && (
        <div className="absolute bg-white text-black shadow-md mt-1 w-48 z-10 no-drag rounded-md menu-dropdown">
          <div
            onClick={() => {
              if (window.electronAPI?.newWindow) {
                window.electronAPI.newWindow();
              }
              closeMenu();
            }}
            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
          >
            New Window
          </div>
          <div
            onClick={() => {
              if (window.electronAPI?.openDevTools) {
                window.electronAPI.openDevTools();
              }
              closeMenu();
            }}
            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
          >
            DevTools
          </div>
          <div
            onClick={() => {
              if (window.electronAPI?.closeWindow) {
                window.electronAPI.closeWindow();
              }
              closeMenu();
            }}
            className="px-4 py-2 hover:bg-gray-100 cursor-pointer border-t border-gray-200"
          >
            Exit
          </div>
        </div>
      )}

      {/* View Menu Dropdown */}
      {activeMenu === "view" && (
        <div className="absolute bg-white text-black shadow-md mt-1 w-48 z-10 no-drag rounded-md menu-dropdown">
          <div
            onClick={() => {
              window.location.reload();
              closeMenu();
            }}
            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
          >
            Reload
          </div>
          <div
            onClick={() => {
              if (window.electronAPI?.maximizeWindow) {
                window.electronAPI.maximizeWindow();
              }
              closeMenu();
            }}
            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
          >
            Toggle Fullscreen
          </div>
        </div>
      )}

      {/* Overlay for closing menus */}
      {activeMenu && (
        <div className="fixed inset-0 z-0" onClick={closeMenu}></div>
      )}
    </div>
  );
};

export default TitleBar;