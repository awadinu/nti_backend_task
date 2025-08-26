const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const Book = require('../models/book.model.js'); // Fixed import path

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadsDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'book-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    fileFilter: function (req, file, cb) {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed'));
        }
    },
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

// GET /api/books - Get all books
router.get('/', async (req, res) => {
    try {
        console.log('Attempting to fetch books...');
        const books = await Book.find();
        console.log(`Found ${books.length} books`);
        res.json(books);
    } catch (error) {
        console.error('Error fetching books:', error);
        res.status(500).json({ message: error.message });
    }
});

// GET /api/books/:id - Get single book
router.get('/:id', async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }
        res.json(book);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST /api/books - Create new book with file upload
router.post('/', upload.single('coverImage'), async (req, res) => {
    try {
        console.log('Creating new book with data:', req.body);
        const bookData = {
            title: req.body.title,
            author: req.body.author,
            price: parseFloat(req.body.price),
            description: req.body.description,
            genre: req.body.genre,
            publishedYear: req.body.publishedYear,
            isbn: req.body.isbn,
            pages: parseInt(req.body.pages),
            publisher: req.body.publisher,
            coverImage: req.file ? `/uploads/${req.file.filename}` : null
        };

        const book = new Book(bookData);
        const savedBook = await book.save();
        console.log('Book created successfully:', savedBook._id);
        res.status(201).json(savedBook);
    } catch (error) {
        console.error('Error creating book:', error);
        // Clean up uploaded file if book creation fails
        if (req.file) {
            fs.unlink(req.file.path, () => {});
        }
        res.status(400).json({ message: error.message });
    }
});

// PUT /api/books/:id - Update book
router.put('/:id', upload.single('coverImage'), async (req, res) => {
    try {
        const updateData = {
            title: req.body.title,
            author: req.body.author,
            price: parseFloat(req.body.price),
            description: req.body.description,
            genre: req.body.genre,
            publishedYear: req.body.publishedYear,
            isbn: req.body.isbn,
            pages: parseInt(req.body.pages),
            publisher: req.body.publisher
        };

        if (req.file) {
            updateData.coverImage = `/uploads/${req.file.filename}`;
        }

        const book = await Book.findByIdAndUpdate(req.params.id, updateData, { new: true });
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }
        res.json(book);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// DELETE /api/books/:id - Delete book
router.delete('/:id', async (req, res) => {
    try {
        const book = await Book.findByIdAndDelete(req.params.id);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }
        
        // Clean up cover image file if it exists
        if (book.coverImage) {
            const imagePath = path.join(__dirname, '..', book.coverImage);
            fs.unlink(imagePath, () => {});
        }
        
        res.json({ message: 'Book deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
