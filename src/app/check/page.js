"use client";
import React from "react";
import { load } from "@cashfreepayments/cashfree-js";

export default function CashfreeCheckoutButton() {
    const handleClick = async () => {
        try {
            // 1️⃣ Call your backend to create order
            const res = await fetch("/api/orders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ amount: "1" }),
            });
            const data = await res.json();

            if (!data.sessionId) {
                throw new Error("No session ID returned");
            }

            // 2️⃣ Load Cashfree SDK
            const cashfree = await load({ mode: "sandbox" }); // or "production"

            // 3️⃣ Open checkout
            cashfree.checkout({
                paymentSessionId: data.sessionId,
                redirectTarget: "_self", // open in same tab
            });
        } catch (err) {
            console.error("Checkout error:", err);
        }
    };

    return (
        <div className="flex justify-center items-center">
            <button
                onClick={handleClick}
                className="cursor-pointer bg-gradient-to-r from-gray-800 to-gray-600 text-white font-semibold px-8 py-4 rounded-xl shadow-lg hover:scale-105 hover:shadow-2xl transition-transform duration-300"
            >
                Place order
            </button>
        </div>
    );
}
