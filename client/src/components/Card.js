import React from 'react'
import products from "../dummydata/CardData";
import { ShoppingCart } from "lucide-react";
import styles from "../css/ProductCard.module.css"
import { useCart } from "../context/CartContext";

const Card = () => {
    const { addToCart } = useCart();

    const handleAddToCart = (product) => {
        addToCart({
            _id: product.id,
            name: product.name,
            newPrice: product.price,
            oldPrice: product.oldPrice,
            image: product.imageUrl,
            category: 'organic'
        }, 1);
    };

    return (
        <div>
            <main className={styles.main}>
                <div className={styles.topBar}>
                    <h1 className={styles.pageTitle}>Organic Products</h1>
                    <div className={styles.sortSection}>
                        <span className={styles.productCount}>
                            Showing 1-12 of 100 Products
                        </span>
                        <div className={styles.sortWrapper}>
                            <span className={styles.sortLabel}>Sort by</span>
                            <select className={styles.sortSelect}>
                                <option className={styles.sortOption}>Most Popular</option>
                                <option className={styles.sortOption}>
                                    Price: Low to High
                                </option>
                                <option className={styles.sortOption}>
                                    Price: High to Low
                                </option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className={styles.productsGrid}>
                    {products.map((product) => (
                        <div key={product.id} className={styles.card}>
                            <div className={styles.saleBadge}>Sale</div>
                            <img
                                src={product.imageUrl}
                                alt={product.name}
                                className={styles.productImage}
                                onError={(e) => {
                                    e.target.src =
                                        "https://placehold.co/300x300/FACC15/FFFFFF?text=Placeholder";
                                }}
                            />
                            <div className={styles.cardBody}>
                                <div className={styles.priceWrapper}>
                                    <h3 className={styles.productName}>{product.name}</h3>
                                    <span className={styles.newPrice}>₹{product.price}</span>
                                    <span className={styles.oldPrice}>₹{product.oldPrice}</span>
                                </div>
                                <div className={styles.cardActions}>
                                    <button
                                        className={styles.cartButton}
                                        onClick={() => handleAddToCart(product)}
                                    >
                                        <ShoppingCart size={20} />
                                    </button>
                                    <button className={styles.buyButton}>Buy Now</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    )
}

export default Card
