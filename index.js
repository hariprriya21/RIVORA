require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const authRoutes = require('./routes/authRoutes');
const patientRoutes = require('./routes/patientRoutes');
const carePassportRoutes = require('./routes/carePassportRoutes');
const hospitalRoutes = require('./routes/hospitalRoutes');
const auditLogRoutes = require('./routes/auditLogRoutes');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/rivora';

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.json({ status: 'ok', service: 'RIVORA Care Navigation Platform API' });
});

app.use('/auth', authRoutes);
app.use('/patients', patientRoutes);
app.use('/care-passport', carePassportRoutes);
app.use('/hospitals', hospitalRoutes);
app.use('/audit-log', auditLogRoutes);

// Generic Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

// Database connection & Server start
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB successfully');
    app.listen(PORT, () => {
      console.log(`RIVORA Server listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });
