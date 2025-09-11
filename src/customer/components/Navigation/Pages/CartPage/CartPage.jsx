import React from "react";
import { useCart } from "../../../context/CartContext";
import { useAuth } from "../../../context/AuthContext";

export default function CartPage() {
    const { cart, removeFromCart, updateQuantity, checkout } = useCart();
    const { user } = useAuth();

    // Calculate total price
    const totalPrice = cart.reduce(
        (total, item) => total + item.price * item.quantity,
        0
    );

    if (cart.length === 0) {
        return <p className="text-center mt-12 text-lg">Your cart is empty!</p>;
    }

    return (
        <div className="max-w-4xl mx-auto mt-12 p-6">
            <h2 className="text-3xl font-bold mb-6">Your Cart</h2>

            <div className="space-y-4">
                {cart.map((item) => (
                    <div
                        key={item.productId}
                        className="flex justify-between items-center border rounded-lg p-4 shadow-sm"
                    >
                        {/* Product Info */}
                        <div>
                            <p className="font-semibold">{item.name}</p>
                            <p className="text-gray-600">{item.brand}</p>
                            <p className="text-gray-800 font-medium">${item.price}</p>
                        </div>

                        {/* Quantity Controls + Remove */}
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center border rounded">
                                <button
                                    onClick={() =>
                                        updateQuantity(item.productId, Math.max(item.quantity - 1, 1))
                                    }
                                    className="px-3 py-1 text-lg font-bold hover:bg-gray-100"
                                >
                                    −
                                </button>
                                <span className="px-4">{item.quantity}</span>
                                <button
                                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                                    className="px-3 py-1 text-lg font-bold hover:bg-gray-100"
                                >
                                    +
                                </button>
                            </div>

                            <button
                                onClick={() => removeFromCart(item.productId)}
                                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                            >
                                Remove
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Cart Summary */}
            <div className="mt-6 flex justify-between items-center border-t pt-4">
                <p className="text-xl font-bold">Total: ${totalPrice.toFixed(2)}</p>
                <button
                    onClick={checkout}
                    className="px-6 py-3 bg-orange-500 text-white font-bold rounded hover:bg-orange-600"
                >
                    Checkout
                </button>
            </div>
        </div>
    );
}
