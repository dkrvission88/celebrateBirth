import React, { useEffect, useMemo, useState } from "react";
import "./Dashboard.css";
import axios from "axios";
import toast from "react-hot-toast";
import { FixedSizeList as List } from "react-window";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function AdminPanel() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [employees, setEmployees] = useState([]);
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const fetchEmployees = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/auth/admin/employees", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEmployees(res.data.employees);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Admin access denied");
      navigate("/dashboard");
    }
  };

  useEffect(() => {
    fetchEmployees();
    // eslint-disable-next-line
  }, []);

  const filtered = useMemo(() => {
    return employees.filter((e) => {
      const text =
        `${e.name} ${e.email} ${e.phone} ${e.role}`.toLowerCase();
      const matchQuery = text.includes(query.toLowerCase());
      const matchRole = roleFilter === "all" ? true : e.role === roleFilter;
      return matchQuery && matchRole;
    });
  }, [employees, query, roleFilter]);

  const deleteEmployee = async (id) => {
    if (!window.confirm("Delete this employee?")) return;

    try {
      const res = await axios.delete(
        `http://localhost:8000/api/auth/admin/employee/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(res.data.message);
      setEmployees((prev) => prev.filter((x) => x._id !== id));
    } catch (err) {
      toast.error(err?.response?.data?.message || "Delete failed");
    }
  };

  const Row = ({ index, style }) => {
    const emp = filtered[index];
    const firstLetter = (emp?.name || "E").toUpperCase().slice(0, 1);

    return (
      <div style={style} className="px-2 py-2">
        <motion.div
          whileHover={{ scale: 1.01 }}
          className="row-card"
        >
          <div className="avatar">{firstLetter}</div>

          <div className="emp-info">
            <h3>{emp.name}</h3>
            <p>
              {emp.email} • {emp.phone}
            </p>
          </div>

          <span className="badge">{emp.role}</span>

          <button className="delete-btn" onClick={() => deleteEmployee(emp._id)}>
            🗑️ Delete
          </button>
        </motion.div>
      </div>
    );
  };

  return (
    <div className="dash-wrapper">
      <div className="dash-topbar">
        <div>
          <div className="dash-title">🧑‍💼 Admin Panel</div>
          <div className="dash-subtitle">
            Manage employees (300+ supported) ⚡
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button className="dash-btn" onClick={() => navigate("/dashboard")}>
            ⬅ Back
          </button>
        </div>
      </div>

      <div className="card-grid">
        <div className="stat-card">
          <h4>Total Employees</h4>
          <p>{employees.length}</p>
        </div>
        <div className="stat-card">
          <h4>Showing Results</h4>
          <p>{filtered.length}</p>
        </div>
        <div className="stat-card">
          <h4>Admins</h4>
          <p>{employees.filter((x) => x.role?.toLowerCase() === "admin").length}</p>
        </div>
      </div>

      <div className="panel-card">
        <div className="panel-header">
          <input
            placeholder="Search name/email/role..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="employee">Employee</option>
            <option value="hr">HR</option>
          </select>
        </div>

        <div style={{ height: 520 }}>
          <List height={520} itemCount={filtered.length} itemSize={82} width="100%">
            {Row}
          </List>
        </div>
      </div>
    </div>
  );
}
