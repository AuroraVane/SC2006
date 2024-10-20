const mongoose = require('mongoose');

// Define a Mongoose Schema for the HDB Carpark CSV data
const historylogsSchema = new mongoose.Schema({
  job : {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true,
    unique: false,
  },
  date : {type: String, required: true, unique: false,}
},{collection:"historyLogs"});

// Export the HistoryLogs model
module.exports = mongoose.model('Historylogs', historylogsSchema);