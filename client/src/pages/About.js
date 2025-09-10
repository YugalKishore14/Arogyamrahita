import React from "react";
import styles from "../css/About.module.css";

const About = () => {
    const aboutData = [
        {
            title: "🌿 Who We Are",
            text: `Welcome to Arogyam Rahita, a brand dedicated to providing authentic and natural organic products that enrich your life with purity, taste, and health. 
      We specialize in traditional Indian food products made with care, love, and the wisdom of Ayurveda and Indian culture. 
      Our vision is to reconnect people with the power of nature and promote healthy, chemical-free living.`,
            image: "https://knnindia.co.in/uploads/newsfiles/AGRi-FOOD-21-6-20241.jpg",
        },
        {
            title: "🥗 Our Product Range",
            list: [
                "Pickles (Achar) → Prepared using cold-pressed oils, natural spices, and traditional recipes for authentic homemade taste.",
                "Spices (Masale) → Pure, aromatic, and chemical-free spices to enhance the flavor of your cooking.",
                "Pulses & Grains (Dal & Anaj) → Nutritious, farm-fresh pulses and grains that promote a healthy diet.",
                "Health Foods & Other Products → Naturally prepared items that support wellness and immunity.",
            ],
            image: "https://knnindia.co.in/uploads/newsfiles/AGRi-FOOD-21-6-20241.jpg",
        },
        {
            title: "🤝 Our Promise",
            list: [
                "Offering 100% natural, organic, and preservative-free products.",
                "Sourcing raw materials directly from trusted farmers.",
                "Ensuring hygienic processing and safe packaging.",
                "Providing products that are rich in taste, nutrition, and authenticity.",
            ],
            image: "https://knnindia.co.in/uploads/newsfiles/AGRi-FOOD-21-6-20241.jpg",
        },
        {
            title: "🌎 Our Mission & Vision",
            text: `Our mission is to spread awareness about healthy eating and organic living.`,
            list: [
                "Promote the use of traditional food practices.",
                "Support local farmers and sustainable agriculture.",
                "Deliver pure and high-quality organic products to every household in India.",
            ],
            footer:
                "Our vision is to build a healthier community where people choose natural foods over processed alternatives and experience the true benefits of organic living.",
            image: "https://knnindia.co.in/uploads/newsfiles/AGRi-FOOD-21-6-20241.jpg",
        },
        {
            title: "📦 Customer Satisfaction",
            list: [
                "Transparent product information.",
                "On-time delivery across India.",
                "Quality assurance for every order.",
                "Friendly support for customer queries.",
            ],
            image: "https://knnindia.co.in/uploads/newsfiles/AGRi-FOOD-21-6-20241.jpg",
        },
        {
            title: "✨ Why Choose Arogyam Rahita?",
            list: [
                "100% natural and chemical-free products.",
                "Traditional recipes and authentic taste.",
                "Ethical sourcing and farmer empowerment.",
                "Reliable service and customer-first approach.",
            ],
            image: "https://knnindia.co.in/uploads/newsfiles/AGRi-FOOD-21-6-20241.jpg",
        },
    ];

    return (
        <div className={styles.container}>
            <h1 className={styles.heading}>🟢 About Us – Arogyam Rahita</h1>

            {aboutData.map((section, index) => (
                <div
                    key={index}
                    className={`${styles.section} ${index % 2 === 0 ? styles.left : styles.right
                        }`}
                >
                    {section.image && (
                        <img
                            src={section.image}
                            alt={section.title}
                            className={styles.img}
                        />
                    )}
                    <div className={styles.content}>
                        <h2>{section.title}</h2>
                        {section.text && <p>{section.text}</p>}
                        {section.list && (
                            <ul>
                                {section.list.map((item, i) => (
                                    <li key={i}>{item}</li>
                                ))}
                            </ul>
                        )}
                        {section.footer && <p>{section.footer}</p>}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default About;
