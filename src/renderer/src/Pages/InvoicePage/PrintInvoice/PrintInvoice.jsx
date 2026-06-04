

import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { getSettingsApi } from '../../../apis/settingsApi/settingsApi.js';
import { getSingleInvoiceApi, deleteInvoiceApi } from '../../../apis/invoiceApi/invoiceApi.js';

import arrowLeftIcon from './assets/arrowLeftIcon.png';
import pdfIcon from './assets/pdfIcon.png';
import printer from './assets/printer.png';
import editIcon from './assets/editIcon.png';
import deleteIcon from './assets/deleteIcon.png';
import { toast } from 'react-hot-toast';
import PrinterSettings from './PrinterSettings.jsx';

const PrintInvoice = ({ setIsEdit, setPageNavigate, selectedInvoice, setSelectedInvoice }) => {
  const [invoice, setInvoice] = useState(null);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState({
    pdf: false
  });
  const [error, setError] = useState('');

  const invoiceRef = useRef(null);

  // Fetch invoice data
  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const response = await getSingleInvoiceApi(selectedInvoice._id);
        setInvoice(response.invoice || response);
      } catch (error) {
        console.error('Error fetching invoice:', error);
        setError('Error fetching invoice');
        toast.error('Failed to load invoice');
      } finally {
        setLoading(false);
      }
    };
    if (selectedInvoice?._id) {
      fetchInvoice();
    }
  }, [selectedInvoice?._id]);

  // Fetch settings
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await getSettingsApi();
        if (response.success) {
          setSettings(response.settings);
        }
      } catch (err) {
        console.error('Error fetching settings:', err);
      }
    };
    fetchSettings();
  }, []);

  // Calculate item totals
  const processedItems = useMemo(() => {
    if (!invoice?.items) return [];
    return invoice.items.map(item => ({
      ...item,
      total: item.total || (item.price * item.quantity)
    }));
  }, [invoice?.items]);

  // Calculations
  const subtotal = useMemo(() => {
    return invoice?.subtotal || processedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }, [processedItems, invoice?.subtotal]);

  const discountAmount = useMemo(() => {
    if (invoice?.discountType === 'percentage') {
      return (subtotal * (invoice?.discount || 0)) / 100;
    } else if (invoice?.discountType === 'fixed') {
      return invoice?.discount || 0;
    }
    return 0;
  }, [subtotal, invoice?.discount, invoice?.discountType]);

  const total = invoice?.total || (subtotal - discountAmount + (invoice?.tax || 0));

  // Formatting functions
  const formatDate = useCallback((dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-PK');
  }, []);

  const formatTime = useCallback((dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-PK');
  }, []);

  const formatCurrency = useCallback((amount) => {
    return new Intl.NumberFormat('en-PK', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(amount || 0);
  }, []);

  // Number to words conversion
  const numberToWords = useCallback((num) => {
    if (!num && num !== 0) return 'Zero only';

    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];

    const convertHundreds = (n) => {
      if (n === 0) return '';
      if (n < 10) return ones[n];
      if (n < 20) return teens[n - 10];
      if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + ones[n % 10] : '');
      return ones[Math.floor(n / 100)] + ' Hundred' + (n % 100 !== 0 ? ' ' + convertHundreds(n % 100) : '');
    };

    const rupees = Math.floor(num);
    const paisa = Math.round((num - rupees) * 100);

    let words = '';
    if (rupees >= 100000) {
      const lakhs = Math.floor(rupees / 100000);
      const remainder = rupees % 100000;
      words = convertHundreds(lakhs) + ' Lakh' + (remainder ? ' ' + convertHundreds(remainder) : '');
    } else if (rupees >= 1000) {
      const thousands = Math.floor(rupees / 1000);
      const remainder = rupees % 1000;
      words = convertHundreds(thousands) + ' Thousand' + (remainder ? ' ' + convertHundreds(remainder) : '');
    } else {
      words = convertHundreds(rupees);
    }

    words = words + ' Only';
    if (paisa > 0) {
      words += ` And ${convertHundreds(paisa)} Paisa Only`;
    }
    return words;
  }, []);

  const handleThermalPrint = async () => {
    const printContent = invoiceRef.current;
    if (!printContent) {
      toast.error('No content to print');
      return;
    }

    // Check if running in Electron
    const isElectron = !!(window.electronAPI && window.electronAPI.printThermalInvoice);

    // Helper function to escape HTML special characters
    const escapeHtml = (text) => {
      if (!text) return '';
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    };

    // Helper function for safe number handling
    const safeNumber = (value) => {
      const num = parseFloat(value);
      return isNaN(num) ? 0 : num;
    };

    // Get the HTML content optimized for thermal printer
    const thermalHTML = `
  <!DOCTYPE html>
  <html>
  <head>
    <title>Invoice ${invoice?.invoiceNumber || ''}</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      
      body {
        font-family: 'Courier New', monospace;
        margin: 0;
        display: flex;
        justify-content: center;
        padding: 2mm;
        background: white;
        font-size: 11px;
      }
      
      .invoice-thermal {
        width: 100mm;
        margin: 0 auto;
        padding: 3mm;
        background: white;
      }
      
      /* Header Styles */
       .header {
            text-align: center;
            margin-bottom: 10px;
            padding: 30px 20px  20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
          }
          .shop-name {
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 3px;
          }
          .shop-details {
            font-size: 12px;
            opacity: 0.95;
            line-height: 1.4;
          }
          .invoice-title {
            font-size: 14px;
            font-weight: bold;
            text-align: center;
            margin: 4px 0;
            color: #333;
          }
      
      .info-section {
            display: flex;
            justify-content: space-between;
            margin: 6px auto;
            padding: 4px;

            width: 100%;
            background: #f8f9fa;
            border-radius: 1px;
          }
          .info-group {
            font-size: 10px;
          }
          .info-group div {
            margin-bottom: 4px;
          }
          .info-label {
            font-weight: bold;
            color: #555;
            display: inline-block;
          }
      
      /* Items Table */
      .items-table {
        width: 100%;
        margin: 8px 0;
        border-collapse: collapse;
        font-size: 9px;
      }
      
      .items-table th,
      .items-table td {
        border: 0.5px solid #000;
        padding: 4px;
        text-align: left;
        vertical-align: top;
      }
      
      .items-table th {
        font-weight: bold;
        text-align: center;
        background-color: #f0f0f0;
      }
      
      .text-right {
        text-align: right;
      }
      .text-center {
        text-align: center;
      }
      
      /* Totals Section */
      .totals-section-main {
        width: 100%;
        display: flex;
        justify-content: flex-end;
        align-items: center;
      }
      .totals-section {
        max-width: 350px;
        margin: 8px 0;
        padding: 6px;
        border: 0.5px solid #000;
        font-size: 9px;
      }
      
      .totals-row {
        display: flex;
        justify-content: space-between;
        margin-bottom: 3px;
      }
      
      .grand-total {
        font-weight: bold;
        font-size: 11px;
        border-top: 1px solid #000;
        margin-top: 4px;
        padding-top: 4px;
      }
      
      /* Notes Section */
      .notes-section {
        margin: 8px 0;
        padding: 6px;
        border: 0.5px solid #000;
        font-size: 8px;
        line-height: 1.3;
      }
      
      .notes-title {
        font-weight: bold;
        margin-bottom: 4px;
        text-decoration: underline;
      }
      
      /* Barcode */
      .barcode {
        text-align: center;
        margin: 8px 0;
        padding: 4px;
        font-family: 'Courier New', monospace;
        font-size: 12px;
        letter-spacing: 2px;
        border-top: 1px dashed #000;
        border-bottom: 1px dashed #000;
      }
      
      /* Footer */
      .footer {
        margin-top: 10px;
        padding-top: 8px;
        text-align: center;
        font-size: 8px;
        border-top: 1px dashed #000;
      }
      
      .cut-divider {
        margin: 6px 0;
        letter-spacing: 2px;
        font-size: 9px;
      }
      
      /* Status Styles */
      .status-paid {
        font-weight: bold;
      }
      
      .status-pending {
        font-weight: bold;
      }
      
      /* Print Styles */
      @media print {
        body {
          margin: 0;
          padding: 0;
        }
        
        @page {
          size: 80mm auto;
          margin: 0mm;
        }
        
        .invoice-thermal {
         width: 100mm;
          margin: 0;
          padding: 2mm;
        }
        
        /* Force borders to print */
        .items-table th,
        .items-table td,
        .info-section,
        .totals-section,
        .notes-section {
          border-color: #000 !important;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
        
        /* Keep background colors for headers */
        .items-table th {
          background-color: #f0f0f0 !important;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
      }
    </style>
  </head>
  <body>
    <div class="invoice-thermal">
      <!-- Header -->
      <div class="header">
        <div class="shop-name">${escapeHtml(settings?.shopName) || 'MY SHOP'}</div>
        <div class="shop-details">${escapeHtml(settings?.shopAddress) || 'Shop Address'}</div>
        ${settings?.phoneNumber ? `<div class="shop-details">Phone: ${escapeHtml(settings.phoneNumber)}</div>` : ''}
        ${settings?.licenseNo ? `<div class="shop-details">License No: ${escapeHtml(settings.licenseNo)}</div>` : ''}
      </div>
      
      <div class="invoice-title">INVOICE</div>
      
      <!-- Invoice Details -->
     
        <div class="info-section">
            <div class="info-group">
              <div><span class="info-label">Invoice No:</span> ${invoice?.invoiceNumber || 'N/A'}</div>
              <div><span class="info-label">Date:</span> ${formatDate(invoice?.createdAt)}</div>
              <div><span class="info-label">Time:</span> ${formatTime(invoice?.createdAt)}</div>
            </div>
            <div class="info-group">
              <div><span class="info-label">Customer:</span> ${escapeHtml(invoice.customerName)}</div>
              <div><span class="info-label">Phone:</span> ${escapeHtml(invoice.customerPhone || 'N/A')}</div>
              ${invoice.customerEmail ? `<div><span class="info-label">Email:</span> ${escapeHtml(invoice.customerEmail)}</div>` : ''}
              <div><span class="info-label">Status:</span> <strong style="color: ${invoice.status === 'paid' ? '#28a745' : '#dc3545'}">${(invoice.status || 'Paid').toUpperCase()}</strong></div>
            </div>
          </div>
      <!-- Items Table -->
      <table class="items-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Item Name</th>
            <th class="text-right">Price</th>
            <th class="text-right">Qty</th>
            <th class="text-right">Disc%</th>
            <th class="text-right">Total</th>
          </tr>
        </thead>
        <tbody>
          ${processedItems.map((item, index) => `
          <tr>
            <td class="text-right">${index + 1}</td>
            <td style="word-break: break-word;">${escapeHtml(item.productName.substring(0, 25))}${item.productName.length > 25 ? '...' : ''}</td>
            <td class="text-center">${formatCurrency(item.price)}</td>
            <td class="text-center">${item.quantity}</td>
            <td class="text-center">${item.discount || 0}%</td>
            <td class="text-center">${formatCurrency(item.price * item.quantity)}</td>
          </tr>
          `).join('')}
        </tbody>
       </table>
      
      <!-- Totals -->
      <div class="totals-section-main">
        <div class="totals-section">
          <div class="totals-row">
            <span>Subtotal:</span>
            <span>${formatCurrency(subtotal)}</span>
          </div>
          ${safeNumber(invoice?.discount) > 0 ? `
          <div class="totals-row">
            <span>Discount ${invoice?.discountType === 'percentage' ? '(' + invoice?.discount + '%)' : '(Fixed)'}:</span>
            <span>-${formatCurrency(discountAmount)}</span>
          </div>
          ` : ''}
          ${safeNumber(invoice?.tax) > 0 ? `
          <div class="totals-row">
            <span>Tax ${invoice?.taxRate ? '(' + invoice?.taxRate + '%)' : ''}:</span>
            <span>+${formatCurrency(invoice?.tax)}</span>
          </div>
          ` : ''}
          <div class="totals-row grand-total">
            <span>TOTAL AMOUNT:</span>
            <span><strong>${formatCurrency(total)}</strong></span>
          </div>
          <div class="totals-row">
            <span>Payment:</span>
            <span>${invoice?.paymentMethod?.toLowerCase() || 'cash'}</span>
          </div>
          ${invoice?.cashReceived ? `
          <div class="totals-row">
            <span>Cash Received:</span>
            <span>${formatCurrency(invoice.cashReceived)}</span>
          </div>
          <div class="totals-row">
            <span>Change:</span>
            <span>${formatCurrency(invoice.cashReceived - total)}</span>
          </div>
          ` : ''}
        </div>
      </div>
      
      <!-- Notes -->
      
      <div class="notes-section">
        <div class="notes-title">Amount in Words:</div>
        <div>${escapeHtml(numberToWords(total))}</div>
      </div>
     
      
    
      ${settings?.notes || invoice?.notes ? `
      <div class="notes-section">
        <div class="notes-title">Notes:</div>
        <div>${escapeHtml(settings?.notes || invoice?.notes)}</div>
      </div>
      ` : ''}
      
      <!-- Barcode/Invoice Number -->
      <div class="barcode">
        *${invoice?.invoiceNumber || '000000'}*
      </div>
      
      <!-- Footer -->
      <div class="footer">
        <div style="margin: 4px 0;">*** Goods once sold cannot be returned ***</div>
        ${settings?.additionalNotes ? `<div style="margin: 2px 0;">${escapeHtml(settings.additionalNotes)}</div>` : ''}
        <div class="cut-divider">- - - - - - - - - - - - - - - -</div>
        <div>Software Design and Developed by ${escapeHtml(settings?.developerName || 'Hussain')}</div>
      </div>
    </div>
    <script src="https://cdn.jsdelivr.net/npm/jsbarcode@3.11.5/dist/JsBarcode.all.min.js"></script>
    <script>
      (function() {
       function generateBarcode() {

    try {

      JsBarcode("#barcode", "${invoice?.invoiceNumber || '000000'}", {
        format: "CODE128",
        width: 1.5,
        height: 40,
        displayValue: false,
        margin: 0
      });

    } catch (error) {
      console.error("Barcode Error:", error);
    }

  }
    
        function printInvoice() {
          window.focus();
          window.print();
          
          // Close window after printing (for web browsers)
          ${!isElectron ? `
          window.onafterprint = function() {
            setTimeout(function() {
              window.close();
            }, 1000);
          };
          ` : ''}
        }
        
        // Small delay to ensure everything is rendered
        setTimeout(printInvoice, 500);
      })();
    </script>
  </body>
  </html>
`;
    if (isElectron) {
      // Show loading toast
      const loadingToast = toast.loading('Preparing print job...');

      try {
        // Get printer settings from localStorage
        const printerName = localStorage.getItem('selectedPrinter');
        const silentPrinting = localStorage.getItem('silentPrinting') === 'true';

        // Setup cleanup function for listeners
        let cleanupSuccess, cleanupError;

        // Create promise for print operation
        const printPromise = new Promise((resolve, reject) => {
          // Setup success handler
          cleanupSuccess = window.electronAPI.onPrintSuccess(() => {
            resolve({ success: true });
          });

          // Setup error handler
          cleanupError = window.electronAPI.onPrintError((event, error) => {
            reject(new Error(error || 'Print failed'));
          });

          // Send print job
          const printData = {
            html: thermalHTML,
            printerName: printerName || null,
            copies: 1,
            silent: silentPrinting
          };

          window.electronAPI.printThermalInvoice(printData).catch(reject);
        });

        // Wait for print to complete
        await printPromise;

        // Dismiss loading and show success
        toast.dismiss(loadingToast);
        toast.success('Print job sent successfully to thermal printer');

      } catch (error) {
        console.error('Print error:', error);
        toast.dismiss(loadingToast);
        toast.error(`Print failed: ${error.message || 'Unknown error'}`);
      } finally {
        // Cleanup listeners
        if (cleanupSuccess) cleanupSuccess();
        if (cleanupError) cleanupError();
      }
    } else {
      // Web browser fallback
      try {
        const printWindow = window.open('', '_blank', 'width=400,height=600,toolbar=yes,menubar=yes,scrollbars=yes');
        if (printWindow) {
          printWindow.document.write(thermalHTML);
          printWindow.document.close();
          printWindow.focus();
          toast.success('Print window opened. Select your thermal printer.');
        } else {
          toast.error('Please allow popups for this site');
        }
      } catch (error) {
        console.error('Failed to open print window:', error);
        toast.error('Failed to open print window');
      }
    }
  };

  // 📥 DOWNLOAD AS PDF
  const handleDownloadPDF = useCallback(async () => {
    if (!invoice?._id) {
      toast.error('Invoice ID not found');
      return;
    }

    setDownloading(prev => ({ ...prev, pdf: true }));

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://pharmacy-db-software-server.vercel.app/api/accounting-software/invoices/${invoice._id}/pdf`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `invoice_${invoice.invoiceNumber || invoice._id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success('PDF downloaded successfully');
    } catch (error) {
      console.error('Error downloading PDF:', error);
      toast.error('Failed to download PDF. Please try again.');
    } finally {
      setDownloading(prev => ({ ...prev, pdf: false }));
    }
  }, [invoice]);

  // ✏️ EDIT INVOICE
  const handleEdit = useCallback(() => {
    setPageNavigate('edit-invoice');
    setSelectedInvoice(invoice);
    setIsEdit(true);
  }, [setSelectedInvoice, setIsEdit, invoice]);

  // 🗑️ DELETE INVOICE
  const handleDelete = useCallback(async () => {
    if (window.confirm('Are you sure you want to delete this invoice?')) {
      try {
        await deleteInvoiceApi(selectedInvoice._id);
        toast.success('Invoice deleted successfully');
        setPageNavigate('invoice-list');
      } catch (error) {
        console.error('Error deleting invoice:', error);
        toast.error('Failed to delete invoice');
      }
    }
  }, [selectedInvoice, setPageNavigate]);

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading invoice...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="text-center text-red-600">
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <section className='w-full p-4'>
      <div className='w-full bg-white rounded-lg shadow-xl overflow-y-auto'>
        {/* Action Buttons */}
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 no-print">
          <div className="flex justify-between items-center flex-wrap gap-3">
            <button
              onClick={() => {
                setPageNavigate('invoice-list');
                setSelectedInvoice(null);
              }}
              className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <img src={arrowLeftIcon} alt="Back" className="h-4 w-7 mr-2" />
              Back to Invoices
            </button>

            <div className="flex space-x-2 flex-wrap gap-2">
              {/* Thermal Print Button */}
              <button
                onClick={handleThermalPrint}
                className="inline-flex items-center p-2 bg-purple-500 text-white rounded-lg hover:bg-purple-700 transition-colors shadow-md"
              >
                <span className="inline-flex items-center p-1 bg-purple-200 rounded-full text-xs mr-2">
                  <img src={printer} alt="Thermal Print" className="h-5 w-5" />
                </span>
                Thermal Print Invoice
              </button>

              {/* PDF Download Button */}
              <button
                onClick={handleDownloadPDF}
                disabled={downloading.pdf}
                className="inline-flex items-center p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {downloading.pdf ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                    Generating...
                  </>
                ) : (
                  <>
                    <span className="inline-flex items-center p-1 bg-red-300 rounded-full text-xs mr-2">
                      <img src={pdfIcon} alt="PDF" className="h-5 w-5" />
                    </span>
                    PDF Invoice
                  </>
                )}
              </button>

              {/* Printer Settings Button */}
              <PrinterSettings />

              {/* Edit Button */}
              <button
                onClick={handleEdit}
                className="inline-flex items-center p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <span className="inline-flex items-center p-1 bg-blue-200 rounded-full text-xs mr-2">
                  <img src={editIcon} alt="Edit" className="h-5 grayscale brightness-0 w-5" />
                </span>
                Edit Invoice
              </button>

              {/* Delete Button */}
              <button
                onClick={handleDelete}
                className="inline-flex items-center p-2 bg-red-400 text-white rounded-lg hover:bg-red-400 transition-colors"
              >
                <span className="inline-flex items-center p-1 bg-red-200 rounded-full text-xs mr-2">
                  <img src={deleteIcon} alt="Delete" className="h-5 w-5" />
                </span>
                Delete Invoice
              </button>
            </div>
          </div>
        </div>

        {/* Invoice Content - Regular View */}
        <div className="h-145 overflow-y-auto bg-white p-8">
          <div ref={invoiceRef} className="max-w-4xl mx-auto bg-white p-8">
            {/* Regular invoice content */}
            <div className="text-center border-b-2 border-gray-300 pb-4 mb-4">
              <h1 className="text-3xl font-bold text-blue-600">{settings?.shopName || 'Shop Name'}</h1>
              <p className="text-sm text-gray-600 mt-1">{settings?.shopAddress || 'Shop Address'}</p>
              <div className="flex justify-center gap-6 text-xs text-gray-500 mt-2">
                <span>License No: {settings?.licenseNo || '_________'}</span>
              </div>
              <div className="flex justify-center gap-6 text-xs text-gray-500 mt-2">
                <span>Phone No: {settings?.phoneNumber || '________'}</span>
              </div>
            </div>
            <div className="border-b border-gray-200 mb-4">
              <h2 className="text-2xl font-semibold text-center py-2">INVOICE</h2>
            </div>
            {/* Invoice Details Grid */}
            <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg mb-6">
              <div className="space-y-2">
                <div className="flex">
                  <span className="font-semibold w-24">Inv No:</span>
                  <span>{invoice?.invoiceNumber || 'N/A'}</span>
                </div>
                <div className="flex">
                  <span className="font-semibold w-24">Date:</span>
                  <span>{formatDate(invoice?.createdAt) || formatDate(invoice?.updatedAt)}</span>
                </div>
                <div className="flex">
                  <span className="font-semibold w-24">Time:</span>
                  <span>{formatTime(invoice?.createdAt) || formatTime(invoice?.updatedAt)}</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex">
                  <span className="font-semibold w-24">Due Date:</span>
                  <span>{formatDate(invoice?.dueDate)}</span>
                </div>
                <div className="flex">
                  <span className="font-semibold w-24">Status:</span>
                  <span className={`capitalize font-medium ${invoice?.status === 'paid' ? 'text-green-600' : 'text-red-600'}`}>
                    {invoice?.status || 'N/A'}
                  </span>
                </div>
              </div>
            </div>

            {/* Items Table */}
            <div className="overflow-x-auto mb-6">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100 border-b-2 border-gray-300">
                    <th className="text-left py-3 px-3 font-semibold text-sm">Items Name</th>
                    <th className="text-right py-3 px-3 font-semibold text-sm">Rate</th>
                    <th className="text-center py-3 px-3 font-semibold text-sm">QTY</th>
                    <th className="text-center py-3 px-3 font-semibold text-sm">Disc %</th>
                    <th className="text-right py-3 px-3 font-semibold text-sm">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {processedItems.length > 0 ? (
                    processedItems.map((item, index) => (
                      <tr key={item._id || index} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-2 px-3 text-sm text-gray-800">{item.productName}</td>
                        <td className="text-right py-2 px-3 text-sm">{formatCurrency(item.price)}</td>
                        <td className="text-center py-2 px-3 text-sm">{item.quantity}</td>
                        <td className="text-center py-2 px-3 text-sm">{item.discount || 0}%</td>
                        <td className="text-right py-2 px-3 text-sm font-medium">
                          {formatCurrency(item.price * item.quantity)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center py-4 text-gray-500">
                        No items found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Summary Section */}
            <div className="flex justify-end mb-6">
              <div className="w-80 space-y-2">
                <div className="flex justify-between py-1">
                  <span className="font-medium">Subtotal:</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                {invoice?.discount > 0 && (
                  <div className="flex justify-between py-1 border-b border-gray-200">
                    <span className="font-medium">Discount:</span>
                    <span>
                      {invoice?.discountType === 'percentage'
                        ? `${invoice?.discount}%`
                        : formatCurrency(invoice?.discount)}
                    </span>
                  </div>
                )}
                {invoice?.tax > 0 && (
                  <div className="flex justify-between py-1">
                    <span className="font-medium">Tax:</span>
                    <span>{formatCurrency(invoice?.tax)}</span>
                  </div>
                )}
                <div className="flex justify-between py-2 text-lg font-bold border-t-2 border-gray-300 pt-2">
                  <span>Total:</span>
                  <span className="text-blue-600">{formatCurrency(total)}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="font-medium">Payment:</span>
                  <span className="capitalize">{invoice?.paymentMethod || 'N/A'}</span>
                </div>
                {invoice?.cashReceived && (
                  <>
                    <div className="flex justify-between py-1">
                      <span className="font-medium">Cash Received:</span>
                      <span>{formatCurrency(invoice.cashReceived)}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="font-medium">Change:</span>
                      <span>{formatCurrency(invoice.cashReceived - total)}</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Amount in Words */}
            <div className="mb-6">
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                <span className="font-semibold">Amount in Words: </span>
                <span className="text-gray-700">{numberToWords(total)}</span>
              </div>
            </div>

            {/* Notes Section */}
            <div className="border-t border-gray-200 pt-4">
              <div className="notes bg-gray-50 p-3 rounded-lg border border-gray-200 mb-4">
                <h3 className="font-bold text-sm mb-2">Note:</h3>
                <p className="text-xs text-gray-600">
                  {settings?.notes}
                </p>
              </div>

              <div className="bg-gray-100 p-2 rounded-lg border border-gray-200 text-center my-4 font-mono">
                *{invoice?.invoiceNumber}*
              </div>

              <div className="text-center border-t border-gray-200 pt-4 text-xs text-gray-500 mt-4">
                <p>{settings?.additionalNotes}</p>
                <div className="cut-divider my-2">- - - - - - - - - - - - - - - -</div>
                <p>** Goods once sold cannot be returned **</p>
                <p className='mt-1'>Software Design and Developed by Hussnain</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PrintInvoice;