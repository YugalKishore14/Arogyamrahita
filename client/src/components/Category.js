import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../css/Category.module.css';
import { productAPI } from '../services/Api';

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await productAPI.getCategories();
      if (response.success) {
        setCategories(response.categories);
      } else {
        setError('Failed to fetch categories');
      }
    } catch (err) {
      setError('Error loading categories');
      console.error('Error fetching categories:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (category) => {
    navigate(`/products?category=${encodeURIComponent(category)}`);
  };

  if (loading) {
    return (
      <div className={styles.categorySection}>
        <div className={styles.container}>
          <h2 className={styles.title}>Categories</h2>
          <div className={styles.categoriesGrid}>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className={styles.categoryCard}>
                <div className={styles.categoryImage}>
                  <div className={styles.skeleton}></div>
                </div>
                <h3 className={styles.categoryName}>Loading...</h3>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.categorySection}>
        <div className={styles.container}>
          <h2 className={styles.title}>Categories</h2>
          <p className={styles.error}>{error}</p>
          <button onClick={fetchCategories} className={styles.retryBtn}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.categorySection}>
      <div className={styles.container}>
        <h2 className={styles.title}>Shop by Category</h2>
        <div className={styles.categoriesGrid}>
          {categories.map((category, index) => (
            <div
              key={index}
              className={styles.categoryCard}
              onClick={() => handleCategoryClick(category)}
            >
              <div className={styles.categoryImage}>
                <img
                  src={`https://placehold.co/200x200/4CAF50/FFFFFF?text=${encodeURIComponent(category)}`}
                  alt={category}
                  className={styles.categoryImg}
                />
              </div>
              <h3 className={styles.categoryName}>{category}</h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Category;
