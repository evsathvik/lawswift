const mysql = require('mysql2');
require('dotenv').config();

// Create Pool Connection
const pool = mysql.createPool({
    host: process.env.DB_HOST || "127.0.0.1",
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "lawswift",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Convert to Promise API
const promisePool = pool.promise();

// Test Connection
pool.getConnection((err, connection) => {
    if (err) {
        console.error("❌ Database connection failed:", err.message);
    } else {
        console.log("✅ Connected to MySQL database");
        connection.release();
    }
});

module.exports = promisePool;
