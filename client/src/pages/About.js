import React from "react";
import Header from "../components/Header";
import style from "../css/About.module.css";
import { GiTreeBranch } from "react-icons/gi";
import image from "../images/about.png";
import { GoDash } from "react-icons/go";
import Footer from "../components/Fotter";

const About = () => {
    const sections = [
        {
            title: "Who We Are",
            content: (
                <>
                    <p className={style.paragraph}>
                        Welcome to Arogyam Rahita, a brand dedicated to providing authentic
                        and natural organic products that enrich your life with purity,
                        taste, and health. We specialize in traditional Indian food products
                        made with care, love, and the wisdom of Ayurveda and Indian culture.
                        Our vision is to reconnect people with the power of nature and
                        promote healthy, chemical-free living.
                    </p>
                </>
            ),
        },
        {
            title: "Our Product Range",
            content: (
                <>
                    <p className={style.paragraph}>
                        We offer a wide variety of organic and handmade products that are
                        prepared using time-tested methods and natural ingredients. Our
                        major categories include:
                    </p>
                    <ul className={style.productList}>
                        <li className={style.productItem}>
                            <span className={style.productCategory}>Pickles (Achar)</span> →
                            Prepared using cold-pressed oils, natural spices, and traditional
                            recipes for authentic homemade taste.
                        </li>
                        <li className={style.productItem}>
                            <span className={style.productCategory}>Spices (Masale)</span> →
                            Pure, aromatic, and chemical-free spices to enhance the flavor of
                            your cooking.
                        </li>
                        <li className={style.productItem}>
                            <span className={style.productCategory}>
                                Pulses & Grains (Dal & Anaj)
                            </span>{" "}
                            → Nutritious, farm-fresh pulses and grains that promote a healthy
                            diet.
                        </li>
                        <li className={style.productItem}>
                            <span className={style.productCategory}>
                                Health Foods & Other Products
                            </span>{" "}
                            → Naturally prepared items that support wellness and immunity.
                        </li>
                    </ul>
                </>
            ),
        },
        {
            title: "Our Promise",
            content: (
                <>
                    <p className={style.paragraph}>
                        At Arogyam Rahita, we are committed to:
                    </p>
                    <ul className={style.promiseList}>
                        <li className={style.promiseItem}>
                            Offering 100% natural, organic, and preservative-free products.
                        </li>
                        <li className={style.promiseItem}>
                            Sourcing raw materials directly from trusted farmers.
                        </li>
                        <li className={style.promiseItem}>
                            Ensuring hygienic processing and safe packaging.
                        </li>
                        <li className={style.promiseItem}>
                            Providing products that are rich in taste, nutrition, and
                            authenticity.
                        </li>
                    </ul>
                </>
            ),
        },
        {
            title: "Our Mission & Vision",
            content: (
                <>
                    <p className={style.paragraph}>
                        Our mission is to spread awareness about healthy eating and organic
                        living. We aim to:
                    </p>
                    <ul className={style.missionList}>
                        <li className={style.missionItem}>
                            Promote the use of traditional food practices.
                        </li>
                        <li className={style.missionItem}>
                            Support local farmers and sustainable agriculture.
                        </li>
                        <li className={style.missionItem}>
                            Deliver pure and high-quality organic products to every household
                            in India.
                        </li>
                    </ul>
                    <p className={style.paragraph}>
                        Our vision is to build a healthier community where people choose
                        natural foods over processed alternatives and experience the true
                        benefits of organic living.
                    </p>
                </>
            ),
        },
        {
            title: "Customer Satisfaction",
            content: (
                <>
                    <p className={style.paragraph}>
                        Customer trust and happiness are at the heart of everything we do.
                        We ensure:
                    </p>
                    <ul className={style.satisfactionList}>
                        <li className={style.satisfactionItem}>
                            Transparent product information
                        </li>
                        <li className={style.satisfactionItem}>
                            On-time delivery across India
                        </li>
                        <li className={style.satisfactionItem}>
                            Quality assurance for every order
                        </li>
                        <li className={style.satisfactionItem}>
                            Friendly support for customer queries
                        </li>
                    </ul>
                </>
            ),
        },
        {
            title: "Why Choose Arogyam Rahita?",
            content: (
                <>
                    <ul className={style.whyChooseList}>
                        <li className={style.whyChooseItem}>
                            100% natural and chemical-free products
                        </li>
                        <li className={style.whyChooseItem}>
                            Traditional recipes and authentic taste
                        </li>
                        <li className={style.whyChooseItem}>
                            Ethical sourcing and farmer empowerment
                        </li>
                        <li className={style.whyChooseItem}>
                            Reliable service and customer-first approach
                        </li>
                    </ul>
                </>
            ),
        },
    ];

    return (
        <>
            <Header />
            <div className={style.aboutContainer}>
                <header className={style.header}>
                    <h1 className={style.headingPrimary}>
                        <span style={{ color: "#f07b0dff" }}>About Us</span> <GoDash />{" "}
                        Arogyam Rahita <GiTreeBranch style={{ color: "#2e8b57" }} />
                    </h1>
                </header>

                {sections.map((section, index) => (
                    <section
                        key={index}
                        className={`${style.section} ${index % 2 === 0 ? style.imageRight : style.imageLeft
                            }`}
                    >
                        <div className={style.contentContainer}>
                            <h2 className={style.headingSecondary}>
                                <GiTreeBranch style={{ color: "#2e8b57" }} /> {section.title}
                            </h2>
                            {section.content}
                        </div>
                        <div className={style.imageContainer}>
                            <img src={image} alt={section.title} />
                        </div>
                    </section>
                ))}
            </div>
            <Footer />
        </>
    );
};

export default About;
