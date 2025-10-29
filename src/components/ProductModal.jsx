"use client";
import { useState } from "react";
import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";

export default function ProductModal({ isOpen, closeModal, product }) {
    const [mainIndex, setMainIndex] = useState(0);
    console.log("productModal", product)
    if (!product) return null;

    if (!product?.image || product.image.length === 0) {
        return (
            <div className="w-full h-64 flex justify-center items-center bg-gray-100 rounded-lg">
                <span className="text-gray-500">No Image Available</span>
            </div>
        );
    }

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={closeModal}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black bg-opacity-30" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-4xl max-h-[80vh] transform overflow-hidden rounded-2xl bg-white p-6 text-left shadow-2xl transition-all">
                                <div className="flex flex-col md:flex-row gap-6 h-full overflow-y-auto">
                                    {/* Left: Product Image */}
                                    {/* Left: Product Images */}
                                    <div className="md:w-1/3 flex flex-col items-center bg-gray-50 rounded-lg p-4 shrink-0">
                                        {/* Main image */}
                                        <div className="w-full h-64 flex justify-center items-center mb-4">
                                            <img
                                                src={product.image[mainIndex]}
                                                alt={product.name}
                                                className="w-full h-64 object-contain rounded-lg shadow-md"
                                            />
                                        </div>

                                        {/* Thumbnails */}
                                        {product.image.length > 1 && (
                                            <div className="flex flex-wrap gap-2 justify-center">
                                                {product.image.map((img, idx) => (
                                                    <img
                                                        key={idx}
                                                        src={img}
                                                        alt={`${product.name} ${idx + 1}`}
                                                        className={`w-16 h-16 object-cover rounded-md cursor-pointer border transition 
                                ${mainIndex === idx ? "border-blue-500" : "border-gray-200"}`}
                                                        onClick={() => setMainIndex(idx)} // change main image
                                                    />
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Right: Product Details */}
                                    <div className="md:w-2/3 flex flex-col gap-4">
                                        <Dialog.Title className="text-3xl font-bold text-gray-800">
                                            {product.name}
                                        </Dialog.Title>
                                        {/* <p className="text-gray-600">{product.description || "No description"}</p> */}

                                        <div className="grid grid-cols-2 gap-4 mt-2">
                                            <div>
                                                <span className="font-semibold text-gray-700">Price:</span>
                                                <span className="text-green-600 text-lg">${product.price}</span>
                                            </div>
                                            <div>
                                                <span className="font-semibold text-gray-700">Stock:</span>
                                                <span className="text-gray-800">{product.stock}</span>
                                            </div>
                                            <div>
                                                <span className="font-semibold text-gray-700">SKU:</span>
                                                <span className="text-gray-800">{product.sku}</span>
                                            </div>
                                            <div>
                                                <span className="font-semibold text-gray-700">Sub-Category:</span>
                                                <span className="text-gray-800">{product.subcategory?.name || "-"}</span>
                                            </div>
                                        </div>

                                        {/* Variations */}
                                        <div className="mt-4">
                                            <h3 className="text-xl font-semibold mb-2">Variations</h3>
                                            {product.variations && product.variations.length > 0 ? (
                                                <div className="overflow-x-auto max-h-64">
                                                    <table className="w-full text-left border border-gray-200 rounded-lg">
                                                        <thead className="bg-gray-100">
                                                            <tr>
                                                                <th className="px-4 py-2 border-b">Variation</th>
                                                                <th className="px-4 py-2 border-b">Image</th>
                                                                <th className="px-4 py-2 border-b">Price</th>
                                                                <th className="px-4 py-2 border-b">SKU</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {product.variations.map((v) => (
                                                                <tr key={v.id} className="hover:bg-gray-50 transition-colors">
                                                                    <td className="px-4 py-2 border-b">{v.variationName}</td>
                                                                    <td className="px-4 py-2 border-b">
                                                                        {v.image && v.image.length > 0 ? (
                                                                            <img
                                                                                src={v.image[0]}
                                                                                alt={v.variationName}
                                                                                className="w-16 h-16 object-cover rounded"
                                                                            />
                                                                        ) : (
                                                                            <span className="text-gray-400">No Image</span>
                                                                        )}
                                                                    </td>
                                                                    <td className="px-4 py-2 border-b">{v.price}</td>
                                                                    <td className="px-4 py-2 border-b">{v.sku}</td>
                                                                </tr>
                                                            ))}
                                                        </tbody>

                                                    </table>
                                                </div>
                                            ) : (
                                                <p className="text-gray-500">No variations available</p>
                                            )}
                                        </div>


                                        {/* Close Button */}
                                        <div className="mt-6 flex justify-end">
                                            <button
                                                onClick={closeModal}
                                                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition cursor-pointer"
                                            >
                                                Close
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </Dialog.Panel>

                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}
