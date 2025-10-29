"use client";

import React from "react";
import { useRouter } from "next/navigation";

const PaymentFailedPage = () => {
    const router = useRouter();

    const order_id = typeof window !== "undefined"
        ? new URLSearchParams(window.location.search).get("order_id")
        : null;

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-red-50">
            <h1 className="text-3xl font-bold text-red-600 mb-4">Payment Failed</h1>
            <p className="text-lg text-gray-700 mb-6">
                Sorry, your payment for order <strong>{order_id}</strong> could not be completed.
            </p>
            <button
                onClick={() => router.push("/cart")}
                className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
            >
                Go Back to Cart
            </button>
        </div>
    );
};

export default PaymentFailedPage;
