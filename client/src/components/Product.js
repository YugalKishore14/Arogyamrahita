import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import styles from "../css/product.module.css";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { productAPI } from "../services/Api";
import { GrCart } from "react-icons/gr";

function ProductCard({ product, onAddToCart, onBuyNow }) {
  const navigate = useNavigate();

  const lastVariant = product.variants && product.variants.length > 0
    ? product.variants[product.variants.length - 1]
    : null;

  const handleImageClick = () => {
    navigate(`/product/${product._id}`);
  }

  const getDisplayPrice = () => {
    if (lastVariant) {
      return lastVariant.newPrice;
    }
    return product.newPrice;
  };
  const getDisplayStock = () => {
    if (lastVariant) {
      return lastVariant.stock;
    }
    return product.stock;
  };

  return (
    <motion.div
      className={styles.prodCard}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{ cursor: "default" }}
    >
      <img
        src={product.image}
        alt={product.name}
        className={styles.productImage}
        onClick={handleImageClick}
        style={{ cursor: "pointer" }}
      />

      <div className={styles.productInfo}>
        <div className={styles.productNameRow}>
          <h3 className={styles.productName}>
            {product.name}
          </h3>
        </div>
        <div className={styles.productPrices}>
          <span className={styles.productPrice}>₹{getDisplayPrice()}</span>
          {lastVariant && lastVariant.oldPrice && lastVariant.oldPrice > lastVariant.newPrice ? (
            <span className={styles.productOldPrice}>₹{lastVariant.oldPrice}</span>
          ) : (
            product.oldPrice && product.oldPrice > product.newPrice ? (
              <span className={styles.productOldPrice}>₹{product.oldPrice}</span>
            ) : null
          )}
        </div>
        <p className={styles.productDescription}>
          {product.description
            ? product.description.split(" ").slice(0, 12).join(" ") +
            (product.description.split(" ").length > 12 ? "..." : "")
            : ""}
        </p>
      </div>

      <div className={styles.buttonGroup} onClick={e => e.stopPropagation()}>
        <motion.button
          whileHover={{
            scale: getDisplayStock() > 0 ? 1.05 : 1
          }}
          whileTap={{
            scale: getDisplayStock() > 0 ? 0.95 : 1
          }}
          onClick={() => getDisplayStock() > 0 && onBuyNow({ ...product, selectedVariant: lastVariant || null })}
          className={`${styles.buyBtn} ${getDisplayStock() <= 0 ? styles.disabledBtn : ''}`}
          disabled={getDisplayStock() <= 0}
        >
          {getDisplayStock() > 0 ? "Buy Now" : "Out of Stock"}
        </motion.button>

        {/* <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onAddToCart({ ...product, selectedVariant: lastVariant || null })}
          className={styles.cartBtn}
        >
          <GrCart className={styles.cartIcon} />
        </motion.button> */}
      </div>
    </motion.div>
  );
}

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAll, setShowAll] = useState(false);

  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const res = await productAPI.getAllProducts();

      if (res.success) {
        setProducts(res.products);
      } else {
        setError("Failed to fetch products");
      }
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Error loading products");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product) => {
    if (!isAuthenticated()) {
      // toast.info("Please sign up to add items to cart!");
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
      1
    );

    // toast.success("Added to cart!");
  };

  const handleBuyNow = (product) => {
    if (!isAuthenticated()) {
      navigate("/signup");
      return;
    }
    navigate(`/product/${product._id}`);
  };

  if (loading) {
    return (
      <section className={styles.productsSection}>
        <h2 className={styles.title}>Our Products</h2>
        <div className={styles.producterGrid}>
          {[1, 2, 3, 4].map((i) => (
            <motion.div
              key={i}
              className={styles.prodCard}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: i * 0.15 }}
            >
              <div className={styles.skeleton}></div>
              <h3>Loading...</h3>
              <div className={styles.productPrices}>
                <span>₹--</span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className={styles.productsSection}>
        <h2 className={styles.title}>Our Products</h2>
        <p className={styles.error}>{error}</p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={loadProducts}
          className={styles.retryBtn}
        >
          Retry
        </motion.button>
      </section>
    );
  }

  const PRODUCTS_TO_SHOW = 12;
  const visibleProducts = showAll ? products : products.slice(0, PRODUCTS_TO_SHOW);

  return (
    <section className={styles.productsSection}>
      <motion.h2
        className={styles.title}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Our Products
      </motion.h2>

      <div className={styles.producterGrid}>
        {visibleProducts.map((product, index) => (
          <ProductCard
            key={product._id}
            product={product}
            onAddToCart={handleAddToCart}
            onBuyNow={handleBuyNow}
            index={index}
          />
        ))}
      </div>
      {!showAll && products.length > PRODUCTS_TO_SHOW && (
        <button
          className={styles.showAllBtn}
          onClick={() => setShowAll(true)}
          style={{ margin: '2rem auto', display: 'block' }}
        >
          Show All Products
        </button>
      )}
    </section>
  );
}

export default Products;
