import React, { useEffect, useState } from "react";
import "./Auth.css";
import axios from "axios";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function UpdateProfile() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const employeeData = JSON.parse(localStorage.getItem("employee"));

  const [form, setForm] = useState({
    name: "",
    phone: "",
    role: "",
  });

  useEffect(() => {
    if (!token) {
      toast.error("Login required");
      navigate("/login");
      return;
    }

    setForm({
      name: employeeData?.name || "",
      phone: employeeData?.phone || "",
      role: employeeData?.role || "",
    });
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put("http://localhost:8000/api/auth/update", form, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success(res.data.message);
      localStorage.setItem("employee", JSON.stringify(res.data.employee));
    } catch (err) {
      toast.error(err?.response?.data?.message || "Update failed");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    toast.success("Logged out");
    navigate("/login");
  };

  return (
    <div className="auth-wrapper">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="auth-card"
      >
        <h2 className="auth-title">🛠️ Update Profile</h2>
        <p className="auth-subtitle">Update your employee details</p>

        <form onSubmit={handleUpdate}>
          <div className="input-box">
            <label>Name</label>
            <input name="name" value={form.name} onChange={handleChange} required />
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

          <button className="auth-btn">Update</button>
        </form>

        <button
          onClick={handleLogout}
          className="auth-btn"
          style={{ marginTop: "12px", background: "linear-gradient(90deg,#ff3b3b,#ff7b00)" }}
        >
          Logout
        </button>
      </motion.div>
    </div>
  );
}
