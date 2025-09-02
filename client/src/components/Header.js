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
import UserProfile from "./UserProfile";

const Header = () => {
    const { isAdmin, user, logout } = useAuth();
    const { cartCount } = useCart();
    const [showUserProfile, setShowUserProfile] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        window.location.href = '/';
    };

    const handleAccountClick = () => {
        if (user) {
            setShowUserProfile(true);
        } else {
            window.location.href = '/login';
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    return (
        <>
            <header className={styles.header}>
                <div className={styles.container}>
                    <div className={styles.logo}>
                        <Link to="/">
                            <img
                                className={styles.logoImage}
                                src={logoImage}
                                alt="Arogya Rahita"
                            />
                        </Link>
                    </div>

                    <form className={styles.searchBar} onSubmit={handleSearch}>
                        <input
                            type="text"
                            placeholder="Search here..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <button type="submit" className={styles.searchIcon}>
                            <IoSearch />
                        </button>
                    </form>

                    <nav className={styles.nav}>
                        <ul className={styles.navList}>
                            <li><Link to="/">Home</Link></li>
                            <li><Link to="/products">Products</Link></li>
                            <li><Link to="/about">About</Link></li>
                            <li><Link to="/contact">Contact</Link></li>
                        </ul>
                    </nav>

                    <div className={styles.navIcons}>
                        {user ? (
                            <>
                                {isAdmin() && (
                                    <Link to="/admin" className={styles.adminBtn}>
                                        Admin Panel
                                    </Link>
                                )}
                                <button onClick={handleLogout} className={styles.loginBtn}>
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/signup" className={styles.signupBtn}>Sign Up</Link>
                                <Link to="/login" className={styles.loginBtn}>Login</Link>
                            </>
                        )}

                        <Link to="/cart" className={styles.cartBtn}>
                            <GiShoppingCart /> Cart <span className={styles.cartCount}>{cartCount}</span>
                        </Link>

                        <div
                            className={styles.iconBox}
                            onClick={handleAccountClick}
                            style={{ cursor: 'pointer' }}
                        >
                            <MdAccountCircle />
                        </div>
                    </div>
                </div>
            </header>


            <UserProfile
                className={styles.userProfile}
                isOpen={showUserProfile}
                onClose={() => setShowUserProfile(false)}
            />
        </>
    );
};

export default Header;
