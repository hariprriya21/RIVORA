const mongoose = require('mongoose');

const hospitalSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    location: {
      type: String,
      trim: true
    },
    treatmentsAvailable: [
      {
        type: String,
        trim: true
      }
    ],
    specialistAvailable: {
      type: Boolean,
      default: true
    },
    distanceFromPatient: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Hospital', hospitalSchema);
