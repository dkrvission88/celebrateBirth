import React, { useEffect, useState } from "react";
import "./Dashboard.css";
import axios from "axios";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  console.log("Token:", token);


  const [me, setMe] = useState(null);

  const logout = () => {
    localStorage.clear();
    toast.success("Logged out");
    navigate("/login");
  };

  const fetchMe = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(res)

      setMe(res.data.employee);
    } catch (err) {
        console.log(err);
      toast.error("Session expired, login again");
    //   logout();
    }
  };

  useEffect(() => {
    fetchMe();
    // eslint-disable-next-line
  }, []);

  return (
    <div className="dash-wrapper">
      <div className="dash-topbar">
        <div>
          <div className="dash-title">👋 Dashboard</div>
          <div className="dash-subtitle">
            Welcome {me?.name || "Employee"} ✨
          </div>
        </div>

        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <button className="dash-btn" onClick={() => navigate("/update")}>
            🛠️ Update Profile
          </button>

          {me?.role?.toLowerCase() === "admin" && (
            <Link to="/admin" className="dash-btn" style={{ textDecoration: "none" }}>
              🧑‍💼 Admin Panel
            </Link>
          )}

          <button className="dash-btn" onClick={logout}>
            🚪 Logout
          </button>
        </div>
      </div>

      <div className="card-grid">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="stat-card"
        >
          <h4>Role</h4>
          <p>{me?.role || "-"}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="stat-card"
        >
          <h4>Email</h4>
          <p style={{ fontSize: "16px", fontWeight: 700 }}>{me?.email || "-"}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="stat-card"
        >
          <h4>Phone</h4>
          <p style={{ fontSize: "16px", fontWeight: 700 }}>{me?.phone || "-"}</p>
        </motion.div>
      </div>

      <div className="panel-card">
        <h3 style={{ margin: 0, fontWeight: 900 }}>✨ Quick Actions</h3>
        <p style={{ opacity: 0.7, marginTop: 6 }}>
          You can manage your profile, reset password anytime and access tools.
        </p>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 12 }}>
          <button className="dash-btn" onClick={() => navigate("/forgot-password")}>
            🔁 Forgot Password
          </button>
          <button className="dash-btn" onClick={() => toast.success("Coming Soon 🚀")}>
            🎂 Birthday Wish Page
          </button>
        </div>
      </div>
    </div>
  );
}
