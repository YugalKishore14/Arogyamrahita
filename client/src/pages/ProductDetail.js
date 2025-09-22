import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { productAPI } from "../services/Api";
import { toast } from "react-toastify";
import styles from "../css/ProductDetail.module.css";
import { motion } from "framer-motion";

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
        <motion.div
          className={styles.error}
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h2>Product Not Found</h2>
          <p>{error || "The product you are looking for does not exist."}</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/")}
            className={styles.backBtn}
          >
            Back to Home
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <motion.div
        className={styles.container}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          className={styles.productDetail}
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className={styles.productImages}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className={styles.mainImage}>
              <img src={product.image} alt={product.name} />
            </div>
          </motion.div>

          <motion.div
            className={styles.productInfo}
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              className={styles.nameRow}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h1 className={styles.productName}>{product.name}</h1>
              <span className={styles.productWeight}>
                {product.weight} {product.weightUnit}
              </span>
            </motion.div>

            <div className={styles.productPrices}>
              <span className={styles.currentPrice}>₹{product.newPrice}</span>
              {product.oldPrice && product.oldPrice > product.newPrice && (
                <span className={styles.oldPrice}>₹{product.oldPrice}</span>
              )}
            </div>

            {product.oldPrice && product.oldPrice > product.newPrice && (
              <motion.div
                className={styles.discount}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <span>Save ₹{product.oldPrice - product.newPrice}</span>
              </motion.div>
            )}

            <motion.div
              className={styles.productDescription}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <h3>Description</h3>
              <p>{product.description}</p>
            </motion.div>

            <motion.div
              className={styles.quantitySelector}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
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
            </motion.div>

            <motion.div
              className={styles.productActions}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <motion.button
                className={styles.buyNowBtn}
                onClick={handleBuyNow}
                disabled={product.stock <= 0}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Buy Now
              </motion.button>
              <motion.button
                className={styles.addToCartBtn}
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Add to Cart
              </motion.button>
            </motion.div>

            {product.stock <= 0 && (
              <motion.p
                className={styles.outOfStock}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                This product is currently out of stock
              </motion.p>
            )}
          </motion.div>
        </motion.div>
      </motion.div>
    </>
  );
};

export default ProductDetail;
