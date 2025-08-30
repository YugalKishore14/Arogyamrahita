import React, { useState, useEffect } from "react";
import styles from "../css/Auth.module.css";

export default function App() {
    const [section, setSection] = useState("signup");
    const [user, setUser] = useState({});
    const [otp, setOtp] = useState("");
    const [timer, setTimer] = useState(300);
    const [verified, setVerified] = useState(false);
    const [msg, setMsg] = useState({ text: "", type: "" });

    useEffect(() => {
        if (section === "otp" && timer > 0) {
            const id = setInterval(() => setTimer((t) => t - 1), 1000);
            return () => clearInterval(id);
        }
    }, [section, timer]);

    const showMsg = (text, type) => {
        setMsg({ text, type });
        setTimeout(() => setMsg({ text: "", type: "" }), 3000);
    };

    const formatTime = (s) =>
        `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(
            2,
            "0"
        )}`;

    const handleSignup = (e) => {
        e.preventDefault();
        const { username, email, mobile, password } = e.target;
        if (!username.value || !email.value || !mobile.value || !password.value)
            return showMsg("Fill all fields", "error");

        setUser({
            username: username.value,
            email: email.value,
            mobile: mobile.value,
            password: password.value,
        });

        const newOtp = String(Math.floor(100000 + Math.random() * 900000));
        setOtp(newOtp);
        console.log("OTP:", newOtp);
        showMsg("OTP sent (check console)", "info");

        setTimer(300);
        setSection("otp");
    };

    const handleOtp = (e) => {
        e.preventDefault();
        if (e.target.otp.value === otp && timer > 0) {
            setVerified(true);
            showMsg("Verified!", "success");
            setSection("login");
        } else showMsg(timer <= 0 ? "OTP expired" : "Invalid OTP", "error");
    };

    const handleResend = () => {
        const newOtp = String(Math.floor(100000 + Math.random() * 900000));
        setOtp(newOtp);
        console.log("Resend OTP:", newOtp);
        setTimer(300);
        showMsg("New OTP sent!", "info");
    };

    const handleLogin = (e) => {
        e.preventDefault();
        const { identifier, password } = e.target;
        if (
            verified &&
            (identifier.value === user.email || identifier.value === user.username) &&
            password.value === user.password
        ) {
            setSection("success");
            showMsg("Login successful", "success");
        } else showMsg("Invalid credentials", "error");
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                {msg.text && (
                    <div
                        className={`${styles.message} ${msg.type === "success"
                            ? styles.success
                            : msg.type === "error"
                                ? styles.error
                                : styles.info
                            }`}
                    >
                        {msg.text}
                    </div>
                )}

                {section === "signup" && (
                    <form onSubmit={handleSignup} className={styles.form}>
                        <input name="username" placeholder="Username" className={styles.input} />
                        <input name="email" type="email" placeholder="Email" className={styles.input} />
                        <input name="mobile" placeholder="Mobile" className={styles.input} />
                        <input name="password" type="password" placeholder="Password" className={styles.input} />
                        <button className={styles.btn}>Sign Up</button>
                        <p className={styles.text}>
                            Already have account?{" "}
                            <button
                                type="button"
                                onClick={() => setSection("login")}
                                className={styles.link}
                            >
                                Login
                            </button>
                        </p>
                    </form>
                )}

                {section === "otp" && (
                    <form onSubmit={handleOtp} className={styles.form}>
                        <input name="otp" placeholder="Enter OTP" className={`${styles.input} ${styles.center}`} />
                        <p className={styles.timer}>{formatTime(timer)}</p>
                        <button className={`${styles.btn} ${styles.green}`}>Verify OTP</button>
                        <button
                            type="button"
                            onClick={handleResend}
                            disabled={timer > 0}
                            className={`${styles.btn} ${styles.resend}`}
                        >
                            Resend OTP
                        </button>
                    </form>
                )}

                {section === "login" && (
                    <form onSubmit={handleLogin} className={styles.form}>
                        <input
                            name="identifier"
                            placeholder="Email or Username"
                            className={styles.input}
                        />
                        <input
                            name="password"
                            type="password"
                            placeholder="Password"
                            className={styles.input}
                        />
                        <button className={styles.btn}>Login</button>
                        <p className={styles.text}>
                            Don’t have an account?{" "}
                            <button
                                type="button"
                                onClick={() => setSection("signup")}
                                className={styles.link}
                            >
                                Sign Up
                            </button>
                        </p>
                    </form>
                )}

                {section === "success" && (
                    <div className={styles.successBox}>
                        <h2 className={styles.successTitle}>Success!</h2>
                        <p>{verified ? "Account Verified 🎉" : "Logged In 🎉"}</p>
                    </div>
                )}
            </div>
        </div>
    );
}

