const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true, unique: true },
    role: { type: String, required: true },
    password: { type: String, required: true },
    dob: { type: Date, required: true },
    doj: { type: Date, required: true },
    status: { type: String, enum: ["active", "inactive"], default: "active" },


    resetPasswordToken: { type: String, default: null },
    resetPasswordExpire: { type: Date, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Employee", employeeSchema);
