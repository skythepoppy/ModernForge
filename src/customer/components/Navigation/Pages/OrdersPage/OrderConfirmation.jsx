import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function OrderConfirmation() {
    const { state } = useLocation();
    const navigate = useNavigate();
    const order = state?.order;

    if (!order) {
        return <p className="text-center mt-12 text-lg">No order found.</p>;
    }

    return (
        <div className="max-w-4xl mx-auto mt-12 p-6 text-center">
            <h2 className="text-3xl font-bold mb-6 text-green-600">Your order has been placed!</h2>

            <p className="text-lg mb-4">Order ID: <strong>{order.id}</strong></p>
            <p className="text-lg mb-6">Shipping Address: <strong>{order.shippingAddress || "123 Main St, City, State"}</strong></p>

            <div className="space-y-4 mb-6">
                {order.items.map(item => (
                    <div key={item.productId} className="flex justify-between border rounded-lg p-4 shadow-sm">
                        <p>{item.name}</p>
                        <p>{item.quantity} × ${item.price}</p>
                    </div>
                ))}
            </div>

            <p className="text-xl font-bold">Total: ${order.items.reduce((sum, i) => sum + i.price * i.quantity, 0).toFixed(2)}</p>

            <button
                onClick={() => navigate("/")}
                className="mt-6 px-6 py-3 bg-orange-500 text-white font-bold rounded hover:bg-orange-600"
            >
                Back to Home
            </button>
        </div>
    );
}
