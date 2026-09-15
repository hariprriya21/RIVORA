const mongoose = require('mongoose');

const carePassportSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
      required: true
    },
    diagnosis: {
      type: String
    },
    stage: {
      type: String
    },
    requiredCare: {
      type: String
    },
    locationConstraint: {
      type: String
    },
    financialConstraint: {
      type: String
    },
    currentTreatmentStatus: {
      type: String
    },
    verified: {
      type: Boolean,
      default: false
    },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('CarePassport', carePassportSchema);
