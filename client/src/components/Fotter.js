import React from "react";
import { motion } from "framer-motion";
import styles from "../css/Fotter.module.css";
import image from "../images/arogyamlogo.png";
import { Link } from "react-router-dom";

const Fotter = () => {
  return (
    <footer className={styles.footer}>
      <motion.div
        className={styles.footerContainer}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        {/* Logo Section */}
        <motion.div
          className={`${styles.footerSection} ${styles.logoSection}`}
          whileHover={{ scale: 1.05 }}
        >
          <img
            src={image}
            alt="Āarogyām Rahita Logo"
            className={styles.footerLogo}
          />
        </motion.div>

        {/* Support Section */}
        <motion.div
          className={`${styles.footerSection} ${styles.supportSection}`}
          whileHover={{ x: 5 }}
        >
          <h3>Support</h3>
          <p>
            C-3 Sainik Vihar Near Divider Road,
            <br />
            Meerut 250001 Uttar Pradesh
          </p>
          <p>
            <a href="mailto:rahitaarogyam@gmail.com">rahitaarogyam@gmail.com</a>
          </p>

          <p>
            <a href="tel:+918979444801">+91 89794 44801</a>
          </p>
        </motion.div>

        {/* Quick Links Section */}
        <motion.div
          className={`${styles.footerSection} ${styles.linksSection}`}
          whileHover={{ x: 5 }}
        >
          <h3>Quick Link</h3>
          <ul>
            <li>
              <Link to="/privacy">Privacy Policy</Link>
            </li>
            <li>
              <Link to="/termCondition">Terms Of Use</Link>
            </li>
            <li>
              <Link to="/faq">FAQ</Link>
            </li>
            <li>
              <Link to="/contact">Contact</Link>
            </li>
            <li>
              <Link to="/returnRefund">Return & Refund</Link>
            </li>
          </ul>
        </motion.div>
      </motion.div>

      {/* Bottom */}
      <motion.div
        className={styles.footerBottom}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.3 }}
      >
        <p>© Copyright Āarogyām Rahita 2025. All right reserved</p>
      </motion.div>
    </footer>
  );
};

export default Fotter;
