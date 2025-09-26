import React, { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import styles from "../css/Header.module.css";
import logoImage from "../images/arogyamlogo.png";
import { GiShoppingCart } from "react-icons/gi";
import { IoSearch } from "react-icons/io5";
import { MdAccountCircle } from "react-icons/md";
import { HiMenu, HiX } from "react-icons/hi";
// import UserProfile from "./UserProfile";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import { productAPI, categoryAPI } from "../services/Api";

const Header = () => {
  const { isAdmin, user, logout } = useAuth();
  const location = useLocation();
  const { cartCount } = useCart();
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [allCategories, setAllCategories] = useState([]);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const searchRef = useRef(null);

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  const handleAccountClick = () => {
    if (user) {
      navigate("/profile");
    } else {
      window.location.href = "/login";
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setShowSuggestions(false);
    }
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await categoryAPI.getAllCategories();
        if (mounted && res?.success) {
          setAllCategories(res.categories || []);
        }
      } catch (_) { }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!searchQuery || searchQuery.trim().length === 0) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const query = searchQuery.trim();
    let mounted = true;
    const timer = setTimeout(async () => {
      try {
        const [productsRes] = await Promise.all([
          productAPI.getAllProducts({ search: query, limit: 8 }),
        ]);

        const productSuggestions = (productsRes?.products || []).map((p) => ({
          id: p._id,
          label: p.name,
          type: "product",
        }));

        const categorySuggestions = (allCategories || [])
          .filter((c) => c?.name?.toLowerCase().includes(query.toLowerCase()))
          .slice(0, 5)
          .map((c) => ({ id: c._id, label: c.name, type: "category" }));

        const combined = [...categorySuggestions, ...productSuggestions];
        if (mounted) {
          setSuggestions(combined);
          setShowSuggestions(true);
        }
      } catch (_) {
        if (mounted) {
          setSuggestions([]);
          setShowSuggestions(false);
        }
      }
    }, 250);

    return () => {
      mounted = false;
      clearTimeout(timer);
    };
  }, [searchQuery, allCategories]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSuggestionClick = (s) => {
    setShowSuggestions(false);
    if (s.type === "category") {
      navigate(`/products?category=${encodeURIComponent(s.label)}`);
      setSearchQuery("");
    } else if (s.type === "product") {
      navigate(`/products?search=${encodeURIComponent(s.label)}`);
      setSearchQuery("");
    }
  };

  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > 50) {
      setScrolled(true);
    } else {
      setScrolled(false);
    }
  });

  return (
    <div className={styles.headerContainer}>
      <motion.header
        className={`${styles.header} ${scrolled ? styles.scrolled : ""}`}
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className={styles.container}>
          <motion.div whileHover={{ scale: 1.05 }}>
            <NavLink
              to="/"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              <img className={styles.logoImage} src={logoImage} alt="Logo" />
            </NavLink>
          </motion.div>

          <form
            className={styles.searchBar}
            onSubmit={handleSearch}
            ref={searchRef}
          >
            <input
              type="text"
              placeholder="Search here..."
              value={searchQuery}
              className={styles.searchInput}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => {
                if (suggestions.length > 0) setShowSuggestions(true);
              }}
            />
            <motion.button
              type="submit"
              className={styles.searchIcon}
              whileTap={{ scale: 0.9 }}
            >
              <IoSearch />
            </motion.button>
            {showSuggestions && suggestions.length > 0 && (
              <div
                className={styles.suggestionsBox}
              >
                {suggestions.map((s) => (
                  <div
                    key={`${s.type}-${s.id}`}
                    onClick={() => handleSuggestionClick(s)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "8px 10px",
                      cursor: "pointer",
                      borderRadius: 6,
                    }}
                    onMouseDown={(e) => e.preventDefault()}
                  >
                    <span
                      className={styles.suggestionType}
                    >
                      {s.type}
                    </span>
                    <span
                      className={styles.suggestionLabel}
                    >
                      {s.label}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </form>

          {/* Desktop Nav: Only show on desktop */}
          <nav className={`${styles.nav} ${styles.desktopNav}`}>
            <ul className={styles.navList}>
              {["Home", "Products", "About", "Contact"].map((item, idx) => (
                <motion.li
                  key={item}
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <NavLink
                    to={`/${item.toLowerCase()}`}
                    className={({ isActive }) => (isActive ? "active" : "")}
                  >
                    <span>{item}</span>
                  </NavLink>
                </motion.li>
              ))}
            </ul>
          </nav>

          <div className={styles.navIcons}>
            {user ? (
              <>
                {isAdmin() && location.pathname !== "/admin" && (
                  <motion.div whileHover={{ scale: 1.05 }}>
                    <NavLink
                      to="/admin"
                      className={`${styles.adminBtn} ${({ isActive }) =>
                        isActive ? "active" : ""}`}
                    >
                      Admin Panel
                    </NavLink>
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
                <motion.div whileHover={{ scale: 1.1 }}>
                  <NavLink
                    to="/signup"
                    className={({ isActive }) =>
                      `${styles.signupBtn} ${isActive ? "active" : ""}`
                    }
                  >
                    Sign Up
                  </NavLink>
                </motion.div>
                <motion.div whileHover={{ scale: 1.1 }}>
                  <NavLink
                    to="/login"
                    className={({ isActive }) =>
                      `${styles.loginBtn} ${isActive ? "active" : ""}`
                    }
                  >
                    Login
                  </NavLink>
                </motion.div>
              </>
            )}

            <motion.div whileHover={{ scale: 1.1 }}>
              <NavLink
                to="/cart"
                className={({ isActive }) =>
                  `${styles.cartBtn} ${isActive ? "active" : ""}`
                }
              >
                <div className={styles.iconWrapper}>
                  <GiShoppingCart className={styles.cartIcon} />
                  {cartCount > 0 && (
                    <span className={styles.cartCount}>{cartCount}</span>
                  )}
                </div>
              </NavLink>
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
            <button
              className={styles.hamburger}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
              onClick={() => setMobileOpen((prev) => !prev)}
              style={{ background: "none", border: "none", padding: 0 }}
              type="button"
            >
              {mobileOpen ? (
                <HiX className={styles.hixCros} />
              ) : (
                <HiMenu className={styles.hiMenu} />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.nav
              id="mobile-menu"
              className={styles.mobileNav}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <ul>
                {["Home", "Products", "About", "Contact"].map((item) => (
                  <li key={item}>
                    <NavLink
                      to={`/${item.toLowerCase()}`}
                      onClick={() => setMobileOpen(false)}
                      className={({ isActive }) => (isActive ? "active" : "")}
                    >
                      {item}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </motion.nav>
          )}
        </AnimatePresence>
      </motion.header>

      {/* UserProfile popup removed. Now navigates to /profile */}
    </div>
  );
};

export default Header;
