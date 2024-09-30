const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Define the User schema
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  usertype: { type: String, required: true },
  password: { type: String, required: true },
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

// Export the model
module.exports = mongoose.model('User', UserSchema);
