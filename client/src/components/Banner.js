import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import styles from "../css/banner.module.css";
import lamp from "../images/lamp.png";
import bottle from "../images/bottel.png";

const Banner = () => {
  const navigate = useNavigate();
  return (
    <div className={styles.heroContainer}>
      <section className={styles.hero}>
        <motion.div
          className={styles.heroLeft}
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.img
            src={lamp}
            alt="lamp"
            className={styles.lamp}
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 3 }}
          />
          {/* <img
            src={logo}
            alt="Arogyam Logo"
            className={styles.lamp}
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 3 }}
          /> */}

          <p className={styles.highlightText}>
            Specialized, natural health products for a balanced and healthier life.
          </p>

          <motion.h1
            className={styles.mainHeading}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            Arogyam Rahita <br /> Wellness Rooted in Nature.
          </motion.h1>

          <p className={styles.subtext}>
            We provide Best Quality using the least amount of time, energy, and
            money.
          </p>

          <motion.button
            className={styles.shopBtn}
            whileHover={{ scale: 1.1, backgroundColor: "#16a34a", color: "#fff" }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/products")}
          >
            Shop Now
          </motion.button>
        </motion.div>

        <motion.div
          className={styles.heroRight}
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.img
            src={bottle}
            alt="Oil bottle"
            className={styles.heroImage}
            animate={{ y: [0, 20, 0] }}
            transition={{ repeat: Infinity, duration: 4 }}
          />
        </motion.div>
      </section>
    </div>
  );
};

export default Banner;
