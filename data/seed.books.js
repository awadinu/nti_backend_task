const connectDB = require('./config/db'); // Database connection
const Book = require('./models/book.model'); // Book model
const booksData = require('./books.json'); // Sample books data

require('dotenv').config(); // Load environment variables

const insertBooks = async() => {
    try{
        await connectDB(); // Connect to the database
        await Book.insertMany(booksData); // Insert books data
        console.log("Books inserted successfully");
        process.exit(); // Exit the process


    }catch(error){
        console.error("Error inserting books:", error.message);
        process.exit(1); // Exit with error code
    }

};

const deleteBooks = async() => {
    try{
        await connectDB(); // Connect to the database
        await Book.deleteMany(booksData); // Delete books data
        console.log("Books deleted successfully");
        process.exit(); // Exit the process


    }catch(error){
        console.error("Error deleting books:", error.message);
        process.exit(1); // Exit with error code
    }

};

if (process.argv[2] === "--insert") {
  insertMovies();
} else if (process.argv[2] === "--delete") {
  deleteMovies();
} else {
  console.log("Unknown command. Use --insert or --delete");
  process.exit();
};


