import React from 'react';
import styles from './css/Pagenotfound.module.css';
import { useNavigate } from 'react-router-dom';
const Pagenotfound = () => {
const navigate = useNavigate();
  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>404 Not Found</h1>
      <p className={styles.message}>Your visited page not found. You may go home page.</p>
       <button type="submit" onClick={()=>navigate('/')} className={styles.createBtn}>Back to home page</button>
    </div>
  );
};

export default Pagenotfound;

