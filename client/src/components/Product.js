import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../css/product.module.css";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { productAPI } from "../services/Api";

const ProductCard = ({ product, onAddToCart, onBuyNow }) => (
  <div className={styles.prodCard}>
    <img src={product.image} alt={product.name} className={styles.productImage} />
    <h3 className={styles.productName}>{product.name}</h3>
    <div className={styles.productPrices}>
      <span className={styles.productPrice}>₹{product.newPrice}</span>
      {product.oldPrice && (
        <span className={styles.productOldPrice}>₹{product.oldPrice}</span>
      )}
    </div>
    <div className={styles.buttonGroup}>
      <button className={styles.buyBtn} onClick={() => onBuyNow(product)}>
        Buy Now
      </button>
      <button
        className={styles.cartBtn}
        onClick={() => onAddToCart(product)}
      >
        Add to Cart
      </button>
    </div>
  </div>
);

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

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
        setError('Failed to fetch products');
      }
    } catch (err) {
      setError('Error loading products');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product) => {
    if (!isAuthenticated()) {
      toast.info("Please sign up to add items to cart!");
      navigate('/signup');
      return;
    }

    addToCart({
      _id: product._id,
      name: product.name,
      newPrice: product.newPrice,
      oldPrice: product.oldPrice,
      image: product.image,
      category: product.category
    }, 1);

    toast.success("Added to cart!");
  };

  const handleBuyNow = (product) => {
    if (!isAuthenticated()) {
      toast.info("Please sign up to purchase products!");
      navigate('/signup');
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
            <div key={i} className={styles.prodCard}>
              <div className={styles.skeleton}></div>
              <h3>Loading...</h3>
              <div className={styles.productPrices}>
                <span>₹--</span>
              </div>
            </div>
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
        <button onClick={fetchProducts} className={styles.retryBtn}>
          Retry
        </button>
      </section>
    );
  }

  return (
    <section className={styles.productsSection}>
      <h2 className={styles.title}>Our Products</h2>
      <div className={styles.producterGrid}>
        {products.map((p) => (
          <ProductCard
            key={p._id}
            product={p}
            onAddToCart={handleAddToCart}
            onBuyNow={handleBuyNow}
          />
        ))}
      </div>
    </section>
  );
}

export default Products;
