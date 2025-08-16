const Book = require('../models/book.model');



const createBook = async (req, res) => {
    try{
        const book = await Book.create(req.body);
        res.status(201).json({
            status: 'success',
            data: {
                book: book,
            },
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error creating book',
            error: error.message
        });
    }
};

const getAllBooks = async(req, res) => {

    try{
        const page = +req.query.page || 1;
        const limit = +req.query.limit || 5;
        const skip = (page - 1) * limit;
        const books = await Book.find().skip(skip).limit(limit);

        res.status(200).json({
            status: 'success',
            data: {
                books: books,
            },
            length: books.length,
        });
    } catch(error){
        res.status(404).json({
            status: 'error',
            message: 'Error fetching books',
            error: error.message
        });
    }
};

const getBookById = async (req, res) => {
    try{
        const book = await Book.findById(req.params.id);
        res.status(200)
            .json({
                status: 'success',
                data: {
                    book: book,
                },
            });
    } catch (error) {
        res.status(404).json({
            status: 'error',
            message: 'Error fetching book',
            error: error.message
        });
    }
};

const updateBookById = async (req, res) => {
    try{
        const updatedBook = await Book.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true });
    }catch(error){
        res.status(404).json({
            status: 'error',
            message: 'Error updating book',
            error: error.message
        });

    }
};

const deleteBookById = async (req,res) =>{
    try{
        const deletedBook = await Book.findByIdAndDelete(req.params.id);
        res.status(200).json({
            status: 'success',
            data: {
                book: deletedBook,
            },
        });
    } catch(error){
        res.status(404).json({
            status: 'error',
            message: 'Error deleting book',
            error: error.message
        });
    }
}

module.exports = {
    createBook,
    getAllBooks,
    getBookById,
    updateBookById,
    deleteBookById,

}