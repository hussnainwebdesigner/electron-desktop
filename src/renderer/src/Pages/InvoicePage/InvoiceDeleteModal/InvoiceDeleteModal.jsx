
import React from 'react'

const InvoiceDeleteModal = ({deleteModalOpen, setDeleteModalOpen, selectedInvoice, confirmDelete, invoiceNumber, deleting}) => {
    // Use the passed invoiceNumber prop
    const displayInvoiceNumber = invoiceNumber || 
        selectedInvoice?.invoiceNumber || 
        selectedInvoice?.id || 
        'N/A';

    return (
        <>
            {deleteModalOpen && (
                <div  onClick={() => setDeleteModalOpen(false)} className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50">
                    <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-lg p-6 max-w-[520px] flex justify-center gap-3 w-full flex-col">
                        <h2 className="text-xl text-red-600 text-center font-bold mb-4">Confirm Delete</h2>
                        <p className="text-gray-600 text-center mb-6">
                            Are you sure you want to <span className='text-red-600'>delete</span> invoice 
                               <span className='font-semibold ml-1'>#{displayInvoiceNumber}</span>?
                            <br />
                            <span className="text-sm text-gray-500">This action cannot be undone.</span>
                        </p>

                        <div className="flex justify-center gap-3">
                            <button
                                onClick={() => setDeleteModalOpen(false)}
                                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                                disabled={deleting}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-red-300 transition-colors"
                                disabled={deleting}
                            >
                                {deleting ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default InvoiceDeleteModal;