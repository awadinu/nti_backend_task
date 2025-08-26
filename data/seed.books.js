require('dotenv').config(); // Load environment variables
const mongoose = require('mongoose');
const Book = require('../models/book.model'); // Book model
const booksData = require('./books.json'); // Sample books data

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

const insertBooks = async() => {
    try{
        await connectDB(); // Connect to the database
        
        // Transform data to match your model (name -> title)
        const transformedBooks = booksData.map(book => ({
            title: book.name,
            author: book.author,
            price: book.price,
            description: `A ${book.genre.toLowerCase()} book by ${book.author}`,
            genre: book.genre,
            publishedYear: new Date(book.publishedDate).getFullYear().toString(),
            isbn: `ISBN-${Math.random().toString(36).substring(2, 15)}`,
            pages: book.pages,
            publisher: `${book.author.split(' ')[1] || book.author} Publishing`,
            inStock: book.inStock,
            createdAt: book.createdAt,
            lastUpdatedAt: book.lastUpdatedAt
        }));
        
        // Clear existing books first
        await Book.deleteMany({});
        console.log('🗑️  Cleared existing books');
        
        await Book.insertMany(transformedBooks); // Insert books data
        console.log(`✅ ${transformedBooks.length} books inserted successfully`);
        process.exit(); // Exit the process

    }catch(error){
        console.error("❌ Error inserting books:", error.message);
        process.exit(1); // Exit with error code
    }
};

const deleteBooks = async() => {
    try{
        await connectDB(); // Connect to the database
        await Book.deleteMany({}); // Delete all books
        console.log("✅ All books deleted successfully");
        process.exit(); // Exit the process

    }catch(error){
        console.error("❌ Error deleting books:", error.message);
        process.exit(1); // Exit with error code
    }
};

if (process.argv[2] === "--insert") {
    insertBooks();
} else if (process.argv[2] === "--delete") {
    deleteBooks();
} else {
    console.log("Usage:");
    console.log("  npm run seed --insert  - Insert books from JSON");
    console.log("  npm run seed --delete  - Delete all books");
    process.exit();
}


