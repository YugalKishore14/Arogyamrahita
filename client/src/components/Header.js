// Header.js
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import styles from "../css/Header.module.css";
import logoImage from "../images/arogyamlogo.png";
import { GiShoppingCart } from "react-icons/gi";
import { IoSearch } from "react-icons/io5";
import { MdAccountCircle } from "react-icons/md";
import { HiMenu, HiX } from "react-icons/hi";
import UserProfile from "./UserProfile";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";

const Header = () => {
  const { isAdmin, user, logout } = useAuth();
  const { cartCount } = useCart();
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  const handleAccountClick = () => {
    if (user) {
      setShowUserProfile(true);
    } else {
      window.location.href = "/login";
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // Scroll detect
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > 50) {
      setScrolled(true);
    } else {
      setScrolled(false);
    }
  });

  return (
    <>
      <motion.header
        className={`${styles.header} ${scrolled ? styles.scrolled : ""}`}
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className={styles.container}>
          {/* Logo */}
          <motion.div whileHover={{ scale: 1.05 }}>
            <Link to="/">
              <img className={styles.logoImage} src={logoImage} alt="Logo" />
            </Link>
          </motion.div>

          {/* Search */}
          <form className={styles.searchBar} onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search here..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <motion.button type="submit" className={styles.searchIcon} whileTap={{ scale: 0.9 }}>
              <IoSearch />
            </motion.button>
          </form>

          {/* Desktop Nav */}
          <nav className={`${styles.nav} ${styles.desktopNav}`}>
            <ul className={styles.navList}>
              {["Home", "Products", "About", "Contact"].map((item, idx) => (
                <motion.li
                  key={item}
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Link to={`/${item.toLowerCase()}`}>
                    <span>{item}</span>
                  </Link>
                </motion.li>
              ))}
            </ul>
          </nav>

          {/* Right Icons */}
          <div className={styles.navIcons}>
            {user ? (
              <>
                {isAdmin() && (
                  <motion.div whileHover={{ scale: 1.05 }}>
                    <Link to="/admin" className={styles.adminBtn}>
                      Admin Panel
                    </Link>
                  </motion.div>
                )}
                <motion.button
                  onClick={handleLogout}
                  className={styles.loginBtn}
                  whileTap={{ scale: 0.95 }}
                >
                  Logout
                </motion.button>
              </>
            ) : (
              <>
                <motion.div whileHover={{ scale: 1.05 }}>
                  <Link to="/signup" className={styles.signupBtn}>
                    Sign Up
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }}>
                  <Link to="/login" className={styles.loginBtn}>
                    Login
                  </Link>
                </motion.div>
              </>
            )}

            <motion.div whileHover={{ scale: 1.1 }}>
              <Link to="/cart" className={styles.cartBtn}>
                <GiShoppingCart /> Cart{" "}
                <span className={styles.cartCount}>{cartCount}</span>
              </Link>
            </motion.div>

            <motion.div
              className={styles.iconBox}
              onClick={handleAccountClick}
              whileHover={{ scale: 1.2 }}
              whileTap={{ rotate: 15 }}
              style={{ cursor: "pointer" }}
            >
              <MdAccountCircle />
            </motion.div>

            {/* Hamburger - Mobile only */}
            <div
              className={styles.hamburger}
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <HiX size={28} /> : <HiMenu size={28} />}
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.nav
              className={styles.mobileNav}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <ul>
                {["Home", "Products", "About", "Contact"].map((item) => (
                  <li key={item}>
                    <Link
                      to={`/${item.toLowerCase()}`}
                      onClick={() => setMobileOpen(false)}
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.nav>
          )}
        </AnimatePresence>
      </motion.header>

      <UserProfile
        isOpen={showUserProfile}
        onClose={() => setShowUserProfile(false)}
      />
    </>
  );
};

export default Header;
