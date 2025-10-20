const express = require('express');
const cors = require('cors');
require('dotenv').config();
const authRoutes = require('./auth');
const academicsRoutes = require('./academics');
const financeRoutes = require('./finance');
const scheduleRoutes = require('./schedule');
const socialRoutes = require('./social');
const messagingRoutes = require('./messaging');
const hostelRoutes = require('./hostel');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/academics', academicsRoutes);
app.use('/api/finance', financeRoutes);
app.use('/api/schedule', scheduleRoutes);
app.use('/api/social', socialRoutes);
app.use('/api/messaging', messagingRoutes);
app.use('/api/hostel', hostelRoutes);


app.get('/', (req, res) => {
  res.json({ 
    message: 'Student Life Management System',
    status: 'Running'
  });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
