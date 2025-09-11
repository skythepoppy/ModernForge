import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useOrders } from "../../context/OrderContext";

export default function OrdersPage() {
    const navigate = useNavigate();
    const { cart, checkout } = useCart();
    const { placeOrder } = useOrders();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    if (cart.length === 0) {
        return <p className="text-center mt-12 text-lg">Your cart is empty!</p>;
    }

    const totalPrice = cart.reduce(
        (total, item) => total + item.price * item.quantity,
        0
    );

    const handlePlaceOrder = async () => {
        setLoading(true);
        setError(null);
        try {
            // Call CartContext checkout to clear cart and create order
            await checkout();

            // Optional: save order in OrderContext for order history
            await placeOrder(cart);

            navigate("/orders/history"); // redirect to order history or confirmation
        } catch (err) {
            console.error(err);
            setError("Failed to place order. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto mt-12 p-6">
            <h2 className="text-3xl font-bold mb-6">Checkout</h2>

            <div className="space-y-4">
                {cart.map((item) => (
                    <div
                        key={item.productId}
                        className="flex justify-between items-center border rounded-lg p-4 shadow-sm"
                    >
                        <div>
                            <p className="font-semibold">{item.name}</p>
                            <p className="text-gray-600">{item.brand}</p>
                            <p className="text-gray-800 font-medium">
                                ${item.price} × {item.quantity} = ${(item.price * item.quantity).toFixed(2)}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-6 flex justify-between items-center border-t pt-4">
                <p className="text-xl font-bold">Total: ${totalPrice.toFixed(2)}</p>
                <button
                    onClick={handlePlaceOrder}
                    disabled={loading}
                    className="px-6 py-3 bg-orange-500 text-white font-bold rounded hover:bg-orange-600 disabled:opacity-50"
                >
                    {loading ? "Placing Order..." : "Place Order"}
                </button>
            </div>

            {error && <p className="text-red-500 mt-4">{error}</p>}
        </div>
    );
}