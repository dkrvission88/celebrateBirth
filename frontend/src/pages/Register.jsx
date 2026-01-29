import React, { useState } from "react";
import "./Auth.css";
import axios from "axios";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "",
    dob:"",
    doj:"",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8000/api/auth/register", form);
      toast.success(res.data.message);
      navigate("/login");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Register failed");
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
        <h2 className="auth-title">✨ Employee Register</h2>
        <p className="auth-subtitle">Create a new employee account</p>

        <form onSubmit={handleRegister}>
          <div className="row-flex">
          <div className="input-box" style={{ flex: 1 }}>
            <label>Full Name</label>
            <input name="name" value={form.name} onChange={handleChange} required />
          </div>

          <div className="input-box" style={{ flex: 1 }}>
            <label>Email</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} required />
          </div>
          </div>

          <div className="row-flex">
            <div className="input-box" style={{ flex: 1 }}>
              <label>Phone</label>
              <input name="phone" value={form.phone} onChange={handleChange} required />
            </div>
            <div className="input-box" style={{ flex: 1 }}>
              <label>Role</label>
              <input name="role" value={form.role} onChange={handleChange} required />
            </div>
          </div>
<div className="row-flex">
            <div className="input-box" style={{ flex: 1 }}>
              <label>Date of birth</label>
              <input type="date" name="dob" value={form.dob} onChange={handleChange} required />
            </div>
             <div className="input-box" style={{ flex: 1 }}>
              <label>Date of joining</label>
              <input type="date" name="doj" value={form.doj} onChange={handleChange} required />
            </div>
            </div>
          <div className="input-box">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>
          

          <button className="auth-btn">Register</button>
        </form>

        <div className="auth-links">
          Already have account? <Link to="/login">Login</Link>
        </div>
      </motion.div>
    </div>
  );
}
