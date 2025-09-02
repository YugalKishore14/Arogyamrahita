import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../css/ProductsSection.js.module.css";
import { useCart } from "../context/CartContext";
import { productAPI } from "../services/Api";

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
        setError('Failed to fetch products');
      }
    } catch (err) {
      setError('Error loading products');
      console.error('Error fetching products:', err);
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

  if (loading) {
    return (
      <div className={styles.featuredProductsContainer}>
        <div className={styles.headerNavigation}>
          <h2 className={styles.sectionTitle}>Featured Products</h2>
        </div>
        <div className={styles.productCarousel}>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className={styles.productCard}>
              <div className={styles.productImageContainer}>
                <div className={styles.skeleton}></div>
              </div>
              <div className={styles.productContent}>
                <h3>Loading...</h3>
                <div className={styles.productPriceInfo}>
                  <span>₹--</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.featuredProductsContainer}>
        <div className={styles.headerNavigation}>
          <h2 className={styles.sectionTitle}>Featured Products</h2>
        </div>
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
          <button onClick={() => scroll("left")} className={styles.scrollButton}>
            ◀
          </button>
          <button
            onClick={() => scroll("right")}
            className={styles.scrollButton}
          >
            ▶
          </button>
        </div>
      </div>

      <div ref={scrollContainerRef} className={styles.productCarousel}>
        {products.map((product) => (
          <div key={product._id} className={styles.productCard}>
            <div className={styles.productImageContainer}>
              <img
                src={product.image}
                alt={product.name}
                className={styles.productImagese}
              />
              {product.oldPrice && product.oldPrice > product.newPrice && (
                <span className={`${styles.productBadge} ${styles.sale}`}>
                  Sale
                </span>
              )}
            </div>
            <div className={styles.productContent}>
              <h3 className={styles.productName}>{product.name}</h3>
              <div className={styles.productPriceInfo}>
                {product.oldPrice && product.oldPrice > product.newPrice && (
                  <span className={styles.oldPrice}>₹{product.oldPrice}</span>
                )}
                <span className={styles.currentPrice}>₹{product.newPrice}</span>
              </div>
              <div className={styles.productActions}>
                <button
                  className={styles.buyButton}
                  onClick={() => navigate(`/product/${product._id}`)}
                >
                  Buy Now
                </button>
                <button
                  className={styles.cartButton}
                  onClick={() => addToCart({
                    _id: product._id,
                    name: product.name,
                    newPrice: product.newPrice,
                    oldPrice: product.oldPrice,
                    image: product.image,
                    category: product.category
                  })}
                >
                  🛒
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
