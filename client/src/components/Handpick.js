import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import styles from '../css/handpick.module.css';
import { categoryAPI } from '../services/Api';
import defaultImage from "../images/bottel.png";
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi';

const getDefaultImageForCategory = (categoryName) => {
  const categoryImages = {
    oils: defaultImage,
    seeds: defaultImage,
    aata: defaultImage,
    pickle: defaultImage,
    "dry fruits": defaultImage,
    millets: defaultImage,
    "sabut masala": defaultImage,
    "crush masala": defaultImage,
    rice: defaultImage,
    tea: defaultImage,
    "fast(varat)": defaultImage,
    "self life": defaultImage,
  };
  return categoryImages[categoryName?.toLowerCase()] || defaultImage;
};

const CategoryCard = ({ title, imageUrl, onClick }) => {
  const [imageSrc, setImageSrc] = useState(
    imageUrl || getDefaultImageForCategory(title)
  );

  const handleImageError = () => {
    setImageSrc(getDefaultImageForCategory(title));
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

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (categories.length > 0) {
      const cleanup = startAutoScroll();
      return cleanup;
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

    let scrollSpeed = 0.7;
    let animationId;

    const scroll = () => {
      container.scrollLeft += scrollSpeed;
      if (container.scrollLeft >= container.scrollWidth / 2) {
        container.scrollLeft = 0;
      }
      animationId = requestAnimationFrame(scroll);
    };

    animationId = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(animationId);
  };

  const scrollManually = (direction) => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const amount = 320;
    container.scrollLeft += direction === 'left' ? -amount : amount;
    if (container.scrollLeft >= container.scrollWidth / 2) {
      container.scrollLeft = 0;
    }
    if (container.scrollLeft < 0) {
      container.scrollLeft = container.scrollWidth / 2;
    }
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
        <div style={{ position: 'relative' }}>
          <div className={styles.scrollContainer} ref={scrollContainerRef}>
            {categories.map((category, index) => (
              <CategoryCard
                key={category._id || index}
                title={category.name}
                imageUrl={category.image}
                onClick={() => handleCategoryClick(category)}
              />
            ))}
          </div>
          <button
            aria-label="Scroll left"
            onClick={() => scrollManually('left')}
            style={{
              position: 'absolute',
              top: '50%',
              left: 8,
              transform: 'translateY(-50%)',
              zIndex: 5,
              border: 'none',
              background: 'rgba(255,255,255,0.8)',
              borderRadius: 9999,
              width: 36,
              height: 36,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <HiChevronLeft size={22} />
          </button>
          <button
            aria-label="Scroll right"
            onClick={() => scrollManually('right')}
            style={{
              position: 'absolute',
              top: '50%',
              right: 8,
              transform: 'translateY(-50%)',
              zIndex: 5,
              border: 'none',
              background: 'rgba(255,255,255,0.8)',
              borderRadius: 9999,
              width: 36,
              height: 36,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <HiChevronRight size={22} />
          </button>
        </div>
      )}
    </div>
  );
};

export default Handpick;
