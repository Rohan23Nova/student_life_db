const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('./db');
const { verifyToken } = require('./middleware');

router.post('/signup', async (req, res) => {
  try {
    const { email, password, first_name, last_name, college, enrollment_year } = req.body;

    if (!email || !password || !first_name || !last_name) {
      return res.status(400).json({ 
        error: 'Missing required fields' 
      });
    }

    const [existingUser] = await pool.query(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existingUser.length > 0) {
      return res.status(409).json({ 
        error: 'Email already registered' 
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await pool.query(
      'INSERT INTO users (email, password_hash, created_at, updated_at) VALUES (?, ?, NOW(), NOW())',
      [email, hashedPassword]
    );

    const userId = result.insertId;

    await pool.query(
      'INSERT INTO user_profiles (user_id, first_name, last_name, college, enrollment_year) VALUES (?, ?, ?, ?, ?)',
      [userId, first_name, last_name, college || null, enrollment_year || null]
    );

    const token = jwt.sign(
      { user_id: userId, email: email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    res.status(201).json({
      message: 'Signup successful!',
      user_id: userId,
      email: email,
      token: token
    });

  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Email and password required' 
      });
    }

    const [users] = await pool.query(
      'SELECT id, email, password_hash FROM users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({ 
        error: 'Invalid email or password' 
      });
    }

    const user = users[0];
    const passwordMatch = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatch) {
      return res.status(401).json({ 
        error: 'Invalid email or password' 
      });
    }

    const token = jwt.sign(
      { user_id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    res.status(200).json({
      message: 'Login successful!',
      user_id: user.id,
      email: user.email,
      token: token
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/me', verifyToken, async (req, res) => {
  try {
    const userId = req.user.user_id;

    const [users] = await pool.query(
      'SELECT u.id, u.email, u.created_at, up.first_name, up.last_name, up.college FROM users u LEFT JOIN user_profiles up ON u.id = up.user_id WHERE u.id = ?',
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({
      message: 'User info retrieved',
      user: users[0]
    });

  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
