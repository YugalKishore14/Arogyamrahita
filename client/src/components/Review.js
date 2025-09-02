import React, { useRef } from "react";
import styles from "../css/review.module.css";

const product1 = "https://placehold.co/400x400/D0D8CF/000000?text=Product+1";
const product2 = "https://placehold.co/400x400/D0D8CF/000000?text=Product+2";
const product3 = "https://placehold.co/400x400/D0D8CF/000000?text=Product+3";

const ReviewProducts = () => {
  const productGridRef = useRef(null);

  const products = [
    { id: 1, name: "Organic Shampoo", image: product1, review: "Makes hair silky and smooth!" },
    { id: 2, name: "Herbal Face Wash", image: product2, review: "Cleans deeply and feels refreshing." },
    { id: 3, name: "Natural Cream", image: product3, review: "Very moisturizing, great for dry skin." },
    { id: 4, name: "Herbal Oil", image: product1, review: "Soothes scalp and promotes growth." },
    { id: 5, name: "Organic Soap", image: product2, review: "Gentle on skin, smells amazing." },
    { id: 6, name: "Aloe Gel", image: product3, review: "Cool and refreshing for the skin." },
    { id: 7, name: "Hair Serum", image: product1, review: "Reduces frizz and adds shine." },
  ];

  const scroll = (direction) => {
    if (productGridRef.current) {
      const card = productGridRef.current.querySelector(`.${styles.reviewCard}`);
      const scrollAmount = card ? card.offsetWidth + 20 : 280;
      productGridRef.current.scrollLeft += direction === "left" ? -scrollAmount : scrollAmount;
    }
  };

  return (
    <div className={styles.featuredContainer}>
      <div className={styles.featuredHeader}>
        <h2>Customer Reviews</h2>
        <div className={styles.arrows}>
          <button className={styles.arrowBtn} onClick={() => scroll("left")}>◀</button>
          <button className={styles.arrowBtn} onClick={() => scroll("right")}>▶</button>
        </div>
      </div>

      <div className={styles.productGrid} ref={productGridRef}>
        {products.map((product) => (
          <div className={styles.reviewCard} key={product.id}>
            <img src={product.image} alt={product.name} />
            <div className={styles.stars}>
              {[...Array(5)].map((_, i) => (
                <span key={i} className={styles.star}>★</span>
              ))}
            </div>
            <h3>{product.name}</h3>
            <p className={styles.reviewText}>"{product.review}"</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewProducts;
