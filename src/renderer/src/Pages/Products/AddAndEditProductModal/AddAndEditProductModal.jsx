// import React, { useState, useEffect } from 'react';

// const AddAndEditProductModal = ({
//   addAndEditProductModal,
//   setAddAndEditProductModal,
//   onSave,
//   selectedProduct,
//   isEditing
// }) => {
//   const [product, setProduct] = useState({
//     productName: '',
//     category: '',
//     stock: 0,
//     salePrice: 0,
//     purchasePrice: 0,
//     description: '',
//     barcode: '',
//     expiryDate: '',
//     medicineInfo: {
//       genericName: '',
//       dosage: '',
//       form: '',
//       uses: [],
//       prescriptionRequired: false,
//       manufacturer: ''
//     }
//   });

//   const [errors, setErrors] = useState({});

//   useEffect(() => {
//     if (isEditing && selectedProduct) {
//       setProduct({
//         productName: selectedProduct.productName || '',
//         category: selectedProduct.category || '',
//         stock: selectedProduct.stock || 0,
//         salePrice: selectedProduct.salePrice || 0,
//         purchasePrice: selectedProduct.purchasePrice || 0,
//         description: selectedProduct.description || '',
//         barcode: selectedProduct.barcode || '',
//         expiryDate: selectedProduct.expiryDate || '',
//         medicineInfo: selectedProduct.medicineInfo || {
//           genericName: '',
//           dosage: '',
//           form: '',
//           uses: [],
//           prescriptionRequired: false,
//           manufacturer: ''
//         }
//       });
//     } else if (!isEditing) {
//       setProduct({
//         productName: '',
//         category: '',
//         stock: 0,
//         salePrice: 0,
//         purchasePrice: 0,
//         description: '',
//         barcode: '',
//         expiryDate: '',
//         medicineInfo: {
//           genericName: '',
//           dosage: '',
//           form: '',
//           uses: [],
//           prescriptionRequired: false,
//           manufacturer: ''
//         }
//       });
//       setErrors({});
//     }
//   }, [isEditing, selectedProduct, addAndEditProductModal]);

//   const validateForm = () => {
//     const newErrors = {};

//     if (!product.productName.trim()) {
//       newErrors.productName = 'Product name is required';
//     }

//     if (product.salePrice <= 0) {
//       newErrors.salePrice = 'Selling price must be greater than 0';
//     }

//     if (product.purchasePrice <= 0) {
//       newErrors.purchasePrice = 'Purchase price must be greater than 0';
//     }

//     if (product.stock < 0) {
//       newErrors.stock = 'Stock cannot be negative';
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setProduct(prev => ({
//       ...prev,
//       [name]: name === 'stock' || name === 'salePrice' || name === 'purchasePrice'
//         ? parseFloat(value) || 0
//         : value
//     }));
//     if (errors[name]) {
//       setErrors(prev => ({ ...prev, [name]: '' }));
//     }
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (validateForm()) {
//       const productData = {
//         productName: product.productName,
//         category: product.category,
//         stock: product.stock,
//         salePrice: product.salePrice,
//         purchasePrice: product.purchasePrice,
//         description: product.description,
//         barcode: product.barcode || undefined,
//         expiryDate: product.expiryDate || undefined,
//         medicineInfo: product.medicineInfo || undefined
//       };
//       onSave(productData);
//     }
//   };
//   const handleReset = () => {
//     setProduct({
//       productName: '',
//       category: '',
//       stock: 0,
//       salePrice: 0,
//       purchasePrice: 0,
//       description: '',
//       barcode: '',
//       expiryDate: '',
//       medicineInfo: {
//         genericName: '',
//         dosage: '',
//         form: '',
//         uses: [],
//         prescriptionRequired: false,
//         manufacturer: ''
//       }
//     });
//   };

//   return (
//     <>


//       <div
//         onClick={(e) => e.stopPropagation()}
//         className="w-full max-w-[400px] bg-white shadow-sm border border-[#E4E4E4] p-2 max-h-[90vh] overflow-y-auto"
//       >
//         <h1 className="text-[24px] font-[500] inter mb-3">
//           {isEditing ? 'Edit Product' : 'Add Product'}
//         </h1>

//         <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
//           <div className="flex w-full md:flex-row flex-col gap-3">
//             <div className="w-full">
//               <label className="text-[12px] font-[500] text-[#939393]">
//                 Product Name <span className="text-red-500">*</span>
//               </label>
//               <input
//                 type="text"
//                 name="productName"
//                 value={product.productName}
//                 onChange={handleChange}
//                 className={`w-full p-1.5 outline-0 bg-[#FFFFFF] text-[#333] border-2 rounded-lg mt-1 ${errors.productName ? 'border-red-500' : 'border-[#E4E4E4]'
//                   }`}
//                 placeholder="Enter product name"
//               />
//               {errors.productName && (
//                 <p className="text-red-500 text-xs mt-1">{errors.productName}</p>
//               )}
//             </div>

//             <div className="w-full">
//               <label className="text-[12px] font-[500] text-[#939393]">Category</label>
//               <input
//                 type="text"
//                 name="category"
//                 value={product.category}
//                 onChange={handleChange}
//                 className="w-full p-1.5 outline-0 bg-[#FFFFFF] text-[#333] border-[#E4E4E4] border-2 rounded-lg mt-1"
//                 placeholder="Enter category"
//               />
//             </div>
//           </div>

//           <div className="flex md:flex-row flex-col gap-3">
//             <div className="flex-1">
//               <label className="text-[12px] font-[500] text-[#939393]">
//                 Stock Quantity <span className="text-red-500">*</span>
//               </label>
//               <input
//                 type="number"
//                 name="stock"
//                 value={product.stock}
//                 onChange={handleChange}
//                 className={`w-full p-1.5 outline-0 bg-[#FFFFFF] text-[#333] border-2 rounded-lg mt-1 ${errors.stock ? 'border-red-500' : 'border-[#E4E4E4]'
//                   }`}
//                 min="0"
//                 step="1"
//               />
//               {errors.stock && (
//                 <p className="text-red-500 text-xs mt-1">{errors.stock}</p>
//               )}
//             </div>

//             <div className="flex-1">
//               <label className="text-[12px] font-[500] text-[#939393]">
//                 Selling Price <span className="text-red-500">*</span>
//               </label>
//               <input
//                 type="number"
//                 name="salePrice"
//                 value={product.salePrice}
//                 onChange={handleChange}
//                 className={`w-full p-1.5 outline-0 bg-[#FFFFFF] text-[#333] border-2 rounded-lg mt-1 ${errors.salePrice ? 'border-red-500' : 'border-[#E4E4E4]'
//                   }`}
//                 min="0"
//                 step="0.01"
//               />
//               {errors.salePrice && (
//                 <p className="text-red-500 text-xs mt-1">{errors.salePrice}</p>
//               )}
//             </div>

//             <div className="flex-1">
//               <label className="text-[12px] font-[500] text-[#939393]">
//                 Purchase Price <span className="text-red-500">*</span>
//               </label>
//               <input
//                 type="number"
//                 name="purchasePrice"
//                 value={product.purchasePrice}
//                 onChange={handleChange}
//                 className={`w-full p-1.5 outline-0 bg-[#FFFFFF] text-[#333] border-2 rounded-lg mt-1 ${errors.purchasePrice ? 'border-red-500' : 'border-[#E4E4E4]'
//                   }`}
//                 min="0"
//                 step="0.01"
//               />
//               {errors.purchasePrice && (
//                 <p className="text-red-500 text-xs mt-1">{errors.purchasePrice}</p>
//               )}
//             </div>
//           </div>
//           <div className="flex md:flex-row flex-col gap-3">
//             <div className="w-full">
//               <label className="text-[12px] font-[500] text-[#939393]">
//                 Stock Quantity <span className="text-red-500">*</span>
//               </label>
//               <input
//                 type="date"
//                 name="expiryDate"
//                 value={product.expiryDate}
//                 onChange={handleChange}
//                 className={`w-full p-1.5 outline-0 bg-[#FFFFFF] text-[#333] border-2 rounded-lg mt-1 ${errors.expiryDate ? 'border-red-500' : 'border-[#E4E4E4]'
//                   }`}
//               />
//               {errors.expiryDate && (
//                 <p className="text-red-500 text-xs mt-1">{errors.expiryDate}</p>
//               )}
//             </div>


//             <div className="w-full">
//               <label className="text-[12px] font-[500] text-[#939393]">Barcode</label>
//               <input
//                 type="text"
//                 name="barcode"
//                 value={product.barcode}
//                 onChange={handleChange}
//                 className="w-full p-1.5 outline-0 bg-[#FFFFFF] text-[#333] border-[#E4E4E4] border-2 rounded-lg mt-1"
//                 placeholder="Optional - Scan or enter barcode"
//               />
//               <p className="text-xs text-gray-500 mt-1">
//                 Barcode must be unique if provided
//               </p>
//             </div>
//           </div>

//           <div className="w-full">
//             <label className="text-[12px] font-[500] text-[#939393]">Product Description</label>
//             <textarea
//               name="description"
//               value={product.description}
//               onChange={handleChange}
//               className="w-full p-1.5 outline-0 bg-[#FFFFFF] text-[#333] border-[#E4E4E4] border-2 rounded-lg mt-1"
//               rows="3"
//               placeholder="Enter product description (optional)"
//             />
//           </div>

//           <div className="flex justify-end mt-5 gap-3">
//             <button
//               type="button"
//               onClick={handleReset}
//               className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition-colors"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//             >
//               {isEditing ? "Update Product" : "Add Product"}
//             </button>
//           </div>
//         </form>
//       </div>


//     </>
//   );
// };

// export default AddAndEditProductModal;

import React, { useState, useEffect } from 'react';

const AddAndEditProductModal = ({
  addAndEditProductModal,
  setAddAndEditProductModal,
  onSave,
  selectedProduct,
  isEditing
}) => {
  const [product, setProduct] = useState({
    productName: '',
    category: '',
    stock: 0,
    salePrice: 0,
    purchasePrice: 0,
    description: '',
    barcode: '',
    expiryDate: '',
    medicineInfo: {
      genericName: '',
      dosage: '',
      batchNo: '',
      form: '',
      uses: '',
      prescriptionRequired: false,
      manufacturer: ''
    }
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (addAndEditProductModal) {
      if (isEditing && selectedProduct) {
        setProduct({
          productName: selectedProduct.productName || '',
          category: selectedProduct.category || '',
          stock: selectedProduct.stock || 0,
          salePrice: selectedProduct.salePrice || 0,
          purchasePrice: selectedProduct.purchasePrice || 0,
          description: selectedProduct.description || '',
          barcode: selectedProduct.barcode || '',
          expiryDate: selectedProduct.expiryDate ? selectedProduct.expiryDate.split('T')[0] : '',
          medicineInfo: {
            genericName: selectedProduct.medicineInfo?.genericName || '',
            dosage: selectedProduct.medicineInfo?.dosage || '',
            batchNo: selectedProduct.medicineInfo?.batchNo || '',
            form: selectedProduct.medicineInfo?.form || '',
            uses: selectedProduct.medicineInfo?.uses?.join(', ') || '',
            prescriptionRequired: selectedProduct.medicineInfo?.prescriptionRequired || false,
            manufacturer: selectedProduct.medicineInfo?.manufacturer || ''
          }
        });
      } else if (!isEditing) {
        setProduct({
          productName: '',
          category: '',
          stock: 0,
          salePrice: 0,
          purchasePrice: 0,
          description: '',
          barcode: '',
          expiryDate: '',
          medicineInfo: {
            genericName: '',
            dosage: '',
            batchNo: '',
            form: '',
            uses: '',
            prescriptionRequired: false,
            manufacturer: ''
          }
        });
        setErrors({});
      }
    }
  }, [isEditing, selectedProduct, addAndEditProductModal]);

  const validateForm = () => {
    const newErrors = {};

    if (!product.productName.trim()) {
      newErrors.productName = 'Product name is required';
    }

    if (product.salePrice <= 0) {
      newErrors.salePrice = 'Selling price must be greater than 0';
    }

    if (product.purchasePrice <= 0) {
      newErrors.purchasePrice = 'Purchase price must be greater than 0';
    }

    if (product.stock < 0) {
      newErrors.stock = 'Stock cannot be negative';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct(prev => ({
      ...prev,
      [name]: name === 'stock' || name === 'salePrice' || name === 'purchasePrice'
        ? parseFloat(value) || 0
        : value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleMedicineInfoChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProduct(prev => ({
      ...prev,
      medicineInfo: {
        ...prev.medicineInfo,
        [name]: type === 'checkbox' ? checked : value
      }
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const productData = {
        productName: product.productName,
        category: product.category,
        stock: product.stock,
        salePrice: product.salePrice,
        purchasePrice: product.purchasePrice,
        description: product.description,
        barcode: product.barcode || undefined,
        expiryDate: product.expiryDate || undefined,
        medicineInfo: {
          genericName: product.medicineInfo.genericName,
          dosage: product.medicineInfo.dosage,
          batchNo: product.medicineInfo.batchNo,
          form: product.medicineInfo.form,
          uses: product.medicineInfo.uses ? product.medicineInfo.uses.split(',').map(u => u.trim()) : [],
          prescriptionRequired: product.medicineInfo.prescriptionRequired,
          manufacturer: product.medicineInfo.manufacturer
        }
      };
      onSave(productData);
    }
  };

  const handleReset = () => {
    setProduct({
      productName: '',
      category: '',
      stock: 0,
      salePrice: 0,
      purchasePrice: 0,
      description: '',
      barcode: '',
      expiryDate: '',
      medicineInfo: {
        genericName: '',
        dosage: '',
        batchNo: '',
        form: '',
        uses: '',
        prescriptionRequired: false,
        manufacturer: ''
      }
    });
    setErrors({});
  };

  const handleClose = () => {
    setAddAndEditProductModal(false);
    handleReset();
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (!addAndEditProductModal) return null;

  return (
    <div
     
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
    >
      <div className='overflow-scroll w-full p-10 h-screen overflow-y-auto"'>
      <div onClick={handleBackdropClick} className=' min-h-screen w-full flex items-center justify-center'>
        <div
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-[950px] relative bg-white shadow-xl  rounded-lg p-6 "
        >
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-[24px] font-[500] ">
            {isEditing ? 'Edit Product' : 'Add Product'}
          </h1>
          {/* Close button */}
          <button
            onClick={handleClose}
            className=" text-gray-200   p-1 rounded-full bg-black flex items-center justify-center hover:text-red-400 text-2xl"

          >
            <svg xmlns="http://www.w3.org/2000/svg" width={30} height={30} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
          </div>


          

          <form className="flex flex-col gap-1.5" onSubmit={handleSubmit}>
            {/* Basic Information */}
            <div className="flex w-full md:flex-row flex-col gap-3">
              <div className="w-full">
                <label className="text-[12px] font-[500] text-[#939393]">
                  Product Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="productName"
                  value={product.productName}
                  onChange={handleChange}
                  className={`w-full p-2 outline-0 bg-[#FFFFFF] text-[#333] border-2 rounded-lg mt-1 ${errors.productName ? 'border-red-500' : 'border-[#E4E4E4]'
                    }`}
                  placeholder="Enter product name"
                />
                {errors.productName && (
                  <p className="text-red-500 text-xs mt-1">{errors.productName}</p>
                )}
              </div>

              <div className="w-full">
                <label className="text-[12px] font-[500] text-[#939393]">Category</label>
                <input
                  type="text"
                  name="category"
                  value={product.category}
                  onChange={handleChange}
                  className="w-full p-2 outline-0 bg-[#FFFFFF] text-[#333] border-[#E4E4E4] border-2 rounded-lg mt-1"
                  placeholder="Enter category"
                />
              </div>
            </div>

            {/* Pricing and Stock */}
            <div className="flex md:flex-row flex-col gap-3">
              <div className="flex-1">
                <label className="text-[12px] font-[500] text-[#939393]">
                  Stock Quantity <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="stock"
                  value={product.stock}
                  onChange={handleChange}
                  className={`w-full p-2 outline-0 bg-[#FFFFFF] text-[#333] border-2 rounded-lg mt-1 ${errors.stock ? 'border-red-500' : 'border-[#E4E4E4]'
                    }`}
                  min="0"
                  step="1"
                />
                {errors.stock && (
                  <p className="text-red-500 text-xs mt-1">{errors.stock}</p>
                )}
              </div>

              <div className="flex-1">
                <label className="text-[12px] font-[500] text-[#939393]">
                  Selling Price <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="salePrice"
                  value={product.salePrice}
                  onChange={handleChange}
                  className={`w-full p-2 outline-0 bg-[#FFFFFF] text-[#333] border-2 rounded-lg mt-1 ${errors.salePrice ? 'border-red-500' : 'border-[#E4E4E4]'
                    }`}
                  min="0"
                  step="0.01"
                />
                {errors.salePrice && (
                  <p className="text-red-500 text-xs mt-1">{errors.salePrice}</p>
                )}
              </div>

              <div className="flex-1">
                <label className="text-[12px] font-[500] text-[#939393]">
                  Purchase Price <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="purchasePrice"
                  value={product.purchasePrice}
                  onChange={handleChange}
                  className={`w-full p-2 outline-0 bg-[#FFFFFF] text-[#333] border-2 rounded-lg mt-1 ${errors.purchasePrice ? 'border-red-500' : 'border-[#E4E4E4]'
                    }`}
                  min="0"
                  step="0.01"
                />
                {errors.purchasePrice && (
                  <p className="text-red-500 text-xs mt-1">{errors.purchasePrice}</p>
                )}
              </div>
            </div>

            {/* Expiry Date and Barcode - Fixed duplicate label */}
            <div className="flex md:flex-row flex-col gap-3">
              <div className="w-full">
                <label className="text-[12px] font-[500] text-[#939393]">
                  Expiry Date
                </label>
                <input
                  type="date"
                  name="expiryDate"
                  value={product.expiryDate}
                  onChange={handleChange}
                  className="w-full p-2 outline-0 bg-[#FFFFFF] text-[#333] border-[#E4E4E4] border-2 rounded-lg mt-1"
                />
              </div>

              <div className="w-full">
                <label className="text-[12px] font-[500] text-[#939393]">Barcode</label>
                <input
                  type="text"
                  name="barcode"
                  value={product.barcode}
                  onChange={handleChange}
                  className="w-full p-2 outline-0 bg-[#FFFFFF] text-[#333] border-[#E4E4E4] border-2 rounded-lg mt-1"
                  placeholder="Optional - Scan or enter barcode"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Barcode must be unique if provided
                </p>
              </div>
            </div>

            {/* Medicine Information Section */}
            <div className="mt-2 p-4 bg-gray-50 rounded-lg border border-[#E4E4E4]">
              <h3 className="text-[16px] font-semibold mb-1.5 text-gray-700">Medicine Information (Optional)</h3>

              <div className="flex md:flex-row flex-col gap-3 mb-1.5">
                <div className="flex-1">
                  <label className="text-[12px] font-[500] text-[#939393]">Generic Name</label>
                  <input
                    type="text"
                    name="genericName"
                    value={product.medicineInfo.genericName}
                    onChange={handleMedicineInfoChange}
                    className="w-full p-2 outline-0 bg-[#FFFFFF] text-[#333] border-[#E4E4E4] border-2 rounded-lg mt-1"
                    placeholder="Enter generic name"
                  />
                </div>

                <div className="flex-1">
                  <label className="text-[12px] font-[500] text-[#939393]">Dosage</label>
                  <input
                    type="text"
                    name="dosage"
                    value={product.medicineInfo.dosage}
                    onChange={handleMedicineInfoChange}
                    className="w-full p-2 outline-0 bg-[#FFFFFF] text-[#333] border-[#E4E4E4] border-2 rounded-lg mt-1"
                    placeholder="e.g., 500mg, 10ml"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-[12px] font-[500] text-[#939393]">Batch No</label>
                  <input
                    type="text"
                    name="batchNo"
                    value={product.medicineInfo.batchNo}
                    onChange={handleMedicineInfoChange}
                    className="w-full p-2 outline-0 bg-[#FFFFFF] text-[#333] border-[#E4E4E4] border-2 rounded-lg mt-1"
                    placeholder="Enter batch number"
                  />
                </div>
              </div>

              <div className="flex md:flex-row flex-col gap-3 mb-1.5">
                <div className="flex-1">
                  <label className="text-[12px] font-[500] text-[#939393]">Form</label>
                  <select
                    name="form"
                    value={product.medicineInfo.form}
                    onChange={handleMedicineInfoChange}
                    className="w-full p-2 outline-0 bg-[#FFFFFF] text-[#333] border-[#E4E4E4] border-2 rounded-lg mt-1"
                  >
                    <option value="">Select form</option>
                    <option value="Tablet">Tablet</option>
                    <option value="Capsule">Capsule</option>
                    <option value="Capsule (Delayed Release)">Capsule (Delayed Release)</option>
                    <option value="Liquid syrup">Liquid syrup</option>
                    <option value="Injection">Injection</option>
                    <option value="Cream">Cream</option>
                    <option value="Patch">Patch</option>
                    <option value="Inhaler">Inhaler</option>
                    <option value="Suppository">Suppository</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="flex-1">
                  <label className="text-[12px] font-[500] text-[#939393]">Manufacturer</label>
                  <input
                    type="text"
                    name="manufacturer"
                    value={product.medicineInfo.manufacturer}
                    onChange={handleMedicineInfoChange}
                    className="w-full p-2 outline-0 bg-[#FFFFFF] text-[#333] border-[#E4E4E4] border-2 rounded-lg mt-1"
                    placeholder="Enter manufacturer name"
                  />
                </div>
              </div>

              <div className="mb-1.5">
                <label className="text-[12px] font-[500] text-[#939393]">Uses (comma-separated)</label>
                <input
                  type="text"
                  name="uses"
                  value={product.medicineInfo.uses}
                  onChange={handleMedicineInfoChange}
                  className="w-full p-2 outline-0 bg-[#FFFFFF] text-[#333] border-[#E4E4E4] border-2 rounded-lg mt-1"
                  placeholder="e.g., Pain relief, Fever, Inflammation"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="prescriptionRequired"
                  checked={product.medicineInfo.prescriptionRequired}
                  onChange={handleMedicineInfoChange}
                  className="w-4 h-4"
                />
                <label className="text-[12px] font-[500] text-[#939393]">
                  Prescription Required
                </label>
              </div>
            </div>

            {/* Description */}
            <div className="w-full">
              <label className="text-[12px] font-[500] text-[#939393]">Product Description</label>
              <textarea
                name="description"
                value={product.description}
                onChange={handleChange}
                className="w-full p-2 outline-0 bg-[#FFFFFF] text-[#333] border-[#E4E4E4] border-2 rounded-lg mt-1"
                rows="3"
                placeholder="Enter product description (optional)"
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-end mt-5  gap-3">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {isEditing ? "Update Product" : "Add Product"}
              </button>
            </div>
          </form>
        </div>

      </div>
      </div>

    </div>
  );
};

export default AddAndEditProductModal;