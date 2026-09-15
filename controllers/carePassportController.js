const CarePassport = require('../models/CarePassport');
const Patient = require('../models/Patient');
const { logAction } = require('./auditLogController');

const createCarePassport = async (req, res) => {
  try {
    const {
      patientId,
      diagnosis,
      stage,
      requiredCare,
      locationConstraint,
      financialConstraint,
      currentTreatmentStatus
    } = req.body;

    if (!patientId) {
      return res.status(400).json({ error: 'patientId is required' });
    }

    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    if (req.user.role === 'patient') {
      const isOwner = patient.userId && patient.userId.toString() === req.user.id;
      if (!isOwner) {
        return res.status(403).json({ error: 'Access denied: You can only create a care passport for your own profile' });
      }
    }

    const carePassport = new CarePassport({
      patientId,
      diagnosis,
      stage,
      requiredCare,
      locationConstraint,
      financialConstraint,
      currentTreatmentStatus,
      verified: false,
      verifiedBy: null
    });

    await carePassport.save();
    return res.status(201).json(carePassport);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

const getCarePassportByPatientId = async (req, res) => {
  try {
    const { patientId } = req.params;
    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    if (req.user.role === 'patient') {
      const isOwner = patient.userId && patient.userId.toString() === req.user.id;
      if (!isOwner) {
        return res.status(403).json({ error: 'Access denied: You can only view your own care passport' });
      }
    }

    const carePassport = await CarePassport.findOne({ patientId }).populate('verifiedBy', 'name email role');
    if (!carePassport) {
      return res.status(404).json({ error: 'Care Passport not found for this patient' });
    }

    // Auto-log view action
    await logAction(req.user.id, req.user.role, 'view_care_passport', patientId);

    return res.json(carePassport);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

const verifyCarePassport = async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user.role !== 'doctor') {
      return res.status(403).json({ error: 'Access denied: Only doctors can verify care passports' });
    }

    const carePassport = await CarePassport.findById(id);
    if (!carePassport) {
      return res.status(404).json({ error: 'Care Passport not found' });
    }

    carePassport.verified = true;
    carePassport.verifiedBy = req.user.id;

    await carePassport.save();

    // Auto-log verification action
    await logAction(req.user.id, req.user.role, 'verify_care_passport', carePassport.patientId);

    return res.json(carePassport);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createCarePassport,
  getCarePassportByPatientId,
  verifyCarePassport
};
