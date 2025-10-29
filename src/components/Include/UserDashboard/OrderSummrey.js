"use client";
import React, { useState } from "react";
import { useSelector } from "react-redux";

const OrderSummary = () => {
    const { user } = useSelector((state) => state.me);

    // Local state for tracking info per order
    const [trackingData, setTrackingData] = useState({});

    // Track order function
    const handleTrackOrder = async (orderNumber, orderId) => {
        try {
            const res = await fetch(`/api/orders/track?order_id=${orderNumber}`);
            const data = await res.json();
            setTrackingData((prev) => ({ ...prev, [orderId]: data }));
        } catch (err) {
            console.error("Failed to fetch tracking info:", err);
        }
    };

    if (!user) return <p>Loading user...</p>;
    if (!user.orders?.length) return <p>No orders found.</p>;

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-800">Your Orders</h2>

            <ul className="space-y-6">
                {user.orders.map((order) => (
                    <li
                        key={order.id}
                        className="border rounded-xl shadow-sm hover:shadow-lg transition bg-white p-6"
                    >
                        {/* Header */}
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-3">
                            <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
                                <span className="font-semibold text-lg text-gray-800">
                                    {order.orderNumber || "N/A"}
                                </span>
                                <span
                                    className={`mt-2 md:mt-0 px-3 py-1 rounded-full font-medium text-sm ${order.status === "DELIVERED"
                                            ? "text-green-700 bg-green-100"
                                            : order.status === "SHIPPED"
                                                ? "text-blue-700 bg-blue-100"
                                                : "text-yellow-700 bg-yellow-100"
                                        }`}
                                >
                                    {order.status || "PROCESSING"}
                                </span>
                            </div>

                            <button
                                onClick={() => handleTrackOrder(order.orderNumber, order.id)}
                                className="mt-3 md:mt-0 px-4 py-2 cursor-pointer rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition"
                            >
                                Track Order
                            </button>
                        </div>

                        <p className="text-gray-500 text-sm mb-4">
                            Placed on {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "-"}
                        </p>

                        {/* Items */}
                        {order.items && order.items.length > 0 && (
                            <div className="space-y-3 mb-4">
                                {order.items.map((item) => (
                                    <div key={item.id} className="flex items-center space-x-4 border-t pt-3">
                                        <img
                                            src={item.image}
                                            alt={item.productName}
                                            className="w-16 h-16 object-cover rounded-lg"
                                        />
                                        <div className="flex-1">
                                            <p className="font-semibold text-gray-800">{item.productName}</p>
                                            <p className="text-gray-500 text-sm">
                                                Qty: {item.quantity} × {item.currencySymbol}{item.price}
                                            </p>
                                        </div>
                                        <div className="font-semibold text-gray-800">{item.total}</div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Totals */}
                        <div className="flex justify-end space-x-6 font-bold text-gray-800 mb-3">
                            <span>Subtotal: ₹{order.subtotal || 0}</span>
                            <span>Shipping: ₹{order.shippingCharges || 0}</span>
                            <span>Total: ₹{order.totalAmount || 0}</span>
                        </div>

                        {/* Tracking Info */}
                        {trackingData[order.id] && (
                            <div className="bg-gray-50 border rounded-lg p-3 text-sm text-gray-700">
                                <p><strong>Shipment Status:</strong> {trackingData[order.id].status || "Pending"}</p>
                                <p><strong>Estimated Delivery:</strong> {trackingData[order.id].estimatedDelivery || "N/A"}</p>
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default OrderSummary;
