// Import required modules
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); // For token-based authentication (optional, can be added later)

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

// ==================== ITEMS ROUTES ====================

// GET all items
app.get('/api/items', async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (error) {
    res.status(500).send(error);
  }
});

// POST a new item
app.post('/api/items', async (req, res) => {
  const newItem = new Item({
    name: req.body.name,
    price: req.body.price,
  });

  try {
    await newItem.save();
    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).send(error);
  }
});

// DELETE an item by id
app.delete('/api/items/:id', async (req, res) => {
  try {
    const deletedItem = await Item.findByIdAndDelete(req.params.id);
    if (!deletedItem) return res.status(404).send('Item not found');
    res.json(deletedItem);
  } catch (error) {
    res.status(500).send(error);
  }
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

    // Return success response (you could add JWT here)
    res.json({ message: 'Login successful', success: true });
  } catch (error) {
    res.status(500).send('Error logging in');
  }
});

// GET all users (for testing purposes)
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Start the server
app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
