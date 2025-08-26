const express = require("express");
const bookControllers = require("../controllers/book.controllers");
const userControllers = require("../controllers/user.controllers");

const router = express.Router();

// Main routes - these will handle the actual requests
router
  .route("/")
  .post(bookControllers.createBook)
  .get(bookControllers.getAllBooks);

router
  .route("/:id")
  .get(bookControllers.getBookById)
  .put(bookControllers.updateBookById)
  .delete(bookControllers.deleteBookById);

module.exports = router;
