import React, { useState, useEffect } from 'react';
import receipt from './assets/receipt.png';
import wavyCheck from './assets/wavyCheck.png';
import warning from './assets/warning.png';
import cancel from './assets/cancel.png';
import clock from './assets/clock.png';
import refund from './assets/refund.png'; 
import { getInvoiceStatsApi } from '../../../../../apis/invoiceApi/invoiceApi.js';

const InvoiceCard = () => {
    const [invoiceStats, setInvoiceStats] = useState({
        totalInvoices: 0,
        totalAmount: 0,
        paidAmount: 0,
        unpaidAmount: 0,
        pendingAmount: 0,
        refundAmount: 0,
        cancelAmount: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchInvoiceStats();
    }, []);

    const fetchInvoiceStats = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await getInvoiceStatsApi();

            if (response.success) {
                setInvoiceStats(response.stats);
            } else {
                setError('Failed to fetch statistics');
            }
        } catch (error) {
            console.error('Error fetching invoice stats:', error);
            setError(error.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    };

    const invoiceCards = [
        {
            img: receipt,
            invstatus: "Total Invoices",
            amount: formatCurrency(invoiceStats.totalAmount),
            count: invoiceStats.totalInvoices,
            bgColor: "#ECF4E9",
            filterStatus: "all",
            description: "All invoices in the system"
        },
        {
            img: wavyCheck,
            invstatus: "Paid Invoices",
            amount: formatCurrency(invoiceStats.paidAmount),
            count: null,
            bgColor: "#E8F5E9",
            filterStatus: "paid",
            description: "Successfully paid invoices"
        },
        {
            img: warning,
            invstatus: "Unpaid Invoices",
            amount: formatCurrency(invoiceStats.unpaidAmount),
            count: null,
            bgColor: "#FFEBEE",
            filterStatus: "unpaid",
            description: "Overdue or due invoices"
        },
        {
            img: clock,
            invstatus: "Pending Invoices",
            amount: formatCurrency(invoiceStats.pendingAmount),
            count: null,
            bgColor: "#FFF3E0",
            filterStatus: "pending",
            description: "Awaiting payment confirmation"
        },
        {
            img: refund,
            invstatus: "Refunded Invoices",
            amount: formatCurrency(invoiceStats.refundAmount),
            count: null,
            bgColor: "#E3F2FD",
            filterStatus: "refunded",
            description: "Refunded or credited invoices"
        },
        {
            img: cancel,
            invstatus: "Canceled Invoices",
            amount: formatCurrency(invoiceStats.cancelAmount),
            count: null,
            bgColor: "#fcc7c7",
            filterStatus: "cancel",
            description: "Cancelled or voided invoices"
        }
    ];

    if (loading) {
        return (
            <div className='w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 my-2 gap-4'>
                {[1, 2, 3, 4, 5, 6].map((_, i) => ( 
                    <div key={i} className='flex h-20 justify-between rounded-2xl border p-2 border-[#E5E6E6] items-center animate-pulse'>
                        <div className='flex items-center gap-2'>
                            <div className='w-[40px] h-[40px] rounded-full bg-gray-200'></div>
                            <div className='flex flex-col gap-1'>
                                <div className='h-4 w-24 bg-gray-200 rounded'></div>
                                <div className='h-6 w-32 bg-gray-200 rounded'></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <div className='w-full my-2 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-center'>
                Error loading invoice statistics: {error}
                <button
                    onClick={fetchInvoiceStats}
                    className='ml-4 px-3 py-1 bg-red-600 text-white rounded-lg text-sm'
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className='w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 mb-3 gap-3'>
            {invoiceCards.map((card, i) => (
                <div
                    key={i}
                    className='flex h-20 justify-between group rounded-2xl border-2 p-3 border-[#E5E6E6] items-center hover:shadow-lg transition hover:scale-105 duration-200 cursor-pointer'
                    style={{ backgroundColor: card.bgColor + '40' }}
                    
                >
                    <div className='flex items-center gap-3  w-full'>
                        
                        <div
                            className='w-[40px] h-[40px] flex shadow-xl scale-125 transition-all duration-300 justify-center rounded-full items-center'
                            style={{
                                backgroundColor: card.bgColor,
                                transformStyle: 'preserve-3d',
                                transition: 'transform 0.3s ease-out, box-shadow 0.3s ease-out',
                            }}
                           
                        >
                            <img
                                src={card.img}
                                className='w-[25px] h-[25px]'
                                style={{ transform: 'translateZ(5px)' }}
                                alt={card.invstatus}
                            />
                        </div>
                        <div className="flex flex-col gap-1 flex-1">
                            <div className="flex justify-between items-center">
                                <p className="text-[12px] font-semibold text-[#242E2C]">{card.invstatus}</p>
                                {card.count !== null && (


                                    
                                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                                        {card.count} invoices
                                    </span>
                                )}
                            </div>
                            <h1 className="text-[18px] font-bold text-[#1E4841]">{card.amount}</h1>

                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default InvoiceCard;