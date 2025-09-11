import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import api from "../api/api";

const OrderContext = createContext();

export const useOrders = () => useContext(OrderContext);

export const OrderProvider = ({ children }) => {
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch orders whenever the user logs in
    useEffect(() => {
        if (user) {
            fetchOrders();
        } else {
            setOrders([]);
        }
    }, [user]);

    const fetchOrders = async () => {
        if (!user) return;
        setLoading(true);
        try {
            const res = await api.get("/orders");
            setOrders(res.data);
        } catch (err) {
            console.error("Failed to fetch orders:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const placeOrder = async (cartItems) => {
        if (!user) throw new Error("User must be logged in to place an order");
        try {
            const res = await api.post("/orders", {
                userId: user.id,
                items: cartItems.map(item => ({
                    productId: item.productId,
                    quantity: item.quantity,
                })),
            });
            setOrders((prev) => [...prev, res.data]); // append new order
            return res.data;
        } catch (err) {
            console.error("Failed to place order:", err);
            throw err;
        }
    };

    return (
        <OrderContext.Provider value={{ orders, loading, error, fetchOrders, placeOrder }}>
            {children}
        </OrderContext.Provider>
    );
};
