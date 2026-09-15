const Hospital = require('../models/Hospital');
const CarePassport = require('../models/CarePassport');

const getAllHospitals = async (req, res) => {
  try {
    const hospitals = await Hospital.find().sort({ distanceFromPatient: 1 });
    return res.json(hospitals);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

const getMatchingHospitals = async (req, res) => {
  try {
    const { patientId } = req.query;

    if (!patientId) {
      return res.status(400).json({ error: 'patientId query parameter is required' });
    }

    const carePassport = await CarePassport.findOne({ patientId });
    if (!carePassport || !carePassport.requiredCare) {
      return res.json([]);
    }

    const requiredCare = carePassport.requiredCare.trim();

    const hospitals = await Hospital.find({
      treatmentsAvailable: { $regex: new RegExp(`^${requiredCare}$`, 'i') }
    }).sort({ distanceFromPatient: 1 });

    return res.json(hospitals);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAllHospitals,
  getMatchingHospitals
};
