import React, { useState } from 'react';
import styles from "../css/Category.module.css";

const Categorry = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <header className={styles.navbarContainer}>
      <div className={styles.navbarLeft}>
        <div className={styles.allCategoriesBtn} onClick={toggleDropdown}>
          <span className={styles.hamburgerIcon}>&#9776;</span>
          <span>All Categories</span>
        </div>
      </div>

      <nav className={styles.navbarMenu}>
        <ul>
          <li><a href="#">Home</a></li>
          <li><a href="#">Shop</a></li>
          <li><a href="#">Product</a></li>
          <li><a href="#">Pages</a></li>
          <li><a href="#">About</a></li>
        </ul>
      </nav>

      {isDropdownOpen && (
        <div className={styles.productDropdown}>
          <ul>
            <li><a href="#">Electronics</a></li>
            <li><a href="#">Clothing</a></li>
            <li><a href="#">Home & Kitchen</a></li>
            <li><a href="#">Books</a></li>
            <li><a href="#">Sports & Outdoors</a></li>
          </ul>
        </div>
      )}
    </header>
  );
};

export default Categorry;
