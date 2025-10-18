const express = require('express');
const router = express.Router();
const pool = require('./db');
const { verifyToken } = require('./middleware');

// GET class schedule
router.get('/my-classes', verifyToken, async (req, res) => {
  try {
    const userId = req.user.user_id;

    const [classes] = await pool.query(
      'SELECT cs.id, c.course_code, c.course_name, cs.day_of_week, cs.start_time, cs.end_time, cs.room FROM class_schedule cs INNER JOIN enrollments e ON cs.course_id = e.course_id INNER JOIN courses c ON cs.course_id = c.id WHERE e.student_id = ? ORDER BY cs.day_of_week, cs.start_time',
      [userId]
    );

    res.status(200).json({
      message: 'Class schedule retrieved',
      classes: classes
    });

  } catch (error) {
    console.error('Error fetching classes:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET assignments
router.get('/assignments', verifyToken, async (req, res) => {
  try {
    const userId = req.user.user_id;

    const [assignments] = await pool.query(
      'SELECT a.id, c.course_code, c.course_name, a.title, a.description, a.due_date, a.submission_type FROM assignments a INNER JOIN enrollments e ON a.course_id = e.course_id INNER JOIN courses c ON a.course_id = c.id WHERE e.student_id = ? ORDER BY a.due_date ASC',
      [userId]
    );

    res.status(200).json({
      message: 'Assignments retrieved',
      assignments: assignments
    });

  } catch (error) {
    console.error('Error fetching assignments:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET exams
router.get('/exams', verifyToken, async (req, res) => {
  try {
    const userId = req.user.user_id;

    const [exams] = await pool.query(
      'SELECT e.id, c.course_code, c.course_name, e.exam_date, e.exam_time, e.location, e.duration FROM exams e INNER JOIN enrollments en ON e.course_id = en.course_id INNER JOIN courses c ON e.course_id = c.id WHERE en.student_id = ? ORDER BY e.exam_date ASC',
      [userId]
    );

    res.status(200).json({
      message: 'Exams retrieved',
      exams: exams
    });

  } catch (error) {
    console.error('Error fetching exams:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET upcoming events (next 7 days)
router.get('/upcoming', verifyToken, async (req, res) => {
  try {
    const userId = req.user.user_id;

    const [upcoming] = await pool.query(
      `SELECT 'assignment' as type, a.title as name, a.due_date as date, c.course_code FROM assignments a 
       INNER JOIN enrollments e ON a.course_id = e.course_id 
       INNER JOIN courses c ON a.course_id = c.id 
       WHERE e.student_id = ? AND a.due_date BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 7 DAY)
       UNION
       SELECT 'exam' as type, c.course_name as name, e.exam_date as date, c.course_code FROM exams e 
       INNER JOIN enrollments en ON e.course_id = en.course_id 
       INNER JOIN courses c ON e.course_id = c.id 
       WHERE en.student_id = ? AND e.exam_date BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 7 DAY)
       UNION
       SELECT 'deadline' as type, d.title as name, d.due_date as date, '' as course_code FROM deadlines d 
       WHERE d.student_id = ? AND d.due_date BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 7 DAY)
       ORDER BY date ASC`,
      [userId, userId, userId]
    );

    res.status(200).json({
      message: 'Upcoming events retrieved',
      upcoming: upcoming
    });

  } catch (error) {
    console.error('Error fetching upcoming events:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// CREATE custom deadline
router.post('/deadlines', verifyToken, async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { title, due_date, category, priority } = req.body;

    if (!title || !due_date) {
      return res.status(400).json({ error: 'title and due_date required' });
    }

    const [result] = await pool.query(
      'INSERT INTO deadlines (student_id, title, due_date, category, priority) VALUES (?, ?, ?, ?, ?)',
      [userId, title, due_date, category || null, priority || 'medium']
    );

    res.status(201).json({
      message: 'Deadline created',
      deadline_id: result.insertId,
      title: title,
      due_date: due_date
    });

  } catch (error) {
    console.error('Error creating deadline:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET my deadlines
router.get('/deadlines', verifyToken, async (req, res) => {
  try {
    const userId = req.user.user_id;

    const [deadlines] = await pool.query(
      'SELECT id, title, due_date, category, priority FROM deadlines WHERE student_id = ? ORDER BY due_date ASC',
      [userId]
    );

    res.status(200).json({
      message: 'Deadlines retrieved',
      deadlines: deadlines
    });

  } catch (error) {
    console.error('Error fetching deadlines:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
