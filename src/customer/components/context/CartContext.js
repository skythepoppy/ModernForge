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
        try {
            const res = await api.get("/cart");
            setCart(res.data);
        } catch (err) {
            console.error("Failed to fetch cart:", err);
        }
    };

    // --- add item to cart ---
    const addToCart = async (product) => {
        if (!user) {
            navigate("/login");
            return;
        }

        try {
            const res = await api.post("/cart", {
                productId: product.productId,
                quantity: 1,
            });
            setCart(res.data); // backend returns updated cart
        } catch (err) {
            console.error("Failed to add to cart:", err);
        }
    };

    // --- remove item from cart ---
    const removeFromCart = async (productId) => {
        try {
            const res = await api.delete(`/cart/${productId}`);
            setCart(res.data);
        } catch (err) {
            console.error("Failed to remove from cart:", err);
        }
    };

    // --- update item quantity ---
    const updateQuantity = async (productId, quantity) => {
        if (quantity <= 0) {
            return removeFromCart(productId);
        }

        try {
            const res = await api.put(`/cart/${productId}`, { quantity });
            setCart(res.data);
        } catch (err) {
            console.error("Failed to update quantity:", err);
        }
    };

    // --- clear entire cart ---
    const clearCart = async () => {
        try {
            await api.delete("/cart");
            setCart([]);
        } catch (err) {
            console.error("Failed to clear cart:", err);
        }
    };

    // -- checkout --
    const checkout = async () => {
        if (!user) {
            alert("You must be logged in to place an order");
            return;
        }

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
        } catch (err) {
            console.error("Checkout failed:", err);
            alert("Something went wrong. Please try again.");
        }
    };

    return (
        <CartContext.Provider
            value={{
                cart,
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
