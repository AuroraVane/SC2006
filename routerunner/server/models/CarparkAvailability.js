const mongoose = require('mongoose');

const carparkAvailabilitySchema = new mongoose.Schema({
    carpark_number: { type: String, unique: true, required: true },
    update_datetime: { type: Date, required: true },
    carpark_info: { type: Array, default: [] }, // Define structure if necessary
});

module.exports = mongoose.model('CarparkAvailability', carparkAvailabilitySchema);