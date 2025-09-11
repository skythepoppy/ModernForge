import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "./AuthContext";
import api from "../api/api";

// initialize the context
const CartContext = createContext();

// custom hook
export const useCart = () => useContext(CartContext);

// provider
export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    // --- fetch cart from backend whenever user logs in ---
    useEffect(() => {
        if (user) {
            fetchCart();
        } else {
            setCart([]); // reset when logged out
        }
    }, [user]);

    const fetchCart = async () => {
        if (!user) return;
        setError(null);
        try {
            const res = await api.get("/cart");
            setCart(res.data);
        } catch (err) {
            console.error("Failed to fetch cart:", err);
            setError("Failed to fetch cart. Please try again.");
        }
    };

    // --- add item to cart ---
    const addToCart = async (product) => {
        if (!user) {
            navigate("/login");
            return { success: false, error: "User not logged in" };
        }

        setError(null);

        try {
            const res = await api.post("/cart", {
                productId: product.productId,
                quantity: 1,
            });
            setCart(res.data);
            return { success: true, cart: res.data };
        } catch (err) {
            console.error("Failed to add to cart:", err);
            setError("Failed to add item to cart. Please try again.");
            return { success: false, error: err };
        }
    };

    // --- remove item from cart ---
    const removeFromCart = async (productId) => {
        setError(null);
        try {
            const res = await api.delete(`/cart/${productId}`);
            setCart(res.data);
            return { success: true, cart: res.data };
        } catch (err) {
            console.error("Failed to remove from cart:", err);
            setError("Failed to remove item from cart. Please try again.");
            return { success: false, error: err };
        }
    };

    // --- update item quantity ---
    const updateQuantity = async (productId, quantity) => {
        if (quantity <= 0) return removeFromCart(productId);

        setError(null);

        try {
            const res = await api.put(`/cart/${productId}`, { quantity });
            setCart(res.data);
            return { success: true, cart: res.data };
        } catch (err) {
            console.error("Failed to update quantity:", err);
            setError("Failed to update item quantity. Please try again.");
            return { success: false, error: err };
        }
    };

    // --- clear entire cart ---
    const clearCart = async () => {
        setError(null);
        try {
            await api.delete("/cart");
            setCart([]);
            return { success: true };
        } catch (err) {
            console.error("Failed to clear cart:", err);
            setError("Failed to clear cart. Please try again.");
            return { success: false, error: err };
        }
    };

    // --- checkout ---
    const checkout = async () => {
        if (!user) {
            setError("You must be logged in to place an order");
            return { success: false, error: "User not logged in" };
        }

        setError(null);
        setLoading(true);

        try {
            const order = {
                userId: user.id,
                items: cart.map((item) => ({
                    productId: item.productId,
                    quantity: item.quantity,
                })),
            };

            await api.post("/orders", order);
            await clearCart();
            alert("Order placed successfully!");
            return { success: true };
        } catch (err) {
            console.error("Checkout failed:", err);
            setError("Failed to place order. Please try again.");
            return { success: false, error: err };
        } finally {
            setLoading(false);
        }
    };

    return (
        <CartContext.Provider
            value={{
                cart,
                loading,
                error,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                fetchCart,
                checkout,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};
