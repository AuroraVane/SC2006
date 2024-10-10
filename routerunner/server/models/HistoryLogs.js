const mongoose = require('mongoose');

// Define a Mongoose Schema for the HDB Carpark CSV data
const historylogsSchema = new mongoose.Schema({
  job : {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job'
  },
  date : String,
});

// Export the Carpark model
module.exports = mongoose.model('Historylogs', historylogsSchema);