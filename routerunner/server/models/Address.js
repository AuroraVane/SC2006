const mongoose = require('mongoose');

// Define a Mongoose Schema for the HDB Carpark CSV data
const addressSchema = new mongoose.Schema({
    street: {type: String, required: false, unique: false},
    block: { type: String, required: false, unique: false},
    unitNumber: { type: String, required: false, unique: false},
    postalCode: { type: String, required: true, unique: false},
});

module.exports = mongoose.model('Address', addressSchema);