import React from "react";
import styles from "../css/banner.module.css";
import lamp from "../images/lamp.png";
import bottle from "../images/bottel.png";

const Banner = () => {
  return (
    <div className={styles.heroContainer}>
      <section className={styles.hero}>
        <div className={styles.heroLeft}>
          <img src={lamp} alt="lamp" className={styles.lamp} />
          <p className={styles.highlightText}>
            Discover specialized, natural health products for a balanced and
            healthier life.
          </p>
          <h1 className={styles.mainHeading}>
            Arogyam Rahita <br /> Wellness Rooted in Nature.
          </h1>
          <p className={styles.subtext}>
            We provide Best Quality using the least amount of time, energy, and
            money.
          </p>
          <button className={styles.shopBtn}>Shop Now</button>
        </div>
        <div className={styles.heroRight}>
          <img src={bottle} alt="Oil bottle" className={styles.heroImage} />
        </div>
      </section>
    </div>
  );
};

export default Banner;
