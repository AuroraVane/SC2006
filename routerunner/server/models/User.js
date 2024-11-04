const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Define the User schema
const UserSchema = new mongoose.Schema({
  userID: { type: Number, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  email : { type: String, required: true, unique: true },
  usertype: { type: String, required: true, enum: ['operator', 'runner']},
  password: { type: String, required: true },
  active: { type: Boolean, default: false },
  lastlocation: { type: String, default: "" }, // Format Postal Code
  newlocation: { type: String, default: "" }, // Format Postal Code
  fbID : { type: String, default: false },
});

// Hash the password before saving the user to the database
UserSchema.pre('save', async function (next) {
  const user = this;

  if (!user.isModified('password')) return next(); // Only hash if the password is new or modified

  try {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Set userID before saving
UserSchema.pre('save', async function (next) {
  // Find the latest userID in the collection and increment
  const latestUser = await this.constructor.findOne().sort({ userID: -1 });
  this.userID = latestUser ? latestUser.userID + 1 : 1; // Start from 1 if no users exist
  next();
});

// Export the model
module.exports = mongoose.model('User', UserSchema);
