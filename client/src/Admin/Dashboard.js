import React, { useState, useEffect } from 'react';
import styles from '../css/AdminDashboard.module.css';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import ImageUpload from '../components/ImageUpload';
import ImagePlaceholder from '../components/ImagePlaceholder';
import { productAPI } from '../services/Api';

const Dashboard = () => {
    const { logout, user, isAdmin, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        image: '',
        oldPrice: '',
        newPrice: '',
        category: 'general',
        stock: ''
    });

    const categories = [
        'general',
        'health',
        'wellness',
        'supplements',
        'herbs',
        'other',
        'oils',
        'seeds',
        'aata',
        'pickle',
        'dry fruits',
        'millets',
        'sabut masala',
        'crush masala',
        'rice',
        'tea',
        'fast(varat)'
    ];

    useEffect(() => {
        if (!authLoading) {
            if (!user || !isAdmin()) {
                navigate('/login');
                return;
            }
            fetchProducts();
        }
    }, [user, isAdmin, authLoading, navigate]);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const data = await productAPI.getAdminProducts();
            setProducts(data.products || data);
        } catch (err) {
            setError('Error fetching products: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            setError('');
            setSuccess('');

            if (editingProduct) {
                await productAPI.updateProduct(editingProduct._id, formData);
            } else {
                await productAPI.createProduct(formData);
            }
            setSuccess(editingProduct ? 'Product updated successfully!' : 'Product created successfully!');
            setFormData({
                name: '',
                description: '',
                image: '',
                oldPrice: '',
                newPrice: '',
                category: 'general',
                stock: ''
            });
            setEditingProduct(null);
            setShowModal(false);
            fetchProducts();
        } catch (err) {
            setError('Error: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
        setFormData({
            name: product.name,
            description: product.description,
            image: product.image,
            oldPrice: product.oldPrice,
            newPrice: product.newPrice,
            category: product.category,
            stock: product.stock
        });
        setShowModal(true);
    };

    const handleDelete = async (productId) => {
        if (!window.confirm('Are you sure you want to delete this product?')) {
            return;
        }

        try {
            setLoading(true);
            await productAPI.deleteProduct(productId);
            setSuccess('Product deleted successfully!');
            fetchProducts();
        } catch (err) {
            setError('Error deleting product: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const openAddModal = () => {
        setEditingProduct(null);
        setFormData({
            name: '',
            description: '',
            image: '',
            oldPrice: '',
            newPrice: '',
            category: 'general',
            stock: ''
        });
        setShowModal(true);
        setError('');
        setSuccess('');
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingProduct(null);
        setError('');
        setSuccess('');
    };

    if (authLoading) {
        return (
            <div className={styles.adminContainer}>
                <div className={styles.loading}>Loading...</div>
            </div>
        );
    }

    if (!user || !isAdmin()) {
        navigate('/login');
        return null;
    }

    return (
        <div className={styles.adminContainer}>
            <div className={styles.header}>
                <h1>Admin Dashboard</h1>
                <div className={styles.headerButtons}>
                    <button className={styles.mainSiteBtn} onClick={() => navigate('/')}>
                        🌐 Go to Main Site
                    </button>
                    <button className={styles.logoutBtn} onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            </div>

            {error && <div className={styles.error}>{error}</div>}
            {success && <div className={styles.success}>{success}</div>}

            <div className={styles.mainContent}>
                <div className={styles.addProductSection}>
                    <h2 className={styles.sectionTitle}>Add New Product</h2>
                    <button
                        className={styles.submitBtn}
                        onClick={openAddModal}
                        style={{ marginBottom: '20px' }}
                    >
                        + Add Product
                    </button>

                    <div className={styles.quickStats}>
                        <div className={styles.statCard}>
                            <h3>Total Products</h3>
                            <p>{products.length}</p>
                        </div>
                        <div className={styles.statCard}>
                            <h3>Active Products</h3>
                            <p>{products.filter(p => p.isActive).length}</p>
                        </div>
                        <div className={styles.statCard}>
                            <h3>Categories</h3>
                            <p>{categories.length}</p>
                        </div>
                    </div>
                </div>

                <div className={styles.productsSection}>
                    <h2 className={styles.sectionTitle}>Manage Products</h2>
                    {loading ? (
                        <div className={styles.loading}>Loading products...</div>
                    ) : (
                        <div className={styles.productsList}>
                            {products.length === 0 ? (
                                <div className={styles.loading}>No products found</div>
                            ) : (
                                products.map(product => (
                                    <div key={product._id} className={styles.productCard}>
                                        {product.image ? (
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                className={styles.productImage}
                                                onError={(e) => {
                                                    e.target.style.display = 'none';
                                                    e.target.nextSibling.style.display = 'block';
                                                }}
                                            />
                                        ) : null}
                                        {!product.image && (
                                            <ImagePlaceholder
                                                width="100%"
                                                height="200px"
                                                text="No Image"
                                            />
                                        )}
                                        {/* <ImagePlaceholder
                                            width="100%"
                                            height="200px"
                                            text="No Image"
                                            style={{ display: 'none' }}
                                        /> */}
                                        <div className={styles.productInfo}>
                                            <h3 className={styles.productName}>{product.name}</h3>
                                            <p className={styles.productDescription}>
                                                {product.description.length > 100
                                                    ? product.description.substring(0, 100) + '...'
                                                    : product.description
                                                }
                                            </p>
                                            <div className={styles.productPrices}>
                                                <span className={styles.oldPrice}>₹{product.oldPrice}</span>
                                                <span className={styles.newPrice}>₹{product.newPrice}</span>
                                            </div>
                                            <p><strong>Category:</strong> {product.category}</p>
                                            <p><strong>Stock:</strong> {product.stock}</p>
                                            <p><strong>Status:</strong> {product.isActive ? 'Active' : 'Inactive'}</p>
                                        </div>
                                        <div className={styles.productActions}>
                                            <button
                                                className={styles.editBtn}
                                                onClick={() => handleEdit(product)}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className={styles.deleteBtn}
                                                onClick={() => handleDelete(product._id)}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>
            </div>

            {showModal && (
                <div className={styles.modal}>
                    <div className={styles.modalContent}>
                        <button className={styles.closeBtn} onClick={closeModal}>×</button>
                        <h2 className={styles.sectionTitle}>
                            {editingProduct ? 'Edit Product' : 'Add New Product'}
                        </h2>

                        <form onSubmit={handleSubmit} className={styles.form}>
                            <div className={styles.formGroup}>
                                <label>Product Name:</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder="Enter product name"
                                    required
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label>Description:</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    placeholder="Enter product description"
                                    required
                                />
                            </div>

                            <ImageUpload
                                onImageUpload={(imageUrl) => setFormData(prev => ({ ...prev, image: imageUrl }))}
                                currentImageUrl={formData.image}
                            />

                            <div className={styles.priceGroup}>
                                <div className={styles.formGroup}>
                                    <label>Old Price (₹):</label>
                                    <input
                                        type="number"
                                        name="oldPrice"
                                        value={formData.oldPrice}
                                        onChange={handleInputChange}
                                        placeholder="0"
                                        min="0"
                                        step="0.01"
                                        required
                                    />
                                </div>

                                <div className={styles.formGroup}>
                                    <label>New Price (₹):</label>
                                    <input
                                        type="number"
                                        name="newPrice"
                                        value={formData.newPrice}
                                        onChange={handleInputChange}
                                        placeholder="0"
                                        min="0"
                                        step="0.01"
                                        required
                                    />
                                </div>
                            </div>

                            <div className={styles.formGroup}>
                                <label>Category:</label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleInputChange}
                                >
                                    {categories.map(cat => (
                                        <option key={cat} value={cat}>
                                            {cat.charAt(0).toUpperCase() + cat.slice(1)}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className={styles.formGroup}>
                                <label>Stock:</label>
                                <input
                                    type="number"
                                    name="stock"
                                    value={formData.stock}
                                    onChange={handleInputChange}
                                    placeholder="0"
                                    min="0"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                className={styles.submitBtn}
                                disabled={loading}
                            >
                                {loading ? 'Processing...' : (editingProduct ? 'Update Product' : 'Add Product')}
                            </button>

                            {loading && (
                                <div className={styles.loadingMessage}>
                                    Please wait while we process your request...
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
