const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const db = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'LawSwift API is running',
        timestamp: new Date().toISOString()
    });
});

// POST /waitlist - Add user to waitlist
app.post('/waitlist', async (req, res) => {
    try {
        const { name, email } = req.body;

        if (!name || !email) {
            return res.status(400).json({
                success: false,
                message: "Name and email are required"
            });
        }

        const [existingUsers] = await db.query(
            "SELECT id FROM waitlist WHERE email = ?",
            [email]
        );

        if (existingUsers.length > 0) {
            return res.status(409).json({
                success: false,
                message: "Email already exists in waitlist"
            });
        }

        const [result] = await db.query(
            "INSERT INTO waitlist (name, email) VALUES (?, ?)",
            [name, email]
        );

        res.status(201).json({
            success: true,
            message: "Successfully joined the waitlist!",
            data: {
                id: result.insertId
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
});

// 404 Handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Endpoint not found"
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
