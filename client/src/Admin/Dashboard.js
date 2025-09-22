import React, { useState, useEffect } from "react";
import styles from "../css/AdminDashboard.module.css";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import ImageUpload from "../components/ImageUpload";
import ImagePlaceholder from "../components/ImagePlaceholder";
import { productAPI, adminAPI, ordersAPI } from "../services/Api";
import OrderTracker from "../components/OrderTracker";
import { BsGlobeCentralSouthAsia } from "react-icons/bs";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const Dashboard = () => {
    const { logout, user, isAdmin, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        image: "",
        oldPrice: "",
        newPrice: "",
        category: "general",
        variants: [],
    });
    const [variantInput, setVariantInput] = useState({
        name: "",
        weight: "",
        weightUnit: "kg",
        oldPrice: "",
        newPrice: "",
        stock: "",
    });
    const [users, setUsers] = useState([]);
    const [orders, setOrders] = useState([]);
    const [orderUpdating, setOrderUpdating] = useState(null);
    const [orderNameFilter, setOrderNameFilter] = useState("");
    const [orderDateFilter, setOrderDateFilter] = useState("");

    const filteredOrders = orders.filter((o) => {
        let match = true;
        if (orderNameFilter) {
            match = o.user?.name
                ?.toLowerCase()
                .includes(orderNameFilter.toLowerCase());
        }
        if (match && orderDateFilter) {
            const orderDate = o.createdAt ? o.createdAt.slice(0, 10) : "";
            match = orderDate === orderDateFilter;
        }
        return match;
    });

    const categories = [
        "general",
        "health",
        "wellness",
        "supplements",
        "herbs",
        "other",
        "oils",
        "seeds",
        "aata",
        "pickle",
        "dal",
        "dry fruits",
        "millets",
        "sabut masala",
        "masala",
        "Special Churan",
        "rice",
        "tea",
        "fast(varat)",
    ];

    useEffect(() => {
        if (!authLoading) {
            if (!user || !isAdmin()) {
                navigate("/login");
                return;
            }
            fetchProducts();
            fetchUsers();
            fetchOrders();
        }
    }, [user, isAdmin, authLoading, navigate]);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const data = await productAPI.getAdminProducts();
            setProducts(data.products || data);
        } catch (err) {
            setError("Error fetching products: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    // Variant management handlers
    const handleVariantInputChange = (e) => {
        const { name, value } = e.target;
        setVariantInput((prev) => ({ ...prev, [name]: value }));
    };

    const addVariant = (e) => {
        e.preventDefault();
        if (
            !variantInput.name ||
            !variantInput.weight ||
            !variantInput.weightUnit ||
            variantInput.stock === "" ||
            variantInput.oldPrice === "" ||
            variantInput.newPrice === ""
        )
            return;
        setFormData((prev) => {
            const safeVariants = Array.isArray(prev.variants) ? prev.variants : [];
            return {
                ...prev,
                variants: [
                    ...safeVariants,
                    {
                        name: variantInput.name,
                        weight: Number(variantInput.weight),
                        weightUnit: variantInput.weightUnit,
                        oldPrice: Number(variantInput.oldPrice),
                        newPrice: Number(variantInput.newPrice),
                        stock: Number(variantInput.stock),
                    },
                ],
            };
        });
        setVariantInput({
            name: "",
            weight: "",
            weightUnit: "kg",
            oldPrice: "",
            newPrice: "",
            stock: "",
        });
    };

    const removeVariant = (idx) => {
        setFormData((prev) => {
            const safeVariants = Array.isArray(prev.variants) ? prev.variants : [];
            return {
                ...prev,
                variants: safeVariants.filter((_, i) => i !== idx),
            };
        });
    };

    const fetchUsers = async () => {
        try {
            const data = await adminAPI.listUsers();
            setUsers(data);
        } catch (e) {
            console.error(e);
        }
    };

    const fetchOrders = async () => {
        try {
            const data = await adminAPI.listOrders();
            setOrders(Array.isArray(data) ? data : data.orders || []);
        } catch (e) {
            console.error(e);
        }
    };

    const updateOrderStatus = async (orderId, status) => {
        try {
            setOrderUpdating(orderId);
            await ordersAPI.updateStatus(orderId, status);
            await fetchOrders();
            setSuccess("Order updated");
        } catch (e) {
            setError("Failed to update order");
        } finally {
            setOrderUpdating(null);
        }
    };

    // 🔹 Generate PDF Invoice

    const generateInvoicePDF = (order) => {
        const doc = new jsPDF();

        // ==== COMPANY INFO ====
        doc.setFontSize(16);
        doc.text("Arogyam Rahita", 20, 20);
        doc.setFontSize(11);
        doc.text("Sanik Vihar, Meerut", 20, 28);
        doc.text("Phone: (000) 000-0000", 20, 34);

        // ==== INVOICE INFO (without big INVOICE text) ====
        doc.setFontSize(11);
        doc.text(`Invoice #: ${order._id || "_____"}`, 150, 40);
        doc.text(
            `Date: ${order.createdAt ? order.createdAt.slice(0, 10) : "_____"}`,
            150,
            46
        );

        // Customer ID shift left so it's not cut
        doc.text(`Customer ID: ${order.user?._id || "_____"}`, 20, 46);
        doc.text("Terms: Net 30 Days", 150, 52);

        // ==== BILL TO / SHIP TO ====
        doc.setFontSize(12);
        doc.text("Bill To:", 20, 60);
        doc.setFontSize(11);
        doc.text(order.user?.name || "_________", 20, 66);
        doc.text(order.user?.email || "_________", 20, 72);
        doc.text(order.user?.address || "_________", 20, 78);

        doc.setFontSize(12);
        doc.text("Ship To:", 100, 60);
        doc.setFontSize(11);
        doc.text(order.user?.name || "_________", 100, 66);
        doc.text(order.user?.email || "_________", 100, 72);
        doc.text(order.user?.address || "_________", 100, 78);

        // ==== TABLE (ITEMS) ====
        const items = (order.items || []).map((it) => [
            it.name,
            it.quantity,
            "" + String(it.price), // Fix: prevent weird "1"
            "" + String(it.price * it.quantity),
        ]);

        autoTable(doc, {
            startY: 90,
            head: [["Description", "Qty", "Unit Price", "Amount"]],
            body: items,
            styles: { fontSize: 11 },
        });

        // ==== TOTAL ====
        const finalY = doc.lastAutoTable.finalY + 10;
        doc.setFontSize(12);
        doc.text(`TOTAL: ${order.totalAmount || 0}`, 150, finalY);

        // ==== FOOTER ====
        doc.setFontSize(10);
        doc.text("Thank you for your business!", 20, finalY + 20);
        doc.text(
            "If you have any questions about this invoice, please contact:",
            20,
            finalY + 28
        );
        doc.text(
            "Arogyam Rahita | Phone: (000) 000-0000 | email@domain.com",
            20,
            finalY + 34
        );

        doc.save(`invoice_${order._id || "draft"}.pdf`);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            setError("");
            setSuccess("");

            const submitData = {
                ...formData,
                weight: formData.weight ? Number(formData.weight) : 0,
            };
            if (editingProduct) {
                await productAPI.updateProduct(editingProduct._id, submitData);
            } else {
                await productAPI.createProduct(submitData);
            }
            setSuccess(
                editingProduct
                    ? "Product updated successfully!"
                    : "Product created successfully!"
            );
            setFormData({
                name: "",
                description: "",
                image: "",
                oldPrice: "",
                newPrice: "",
                category: "general",
                stock: "",
                weight: "",
                weightUnit: "kg",
            });
            setEditingProduct(null);
            setShowModal(false);
            fetchProducts();
        } catch (err) {
            setError("Error: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
        setFormData({
            name: product.name || "",
            description: product.description || "",
            image: product.image || "",
            oldPrice: product.oldPrice || "",
            newPrice: product.newPrice || "",
            category: product.category || "general",
            stock: product.stock || "",
            weight: product.weight !== undefined ? product.weight : "",
            weightUnit: product.weightUnit || "kg",
        });
        setShowModal(true);
    };

    const handleDelete = async (productId) => {
        if (!window.confirm("Are you sure you want to delete this product?")) {
            return;
        }

        try {
            setLoading(true);
            await productAPI.deleteProduct(productId);
            setSuccess("Product deleted successfully!");
            fetchProducts();
        } catch (err) {
            setError("Error deleting product: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const openAddModal = () => {
        setEditingProduct(null);
        setFormData({
            name: "",
            description: "",
            image: "",
            oldPrice: "",
            newPrice: "",
            category: "general",
            stock: "",
            weight: "",
            weightUnit: "kg",
        });
        setShowModal(true);
        setError("");
        setSuccess("");
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingProduct(null);
        setError("");
        setSuccess("");
    };

    if (authLoading) {
        return (
            <div className={styles.adminContainer}>
                <div className={styles.loading}>Loading...</div>
            </div>
        );
    }

    if (!user || !isAdmin()) {
        navigate("/login");
        return null;
    }

    return (
        <div className={styles.adminContainer}>
            <div className={styles.header}>
                <h1>Admin Dashboard</h1>
                <div className={styles.headerButtons}>
                    <Link to="/admin/discount-hero" className={styles.mainSiteBtn}>
                        Manage Discount
                    </Link>
                    <button className={styles.mainSiteBtn} onClick={() => navigate("/")}>
                        <BsGlobeCentralSouthAsia /> Go to Main Site
                    </button>
                    <button className={styles.logoutBtn} onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            </div>

            {error && <div className={styles.error}>{error}</div>}
            {success && <div className={styles.success}>{success}</div>}

            <div className={styles.mainContent}>
                {/* Users */}
                <div className={styles.usersSection}>
                    <h2 className={styles.sectionTitle}>Users Presence</h2>
                    <div className={styles.usersList}>
                        {users.map((u) => (
                            <div key={u.id} className={styles.userRow}>
                                <span className={styles.userName}>
                                    {u.name} ({u.email})
                                </span>
                                <span
                                    id={styles.activeStatus}
                                    className={u.online ? styles.online : styles.offline}
                                >
                                    {u.online ? "● Online" : "● Offline"}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Orders */}
                <div className={styles.ordersSection}>
                    <h2 className={styles.sectionTitle}>Orders</h2>
                    <div
                        className={styles.input}
                        style={{ display: "flex", gap: 16, marginBottom: 16 }}
                    >
                        <input
                            type="text"
                            placeholder="Filter by user name"
                            value={orderNameFilter}
                            onChange={(e) => setOrderNameFilter(e.target.value)}
                            style={{
                                padding: 8,
                                borderRadius: 8,
                                border: "1px solid #ccc",
                                minWidth: 132,
                            }}
                        />
                        <input
                            type="date"
                            value={orderDateFilter}
                            onChange={(e) => setOrderDateFilter(e.target.value)}
                            style={{ padding: 8, borderRadius: 8, border: "1px solid #ccc" }}
                        />
                    </div>
                    <div className={styles.ordersList}>
                        {filteredOrders.map((o) => (
                            <div key={o._id} className={styles.orderCard}>
                                <div className={styles.orderHeader}>
                                    <div>
                                        <strong>Order:</strong> {o._id}
                                    </div>
                                    <div>
                                        <strong>User:</strong> {o.user?.name} ({o.user?.email})
                                    </div>
                                </div>
                                <div className={styles.orderItems}>
                                    {(o.items || []).map((it, idx) => (
                                        <div key={idx} className={styles.orderItem}>
                                            x{it.quantity} {it.name} — ₹{it.price}
                                        </div>
                                    ))}
                                </div>
                                <div className={styles.orderFooter}>
                                    <div>
                                        <strong>Total:</strong> ₹{o.totalAmount}
                                    </div>

                                    <div className={styles.statusControls}>
                                        <select
                                            value={o.status}
                                            onChange={(e) => updateOrderStatus(o._id, e.target.value)}
                                            disabled={orderUpdating === o._id}
                                        >
                                            {[
                                                "PLACED",
                                                "PAID",
                                                "READY_FOR_DELIVERY",
                                                "SHIPPED",
                                                "DELIVERED",
                                                "CANCELLED",
                                            ].map((s) => (
                                                <option key={s} value={s}>
                                                    {s}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Invoice Button */}
                                <div style={{ marginTop: "12px" }}>
                                    <button
                                        className={styles.invoiceSubmitBtn}
                                        onClick={() => generateInvoicePDF(o)}
                                    >
                                        🧾 Download/Print Invoice
                                    </button>
                                </div>

                                <div style={{ margin: "12px 0" }}>
                                    <OrderTracker status={o.status} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Add Product */}
                <div className={styles.addProductSection}>
                    <h2 className={styles.sectionTitle}>Add New Product</h2>
                    <button
                        className={styles.submitBtn}
                        onClick={openAddModal}
                        style={{ marginBottom: "20px" }}
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
                            <p>{products.filter((p) => p.isActive).length}</p>
                        </div>
                        <div className={styles.statCard}>
                            <h3>Categories</h3>
                            <p>{categories.length}</p>
                        </div>
                    </div>
                </div>

                {/* Manage Products */}
                <div className={styles.productsSection}>
                    <h2 className={styles.sectionTitle}>Manage Products</h2>
                    {loading ? (
                        <div className={styles.loading}>Loading products...</div>
                    ) : (
                        <div className={styles.productsList}>
                            {products.length === 0 ? (
                                <div className={styles.loading}>No products found</div>
                            ) : (
                                products.map((product) => (
                                    <div key={product._id} className={styles.productCard}>
                                        {product.image ? (
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                className={styles.productImage}
                                                onError={(e) => {
                                                    e.target.style.display = "none";
                                                    e.target.nextSibling.style.display = "block";
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
                                        <div className={styles.productInfo}>
                                            <h3 className={styles.productName}>{product.name}</h3>
                                            <p className={styles.productDescription}>
                                                {product.description.length > 100
                                                    ? product.description.substring(0, 100) + "..."
                                                    : product.description}
                                            </p>
                                            {/* Show all variants if present */}
                                            {product.variants && product.variants.length > 0 ? (
                                                <div className={styles.variantList}>
                                                    <strong>Variants:</strong>
                                                    <table style={{ width: '100%', marginTop: 8, borderCollapse: 'collapse', fontSize: '0.95em' }}>
                                                        <thead>
                                                            <tr style={{ background: '#f5f5f5' }}>
                                                                <th style={{ padding: '4px 8px', border: '1px solid #ddd' }}>Name</th>
                                                                <th style={{ padding: '4px 8px', border: '1px solid #ddd' }}>Weight</th>
                                                                <th style={{ padding: '4px 8px', border: '1px solid #ddd' }}>Unit</th>
                                                                <th style={{ padding: '4px 8px', border: '1px solid #ddd' }}>New Price</th>
                                                                <th style={{ padding: '4px 8px', border: '1px solid #ddd' }}>Old Price</th>
                                                                <th style={{ padding: '4px 8px', border: '1px solid #ddd' }}>Stock</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {product.variants.map((v, idx) => (
                                                                <tr key={idx}>
                                                                    <td style={{ padding: '4px 8px', border: '1px solid #ddd' }}>{v.name || '-'}</td>
                                                                    <td style={{ padding: '4px 8px', border: '1px solid #ddd' }}>{v.weight}</td>
                                                                    <td style={{ padding: '4px 8px', border: '1px solid #ddd' }}>{v.weightUnit}</td>
                                                                    <td style={{ padding: '4px 8px', border: '1px solid #ddd', color: '#388e3c', fontWeight: 600 }}>₹{v.newPrice}</td>
                                                                    <td style={{ padding: '4px 8px', border: '1px solid #ddd', color: '#b71c1c', textDecoration: v.oldPrice && v.oldPrice > v.newPrice ? 'line-through' : 'none' }}>{v.oldPrice && v.oldPrice > v.newPrice ? `₹${v.oldPrice}` : '-'}</td>
                                                                    <td style={{ padding: '4px 8px', border: '1px solid #ddd' }}>{v.stock}</td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            ) : (
                                                <div className={styles.productPrices}>
                                                    <span className={styles.oldPrice}>
                                                        ₹{product.oldPrice}
                                                    </span>
                                                    <span className={styles.newPrice}>
                                                        ₹{product.newPrice}
                                                    </span>
                                                </div>
                                            )}
                                            <p>
                                                <strong>Category:</strong> {product.category}
                                            </p>
                                            <p>
                                                <strong>Stock:</strong> {product.stock}
                                            </p>
                                            <p>
                                                <strong>Status:</strong>{" "}
                                                {product.isActive ? "Active" : "Inactive"}
                                            </p>
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

            {/* Product Modal */}
            {showModal && (
                <div className={styles.modal}>
                    <div className={styles.modalContent}>
                        <button className={styles.closeBtn} onClick={closeModal}>
                            ×
                        </button>
                        <h2 className={styles.sectionTitle}>
                            {editingProduct ? "Edit Product" : "Add New Product"}
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
                                onImageUpload={(imageUrl) =>
                                    setFormData((prev) => ({ ...prev, image: imageUrl }))
                                }
                                currentImageUrl={formData.image}
                            />

                            <div className={styles.formGroup}>
                                <label>Category:</label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleInputChange}
                                >
                                    {categories.map((cat) => (
                                        <option key={cat} value={cat}>
                                            {cat.charAt(0).toUpperCase() + cat.slice(1)}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Variants Section */}
                            <div className={styles.formGroup}>
                                <label>Add Product Variant (Weight):</label>
                                <div
                                    style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}
                                >
                                    <input
                                        type="text"
                                        name="name"
                                        value={variantInput.name}
                                        onChange={handleVariantInputChange}
                                        placeholder="Variant"
                                        style={{ width: "120px" }}
                                    />
                                    <input
                                        type="number"
                                        name="weight"
                                        value={variantInput.weight}
                                        onChange={handleVariantInputChange}
                                        placeholder="Weight"
                                        min="0"
                                        step="0.01"
                                        style={{ width: "100px" }}
                                    />
                                    <select
                                        name="weightUnit"
                                        value={variantInput.weightUnit}
                                        onChange={handleVariantInputChange}
                                        style={{ width: "100px" }}
                                    >
                                        <option value="kg">kg</option>
                                        <option value="gm">gm</option>
                                        <option value="ltr">ltr</option>
                                        <option value="mg">mg</option>
                                        <option value="oz">oz</option>
                                    </select>
                                    <input
                                        type="number"
                                        name="oldPrice"
                                        value={variantInput.oldPrice}
                                        onChange={handleVariantInputChange}
                                        placeholder="Old Price (₹)"
                                        min="0"
                                        step="0.01"
                                        style={{ width: "100px" }}
                                    />
                                    <input
                                        type="number"
                                        name="newPrice"
                                        value={variantInput.newPrice}
                                        onChange={handleVariantInputChange}
                                        placeholder="New Price (₹)"
                                        min="0"
                                        step="0.01"
                                        style={{ width: "100px" }}
                                    />
                                    <input
                                        type="number"
                                        name="stock"
                                        value={variantInput.stock}
                                        onChange={handleVariantInputChange}
                                        placeholder="Stock"
                                        min="0"
                                        style={{ width: "100px" }}
                                    />
                                    <button
                                        onClick={addVariant}
                                        style={{ padding: "0.2rem 0.8rem", borderRadius: "10px" }}
                                    >
                                        Add
                                    </button>
                                </div>
                                {/* List of added variants */}
                                {formData.variants && formData.variants.length > 0 && (
                                    <div className={styles.variantTableWrapper}>
                                        <table className={styles.variantTable}>
                                            <thead>
                                                <tr>
                                                    <th>Name</th>
                                                    <th>Weight</th>
                                                    <th>Unit</th>
                                                    <th>Old Price (₹)</th>
                                                    <th>New Price (₹)</th>
                                                    <th>Stock</th>
                                                    <th>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {formData.variants.map((v, idx) => (
                                                    <tr key={idx}>
                                                        <td>{v.name}</td>
                                                        <td>{v.weight}</td>
                                                        <td>{v.weightUnit}</td>
                                                        <td>{v.oldPrice}</td>
                                                        <td>{v.newPrice}</td>
                                                        <td>{v.stock}</td>
                                                        <td>
                                                            <button
                                                                onClick={() => removeVariant(idx)}
                                                                className={styles.variantRemoveBtn}
                                                            >
                                                                Remove
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>

                            <button
                                type="submit"
                                className={styles.submitBtn}
                                disabled={loading}
                            >
                                {loading
                                    ? "Processing..."
                                    : editingProduct
                                        ? "Update Product"
                                        : "Add Product"}
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
