import React, { useState } from "react";
import styles from "../css/ProductCard.module.css";
import { MdShoppingCart } from "react-icons/md";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const ProductCard = () => {
    const [quantity, setQuantity] = useState(1);
    const [activeThumbnail, setActiveThumbnail] = useState(0);

    const thumbnails = [
        "https://images.pexels.com/photos/33470544/pexels-photo-33470544.jpeg",
        "https://images.pexels.com/photos/20733042/pexels-photo-20733042.jpeg",
        "https://images.pexels.com/photos/33509841/pexels-photo-33509841.jpeg",
        "https://images.pexels.com/photos/33534114/pexels-photo-33534114.jpeg",
    ];

    const handleQuantityChange = (event) => {
        const value = parseInt(event.target.value, 10);
        if (!isNaN(value) && value > 0) {
            setQuantity(value);
        }
    };

    const handleThumbnailClick = (index) => {
        setActiveThumbnail(index);
    };

    return (
        <div className={styles.container}>
            <div className={styles.productCard}>
                {/* Product Image and Thumbnails Section */}
                <div className={styles.imageSection}>
                    <div className={styles.mainImageContainer}>
                        <img
                            src={thumbnails[activeThumbnail]}
                            alt="Lemon Pickel"
                            className={styles.mainImage}
                        />
                    </div>
                    <div className={styles.thumbnailContainer}>
                        <span
                            className={styles.thumbnailArrow}
                            onClick={() =>
                                setActiveThumbnail((prev) =>
                                    prev === 0 ? thumbnails.length - 1 : prev - 1
                                )
                            }
                        >
                            <FaChevronLeft className={styles.thumbnailArrowIcon} />
                        </span>
                        {thumbnails.map((src, index) => (
                            <img
                                key={index}
                                src={src}
                                alt={`Thumbnail ${index + 1}`}
                                className={`${styles.thumbnail} ${index === activeThumbnail ? "active" : ""
                                    }`}
                                onClick={() => handleThumbnailClick(index)}
                            />
                        ))}
                        <span
                            className={styles.thumbnailArrow}
                            onClick={() =>
                                setActiveThumbnail((prev) =>
                                    prev === thumbnails.length - 1 ? 0 : prev + 1
                                )
                            }
                        >
                            <FaChevronRight className={styles.thumbnailArrowIcon} />
                        </span>
                    </div>
                </div>

                {/* Product Details Section */}
                <div className={styles.detailsSection}>
                    <h1 className={styles.title}>Lemon Pickel</h1>
                    <p className={styles.description}>
                        Lemon pckel achar bhut acha hota h
                    </p>

                    <div className={styles.ratingContainer}>
                        <span className={styles.star}>★</span>
                        <span className={styles.star}>★</span>
                        <span className={styles.star}>★</span>
                        <span className={styles.star}>★</span>
                        <span className={styles.star}>☆</span>
                        <span className={styles.ratingsCount}>(250) Ratings</span>
                    </div>

                    <div className={styles.priceContainer}>
                        <span className={styles.currentPrice}>₹230</span>
                        <span className={styles.oldPrice}>₹230</span>
                        <span className={styles.discount}>50%OFF</span>
                    </div>

                    <div className={styles.deliveryDetails}>
                        <h3 style={{ fontWeight: "bold", marginBottom: "0.5rem" }}>
                            Delivery Details
                        </h3>
                        <p style={{ fontSize: "0.9rem" }}>
                            Check estimated delivery date/pickup option.
                        </p>
                    </div>

                    <div className={styles.quantitySelector}>
                        <span className={styles.quantityLabel}>Quantity:</span>
                        <div className={styles.quantityInputGroup}>
                            <button
                                className={styles.quantityButton}
                                onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                            >
                                -
                            </button>
                            <input
                                type="text"
                                className={styles.quantityInput}
                                value={quantity}
                                onChange={handleQuantityChange}
                            />
                            <button
                                className={styles.quantityButton}
                                onClick={() => setQuantity((prev) => prev + 1)}
                            >
                                +
                            </button>
                        </div>
                    </div>

                    <div className={styles.buttonContainer}>
                        <button className={styles.cartButton}>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                style={{ marginRight: "0.5rem" }}
                            >
                                <MdShoppingCart className={styles.cartIcon} />
                            </svg>
                            Add to Cart
                        </button>
                        <button className={styles.buyButton}>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                style={{ marginRight: "0.5rem" }}
                            >
                                <IoMdCheckmarkCircleOutline className={styles.checkmarkIcon} />
                            </svg>
                            Buy Now
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
