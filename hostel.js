const express = require('express');
const router = express.Router();
const pool = require('./db');
const { verifyToken } = require('./middleware');

// GET available rooms
router.get('/available-rooms', verifyToken, async (req, res) => {
  try {
    const [rooms] = await pool.query(
      'SELECT id, room_number, capacity, occupants, availability_status FROM hostel_rooms WHERE availability_status = ?',
      ['available']
    );

    res.status(200).json({
      message: 'Available rooms retrieved',
      rooms: rooms
    });

  } catch (error) {
    console.error('Error fetching available rooms:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// BOOK a room
router.post('/book-room', verifyToken, async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { room_id } = req.body;

    if (!room_id) {
      return res.status(400).json({ error: 'room_id required' });
    }

    // Check if user already has a booking
    const [existingBooking] = await pool.query(
      'SELECT id FROM room_bookings WHERE student_id = ? AND status = ?',
      [userId, 'active']
    );

    if (existingBooking.length > 0) {
      return res.status(409).json({ error: 'You already have an active room booking' });
    }

    // Check if room is available
    const [room] = await pool.query(
      'SELECT id, availability_status FROM hostel_rooms WHERE id = ?',
      [room_id]
    );

    if (room.length === 0 || room[0].availability_status !== 'available') {
      return res.status(400).json({ error: 'Room not available' });
    }

    // Create booking
    const [result] = await pool.query(
      'INSERT INTO room_bookings (student_id, room_id, booking_date, status) VALUES (?, ?, NOW(), ?)',
      [userId, room_id, 'active']
    );

    // Update room status
    await pool.query(
      'UPDATE hostel_rooms SET availability_status = ?, occupants = occupants + 1 WHERE id = ?',
      ['booked', room_id]
    );

    res.status(201).json({
      message: 'Room booked successfully',
      booking_id: result.insertId,
      room_id: room_id
    });

  } catch (error) {
    console.error('Error booking room:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET my current booking
router.get('/my-booking', verifyToken, async (req, res) => {
  try {
    const userId = req.user.user_id;

    const [booking] = await pool.query(
      'SELECT rb.id, rb.room_id, rb.booking_date, rb.status, hr.room_number, hr.capacity FROM room_bookings rb INNER JOIN hostel_rooms hr ON rb.room_id = hr.id WHERE rb.student_id = ? AND rb.status = ?',
      [userId, 'active']
    );

    if (booking.length === 0) {
      return res.status(404).json({ message: 'No active booking found' });
    }

    res.status(200).json({
      message: 'Current booking retrieved',
      booking: booking[0]
    });

  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// SUBMIT maintenance complaint
router.post('/complaints', verifyToken, async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { location, issue_description, priority } = req.body;

    if (!location || !issue_description) {
      return res.status(400).json({ error: 'location and issue_description required' });
    }

    const [result] = await pool.query(
      'INSERT INTO maintenance_complaints (student_id, location, issue_description, status, priority, created_at) VALUES (?, ?, ?, ?, ?, NOW())',
      [userId, location, issue_description, 'pending', priority || 'medium']
    );

    res.status(201).json({
      message: 'Complaint submitted',
      complaint_id: result.insertId,
      status: 'pending'
    });

  } catch (error) {
    console.error('Error submitting complaint:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET complaint status
router.get('/complaints', verifyToken, async (req, res) => {
  try {
    const userId = req.user.user_id;

    const [complaints] = await pool.query(
      'SELECT id, location, issue_description, status, priority, created_at FROM maintenance_complaints WHERE student_id = ? ORDER BY created_at DESC',
      [userId]
    );

    res.status(200).json({
      message: 'Complaints retrieved',
      complaints: complaints
    });

  } catch (error) {
    console.error('Error fetching complaints:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET all rooms (for admin)
router.get('/all-rooms', verifyToken, async (req, res) => {
  try {
    const [rooms] = await pool.query(
      'SELECT id, room_number, capacity, occupants, availability_status FROM hostel_rooms ORDER BY room_number ASC'
    );

    res.status(200).json({
      message: 'All rooms retrieved',
      rooms: rooms
    });

  } catch (error) {
    console.error('Error fetching all rooms:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;