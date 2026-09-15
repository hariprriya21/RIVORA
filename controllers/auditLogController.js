const AuditLog = require('../models/AuditLog');

const logAction = async (actorId, actorRole, action, targetPatientId) => {
  try {
    await AuditLog.create({
      actorId,
      actorRole,
      action,
      targetPatientId,
      timestamp: new Date()
    });
  } catch (err) {
    console.error('Failed to record audit log:', err.message);
  }
};

const getAuditLogsByPatientId = async (req, res) => {
  try {
    const { patientId } = req.params;
    const logs = await AuditLog.find({ targetPatientId: patientId })
      .populate('actorId', 'name email role')
      .sort({ timestamp: -1 });

    return res.json(logs);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

module.exports = {
  logAction,
  getAuditLogsByPatientId
};
