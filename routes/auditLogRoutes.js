const express = require('express');
const router = express.Router();
const auditLogController = require('../controllers/auditLogController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

router.get(
  '/:patientId',
  authenticateToken,
  authorizeRoles('doctor', 'health_worker'),
  auditLogController.getAuditLogsByPatientId
);

module.exports = router;
