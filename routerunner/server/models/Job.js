const mongoose = require('mongoose');

// Define a Mongoose Schema for the HDB Carpark CSV data
const jobSchema = new mongoose.Schema({
    jobID : { type: Number, required: false, unique: false },
    address: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Address',
        required: false,
        unique: false,
    },
    runnerID: {type: Number, required: false, unique: false},
    note: { type: String, required: false, unique: false},
    priority: { type: Boolean, required: false, unique: false},
    status: {type: Boolean, required: false, unique: false},
});

module.exports = mongoose.model('Job', jobSchema);