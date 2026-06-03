
import { useEffect, useState } from 'react';
import listIcon from "./assets/listIcon.png";
import gridIcon from "./assets/gridIcon.png";
import vieweye from "./assets/vieweye.png";
import editIcon from "./assets/editIcon.png";
import trash from "./assets/trash.png";
import AddAndEditProductModal from './AddAndEditProductModal/AddAndEditProductModal';
import {
  deleteProductApi,
  useProductsApi,
  putProductApi,
  postProductApi,
  bulkStockUpdateApi
} from '../../apis/productApi/productApi.js';
import ProductViewModal from './ProductViewModal/ProductViewModal.jsx';
import { useAuth } from '../../Context/AuthContext/AuthContext.jsx';

const Products = ({ setPageNavigate }) => {
  const [addAndEditProductModal, setAddAndEditProductModal] = useState(false);
  const [productViewModal, setProductViewModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isList, setIsList] = useState(true);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const { isAuthenticated } = useAuth();

  const {
    allProducts,
    setAllProducts,
    error,
    loading,
    page,
    setPage,
    limit,
    setLimit,
    search,
    setSearch,
    totalPages,
    totalProducts
  } = useProductsApi();

  const handleSearch = (e) => {
    setPage(1);
    setSearch(e.target.value);
  };

  const deletedProduct = async (id) => {
    const product = allProducts.find(p => p._id === id);
    if (window.confirm(`Are you sure you want to delete this product ${product?.productName || 'this product'}? `)) {
      try {
        await deleteProductApi(id);
        setAllProducts(prev => prev.filter(product => product._id !== id));
        alert(`Product ${product?.productName || 'this product'} deleted successfully!`);
      } catch (err) {
        console.error("Delete error:", err);
        alert('Error deleting product');
      }
    }
  };


  const handleBulkStockUpdate = async () => {
    if (selectedProducts.length === 0) {
      alert('Please select products to update stock');
      return;
    }

    const updates = [
      { productId: allProducts[0]._id, quantity: 1 }
    ];

    console.log(updates, "kjmfdm updates");

    try {
      const result = await bulkStockUpdateApi(updates);
      if (result.success) {
        console.log('Stock updated successfully:', result);
        alert('Stock updated successfully!');
        // Refresh products to show updated stock
        window.location.reload();
      }
    } catch (error) {
      console.error('Failed to update stock:', error);
      alert(error.response?.data?.message || 'Failed to update stock');
    }
  };


  const handleEdit = (product) => {
    setSelectedProduct(product);
    setIsEditing(true);
    setAddAndEditProductModal(true);
  };

  const handleCreate = () => {
    setIsEditing(false);
    setSelectedProduct(null);
    setAddAndEditProductModal(true);
  };

  const handleSave = async (productData) => {
    try {
      if (isEditing) {
        const updated = await putProductApi(selectedProduct._id, productData);
        setAllProducts(prev =>
          prev.map(p => p._id === selectedProduct._id ? updated.product : p)
        );
        alert('Product updated successfully!');
      } else {
        const created = await postProductApi(productData);
        setAllProducts(prev => [created.product, ...prev]);
        alert('Product created successfully!');
      }
      setAddAndEditProductModal(false);
    } catch (err) {

      console.error("Save error:", err);
      alert(`Error ${isEditing ? 'updating' : 'creating'} product: ${err.response?.data?.message || err.message}`);
    }
  };

  // Toggle product selection for bulk operations
  const toggleProductSelection = (productId) => {
    setSelectedProducts(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };



  return (
    <>
      <section className='w-full  '>
        <div className='w-full shadow-xl  bg-white rounded-lg p-4'>
          <div className='w-full flex justify-between items-center gap-4'>
            <div className=''>
              <h1 className='text-2xl font-semibold text-gray-800'>Products</h1>
            </div>

            <div className='flex w-full justify-end items-center gap-4'>
              
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gray-700 border border-blue-100 shadow-sm">
                <span className="text-md font-medium text-blue-200">Total Products {" "} : </span>
                <span className="text-md font-bold text-blue-900 bg-white px-2 py-0.5 rounded shadow-inner">
                  {totalProducts}
                </span>
              </div>

              <input
                type="text"
                placeholder="Search Products..."
                value={search}
                onChange={handleSearch}
                className='px-2 py-1.5 text-[15px] outline-0 border-2 flex items-center rounded-md bg-[#e4e4e4e0] w-full max-w-[300px]'
              />
              <button
                title="Add Product"
                onClick={handleCreate}
                className='p-2 bg-blue-600/70 text-[13px] rounded-md text-white  flex items-center hover:bg-blue-700/80 whitespace-nowrap'
              >
                Add Product
              </button>
            </div>
          </div>

          <div className='w-full mt-2 flex  gap-4'>
            <div className='w-full   gap-4'>
              <div className="w-full ">
                <div className="overflow-x-auto overflow-y-auto h-full w-full">
                  <table className="table-auto w-full max-w-[1600px] text-center px- border-separate border-spacing-y-1.5 shadow-sm">
                    <thead>
                      <tr className="  text-[#fcfcfc] text-center">
                        <th className="w-[5%] bg-[#02075f]/60 rounded border border-[#E4E4E4] font-semibold text-[10px] p-1">
                          Select
                        </th>
                        {/* <th className="w-[12%] bg-[#7b7b7b] rounded border border-[#E4E4E4] font-semibold text-[10px] p-1">
                          Product Id
                        </th> */}
                        <th className="w-[25%] bg-[#7b7b7b] rounded border border-[#E4E4E4] font-semibold text-[10px] p-1">
                          Product
                        </th>
                        <th className="w-[10%] bg-[#ee0606] rounded border border-[#E4E4E4] font-semibold text-[10px] p-1">
                          Expiry Date
                        </th>
                        <th className="w-[12%] bg-[#7b7b7b] rounded border border-[#E4E4E4] font-semibold text-[10px] p-1">
                          Category
                        </th>
                        <th className="w-[12%] bg-[#7b7b7b] rounded border border-[#E4E4E4] font-semibold text-[10px] p-1">
                          Sales Price(Rs.)
                        </th>
                        <th className="w-[12%] bg-[#7b7b7b] rounded border border-[#E4E4E4] font-semibold text-[10px] p-1">
                          Purchase Price(Rs.)
                        </th>
                        <th className="w-[12%] bg-[#7b7b7b] rounded border border-[#E4E4E4] font-semibold text-[10px] p-1">
                          Batch No
                        </th>
                        <th className="w-[17%] bg-[#7b7b7b] rounded border border-[#E4E4E4] font-semibold text-[10px] p-1">
                          Stock
                        </th>
                        <th className="w-[8%] bg-[#7b7b7b] rounded border border-[#E4E4E4] font-semibold text-[10px] p-1">
                          Actions
                        </th>
                      </tr>
                    </thead>

                    <tbody className='bg-white figtree'>
                      {loading ? (
                        <tr>
                          <td colSpan="12" className="text-center py-4 font-semibold text-gray-400 border-b-2 border-[#E4E4E4]">
                            <div className="flex justify-center items-center">
                              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                            </div>
                            <span className='text-[20px] mt-4 block'>Loading products...</span>
                          </td>
                        </tr>
                      ) : allProducts.length === 0 ? (
                        <tr>
                          <td colSpan="12" className="text-center py-4 font-semibold text-gray-400 border-b-2 border-[#E4E4E4]">

                            <span className='text-[20px]'>
                              {search ? 'No products found matching your search.' : 'Products Not Found.'}
                            </span>
                          </td>
                        </tr>
                      ) : (
                        allProducts.map((product) => (
                          <tr title={` Product: ${product.productName} ${product._id}`} key={product._id} className="bg-[#f6f6f6]  transition-all duration-300 
                          hover:shadow-[2px_2px_2px_rgba(20,0,40,30.05)]">
                            <td className="p-1 text-[14px]  font-semibold border-b border-r border-[#E4E4E4]">
                              <input
                                type="checkbox"
                                checked={selectedProducts.includes(product._id)}
                                onChange={() => toggleProductSelection(product._id)}
                                className="w-3 h-3"
                              /> 
                            </td>
                            
                            
                            <td className="px-4 py-3 text-sm border-b border-r border-[#E4E4E4]">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-gray-900">{product.productName}</span>
                                <span className="text-xs text-gray-400">•</span>
                                <span className="text-xs text-gray-500">{product.medicineInfo.genericName}</span>
                                <span className="text-[11px] font-medium text-blue-600 bg-blue-200 w-fit px-2 py-0.5 rounded">
                                  {product.medicineInfo.dosage}
                                </span>
                              </div>

                            </td>
                            <td className="p-1  font-semibold text-[12px] text-red-500 border-b border-r border-[#E4E4E4]">
                              {product.expiryDate ? new Date(product.expiryDate).toLocaleDateString() : 'N/A'}
                            </td>
                            <td className="p-1  font-semibold text-[12px] border-b border-r border-[#E4E4E4]">
                              {product.category}
                            </td>
                            <td className="p-1  font-semibold text-[12px] border-b border-r border-[#E4E4E4]">
                              Rs.{product.salePrice}
                            </td>
                            <td className="p-1  font-semibold text-[12px] border-b border-r border-[#E4E4E4]">
                              Rs.{product.purchasePrice}
                            </td>
                            <td className="p-1  font-semibold text-[12px] border-b border-r border-[#E4E4E4]">
                              {product.medicineInfo.batchNo || 'N/A'}
                            </td>
                            <td className={`p-1  font-semibold text-[12px] border-b border-r border-[#E4E4E4] ${product.stock < 10 ? 'text-red-600' : product.stock < 50 ? 'text-orange-600' : 'text-green-600'}`}>
                              {product.stock}
                              <div className="flex-1 bg-gray-300 rounded-full h-1.5">
                                <div
                                  className={`h-1.5 rounded-full transition-all duration-300 ${product.stock < 10 ? 'bg-red-500' :
                                    product.stock < 50 ? 'bg-orange-500' : 'bg-green-500'
                                    }`}
                                  style={{ width: `${Math.min((product.stock / 200) * 100, 100)}%` }}
                                />
                              </div>
                            </td>
                            <td className="p-1 text-[14px]  font-semibold border-b border-r border-[#E4E4E4]">
                              <div className="flex justify-between rounded-full bg-[#b3b2b2] p-1 items-center gap-1">
                                <button
                                  title="View Product"
                                  onClick={() => {
                                    setSelectedProduct(product);
                                    setProductViewModal(true);
                                  }}
                                  className="w-[25px] h-[25px] bg-white border-[#E4E4E4] rounded-full border-2 cursor-pointer transition duration-300 flex justify-center items-center hover:bg-gray-100"
                                >
                                  <img src={vieweye} alt="View" className='w-[17px] h-[17px]' />
                                </button>
                                <button
                                  title='Edit Product'
                                  onClick={() => handleEdit(product)}
                                  className="w-[25px] h-[25px] bg-white border-[#E4E4E4] rounded-full border-2 cursor-pointer transition duration-300 flex justify-center items-center hover:bg-gray-100"
                                >
                                  <img src={editIcon} alt="Edit" className='w-[17px] h-[17px]' />
                                </button>
                                <button
                                  title="Delete Product"
                                  onClick={() => deletedProduct(product._id)}
                                  className="w-[25px] h-[25px] bg-white border-[#E4E4E4] rounded-full border-2 cursor-pointer transition duration-300 flex justify-center items-center hover:bg-red-50"
                                >
                                  <img src={trash} alt="Delete" className='w-[17px] h-[17px]' />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Bulk Actions */}
                {selectedProducts.length > 0 && (
                  <div className="mt-2 p-2 bg-blue-50 rounded-lg flex justify-between items-center">
                    <span className="text-sm text-blue-700">
                      {selectedProducts.length} product(s) selected
                    </span>
                    <div className="space-x-2">
                      <button
                        onClick={handleBulkStockUpdate}
                        className="p-1.5 bg-green-600 text-[12px] text-white rounded-md hover:bg-green-700"
                      >
                        Update Stock
                      </button>
                      <button
                        onClick={() => setSelectedProducts([])}
                        className="p-1.5 bg-gray-600 text-[12px] text-white rounded-md hover:bg-gray-700"
                      >
                        Clear Selection
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-2 flex-wrap">
                  <button
                    onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                    disabled={page === 1}
                    className="px-3 py-1 bg-red-400 rounded disabled:opacity-50 hover:bg-red-500"
                  >
                    Prev
                  </button>

                  {(() => {
                    const pages = [];
                    const maxVisible = 10;

                    let start = Math.max(1, page - Math.floor(maxVisible / 2));
                    let end = start + maxVisible - 1;

                    if (end > totalPages) {
                      end = totalPages;
                      start = Math.max(1, end - maxVisible + 1);
                    }

                    if (start > 1) {
                      pages.push(1);
                      if (start > 2) pages.push('...');
                    }

                    for (let i = start; i <= end; i++) {
                      pages.push(i);
                    }

                    if (end < totalPages) {
                      if (end < totalPages - 1) pages.push('...');
                      pages.push(totalPages);
                    }

                    return pages.map((p, index) => (
                      <button
                        key={index}
                        disabled={p === '...'}
                        onClick={() => typeof p === 'number' && setPage(p)}
                        className={`px-3 py-1 border rounded  ${page === p ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'} ${p === '...' ? 'cursor-default' : ''} `}
                      >
                        {p}
                      </button>
                    ));
                  })()}

                  <button
                    onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={page === totalPages}
                    className="px-3 py-1 bg-red-400 rounded disabled:opacity-50 hover:bg-red-500"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
            <AddAndEditProductModal
              isEditing={isEditing}
              selectedProduct={selectedProduct}
              addAndEditProductModal={addAndEditProductModal}
              setAddAndEditProductModal={setAddAndEditProductModal}
              onSave={handleSave}
            />
          </div>
        </div>
      </section>
      <ProductViewModal
        selectedProduct={selectedProduct}
        productViewModal={productViewModal}
        setProductViewModal={setProductViewModal}
      />
    </>
  );
};

export default Products;