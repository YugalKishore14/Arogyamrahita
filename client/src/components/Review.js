import React, { useRef } from "react";
import { motion } from "framer-motion";
import styles from "../css/review.module.css";

const product1 = "https://placehold.co/400x400/D0D8CF/000000?text=Product+1";
const product2 = "https://placehold.co/400x400/D0D8CF/000000?text=Product+2";
const product3 = "https://placehold.co/400x400/D0D8CF/000000?text=Product+3";

const ReviewProducts = () => {
  const productGridRef = useRef(null);

const products = [
  { 
    id: 1, 
    name: "Aarav Sharma", 
    image: "https://randomuser.me/api/portraits/men/32.jpg", 
    review: "Amazing quality! The shampoo feels natural and my hair looks healthier than ever." 
  },
  { 
    id: 2, 
    name: "Priya Verma", 
    image: "https://randomuser.me/api/portraits/women/44.jpg", 
    review: "Absolutely love the face wash. It’s gentle yet very effective. My skin feels so fresh!" 
  },
  { 
    id: 3, 
    name: "Rohan Gupta", 
    image: "https://randomuser.me/api/portraits/men/15.jpg", 
    review: "This cream is fantastic. Keeps my skin soft and hydrated all day." 
  },
  { 
    id: 4, 
    name: "Neha Patel", 
    image: "https://randomuser.me/api/portraits/women/65.jpg", 
    review: "The herbal oil works wonders! My scalp feels nourished and hair growth improved." 
  },
  { 
    id: 5, 
    name: "Karan Malhotra", 
    image: "https://randomuser.me/api/portraits/men/28.jpg", 
    review: "The soap smells so refreshing. My skin feels soft and chemical-free." 
  },
  { 
    id: 6, 
    name: "Simran Kaur", 
    image: "https://randomuser.me/api/portraits/women/52.jpg", 
    review: "I use aloe gel daily now. It’s soothing, cooling, and perfect for summers." 
  },
  { 
    id: 7, 
    name: "Aditya Mehta", 
    image: "https://randomuser.me/api/portraits/men/40.jpg", 
    review: "This hair serum is a game changer. My hair looks shiny and frizz-free." 
  },
];

  const scroll = (direction) => {
    if (productGridRef.current) {
      const card = productGridRef.current.querySelector(`.${styles.reviewCard}`);
      const scrollAmount = card ? card.offsetWidth + 20 : 280;
      productGridRef.current.scrollLeft += direction === "left" ? -scrollAmount : scrollAmount;
    }
  };

  return (
    <motion.div
      className={styles.featuredContainer}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      {/* Header */}
      <div className={styles.featuredHeader}>
        <motion.h2
          initial={{ x: -40, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          Customer Reviews
        </motion.h2>
        <div className={styles.arrows}>
          <button className={styles.arrowBtn} onClick={() => scroll("left")}>◀</button>
          <button className={styles.arrowBtn} onClick={() => scroll("right")}>▶</button>
        </div>
      </div>

      {/* Product Reviews */}
      <div className={styles.productGrid} ref={productGridRef}>
        {products.map((product, index) => (
          <motion.div
            className={styles.reviewCard}
            key={product.id}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            whileHover={{ y: -8, scale: 1.03 }}
          >
            <img src={product.image} alt={product.name} />
            <div className={styles.stars}>
              {[...Array(5)].map((_, i) => (
                <span key={i} className={styles.star}>★</span>
              ))}
            </div>
            <h3>{product.name}</h3>
            <p className={styles.reviewText}>"{product.review}"</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default ReviewProducts;
