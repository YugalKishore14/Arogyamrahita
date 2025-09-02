import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { productAPI } from "../services/Api";
import { toast } from "react-toastify";
import styles from "../css/ProductDetail.module.css";
import Header from "../components/Header";
import Fotter from "../components/Fotter"

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const { addToCart } = useCart();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        if (id) {
            fetchProduct();
        }
    }, [id]);

    const fetchProduct = async () => {
        try {
            setLoading(true);
            const response = await productAPI.getProductById(id);
            if (response.success) {
                setProduct(response.product);
            } else {
                setError("Product not found");
            }
        } catch (err) {
            setError("Error loading product");
            console.error("Error fetching product:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = () => {
        if (!isAuthenticated()) {
            toast.info("Please sign up to add items to cart!");
            navigate("/signup");
            return;
        }

        addToCart(
            {
                _id: product._id,
                name: product.name,
                newPrice: product.newPrice,
                oldPrice: product.oldPrice,
                image: product.image,
                category: product.category,
            },
            quantity
        );

        toast.success("Added to cart!");
    };

    const handleBuyNow = () => {
        if (!isAuthenticated()) {
            toast.info("Please sign up to purchase products!");
            navigate("/signup");
            return;
        }

        addToCart(
            {
                _id: product._id,
                name: product.name,
                newPrice: product.newPrice,
                oldPrice: product.oldPrice,
                image: product.image,
                category: product.category,
            },
            quantity
        );

        navigate("/cart");
    };

    if (loading) {
        return (
            <div className={styles.container}>
                <div className={styles.loading}>
                    <div className={styles.skeleton}></div>
                    <div className={styles.skeleton}></div>
                    <div className={styles.skeleton}></div>
                </div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className={styles.container}>
                <div className={styles.error}>
                    <h2>Product Not Found</h2>
                    <p>{error || "The product you are looking for does not exist."}</p>
                    <button onClick={() => navigate("/")} className={styles.backBtn}>
                        Back to Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <>
            <Header />
            <div className={styles.container}>
                <div className={styles.productDetail}>
                    <div className={styles.productImages}>
                        <div className={styles.mainImage}>
                            <img src={product.image} alt={product.name} />
                        </div>
                    </div>

                    <div className={styles.productInfo}>
                        <h1 className={styles.productName}>{product.name}</h1>

                        <div className={styles.productCategory}>
                            <span>Category: {product.category}</span>
                        </div>

                        <div className={styles.productPrices}>
                            <span className={styles.currentPrice}>₹{product.newPrice}</span>
                            {product.oldPrice && product.oldPrice > product.newPrice && (
                                <span className={styles.oldPrice}>₹{product.oldPrice}</span>
                            )}
                        </div>

                        {product.oldPrice && product.oldPrice > product.newPrice && (
                            <div className={styles.discount}>
                                <span>Save ₹{product.oldPrice - product.newPrice}</span>
                            </div>
                        )}

                        <div className={styles.productDescription}>
                            <h3>Description</h3>
                            <p>{product.description}</p>
                        </div>

                        <div className={styles.stockInfo}>
                            <span>
                                Stock:{" "}
                                {product.stock > 0
                                    ? `${product.stock} available`
                                    : "Out of stock"}
                            </span>
                        </div>

                        <div className={styles.quantitySelector}>
                            <label>Quantity:</label>
                            <div className={styles.quantityControls}>
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    disabled={quantity <= 1}
                                >
                                    -
                                </button>
                                <span>{quantity}</span>
                                <button
                                    onClick={() => setQuantity(quantity + 1)}
                                    disabled={product.stock <= 0 || quantity >= product.stock}
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        <div className={styles.productActions}>
                            <button
                                className={styles.buyNowBtn}
                                onClick={handleBuyNow}
                                disabled={product.stock <= 0}
                            >
                                Buy Now
                            </button>
                            <button
                                className={styles.addToCartBtn}
                                onClick={handleAddToCart}
                                disabled={product.stock <= 0}
                            >
                                Add to Cart
                            </button>
                        </div>

                        {product.stock <= 0 && (
                            <p className={styles.outOfStock}>
                                This product is currently out of stock
                            </p>
                        )}
                    </div>
                </div>
            </div>
            <Fotter />
        </>
    );
};

export default ProductDetail;
