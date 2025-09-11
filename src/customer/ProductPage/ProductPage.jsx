import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@mui/material";
import { useCart } from "../components/context/CartContext";
import { useAuth } from "../components/context/AuthContext";

export default function ProductPage() {
    const navigate = useNavigate();
    const { productId } = useParams();
    const location = useLocation();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { addToCart } = useCart(); // use CartContext
    const { user } = useAuth(); // use AuthContext

    // DB column mapping
    const categoryMap = {
        airplane: "Aircrafts",
        ship: "Watercrafts",
        automobile: "Automobiles",
        programmable: "Programmables",
    };
    const statusMap = {
        active: "In Stock",
        new_release: "New Release",
    };

    // Fetch single product
    useEffect(() => {
        async function fetchProduct() {
            try {
                const response = await fetch("http://localhost:5050/api/toys");
                const data = await response.json();
                const selectedProduct = data.find(
                    (item) => item.id.toString() === productId
                );
                setProduct(selectedProduct);
            } catch (err) {
                console.error("Error fetching product:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchProduct();
    }, [productId]);

    if (loading) return <p className="p-6">Loading product...</p>;
    if (error) return <p className="p-6 text-red-500">Error: {error}</p>;
    if (!product) return <p className="p-6">Product not found</p>;

    const { price, discountedPrice } = product;

    const handleAddToCart = async () => {
        if (!user) {
            navigate("/login");
            return;
        }

        await addToCart({
            productId: product.id,
            name: product.item,
            price: discountedPrice || price,
            brand: product.brand,
        });

        alert(`${product.item} added to cart`);
    };

    const handleBuyNow = async () => {
        if (!user) {
            navigate("/login");
            return;
        }

        await addToCart({
            productId: product.id,
            name: product.item,
            price: discountedPrice || price,
            brand: product.brand,
        });

        navigate("/checkout"); 
    };

    // Dynamic breadcrumb using location.state
    const { previousPageLabel, previousPagePath } = location.state || {};

    return (
        <div className="max-w-6xl mx-auto p-6">
            {/* Breadcrumb */}
            <div className="text-gray-500 text-sm mb-6 flex justify-center pb-8">
                <span
                    className="cursor-pointer hover:underline"
                    onClick={() => navigate("/")}
                >
                    Home
                </span>

                {previousPageLabel && previousPagePath ? (
                    <>
                        {" > "}
                        <span
                            className="cursor-pointer hover:underline"
                            onClick={() => navigate(previousPagePath)}
                        >
                            {previousPageLabel}
                        </span>
                        {" > "}
                    </>
                ) : (
                    " > "
                )}

                <span className="font-bold">{product.item}</span>
            </div>

            {/* Grid for product image + info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Product Image */}
                <div className="rounded-2xl overflow-hidden shadow-lg">
                    <img
                        src={product.imageUrl}
                        alt={product.item}
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Product Info */}
                <div>
                    <h1 className="text-3xl font-bold">{product.item}</h1>
                    {discountedPrice ? (
                        <p className="text-xl font-semibold text-gray-900 mt-2">
                            <span className="line-through mr-2">
                                ${price.toFixed(2)}
                            </span>
                            <span className="text-orange-500">
                                ${discountedPrice.toFixed(2)}
                            </span>
                        </p>
                    ) : (
                        <p className="text-xl font-semibold text-gray-900 mt-2">
                            ${price.toFixed(2)}
                        </p>
                    )}
                    <p className="mt-4 text-gray-700">{product.description}</p>
                    <p className="mt-2 text-gray-500">Brand: {product.brand}</p>
                    <p className="mt-1 text-gray-500">
                        Category: {categoryMap[product.category] || product.category}
                    </p>
                    {product.status && (
                        <p className="mt-1 text-gray-500">
                            Status: {statusMap[product.status] || product.status}
                        </p>
                    )}

                    <div className="flex gap-4 mt-6">
                        <Button
                            variant="contained"
                            onClick={handleAddToCart}
                            sx={{
                                bgcolor: "#F97316",
                                color: "white",
                                "&:hover": { bgcolor: "#EA580C" },
                            }}
                        >
                            Add to Cart
                        </Button>

                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={handleBuyNow}
                        >
                            Buy Now
                        </Button>
                    </div>

                    <div className="mt-10">
                        <h2 className="text-2xl font-semibold mb-3">Customer Reviews</h2>
                        <p className="text-gray-500">Reviews coming soon...</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
