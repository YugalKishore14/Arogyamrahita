import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import styles from '../css/UserProfile.module.css';
import orderBtnStyles from '../css/ProfileOrderHistory.module.css';
import { IoPerson, IoMail, IoCall } from 'react-icons/io5';
import { userAPI } from '../services/Api';
// import OrderHistory from '../components/OrderHistory';
import { Link } from 'react-router-dom';

const UserProfilePage = () => {
    const { user, logout } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        number: user?.number || '',
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const res = await userAPI.getProfile();
                const u = res.user || {};
                setFormData({
                    name: u.name || '',
                    number: u.number || '',
                });
            } catch (e) {
                if (user) {
                    setFormData({
                        name: user.name || '',
                        number: user.number || '',
                    });
                }
            }
        };
        loadProfile();
        // eslint-disable-next-line
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        const nameValid = /^[A-Za-z0-9 ]+$/.test(formData.name);
        const numberValid = /^[0-9]+$/.test(formData.number);
        if (!nameValid) {
            setMessage('Name can only contain letters, numbers, and spaces.');
            return;
        }
        if (!numberValid) {
            setMessage('Number can only contain digits.');
            return;
        }
        setLoading(true);
        try {
            await userAPI.updateProfile(formData);
            setMessage('Profile updated successfully!');
            setIsEditing(false);
        } catch (error) {
            setMessage('Error updating profile. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
    };

    return (
        <div style={{ minHeight: '100vh', background: '#f3f4f6', padding: '32px 0' }}>
            <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: 32 }}>
                <div style={{ flex: '1 1 340px', minWidth: 320 }}>
                    <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 16px rgba(0,0,0,0.07)', padding: 32, marginBottom: 32 }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
                            <div style={{ width: 90, height: 90, borderRadius: '50%', background: '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
                                <IoPerson size={60} color="#6b7280" />
                            </div>
                            <h2 style={{ margin: 0, fontWeight: 700, fontSize: 24 }}>{formData.name || user?.name || 'User'}</h2>
                            <p className={styles.email} style={{ margin: 0 }}>{user?.email}</p>
                            <button className={styles.logoutBtn} style={{ marginTop: 16, width: '100%' }} onClick={handleLogout}>Logout</button>
                        </div>
                    </div>
                </div>
                <div style={{ flex: '2 1 400px', minWidth: 340 }}>
                    <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 16px rgba(0,0,0,0.07)', padding: 32, marginBottom: 32 }}>
                        <h3 style={{ fontWeight: 600, fontSize: 20, marginBottom: 20, color: '#111827' }}>Profile Details</h3>
                        <div style={{ marginBottom: 16 }}>
                            <Link
                                to="/orders-history"
                                className={orderBtnStyles.viewOrdersBtn}
                                style={{ display: 'inline-block' }}
                            >
                                View All Orders History
                            </Link>
                        </div>
                        {message && (
                            <div className={`${styles.message} ${message.includes('successfully') ? styles.success : styles.error}`}>
                                {message}
                            </div>
                        )}
                        {isEditing ? (
                            <form onSubmit={handleSubmit} className={styles.form}>
                                <div className={styles.formGroup}>
                                    <label>Full Name</label>
                                    <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Number</label>
                                    <input type="text" name="number" value={formData.number} onChange={handleChange} required />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Email</label>
                                    <input type="email" name="email" value={user?.email || ''} readOnly disabled />
                                </div>
                                <div className={styles.formActions}>
                                    <button type="button" onClick={() => setIsEditing(false)} className={styles.cancelBtn}>Cancel</button>
                                    <button type="submit" className={styles.saveBtn} disabled={loading}>{loading ? 'Saving...' : 'Save Changes'}</button>
                                </div>
                            </form>
                        ) : (
                            <div className={styles.profileInfo}>
                                <div className={styles.infoItem}><IoPerson className={styles.icon} /><div><label>Full Name</label><p>{formData.name || 'Not provided'}</p></div></div>
                                <div className={styles.infoItem}><IoCall className={styles.icon} /><div><label>Number</label><p>{formData.number || 'Not provided'}</p></div></div>
                                <div className={styles.infoItem}><IoMail className={styles.icon} /><div><label>Email</label><p>{user?.email || 'Not provided'}</p></div></div>
                                <button onClick={() => setIsEditing(true)} className={styles.editBtn} style={{ width: '100%' }}>Edit Profile</button>
                            </div>
                        )}
                    </div>
                    {/* <div className={styles.orderHistorySection}>
                        <h3 style={{ fontWeight: 600, fontSize: 20, marginBottom: 20, color: '#111827' }}>Order History</h3>
                        <OrderHistory />
                    </div> */}
                </div>
            </div>
        </div>
    );
};

export default UserProfilePage;
