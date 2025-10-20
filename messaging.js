const express = require('express');
const router = express.Router();
const pool = require('./db');
const { verifyToken } = require('./middleware');

// SEND a message
router.post('/send', verifyToken, async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { recipient_id, content } = req.body;

    if (!recipient_id || !content) {
      return res.status(400).json({ error: 'recipient_id and content required' });
    }

    if (userId === parseInt(recipient_id)) {
      return res.status(400).json({ error: 'Cannot message yourself' });
    }

    const [result] = await pool.query(
      'INSERT INTO messages (sender_id, recipient_id, content, is_read, created_at) VALUES (?, ?, ?, ?, NOW())',
      [userId, recipient_id, content, false]
    );

    res.status(201).json({
      message: 'Message sent',
      message_id: result.insertId,
      recipient_id: recipient_id
    });

  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET all conversations
router.get('/conversations', verifyToken, async (req, res) => {
  try {
    const userId = req.user.user_id;

    const [conversations] = await pool.query(
      `SELECT 
       CASE 
         WHEN sender_id = ? THEN recipient_id 
         ELSE sender_id 
       END as user_id,
       up.first_name, up.last_name, up.college,
       m.created_at as last_message_time
       FROM messages m
       INNER JOIN user_profiles up ON (
         (m.sender_id = ? AND up.user_id = m.recipient_id) OR 
         (m.recipient_id = ? AND up.user_id = m.sender_id)
       )
       WHERE m.sender_id = ? OR m.recipient_id = ?
       ORDER BY m.created_at DESC
       LIMIT 50`,
      [userId, userId, userId, userId, userId]
    );

    res.status(200).json({
      message: 'Conversations retrieved',
      conversations: conversations
    });

  } catch (error) {
    console.error('Error fetching conversations:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET chat history with specific user
router.get('/messages/:user_id', verifyToken, async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { user_id } = req.params;

    const [messages] = await pool.query(
      `SELECT id, sender_id, recipient_id, content, is_read, created_at 
       FROM messages 
       WHERE (sender_id = ? AND recipient_id = ?) OR (sender_id = ? AND recipient_id = ?)
       ORDER BY created_at ASC`,
      [userId, user_id, user_id, userId]
    );

    res.status(200).json({
      message: 'Messages retrieved',
      messages: messages
    });

  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// MARK message as read
router.patch('/read/:message_id', verifyToken, async (req, res) => {
  try {
    const { message_id } = req.params;

    const [result] = await pool.query(
      'UPDATE messages SET is_read = 1 WHERE id = ?',
      [message_id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Message not found' });
    }

    res.status(200).json({
      message: 'Message marked as read',
      message_id: message_id
    });

  } catch (error) {
    console.error('Error marking message read:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST announcement
router.post('/announcements/create', verifyToken, async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { title, content, target_audience } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: 'title and content required' });
    }

    const [result] = await pool.query(
      'INSERT INTO announcements (sender_id, title, content, target_audience, created_at) VALUES (?, ?, ?, ?, NOW())',
      [userId, title, content, target_audience || 'all']
    );

    res.status(201).json({
      message: 'Announcement posted',
      announcement_id: result.insertId,
      title: title
    });

  } catch (error) {
    console.error('Error creating announcement:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET announcements
router.get('/announcements', verifyToken, async (req, res) => {
  try {
    const [announcements] = await pool.query(
      `SELECT a.id, a.title, a.content, a.target_audience, a.created_at, 
       up.first_name, up.last_name 
       FROM announcements a 
       INNER JOIN user_profiles up ON a.sender_id = up.user_id 
       ORDER BY a.created_at DESC LIMIT 50`
    );

    res.status(200).json({
      message: 'Announcements retrieved',
      announcements: announcements
    });

  } catch (error) {
    console.error('Error fetching announcements:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET notifications
router.get('/notifications', verifyToken, async (req, res) => {
  try {
    const userId = req.user.user_id;

    const [notifications] = await pool.query(
      'SELECT id, type, message, related_id, is_read, created_at FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 50',
      [userId]
    );

    res.status(200).json({
      message: 'Notifications retrieved',
      notifications: notifications
    });

  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// MARK notification as read
router.patch('/notifications/:notification_id/read', verifyToken, async (req, res) => {
  try {
    const { notification_id } = req.params;

    const [result] = await pool.query(
      'UPDATE notifications SET is_read = 1 WHERE id = ?',
      [notification_id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    res.status(200).json({
      message: 'Notification marked as read',
      notification_id: notification_id
    });

  } catch (error) {
    console.error('Error marking notification read:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;