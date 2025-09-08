import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import styles from "../css/product.module.css";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { productAPI } from "../services/Api";

function ProductCard({ product, onAddToCart, onBuyNow }) {
  return (
    <motion.div
      className={styles.prodCard}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <motion.img
        src={product.image}
        alt={product.name}
        className={styles.productImage}
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.3 }}
      />

      <h3 className={styles.productName}>{product.name}</h3>

      <div className={styles.productPrices}>
        <span className={styles.productPrice}>₹{product.newPrice}</span>
        {product.oldPrice && (
          <span className={styles.productOldPrice}>₹{product.oldPrice}</span>
        )}
      </div>

      <div className={styles.buttonGroup}>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onBuyNow(product)}
          className={styles.buyBtn}
        >
          Buy Now
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onAddToCart(product)}
          className={styles.cartBtn}
        >
          🛒
        </motion.button>
      </div>
    </motion.div>
  );
}

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
      1
    );

    toast.success("Added to cart!");
  };

  const handleBuyNow = (product) => {
    if (!isAuthenticated()) {
      toast.info("Please sign up to purchase products!");
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
        {products.map((product, index) => (
          <ProductCard
            key={product._id}
            product={product}
            onAddToCart={handleAddToCart}
            onBuyNow={handleBuyNow}
            index={index}
          />
        ))}
      </div>
    </section>
  );
}

export default Products;
