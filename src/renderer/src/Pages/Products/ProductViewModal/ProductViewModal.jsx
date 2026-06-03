





import React from "react";

const ProductViewModal = ({
  selectedProduct,
  productViewModal,
  setProductViewModal,
}) => {
  if (!productViewModal || !selectedProduct) return null;

  const stockColor =
    selectedProduct.stock < 10
      ? "bg-red-500"
      : selectedProduct.stock < 50
      ? "bg-orange-500"
      : "bg-green-500";

  const stockText =
    selectedProduct.stock < 10
      ? "Low Stock"
      : selectedProduct.stock < 50
      ? "Medium Stock"
      : "In Stock";

  const XIcon = ({ size = 20 }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );

  const PackageIcon = ({ size = 35 }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 8a2 2 0 0 0-1-1.73L13 2.27a2 2 0 0 0-2 0L4 6.27A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
    </svg>
  );

  const CalendarIcon = ({ size = 18 }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );

  const BarcodeIcon = ({ size = 18 }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <rect x="2" y="4" width="1" height="16" />
      <rect x="5" y="4" width="2" height="16" />
      <rect x="9" y="4" width="1" height="16" />
      <rect x="12" y="4" width="2" height="16" />
      <rect x="16" y="4" width="1" height="16" />
      <rect x="19" y="4" width="3" height="16" />
    </svg>
  );

  const TagIcon = ({ size = 18 }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20.59 13.41 11 3H4v7l9.59 9.59a2 2 0 0 0 2.82 0l4.18-4.18a2 2 0 0 0 0-2.82Z" />
      <circle cx="7.5" cy="7.5" r="1.5" />
    </svg>
  );

  const DollarIcon = ({ size = 18 }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H7" />
    </svg>
  );

  const BoxesIcon = ({ size = 18 }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="8" height="8" />
      <rect x="13" y="3" width="8" height="8" />
      <rect x="8" y="13" width="8" height="8" />
    </svg>
  );

  const PillIcon = ({ size = 18 }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M16.5 3.5L20.5 7.5" />
      <path d="M3.5 16.5L7.5 20.5" />
      <circle cx="12" cy="12" r="9" />
      <line x1="12" y1="3" x2="12" y2="21" />
    </svg>
  );

  const SyringeIcon = ({ size = 18 }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 6L6 18" />
      <path d="M6 6l12 12" />
      <path d="M22 2L15 9" />
      <path d="M2 22l7-7" />
    </svg>
  );

  const BuildingIcon = ({ size = 18 }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="4" y="2" width="16" height="20" rx="2" />
      <line x1="8" y1="6" x2="16" y2="6" />
      <line x1="8" y1="10" x2="16" y2="10" />
      <line x1="8" y1="14" x2="12" y2="14" />
    </svg>
  );

  const AlertIcon = ({ size = 18 }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <circle cx="12" cy="16" r="0.5" fill="currentColor" />
    </svg>
  );

  return (
    <div
       className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={() => setProductViewModal(false)}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-6xl bg-white rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-blue-500 p-4 text-white relative">
          <button
            onClick={() => setProductViewModal(false)}
            className="absolute top-4 right-4 bg-gray-700 hover:bg-gray-800 rounded-full p-2 transition "
          >
            <XIcon size={20} />
          </button>

          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-2.5 rounded-2xl backdrop-blur-sm">
              <PackageIcon size={35} />
            </div>

            <div>
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold">
                {selectedProduct.productName}     
              </h2>
                <span className="bg-red-500/20 px-3 py-1 rounded-full text-[15px] backdrop-blur-sm">
                  {selectedProduct._id.slice().toLowerCase()}
                </span>
          </div>

              

              <div className="flex gap-3 mt-2 flex-wrap">
                <span className="bg-white/20 px-3 py-1 rounded-full text-sm backdrop-blur-sm">
                  {selectedProduct.category || "Uncategorized"}
                </span>

                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm ${
                    selectedProduct.stock < 10
                      ? "bg-red-500"
                      : selectedProduct.stock < 50
                      ? "bg-orange-500"
                      : "bg-green-500"
                  }`}
                >
                  {stockText}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[80vh]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Product Information */}
            <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
              <h3 className="font-bold text-lg mb-4 text-gray-800 border-b pb-2">
                Product Information
              </h3>

              <div className="space-y-3">
                <InfoCard
                  icon={<TagIcon size={18} />}
                  label="Category"
                  value={selectedProduct.category || "N/A"}
                />

                <InfoCard
                  icon={<BarcodeIcon size={18} />}
                  label="Barcode"
                  value={selectedProduct.barcode || "N/A"}
                />

                <InfoCard
                  icon={<CalendarIcon size={18} />}
                  label="Expiry Date"
                  bgColor="bg-red-500"
                  textColor="text-white"
                  value={
                    selectedProduct.expiryDate
                      ? new Date(
                          selectedProduct.expiryDate
                        ).toLocaleDateString()
                      : "N/A"
                  }
                />

                <InfoCard
                  icon={<BoxesIcon size={18} />}
                  label="Stock Quantity"
                  value={selectedProduct.stock || 0}
                />

                <div>
                  <p className="text-sm font-medium mb-2 text-gray-600">
                    Stock Level
                  </p>

                  <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`${stockColor} h-full transition-all duration-700`}
                      style={{
                        width: `${Math.min(
                          (selectedProduct.stock / 200) * 100,
                          100
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
              <h3 className="font-bold text-lg mb-4 text-gray-800 border-b pb-2">
                Pricing Details
              </h3>

              <div className="space-y-3">
                <div className="bg-green-50 border border-green-200 p-3 rounded-xl">
                  <div className="flex items-center gap-2 text-green-700">
                    <DollarIcon size={18} />
                    <span className="font-medium">Sale Price</span>
                  </div>

                  <h2 className="text-2xl font-bold text-green-600 mt-1.5">
                    Rs.{Number(selectedProduct.salePrice || 0).toFixed(2)}
                  </h2>
                </div>

                <div className="bg-blue-50 border border-blue-200 p-3 rounded-xl">
                  <div className="flex items-center gap-2 text-blue-700">
                    <DollarIcon size={18} />
                    <span className="font-medium">Purchase Price</span>
                  </div>

                  <h2 className="text-2xl font-bold text-blue-600 mt-1.5">
                    Rs.{Number(selectedProduct.purchasePrice || 0).toFixed(2)}
                  </h2>
                </div>

                <div className="bg-purple-50 border border-purple-200 p-3 rounded-xl">
                  <p className="text-purple-700 font-medium">
                    Estimated Profit
                  </p>

                  <h2 className="text-2xl font-bold text-purple-600 mt-1.5">
                    Rs.
                    {(
                      (selectedProduct.salePrice || 0) -
                      (selectedProduct.purchasePrice || 0)
                    ).toFixed(2)}
                  </h2>
                </div>
              </div>
            </div>
          </div>

          {/* Medicine Information Section - New */}
          {selectedProduct.medicineInfo && (
            <div className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-5 border border-blue-200">
              <h3 className="font-bold text-lg mb-4 text-gray-800 flex items-center gap-2">
                <PillIcon size={20} />
                Medicine Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedProduct.medicineInfo.genericName && (
                  <div className="bg-white rounded-xl p-3 shadow-sm">
                    <p className="text-xs text-gray-500 mb-1">Generic Name</p>
                    <p className="font-semibold text-gray-800">
                      {selectedProduct.medicineInfo.genericName}
                    </p>
                  </div>
                )}

                {selectedProduct.medicineInfo.dosage && (
                  <div className="bg-white rounded-xl p-3 shadow-sm">
                    <p className="text-xs text-gray-500 mb-1">Dosage</p>
                    <p className="font-semibold text-gray-800">
                      {selectedProduct.medicineInfo.dosage}
                    </p>
                  </div>
                )}
                {selectedProduct.medicineInfo.batchNo && (
                  <div className="bg-white rounded-xl p-3 shadow-sm">
                    <p className="text-xs text-gray-500 mb-1">Batch No</p>
                    <p className="font-semibold text-gray-800">
                      {selectedProduct.medicineInfo.batchNo}
                    </p>
                  </div>
                )}

                {selectedProduct.medicineInfo.form && (
                  <div className="bg-white rounded-xl p-3 shadow-sm">
                    <p className="text-xs text-gray-500 mb-1">Form</p>
                    <p className="font-semibold text-gray-800">
                      {selectedProduct.medicineInfo.form}
                    </p>
                  </div>
                )}

                {selectedProduct.medicineInfo.manufacturer && (
                  <div className="bg-white rounded-xl p-3 shadow-sm">
                    <div className="flex items-center gap-2">
                      <BuildingIcon size={16} />
                      <p className="text-xs text-gray-500 mb-1">Manufacturer</p>
                    </div>
                    <p className="font-semibold text-gray-800">
                      {selectedProduct.medicineInfo.manufacturer}
                    </p>
                  </div>
                )}

                {selectedProduct.medicineInfo.uses && 
                 selectedProduct.medicineInfo.uses.length > 0 && (
                  <div className="bg-white rounded-xl p-3 shadow-sm ">
                    <p className="text-xs text-gray-500 mb-2">Uses / Indications</p>
                    <div className="flex flex-wrap gap-2">
                      {Array.isArray(selectedProduct.medicineInfo.uses) ? (
                        selectedProduct.medicineInfo.uses.map((use, index) => (
                          <span
                            key={index}
                            className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium"
                          >
                            {use}
                          </span>
                        ))
                      ) : (
                        <p className="text-gray-800">{selectedProduct.medicineInfo.uses}</p>
                      )}
                    </div>
                  </div>
                )}

                {selectedProduct.medicineInfo.prescriptionRequired && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 flex items-center gap-3 md:col-span-2">
                    <AlertIcon size={24} />
                    <div>
                      <p className="font-semibold text-yellow-800">
                        Prescription Required
                      </p>
                      <p className="text-sm text-yellow-700">
                        This medicine requires a valid prescription
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Description */}
          <div className="mt-6 bg-gray-50 rounded-2xl p-5 border border-gray-200">
            <h3 className="font-bold text-lg mb-3 text-gray-800">
              Description
            </h3>

            <p className="text-gray-600 leading-relaxed">
              {selectedProduct.description ||
                "No description available."}
            </p>
          </div>

          {/* Footer Info */}
          <div className="grid md:grid-cols-2 gap-4 mt-6">
            <div className="bg-gray-50 p-3 rounded-xl border border-gray-200">
              <p className="text-sm text-gray-500">Created Date</p>
              <p className="font-semibold text-gray-800">
                {selectedProduct.createdAt
                  ? new Date(selectedProduct.createdAt).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>

            <div className="bg-gray-50 p-3 rounded-xl border border-gray-200">
              <p className="text-sm text-gray-500">Last Updated</p>
              <p className="font-semibold text-gray-800">
                {selectedProduct.updatedAt
                  ? new Date(selectedProduct.updatedAt).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>
          </div>

          {/* Button */}
          <div className="flex justify-end mt-6">
            <button
              onClick={() => setProductViewModal(false)}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium shadow-lg hover:scale-105 transition-all duration-200"
            >
              Close Product
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const InfoCard = ({ icon, label, value, bgColor, textColor }) => {
  return (
    <div className={`flex items-center justify-between ${bgColor || 'bg-white'} rounded-xl p-3 shadow-sm`}>
      <div className={`flex items-center gap-3 ${textColor || 'text-gray-600'}`}>
        {icon}
        <span className="text-sm font-medium">{label}</span>
      </div>
      <span className={`font-semibold ${textColor || 'text-gray-800'}`}>
        {value}
      </span>
    </div>
  );
};

export default ProductViewModal;