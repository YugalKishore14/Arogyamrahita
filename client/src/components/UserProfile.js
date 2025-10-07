import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import styles from '../css/UserProfile.module.css';
import { IoClose, IoPerson, IoMail, IoCall, IoLocation } from 'react-icons/io5';
import { userAPI } from '../services/Api';
import OrderHistory from './OrderHistory';

const UserProfile = ({ isOpen, onClose }) => {
    const { user, logout, login } = useAuth();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({
        name: user?.name || '',
        number: user?.number || '',
    });

    useEffect(() => {
        setEditData({ name: user?.name || '', number: user?.number || '' });
    }, [user, isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');

        const trimmedName = editData.name.trim();
        const trimmedNumber = editData.number.trim();

        const emojiRegex = /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/;

        if (!trimmedName) {
            setMessage('Name is required.');
            return;
        }
        if (!/^[a-zA-Z]+(?: [a-zA-Z]+)*$/.test(trimmedName)) {
            setMessage('Name can only contain letters and single spaces.');
            return;
        }
        if (emojiRegex.test(trimmedName)) {
            setMessage('Name cannot contain emojis or special symbols.');
            return;
        }
        if (!/^[6-9]\d{9}$/.test(trimmedNumber)) {
            setMessage('Please enter a valid 10-digit Indian mobile number without any symbols.');
            return;
        }

        setLoading(true);
        try {
            const response = await userAPI.updateProfile({ name: trimmedName, number: trimmedNumber });
            login(response.token, response.user);
            setMessage('Profile updated successfully!');
            setIsEditing(false);
        } catch (error) {
            setMessage('Error updating profile. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleLogout = () => {
        logout();
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div className={styles.header}>
                    <h2>User Profile</h2>
                    <button className={styles.closeBtn} onClick={onClose}>
                        <IoClose size={24} />
                    </button>
                </div>

                <div className={styles.content}>
                    {message && (
                        <div className={`${styles.message} ${message.includes('successfully') ? styles.success : styles.error}`}>
                            {message}
                        </div>
                    )}

                    <div className={styles.userInfo}>
                        <div className={styles.avatar}>
                            <IoPerson size={40} />
                        </div>
                        <div className={styles.userDetails}>
                            <h3>{user?.name || 'User'}</h3>
                            <p className={styles.email}>{user?.email}</p>
                            <p className={styles.email}>{user?.number || 'No number provided'}</p>
                        </div>
                    </div>

                    {isEditing ? (
                        <form onSubmit={handleSubmit} className={styles.form}>
                            <div className={styles.formGroup}>
                                <label>Full Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={editData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label>Number</label>
                                <input
                                    type="text"
                                    name="number"
                                    value={editData.number}
                                    onChange={handleChange}
                                    required
                                    maxLength="10"
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label>Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={user?.email || ''}
                                    readOnly
                                    disabled
                                />
                            </div>

                            <div className={styles.formActions}>
                                <button
                                    type="button"
                                    onClick={() => setIsEditing(false)}
                                    className={styles.cancelBtn}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className={styles.saveBtn}
                                    disabled={loading}
                                >
                                    {loading ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className={styles.profileInfo}>
                            <div className={styles.infoItem}>
                                <IoPerson className={styles.icon} />
                                <div>
                                    <label>Full Name</label>
                                    <p>{user?.name || 'Not provided'}</p>
                                </div>
                            </div>

                            <div className={styles.infoItem}>
                                <IoCall className={styles.icon} />
                                <div>
                                    <label>Number</label>
                                    <p>{user?.number || 'Not provided'}</p>
                                </div>
                            </div>

                            <div className={styles.infoItem}>
                                <IoMail className={styles.icon} />
                                <div>
                                    <label>Email</label>
                                    <p>{user?.email || 'Not provided'}</p>
                                </div>
                            </div>

                            <div className={styles.profileActions}>
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className={styles.editBtn}
                                >
                                    Edit Profile
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className={styles.logoutBtn}
                                >
                                    Logout
                                </button>
                            </div>
                        </div>
                    )}
                </div>
                <OrderHistory />
            </div>
        </div>
    );
};

export default UserProfile;
