import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "../css/product.module.css";
import image from "../images/mango.png";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

// Dummy Products Data
const products = [
  { id: 1, name: "Mango Pickle", price: "₹230", oldPrice: "₹290", image: image },
  { id: 2, name: "Lemon Pickle", price: "₹200", oldPrice: "₹250", image: image },
  { id: 3, name: "Chili Pickle", price: "₹180", oldPrice: "₹220", image: image },
  { id: 4, name: "Mixed Pickle", price: "₹240", oldPrice: "₹300", image: image },
];

// Product Card Component
const ProductCard = ({ product, onAddToCart, onBuyNow }) => (
  <div className={styles.prodCard}>
    <img src={product.image} alt={product.name} className={styles.productImage} />
    <h3 className={styles.productName}>{product.name}</h3>
    <div className={styles.productPrices}>
      <span className={styles.productPrice}>{product.price}</span>
      <span className={styles.productOldPrice}>{product.oldPrice}</span>
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

// Main Products Component
function Products() {
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleAddToCart = (product) => {
    if (!isAuthenticated()) {
      toast.info("Please sign up to add items to cart!");
      navigate('/signup');
      return;
    }

    addToCart({
      _id: product.id,
      name: product.name,
      newPrice: parseInt(product.price.replace('₹', '')),
      oldPrice: parseInt(product.oldPrice.replace('₹', '')),
      image: product.image,
      category: 'pickle'
    }, 1);

    toast.success("Added to cart!");
  };

  const handleBuyNow = (product) => {
    if (!isAuthenticated()) {
      toast.info("Please sign up to purchase products!");
      navigate('/signup');
      return;
    }

    // Add to cart and navigate to checkout
    addToCart({
      _id: product.id,
      name: product.name,
      newPrice: parseInt(product.price.replace('₹', '')),
      oldPrice: parseInt(product.oldPrice.replace('₹', '')),
      image: product.image,
      category: 'pickle'
    }, 1);

    navigate('/cart');
  };

  return (
    <section className={styles.productsSection}>
      <h2 className={styles.title}>Our Products</h2>
      <div className={styles.producterGrid}>
        {products.map((p) => (
          <ProductCard
            key={p.id}
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
