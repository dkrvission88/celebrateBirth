// const express = require("express");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const Employee = require("../models/Employee");

// const router = express.Router();

// //  REGISTER
// router.post("/register", async (req, res) => {
//   try {
//     const { name, email, password, phone, role } = req.body;

//     const exist = await Employee.findOne({ email });
//     if (exist) return res.status(400).json({ message: "Email already exists" });

//     const hashPass = await bcrypt.hash(password, 10);

//     const employee = await Employee.create({
//       name,
//       email,
//       password: hashPass,
//       phone,
//       role,
//     });

//     res.json({ message: "✅ Registered Successfully", employee });
//   } catch (err) {
//     res.status(500).json({ message: "Server error" });
//   }
// });

// //  LOGIN
// router.post("/login", async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     const employee = await Employee.findOne({ email });
//     if (!employee) return res.status(400).json({ message: "User not found" });

//     const match = await bcrypt.compare(password, employee.password);
//     if (!match) return res.status(400).json({ message: "Invalid password" });

//     const token = jwt.sign({ id: employee._id }, process.env.JWT_SECRET, {
//       expiresIn: "2d",
//     });

//     res.json({
//       message: "✅ Login success",
//       token,
//       employee: {
//         id: employee._id,
//         name: employee.name,
//         email: employee.email,
//         phone: employee.phone,
//         role: employee.role,
//       },
//     });
//   } catch (err) {
//     res.status(500).json({ message: "Server error" });
//   }
// });

// //  FORGOT PASSWORD (demo)
// router.post("/forgot-password", async (req, res) => {
//   try {
//     const { email } = req.body;
//     const employee = await Employee.findOne({ email });
//     if (!employee) return res.status(400).json({ message: "User not found" });

//     res.json({ message: "✅ Reset link sent to email (demo API)" });
//   } catch (err) {
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // AUTH Middleware
// const auth = (req, res, next) => {
//   try {
//     const token = req.headers.authorization?.split(" ")[1];
//     if (!token) return res.status(401).json({ message: "Token missing" });

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.userId = decoded.id;
//     next();
//   } catch (err) {
//     res.status(401).json({ message: "Invalid token" });
//   }
// };

// // ✅ UPDATE PROFILE
// router.put("/update", auth, async (req, res) => {
//   try {
//     const { name, phone, role } = req.body;

//     const employee = await Employee.findByIdAndUpdate(
//       req.userId,
//       { name, phone, role },
//       { new: true }
//     );

//     res.json({
//       message: "✅ Profile Updated",
//       employee: {
//         id: employee._id,
//         name: employee.name,
//         email: employee.email,
//         phone: employee.phone,
//         role: employee.role,
//       },
//     });
//   } catch (err) {
//     res.status(500).json({ message: "Server error" });
//   }
// });

// module.exports = router;



const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

const Employee = require("../models/Employee");
const {protect} = require("../middleware/authMiddleware");

const router = express.Router();

// ✅ Mail Transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ✅ REGISTER
router.post("/register", async (req, res) => {
  try {
    const { name, email, phone, role, password } = req.body;

    const exist = await Employee.findOne({ email });
    if (exist) return res.status(400).json({ message: "Email already exists" });

    const hashPass = await bcrypt.hash(password, 10);

    await Employee.create({
      name,
      email,
      phone,
      role,
      password: hashPass,
    });

    res.json({ message: "✅ Registered Successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const employee = await Employee.findOne({ email });
    if (!employee) return res.status(400).json({ message: "User not found" });

    const match = await bcrypt.compare(password, employee.password);
    if (!match) return res.status(400).json({ message: "Invalid password" });

    const token = jwt.sign({ id: employee._id }, process.env.JWT_SECRET, {
      expiresIn: "2d",
    });

    res.json({
      message: "✅ Login success",
      token,
      employee: {
        id: employee._id,
        name: employee.name,
        email: employee.email,
        phone: employee.phone,
        role: employee.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ FORGOT PASSWORD (Send Reset Link)
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    const employee = await Employee.findOne({ email });
    if (!employee) return res.status(400).json({ message: "User not found" });

    // generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    employee.resetPasswordToken = hashedToken;
    employee.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
    await employee.save();

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    // send email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: employee.email,
      subject: "Reset Password Link",
      html: `
        <h2>Password Reset Request</h2>
        <p>Hello ${employee.name},</p>
        <p>Click below to reset password (valid for 10 minutes):</p>
        <a href="${resetUrl}" target="_blank">${resetUrl}</a>
      `,
    });

    res.json({ message: "✅ Reset link sent to email" });
  } catch (err) {
    res.status(500).json({ message: "Server error / Email sending failed" });
  }
});

// ✅ RESET PASSWORD
router.post("/reset-password/:token", async (req, res) => {
  try {
    const { password } = req.body;

    const hashedToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const employee = await Employee.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!employee)
      return res.status(400).json({ message: "Token invalid or expired" });

    const newHash = await bcrypt.hash(password, 10);
    employee.password = newHash;

    employee.resetPasswordToken = null;
    employee.resetPasswordExpire = null;

    await employee.save();

    res.json({ message: "✅ Password reset successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});
// ✅ GET LOGGED-IN USER PROFILE (ME)
router.get("/me", protect, async (req, res) => {
  try {
    const employee = await Employee.findById(req.userId).select("-password");

    if (!employee) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "✅ User fetched successfully",
      employee: {
        id: employee._id,
        name: employee.name,
        email: employee.email,
        phone: employee.phone,
        role: employee.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


// ✅ UPDATE PROFILE (Protected)
router.put("/update", protect, async (req, res) => {
  try {
    const { name, phone, role } = req.body;

    const employee = await Employee.findByIdAndUpdate(
      req.userId,
      { name, phone, role },
      { new: true }
    );

    res.json({
      message: "✅ Profile Updated",
      employee: {
        id: employee._id,
        name: employee.name,
        email: employee.email,
        phone: employee.phone,
        role: employee.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});




const {adminOnly} = require("../middleware/authMiddleware");

// ✅ GET MY PROFILE (Logged user)
router.get("/me", protect, async (req, res) => {
  try {
    const employee = await Employee.findById(req.userId).select("-password");
    res.json({ employee });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ ADMIN: GET ALL EMPLOYEES
router.get("/admin/employees", protect, adminOnly, async (req, res) => {
  try {
    const employees = await Employee.find().select("-password").sort({ createdAt: -1 });
    res.json({ employees });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ ADMIN: DELETE EMPLOYEE
router.delete("/admin/employee/:id", protect, adminOnly, async (req, res) => {
  try {
    await Employee.findByIdAndDelete(req.params.id);
    res.json({ message: "✅ Employee deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;


