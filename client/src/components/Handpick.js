import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import styles from "../css/handpick.module.css";
import { categoryAPI } from "../services/Api";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";



const CategoryCard = ({ title, imageUrl, onClick }) => {
  const [imageSrc, setImageSrc] = useState(imageUrl);

  const handleImageError = () => {
    setImageSrc("");
  };

  return (
    <motion.div
      className={styles.categoryCard}
      onClick={onClick}
      whileHover={{ scale: 1.1, rotate: 1 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 200 }}
    >
      <motion.img
        src={imageSrc}
        alt={title}
        className={styles.cardImage}
        onError={handleImageError}
        loading="lazy"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      />
      <motion.div
        className={styles.cardTitle}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {title}
      </motion.div>
    </motion.div>
  );
};

const Handpick = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const scrollContainerRef = useRef(null);
  const navigate = useNavigate();

  const autoScrollRef = useRef(null);
  const resumeTimeout = useRef(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (categories.length > 0) {
      startAutoScroll();
      const container = scrollContainerRef.current;

      let isDown = false;
      let startX;
      let scrollLeft;

      const handleMouseDown = (e) => {
        isDown = true;
        container.classList.add(styles.active);
        startX = e.pageX - container.offsetLeft;
        scrollLeft = container.scrollLeft;
        stopAutoScroll();
      };

      const handleMouseLeave = () => {
        isDown = false;
      };

      const handleMouseUp = () => {
        isDown = false;
        container.classList.remove(styles.active);
        restartAutoScroll();
      };

      const handleMouseMove = (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - container.offsetLeft;
        const walk = (x - startX) * 1.5;
        container.scrollLeft = scrollLeft - walk;
      };

      const handleTouchStart = () => stopAutoScroll();
      const handleTouchEnd = () => restartAutoScroll();

      container.addEventListener("mousedown", handleMouseDown);
      container.addEventListener("mouseleave", handleMouseLeave);
      container.addEventListener("mouseup", handleMouseUp);
      container.addEventListener("mousemove", handleMouseMove);

      container.addEventListener("touchstart", handleTouchStart);
      container.addEventListener("touchend", handleTouchEnd);

      return () => {
        stopAutoScroll();
        container.removeEventListener("mousedown", handleMouseDown);
        container.removeEventListener("mouseleave", handleMouseLeave);
        container.removeEventListener("mouseup", handleMouseUp);
        container.removeEventListener("mousemove", handleMouseMove);
        container.removeEventListener("touchstart", handleTouchStart);
        container.removeEventListener("touchend", handleTouchEnd);
      };
    }
  }, [categories]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await categoryAPI.getAllCategories();
      if (response.success) {
        const seen = new Set();
        const uniqueCategories = response.categories.filter((cat) => {
          const name = cat.name?.trim().toLowerCase();
          if (!seen.has(name)) {
            seen.add(name);
            return true;
          }
          return false;
        });
        setCategories([...uniqueCategories, ...uniqueCategories]);
      } else {
        setError("Failed to fetch categories");
      }
    } catch (err) {
      setError("Error loading categories");
      console.error("Error fetching categories:", err);
    } finally {
      setLoading(false);
    }
  };

  const startAutoScroll = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollSpeed = 0.7;

    const scroll = () => {
      container.scrollLeft += scrollSpeed;
      if (container.scrollLeft >= container.scrollWidth / 2) {
        container.scrollLeft = 0;
      }
      autoScrollRef.current = requestAnimationFrame(scroll);
    };

    autoScrollRef.current = requestAnimationFrame(scroll);
  };

  const stopAutoScroll = () => {
    if (autoScrollRef.current) {
      cancelAnimationFrame(autoScrollRef.current);
      autoScrollRef.current = null;
    }
    if (resumeTimeout.current) {
      clearTimeout(resumeTimeout.current);
    }
  };

  const restartAutoScroll = () => {
    resumeTimeout.current = setTimeout(() => {
      startAutoScroll();
    }, 2000);
  };

  const scrollManually = (direction) => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const amount = 320;
    stopAutoScroll();
    container.scrollLeft += direction === "left" ? -amount : amount;

    if (container.scrollLeft >= container.scrollWidth / 2) {
      container.scrollLeft = 0;
    }
    if (container.scrollLeft < 0) {
      container.scrollLeft = container.scrollWidth / 2;
    }
    restartAutoScroll();
  };

  const handleCategoryClick = (category) => {
    navigate(`/products?category=${encodeURIComponent(category.name)}`);
  };

  return (
    <div className={styles.mainContainer}>
      <motion.h2
        className={styles.sectionTitle}
        initial={{ y: -20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        Shop By Category
      </motion.h2>

      {loading ? (
        <div className={styles.scrollContainer} ref={scrollContainerRef}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className={styles.categoryCard}>
              <div className={styles.skeleton}></div>
              <div className={styles.cardTitle}>Loading...</div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className={styles.errorMessage}>
          <p>Unable to load categories. Please try again later.</p>
        </div>
      ) : (
        <div style={{ position: "relative" }}>
          <div className={styles.scrollContainer} ref={scrollContainerRef}>
            {categories.map((category, index) => (
              <CategoryCard
                key={`${category._id || 'cat'}-${index}`}
                title={category.name}
                imageUrl={category.image}
                onClick={() => handleCategoryClick(category)}
              />
            ))}
          </div>
          <button
            aria-label="Scroll left"
            onClick={() => scrollManually("left")}
            className={`${styles.scrollBtn} ${styles.leftBtn}`}
          >
            <HiChevronLeft size={22} />
          </button>
          <button
            aria-label="Scroll right"
            onClick={() => scrollManually("right")}
            className={`${styles.scrollBtn} ${styles.rightBtn}`}
          >
            <HiChevronRight size={22} />
          </button>
        </div>
      )}
    </div>
  );
};

export default Handpick;
