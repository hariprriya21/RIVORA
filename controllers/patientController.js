const Patient = require('../models/Patient');

const createPatient = async (req, res) => {
  try {
    const {
      userId,
      name,
      age,
      location,
      preferred_language,
      diagnosed,
      current_treatment,
      recommended_treatment,
      hospital
    } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Patient name is required' });
    }

    const linkedUserId = userId || (req.user.role === 'patient' ? req.user.id : null);

    const patient = new Patient({
      userId: linkedUserId,
      name,
      age,
      location,
      preferred_language,
      diagnosed: diagnosed !== undefined ? diagnosed : false,
      current_treatment,
      recommended_treatment,
      hospital
    });

    await patient.save();

    return res.status(201).json(patient);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

const getPatientById = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    if (req.user.role === 'patient') {
      const isOwner = patient.userId && patient.userId.toString() === req.user.id;
      if (!isOwner) {
        return res.status(403).json({ error: 'Access denied: You can only view your own patient profile' });
      }
    }

    return res.json(patient);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

const updatePatient = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    if (req.user.role === 'patient') {
      const isOwner = patient.userId && patient.userId.toString() === req.user.id;
      if (!isOwner) {
        return res.status(403).json({ error: 'Access denied: You can only update your own patient profile' });
      }
    }

    const allowedUpdates = [
      'name',
      'age',
      'location',
      'preferred_language',
      'diagnosed',
      'current_treatment',
      'recommended_treatment',
      'hospital'
    ];

    allowedUpdates.forEach((field) => {
      if (req.body[field] !== undefined) {
        patient[field] = req.body[field];
      }
    });

    await patient.save();
    return res.json(patient);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createPatient,
  getPatientById,
  updatePatient
};
