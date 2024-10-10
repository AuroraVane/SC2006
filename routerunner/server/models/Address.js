const mongoose = require('mongoose');

// Define a Mongoose Schema for the HDB Carpark CSV data
const addressSchema = new mongoose.Schema({
    addressID: Number,
    street: String,
    blockNumber: Number,
    floor: Number,
    Unit: Number,
    postalCode: Number,
    note: String,
    latitude: Number,
    longitude: Number,
});

// Export the Carpark model
module.exports = mongoose.model('Address', addressSchema);