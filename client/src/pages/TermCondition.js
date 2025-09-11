import { IoMenu, IoCartOutline } from "react-icons/io5";
import { LuUser } from "react-icons/lu";
import styles from "./css/TermCondition.module.css";

const TermCondition = () => {
    return (
        <>
            <div className={styles.pageContainer}>
                <div className={styles.contentWrapper}>
                    <div className={styles.breadcrumb}>
                        <span className={styles.breadcrumbLink}>Home</span> &gt; Terms &
                        Conditions
                    </div>

                    <h1 className={styles.mainTitle}>Terms & Conditions</h1>

                    <p className={styles.introParagraph}>
                        Welcome to the official e-commerce platforms of (Website Name).
                        These Terms and Conditions ("Terms") govern your access to and use
                        of our websites, mobile applications, and services. By visiting,
                        browsing, or purchasing from our websites, you agree to these Terms
                        and our Privacy Policy. These Terms apply separately to (Website
                        Name) for B2C and B2B purposes, depending on your usage and purchase
                        intent.
                    </p>

                    <p className={styles.lastUpdated}>Last Updated: (Insert Date)</p>

                    <div className={styles.sectionsContainer}>
                        <div className={styles.section}>
                            <h2 className={styles.sectionTitle}>
                                1. General Conditions of Use
                            </h2>
                            <ul className={styles.sectionList}>
                                <li>
                                    1.1 You must be at least 18 years old or have
                                    parental/guardian consent to use or purchase from our
                                    platform.
                                </li>
                                <li>
                                    1.2 All content and features across the homepage, product
                                    pages, and account pages are the property of (Website Name)
                                    and may not be reproduced without express written consent.
                                </li>
                                <li>
                                    1.3 We reserve the right to refuse service, terminate
                                    accounts, or cancel orders at our sole discretion.
                                </li>
                            </ul>
                        </div>

                        <div className={styles.section}>
                            <h2 className={styles.sectionTitle}>
                                2. Account Registration & Security
                            </h2>
                            <ul className={styles.sectionList}>
                                <li>
                                    2.1 To access certain features such as Wishlist, Order
                                    history, or Bulk Order Management, you must register for an
                                    account.
                                </li>
                                <li>
                                    2.2 You are responsible for all activities that occur under
                                    your account information and password.
                                </li>
                                <li>
                                    2.3 Users are liable for all activities that occur under their
                                    Account.
                                </li>
                            </ul>
                        </div>

                        <div className={styles.section}>
                            <h2 className={styles.sectionTitle}>
                                3. Product Information & Availability
                            </h2>
                            <ul className={styles.sectionList}>
                                <li>
                                    3.1 We make every effort to display accurately as possible the
                                    colors, specifications, and features of our products on the
                                    PDP (Product Detail Pages). However, we cannot guarantee that
                                    your device's display of any color will be accurate due to
                                    variations in monitors.
                                </li>
                                <li>
                                    3.2 Products shown on our platforms are subject to
                                    availability. We reserve the right to limit quantities or
                                    discontinue products at any time.
                                </li>
                            </ul>
                        </div>

                        <div className={styles.section}>
                            <h2 className={styles.sectionTitle}>
                                4. Pricing & Payment Terms (B2C)
                            </h2>
                            <ul className={styles.sectionList}>
                                <li>
                                    4.1 Prices are listed in Indian Rupees (INR) and may vary
                                    depending on ticket size:
                                    <ul className={styles.subList}>
                                        <li>₹1,000 - ₹4,999: Fashion, beauty, kitchen items</li>
                                        <li>
                                            ₹5,000 - ₹9,999: Electronics, home appliances, gadgets
                                        </li>
                                        <li>
                                            ₹10,000 - ₹24,999: Furniture, large appliances, luxury
                                            goods
                                        </li>
                                        <li>
                                            ₹25,000 and above: Premium electronics, high-end fashion,
                                            jewelry
                                        </li>
                                    </ul>
                                </li>
                                <li>
                                    4.2 (Website Name) offers flash sales, bundle deals, and
                                    digital coupon codes through the Deals & Offers page.
                                </li>
                                <li>
                                    4.3 We reserve the right to correct any pricing errors and
                                    cancel improperly priced orders.
                                </li>
                                <li>
                                    4.4 We reserve the right to correct any pricing errors and
                                    cancel improperly priced orders.
                                </li>
                            </ul>
                        </div>

                        <div className={styles.section}>
                            <h2 className={styles.sectionTitle}>
                                5. Order Placement & Payments
                            </h2>
                            <ul className={styles.sectionList}>
                                <li>
                                    5.1 Users may complete purchases as a guest or registered
                                    user.
                                </li>
                                <li>
                                    5.2 Payment methods include:
                                    <ul className={styles.subList}>
                                        <li>Credit/Debit Cards</li>
                                        <li>Net Banking</li>
                                        <li>UPI</li>
                                        <li>EMI (available on select products)</li>
                                        <li>
                                            Cash on Delivery (COD) and Prepaid Payments (for B2B
                                            orders)
                                        </li>
                                    </ul>
                                </li>
                                <li>
                                    5.3 Upon order confirmation, you will receive an invoice and
                                    summary. This includes all applicable charges such as taxes,
                                    shipping, and discounts.
                                </li>
                            </ul>
                        </div>

                        <div className={styles.section}>
                            <h2 className={styles.sectionTitle}>6. Shipping & Delivery</h2>
                            <ul className={styles.sectionList}>
                                <li>
                                    6.1 Standard and expedited delivery options are available
                                    across India.
                                </li>
                                <li>
                                    6.2 Estimated delivery times are provided during checkout and
                                    vary by location and stock availability.
                                </li>
                                <li>
                                    6.3 For bulk or business orders, special logistics may be
                                    arranged upon consultation.
                                </li>
                                <li>
                                    6.4 (Website Name) is not responsible for delays beyond our
                                    control (e.g., couriers, etc.) are not our responsibility.
                                </li>
                            </ul>
                        </div>

                        <div className={styles.section}>
                            <h2 className={styles.sectionTitle}>
                                7. Returns, Refunds & Cancellations
                            </h2>
                            <ul className={styles.sectionList}>
                                <li>
                                    7.1 Returns are accepted based on product-specific and
                                    displayed on each PDP.
                                </li>
                                <li>
                                    7.2 Products must be returned in original condition with
                                    packaging and tags.
                                </li>
                                <li>
                                    7.3 Certain products, including perishable items or
                                    personalized goods, might are non-returnable.
                                </li>
                                <li>
                                    7.4 For B2B orders, bulk cancellation and refund eligibility
                                    is subject to signed agreements or quotes.
                                </li>
                            </ul>
                        </div>

                        <div className={styles.section}>
                            <h2 className={styles.sectionTitle}>
                                8. Warranties & Disclaimers
                            </h2>
                            <ul className={styles.sectionList}>
                                <li>
                                    8.1 Manufacturer warranties apply to most electronics and
                                    high-ticket items.
                                </li>
                                <li>
                                    8.2 (Website Name) is not liable for damages or injuries
                                    resulting from use of our products.
                                </li>
                                <li>
                                    8.3 While we strive to keep all content accurate and updated,
                                    we do not guarantee that all information (e.g., product specs,
                                    availability) is error-free.
                                </li>
                            </ul>
                        </div>

                        <div className={styles.section}>
                            <h2 className={styles.sectionTitle}>
                                9. User Generated Content & Reviews
                            </h2>
                            <ul className={styles.sectionList}>
                                <li>
                                    9.1 Registered users can leave product reviews and feedback on
                                    PDPs.
                                </li>
                                <li>
                                    9.2 We reserve the right to moderate or remove any content at
                                    our discretion.
                                </li>
                                <li>
                                    9.3 We reserve the right to moderate or remove any content at
                                    our discretion.
                                </li>
                            </ul>
                        </div>

                        <div className={styles.section}>
                            <h2 className={styles.sectionTitle}>10. Intellectual Property</h2>
                            <ul className={styles.sectionList}>
                                <li>
                                    10.1 All site content (e.g., graphics, logos, UI components,
                                    design systems, etc.) is the intellectual property of (Website
                                    Name) or their respective licensors.
                                </li>
                                <li>
                                    10.2 You may not reproduce, distribute, or use any content
                                    without permission.
                                </li>
                            </ul>
                        </div>

                        <div className={styles.section}>
                            <h2 className={styles.sectionTitle}>
                                11. Business Account & Order Process (B2B Only)
                            </h2>
                            <ul className={styles.sectionList}>
                                <li>
                                    11.1 Businesses can create accounts with a valid TIN or trade
                                    license for registration.
                                </li>
                                <li>
                                    11.2 Businesses may require credit checks and approval for
                                    certain payment methods, like payment or credit approvals.
                                </li>
                                <li>
                                    11.3 Businesses can request downloadable product catalogs,
                                    tiered pricing, and request customized quotes.
                                </li>
                            </ul>
                        </div>

                        <div className={styles.section}>
                            <h2 className={styles.sectionTitle}>
                                12. Communications & Notifications
                            </h2>
                            <ul className={styles.sectionList}>
                                <li>
                                    12.1 Users agree to receive informative transactional emails
                                    and promotional offers.
                                </li>
                                <li>
                                    12.2 You may unsubscribe from promotional communications via
                                    the newsletter footer or account settings.
                                </li>
                                <li>
                                    12.3 We may send push notifications for order updates and
                                    important announcements (e.g., new features).
                                </li>
                            </ul>
                        </div>

                        <div className={styles.section}>
                            <h2 className={styles.sectionTitle}>
                                13. Mobile Experience & Performance
                            </h2>
                            <ul className={styles.sectionList}>
                                <li>
                                    13.1 Our mobile app is fully compatible with custom UI for
                                    navigation, filters, and checkout flows.
                                </li>
                                <li>
                                    13.2 Some advanced features like EMI calculators or image zoom
                                    on product galleries may differ slightly between desktop and
                                    mobile views.
                                </li>
                            </ul>
                        </div>

                        <div className={styles.section}>
                            <h2 className={styles.sectionTitle}>
                                14. Legal Compliance & Governing Law
                            </h2>
                            <ul className={styles.sectionList}>
                                <li>
                                    14.1 These Terms and Conditions shall be interpreted in
                                    accordance with the laws of India.
                                </li>
                                <li>
                                    14.2 Disputes are subject to the exclusive jurisdiction of the
                                    courts located in [Your City], India.
                                </li>
                                <li>
                                    14.3 We comply with all applicable laws, including consumer
                                    protection, data privacy, and B2B trade regulations.
                                </li>
                            </ul>
                        </div>

                        <div className={styles.section}>
                            <h2 className={styles.sectionTitle}>
                                15. Limitation of Liability
                            </h2>
                            <ul className={styles.sectionList}>
                                <li>
                                    15.1 (Website Name) is not liable for indirect, incidental, or
                                    damages arising from the use of the platform.
                                </li>
                                <li>
                                    15.2 Our maximum liability for any claim related to a product
                                    or service will not exceed the purchase price of that product.
                                </li>
                            </ul>
                        </div>

                        <div className={styles.section}>
                            <h2 className={styles.sectionTitle}>
                                16. Modifications to Terms
                            </h2>
                            <ul className={styles.sectionList}>
                                <li>
                                    16.1 We reserve the right to update or modify these Terms at
                                    any time.
                                </li>
                                <li>
                                    16.2 Continued use of our services after changes constitutes
                                    your acceptance of the revised Terms.
                                </li>
                                <li>
                                    16.3 Users will be notified of any significant changes via the
                                    homepage.
                                </li>
                            </ul>
                        </div>

                        <div className={styles.section}>
                            <h2 className={styles.sectionTitle}>17. Contact Information</h2>
                            <p className={styles.contactParagraph}>
                                For any questions, concerns, or clarification regarding these
                                Terms:
                            </p>
                            <ul className={styles.sectionList}>
                                <li>(Website Name) – B2C Support</li>
                                <li>Email: support@(website).com</li>
                                <li>Phone: +91-XXXXXXXXXX</li>
                                <li>(Website Name) – B2B Queries</li>
                                <li>Email: sales@(website).com</li>
                                <li>Phone: +91-XXXXXXXXXX</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>


        </>
    );
};





export default TermCondition
