import React, { useState } from "react";
import "./Auth.css";
import axios from "axios";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");

  const handleForgot = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8000/api/auth/forgot-password", { email });
      toast.success(res.data.message);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed");
    }
  };

  return (
    <div className="auth-wrapper">
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="auth-card"
      >
        <h2 className="auth-title">🔁 Forgot Password</h2>
        <p className="auth-subtitle">We will send reset instructions to your email</p>

        <form onSubmit={handleForgot}>
          <div className="input-box">
            <label>Email</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>

          <button className="auth-btn">Send Reset Link</button>
        </form>

        <div className="auth-links">
          Back to <Link to="/login">Login</Link>
        </div>
      </motion.div>
    </div>
  );
}
