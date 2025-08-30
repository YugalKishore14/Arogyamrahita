import { IoMenu, IoCartOutline } from "react-icons/io5";
import { LuUser } from "react-icons/lu";
import styles from "./css/Services.module.css";

const Services = () => {
    return (
        <>
            <div className={styles.mainContainer}>
                <div className={styles.mainHeader}>
                    <span className={styles.mainHomeLink}>Home</span> &gt; {" "}
                    <span className={styles.mainServicesLink}>Services</span>
                </div>
                <h1 className={styles.mainMainTitle}>Our Services</h1>
                <div className={styles.mainSection}>
                    <h2 className={styles.mainSectionTitle}>
                        Experience More Than Just Shopping with (Website Name)
                    </h2>
                    <p className={styles.mainSectionDescription}>
                        At <span className={styles.mainWebsiteName}>(Website Name)</span>,
                        we don't just sell products — we deliver value, convenience, and
                        end-to-end solutions tailored to meet the needs of both individual
                        consumers (B2C) and business clients (B2B). Explore our
                        comprehensive range of services designed to elevate your experience.
                    </p>
                    <p className={styles.mainLastUpdated}>
                        <strong>Last Updated: [Insert Date]</strong>
                    </p>
                </div>

                <div className={styles.mainSection}>
                    <h3 className={styles.mainSubSectionTitle}>
                        For Retail Customers (B2C)
                    </h3>
                    <ol className={styles.mainList}>
                        <li className={styles.mainListItem}>
                            <h4 className={styles.mainListItemTitle}>
                                1. Curated Product Selection
                            </h4>
                            <p className={styles.mainListItemDescription}>
                                Shop from a wide range of categories including Electronics,
                                Fashion, Home & Kitchen, Beauty, and more. Every product is
                                handpicked for quality, relevance, and price value.
                            </p>
                        </li>
                        <li className={styles.mainListItem}>
                            <h4 className={styles.mainListItemTitle}>
                                2. Easy Returns & Fast Refunds
                            </h4>
                            <p className={styles.mainListItemDescription}>
                                Enjoy hassle-free returns with our simplified pickup and refund
                                system. Most products are eligible for returns within 7 to 15
                                days of delivery.
                            </p>
                        </li>
                        <li className={styles.mainListItem}>
                            <h4 className={styles.mainListItemTitle}>
                                3. Exclusive Deals & Flash Sales
                            </h4>
                            <p className={styles.mainListItemDescription}>
                                Get access to daily flash sales, seasonal discounts, and
                                limited-time bundle offers across major categories.
                            </p>
                        </li>
                        <li className={styles.mainListItem}>
                            <h4 className={styles.mainListItemTitle}>
                                4. Secure Payments & EMI Options
                            </h4>
                            <p className={styles.mainListItemDescription}>
                                Choose from a range of secure payment methods. For high-value
                                items, we offer EMI facilities, wallet options, and
                                buy-now-pay-later (BNPL) services.
                            </p>
                        </li>
                        <li className={styles.mainListItem}>
                            <h4 className={styles.mainListItemTitle}>
                                5. Personalized Shopping
                            </h4>
                            <p className={styles.mainListItemDescription}>
                                Benefit from AI-powered product recommendations, trending items,
                                and tailored offers based on your browsing and purchase history.
                            </p>
                        </li>
                        <li className={styles.mainListItem}>
                            <h4 className={styles.mainListItemTitle}>
                                6. Loyalty & Rewards Program
                            </h4>
                            <p className={styles.mainListItemDescription}>
                                Earn reward points on every purchase and redeem them for
                                discounts or exclusive gifts. Special perks for long-term
                                customers.
                            </p>
                        </li>
                    </ol>
                </div>

                <div className={styles.mainSection}>
                    <h3 className={styles.mainSubSectionTitle}>For Businesses (B2B)</h3>
                    <ol className={styles.mainList}>
                        <li className={styles.mainListItem}>
                            <h4 className={styles.mainListItemTitle}>
                                1. Business Account Services
                            </h4>
                            <p className={styles.mainListItemDescription}>
                                Register for a Business Account to access exclusive features
                                like bulk pricing, GST invoicing, and a dedicated account
                                manager.
                            </p>
                        </li>
                        <li className={styles.mainListItem}>
                            <h4 className={styles.mainListItemTitle}>
                                2. Bulk Order & Quotation Tools
                            </h4>
                            <p className={styles.mainListItemDescription}>
                                Need large quantities? Use our Bulk Order Interface or submit a
                                Quote Request Form to get the best possible pricing on volume
                                orders.
                            </p>
                        </li>
                        <li className={styles.mainListItem}>
                            <h4 className={styles.mainListItemTitle}>
                                3. Technical Product Support
                            </h4>
                            <p className={styles.mainListItemDescription}>
                                Get detailed spec sheets, brochures, and datasheets for all
                                industrial, office, and professional products. Ideal for
                                procurement teams and institutions.
                            </p>
                        </li>
                        <li className={styles.mainListItem}>
                            <h4 className={styles.mainListItemTitle}>
                                4. Credit & Invoice Management
                            </h4>
                            <p className={styles.mainListItemDescription}>
                                We offer flexible credit terms (Net 15/30) and complete invoice
                                management dashboards for smooth B2B transactions and tracking.
                            </p>
                        </li>
                        <li className={styles.mainListItem}>
                            <h4 className={styles.mainListItemTitle}>
                                5. Consultation & Procurement Assistance
                            </h4>
                            <p className={styles.mainListItemDescription}>
                                Looking for tailored solutions? Our Solutions & Services team
                                offers business consulting for product sourcing, setup, and
                                category-specific needs.
                            </p>
                        </li>
                    </ol>
                </div>

                <div className={styles.mainSection}>
                    <h3 className={styles.mainSubSectionTitle}>B2B Partner Portal</h3>
                    <p className={styles.mainSectionDescription}>
                        Track your orders, manage returns, request support, and access
                        tax-compliant invoicing – all from your custom business dashboard.
                    </p>
                </div>

                <div className={styles.mainSection}>
                    <h3 className={styles.mainSubSectionTitle}>
                        Common Services for All Users
                    </h3>
                    <ul className={styles.mainList}>
                        <li className={styles.mainListItem}>
                            <h4 className={styles.mainListItemTitle}>
                                Advanced Search & Filters
                            </h4>
                            <p className={styles.mainListItemDescription}>
                                Use smart filters and advanced search options to find exactly
                                what you're looking for – faster.
                            </p>
                        </li>
                        <li className={styles.mainListItem}>
                            <h4 className={styles.mainListItemTitle}>
                                Order Tracking & Delivery Support
                            </h4>
                            <p className={styles.mainListItemDescription}>
                                Get real-time delivery updates via email/SMS. Our logistics
                                network ensures timely delivery across pin codes in India.
                            </p>
                        </li>
                        <li className={styles.mainListItem}>
                            <h4 className={styles.mainListItemTitle}>
                                24/7 Customer Support
                            </h4>
                            <p className={styles.mainListItemDescription}>
                                We're here to help. Reach us via live chat, email, or phone
                                during business hours. We also offer a detailed FAQ and Help
                                Center.
                            </p>
                        </li>
                    </ul>
                </div>
            </div>

            
        </>
    );
};

export default Services;