require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require("path");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); 

// Database connection function
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            dbName: process.env.DB_NAME
        });
        console.log('✅ MongoDB connected successfully');
    } catch (error) {
        console.error('❌ MongoDB connection error:', error.message);
        throw error;
    }
};

// Routes (with error handling)
try {
    app.use('/api/books', require('./routes/books'));
    app.use('/api/auth', require('./routes/auth'));
    console.log('✅ API routes loaded successfully');
} catch (error) {
    console.log('⚠️  API route files missing');
}

try {
    const bookRouter = require("./routes/book.routes");
    const userRouter = require("./routes/user.routes");
    
    app.use("/books", bookRouter);
    app.use("/users", userRouter);
    console.log('✅ Additional routes loaded successfully');
} catch (error) {
    console.log('⚠️  Some additional route files missing');
}

// Basic route
app.get('/', (req, res) => {
    res.json({ 
        message: 'Books API is running!',
        endpoints: {
            books: '/api/books',
            auth: '/api/auth',
            alternativeBooks: '/books',
            users: '/users'
        }
    });
});

const PORT = process.env.PORT || 3000;

// Start server
const startServer = async () => {
    try {
        await connectDB();
        
        app.listen(PORT, () => {
            console.log(`🚀 Server is running on port ${PORT}`);
            console.log(`🌐 CORS enabled for frontend`);
            console.log(`📊 API available at: http://localhost:${PORT}`);
            console.log(`📚 Books API: http://localhost:${PORT}/api/books`);
        });
    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
        console.log('⚠️  Starting server without database connection');
        app.listen(PORT, () => {
            console.log(`🚀 Server is running on port ${PORT} (no database)`);
        });
    }
};

startServer();
