import React from 'react';
import styles from './css/Pleasewait.module.css';
const Pleasewait = () => {
  return (
      <div className={styles.loadingContainer}>
      <div className={styles.text}>Please Wait <span className={styles.dots}>...</span></div>
      <div className={styles.spinner}></div>
    </div>
  );
};

export default Pleasewait;
