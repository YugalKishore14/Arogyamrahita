import React from "react";
import { motion } from "framer-motion";
import styles from "../css/discountHero.module.css";
import heroImage from "../images/bag.png";

const DiscountHero = () => {
  return (
    <motion.div
      className={styles.heroContainer}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <motion.div
        className={styles.heroImage}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <motion.img
          src={heroImage}
          alt="Discount Bag"
          animate={{ y: [0, -12, 0] }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </motion.div>

      <motion.div
        className={styles.heroText}
        initial={{ x: 60, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 1, delay: 0.3 }}
      >
        <motion.h1
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 200 }}
        >
          UPTO <span className={styles.highlight}>70% OFF</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          On Natural Product
        </motion.p>
      </motion.div>
    </motion.div>
  );
};

export default DiscountHero;
