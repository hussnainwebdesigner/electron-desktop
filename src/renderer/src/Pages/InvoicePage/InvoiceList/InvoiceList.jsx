
import React, { useState } from 'react'
import vieweye from './assets/vieweye.png'
import editIcon from './assets/editIcon.png'
import deleteIcon from './assets/deleteIcon.png'
import printer from './assets/printer.png'

import { useInvoicesApi, deleteInvoiceApi } from '../../../apis/invoiceApi/invoiceApi'
import InvoiceCard from './Components/InvoiceCard/InvoicveCard';
import InvoiceDeleteModal from '../InvoiceDeleteModal/InvoiceDeleteModal';


const InvoiceList = ({ isEdit,
    setIsEdit,
    setPageNavigate,
    selectedInvoice,
    setSelectedInvoice
}) => {
    const { allInvoices, search, setSearch, page, setPage, limit, setLimit, fetchInvoices } = useInvoicesApi();
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedInvoiceNumber, setSelectedInvoiceNumber] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const [filter, setFilter] = useState('All')


    const handleSearch = (e) => {
        setPage(1);
        setSearch(e.target.value);
    };

    const getFilteredInvoices = () => {
        if (filter === 'All') return allInvoices;
        if (filter === 'Paid') return allInvoices.filter(inv => inv.status?.toLowerCase() === 'paid');
        if (filter === 'Unpaid') return allInvoices.filter(inv => inv.status?.toLowerCase() === 'unpaid');
        if (filter === 'Refund') return allInvoices.filter(inv => inv.status?.toLowerCase() === 'refund');
        if (filter === 'Pending') return allInvoices.filter(inv => inv.status?.toLowerCase() === 'pending');
        if (filter === 'Cancel') return allInvoices.filter(inv => inv.status?.toLowerCase() === 'cancel');
        return allInvoices;
    };

    const filteredInvoices = getFilteredInvoices();
    const getStatusStyle = (status) => {
        switch (status?.toLowerCase()) {
            case 'paid':
                return 'bg-green-100 text-green-700';
            case 'unpaid':
                return 'bg-blue-100 text-blue-700';
            case 'refund':
                return 'bg-red-100 text-red-700';
            case 'pending':
                return 'bg-orange-100 text-orange-700';
            case 'cancel':
                return 'bg-gray-100 text-gray-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    const handlePrint = (invoice) => {
        setSelectedInvoice(invoice);
        setPageNavigate('print-invoice');
    };
    const handleAdd = () => {
        setPageNavigate("new-invoice");
    };


    const handleEdit = (invoice) => {
        setSelectedInvoice(invoice);
        setPageNavigate(`edit-invoice`);
        setIsEdit(true)
    };

    const handleDeleteClick = (invoice) => {
        setSelectedInvoice(invoice);
        setSelectedInvoiceNumber(invoice.invoiceNumber); 
        console.log('Deleting invoice:', invoice);
        console.log('Invoice number:', invoice.invoiceNumber);
        setDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!selectedInvoice) return;
        setDeleting(true);
        try {
            await deleteInvoiceApi(selectedInvoice._id);
            await fetchInvoices();
            setDeleteModalOpen(false);
            setSelectedInvoice(null);
        } catch (error) {
            console.error('Error deleting invoice:', error);
            alert('Failed to delete invoice');
        } finally {
            setDeleting(false);
        }
    };


    // Action buttons configuration object
    const actionButtons = [
        {
            id: 'print',
            icon: printer,
            alt: 'Print',
            onClick: (invoice) => handlePrint(invoice),
            className: 'w-[15px]'
        },
        {
            id: 'edit',
            icon: editIcon,
            alt: 'Edit',
            onClick: (invoice) => handleEdit(invoice),
            className: 'w-[15px]'
        },
        {
            id: 'delete',
            icon: deleteIcon,
            alt: 'Delete',
            onClick: (invoice) => handleDeleteClick(invoice),
            className: 'w-[15px]'
        }
    ];


    return (
        <>
            <section className='w-full'>
                <div className='w-full shadow-xl my-auto bg-white rounded-lg p-4'>
                    <InvoiceCard />
                    <div className='w-full gap-4 '>
                        <div className='w-full flex my-3 justify-between items-center'>
                            <div className=''>
                                <h1 className='text-2xl font-semibold text-gray-800'>Invoices</h1>
                            </div>
                            <div className='flex w-full justify-end items-center gap-4'>
                                <div className="flex   w-full bg-[#7b7b7b] rounded-md max-w-[400px]">
                                    {["All", "Paid", "Unpaid", "Refund", "Pending", "Cancel"].map((type) => (
                                        <button
                                            key={type}
                                            onClick={() => setFilter(type)}
                                            className={`w-full p-3 rounded-md text-[14px] transition-all decoration-500 hover:bg-[#1E4841] font-[600] ${filter === type ? "bg-[#1E4841] text-white" : " text-white"
                                                }`}
                                        >
                                            {type}
                                        </button>
                                    ))}
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search Invoices..."
                                    value={search}
                                    onChange={handleSearch}
                                    className='p-3 text-[15px] outline-0 border-2 flex items-center rounded-md bg-[#e4e4e4e0] h-11 w-full max-w-87.5'
                                />

                                <button onClick={handleAdd} className="inline-flex items-center p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition-colors">
                                    <span className="flex items-center  justify-center text-blue-700 p-1 bg-blue-100 rounded-full text-xs mr-2">

                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-5 w-5"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            strokeWidth={2}
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M12 4v16m8-8H4"
                                            />
                                        </svg>
                                    </span>
                                    Create Invoice



                                </button>
                            </div>
                        </div>

                        <div className="w-full overflow-y-auto px-1 h-[calc(100vh-368px)] mt-2">
                            <div className="  w-full">
                                <table className="table-auto w-full  border-separate border-spacing-y-2 min-w-[800px] text-center  ">
                                    <thead>
                                        <tr className="  text-[#fcfcfc] text-center">
                                            <th className="w-[5%] bg-[#02075f]/60 rounded-md border border-[#E4E4E4] font-semibold text-[13px] xl:text-[14px] p-1.5 w-[12%]">
                                                Invoice No
                                            </th>
                                            <th className=" bg-[#7b7b7b] rounded-md border border-[#E4E4E4] font-semibold text-[13px] xl:text-[14px] p-1.5 w-[18%]">
                                                Client Name
                                            </th>
                                            <th className=" bg-[#7b7b7b] rounded-md border border-[#E4E4E4] font-semibold text-[13px] xl:text-[14px] p-1.5 w-[15%]">
                                                Date & Time
                                            </th>
                                            <th className=" bg-[#7b7b7b] rounded-md border border-[#E4E4E4] font-semibold text-[13px] xl:text-[14px] p-1.5 w-[10%]">
                                                Payment Method
                                            </th>
                                            <th className=" bg-[#7b7b7b] rounded-md border border-[#E4E4E4] font-semibold text-[13px] xl:text-[14px] p-1.5 w-[12%]">
                                                Billed
                                            </th>
                                            <th className=" bg-[#7b7b7b] rounded-md border border-[#E4E4E4] font-semibold text-[13px] xl:text-[14px] p-1.5 w-[15%]">
                                                Phone
                                            </th>
                                            <th className=" bg-[#7b7b7b] rounded-md border border-[#E4E4E4] font-semibold text-[13px] xl:text-[14px] p-1.5 w-[6%]">
                                                Status
                                            </th>
                                            <th className=" bg-[#7b7b7b] rounded-md border border-[#E4E4E4] font-semibold text-[13px] xl:text-[14px] p-1.5 w-[5%]">
                                                Action
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className='bg-white'>
                                        {filteredInvoices.length === 0 ? (
                                            <tr>
                                                <td colSpan="12" className="text-center py-4 font-semibold text-gray-400 border-b-2 border-[#E4E4E4]">
                                                    <span className='text-[20px]'>
                                                        {search ? 'No invoices found matching your search.' : 'Invoices Not Found.'}
                                                    </span>
                                                </td>
                                            </tr>
                                        ) : (
                                            filteredInvoices.map((invoice) => (
                                                <tr key={invoice._id} className="bg-[#f6f6f6]  transition-all duration-300 hover:shadow-[2px_2px_2px_rgba(20,0,40,30.05)]"
                                                >

                                                    <td className="p-1.5 border-[#E4E4E4]  border-b border-r text-center font-[500]  text-[13px] text-[#030712]">
                                                        #{invoice.invoiceNumber}
                                                    </td>
                                                    <td className="p-1  font-semibold text-[12px] border-b border-r border-[#E4E4E4]">
                                                        {invoice.customerName}
                                                    </td>
                                                    <td className="p-1  font-semibold text-[12px] border-b border-r border-[#E4E4E4]">
                                                        {invoice.createdAt &&
                                                            new Date(invoice.createdAt).toLocaleString('en-PK', {
                                                                dateStyle: 'medium',
                                                                timeStyle: 'short'
                                                            })
                                                        }
                                                    </td>
                                                    <td className="p-1  font-semibold text-[12px] border-b border-r border-[#E4E4E4]">
                                                        {invoice.paymentMethod ? invoice.paymentMethod.charAt(0).toUpperCase() + invoice.paymentMethod.slice(1) : 'N/A'}
                                                    </td>
                                                    <td className="p-1  font-semibold text-[12px] border-b border-r border-[#E4E4E4]">
                                                        Rs.{Number(invoice.total || 0).toFixed(2)}
                                                    </td>
                                                    <td className="p-1  font-semibold text-[12px] border-b border-r border-[#E4E4E4]">
                                                        {invoice.customerPhone || 'N/A'}
                                                    </td>
                                                    <td className="p-1.5 border-[#E4E4E4] border-b-2 border-r-2 text-center">
                                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(invoice.status)}`}>
                                                            {invoice.status}
                                                        </span>
                                                    </td>
                                                    <td className="p-1.5 border-[#E4E4E4] border-b-2 border-r-2 text-center relative">
                                                        
                                                        <div className="flex justify-between rounded-full bg-[#b3b2b2] p-1 items-center gap-2">
                                                            {actionButtons.map((button) => (
                                                                <button key={button.id} onClick={() => button.onClick(invoice)}
                                                                    className='rounded-full cursor-pointer border-[1.34px] border-[#E5E5E5]'
                                                                    style={{

                                                                        transformStyle: 'preserve-3d',
                                                                        transition: 'transform 0.3s ease-out, box-shadow 0.3s ease-out',
                                                                    }}
                                                                    onMouseMove={(e) => {
                                                                        const rect = e.currentTarget.getBoundingClientRect();
                                                                        const x = e.clientX - rect.left;
                                                                        const y = e.clientY - rect.top;
                                                                        const centerX = rect.width / 2;
                                                                        const centerY = rect.height / 2;
                                                                        const rotateX = ((y - centerY) / centerY) * -15;
                                                                        const rotateY = ((x - centerX) / centerX) * 15;

                                                                        e.currentTarget.style.transform = `perspective(500px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(15px)`;
                                                                        e.currentTarget.style.boxShadow = `0 20px 30px rgba(0,0,0,0.3), 0 0 0 2px rgba(255,255,255,0.7) inset`;
                                                                    }}
                                                                    onMouseLeave={(e) => {
                                                                        e.currentTarget.style.transform = 'perspective(500px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
                                                                        e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.2), 0 0 0 2px rgba(255,255,255,0.5) inset';
                                                                    }}>
                                                                    <span className='bg-[#fefefe] text-[#000] flex justify-center items-center w-[22px] h-[22px] cursor-pointer border-[1.34px] border-[#E5E5E5] rounded-full'>
                                                                        <img src={button.icon} alt={button.alt} className={button.className} />
                                                                    </span>
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <InvoiceDeleteModal
                deleteModalOpen={deleteModalOpen}
                setDeleteModalOpen={setDeleteModalOpen}
                confirmDelete={confirmDelete}
                deleting={deleting}
                invoiceNumber={selectedInvoiceNumber}
            />
        </>
    )
}

export default InvoiceList;