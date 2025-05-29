const mongoose = require("mongoose");
const mongoURI = 'mongodb+srv://yashkumarsingh2023:xxxxx@clusterone.pvsdyde.mongodb.net/VIT?retryWrites=true&w=majority&appName=ClusterOne';
mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("✅ MongoDB connected via Mongoose"))
.catch(err => console.error("❌ Mongoose connection error:", err));

const studentSchema = new mongoose.Schema({
    REGISTER_NUMBER: { type: String, required: true, unique: true },
    NAME: { type: String, required: true },
    AVAILABLE_BALANCE: { type: Number, required: true }
});

const Student = mongoose.model("VITBUS", studentSchema,"VITBUS");

async function getStudent(registerNumber) {
    try {
        const student = await Student.findOne({ REGISTER_NUMBER: registerNumber });
        if (student) {
            console.log("📄 Student found:", student);
            return student;
        } else {
            console.log("❌ Student not found.");
            return null;
        }
    } catch (error) {
        console.error(" Error in getStudent:", error);
        throw error;
    }
}
async function updateBalance(registerNumber, newBalance) {
    try {
        const result = await Student.updateOne(
            { REGISTER_NUMBER: registerNumber },
            { $set: { AVAILABLE_BALANCE: newBalance } }
        );

        if (result.matchedCount > 0 || result.modifiedCount > 0) {
            console.log("✅ Balance updated successfully!");
        } else {
            console.log("❌ Student not found or no change.");
        }
    } catch (error) {
        console.error(" Error in updateBalance:", error);
        throw error;
    }
}
module.exports = { getStudent, updateBalance };
