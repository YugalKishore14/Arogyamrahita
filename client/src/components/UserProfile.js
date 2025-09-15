import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import styles from '../css/UserProfile.module.css';
import { IoClose, IoPerson, IoMail, IoCall, IoLocation } from 'react-icons/io5';
import { userAPI } from '../services/Api';

const UserProfile = ({ isOpen, onClose }) => {
    const { user, logout } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        number: user?.number || '',
    });

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
        if (isOpen) loadProfile();
    }, [isOpen, user]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');

        const nameValid = /^[A-Za-z0-9 ]+$/.test(formData.name);
        const numberValid = /^[0-9]+$/.test(formData.number);
        if (!nameValid) {
            setMessage('Name can only contain letters, numbers, and spaces. No emoji or symbols allowed.');
            return;
        }
        if (!numberValid) {
            setMessage('Number can only contain digits. No emoji or symbols allowed.');
            return;
        }

        setLoading(true);
        try {
            const response = await userAPI.updateProfile(formData);
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
                            <h3>{formData.name || user?.name || 'User'}</h3>
                            <p className={styles.email}>{user?.email}</p>
                        </div>
                    </div>

                    {isEditing ? (
                        <form onSubmit={handleSubmit} className={styles.form}>
                            <div className={styles.formGroup}>
                                <label>Full Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label>Number</label>
                                <input
                                    type="text"
                                    name="number"
                                    value={formData.number}
                                    onChange={handleChange}
                                    required
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
                                    <p>{formData.name || 'Not provided'}</p>
                                </div>
                            </div>

                            <div className={styles.infoItem}>
                                <IoCall className={styles.icon} />
                                <div>
                                    <label>Number</label>
                                    <p>{formData.number || 'Not provided'}</p>
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
            </div>
        </div>
    );
};

export default UserProfile;
