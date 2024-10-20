// Import required modules
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const axios = require('axios');

const csv = require('csv-parser');
const fs = require('fs');


const jwt = require('jsonwebtoken'); // For token-based authentication (optional, can be added later)
const authenticateJWT = require('./authenticateJWT'); // Import the middleware function
require('dotenv').config(); // Load environment variables from a .env file

// Import the Models from external file
const User = require('./models/User');
const Carpark = require('./models/Carpark');

// Create an Express App
const app = express();

// Use middlewares
app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect('mongodb+srv://dbUser:JSepVm8RgvBby3E@cluster0.pejrter.mongodb.net/test?retryWrites=true&w=majority&appName=Cluster0', {});

// Verify connection
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Root endpoint
app.get('/', (req, res) => {
  res.send('Welcome to the MERN stack backend!');
});

// ==================== USER AUTHENTICATION ====================

// POST: Register a new user
app.post('/api/register', async (req, res) => {
  const { username, password, email, usertype } = req.body;

  // Initialize an array to hold error messages
  const errors = [];

  // Validate email format using a regular expression
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    errors.push('Enter a valid email address');
  }

  // Validate password requirements
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{10,}$/;
  if (!passwordRegex.test(password)) {
    errors.push('Password must be at least 10 characters long, contain upper and lower case letters, and at least one special character.');
  }

  // Check if the user already exists
  const existingUser = await User.findOne({ username });
  if (existingUser) {
    errors.push('Username already exists');
  }

  const existingEmail = await User.findOne({ email });
  if (existingEmail) {
    errors.push('Email already exists');
  }

  // If there are any errors, return them
  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  try {
    // Automatically generate userID
    const lastUser = await User.findOne().sort({ userID: -1 });
    const newUserID = lastUser ? lastUser.userID + 1 : 1; // Start from 1 if no user exists

    const newUser = new User({
      userID: newUserID,
      username,
      password, // Ensure to hash the password before saving it
      usertype,
      email,
      active: false,
      postalCode: '',
    });

    await newUser.save();
    return res.status(201).json({ message: 'User registered successfully' });

  } catch (error) {
    console.error('Error registering user:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// POST: Login an existing user
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  try {
    // Find the user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'Invalid username' });
    }

    // Compare the hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    // Create JWT token
    const token = jwt.sign(
      { userId: user._id, username: user.username, usertype: user.usertype, lastlocation: user.lastlocation }, // Payload (data stored in the token)
      process.env.JWT_SECRET, // Secret key from .env
      { expiresIn: '1h' } // Token expiration (1 hour in this case)
    );

    // Send the token back to the client
    res.json({ token, message: 'Login successful' });
  } catch (error) {
    res.status(500).send('Error logging in');
  }
});

// GET all users (for testing purposes)
app.get('/api/users', authenticateJWT, async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).send(error);
  }
});

// ==================== END USER AUTHENTICATION ====================

// ==================== API ENDPOINTS ====================

app.get('/api/carpark', async (req, res) => {
  let { address } = req.query;

  if (!address) {
    return res.status(400).json({ message: 'Address query parameter is required' });
  }

  try {
    // Decode the URL-encoded address back to its normal format
    address = decodeURIComponent(address);  // Ensure decoding here
    console.log('Decoded address:', address);

    // Perform the query (either exact match or partial match depending on your use case)
    const carpark = await Carpark.findOne({ address: { $regex: address, $options: 'i' } });

    if (!carpark) {
      return res.status(404).json({ message: 'Carpark not found' });
    }

    // Return the car_park_no
    res.json({ car_park_no: carpark.car_park_no });
  } catch (error) {
    console.error('Error fetching carpark:', error);
    res.status(500).json({ message: 'Error fetching carpark data' });
  }
});


// Endpoint to fetch carpark availability
app.get('/api/carpark-availability', async (req, res) => {
  try {
    // Fetch data from the Data.gov.sg API
    const response = await axios.get('https://api.data.gov.sg/v1/transport/carpark-availability');

    // Send the data to the frontend
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching carpark availability:', error);
    res.status(500).send('Error fetching carpark data');
  }
});

// ==================== END API ENDPOINTS ====================

// ==================== RunnerOperator ====================
app.get('/api/activerunner', async (req, res) => {
  try {
    // Assuming you have a User schema where active runners are marked as active
    const activeRunners = await User.find({ usertype: 'runner', active: true });
    res.json(activeRunners);
  } catch (error) {
    console.error('Error fetching active runners:', error);
    res.status(500).json({ message: 'Error fetching active runners' });
  }
});

app.get('/api/runners', async (req, res) => {
  try {
    // Fetch all runners, regardless of their active status
    const allRunners = await User.find({ usertype: 'runner' });
    res.json(allRunners);
  } catch (error) {
    console.error('Error fetching all runners:', error);
    res.status(500).json({ message: 'Error fetching all runners' });
  }
});

app.get('/api/user/lastlocation', async (req,res) => {
  try {
    // Get the user's username from the token
    const { username } = req.user;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ postalCode: user.lastlocation, username });
  } catch (error) {
    console.error('Error fetching user location:', error);
    res.status(500).json({ message: 'Error fetching user location' });
  }
});

// Start the server
app.listen(5001, () => {
  console.log('Server is running on port 5001');
});
