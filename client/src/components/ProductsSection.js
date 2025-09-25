import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import styles from "../css/ProductsSection.js.module.css";
import { useCart } from "../context/CartContext";
import { productAPI } from "../services/Api";
import { GrCart } from "react-icons/gr";
import { FaAnglesRight, FaAnglesLeft } from "react-icons/fa6";

export default function FeaturedProductsSection() {
  const scrollContainerRef = useRef(null);
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productAPI.getAllProducts();
      if (response.success) {
        setProducts(response.products);
      } else {
        setError("Failed to fetch products");
      }
    } catch (err) {
      setError("Error loading products");
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 320;
      scrollContainerRef.current.scrollLeft +=
        direction === "left" ? -scrollAmount : scrollAmount;
    }
  };

  const getDisplayPrice = (product) => {
    const lastVariant = product.variants && product.variants.length > 0
      ? product.variants[product.variants.length - 1]
      : null;
    return lastVariant ? lastVariant.newPrice : product.newPrice;
  };

  const getDisplayOldPrice = (product) => {
    const lastVariant = product.variants && product.variants.length > 0
      ? product.variants[product.variants.length - 1]
      : null;
    if (lastVariant) {
      return lastVariant.oldPrice && lastVariant.oldPrice > lastVariant.newPrice
        ? lastVariant.oldPrice
        : null;
    }
    return product.oldPrice && product.oldPrice > product.newPrice
      ? product.oldPrice
      : null;
  };

  if (loading) {
    return (
      <div className={styles.featuredProductsContainer}>
        <motion.div
          className={styles.headerNavigation}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className={styles.sectionTitle}>Featured Products</h2>
        </motion.div>
        <div className={styles.productCarousel}>
          {[1, 2, 3, 4].map((i) => (
            <motion.div
              key={i}
              className={styles.productCard}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: i * 0.15 }}
            >
              <div className={styles.productImageContainer}>
                <div className={styles.skeleton}></div>
              </div>
              <div className={styles.productContent}>
                <h3>Loading...</h3>
                <div className={styles.productPriceInfo}>
                  <span>₹--</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.featuredProductsContainer}>
        <motion.div
          className={styles.headerNavigation}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <h2 className={styles.sectionTitle}>Featured Products</h2>
        </motion.div>
        <p className={styles.error}>{error}</p>
        <button onClick={fetchProducts} className={styles.retryBtn}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className={styles.featuredProductsContainer}>
      <div className={styles.headerNavigation}>
        <h2 className={styles.sectionTitle}>Featured Products</h2>
        <div className={styles.navigationButtons}>
          <button
            onClick={() => scroll("left")}
            className={styles.scrollButton}
          >
            <FaAnglesLeft />
          </button>
          <button
            onClick={() => scroll("right")}
            className={styles.scrollButton}
          >
            <FaAnglesRight />
          </button>
        </div>
      </div>

      <motion.div
        ref={scrollContainerRef}
        className={styles.productCarousel}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7 }}
      >
        {products.map((product) => (
          <motion.div
            key={product._id}
            className={styles.productCard}
          >
            <div className={styles.productImageContainer}>
              <motion.img
                src={product.image || "/placeholder.png"}
                alt={product.name || "Product"}
                className={styles.productImagese}
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.3 }}
                onClick={() => navigate(`/product/${product._id}`)}
                style={{ cursor: "pointer" }}
              />

              {getDisplayOldPrice(product) && (
                <span className={`${styles.productBadge} ${styles.sale}`}>
                  Sale
                </span>
              )}
            </div>
            <div className={styles.productContent}>
              <h3 className={styles.productName}>
                {product.name}{" "}
                <span style={{ fontSize: "1rem", color: "#1f1f1fff" }}>
                  {product.weight ?? ""} {product.weightUnit ?? ""}
                </span>
              </h3>
              <div className={styles.productPriceInfo}>
                {getDisplayOldPrice(product) && (
                  <span className={styles.oldPrice}>₹{getDisplayOldPrice(product)}</span>
                )}
                <span className={styles.currentPrice}>₹{getDisplayPrice(product)}</span>
              </div>
              <p>
                {product.description
                  ? product.description.split(" ").slice(0, 20).join(" ") +
                  (product.description.split(" ").length > 20 ? "..." : "")
                  : "No description available."}
              </p>
              <div className={styles.productActions}>
                <motion.button
                  className={styles.buyButton}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => navigate(`/product/${product._id}`)}
                >
                  Buy Now
                </motion.button>
                {/* <motion.button
                  className={styles.cartButton}
                  whileTap={{ scale: 0.9 }}
                  onClick={() =>
                    addToCart({
                      _id: product._id,
                      name: product.name,
                      newPrice: getDisplayPrice(product),
                      oldPrice: getDisplayOldPrice(product),
                      image: product.image,
                      category: product.category,
                      selectedVariant: product.variants?.[product.variants.length - 1] || null,
                    })
                  }
                >
                  <GrCart />
                </motion.button> */}
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
