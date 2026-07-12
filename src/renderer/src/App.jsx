// App.js
import { useState, useEffect } from 'react';
import TitleBar from './Components/TitleBar/TitleBar';
import Products from './Pages/Products/Products';
import Invoice from './Pages/InvoicePage/Invoice/Invoice';
import PrintInvoice from './Pages/InvoicePage/PrintInvoice/PrintInvoice';
import InvoiceList from './Pages/InvoicePage/InvoiceList/InvoiceList';
import Settings from './Pages/Settings/Settings';
import Login from './Auth/Login/Login';
import Registration from './Auth/Registration/Registration';
import UpdateNotification from './Components/UpdateNotification/UpdateNotification';

const App = () => {
  const [pageNavigate, setPageNavigate] = useState(() => {
    const savedPage = localStorage.getItem('currentPage');
    if (savedPage && savedPage !== 'login') {
      return savedPage;
    }
    return 'login';
  });

  const [isEdit, setIsEdit] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState();

  // Save current page to localStorage whenever it changes
  useEffect(() => {
    if (pageNavigate && pageNavigate !== 'login') {
      localStorage.setItem('currentPage', pageNavigate);
    }
  }, [pageNavigate]);

  // Handle global logout trigger
  useEffect(() => {
    const handleUnauthorized = () => {
      console.log('Unauthorized access detected - redirecting to login');
      setPageNavigate('login');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('currentPage');
    };

    // Listen for the custom unauthorized event
    window.addEventListener('auth:unauthorized', handleUnauthorized);
    
    // Check for forceLogout as before
    if (localStorage.getItem('forceLogout')) {
      handleUnauthorized();
      localStorage.removeItem('forceLogout');
    }

    return () => {
      window.removeEventListener('auth:unauthorized', handleUnauthorized);
    };
  }, []);

  const handleNavigation = (page) => {
    setPageNavigate(page);
    if (page === 'login') {
      localStorage.removeItem('currentPage');
    }
  };

  const renderPage = () => {
    switch (pageNavigate) {
      case 'products-list':
        return <Products setPageNavigate={handleNavigation} />;
      case 'invoice-list':
        return <InvoiceList isEdit={isEdit} setIsEdit={setIsEdit} setPageNavigate={handleNavigation} selectedInvoice={selectedInvoice} setSelectedInvoice={setSelectedInvoice} />;
      case 'new-invoice':
        return <Invoice isEdit={false} setIsEdit={setIsEdit} setPageNavigate={handleNavigation} selectedInvoice={selectedInvoice} setSelectedInvoice={setSelectedInvoice} />;
      case 'edit-invoice':
        return <Invoice isEdit={true} setIsEdit={setIsEdit} setPageNavigate={handleNavigation} selectedInvoice={selectedInvoice} setSelectedInvoice={setSelectedInvoice} />;
      case 'print-invoice':
        return <PrintInvoice setIsEdit={setIsEdit} setPageNavigate={handleNavigation} selectedInvoice={selectedInvoice} setSelectedInvoice={setSelectedInvoice} />;
      case 'settings':
        return <Settings setPageNavigate={handleNavigation} />;
      case 'registration':
        return <Registration setPageNavigate={handleNavigation} />;
      default:
        return <Login setPageNavigate={handleNavigation} />;
    }
  };

  return (
    <div className="h-screen bg-gray-900 flex flex-col overflow-hidden">
      <TitleBar setPageNavigate={handleNavigation} />
      <div className="flex-1 overflow-y-auto ">
        <div className="mt-2 ">
          {renderPage()}
        </div>
      </div>
      <UpdateNotification />
    </div>
  );
};

export default App;