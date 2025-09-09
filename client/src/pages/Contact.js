import { motion } from "framer-motion";
import styles from "./css/Contact.module.css";
import Header from "../components/Header";

export default function Contact() {
  return (
    <>
      <div className={styles.page}>
        {/* Contact Form Card */}
        <motion.div
          className={styles.card}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <h2 className={styles.heading}>🚀 READY TO WORK WITH US</h2>
          <p className={styles.subheading}>
            Contact us for all your questions and opinions
          </p>

          <form className={styles.form}>
            <div className={styles.row}>
              <div className={styles.field}>
                <label>
                  First Name <span className={styles.required}>*</span>
                </label>
                <input type="text" placeholder="First Name" />
              </div>
              <div className={styles.field}>
                <label>
                  Last Name <span className={styles.required}>*</span>
                </label>
                <input type="text" placeholder="Last Name" />
              </div>
            </div>

            <div className={styles.field}>
              <label>
                Email Address <span className={styles.required}>*</span>
              </label>
              <input type="email" placeholder="Email Address" />
            </div>

            <div className={styles.field}>
              <label>Phone Number (Optional)</label>
              <input type="text" placeholder="Phone Number" />
            </div>

            <div className={styles.field}>
              <label>
                Country / Region <span className={styles.required}>*</span>
              </label>
              <select>
                <option>United States (US)</option>
                <option>India</option>
                <option>UK</option>
              </select>
            </div>

            <div className={styles.field}>
              <label>Subject (Optional)</label>
              <input type="text" placeholder="Subject" />
            </div>

            <div className={styles.field}>
              <label>Message</label>
              <textarea placeholder="Write your message here..."></textarea>
            </div>

            <div className={styles.checkboxRow}>
              <input type="checkbox" id="updates" />
              <label htmlFor="updates">
                I want to receive news and updates. By submitting, I agree to
                the <a href="#">Terms & Conditions</a>.
              </label>
            </div>

            <motion.button
              type="submit"
              className={styles.button}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              SEND MESSAGE
            </motion.button>
          </form>
        </motion.div>

        {/* Map Card */}
        <motion.div
          className={styles.card}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        >
          <h2 className={styles.heading}>📍 FIND US ON GOOGLE MAP</h2>
          <div className={styles.mapWrapper}>
            <iframe
              title="map"
              src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3488.323342087102!2d77.66556017551575!3d29.037016075446274!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMjnCsDAyJzEzLjMiTiA3N8KwNDAnMDUuMyJF!5e0!3m2!1sen!2sin!4v1757412801036!5m2!1sen!2sin"
              width="100%"
              height="300"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
            ></iframe>
          </div>
        </motion.div>
      </div>
    </>
  );
}
