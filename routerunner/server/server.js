// Import required modules
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const axios = require('axios');

const jwt = require('jsonwebtoken'); // For token-based authentication (optional, can be added later)
const authenticateJWT = require('./authenticateJWT'); // Import the middleware function
require('dotenv').config(); // Load environment variables from a .env file

// Import the User model from external file
const User = require('./models/User');

// Create an Express App
const app = express();

// Use middlewares
app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect('mongodb+srv://dbUser:JSepVm8RgvBby3E@cluster0.pejrter.mongodb.net/test?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Verify connection
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Define the Item schema
const ItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
});

// Create the Item model
const Item = mongoose.model('Item', ItemSchema);

// Root endpoint
app.get('/', (req, res) => {
  res.send('Welcome to the MERN stack backend!');
});

// ==================== USER AUTHENTICATION ====================

// POST: Register a new user
app.post('/api/register', async (req, res) => {
  const { username, password, usertype } = req.body;

  if (!username || !password || !usertype) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    // Create and save the new user
    const newUser = new User({
      username,
      password, // Password will be hashed in the pre-save hook defined in User model
      usertype,
    });

    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).send('Error registering user');
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
      { userId: user._id, username: user.username, usertype: user.usertype }, // Payload (data stored in the token)
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

// Start the server
app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
