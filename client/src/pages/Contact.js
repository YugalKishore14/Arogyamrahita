import styles from "./css/Contact.module.css";
import Header from "../components/Header";

export default function Contact() {
  return (<>
    <Header />
    <div className={styles.page}>
      {/* Contact Form Section */}
      <div className={styles.card}>
        <h2 className={styles.heading}>READY TO WORK WITH US</h2>
        <p className={styles.subheading}>
          Contact us for all your questions and opinions
        </p>

        <form className={styles.form}>
          <div className={styles.row}>
            <div className={styles.field}>
              <label>First Name <span className={styles.required}>*</span></label>
              <input type="text" placeholder="First Name" />
            </div>
            <div className={styles.field}>
              <label>Last Name <span className={styles.required}>*</span></label>
              <input type="text" placeholder="Last Name" />
            </div>
          </div>

          <div className={styles.field}>
            <label>Email Address <span className={styles.required}>*</span></label>
            <input type="email" placeholder="Email Address" />
          </div>

          <div className={styles.field}>
            <label>Phone Number (Optional)</label>
            <input type="text" placeholder="Phone Number" />
          </div>

          <div className={styles.field}>
            <label>Country / Region <span className={styles.required}>*</span></label>
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
            <textarea placeholder="Note about your order, e.g. special note for delivery"></textarea>
          </div>

          <div className={styles.checkboxRow}>
            <input type="checkbox" id="updates" />
            <label htmlFor="updates">
              I want to receive news and updates once in a while. By submitting, I'm agreed to the{" "}
              <a href="#">Terms & Conditions</a>.
            </label>
          </div>

          <button type="submit" className={styles.button}>
            SEND MESSAGE
          </button>
        </form>
      </div>

      {/* Map Section */}
      <div className={styles.card}>
        <h2 className={styles.heading}>FIND US ON GOOGLE MAP</h2>
        <div className={styles.mapWrapper}>
          <iframe
            title="map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2880.515503568654!2d10.497936615497486!3d43.84251387911539!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12d58500bcae5d5b%3A0x62f04730a73b55b!2sChiesa%20di%20San%20Francesco!5e0!3m2!1sen!2sit!4v1683123123456!5m2!1sen!2sit"
            width="100%"
            height="300"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </div>
      </div>
    </div>
  </>
  );
}
