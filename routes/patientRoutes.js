const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

router.post(
  '/',
  authenticateToken,
  authorizeRoles('patient', 'health_worker', 'doctor'),
  patientController.createPatient
);

router.get(
  '/:id',
  authenticateToken,
  patientController.getPatientById
);

router.patch(
  '/:id',
  authenticateToken,
  patientController.updatePatient
);

module.exports = router;
