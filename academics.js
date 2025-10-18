const express = require('express');
const router = express.Router();
const pool = require('./db');
const { verifyToken } = require('./middleware');

// GET all available courses
router.get('/courses', verifyToken, async (req, res) => {
  try {
    const [courses] = await pool.query(
      'SELECT id, course_code, course_name, instructor_id, credits, semester FROM courses'
    );

    res.status(200).json({
      message: 'Courses retrieved',
      courses: courses
    });

  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ENROLL in a course
router.post('/enroll', verifyToken, async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { course_id } = req.body;

    if (!course_id) {
      return res.status(400).json({ error: 'course_id required' });
    }

    // Check if already enrolled
    const [existing] = await pool.query(
      'SELECT id FROM enrollments WHERE student_id = ? AND course_id = ?',
      [userId, course_id]
    );

    if (existing.length > 0) {
      return res.status(409).json({ error: 'Already enrolled in this course' });
    }

    // Enroll student
    await pool.query(
      'INSERT INTO enrollments (student_id, course_id, enrolled_date) VALUES (?, ?, NOW())',
      [userId, course_id]
    );

    res.status(201).json({
      message: 'Enrolled successfully',
      student_id: userId,
      course_id: course_id
    });

  } catch (error) {
    console.error('Enrollment error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET student's enrolled courses
router.get('/my-courses', verifyToken, async (req, res) => {
  try {
    const userId = req.user.user_id;

    const [courses] = await pool.query(
      'SELECT c.id, c.course_code, c.course_name, c.credits, c.semester FROM courses c INNER JOIN enrollments e ON c.id = e.course_id WHERE e.student_id = ?',
      [userId]
    );

    res.status(200).json({
      message: 'Your courses retrieved',
      courses: courses
    });

  } catch (error) {
    console.error('Error fetching my courses:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET student's grades
router.get('/grades', verifyToken, async (req, res) => {
  try {
    const userId = req.user.user_id;

    const [grades] = await pool.query(
      'SELECT g.id, c.course_code, c.course_name, g.assignment_grade, g.midterm_grade, g.final_grade, g.gpa FROM grades g INNER JOIN courses c ON g.course_id = c.id WHERE g.student_id = ?',
      [userId]
    );

    res.status(200).json({
      message: 'Your grades retrieved',
      grades: grades
    });

  } catch (error) {
    console.error('Error fetching grades:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET student's attendance
router.get('/attendance', verifyToken, async (req, res) => {
  try {
    const userId = req.user.user_id;

    const [attendance] = await pool.query(
      'SELECT a.id, c.course_code, c.course_name, a.class_date, a.status FROM attendance a INNER JOIN courses c ON a.course_id = c.id WHERE a.student_id = ? ORDER BY a.class_date DESC',
      [userId]
    );

    res.status(200).json({
      message: 'Your attendance retrieved',
      attendance: attendance
    });

  } catch (error) {
    console.error('Error fetching attendance:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// UPDATE grades (faculty only)
router.patch('/grades/:grade_id', verifyToken, async (req, res) => {
  try {
    const { grade_id } = req.params;
    const { assignment_grade, midterm_grade, final_grade, gpa } = req.body;

    const [result] = await pool.query(
      'UPDATE grades SET assignment_grade = ?, midterm_grade = ?, final_grade = ?, gpa = ? WHERE id = ?',
      [assignment_grade, midterm_grade, final_grade, gpa, grade_id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Grade record not found' });
    }

    res.status(200).json({
      message: 'Grade updated successfully',
      grade_id: grade_id
    });

  } catch (error) {
    console.error('Error updating grade:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
