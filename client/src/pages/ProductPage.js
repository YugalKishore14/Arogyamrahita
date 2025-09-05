import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
    ChevronRight,
    ChevronDown,
    ShoppingCart,
    Menu,
    ListFilter,
} from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import ImagePlaceholder from "../components/ImagePlaceholder";
import styles from "../css/ProductPage.module.css";
import Header from "../components/Header";
import Footer from "../components/Fotter";

const ProductPage = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [openFilters, setOpenFilters] = useState({
        category: true,
        price: true,
    });

    const [priceValue, setPriceValue] = useState(1000);
    const [products, setProducts] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [sortBy, setSortBy] = useState("popular");

    const { addToCart } = useCart();
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                setError("");
                const url = selectedCategory
                    ? `https://arogyamrahita.onrender.com/api/products?category=${encodeURIComponent(
                        selectedCategory
                    )}`
                    : "https://arogyamrahita.onrender.com/api/products";

                const response = await fetch(url);
                if (response.ok) {
                    const data = await response.json();
                    setProducts(data.products || []);
                } else {
                    throw new Error("Failed to fetch products");
                }
            } catch (err) {
                setError("Error loading products: " + err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [selectedCategory]);

    const categories = [...new Set(products.map((product) => product.category))];

    const filteredAndSortedProducts = useMemo(() => {
        let filtered = products.filter((product) => {
            const priceMatch = product.newPrice <= priceValue;
            const categoryMatch = !selectedCategory || product.category === selectedCategory;
            return priceMatch && categoryMatch;
        });

        switch (sortBy) {
            case "price-low":
                filtered.sort((a, b) => a.newPrice - b.newPrice);
                break;
            case "price-high":
                filtered.sort((a, b) => b.newPrice - a.newPrice);
                break;
            case "popular":
            default:
                break;
        }

        return filtered;
    }, [products, priceValue, selectedCategory, sortBy]);

    const handleAddToCart = (product) => {
        if (!isAuthenticated()) {
            toast.info("Please sign up to add items to cart!");
            navigate("/signup");
            return;
        }
        addToCart(product, 1);
        toast.success("Added to cart!");
    };

    const handleBuyNow = (product) => {
        if (!isAuthenticated()) {
            toast.info("Please sign up to purchase products!");
            navigate("/signup");
            return;
        }
        navigate(`/product/${product._id}`);
    };

    const FilterSection = ({ title, children, sectionKey }) => {
        const isOpen = openFilters[sectionKey];
        return (
            <div className={styles.filterSection}>
                <div
                    className={styles.filterHeader}
                    onClick={() =>
                        setOpenFilters((prev) => ({
                            ...prev,
                            [sectionKey]: !isOpen,
                        }))
                    }
                >
                    <h3 className={styles.filterTitle}>{title}</h3>
                    {isOpen ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                </div>
                <div
                    className={`${styles.filterContent} ${isOpen ? styles.open : styles.closed
                        }`}
                >
                    {children}
                </div>
            </div>
        );
    };

    return (<>
        <Header />
        <div className={styles.container}>
            <button
                className={styles.hamburgerBtn}
                onClick={() => setIsSidebarOpen(true)}
            >
                <Menu size={24} />
            </button>

            {/* Sidebar */}
            <aside
                className={`${styles.sidebar} ${isSidebarOpen ? styles.showSidebar : ""
                    }`}
            >
                <div className={styles.sidebarHeader}>
                    <h2 className={styles.sidebarTitle}>Filters</h2>
                    <div className={styles.sidebarIcons}>
                        <ListFilter size={20} />
                        <Menu
                            size={20}
                            className={styles.closeBtn}
                            onClick={() => setIsSidebarOpen(false)}
                        />
                    </div>
                </div>

                <FilterSection title="Category" sectionKey="category">
                    <ul className={styles.list}>
                        <li
                            key="all"
                            className={styles.listItem}
                            onClick={() => setSelectedCategory("")}
                            style={{
                                cursor: "pointer",
                                fontWeight: selectedCategory === "" ? "600" : "400",
                            }}
                        >
                            <span>All</span>
                            <ChevronRight size={16} />
                        </li>
                        {categories.map((item, index) => (
                            <li
                                key={index}
                                className={styles.listItem}
                                onClick={() => setSelectedCategory(item)}
                                style={{
                                    cursor: "pointer",
                                    fontWeight: selectedCategory === item ? "600" : "400",
                                }}
                            >
                                <span>{item}</span>
                                <ChevronRight size={16} />
                            </li>
                        ))}
                    </ul>
                </FilterSection>

                <FilterSection title="Price" sectionKey="price">
                    <div className={styles.priceRange}>
                        <input
                            type="range"
                            min="0"
                            max="1000"
                            value={priceValue}
                            onChange={(e) => setPriceValue(e.target.value)}
                            className={styles.rangeInput}
                        />
                        <div className={styles.priceLabels}>
                            <span>₹{priceValue}</span>
                            <span>₹1000</span>
                        </div>
                        <div className={styles.currentPrice}>Selected: ₹{priceValue}</div>
                    </div>
                </FilterSection>
            </aside>

            {/* Main */}
            <main className={styles.main}>
                <div className={styles.topBar}>
                    <h1 className={styles.pageTitle}>Organic Products</h1>
                    <div className={styles.sortSection}>
                        <span className={styles.productCount}>
                            Showing {filteredAndSortedProducts.length} of {products.length} Products
                        </span>
                        <div className={styles.sortWrapper}>
                            <span className={styles.sortLabel}>Sort by</span>
                            <select
                                className={styles.sortSelect}
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                            >
                                <option value="popular">Most Popular</option>
                                <option value="price-low">Price: Low to High</option>
                                <option value="price-high">Price: High to Low</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className={styles.productsGrid}>
                    {loading ? (
                        <div className={styles.loading}>Loading products...</div>
                    ) : error ? (
                        <div className={styles.error}>{error}</div>
                    ) : filteredAndSortedProducts.length === 0 ? (
                        <div className={styles.noProducts}>No products available</div>
                    ) : (
                        filteredAndSortedProducts.map((product) => (
                            <div key={product._id} className={styles.card}>
                                {product.image ? (
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className={styles.productImage}
                                        onError={(e) => {
                                            e.target.style.display = "none";
                                        }}
                                    />
                                ) : (
                                    <ImagePlaceholder width="100%" height="auto" text="No Image" />
                                )}
                                <div className={styles.cardBody}>
                                    <h3 className={styles.productName}>{product.name}</h3>
                                    <div className={styles.priceWrapper}>
                                        <span className={styles.newPrice}>₹{product.newPrice}</span>
                                        {product.oldPrice && (
                                            <span className={styles.oldPrice}>₹{product.oldPrice}</span>
                                        )}
                                    </div>
                                    <p className={styles.productDescription}>
                                        {product.description?.length > 100
                                            ? product.description.substring(0, 100) + "..."
                                            : product.description}
                                    </p>
                                    <div className={styles.cardActions}>
                                        <button
                                            className={styles.cartButton}
                                            onClick={() => handleAddToCart(product)}
                                        >
                                            <ShoppingCart size={20} />
                                        </button>
                                        <button
                                            className={styles.buyButton}
                                            onClick={() => handleBuyNow(product)}
                                        >
                                            Buy Now
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </main>
        </div>
        <Footer />
    </>
    );
};

export default ProductPage;