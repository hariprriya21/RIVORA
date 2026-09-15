const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    age: {
      type: Number
    },
    location: {
      type: String
    },
    preferred_language: {
      type: String
    },
    diagnosed: {
      type: Boolean,
      default: false
    },
    current_treatment: {
      type: String
    },
    recommended_treatment: {
      type: String
    },
    hospital: {
      type: String
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Patient', patientSchema);
