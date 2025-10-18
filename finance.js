const express = require('express');
const router = express.Router();
const pool = require('./db');
const { verifyToken } = require('./middleware');

// GET outstanding fees
router.get('/fees', verifyToken, async (req, res) => {
  try {
    const userId = req.user.user_id;

    const [fees] = await pool.query(
      'SELECT id, fee_type, amount, due_date, paid_date, status FROM fees WHERE student_id = ? ORDER BY due_date DESC',
      [userId]
    );

    res.status(200).json({
      message: 'Fees retrieved',
      fees: fees
    });

  } catch (error) {
    console.error('Error fetching fees:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// PAY a fee
router.post('/pay-fee', verifyToken, async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { fee_id, amount, payment_method } = req.body;

    if (!fee_id || !amount || !payment_method) {
      return res.status(400).json({ error: 'fee_id, amount, payment_method required' });
    }

    // Check if fee exists
    const [feeCheck] = await pool.query(
      'SELECT id, amount, status FROM fees WHERE id = ? AND student_id = ?',
      [fee_id, userId]
    );

    if (feeCheck.length === 0) {
      return res.status(404).json({ error: 'Fee not found' });
    }

    if (feeCheck[0].status === 'paid') {
      return res.status(400).json({ error: 'Fee already paid' });
    }

    if (parseFloat(amount) !== parseFloat(feeCheck[0].amount)) {
        return res.status(400).json({ error: 'Amount does not match fee amount' });
    }

    // Create payment record
    const [paymentResult] = await pool.query(
      'INSERT INTO payments (student_id, amount, payment_method, transaction_id, date) VALUES (?, ?, ?, ?, NOW())',
      [userId, amount, payment_method, 'TXN_' + Date.now()]
    );

    // Update fee status
    await pool.query(
      'UPDATE fees SET status = ?, paid_date = NOW() WHERE id = ?',
      ['paid', fee_id]
    );

    res.status(201).json({
      message: 'Payment successful',
      payment_id: paymentResult.insertId,
      fee_id: fee_id,
      amount: amount
    });

  } catch (error) {
    console.error('Payment error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET payment history
router.get('/payment-history', verifyToken, async (req, res) => {
  try {
    const userId = req.user.user_id;

    const [payments] = await pool.query(
      'SELECT id, amount, payment_method, transaction_id, date FROM payments WHERE student_id = ? ORDER BY date DESC',
      [userId]
    );

    res.status(200).json({
      message: 'Payment history retrieved',
      payments: payments
    });

  } catch (error) {
    console.error('Error fetching payment history:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET scholarships
router.get('/scholarships', verifyToken, async (req, res) => {
  try {
    const userId = req.user.user_id;

    const [scholarships] = await pool.query(
      'SELECT id, scholarship_name, amount, semester FROM scholarships WHERE student_id = ?',
      [userId]
    );

    res.status(200).json({
      message: 'Scholarships retrieved',
      scholarships: scholarships
    });

  } catch (error) {
    console.error('Error fetching scholarships:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET financial dashboard
router.get('/dashboard', verifyToken, async (req, res) => {
  try {
    const userId = req.user.user_id;

    // Total fees
    const [totalFeesResult] = await pool.query(
      'SELECT SUM(amount) as total_fees FROM fees WHERE student_id = ?',
      [userId]
    );

    // Paid fees
    const [paidFeesResult] = await pool.query(
      'SELECT SUM(amount) as paid_fees FROM fees WHERE student_id = ? AND status = ?',
      [userId, 'paid']
    );

    // Outstanding fees
    const [outstandingFeesResult] = await pool.query(
      'SELECT SUM(amount) as outstanding_fees FROM fees WHERE student_id = ? AND status = ?',
      [userId, 'pending']
    );

    // Total scholarships
    const [totalScholarshipsResult] = await pool.query(
      'SELECT SUM(amount) as total_scholarships FROM scholarships WHERE student_id = ?',
      [userId]
    );

    res.status(200).json({
      message: 'Financial dashboard retrieved',
      dashboard: {
        total_fees: totalFeesResult[0].total_fees || 0,
        paid_fees: paidFeesResult[0].paid_fees || 0,
        outstanding_fees: outstandingFeesResult[0].outstanding_fees || 0,
        total_scholarships: totalScholarshipsResult[0].total_scholarships || 0
      }
    });

  } catch (error) {
    console.error('Error fetching financial dashboard:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
