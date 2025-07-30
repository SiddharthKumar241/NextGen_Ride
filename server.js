const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
require("dotenv").config();
const db = require("./db");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "main.html"));
});

app.use(express.static("public"));

app.post("/checkBalance", async (req, res) => {
  const { registerNumber, distance } = req.body;

  if (!registerNumber || isNaN(distance) || distance > 20) {
    return res.status(400).json({ message: "Invalid input! Distance must be numeric and ≤ 20 Kms." });
  }

  try {
    const student = await db.getStudent(registerNumber);

    if (!student) {
      return res.status(404).json({ message: "Register number not found!" });
    }

    const fare = Math.min(distance * 2.5, 25);
    const newBalance = student.AVAILABLE_BALANCE - fare;

    if (newBalance < 0) {
      return res.status(400).json({ message: "Insufficient balance!" });
    }

    await db.updateBalance(registerNumber, newBalance);

    res.json({
      message: `Hello ${student.NAME}, ₹${fare.toFixed(2)} deducted. Remaining balance: ₹${newBalance.toFixed(2)}.`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error!", error: error.message });
  }
});

app.post("/addUser", async (req, res) => {
  const { registerNumber, name, balance } = req.body;

  if (!registerNumber || !name || balance == null || isNaN(balance)) {
    return res.status(400).json({ message: "All fields are required and must be valid." });
  }

  try {
    const existingUser = await db.getStudent(registerNumber);
    if (existingUser) {
      return res.status(409).json({ message: "User already exists." });
    }

    await db.addStudent({ registerNumber, name, balance });
    res.status(201).json({ message: "User added successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error while adding user." });
  }
});

app.post("/addBalance", async (req, res) => {
  const { registerNumber, amount } = req.body;

  if (!registerNumber || isNaN(amount) || amount <= 0) {
    return res.status(400).json({ message: "Invalid input! Provide registration number and positive amount." });
  }

  try {
    const student = await db.getStudent(registerNumber);
    if (!student) {
      return res.status(404).json({ message: "Register number not found!" });
    }

    const newBalance = student.AVAILABLE_BALANCE + amount;
    await db.updateBalance(registerNumber, newBalance);

    res.json({
      message: `₹${amount.toFixed(2)} added to ${student.NAME}'s balance. New balance: ₹${newBalance.toFixed(2)}.`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error!", error: error.message });
  }
});

app.use((req, res) => {
  res.status(404).json({
    message: "Oops! This route doesn't exist on NextGen Ride. Check your URL or API endpoint. 🚦"
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal server error" });
});

app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
