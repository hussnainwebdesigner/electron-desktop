// import { FaTrash } from 'react-icons/fa';

// export default function ProductRow({ item, index, onUpdate, onRemove, products }) {
//     const handleProductChange = (productId) => {
//         const product = products.find(p => p._id === productId);
//         if (product) {
//             onUpdate(index, {
//                 productId: product._id,
//                 name: product.name,
//                 price: product.price,
//                 quantity: 1,
//                 discount: 0,
//                 total: product.price
//             });
//         }
//     };

//     const handleQuantityChange = (quantity) => {
//         const maxStock = products.find(p => p._id === item.productId)?.stock || 0;
//         if (quantity > maxStock) {
//             alert(`Cannot sell more than available stock (${maxStock})`);
//             return;
//         }
//         const newItem = { ...item, quantity };
//         newItem.total = newItem.quantity * newItem.price * (1 - newItem.discount / 100);
//         onUpdate(index, newItem);
//     };

//     const handleDiscountChange = (discount) => {
//         const newItem = { ...item, discount };
//         newItem.total = newItem.quantity * newItem.price * (1 - newItem.discount / 100);
//         onUpdate(index, newItem);
//     };

//     return (
//         <tr className="border-b">
//             <td className="py-2 px-1">
//                 <select
//                     value={item.productId || ''}
//                     onChange={(e) => handleProductChange(e.target.value)}
//                     className="w-full p-1 border rounded"
//                     required
//                 >
//                     <option value="">Select Product</option>
                   
//                     {products.length === 0 ? (
//                         <option value="">Loading products...</option>
//                     ) : (
//                         products.map((p) => (
//                             <option key={p._id} value={p._id}>
//                                 {p.name} (Stock: {p.stock})
//                             </option>
//                         ))
//                     )}
//                 </select>
//             </td>
//             <td className="py-2 px-1">
//                 <input type="number" value={item.price} readOnly className="w-20 p-1 border rounded bg-gray-100" />
//             </td>
//             <td className="py-2 px-1">
//                 <input
//                     type="number"
//                     value={item.quantity || 1}
//                     onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 0)}
//                     className="w-20 p-1 border rounded"
//                     min="1"
//                 />
//             </td>
//             <td className="py-2 px-1">
//                 <input
//                     type="number"
//                     value={item.discount || 0}
//                     onChange={(e) => handleDiscountChange(parseFloat(e.target.value) || 0)}
//                     className="w-16 p-1 border rounded"
//                     min="0"
//                     max="100"
//                     step="0.5"
//                 />
//             </td>
//             <td className="py-2 px-1 text-right font-semibold">
//                 ${(item.total || 0).toFixed(2)}
//             </td>
//             <td className="py-2 px-1 text-center">
//                 <button onClick={() => onRemove(index)} className="text-red-500 hover:text-red-700">
//                     <FaTrash />
//                 </button>
//             </td>
//         </tr>
//     );
// }

import { FaTrash } from 'react-icons/fa';

export default function ProductRow({ item, index, onUpdate, onRemove, products }) {
    // Ensure products is always an array
    const productList = Array.isArray(products) ? products : [];

    const handleProductChange = (productId) => {
        const product = productList.find(p => p._id === productId);
        if (product) {
            onUpdate(index, {
                productId: product._id,
                name: product.name,
                price: product.price,
                quantity: 1,
                discount: 0,
                total: product.price
            });
        }
    };

    const handleQuantityChange = (quantity) => {
        const maxStock = productList.find(p => p._id === item.productId)?.stock || 0;
        if (quantity > maxStock) {
            alert(`Cannot sell more than available stock (${maxStock})`);
            return;
        }
        const newItem = { ...item, quantity };
        newItem.total = newItem.quantity * newItem.price * (1 - newItem.discount / 100);
        onUpdate(index, newItem);
    };

    const handleDiscountChange = (discount) => {
        const newItem = { ...item, discount };
        newItem.total = newItem.quantity * newItem.price * (1 - newItem.discount / 100);
        onUpdate(index, newItem);
    };

    return (
        <tr className="border-b">
            <td className="py-2 px-1">
                <select
                    value={item.productId || ''}
                    onChange={(e) => handleProductChange(e.target.value)}
                    className="w-full p-1 border rounded"
                    required
                >
                    <option value="">Select Product</option>

                    {productList.length === 0 ? (
                        <option value="">Loading products...</option>
                    ) : (
                        productList.map((p) => (
                            <option key={p._id} value={p._id}>
                                {p.name} (Stock: {p.stock})
                            </option>
                        ))
                    )}
                </select>
            </td>
            <td className="py-2 px-1">
                <input
                    type="number"
                    value={item.price || 0}
                    readOnly
                    className="w-20 p-1 border rounded bg-gray-100"
                />
            </td>
            <td className="py-2 px-1">
                <input
                    type="number"
                    value={item.quantity || 1}
                    onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 0)}
                    className="w-20 p-1 border rounded"
                    min="1"
                />
            </td>
            <td className="py-2 px-1">
                <input
                    type="number"
                    value={item.discount || 0}
                    onChange={(e) => handleDiscountChange(parseFloat(e.target.value) || 0)}
                    className="w-16 p-1 border rounded"
                    min="0"
                    max="100"
                    step="0.5"
                />
            </td>
            <td className="py-2 px-1 text-right font-semibold">
                ${(item.total || 0).toFixed(2)}
            </td>
            <td className="py-2 px-1 text-center">
                <button onClick={() => onRemove(index)} className="text-red-500 hover:text-red-700">
                    <FaTrash />
                </button>
            </td>
        </tr>
    );
}