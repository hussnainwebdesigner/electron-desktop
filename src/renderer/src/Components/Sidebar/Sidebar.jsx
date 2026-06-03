import React ,{useState} from 'react'
import { 
  FiHome, 
  FiUsers, 
  FiPackage, 
  FiFileText, 
  FiBarChart, 
  FiSettings,
  FiMenu,
  FiX
} from 'react-icons/fi';
import { Link, useLocation } from 'react-router-dom';


const Sidebar = () => {

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation();
    const navigation = [
        { name: 'Dashboard', href: '/dashboard', icon:  FiHome },
        { name: 'Customers', href: '/customers', icon: FiUsers },
        { name: 'Products', href: '/products', icon: FiPackage },
        { name: 'Invoices', href: '/invoices', icon: FiFileText },
        { name: 'Reports', href: '/reports', icon: FiBarChart },
        { name: 'Settings', href: '/settings', icon: FiSettings },
    ];
    return (
        <>
            <div className={`fixed inset-0 z-40 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
                <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
                <div className="fixed inset-y-0 left-0 flex flex-col w-64 bg-white">
                    <div className="flex items-center justify-between h-16 px-4 border-b">
                        <h1 className="text-xl font-bold text-gray-900">Pharmacy MS</h1>
                        <button onClick={() => setSidebarOpen(false)} className="p-2">
                            <FiX className="w-5 h-5" />
                        </button>
                    </div>
                    <nav className="flex-1 px-2 mt-4 space-y-1">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                to={item.href}
                                className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${location.pathname === item.href
                                    ? 'bg-blue-100 text-blue-700'
                                    : 'text-gray-600 hover:bg-gray-50'
                                    }`}
                                onClick={() => setSidebarOpen(false)}
                            >
                                <item.icon className="w-5 h-5 mr-3" />
                                {item.name}
                            </Link>
                        ))}
                    </nav>
                </div>
            </div>

           
           

        </>
    )
}

export default Sidebar
