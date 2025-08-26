const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: [true, "Title is required"], 
        trim: true,
        minlength: 1
    },
    author: { 
        type: String, 
        required: [true, "Author is required"], 
        trim: true,
        minlength: 1
    },
    price: {
        type: Number,
        required: [true, "Price is required"],
        min: 0
    },
    description: {
        type: String,
        required: false, // Made optional
        trim: true,
        default: function() {
            return `A ${this.genre ? this.genre.toLowerCase() : 'book'} by ${this.author}`;
        }
    },
    genre: { 
        type: String, 
        required: [true, "Genre is required"], 
        trim: true,
        minlength: 1
    },
    publishedYear: {
        type: String,
        required: false, // Made optional
        default: function() {
            return this.publishedDate ? new Date(this.publishedDate).getFullYear().toString() : new Date().getFullYear().toString();
        }
    },
    isbn: {
        type: String,
        required: false, // Made optional
        unique: false, // Removed unique constraint
        trim: true,
        default: function() {
            return `ISBN-${Math.random().toString(36).substring(2, 15)}`;
        }
    },
    pages: { 
        type: Number, 
        required: [true, "Number of pages is required"], 
        min: 1
    },
    publisher: {
        type: String,
        required: false, // Made optional
        trim: true,
        default: function() {
            return `${this.author.split(' ')[1] || this.author} Publishing`;
        }
    },
    // Keep original fields from JSON
    language: {
        type: String,
        enum: ["English", "Arabic", "Spanish", "French", "Hindi", "Chinese", "Japanese", "Korean", "Other"],
        default: "English"
    },
    publishedDate: {
        type: Date,
        default: Date.now
    },
    releaseDate: {
        type: Date,
        default: Date.now
    },
    coverImage: {
        type: String,
        default: null
    },
    inStock: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    lastUpdatedAt: {
        type: Date,
        default: Date.now
    }
});

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;