const express = require('express');
const router = express.Router();
const pool = require('./db');
const { verifyToken } = require('./middleware');

// GET medical records
router.get('/medical-records', verifyToken, async (req, res) => {
  try {
    const userId = req.user.user_id;

    const [records] = await pool.query(
      'SELECT id, health_condition, prescription, date_recorded FROM medical_records WHERE student_id = ? ORDER BY date_recorded DESC',
      [userId]
    );

    res.status(200).json({
      message: 'Medical records retrieved',
      records: records
    });

  } catch (error) {
    console.error('Error fetching medical records:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// CREATE medical record (doctor only)
router.post('/medical-records', verifyToken, async (req, res) => {
  try {
    const { student_id, condition, prescription } = req.body;

    if (!student_id || !condition) {
      return res.status(400).json({ error: 'student_id and condition required' });
    }

    const [result] = await pool.query(
      'INSERT INTO medical_records (student_id, health_condition, prescription, date_recorded) VALUES (?, ?, ?, NOW())',
      [student_id, condition, prescription || null]
    );

    res.status(201).json({
      message: 'Medical record created',
      record_id: result.insertId
    });

  } catch (error) {
    console.error('Error creating medical record:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// BOOK health appointment
router.post('/appointments/book', verifyToken, async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { doctor_id, appointment_date, appointment_time } = req.body;

    if (!doctor_id || !appointment_date || !appointment_time) {
      return res.status(400).json({ error: 'doctor_id, appointment_date, appointment_time required' });
    }

    const [result] = await pool.query(
      'INSERT INTO health_appointments (student_id, doctor_id, appointment_date, appointment_time, status) VALUES (?, ?, ?, ?, ?)',
      [userId, doctor_id, appointment_date, appointment_time, 'scheduled']
    );

    res.status(201).json({
      message: 'Appointment booked',
      appointment_id: result.insertId,
      date: appointment_date,
      time: appointment_time
    });

  } catch (error) {
    console.error('Error booking appointment:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET my appointments
router.get('/appointments', verifyToken, async (req, res) => {
  try {
    const userId = req.user.user_id;

    const [appointments] = await pool.query(
      'SELECT id, doctor_id, appointment_date, appointment_time, status FROM health_appointments WHERE student_id = ? ORDER BY appointment_date DESC',
      [userId]
    );

    res.status(200).json({
      message: 'Appointments retrieved',
      appointments: appointments
    });

  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET gym access status
router.get('/gym-status', verifyToken, async (req, res) => {
  try {
    const userId = req.user.user_id;

    const [gymAccess] = await pool.query(
      'SELECT id, access_level, expiry_date FROM gym_access WHERE student_id = ? ORDER BY expiry_date DESC LIMIT 1',
      [userId]
    );

    if (gymAccess.length === 0) {
      return res.status(404).json({ message: 'No gym access found' });
    }

    const isActive = new Date(gymAccess[0].expiry_date) > new Date();

    res.status(200).json({
      message: 'Gym status retrieved',
      gym_access: {
        id: gymAccess[0].id,
        access_level: gymAccess[0].access_level,
        expiry_date: gymAccess[0].expiry_date,
        is_active: isActive
      }
    });

  } catch (error) {
    console.error('Error fetching gym status:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// CREATE gym access (admin only)
router.post('/gym-access', verifyToken, async (req, res) => {
  try {
    const { student_id, access_level, expiry_date } = req.body;

    if (!student_id || !access_level || !expiry_date) {
      return res.status(400).json({ error: 'student_id, access_level, expiry_date required' });
    }

    const [result] = await pool.query(
      'INSERT INTO gym_access (student_id, access_level, expiry_date) VALUES (?, ?, ?)',
      [student_id, access_level, expiry_date]
    );

    res.status(201).json({
      message: 'Gym access created',
      access_id: result.insertId
    });

  } catch (error) {
    console.error('Error creating gym access:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;