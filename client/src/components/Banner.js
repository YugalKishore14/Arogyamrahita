import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "../css/banner.module.css";

import lamp from "../images/benar1.jpg";
import bottle from "../images/benar2.jpg";
import logo from "../images/benar3.jpg";

const images = [lamp, bottle, logo];

const Banner = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Manual next/prev
  // const nextSlide = () => setCurrent((prev) => (prev + 1) % images.length);
  // const prevSlide = () =>
  //   setCurrent((prev) => (prev - 1 + images.length) % images.length);

  return (
    <div className={styles.sliderContainer}>
      <div className={styles.slider}>
        <AnimatePresence mode="wait" className={styles.animatePresence}>
          <motion.img
            key={images[current]}
            src={images[current]}
            alt="banner"
            className={styles.slideImage}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.6 }}
          />
        </AnimatePresence>
      </div>

      {/* Controls */}
      {/* <button className={styles.prevBtn} onClick={prevSlide}>
        ◀
      </button>
      <button className={styles.nextBtn} onClick={nextSlide}>
        ▶
      </button> */}

      {/* Indicators */}
      <div className={styles.dots}>
        {images.map((_, index) => (
          <span
            key={index}
            className={`${styles.dot} ${index === current ? styles.activeDot : ""
              }`}
            onClick={() => setCurrent(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default Banner;
