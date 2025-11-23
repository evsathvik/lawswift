const mysql = require('mysql2/promise');
require('dotenv').config();

async function createPool() {
    const pool = mysql.createPool({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    });

    console.log("✅ MySQL pool created");

    return pool;
}

let pool;

async function getPool() {
    if (!pool) {
        pool = await createPool();
    }
    return pool;
}

module.exports = getPool;
