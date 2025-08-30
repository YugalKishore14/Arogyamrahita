import { IoMenu, IoCartOutline } from "react-icons/io5";
import { LuUser } from "react-icons/lu";
import styles from './css/Faq.module.css';
import React, { useState } from "react";

const Faq = () => {
  const [openItem, setOpenItem] = useState(null);

  const toggleItem = (index) => {
    setOpenItem(openItem === index ? null : index);
  };

  const faqData = [
    {
      category: "GENERAL QUESTIONS",
      items: [
        {
          question: "1. What is (Website Name)?",
          answer:
            "(Website Name) is a trusted online platform offering a wide range of products across categories like electronics, fashion, home & kitchen, baby, groceries and office supplies. We serve both retail (B2C) and business (B2B) customers through tailored experiences.",
        },
        {
          question: "2. How do I create an account?",
          answer:
            "Click on the login/Register option at the top of the page. Fill in your details and verify your email or phone number to activate your account.",
        },
        {
          question: "3. I forgot my password. what should I do?",
          answer:
            'Click on "Forgot Password" on the login page. Enter your registered email or phone number, and follow the instructions to reset your password.',
        },
      ],
    },
    {
      category: "ORDERING & PAYMENT",
      items: [
        {
          question: "4. How do I place an order?",
          answer:
            "Simply browse products, add them to your cart, and proceed to checkout. Select your delivery address and payment method to complete the order.",
        },
        {
          question: "5. What payment methods do you accept?",
          answer: (
            <>
              <p>We accept:</p>
              <ul>
                <li>Credit/Debit Cards (Visa, MasterCard, RuPay)</li>
                <li>Net Banking</li>
                <li>UPI (GooglePay, PhonePe, etc.)</li>
                <li>Wallets (Paytm, PhonePe, etc.)</li>
                <li>Cash on Delivery (COD) on select items</li>
              </ul>
            </>
          ),
        },
        {
          question: "6. Is it safe to shop online on (Website Name)?",
          answer:
            "Yes. We use secure encryption and trusted payment gateways to protect your personal and financial information.",
        },
      ],
    },
    {
      category: "SHIPPING & DELIVERY",
      items: [
        {
          question: "7. Do you offer free shipping?",
          answer:
            "Yes, free shipping is available on orders above a certain amount (varies by category). Shipping fees are calculated at checkout for smaller orders.",
        },
        {
          question: "8. How long does delivery take?",
          answer:
            "Standard delivery takes 3-7 business days depending on your location and product category. Some high-value or bulk items may take longer.",
        },
        {
          question: "9. Can I track my order?",
          answer:
            "Absolutely. Once your order is shipped, a tracking link will be shared via SMS/email and will also be available in My Account > Orders.",
        },
      ],
    },
    {
      category: "RETURNS & REFUNDS",
      items: [
        {
          question: "10. What is your return policy?",
          answer:
            "Returns are accepted within 7-15 days of delivery depending on the item. The product must be unused, in its original packaging, and meet the return criteria.",
        },
        {
          question: "11. How do I initiate a return?",
          answer:
            'Log in to your account, go to Order History, and select "Return Item." Follow the steps and our team will guide you through the pickup or drop-off process.',
        },
        {
          question: "12. How long does it take to get a refund?",
          answer:
            "Once the returned item is received and inspected, refunds are processed within 5-7 working days to the original payment method or via bank transfer, depending on the payment mode.",
        },
      ],
    },
    {
      category: "B2B CUSTOMERS (Business Accounts)",
      items: [
        {
          question: "13. How can I create a business account?",
          answer:
            "Visit the B2B Portal and click on Register as Business. Provide your business PAN, GSTIN, and company details to get started.",
        },
        {
          question:
            "14. Do you offer bulk pricing or discounts for business orders?",
          answer:
            "Yes. We provide tiered pricing and volume-based discounts. You can request a custom quote from the product page or contact our sales team.",
        },
        {
          question: "15. What are your payment terms for business customers?",
          answer:
            "We offer multiple credit terms (Net 15, Net 30) based on your credit evaluation. Invoice management and payment history can be tracked through your business dashboard.",
        },
      ],
    },
    {
      category: "PRODUCTS & CATEGORIES",
      items: [
        {
          question: "16. Are all products listed original and under warranty?",
          answer:
            "Yes. All products sold on (Website Name) are 100% original and come with manufacturer warranties where applicable.",
        },
        {
          question: "17. How do I know if a product is in stock?",
          answer:
            'Product availability is shown on each product page. If it\'s Out of Stock, you can choose "Notify Me" to get alerts when it becomes available.',
        },
      ],
    },
    {
      category: "TECHNICAL & SUPPORT",
      items: [
        {
          question: "18. How do I contact customer support?",
          answer: (
            <>
              <p>You can reach us via:</p>
              <ul>
                <li>Email: support@(websitename).com</li>
                <li>Phone: +91-XXXXXXXXXX</li>
                <li>Our support team is available Mon-Sat, 10 AM to 6 PM</li>
              </ul>
            </>
          ),
        },
        {
          question: "19. Can I cancel or modify my order after placing it?",
          answer:
            "Orders can be cancelled before shipment. Once shipped, cancellation isn't possible—but you can return the item after delivery according to our return policy.",
        },
      ],
    },
  ];

  return (
    <>
      <div className={styles.faqContainer}>
        <header className={styles.headerr}>
          <p>Home &gt; Frequently Asked Questions (FAQ)</p>
        </header>

        <main className={styles.mainContent}>
          <h1 className={styles.mainTitle}>
            Frequently Asked Questions (FAQ)
          </h1>
          <p className={styles.introText}>
            Welcome to the Help Center of (Website Name). Below you'll find
            answers to the most commonly asked questions from our customers
            related to our services and business.
          </p>

          {faqData.map((category, categoryIndex) => (
            <section key={categoryIndex} className={styles.faqSection}>
              <h2 className={styles.sectionTitle}>{category.category}</h2>
              {category.items.map((item, itemIndex) => {
                const uniqueIndex = `${categoryIndex}-${itemIndex}`;
                const isOpen = openItem === uniqueIndex;
                return (
                  <div
                    key={itemIndex}
                    className={`${styles.faqItem} ${isOpen ? styles.active : ""}`}
                  >
                    <button
                      className={styles.faqQuestion}
                      onClick={() => toggleItem(uniqueIndex)}
                      aria-expanded={isOpen}
                      aria-controls={`faq-answer-${uniqueIndex}`}
                    >
                      <span>{item.question}</span>
                      <span className={styles.dropdownIcon}>▾</span>
                    </button>
                    <div
                      id={`faq-answer-${uniqueIndex}`}
                      className={styles.faqAnswer}
                      style={{
                        maxHeight: isOpen ? "500px" : "0",
                        padding: isOpen ? "15px" : "0 15px",
                      }}
                    >
                      <div className={styles.faqAnswerContent}>
                        {typeof item.answer === "string" ? (
                          <p>{item.answer}</p>
                        ) : (
                          item.answer
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </section>
          ))}
        </main>
      </div>

    </>
  );
};

export default Faq;

