import React, { createContext, useContext, useState } from "react";
import AuthContext from "./AuthContext";
import { useNavigate } from "react-router-dom";


// initialize the context
const CartContext = createContext();

//custom hook 
export const useCart = () => useContext(CartContext);

// cart provider component
export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();


    // -- add item to cart -- 
    const addToCart = (product) => {
        if (!user) {
            //verify only registered users can add to cart
            navigate("/login");
            return;
        }

        setCart((prevCart) => {
            const existingItem = prevCart.find((item) => item.productId === product.productId);
            if (existingItem) {
                return prevCart.map((item) =>
                    item.productId === product.productId ? { ...item, quantity: item.quantity + 1 } : item);
            } else {
                return [...prevCart, { ...product, quantity: 1 }];
            }
        });
    };

    // -- remove item from cart --
    const removeFromCart = (productId) => {
        setCart((prevCart) => prevCart.filter((item) => item.productId !== productId));
    };

    // -- update quantity of an item --
    const updateQuantity = (productId, quantity) => {
        if (quantity <= 0) {
            removeFromCart(productId);
            return;
        }

        setCart((prevCart) =>
            prevCart.map((item) =>
                item.productId === productId ? { ...item, quantity } : item
            )
        );
    };

    // Clear the entire cart
    const clearCart = () => setCart([]);

    return (
        <CartContext.Provider
            value={{
                cart,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};


