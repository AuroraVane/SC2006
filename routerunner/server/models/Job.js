const mongoose = require('mongoose');

// Define a Mongoose Schema for the HDB Carpark CSV data
const jobSchema = new mongoose.Schema({
    jobID : Number,
    startAddress: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Address'
    },
    endAddress: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Address'
    },
    runner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    status: Boolean,
});

// Export the Carpark model
module.exports = mongoose.model('Job', jobSchema);