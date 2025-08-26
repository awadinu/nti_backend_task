import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import path from "path";
import bookRouter from "./routes/book.routes.js";
import userRouter from "./routes/user.routes.js";

dotenv.config();

const app = express();

// CORS configuration
app.use(cors({
    origin: ['http://localhost:4200', 'http://127.0.0.1:4200'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'X-Requested-With', 'Accept']
}));

app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); 

const PORT = process.env.PORT || 3000;
app.get('/', (_, res) => {
    res.json({
        message: 'Books API Server Running!',
        cors: 'Enabled for Angular frontend',
        endpoints: {
            'POST /users/signup': 'User registration',
            'POST /users/login': 'User login',
            'GET /books': 'Get all books',
            'POST /books': 'Create book'
        }
    });
});

// Routes
app.use("/books", bookRouter);
app.use("/users", userRouter);

// Connect to database
connectDB();

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
    console.log(`🌐 CORS enabled for Angular frontend`);
});

const express = require('express');
const router = express.Router();

// Basic routes to make server work
router.get('/', (req, res) => {
    res.json({ 
        message: 'Users route working!',
        endpoints: {
            'POST /signup': 'User registration',
            'POST /login': 'User login'
        }
    });
});

router.post('/signup', (req, res) => {
    res.json({ 
        message: 'Signup endpoint working!',
        note: 'Implementation needed in user.controllers.js'
    });
});

router.post('/login', (req, res) => {
    res.json({ 
        message: 'Login endpoint working!',
        note: 'Implementation needed in user.controllers.js'
    });
});

module.exports = router;
