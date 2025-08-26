const Book = require('../models/book.model.js');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadsDir = path.join(__dirname, '../uploads');
        if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir, { recursive: true });
        }
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
    limits: { fileSize: 5 * 1024 * 1024 }
});

// GET all books
const getAllBooks = async (req, res) => {
    try {
        console.log('Getting all books...');
        const books = await Book.find();
        console.log(`Found ${books.length} books`);
        
        if (books.length === 0) {
            return res.json({
                success: true,
                count: 0,
                data: [],
                message: "No books found. Run 'npm run seed --insert' to load sample data."
            });
        }
        
        res.json({
            success: true,
            count: books.length,
            data: books
        });
    } catch (error) {
        console.error('Error getting books:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// GET book by ID
const getBookById = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).json({
                success: false,
                message: 'Book not found'
            });
        }
        res.json({
            success: true,
            data: book
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// POST create book
const createBook = [
    upload.single('coverImage'),
    async (req, res) => {
        try {
            // Accept both 'title' and 'name'
            const title = req.body.title || req.body.name;
            if (!title) {
                return res.status(400).json({
                    success: false,
                    message: 'Book validation failed: title: Title is required'
                });
            }
            // ...existing code...
            const bookData = {
                title,
                author: req.body.author,
                price: parseFloat(req.body.price) || 0,
                description: req.body.description || (req.body.genre && req.body.author ? `A ${req.body.genre.toLowerCase()} book by ${req.body.author}` : 'No description'),
                genre: req.body.genre,
                publishedYear: req.body.publishedYear || (req.body.publishedDate ? new Date(req.body.publishedDate).getFullYear().toString() : new Date().getFullYear().toString()),
                isbn: req.body.isbn || `ISBN-${Math.random().toString(36).substring(2, 15)}`,
                pages: parseInt(req.body.pages) || 0,
                publisher: req.body.publisher || (req.body.author ? `${req.body.author.split(' ')[1] || req.body.author} Publishing` : 'Unknown Publisher'),
                language: req.body.language || 'English',
                publishedDate: req.body.publishedDate || new Date(),
                releaseDate: req.body.releaseDate || new Date(),
                coverImage: req.file ? `/uploads/${req.file.filename}` : null,
                inStock: req.body.inStock !== undefined ? req.body.inStock : true
            };

            const book = new Book(bookData);
            const savedBook = await book.save();

            res.status(201).json({
                success: true,
                message: 'Book created successfully',
                data: savedBook
            });
        } catch (error) {
            if (req.file) {
                fs.unlink(req.file.path, () => {});
            }
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }
];

// PUT update book
const updateBookById = [
    upload.single('coverImage'),
    async (req, res) => {
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
                publisher: req.body.publisher,
                lastUpdatedAt: new Date()
            };

            if (req.file) {
                updateData.coverImage = `/uploads/${req.file.filename}`;
            }

            const book = await Book.findByIdAndUpdate(req.params.id, updateData, { new: true });
            if (!book) {
                return res.status(404).json({
                    success: false,
                    message: 'Book not found'
                });
            }
            
            res.json({
                success: true,
                message: 'Book updated successfully',
                data: book
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }
];

// DELETE book
const deleteBookById = async (req, res) => {
    try {
        const book = await Book.findByIdAndDelete(req.params.id);
        if (!book) {
            return res.status(404).json({
                success: false,
                message: 'Book not found'
            });
        }
        
        if (book.coverImage) {
            const imagePath = path.join(__dirname, '..', book.coverImage);
            fs.unlink(imagePath, () => {});
        }
        
        res.json({
            success: true,
            message: 'Book deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    getAllBooks,
    getBookById,
    createBook,
    updateBookById,
    deleteBookById
};