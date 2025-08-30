// Header.js
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import styles from "../css/Header.module.css";
import logoImage from "../images/logo.png";
import { GiShoppingCart } from "react-icons/gi";
import { IoSearch } from "react-icons/io5";
import { MdAccountCircle } from "react-icons/md";
import UserProfile from "./UserProfile";

const Header = () => {
    const { isAdmin, user, logout } = useAuth();
    const { cartCount } = useCart();
    const [showUserProfile, setShowUserProfile] = useState(false);

    const handleLogout = () => {
        logout();
        // Redirect to home page after logout
        window.location.href = '/';
    };

    const handleAccountClick = () => {
        if (user) {
            setShowUserProfile(true);
        } else {
            // Redirect to login if not authenticated
            window.location.href = '/login';
        }
    };

    return (
        <>
            <header className={styles.header}>
                <div className={styles.container}>
                    {/*Logo */}
                    <div className={styles.logo}>
                        <Link to="/">
                            <img
                                className={styles.logoImage}
                                src={logoImage}
                                alt="Arogya Rahita"
                            />
                        </Link>
                    </div>

                    {/*Search Bar */}
                    <div className={styles.searchBar}>
                        <input type="text" placeholder="Search here..." />
                        <span className={styles.searchIcon}><IoSearch /></span>
                    </div>

                    {/*Navigation Links */}
                    <nav className={styles.nav}>
                        <ul className={styles.navList}>
                            <li><Link to="/">Home</Link></li>
                            <li><Link to="/products">Products</Link></li>
                            <li><Link to="/about">About</Link></li>
                            <li><Link to="/contact">Contact</Link></li>
                        </ul>
                    </nav>

                    {/*Right Side Buttons (Login/Signup/Cart/Profile etc.) */}
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

                        {/* Cart */}
                        <Link to="/cart" className={styles.cartBtn}>
                            <GiShoppingCart /> Cart <span className={styles.cartCount}>{cartCount}</span>
                        </Link>

                        {/* Account Icon */}
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

            {/* User Profile Modal */}
            <UserProfile
                isOpen={showUserProfile}
                onClose={() => setShowUserProfile(false)}
            />
        </>
    );
};

export default Header;
