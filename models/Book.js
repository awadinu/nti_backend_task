const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    author: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    genre: {
        type: String,
        required: true
    },
    publishedYear: {
        type: String,
        required: true
    },
    isbn: {
        type: String,
        required: true,
        unique: true
    },
    pages: {
        type: Number,
        required: true
    },
    publisher: {
        type: String,
        required: true
    },
    coverImage: {
        type: String,
        default: null
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Book', bookSchema);
