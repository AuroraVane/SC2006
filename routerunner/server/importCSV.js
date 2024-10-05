const fs = require('fs');
const csv = require('csv-parser');
const mongoose = require('mongoose');
const Carpark = require('./models/Carpark'); // Import the Carpark model

// Connect to MongoDB using your connection string
mongoose.connect('mongodb+srv://dbUser:JSepVm8RgvBby3E@cluster0.pejrter.mongodb.net/test?retryWrites=true&w=majority&appName=Cluster0', {
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Function to read and insert CSV data
function importCSV(filePath) {
  const results = [];

  fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', async () => {
      try {
        // Insert the CSV data into MongoDB
        await Carpark.insertMany(results);
        console.log('CSV data successfully inserted into MongoDB');
        mongoose.connection.close();
      } catch (err) {
        console.error('Error inserting CSV data into MongoDB:', err);
      }
    });
}

// Call the function with the path to your CSV file
importCSV('HDB Carpark Information.csv');
