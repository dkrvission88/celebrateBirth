const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized: Token missing" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;

    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};





const Employee = require("../models/Employee");

const adminOnly = async (req, res, next) => {
  try {
    const employee = await Employee.findById(req.userId);

    if (!employee) {
      return res.status(401).json({ message: "Unauthorized user" });
    }

    if (employee.role.toLowerCase() !== "admin") {
      return res.status(403).json({ message: "Admin access denied" });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};



module.exports = { protect, adminOnly };