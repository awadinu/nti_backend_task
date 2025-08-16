require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const path = require("path");
const bookRouter = require("./routes/book.routes");
const userRouter = require("./routes/user.routes");


const app = express();

app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); 

const PORT = process.env.PORT || 3000;


app.use("/books", bookRouter);
app.use("/users", userRouter);
connectDB();


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// // Missing: Database connection call
// const testConnection = async () => {
//   try {
//     await connectDB();  // This calls your database connection function
//     console.log('✅ Database connection test passed!');
//   } catch (error) {
//     console.error('❌ Database connection test failed:', error.message);
//     process.exit(1);  // Exit if database connection fails
//   }
// };

// // Initialize the connection test
// testConnection();
