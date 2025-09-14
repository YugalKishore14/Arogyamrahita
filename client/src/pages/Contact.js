import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import styles from "./css/Contact.module.css";
import { Link } from "react-router-dom";
import emailjs from "@emailjs/browser";


export default function Contact() {
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: user?.email || "",
    phone: "",
    country: "",
    subject: "",
    message: "",
    agree: false,
  });

  useEffect(() => {
    setFormData((prev) => ({ ...prev, email: user?.email || "" }));
  }, [user]);

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validate = () => {
    let newErrors = {};

    if (!formData.first_name.trim()) newErrors.first_name = "First name required";
    if (!formData.last_name.trim()) newErrors.last_name = "Last name required";
    if (!formData.email.trim()) newErrors.email = "Email required";
    if (!formData.country.trim()) newErrors.country = "Country required";
    if (!formData.message.trim()) newErrors.message = "Message required";
    if (!formData.agree) newErrors.agree = "You must accept Terms & Conditions";

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    const templateParams = {
      first_name: formData.first_name,
      last_name: formData.last_name,
      email: formData.email,
      phone: formData.phone,
      country: formData.country,
      subject: formData.subject,
      message: formData.message,
    };

    emailjs.send(
      process.env.REACT_APP_EMAILJS_SERVICE_ID,
      process.env.REACT_APP_EMAILJS_TEMPLATE_ID,
      templateParams,
      process.env.REACT_APP_EMAILJS_PUBLIC_KEY
    )
      .then(
        (res) => {
          alert("✅ Message sent successfully!");
          setFormData({
            first_name: "",
            last_name: "",
            email: user?.email || "",
            phone: "",
            country: "",
            subject: "",
            message: "",
            agree: false,
          });
        },
        (err) => {
          alert("❌ Failed to send. Please try again.");
          console.error(err);
        }
      )
      .finally(() => setLoading(false));
  };

  return (
    <div className={styles.page}>
      <motion.div
        className={styles.card}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <h2 className={styles.heading}>READY TO WORK WITH US</h2>
        <p className={styles.subheading}>
          Contact us for all your questions and opinions
        </p>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.row}>
            <div className={styles.field}>
              <label>First Name *</label>
              <input
                type="text"
                name="first_name"
                placeholder="First Name"
                value={formData.first_name}
                onChange={handleChange}
              />
              {errors.first_name && <span className={styles.error}>{errors.first_name}</span>}
            </div>

            <div className={styles.field}>
              <label>Last Name *</label>
              <input
                type="text"
                name="last_name"
                placeholder="Last Name"
                value={formData.last_name}
                onChange={handleChange}
              />
              {errors.last_name && <span className={styles.error}>{errors.last_name}</span>}
            </div>
          </div>

          <div className={styles.field}>
            <label>Email Address *</label>
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              readOnly
            />
            {errors.email && <span className={styles.error}>{errors.email}</span>}
          </div>

          <div className={styles.field}>
            <label>Phone Number (Optional)</label>
            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          <div className={styles.field}>
            <label>Country / Region *</label>
            <select
              name="country"
              value={formData.country}
              onChange={handleChange}
            >
              <option value="">-- Select Country --</option>
              <option>United States (US)</option>
              <option>India</option>
              <option>UK</option>
            </select>
            {errors.country && <span className={styles.error}>{errors.country}</span>}
          </div>

          <div className={styles.field}>
            <label>Subject (Optional)</label>
            <input
              type="text"
              name="subject"
              placeholder="Subject"
              value={formData.subject}
              onChange={handleChange}
            />
          </div>

          <div className={styles.field}>
            <label>Message *</label>
            <textarea
              name="message"
              placeholder="Write your message here..."
              value={formData.message}
              onChange={handleChange}
            ></textarea>
            {errors.message && <span className={styles.error}>{errors.message}</span>}
          </div>

          <div className={styles.checkboxRow}>
            <input
              type="checkbox"
              id="updates"
              name="agree"
              checked={formData.agree}
              onChange={handleChange}
            />
            <label htmlFor="updates">
              I agree to the <Link to="/termCondition">Terms & Conditions</Link>.
            </label>
          </div>
          {errors.agree && <span className={styles.error}>{errors.agree}</span>}

          <motion.button
            type="submit"
            className={styles.button}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={loading}
          >
            {loading ? "Sending..." : "SEND MESSAGE"}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
