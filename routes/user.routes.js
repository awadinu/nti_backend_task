const express = require('express');
const userControllers = require("../controllers/user.controllers");
const router = express.Router();

const upload = require("../middleware/upload.middleware");
const multerErrorHandler = require("../middleware/multer.error.handler");

router.post("/signup", upload.single("profilePicture"), multerErrorHandler, userControllers.signup);

router.route("/login").post(userControllers.login);

module.exports = router;
