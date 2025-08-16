const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: [true, "Name is required"], 
        trim: true,
        minlength: 1
    },
    author: { 
        type: String, 
        required: [true, "Author is required"], 
        trim: true,
        minlength: 1
    },
    language: { 
        type: String,
        required: [true, "Language is required"],
        trim: true,
        minlength: 1,
        enum: [
            "English",
            "Arabic",
            "Spanish",
            "French",
            "Hindi",
            "Chinese",
            "Japanese",
            "Korean",
            "Other"
        ],
    },
    publishedDate: { 
        type: Date, 
        required: [true, "Published date is required"], 
        default: Date.now
    },
    genre: { 
        type: String, 
        required: [true, "Genre is required"], 
        trim: true,
        minlength: 1
    },
    pages: { 
        type: Number, 
        required: [true, "Number of pages is required"], 
        min: 1
    },
    releaseDate: { 
        type: Date,
        required: [true, "Release date is required"],
        default: Date.now
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    lastUpdatedAt: {
        type: Date,
        default: Date.now
    },
    price: {
        type: Number,
        required: [true, "Price is required"],
        min: 0
    },
    inStock: {
        type: Boolean,
        default: true
    }
});

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;