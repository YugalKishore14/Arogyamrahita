import React from 'react';
import Header from '../components/Header';
import styles from '../css/About.module.css';

const About = () => {
    return (
        <>
            <Header />
            <div className={styles.container}>
                <div className={styles.content}>
                    <h1>About Arogya Rahita</h1>
                    <p>
                        Arogya Rahita is your trusted source for authentic Ayurvedic and herbal products.
                        We are committed to bringing you the finest quality natural remedies and wellness products
                        that have been used for centuries in traditional Indian medicine.
                    </p>

                    <h2>Our Mission</h2>
                    <p>
                        To provide authentic, high-quality Ayurvedic products that promote health and wellness
                        while preserving the ancient wisdom of traditional Indian medicine.
                    </p>

                    <h2>Why Choose Us?</h2>
                    <ul>
                        <li>100% Authentic Ayurvedic Products</li>
                        <li>Premium Quality Ingredients</li>
                        <li>Traditional Formulations</li>
                        <li>Expert Consultation Available</li>
                        <li>Fast and Secure Delivery</li>
                    </ul>

                    <h2>Our Story</h2>
                    <p>
                        Founded with a vision to make authentic Ayurvedic products accessible to everyone,
                        Arogya Rahita has been serving customers with dedication and commitment to quality.
                        Our products are sourced from trusted manufacturers and follow traditional recipes
                        that have been passed down through generations.
                    </p>
                </div>
            </div>
        </>
    );
};

export default About;
