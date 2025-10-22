const express = require('express');
const router = express.Router();
const pool = require('./db');
const { verifyToken } = require('./middleware');

// GET personal dashboard
router.get('/', verifyToken, async (req, res) => {
  try {
    const userId = req.user.user_id;

    // Get user info
    const [user] = await pool.query(
      'SELECT u.email, up.first_name, up.last_name, up.college FROM users u LEFT JOIN user_profiles up ON u.id = up.user_id WHERE u.id = ?',
      [userId]
    );

    // Get enrolled courses count
    const [courses] = await pool.query(
      'SELECT COUNT(*) as total_courses FROM enrollments WHERE student_id = ?',
      [userId]
    );

    // Get GPA
    const [gpa] = await pool.query(
      'SELECT AVG(gpa) as average_gpa FROM grades WHERE student_id = ?',
      [userId]
    );

    // Get outstanding fees
    const [fees] = await pool.query(
      'SELECT SUM(amount) as outstanding_fees FROM fees WHERE student_id = ? AND status = ?',
      [userId, 'pending']
    );

    // Get upcoming assignments (next 7 days)
    const [upcomingAssignments] = await pool.query(
      `SELECT COUNT(*) as count FROM assignments a 
       INNER JOIN enrollments e ON a.course_id = e.course_id 
       WHERE e.student_id = ? AND a.due_date BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 7 DAY)`,
      [userId]
    );

    // Get unread messages
    const [unreadMessages] = await pool.query(
      'SELECT COUNT(*) as count FROM messages WHERE recipient_id = ? AND is_read = 0',
      [userId]
    );

    // Get active bookings
    const [activeBooking] = await pool.query(
      'SELECT COUNT(*) as count FROM room_bookings WHERE student_id = ? AND status = ?',
      [userId, 'active']
    );

    res.status(200).json({
      message: 'Dashboard data retrieved',
      dashboard: {
        user: user[0] || {},
        academics: {
          total_courses: courses[0].total_courses,
          average_gpa: gpa[0].average_gpa || 0
        },
        finances: {
          outstanding_fees: fees[0].outstanding_fees || 0
        },
        schedule: {
          upcoming_assignments: upcomingAssignments[0].count
        },
        communication: {
          unread_messages: unreadMessages[0].count
        },
        hostel: {
          active_bookings: activeBooking[0].count
        }
      }
    });

  } catch (error) {
    console.error('Error fetching dashboard:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET academic stats
router.get('/academic-stats', verifyToken, async (req, res) => {
  try {
    const userId = req.user.user_id;

    // Overall GPA
    const [overallGpa] = await pool.query(
      'SELECT AVG(gpa) as overall_gpa FROM grades WHERE student_id = ?',
      [userId]
    );

    // Grade distribution
    const [grades] = await pool.query(
      'SELECT c.course_name, g.assignment_grade, g.midterm_grade, g.final_grade, g.gpa FROM grades g INNER JOIN courses c ON g.course_id = c.id WHERE g.student_id = ? ORDER BY g.gpa DESC',
      [userId]
    );

    // Attendance percentage
    const [attendance] = await pool.query(
      `SELECT c.course_code, 
       SUM(CASE WHEN a.status = 'present' THEN 1 ELSE 0 END) as present_count,
       COUNT(*) as total_classes,
       ROUND(SUM(CASE WHEN a.status = 'present' THEN 1 ELSE 0 END) / COUNT(*) * 100, 2) as attendance_percent
       FROM attendance a
       INNER JOIN courses c ON a.course_id = c.id
       WHERE a.student_id = ?
       GROUP BY a.course_id`,
      [userId]
    );

    res.status(200).json({
      message: 'Academic stats retrieved',
      stats: {
        overall_gpa: overallGpa[0].overall_gpa || 0,
        grades: grades,
        attendance: attendance
      }
    });

  } catch (error) {
    console.error('Error fetching academic stats:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET financial stats
router.get('/financial-stats', verifyToken, async (req, res) => {
  try {
    const userId = req.user.user_id;

    // Fee summary
    const [feeSummary] = await pool.query(
      `SELECT 
       SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) as total_paid,
       SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) as total_pending,
       COUNT(CASE WHEN status = 'paid' THEN 1 END) as paid_count,
       COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_count
       FROM fees WHERE student_id = ?`,
      [userId]
    );

    // Scholarship info
    const [scholarships] = await pool.query(
      'SELECT SUM(amount) as total_scholarships FROM scholarships WHERE student_id = ?',
      [userId]
    );

    // Payment history
    const [paymentHistory] = await pool.query(
      'SELECT DATE(date) as payment_date, SUM(amount) as amount FROM payments WHERE student_id = ? GROUP BY DATE(date) ORDER BY payment_date DESC LIMIT 10',
      [userId]
    );

    res.status(200).json({
      message: 'Financial stats retrieved',
      stats: {
        fees: feeSummary[0],
        scholarships: scholarships[0],
        recent_payments: paymentHistory
      }
    });

  } catch (error) {
    console.error('Error fetching financial stats:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET calendar view (upcoming events)
router.get('/calendar-view', verifyToken, async (req, res) => {
  try {
    const userId = req.user.user_id;

    const [events] = await pool.query(
      `SELECT 'assignment' as type, a.title as name, a.due_date as date, c.course_code FROM assignments a 
       INNER JOIN enrollments e ON a.course_id = e.course_id 
       INNER JOIN courses c ON a.course_id = c.id 
       WHERE e.student_id = ? AND a.due_date >= CURDATE()
       UNION
       SELECT 'exam' as type, c.course_name as name, e.exam_date as date, c.course_code FROM exams e 
       INNER JOIN enrollments en ON e.course_id = en.course_id 
       INNER JOIN courses c ON e.course_id = c.id 
       WHERE en.student_id = ? AND e.exam_date >= CURDATE()
       UNION
       SELECT 'deadline' as type, d.title as name, d.due_date as date, '' as course_code FROM deadlines d 
       WHERE d.student_id = ? AND d.due_date >= CURDATE()
       ORDER BY date ASC`,
      [userId, userId, userId]
    );

    res.status(200).json({
      message: 'Calendar view retrieved',
      events: events
    });

  } catch (error) {
    console.error('Error fetching calendar view:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;