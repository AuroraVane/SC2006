
//Import required modules
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

//Create an Express App
const app = express();

//Use the middlewares
app.use(bodyParser.json());
app.use(cors());

//Connect to MongoDB
//mongoose.connect('mongodb+srv://<<User>>:<<Password>>@cluster0.pejrter.mongodb.net/<<Database>>?retryWrites=true&w=majority&appName=Cluster0')
mongoose.connect('mongodb+srv://dbUser:JSepVm8RgvBby3E@cluster0.pejrter.mongodb.net/test?retryWrites=true&w=majority&appName=Cluster0')

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

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  usertype: { type: String, required: true },
  password: { type: String, required: true },
});


// Create the Item model
const Item = mongoose.model('Item', ItemSchema);


app.get('/', (req, res) => {
  res.send('Welcome to the MERN stack backend!');
});

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
      if (!deletedItem) return res.status(404).send("Item not found");
      res.json(deletedItem);
  } catch (error) {
      res.status(500).send(error);
  }
});

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});