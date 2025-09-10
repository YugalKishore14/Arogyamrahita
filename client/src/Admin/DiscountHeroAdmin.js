import React, { useEffect, useState } from 'react';
import styles from '../css/DiscountHeroAdmin.module.css';
import { useNavigate } from 'react-router-dom';
import { discountHeroAPI } from '../services/Api';
import ImageUpload from '../components/ImageUpload';

const DiscountHeroAdmin = () => {
    const navigate = useNavigate();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [editing, setEditing] = useState(null);
    const [formData, setFormData] = useState({ image: '', productName: '', discountValue: 0, isActive: true });

    const fetchItems = async () => {
        try {
            setLoading(true);
            const data = await discountHeroAPI.listAll();
            const list = data.data || data;
            setItems(Array.isArray(list) ? list : []);
        } catch (e) {
            setError('Failed to load discount hero items');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchItems();
    }, []);

    const onImageUpload = (url) => setFormData(prev => ({ ...prev, image: url }));
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };
    const resetForm = () => { setEditing(null); setFormData({ image: '', productName: '', discountValue: 0, isActive: true }); };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setError(''); setSuccess('');
            if (editing) {
                await discountHeroAPI.update(editing._id, formData);
                setSuccess('DiscountHero updated');
            } else {
                await discountHeroAPI.create(formData);
                setSuccess('DiscountHero created');
            }
            resetForm();
            fetchItems();
        } catch (e) {
            setError(e?.response?.data?.message || 'Save failed');
        }
    };

    const handleEdit = (item) => {
        setEditing(item);
        setFormData({ image: item.image || '', productName: item.productName || '', discountValue: item.discountValue || 0, isActive: !!item.isActive });
    };

    const handleDelete = async (id) => {
        try {
            await discountHeroAPI.remove(id);
            fetchItems();
        } catch (e) { setError('Delete failed'); }
    };

    return (
        <div className={styles.dashboardContainer}>
            <div className={styles.header}>
                <h2>Manage Discount Hero</h2>
                <div style={{ display: 'flex', gap: 10 }}>
                    <button className={styles.addButton} onClick={() => navigate('/admin')}>Back to Dashboard</button>
                </div>
            </div>

            {error && <div className={styles.error}>{error}</div>}
            {success && <div className={styles.success}>{success}</div>}

            <div className={styles.card}>
                <h3>{editing ? 'Edit' : 'Create'} DiscountHero</h3>
                <form onSubmit={handleSubmit} className={styles.formGrid}>
                    <ImageUpload
                        onImageUpload={onImageUpload}
                        currentImageUrl={formData.image}
                        label="Discount Image"
                        uploadPath={'https://arogyamrahita.onrender.com/api/discount-hero/upload-image'}
                    />
                    <div className={styles.formGroup}>
                        <label>Product Name</label>
                        <input name="productName" value={formData.productName} onChange={handleChange} required />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Discount Value (%)</label>
                        <input type="number" min="0" max="100" name="discountValue" value={formData.discountValue} onChange={handleChange} required />
                    </div>
                    <div className={`${styles.formGroup} ${styles.checkboxGroup}`}>
                        <label className={styles.checkboxLabel} style={{ display: 'flex', alignItems: 'center' }}>
                            <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleChange} /> Active
                        </label>
                    </div>
                    <div className={styles.formActions}>
                        <button className={styles.addButton} type="submit">{editing ? 'Update' : 'Create'}</button>
                        {editing && <button type="button" className={styles.cancelButton} onClick={resetForm}>Cancel</button>}
                    </div>
                </form>
            </div>

            <div className={styles.card}>
                <h3>Existing Items</h3>
                {loading ? (<p>Loading...</p>) : (
                    <div className={styles.tableWrapper}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Image</th>
                                    <th>Product</th>
                                    <th>Discount</th>
                                    <th>Active</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map(item => (
                                    <tr key={item._id}>
                                        <td>{item.image ? <img src={item.image} alt={item.productName} style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 6 }} /> : '-'}</td>
                                        <td>{item.productName}</td>
                                        <td>{item.discountValue}%</td>
                                        <td>{item.isActive ? 'Yes' : 'No'}</td>
                                        <td>
                                            <button className={styles.smallButton} onClick={() => handleEdit(item)}>Edit</button>
                                            <button className={styles.deleteButton} onClick={() => handleDelete(item._id)}>Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DiscountHeroAdmin;


