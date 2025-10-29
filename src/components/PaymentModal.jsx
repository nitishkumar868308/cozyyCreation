"use client";
import React, { useState } from "react";
import { X, CreditCard, Smartphone, Server, Package, Coffee } from "lucide-react";

const paymentMethods = [
    {
        type: "UPI / Wallet",
        icon: <Smartphone className="w-8 h-8 text-blue-600" />,
        description: "Google Pay, PhonePe, Paytm...",
    },
    {
        type: "Credit / Debit Card",
        icon: <CreditCard className="w-8 h-8 text-green-600" />,
        description: "Visa, MasterCard, Rupay...",
    },
    {
        type: "Net Banking",
        icon: <Server className="w-8 h-8 text-purple-600" />,
        description: "All major banks supported",
    },
    {
        type: "Cash on Delivery",
        icon: <Package className="w-8 h-8 text-orange-600" />,
        description: "Pay after receiving your order",
    },
];

export default function PaymentModal({ isOpen, onClose }) {
    const [selected, setSelected] = useState(null);
    const [formData, setFormData] = useState({
        cardNumber: "",
        cardExpiry: "",
        cardCvv: "",
        upiId: "",
        wallet: "",
        bank: "",
    });

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 px-4">
            <div className="bg-white rounded-3xl w-full max-w-2xl p-6 relative shadow-2xl animate-slide-up">
                {/* Close Button */}
                <button
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition-colors"
                    onClick={onClose}
                >
                    <X size={24} />
                </button>

                {/* Header */}
                <h2 className="text-2xl font-bold mb-6 text-center">
                    Select Payment Method
                </h2>

                {/* Payment Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {paymentMethods.map((method, idx) => (
                        <div
                            key={idx}
                            onClick={() => setSelected(idx)}
                            className={`flex items-center p-4 border rounded-2xl cursor-pointer transition-all transform hover:scale-105 ${selected === idx
                                    ? "border-blue-600 bg-blue-50 shadow-lg"
                                    : "border-gray-200 bg-white"
                                }`}
                        >
                            <div className="mr-4">{method.icon}</div>
                            <div>
                                <p className="font-semibold text-gray-800">{method.type}</p>
                                <p className="text-sm text-gray-500">{method.description}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Conditional Forms */}
                {selected !== null && (
                    <div className="mt-6">
                        {/* Credit / Debit Card */}
                        {paymentMethods[selected].type === "Credit / Debit Card" && (
                            <div className="space-y-4">
                                <input
                                    type="text"
                                    placeholder="Card Number"
                                    value={formData.cardNumber}
                                    onChange={(e) =>
                                        setFormData({ ...formData, cardNumber: e.target.value })
                                    }
                                    className="w-full p-3 border rounded-xl"
                                />
                                <div className="flex gap-4">
                                    <input
                                        type="text"
                                        placeholder="Expiry MM/YY"
                                        value={formData.cardExpiry}
                                        onChange={(e) =>
                                            setFormData({ ...formData, cardExpiry: e.target.value })
                                        }
                                        className="flex-1 p-3 border rounded-xl"
                                    />
                                    <input
                                        type="text"
                                        placeholder="CVV"
                                        value={formData.cardCvv}
                                        onChange={(e) =>
                                            setFormData({ ...formData, cardCvv: e.target.value })
                                        }
                                        className="flex-1 p-3 border rounded-xl"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Net Banking */}
                        {paymentMethods[selected].type === "Net Banking" && (
                            <select
                                value={formData.bank}
                                onChange={(e) =>
                                    setFormData({ ...formData, bank: e.target.value })
                                }
                                className="w-full p-3 border rounded-xl"
                            >
                                <option value="">Select Bank</option>
                                <option value="HDFC">HDFC Bank</option>
                                <option value="ICICI">ICICI Bank</option>
                                <option value="SBI">State Bank of India</option>
                                <option value="Axis">Axis Bank</option>
                            </select>
                        )}

                        {/* UPI / Wallet */}
                        {paymentMethods[selected].type === "UPI / Wallet" && (
                            <div className="space-y-4">
                                <input
                                    type="text"
                                    placeholder="Enter UPI ID"
                                    value={formData.upiId}
                                    onChange={(e) =>
                                        setFormData({ ...formData, upiId: e.target.value })
                                    }
                                    className="w-full p-3 border rounded-xl"
                                />
                            </div>
                        )}

                        {/* Cash on Delivery */}
                        {paymentMethods[selected].type === "Cash on Delivery" && (
                            <p className="text-gray-600 text-center py-4">
                                No additional details required for Cash on Delivery.
                            </p>
                        )}
                    </div>
                )}

                {/* Continue Button */}
                <div className="mt-6 text-center sm:text-right">
                    <button
                        onClick={() => {
                            console.log("Payment Data:", formData);
                            onClose();
                        }}
                        className="w-full sm:w-auto px-6 py-3 mt-4 sm:mt-0 bg-gradient-to-r from-blue-600 to-blue-400 text-white font-semibold rounded-2xl hover:from-blue-700 hover:to-blue-500 transition-all shadow-md"
                    >
                        Continue
                    </button>
                </div>
            </div>
        </div>
    );
}
