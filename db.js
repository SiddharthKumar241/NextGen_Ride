const oracledb = require("oracledb");

const dbConfig = {
    user: "system",
    password: "DarkSister",
    connectString: "localhost/XEPDB1"
};


async function getStudent(registerNumber) {
    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig);
        console.log("✅ Database connected!");

        const result = await connection.execute(
            `SELECT NAME, AVAILABLE_BALANCE FROM SYSTEM.students WHERE REGISTER_NUMBER = :id`,
            [registerNumber],
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );

        /*const result = await connection.execute(
            `SELECT NAME, AVAILABLE_BALANCE FROM students WHERE REGISTER_NUMBER = :registerNumber`,
            [registerNumber],
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );*/

        console.log("📄 Query result:", result.rows);
        return result.rows.length ? result.rows[0] : null;
    } catch (error) {
        console.error("🔥 Database error:", error);
        throw error;
    } finally {
        if (connection) await connection.close();
    }
}

async function updateBalance(registerNumber, newBalance) {
    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig);
        console.log(`🔄 Updating balance for ${registerNumber} to ₹${newBalance}`);

        await connection.execute(
            `UPDATE students SET AVAILABLE_BALANCE = :newBalance WHERE REGISTER_NUMBER = :registerNumber`,
            [newBalance, registerNumber],
            { autoCommit: true }
        );
        console.log("✅ Balance updated successfully!");
    } catch (error) {
        console.error("🔥 Update error:", error);
        throw error;
    } finally {
        if (connection) await connection.close();
    }
}

module.exports = { getStudent, updateBalance };
