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
    runnerUsername: {
        type: String,
        required: false,
        unique: false,
        default: 'null',
    },
    note: { type: String, required: false, unique: false},
    priority: { type: Boolean, required: false, unique: false},
    status: { 
        type: String, 
        enum: ['waiting', 'ongoing', 'completed'], 
        required: false 
    },
    location: {
        type: { type: String, enum: ['Point'], required: true },
        coordinates: { type: [Number], required: true },
    },
});

jobSchema.index({ location: '2dsphere' });
module.exports = mongoose.model('Job', jobSchema);