const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ['patient', 'doctor', 'health_worker'],
      required: true
    },
    name: {
      type: String,
      trim: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
