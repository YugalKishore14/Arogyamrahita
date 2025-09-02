import styles from "./css/OrderCompleted.module.css";


export default function OrderCompleted() {
  return (
    <div className={styles.container}>
      <div className={styles.iconWrapper}>
        <div className={styles.circle}>
          <span className={styles.check}>✓</span>
        </div>
      </div>
      <h1 className={styles.title}>Your Order Is Completed!</h1>
      <p className={styles.message}>
        Thank you for your order! Your order is being processed and will be
        completed within <strong>3–6 hours</strong>. You will receive an email
        confirmation when your order is completed.
      </p>
      <button className={styles.button}>Continue Shopping</button>
    </div>
  );
}

