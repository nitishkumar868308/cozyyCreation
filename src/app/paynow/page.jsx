// app/paynow/page.jsx
"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

const methods = [
    { name: "Credit / Debit Card", description: "Pay securely using your credit or debit card.", color: "from-yellow-300 to-yellow-100", icon: "💳" },
    { name: "UPI / Wallet", description: "Pay using Google Pay, PhonePe, Paytm, etc.", color: "from-green-300 to-green-100", icon: "🟢" },
    { name: "Cash on Delivery", description: "Pay when the order is delivered.", color: "from-gray-300 to-gray-100", icon: "💵" },
];

const PayNow = () => {
    const searchParams = useSearchParams();
    const [selectedMethod, setSelectedMethod] = useState("");

    useEffect(() => {
        const method = searchParams.get("method");
        if (method) setSelectedMethod(method);
    }, [searchParams]);

    const handlePayment = () => {
        if (!selectedMethod) return alert("Select a payment method first!");
        alert(`Proceeding with ${selectedMethod}`);
    };

    return (
        <div className=" bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col items-center py-10 px-4">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-10 text-gray-800 text-center">
                Complete Your Payment
            </h2>

            {/* Payment Methods */}
            <div className="flex gap-5 overflow-x-auto w-full max-w-4xl pb-6 justify-center">
                {methods.map((method) => {
                    const isSelected = selectedMethod === method.name;
                    return (
                        <div
                            key={method.name}
                            onClick={() => setSelectedMethod(method.name)}
                            className={`
          flex-shrink-0 w-44 sm:w-52 p-6 rounded-2xl cursor-pointer transform transition
          ${isSelected ? "scale-105 shadow-2xl border-2 border-blue-500" : "hover:scale-105 hover:shadow-xl"}
          bg-gradient-to-br ${method.color}
          flex flex-col items-center justify-center
        `}
                        >
                            <div className="text-5xl mb-4">{method.icon}</div>
                            <h3 className="text-lg md:text-xl font-semibold text-gray-900 text-center">{method.name}</h3>
                        </div>
                    );
                })}
            </div>


            {/* Payment Details */}
            {selectedMethod && (
                <div className="mt-8 w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 flex flex-col gap-6">
                    <h3 className="text-2xl font-bold">{selectedMethod}</h3>
                    <p className="text-gray-700">{methods.find((m) => m.name === selectedMethod)?.description}</p>

                    {/* Payment Inputs */}
                    {selectedMethod === "Credit / Debit Card" && (
                        <div className="flex flex-col gap-4">
                            <input
                                type="text"
                                placeholder="Card Number"
                                className="border p-4 rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none"
                            />
                            <div className="flex gap-4">
                                <input
                                    type="text"
                                    placeholder="Expiry (MM/YY)"
                                    className="border p-4 rounded-xl flex-1 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                                />
                                <input
                                    type="text"
                                    placeholder="CVV"
                                    className="border p-4 rounded-xl w-28 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                                />
                            </div>
                        </div>
                    )}

                    {selectedMethod === "UPI / Wallet" && (
                        <div className="flex flex-col gap-3">
                            <p className="text-gray-600">Scan QR or enter UPI ID</p>
                            <input
                                type="text"
                                placeholder="UPI ID"
                                className="border p-4 rounded-xl focus:ring-2 focus:ring-green-400 focus:outline-none"
                            />
                        </div>
                    )}

                    {selectedMethod === "Cash on Delivery" && (
                        <p className="text-gray-600">You will pay when the order is delivered to your address.</p>
                    )}

                    <button
                        onClick={handlePayment}
                        className="mt-4 py-4 w-full cursor-pointer bg-gradient-to-r from-gray-500 to-gray-600 text-white font-bold rounded-2xl hover:from-gray-600 hover:to-gray-900 transition-all shadow-lg"
                    >
                        Pay Now
                    </button>
                </div>
            )}
        </div>
    );
};

export default PayNow;
