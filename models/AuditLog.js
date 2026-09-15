const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema(
  {
    actorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    actorRole: {
      type: String,
      required: true
    },
    action: {
      type: String,
      required: true
    },
    targetPatientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: false }
);

module.exports = mongoose.model('AuditLog', auditLogSchema);
