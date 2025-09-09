import React, { useEffect, useState } from 'react';
import styles from '../css/CategoryAdmin.module.css';
import { useNavigate } from 'react-router-dom';
import { categoryAPI } from '../services/Api';
import ImageUpload from '../components/ImageUpload';

const CategoryAdmin = () => {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [editing, setEditing] = useState(null);
    const [formData, setFormData] = useState({ name: '', image: '' });

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const data = await categoryAPI.getAllCategories();
            const list = data.categories || data;
            setCategories(Array.isArray(list) ? list : []);
        } catch (e) {
            setError('Failed to load categories');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const onImageUpload = (url) => setFormData(prev => ({ ...prev, image: url }));

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const resetForm = () => {
        setEditing(null);
        setFormData({ name: '', image: '' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setError('');
            setSuccess('');
            if (editing) {
                await categoryAPI.updateCategory(editing._id, formData);
                setSuccess('Category updated');
            } else {
                await categoryAPI.createCategory(formData);
                setSuccess('Category created');
            }
            resetForm();
            fetchCategories();
        } catch (e) {
            setError(e?.response?.data?.message || 'Save failed');
        }
    };

    const handleEdit = (cat) => {
        setEditing(cat);
        setFormData({ name: cat.name || '', image: cat.image || '' });
    };

    const handleDelete = async (id) => {
        try {
            await categoryAPI.deleteCategory(id);
            fetchCategories();
        } catch (e) {
            setError('Delete failed');
        }
    };

    return (
        <div className={styles.dashboardContainer}>
            <div className={styles.header}>
                <h2>Manage Categories</h2>
                <div style={{ display: 'flex', gap: 10 }}>
                    <button className={styles.addButton} onClick={() => navigate('/admin')}>Back to Dashboard</button>
                </div>
            </div>

            {error && <div className={styles.error}>{error}</div>}
            {success && <div className={styles.success}>{success}</div>}

            <div className={styles.card}>
                <h3>{editing ? 'Edit Category' : 'Add Category'}</h3>
                <form onSubmit={handleSubmit} className={styles.formGrid}>
                    <div className={styles.formGroup}>
                        <label>Name</label>
                        <input name="name" value={formData.name} onChange={handleChange} required />
                    </div>

                    <ImageUpload
                        onImageUpload={onImageUpload}
                        currentImageUrl={formData.image}
                        label="Category Image"
                        uploadPath={'https://arogyamrahita.onrender.com/api/categories/upload-image'}
                    />
                    <div className={styles.formActions}>
                        <button className={styles.addButton} type="submit">{editing ? 'Update' : 'Create'}</button>
                        {editing && <button type="button" className={styles.cancelButton} onClick={resetForm}>Cancel</button>}
                    </div>
                </form>
            </div>

            <div className={styles.card}>
                <h3>Existing Categories</h3>
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <div className={styles.tableWrapper}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Image</th>
                                    <th>Name</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {categories.map(cat => (
                                    <tr key={cat._id}>
                                        <td>{cat.image ? <img src={cat.image} alt={cat.name} style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 6 }} /> : '-'}</td>
                                        <td>{cat.name}</td>
                                        <td>
                                            <button className={styles.smallButton} onClick={() => handleEdit(cat)}>Edit</button>
                                            <button className={styles.deleteButton} onClick={() => handleDelete(cat._id)}>Delete</button>
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

export default CategoryAdmin;


