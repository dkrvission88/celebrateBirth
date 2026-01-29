import React, { useState } from "react";
import "./Auth.css";
import axios from "axios";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8000/api/auth/login", form);
      toast.success(res.data.message);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("employee", JSON.stringify(res.data.employee));

      navigate("/dashboard");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="auth-wrapper">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="auth-card"
      >
        <h2 className="auth-title">🔐 Employee Login</h2>
        <p className="auth-subtitle">Welcome back, login to continue</p>

        <form onSubmit={handleLogin}>
          <div className="input-box">
            <label>Email</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} required />
          </div>

          <div className="input-box">
            <label>Password</label>
            <input type="password" name="password" value={form.password} onChange={handleChange} required />
          </div>

          <button className="auth-btn">Login</button>
        </form>

        <div className="auth-links">
          <Link to="/forgot-password">Forgot password?</Link>
          <br />
          New employee? <Link to="/register">Register</Link>
        </div>
      </motion.div>
    </div>
  );
}






// import React, { useEffect, useState } from "react";
// // import "bootstrap/dist/css/bootstrap.min.css";

// export default function App() {
//   const [storedPassword, setStoredPassword] = useState(null);
//   const [userInput, setUserInput] = useState("");
//   const [confirmInput, setConfirmInput] = useState("");
//   const [isLoggedIn, setIsLoggedIn] = useState(false);

//   // On load, check if a password exists
//   useEffect(() => {
//     const savedPassword = localStorage.getItem("appPassword");
//     if (savedPassword) {
//       setStoredPassword(savedPassword);
//     }
//   }, []);

//   // Handle first-time password setup
//   const handleSetPassword = () => {
//     if (userInput.length < 4) {
//       alert("Password must be at least 4 characters");
//       return;
//     }
//     if (userInput !== confirmInput) {
//       alert("Passwords do not match");
//       return;
//     }
//     localStorage.setItem("appPassword", userInput);
//     setStoredPassword(userInput);
//     alert("Password set successfully! Please log in.");
//     setUserInput("");
//     setConfirmInput("");
//   };

//   // Handle login attempt
//   const handleLogin = () => {
//     if (userInput === storedPassword) {
//       setIsLoggedIn(true);
//     } else {
//       alert("Incorrect password");
//     }
//   };

//   // Reset the password (for demo/debugging)
//   const handleReset = () => {
//     localStorage.removeItem("appPassword");
//     setStoredPassword(null);
//     setIsLoggedIn(false);
//     setUserInput("");
//     setConfirmInput("");
//   };

//   return (
//     <div className="container mt-5">
//       {isLoggedIn ? (
//         <div className="text-center">
//           <h2>🎉 Welcome to the Dashboard!</h2>
//           <button className="btn btn-danger mt-3" onClick={handleReset}>
//             Reset App
//           </button>
//         </div>
//       ) : !storedPassword ? (
//         // First-time password setup
//         <div className="card mx-auto" style={{ maxWidth: "400px" }}>
//           <div className="card-body">
//             <h4 className="card-title text-center">Set Your Password</h4>
//             <div className="form-group mt-3">
//               <label>New Password</label>
//               <input
//                 type="password"
//                 className="form-control"
//                 value={userInput}
//                 onChange={(e) => setUserInput(e.target.value)}
//               />
//             </div>
//             <div className="form-group mt-3">
//               <label>Confirm Password</label>
//               <input
//                 type="password"
//                 className="form-control"
//                 value={confirmInput}
//                 onChange={(e) => setConfirmInput(e.target.value)}
//               />
//             </div>
//             <button className="btn btn-success w-100 mt-4" onClick={handleSetPassword}>
//               Set Password
//             </button>
//           </div>
//         </div>
//       ) : (
//         // Login screen
//         <div className="card mx-auto" style={{ maxWidth: "400px" }}>
//           <div className="card-body">
//             <h4 className="card-title text-center">Login</h4>
//             <div className="form-group mt-3">
//               <label>Password</label>
//               <input
//                 type="password"
//                 className="form-control"
//                 value={userInput}
//                 onChange={(e) => setUserInput(e.target.value)}
//               />
//             </div>
//             <button className="btn btn-primary w-100 mt-4" onClick={handleLogin}>
//               Login
//             </button>
//             <button className="btn btn-link w-100 mt-2" onClick={handleReset}>
//               Reset Password
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// import React, { useEffect, useState } from "react";
// // import "bootstrap/dist/css/bootstrap.min.css";
// import FtpD from "../component/FtpDownloader"

// export default function App() {
//   const [password, setPassword] = useState("");
//   const [isLoggedIn, setIsLoggedIn] = useState(false);

//   // Set default password only on first load
//   useEffect(() => {
//     const savedPassword = localStorage.getItem("appPassword");
//     if (!savedPassword) {
//       localStorage.setItem("appPassword", "admin123"); // default password
//     }
//   }, []);

//   // Handle login
//   const handleLogin = () => {
//     const savedPassword = localStorage.getItem("appPassword");
//     if (password === savedPassword) {
//       setIsLoggedIn(true);
//     } else {
//       alert("Wrong password");
//     }
//   };

//   return (
//     <div className="container mt-5">
//       {isLoggedIn ? (
//         <FtpD/>
//         // <div className="text-center">
//         //   <h2>Welcome to the Dashboard!</h2>
//         // </div>
//       ) : (
//         <div className="card mx-auto" style={{ maxWidth: "400px" }}>
//           <div className="card-body">
//             <h4 className="card-title text-center">Login</h4>
//             <div className="form-group mt-3">
//               <label>Password</label>
//               <input
//                 type="password"
//                 className="form-control"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//               />
//             </div>
//             <button className="btn btn-primary w-100 mt-4" onClick={handleLogin}>
//               Login
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }


// import React, { useEffect, useState } from "react";
// import FtpD from "../component/FtpDownloader";

// // Utility to hash string with SHA-256
// async function hashPassword(password) {
//   const encoder = new TextEncoder();
//   const data = encoder.encode(password);
//   const hashBuffer = await crypto.subtle.digest("SHA-256", data);
//   return Array.from(new Uint8Array(hashBuffer))
//     .map(b => b.toString(16).padStart(2, "0"))
//     .join("");
// }

// export default function App() {
//   const [password, setPassword] = useState("");
//   const [isLoggedIn, setIsLoggedIn] = useState(false);

//   useEffect(() => {
//     (async () => {
//       const savedHash = localStorage.getItem("appPasswordHash");
//       if (!savedHash) {
//         const defaultHash = await hashPassword("admin123");
//         localStorage.setItem("appPasswordHash", defaultHash);
//       }
//     })();
//   }, []);

//   const handleLogin = async () => {
//     const savedHash = localStorage.getItem("appPasswordHash");
//     const enteredHash = await hashPassword(password);
//     if (enteredHash === savedHash) {
//       setIsLoggedIn(true);
//     } else {
//       alert("Wrong password");
//     }
//   };

//   return (
//     <div className="container mt-5">
//       {isLoggedIn ? (
//         <FtpD />
//       ) : (
//         <div className="card mx-auto" style={{ maxWidth: "400px" }}>
//           <div className="card-body">
//             <h4 className="card-title text-center">Login</h4>
//             <div className="form-group mt-3">
//               <label>Password</label>
//               <input
//                 type="password"
//                 className="form-control"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//               />
//             </div>
//             <button className="btn btn-primary w-100 mt-4" onClick={handleLogin}>
//               Login
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }




