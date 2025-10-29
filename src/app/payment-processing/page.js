"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const PaymentProcessingPage = () => {
    const router = useRouter();

    useEffect(() => {
        const order_id = new URLSearchParams(window.location.search).get("order_id");

        if (!order_id) return;

        fetch("/api/orders/verify", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ order_id }),
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    router.replace(`/payment-success?order_id=${order_id}`);
                } else {
                    router.replace(`/payment-failed?order_id=${order_id}`);
                }
            })
            .catch(err => {
                console.error("Verification error:", err);
                router.replace(`/payment-failed?order_id=${order_id}`);
            });
    }, [router]);

    return (
        <div className="flex items-center justify-center h-screen">
            <p className="text-lg font-medium">Processing your payment, please wait...</p>
        </div>
    );
};

export default PaymentProcessingPage;
