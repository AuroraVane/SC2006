const mongoose = require('mongoose');

// Define a Mongoose Schema for the HDB Carpark CSV data
const carparkSchema = new mongoose.Schema({
  car_park_no: String,
  address: String,
  x_coord: Number,
  y_coord: Number,
  car_park_type: String,
  type_of_parking_system: String,
  short_term_parking: String,
  free_parking: String,
  night_parking: String,
  car_park_decks: Number,
  gantry_height: Number,
  car_park_basement: String,
});

// Export the Carpark model
module.exports = mongoose.model('Carpark', carparkSchema);
