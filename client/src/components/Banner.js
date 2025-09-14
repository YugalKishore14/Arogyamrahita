import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "../css/banner.module.css";
import lamp from "../images/benar1.jpg";
import bottle from "../images/benar2.jpg";
import logo from "../images/benar3.jpg";

const images = [lamp, bottle, logo];

const variants = {
  enter: (direction) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
    position: "absolute",
  }),
  center: {
    x: 0,
    opacity: 1,
    position: "relative",
    transition: { duration: 1, ease: "easeInOut" },
  },
  exit: (direction) => ({
    x: direction > 0 ? -300 : 300,
    opacity: 0,
    position: "absolute",
    transition: { duration: 1, ease: "easeInOut" },
  }),
};

const Banner = () => {
  const [[current, direction], setCurrent] = useState([0, 0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent(([prev]) => [(prev + 1) % images.length, 1]);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const goTo = (index) => {
    const dir = index > current ? 1 : -1;
    setCurrent([index, dir]);
  };

  return (
    <div className={styles.sliderContainer}>
      <div className={styles.slider}>
        <AnimatePresence mode="sync" custom={direction}>
          <motion.img
            key={images[current]}
            src={images[current]}
            alt="banner"
            className={styles.slideImage}
            variants={variants}
            custom={direction}
            initial="enter"
            animate="center"
            exit="exit"
          />
        </AnimatePresence>
      </div>

      {/* Indicators */}
      <div className={styles.dots}>
        {images.map((_, index) => (
          <span
            key={index}
            className={`${styles.dot} ${index === current ? styles.activeDot : ""
              }`}
            onClick={() => goTo(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default Banner;
