import React from 'react';
import styles from "../css/Fotter.module.css";
import image from "../images/arogyamlogo.png";

const Fotter = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContainer}>
        <div className={`${styles.footerSection} ${styles.logoSection}`}>
          <img src={image} alt="Āarogyām Rahita Logo" className={styles.footerLogo} />
        </div>

        <div className={`${styles.footerSection} ${styles.supportSection}`}>
          <h3>Support</h3>
          <p>3E-Near Divider Road,<br />Meerut, Uttar Pradesh</p>
          <p>rhythm@gmail.com</p>
          <p>+91 9012897031</p>
        </div>

        <div className={`${styles.footerSection} ${styles.linksSection}`}>
          <h3>Quick Link</h3>
          <ul>
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Terms Of Use</a></li>
            <li><a href="#">FAQ</a></li>
            <li><a href="#">Contact</a></li>
          </ul>
        </div>
      </div>

      <div className={styles.footerBottom}>
        <p>© Copyright Āarogyām Rahita 2025. All right reserved</p>
      </div>
    </footer>
  );
};

export default Fotter;
