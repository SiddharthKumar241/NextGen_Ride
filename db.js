const mongoose = require("mongoose");
require("dotenv").config();

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("MongoDB connected"))
.catch(err => console.error("MongoDB connection error:", err));

const studentSchema = new mongoose.Schema({
    REGISTER_NUMBER: { type: String, required: true, unique: true },
    NAME: { type: String, required: true },
    AVAILABLE_BALANCE: { type: Number, required: true }
});

const Student = mongoose.model("VITBUS", studentSchema, "VITBUS");

async function getStudent(registerNumber) {
    try {
        const student = await Student.findOne({ REGISTER_NUMBER: registerNumber });
        return student;
    } catch (error) {
        throw error;
    }
}

async function updateBalance(registerNumber, newBalance) {
    try {
        await Student.updateOne(
            { REGISTER_NUMBER: registerNumber },
            { $set: { AVAILABLE_BALANCE: newBalance } }
        );
    } catch (error) {
        throw error;
    }
}

module.exports = { getStudent, updateBalance };
