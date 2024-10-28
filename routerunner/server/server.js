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
const Job = require('./models/Job');
const HistoryLogs = require('./models/HistoryLogs')
const Address = require('./models/Address')

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
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (!passwordRegex.test(password)) {
    errors.push('Password must be at least 8 characters long, contain upper and lower case letters, and at least one special character.');
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

app.post('/api/resetpassword', async (req, res) => {
  const { username, password } = req.body;
  const errors = [];
  
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (!passwordRegex.test(password)) {
      errors.push('Password must be at least 8 characters long, contain upper and lower case letters, and at least one special character.');
  }

  if (errors.length > 0) {
      return res.status(400).json({ errors });
  }

  try {
      // Hash the new password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Update the user's password in the database
      const result = await User.updateOne({ username: username }, { $set: { password: hashedPassword } });

      // Check if the user was found and updated
      if (result.modifiedCount === 0) {
          return res.status(404).json({ message: 'User not found.' });
      }

      return res.status(200).json({ message: 'Password has been reset successfully.' });
  } catch (error) {
      console.error('Error resetting password:', error);
      return res.status(500).json({ message: 'An error occurred while resetting the password.' });
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
      { userId: user._id, username: user.username, usertype: user.usertype, lastlocation: user.lastlocation, newlocation: user.newlocation }, // Payload (data stored in the token)
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

app.delete('/api/runners/delete:username', async (req, res) => {
  const { username } = req.params;
  console.log(username);
  try {
    const deletedRunner = await User.findOneAndDelete({ username:username });
    if (!deletedRunner) {
      return res.status(404).json({ message: 'Runner not found' });
    }
    res.json({ message: 'Runner deleted successfully' });
  } catch (error) {
    console.error('Error deleting runner:', error);
    res.status(500).json({ message: 'Error deleting runner' });
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

app.get('/api/carpark/fetch3closestcarpark', async (req, res) => {

});
// ==================== HISTORY LOGS ENDPOINT ====================
// API route to fetch history logs
app.get('/api/historylogs', async (req, res) => {
  try {
    // Find all history logs and populate related fields
    const logs = await HistoryLogs.find()
      .populate({
        path: 'job', // Populate the 'job' field
        populate: {
          path: 'address', // Populate the 'address' field inside the 'job'
          model: 'Address' // Reference the Address collection
        }
      })
      .exec();

    // Send the populated logs as JSON
    res.json(logs);
  } catch (error) {
    console.error('Error fetching history logs:', error);
    res.status(500).send('Error fetching history logs');
  }
});


// ==================== END API ENDPOINTS ====================


// ==================== JOB QUERY ENDPOINT====================
app.get('/api/runner-job', async (req, res) => {
  try {
    // Get the user's username from the token
    const username = req.query.username;
    const job = await Job.findOne({
      runnerUsername: username,
      status: 'ongoing'
    });
    const jobaddress = await Address.findOne({
      _id: job.address,
    });
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.json({
      jobID: job.jobID,
      street: jobaddress.street,
      block: jobaddress.block,
      unitNumber: jobaddress.unitNumber,
      postalCode: jobaddress.postalCode,
      runnerUsername: job.runnerUsername,
      note: job.note,
      priority: job.priority,
      status: job.status
    });
  } catch (error) {
    console.error('Error fetching job:', error);
    res.status(500).json({ message: 'Error fetching job' });
  }
})
// ==================== END API ENDPOINTS ====================



// ==================== JOB CREATION ENDPOINT ====================
app.post('/api/jobs', async (req, res) => {
  console.log("Entered backend")
  const { jobID, address, runner, note, priority, status } = req.body;

  // Validate required fields
  if (!jobID || !address) {
      return res.status(400).json({ message: 'jobID, startAddress, and status are required.' });
  }
  try { 
    const newAddress = new Address({
      street: address.street,
      block: address.block,
      unitNumber: address.unitNumber,
      postalCode: address.postalCode,
    });
    console.log(newAddress);
    await newAddress.save();
    
    console.log({ message: 'Address created successfully', job: newAddress})
    const newJob = new Job({
          jobID: jobID,
          address: newAddress._id,
          priority: priority || false,
          note: note || null,
          runner: runner || null,
          status: status,
    });

    await newJob.save();
    console.log("Successful")
    res.status(201).json({ message: 'Job created successfully', job: newJob });
  } catch (error) {
      console.error('Error creating job:', error);
      res.status(500).json({ message: 'Error creating job', error: error.message });
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

app.get('/api/user/location', async (req,res) => {
  try {
    // Get the user's username from the token
    const username = req.query.username;
    const user = await User.findOne({ username: username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ lastlocation: user.lastlocation, newlocation: user.newlocation });
  } catch (error) {
    console.error('Error fetching user location:', error);
    res.status(500).json({ message: 'Error fetching user location' });
  }
});



//Test Function
app.get('/api/user/jobCompleted', async (req,res) => {
  const {username} = req.query;
  try {
    // await Job.updateMany({}, {$set: {status:'waiting', runnerUsername:'null'}});
    const jobcompleted = await Job.findOne({status:'ongoing', runnerUsername:username});
    const jobcompletedupdate = await Job.updateOne({
      status: 'ongoing',
      runnerUsername: username,
    }, {$set:{
      status: 'completed',
    }});
    const jobongoingupdate = await Job.updateOne({
      status: 'waiting',
    }, {$set:{
      runnerUsername: username,
      status: 'ongoing'
    }})
    jobongoing = await Job.findOne({runnerUsername: username, status:'ongoing'})
    const addresscompleted = await Address.findOne({_id: jobcompleted.address});
    const addressongoing = await Address.findOne({_id: jobongoing.address});
    const user = await User.updateOne({
      username: username,
    }, {$set:{
      lastlocation: addresscompleted.postalCode,
      newlocation: addressongoing.postalCode
    }})
    res.json({postalCode: addressongoing.postalCode });
  }
  catch (error) {
    console.error('Error fetching user location:', error);
    res.status(500).json({ message: 'Error fetching user location' });
  }
});

app.post('/api/resetDB', async (req, res) => {
  await Job.updateMany({}, {$set: {status:'waiting', runnerUsername:'null'}});
  await Job.updateOne({
    status:'waiting'
  },{$set:{
    runnerUsername:'abc',
    status:'ongoing'
  }})
  await User.updateOne({
    username: 'abc'
  }, {$set:{
    lastlocation:'238823',
    newlocation:'639798'
  }})
})

// Start the server
app.listen(5001, () => {
  console.log('Server is running on port 5001');
});
