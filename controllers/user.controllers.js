const User = require("../models/user.model.js");


const signup = async(req, res) => {
    try{
        let{name, password, confirmPassword, email, photo} = req.body;
        photo = req.file?.filename || null;

        if(password !== confirmPassword){
            if(req.file){
                fstat.unlinkSync(path.join(__dirname, '../uploads', photo));
            }

            return res
                .status(400)
                .json({message: "Passwords do not match"});
        }

        const existingUser = await User.findOne({email: email});
        if(existingUser){
            if(req.file){
                fs.unlinkSync(path.join(__dirname, '../uploads', photo));
            }

            return res
                .status(400)
                .json({message: "User already exists with this email"}) ;
        }
        
        const user = await User.create({
            name,
            email,
            password,
            photo,
        });

        const token = JWT.sign({id: user._id}, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN,
        });

        res.status(201).json({
            message: "User created successfully",
            token,
            data: {user: user}});
    }   catch(error){
        if(req.file){
            fs.unlinkSync(path.join(__dirname, '../uploads', req.file.filename));
        }
        res
            .status(400)
            .json({
                message: "Error creating user",
                error: error.message
            });
    }

};

const login = async(req, res) => {
    try{
        const {email, password} = req.body;

        if(!email || !password){
            return res
                .status(400)
                .json({status: "fail", message: "Email or password is missing"});
        }

        const existingUser = await User.findOne({email: email});

        if(!existingUser){
            return res
                .status(404)
                .json({status: "fail", message: "User does not exist"});
        }

        const matchedPassword = await bcrypt.compare(password, existingUser.password);
        if(!matchedPassword){
            return res
                .status(400)
                .json({status: "fail", message: "Incorrect password"});
        }

        const token = JWT.sign({id: existingUser._id}, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN,
        });

        res.status(200).json({
            status: "success",
            message: "User logged in successfully",
            token
        });
    }
    catch(error){
        res
            .status(500)
            .json({
                status: "error",
                message: "Internal server error",
                error: error.message
            });
    }
}

const protectRoutes = async (req, res, next) => {
  try {
    let token = req.headers.authorization;
    if (token && token.startsWith("Bearer")) {
      token = token.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ status: "fail", message: "not login" });
    }

    const decodedToken = JWT.verify(token, process.env.JWT_SECRET);

    req.userId = decodedToken.id;
    next();
  } catch (error) {
    return res.status(401).json({ status: "fail", message: error.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json({ 
      status: "success", 
      results: users.length, 
      data: { users } 
    });
  } catch (error) {
    res.status(500).json({ status: "fail", message: error.message });
  }
};

const addBookToFavorites = async (req, res) => {
  try {
    const { bookId } = req.body;
    const userId = req.userId;

    if (!bookId) {
      return res.status(400).json({ status: "fail", message: "Book ID is required" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ status: "fail", message: "User not found" });
    }

    let alreadyExists = user.favBooks.includes(bookId);

    if (alreadyExists) {
      return res
        .status(400)
        .json({ status: "fail", message: "Book already in favorites" });
    }

    user.favBooks.push(bookId);
    await user.save();

    res.status(200).json({ status: "success", message: "Book added to favorites" });
  } catch (error) {
    res.status(500).json({ status: "fail", message: error.message });
  }
};

module.exports = {
    signup,
    login,
    protectRoutes,
    getAllUsers,
    addBookToFavorites,
    getAllUsers,
}
