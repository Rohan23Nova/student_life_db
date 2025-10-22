const express = require('express');
const router = express.Router();
const pool = require('./db');
const { verifyToken } = require('./middleware');

// CREATE a group
router.post('/groups/create', verifyToken, async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { group_name, description } = req.body;

    if (!group_name) {
      return res.status(400).json({ error: 'group_name required' });
    }

    const [result] = await pool.query(
      'INSERT INTO student_groups (group_name, description, created_by, created_at) VALUES (?, ?, ?, NOW())',
      [group_name, description || null, userId]
    );

    const groupId = result.insertId;

    // Add creator as member
    await pool.query(
      'INSERT INTO group_members (group_id, student_id, joined_date) VALUES (?, ?, NOW())',
      [groupId, userId]
    );

    res.status(201).json({
      message: 'Group created successfully',
      group_id: groupId,
      group_name: group_name
    });

  } catch (error) {
    console.error('Error creating group:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET all groups
router.get('/groups', verifyToken, async (req, res) => {
  try {
    const [groups] = await pool.query(
        'SELECT g.id, g.group_name, g.description, g.created_by, g.created_at, COUNT(gm.id) as member_count FROM student_groups g LEFT JOIN group_members gm ON g.id = gm.group_id GROUP BY g.id ORDER BY g.created_at DESC'
    );

    res.status(200).json({
      message: 'Groups retrieved',
      groups: groups
    });

  } catch (error) {
    console.error('Error fetching groups:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// JOIN a group
router.post('/groups/:group_id/join', verifyToken, async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { group_id } = req.params;

    // Check if already member
    const [existing] = await pool.query(
      'SELECT id FROM group_members WHERE group_id = ? AND student_id = ?',
      [group_id, userId]
    );

    if (existing.length > 0) {
      return res.status(409).json({ error: 'Already a member of this group' });
    }

    await pool.query(
      'INSERT INTO group_members (group_id, student_id, joined_date) VALUES (?, ?, NOW())',
      [group_id, userId]
    );

    res.status(201).json({
      message: 'Joined group successfully',
      group_id: group_id
    });

  } catch (error) {
    console.error('Error joining group:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// CREATE an event
router.post('/events/create', verifyToken, async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { group_id, event_name, description, event_date, location } = req.body;

    if (!group_id || !event_name || !event_date) {
      return res.status(400).json({ error: 'group_id, event_name, event_date required' });
    }

    const [result] = await pool.query(
      'INSERT INTO events (group_id, event_name, description, event_date, location, created_by, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())',
      [group_id, event_name, description || null, event_date, location || null, userId]
    );

    res.status(201).json({
      message: 'Event created successfully',
      event_id: result.insertId,
      event_name: event_name
    });

  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET all events
router.get('/events', verifyToken, async (req, res) => {
  try {
    const [events] = await pool.query(
      'SELECT e.id, e.event_name, e.description, e.event_date, e.location, g.group_name, COUNT(ea.id) as attendee_count FROM events e LEFT JOIN student_groups g ON e.group_id = g.id LEFT JOIN event_attendees ea ON e.id = ea.event_id GROUP BY e.id ORDER BY e.event_date ASC'
    );
    res.status(200).json({
      message: 'Events retrieved',
      events: events
    });

  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// REGISTER for an event
router.post('/events/:event_id/attend', verifyToken, async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { event_id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: 'status required (attending/interested/not_attending)' });
    }

    // Check if already registered
    const [existing] = await pool.query(
      'SELECT id FROM event_attendees WHERE event_id = ? AND student_id = ?',
      [event_id, userId]
    );

    if (existing.length > 0) {
      return res.status(409).json({ error: 'Already registered for this event' });
    }

    await pool.query(
      'INSERT INTO event_attendees (event_id, student_id, status) VALUES (?, ?, ?)',
      [event_id, userId, status]
    );

    res.status(201).json({
      message: 'Registered for event',
      event_id: event_id,
      status: status
    });

  } catch (error) {
    console.error('Error registering for event:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// CONNECT with another student
router.post('/connect/:user_id', verifyToken, async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { user_id } = req.params;

    if (userId === parseInt(user_id)) {
      return res.status(400).json({ error: 'Cannot connect with yourself' });
    }

    // Check if connection already exists
    const [existing] = await pool.query(
      'SELECT id FROM connections WHERE (user1_id = ? AND user2_id = ?) OR (user1_id = ? AND user2_id = ?)',
      [userId, user_id, user_id, userId]
    );

    if (existing.length > 0) {
      return res.status(409).json({ error: 'Connection already exists' });
    }

    await pool.query(
      'INSERT INTO connections (user1_id, user2_id, connection_status, connection_date) VALUES (?, ?, ?, NOW())',
      [userId, user_id, 'pending']
    );

    res.status(201).json({
      message: 'Connection request sent',
      connected_with: user_id
    });

  } catch (error) {
    console.error('Error creating connection:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET my connections
router.get('/my-connections', verifyToken, async (req, res) => {
  try {
    const userId = req.user.user_id;

    const [connections] = await pool.query(
      `SELECT c.id, 
       CASE 
         WHEN c.user1_id = ? THEN c.user2_id 
         ELSE c.user1_id 
       END as connected_user_id,
       up.first_name, up.last_name, up.college, c.connection_status, c.connection_date
       FROM connections c
       INNER JOIN user_profiles up ON (
         (c.user1_id = ? AND up.user_id = c.user2_id) OR 
         (c.user2_id = ? AND up.user_id = c.user1_id)
       )
       WHERE (c.user1_id = ? OR c.user2_id = ?) AND c.connection_status = 'accepted'
       ORDER BY c.connection_date DESC`,
      [userId, userId, userId, userId, userId]
    );

    res.status(200).json({
      message: 'Connections retrieved',
      connections: connections
    });

  } catch (error) {
    console.error('Error fetching connections:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET my groups
router.get('/my-groups', verifyToken, async (req, res) => {
  try {
    const userId = req.user.user_id;

    const [groups] = await pool.query(
      'SELECT g.id, g.group_name, g.description, g.created_by, COUNT(gm.id) as member_count FROM student_groups g INNER JOIN group_members gm ON g.id = gm.group_id WHERE gm.student_id = ? GROUP BY g.id',
      [userId]
    );

    res.status(200).json({
      message: 'My groups retrieved',
      groups: groups
    });

  } catch (error) {
    console.error('Error fetching my groups:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
