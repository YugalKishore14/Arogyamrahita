import React from "react";
import styles from "../css/discountHero.module.css";  // ✅ import module css
import heroImage from "../images/bag.png"; 

const DiscountHero = () => {
  return (
    <div className={styles.heroContainer}>
      <div className={styles.heroImage}>
        <img src={heroImage} alt="Black Friday Bag" />
      </div>
      <div className={styles.heroText}>
        <h1>UPTO 70% OFF</h1>
        <p>On Natural Product</p>
      </div>
    </div>
  );
};

export default DiscountHero;
