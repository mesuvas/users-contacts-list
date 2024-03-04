const asyncHandler = require("express-async-handler");
const jwt = require('jsonwebtoken')
const User = require('../models/userModel')
const bcrypt = require('bcrypt')

//@desc Post register
//@routes Post /api/users/register
//@access public
const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    res.status(400);
    throw new Error("All fields are mandatory!!!");
  }

  // Check if the user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    res.status(400);
    throw new Error("User already registered!!!");
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create a new user
  const user = await User.create({
    username,
    email,
    password: hashedPassword,
  });

  console.log("User created:", user);

  // Respond with the created user data
  res.status(201).json({
    _id: user._id,
    username: user.username,
    email: user.email,
  });
});


//@desc Post login
//@routes Post /api/users/login
//@access public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error('All fields are mandatory');
  }

  // Find the user by email
  const user = await User.findOne({ email });

  if (user && (await bcrypt.compare(password, user.password))) {
    // Passwords match, generate access token
    const accessToken = jwt.sign(
      {
        user: {
          username: user.username,
          email: user.email,
          id: user._id, // Use user._id instead of user.id
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '30m' }
    );
    res.status(200).json({ accessToken });
  } else {
    // Either user not found or passwords don't match
    res.status(400);
    throw new Error('Email or password is not valid!!!');
  }
});

//@desc Get Current status
//@routes get /api/users/current
//@access private
const currentUser = asyncHandler(async (req, res) => {
  res.json(req.user);
});

module.exports = {
  registerUser,
  loginUser,
  currentUser,
};
