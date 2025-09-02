import React from 'react';
import styles from '../css/handpick.module.css';
import image from "../images/bottel.png";
import watch from "../images/bottel.png";
import light from "../images/bottel.png";

const CategoryCard = ({ title, imageUrl }) => {
  return (
    <div className={styles.categoryCard}>
      <img src={imageUrl} alt={title} className={styles.cardImage} />
      <div className={styles.cardTitle}>{title}</div>
    </div>
  );
};

const Handpick = () => {
  const categories = [
    { title: 'Personal Care', imageUrl: image },
    { title: 'Handbags', imageUrl: image },
    { title: 'Wrist Watches', imageUrl: watch },
    { title: 'Sun Glasses', imageUrl: light },
    { title: 'Electronics', imageUrl: image },
    { title: 'Books', imageUrl: watch },
  ];

  return (
    <div className={styles.mainContainer}>
      <h2 className={styles.sectionTitle}>Shop By Category</h2>
      <div className={styles.scrollContainer}>
        {categories.map((cat, index) => (
          <CategoryCard key={index} title={cat.title} imageUrl={cat.imageUrl} />
        ))}
      </div>
    </div>
  );
};

export default Handpick;
