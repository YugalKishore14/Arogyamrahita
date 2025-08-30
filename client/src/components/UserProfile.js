import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import styles from '../css/UserProfile.module.css';
import { IoClose, IoPerson, IoMail, IoCall, IoLocation } from 'react-icons/io5';

const UserProfile = ({ isOpen, onClose }) => {
    const { user, logout } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        phone: user?.phone || '',
        address: user?.address || '',
        city: user?.city || '',
        state: user?.state || '',
        pincode: user?.pincode || ''
    });
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
        setLoading(true);
        setMessage('');

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:4000/api/users/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                setMessage('Profile updated successfully!');
                setIsEditing(false);
                // Update local user data
                // You might want to refresh the auth context here
            } else {
                const errorData = await response.json();
                setMessage(errorData.message || 'Failed to update profile');
            }
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
                            <h3>{user?.name || 'User'}</h3>
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
                                <label>Phone Number</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label>Address</label>
                                <textarea
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    rows="3"
                                />
                            </div>

                            <div className={styles.formRow}>
                                <div className={styles.formGroup}>
                                    <label>City</label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>State</label>
                                    <input
                                        type="text"
                                        name="state"
                                        value={formData.state}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className={styles.formGroup}>
                                <label>Pincode</label>
                                <input
                                    type="text"
                                    name="pincode"
                                    value={formData.pincode}
                                    onChange={handleChange}
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
                                    <label>Phone</label>
                                    <p>{formData.phone || 'Not provided'}</p>
                                </div>
                            </div>

                            <div className={styles.infoItem}>
                                <IoLocation className={styles.icon} />
                                <div>
                                    <label>Address</label>
                                    <p>{formData.address || 'Not provided'}</p>
                                </div>
                            </div>

                            <div className={styles.infoItem}>
                                <IoLocation className={styles.icon} />
                                <div>
                                    <label>City, State, Pincode</label>
                                    <p>
                                        {[formData.city, formData.state, formData.pincode]
                                            .filter(Boolean)
                                            .join(', ') || 'Not provided'}
                                    </p>
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
