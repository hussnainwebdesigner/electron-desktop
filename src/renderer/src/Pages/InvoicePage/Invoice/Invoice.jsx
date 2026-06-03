import React, { useState, useEffect, useRef } from 'react';
import deleteIcon from './assets/deleteIcon.png';
import { postInvoiceApi, putInvoiceApi, getSingleInvoiceApi } from '../../../apis/invoiceApi/invoiceApi.js';
import {
  bulkStockUpdateApi,
  getProductByBarcodeApi,
  useProductsApi,
  getSingleProductApi
} from '../../../apis/productApi/productApi.js';

const Invoice = ({ isEdit, setIsEdit, selectedInvoice, setSelectedInvoice, setPageNavigate }) => {
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(false);
  const { allProducts, setAllProducts, fetchProducts: fetchProductsFromApi } = useProductsApi();
  const [showDropdownIndex, setShowDropdownIndex] = useState(null);
  const [searchTerms, setSearchTerms] = useState({});

  const [invoiceData, setInvoiceData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    customerAddress: '',
    subtotal: 0,
    tax: 0,
    discount: 0,
    discountType: 'percentage',
    total: 0,
    paymentMethod: 'cash',
    status: 'paid',
    notes: ''
  });

  const [items, setItems] = useState([
    {
      productId: '',
      productName: '',
      quantity: 1,
      price: 0,
      discount: 0,
      total: 0
    }
  ]);

  const [currentTime, setCurrentTime] = useState(new Date());

  // Flag to track if stock has been deducted for edit mode
  const [hasLoadedStock, setHasLoadedStock] = useState(false);

  // Fetch products on component mount
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      if (fetchProductsFromApi) {
        await fetchProductsFromApi();
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setAllProducts([]);
    }
  };

  // Fetch invoice data when in edit mode
  useEffect(() => {
    if (isEdit && selectedInvoice) {
      fetchInvoiceData();
    }
  }, [isEdit, selectedInvoice]);

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchInvoiceData = async () => {
    try {
      setFetchingData(true);
      const response = await getSingleInvoiceApi(selectedInvoice._id);
      const invoice = response.invoice || response;

      setInvoiceData({
        customerName: invoice.customerName || '',
        customerEmail: invoice.customerEmail || '',
        customerPhone: invoice.customerPhone || '',
        customerAddress: invoice.customerAddress || '',
        subtotal: invoice.subtotal || 0,
        tax: invoice.tax || 0,
        discount: invoice.discount || 0,
        discountType: invoice.discountType || 'percentage',
        total: invoice.total || 0,
        paymentMethod: invoice.paymentMethod || 'cash',
        status: invoice.status || 'paid',
        notes: invoice.notes || ''
      });

      if (invoice.items && invoice.items.length > 0) {
        const formattedItems = invoice.items.map(item => ({
          productId: item.productId?._id || item.productId,
          productName: item.productName,
          quantity: item.quantity,
          price: item.price,
          discount: item.discount || 0,
          total: item.total || (item.price * item.quantity)
        }));
        setItems(formattedItems);
      }

      setHasLoadedStock(true);
    } catch (error) {
      console.error('Error fetching invoice for edit:', error);
      alert('Failed to load invoice data for editing');
      setPageNavigate('invoice-list');
    } finally {
      setFetchingData(false);
    }
  };

  // Calculate totals
  useEffect(() => {
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Calculate item-level discounts
    const itemDiscountTotal = items.reduce((sum, item) => {
      const itemDiscount = item.discount || 0;
      const itemTotal = item.price * item.quantity;
      return sum + (itemTotal * itemDiscount / 100);
    }, 0);

    // Calculate invoice-level discount
    let invoiceDiscountAmount = 0;
    if (invoiceData.discountType === 'percentage') {
      invoiceDiscountAmount = (subtotal * invoiceData.discount) / 100;
    } else {
      invoiceDiscountAmount = invoiceData.discount;
    }

    const totalDiscount = itemDiscountTotal + invoiceDiscountAmount;
    const taxableAmount = subtotal - totalDiscount;
    const taxAmount = taxableAmount * (invoiceData.tax / 100);
    const total = taxableAmount + taxAmount;

    setInvoiceData(prev => ({
      ...prev,
      subtotal,
      total: Math.max(0, total)
    }));
  }, [items, invoiceData.discount, invoiceData.discountType, invoiceData.tax]);

  const handleAddItem = () => {
    setItems([...items, {
      productId: '',
      productName: '',
      quantity: 1,
      price: 0,
      discount: 0,
      total: 0
    }]);
    setShowDropdownIndex(null);
  };

  const handleProductSelect = (index, productId) => {
    const selectedProduct = allProducts.find(p => p._id === productId || p.id === productId);
    if (selectedProduct) {
      const newItems = [...items];
      newItems[index].productId = selectedProduct._id || selectedProduct.id;
      newItems[index].productName = selectedProduct.productName || selectedProduct.name;
      newItems[index].price = selectedProduct.salePrice || selectedProduct.price || 0;
      newItems[index].quantity = newItems[index].quantity || 1;

      const itemTotal = newItems[index].price * newItems[index].quantity;
      const discountAmount = itemTotal * (newItems[index].discount / 100);
      newItems[index].total = itemTotal - discountAmount;

      setItems(newItems);
      setShowDropdownIndex(null);

      // Clear search term for this item
      setSearchTerms(prev => ({ ...prev, [index]: '' }));
    }
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    const numValue = parseFloat(value);

    if (field === 'quantity' || field === 'price' || field === 'discount') {
      newItems[index][field] = isNaN(numValue) ? 0 : Math.max(0, numValue);

      // Cap discount at 100%
      if (field === 'discount' && newItems[index][field] > 100) {
        newItems[index][field] = 100;
      }

      // Cap quantity at reasonable number
      if (field === 'quantity' && newItems[index][field] > 9999) {
        newItems[index][field] = 9999;
      }
    } else {
      newItems[index][field] = value;
    }

    // Recalculate total for this item
    const quantity = newItems[index].quantity || 0;
    const price = newItems[index].price || 0;
    const discount = newItems[index].discount || 0;
    const itemTotal = price * quantity;
    const discountAmount = itemTotal * (discount / 100);
    newItems[index].total = itemTotal - discountAmount;

    setItems(newItems);
  };

  const handleSearchChange = (index, value) => {
    setSearchTerms(prev => ({ ...prev, [index]: value }));
    setShowDropdownIndex(index);
  };

  const handleDeleteItem = (index) => {
    if (items.length === 1) {
      // Reset the first item instead of deleting
      setItems([{
        productId: '',
        productName: '',
        quantity: 1,
        price: 0,
        discount: 0,
        total: 0
      }]);
      setSearchTerms({});
    } else {
      const newItems = items.filter((_, i) => i !== index);
      setItems(newItems);

      // Clean up search terms
      const newSearchTerms = { ...searchTerms };
      delete newSearchTerms[index];
      setSearchTerms(newSearchTerms);
    }
    setShowDropdownIndex(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let processedValue = value;

    if (name === 'discount') {
      const numValue = parseFloat(value);
      processedValue = isNaN(numValue) ? 0 : Math.min(100, Math.max(0, numValue));
    } else if (name === 'tax') {
      const numValue = parseFloat(value);
      processedValue = isNaN(numValue) ? 0 : Math.min(100, Math.max(0, numValue));
    }

    setInvoiceData(prev => ({
      ...prev,
      [name]: processedValue
    }));
  };

  const validateInvoice = () => {
    if (!invoiceData.customerName || !invoiceData.customerName.trim()) {
      alert('Please enter customer name');
      return false;
    }

    const validItems = items.filter(item => item.productId && item.productName && item.price > 0 && item.quantity > 0);
    if (validItems.length === 0) {
      alert('Please add at least one valid product with price and quantity');
      return false;
    }

    for (const item of validItems) {
      if (item.quantity <= 0) {
        alert(`Invalid quantity for ${item.productName}`);
        return false;
      }
      if (item.price <= 0) {
        alert(`Invalid price for ${item.productName}`);
        return false;
      }
    }

    return true;
  };

  const handleSave = async () => {
    if (!validateInvoice()) {
      return;
    }

    try {
      setLoading(true);

      // Get valid items (products with price > 0 and quantity > 0)
      const validItems = items.filter(item => item.productId && item.productName && item.price > 0 && item.quantity > 0);

      if (validItems.length === 0) {
        alert('No valid items to save');
        return;
      }

      // For NEW invoices only: Check stock availability BEFORE creating invoice
      if (!isEdit) {
        // Fetch current product stocks to verify
        for (const item of validItems) {
          // Find the product in allProducts
          const product = allProducts.find(p => p._id === item.productId);

          if (!product) {
            alert(`Product "${item.productName}" not found in inventory`);
            return;
          }

          // Check if enough stock is available
          if (product.stock < item.quantity) {
            alert(`Not enough stock for "${item.productName}". Available: ${product.stock}, Requested: ${item.quantity}`);
            return;
          }
        }
      }

      const invoiceToSave = {
        customerName: invoiceData.customerName.trim(),
        customerEmail: invoiceData.customerEmail?.trim() || '',
        customerPhone: invoiceData.customerPhone?.trim() || '',
        customerAddress: invoiceData.customerAddress?.trim() || '',
        items: validItems.map(item => ({
          productId: item.productId,
          productName: item.productName,
          quantity: item.quantity,
          price: item.price,
          discount: item.discount || 0,
          total: item.price * item.quantity * (1 - (item.discount || 0) / 100)
        })),
        subtotal: invoiceData.subtotal,
        discount: invoiceData.discount,
        discountType: invoiceData.discountType,
        tax: invoiceData.tax,
        total: invoiceData.total,
        paymentMethod: invoiceData.paymentMethod,
        status: invoiceData.status,
        notes: invoiceData.notes?.trim() || ''
      };

      let result;

      if (isEdit && selectedInvoice._id) {
        // For EDIT: Do NOT deduct stock again
        result = await putInvoiceApi(selectedInvoice._id, invoiceToSave);
        alert('Invoice updated successfully!');
        setIsEdit(false);
        setSelectedInvoice(result.invoice || result);
        setPageNavigate('invoice-list');
      } else {
        // For NEW invoice: ONLY create invoice (backend handles stock deduction)
        result = await postInvoiceApi(invoiceToSave);


        alert('Updating stock and Invoice saved successfully!');
        handleRefresh();
        setPageNavigate('invoice-list');
      }

      console.log('Success:', result);
    } catch (error) {
      console.error('Error in invoice operation:', error);
      const errorMessage = error.response?.data?.message || error.message || 'An error occurred';
      alert(`Error: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };


  const handleRefresh = () => {
    setInvoiceData({
      customerName: '',
      customerEmail: '',
      customerPhone: '',
      customerAddress: '',
      subtotal: 0,
      tax: 0,
      discount: 0,
      discountType: 'percentage',
      total: 0,
      paymentMethod: 'cash',
      status: 'paid',
      notes: ''
    });
    setItems([{
      productId: '',
      productName: '',
      quantity: 1,
      price: 0,
      discount: 0,
      total: 0
    }]);
    setSearchTerms({});
    setShowDropdownIndex(null);
  };

  const handleCancel = () => {
    if (isEdit) {
      setPageNavigate('invoice-list');
    } else {
      handleRefresh();
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.product-dropdown-container')) {
        setShowDropdownIndex(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getFilteredProducts = (searchTerm) => {
    if (!searchTerm) return allProducts;
    return allProducts.filter(product => {
      const name = (product.productName || product.name || '').toLowerCase();
      return name.includes(searchTerm.toLowerCase());
    });
  };

  if (fetchingData) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading invoice data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white h-[86vh] overflow-hidden rounded-lg">
      <div className="w-full flex gap-6">
        <div className="flex-1 max-w-6xl mx-auto p-5 h-[730px] overflow-y-auto">
          <div className="w-full mx-auto shadow-lg">
            {/* Header */}
            <div className="bg-gray-800 text-white px-3 py-2 flex justify-between items-center rounded-t-lg">
              <h1 className="text-xl font-bold">
                {isEdit ? 'Edit Invoice' : 'Create New Invoice'}
              </h1>
              <div className="space-x-2">
                <button
                  onClick={handleAddItem}
                  className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-[12px] font-medium transition"
                  type="button"
                >
                  Add Item
                </button>
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-[12px] font-medium transition disabled:opacity-50"
                  type="button"
                >
                  {loading ? 'Saving...' : (isEdit ? 'Update Invoice' : 'Save Invoice')}
                </button>
                <button
                  onClick={handleCancel}
                  className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded text-[12px] font-medium transition"
                  type="button"
                >
                  {isEdit ? 'Cancel' : 'Refresh'}
                </button>
              </div>
            </div>

            {/* Customer Details */}
            <div className="p-2 border-b border-gray-100 bg-white">
              <h2 className="text-lg font-semibold text-gray-800 mb-2">Customer Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Customer Name *
                  </label>
                  <input
                    type="text"
                    name="customerName"
                    value={invoiceData.customerName}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter customer name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Customer Phone
                  </label>
                  <input
                    type="tel"
                    name="customerPhone"
                    value={invoiceData.customerPhone}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Phone number"
                  />
                </div>
              </div>
            </div>

            {/* Items Table */}
            <div className="p-2 bg-white">
              <h2 className="text-lg font-semibold text-gray-800 mb-2">Items</h2>
              <div className="">
                <table className="min-w-full border-separate border-spacing-y-1 text-sm">
                  <thead>
                    <tr>
                      <th className="w-[40%] bg-[#7b7b7b] rounded border border-[#E4E4E4] font-semibold p-0.5 text-white">Product Name</th>
                      <th className="w-[15%] bg-[#7b7b7b] rounded border border-[#E4E4E4] font-semibold p-0.5 text-white">Price</th>
                      <th className="w-[15%] bg-[#7b7b7b] rounded border border-[#E4E4E4] font-semibold p-0.5 text-white">Quantity</th>
                      <th className="w-[15%] bg-[#7b7b7b] rounded border border-[#E4E4E4] font-semibold p-0.5 text-white">Discount %</th>
                      <th className="w-[15%] bg-[#7b7b7b] rounded border border-[#E4E4E4] font-semibold p-0.5 text-white">Total</th>
                      <th className="w-[13%] bg-[#7b7b7b] rounded border border-[#E4E4E4] font-semibold p-0.5 text-white">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item, idx) => (
                      <tr key={idx} className="bg-[#7b7b7b]/20 hover:shadow-[1.4px_1.4px_2px_rgba(20,0,40,30.05)]">
                        <td className="border border-gray-100 px-2 py-1">
                          <div className="relative product-dropdown-container">
                            <input
                              type="text"
                              value={searchTerms[idx] || item.productName || ''}
                              placeholder="Search product..."
                              onFocus={() => setShowDropdownIndex(idx)}
                              onChange={(e) => handleSearchChange(idx, e.target.value)}
                              className="w-full border bg-white rounded px-3 py-1 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {showDropdownIndex === idx && (
                              <div className="absolute z-[999999] mt-1 w-full bg-white border border-gray-200 rounded shadow-lg max-h-60 overflow-y-auto">
                                {getFilteredProducts(searchTerms[idx]).map((product) => (
                                  <div
                                    key={product._id || product.id}
                                    onClick={() => handleProductSelect(idx, product._id || product.id)}
                                    className="px-3 py-2 cursor-pointer hover:bg-blue-50 border-b border-gray-300 last:border-b-0 transition text-sm"
                                  >
                                    <div className="flex justify-between items-center ">
                                      <div className="font-medium">
                                        {product.productName || product.name}
                                      </div>
                                      <div className="flex text-xs text-gray-500 gap-1 items-center ">
                                        <div className="">
                                          Stock: {product.stock} |
                                        </div>
                                        <div className="">
                                           | Price: ${product.salePrice || product.price}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                                {getFilteredProducts(searchTerms[idx]).length === 0 && (
                                  <div className="p-3 text-sm text-gray-500">
                                    No products found
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="border border-gray-100 px-2 py-1">
                          <input
                            type="number"
                            value={item.price}
                            onChange={(e) => handleItemChange(idx, 'price', e.target.value)}
                            className="w-full border rounded bg-white p-1 text-right"
                            placeholder="0.00"
                            step="0.01"
                            min="0"
                          />
                        </td>
                        <td className="border border-gray-100 px-2 py-1">
                          <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => handleItemChange(idx, 'quantity', e.target.value)}
                            className="w-full border rounded bg-white p-1 text-center"
                            placeholder="1"
                            min="1"
                            step="1"
                          />
                        </td>
                        <td className="border border-gray-100 px-2 py-1">
                          <input
                            type="number"
                            value={item.discount}
                            onChange={(e) => handleItemChange(idx, 'discount', e.target.value)}
                            className="w-full border rounded bg-white p-1 text-right"
                            placeholder="0"
                            min="0"
                            max="100"
                            step="1"
                          />
                        </td>
                        <td className="border border-gray-100 px-2 py-1 text-right font-semibold">
                          ${item.total.toFixed(2)}
                        </td>
                        <td className="border border-gray-100 px-2 py-1 text-center">
                          <button
                            onClick={() => handleDeleteItem(idx)}
                            title="Delete"
                            className="text-red-600 hover:text-red-800 font-medium"
                            type="button"
                          >
                            <img src={deleteIcon} alt="Delete" className='w-[17px] h-[17px]' />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-2 text-sm text-gray-600">
                Total Items: {items.filter(item => item.productId && item.productName).length}
              </div>
            </div>

            {/* Invoice Summary & Payment Details */}
            <div className="p-4 bg-gray-50 border-t border-gray-100 rounded-b-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h3 className="text-md font-semibold text-gray-800">Invoice Settings</h3>
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium text-gray-700">Discount Type</label>
                    <select
                      name="discountType"
                      value={invoiceData.discountType}
                      onChange={handleInputChange}
                      className="w-40 border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="percentage">Percentage (%)</option>
                      <option value="fixed">Fixed Amount</option>
                    </select>
                  </div>
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium text-gray-700">
                      {invoiceData.discountType === 'percentage' ? 'Discount (%)' : 'Discount (Amount)'}
                    </label>
                    <input
                      type="number"
                      name="discount"
                      value={invoiceData.discount}
                      onChange={handleInputChange}
                      className="w-40 border border-gray-300 rounded-md px-3 py-1 text-right focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="0"
                      step={invoiceData.discountType === 'percentage' ? "1" : "0.01"}
                      min="0"
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium text-gray-700">Tax (%)</label>
                    <input
                      type="number"
                      name="tax"
                      value={invoiceData.tax}
                      onChange={handleInputChange}
                      className="w-40 border border-gray-300 rounded-md px-3 py-1 text-right focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="0"
                      step="0.1"
                      min="0"
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium text-gray-700">Payment Method</label>
                    <select
                      name="paymentMethod"
                      value={invoiceData.paymentMethod}
                      onChange={handleInputChange}
                      className="w-40 border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="cash">Cash</option>
                      <option value="card">Card</option>
                      <option value="online">Online</option>
                    </select>
                  </div>
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium text-gray-700">Status</label>
                    <select
                      name="status"
                      value={invoiceData.status}
                      onChange={handleInputChange}
                      className="w-40 border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="paid">Paid</option>
                      <option value="unpaid">Unpaid</option>
                      <option value="pending">Pending</option>
                      <option value="refund">Refund</option>
                      <option value="cancel">Cancel</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-md font-semibold text-gray-800">Amount Summary</h3>
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium text-gray-700">Subtotal</label>
                    <div className="w-40 text-right font-medium">
                      ${invoiceData.subtotal.toFixed(2)}
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium text-gray-700">Tax Amount</label>
                    <div className="w-40 text-right">
                      ${((invoiceData.subtotal - (invoiceData.discountType === 'percentage'
                        ? (invoiceData.subtotal * invoiceData.discount / 100)
                        : invoiceData.discount)) * (invoiceData.tax / 100)).toFixed(2)}
                    </div>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                    <label className="text-base font-semibold text-gray-900">Total Amount</label>
                    <div className="w-40 text-right font-bold text-lg text-blue-600">
                      ${invoiceData.total.toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Clock Widget */}
        <div className='w-full max-w-sm my-auto bg-white rounded-lg p-4'>
          <div className="relative">
            <div className="absolute -inset-4 bg-purple-500 rounded-full opacity-20 blur-2xl animate-pulse"></div>
            <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 backdrop-blur-md rounded-2xl shadow-2xl p-8 md:p-12 border border-white/20">
              <div className="text-center">
                <div className="text-5xl font-bold font-mono tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
                  {formatTime(currentTime)}
                </div>
                <div className="mt-4 text-xl text-gray-300 font-medium tracking-wide">
                  {formatDate(currentTime)}
                </div>
                <div className="mt-6 flex justify-center space-x-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-md text-gray-400 uppercase tracking-wider">Live</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Invoice;


