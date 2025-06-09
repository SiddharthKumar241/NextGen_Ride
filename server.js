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

// Serve main.html as the homepage
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "main.html"));
});

app.use(express.static("public"));

app.post("/checkBalance", async (req, res) => {
    const { registerNumber, distance } = req.body;

    if (!registerNumber || isNaN(distance) || distance > 20) {
        return res.status(400).json({ message: "Invalid input! Greater than 20 Kms" });
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
            message: `Hello ${student.NAME}, ₹${fare} deducted. Remaining balance: ₹${newBalance}`,
        });

    } catch (error) {
        console.error("Server error:", error);
        res.status(500).json({ message: "Server error!", error: error.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

