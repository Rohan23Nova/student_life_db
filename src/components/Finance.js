import React, { useState, useEffect } from 'react';
import { financeAPI } from '../services/api';
import Card from './ui/Card';
import Button from './ui/Button';
import Spinner from './ui/Spinner';
import Alert from './ui/Alert';
import '../styles/Finance.css';

function Finance() {
  const [fees, setFees] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Mock transaction data
  const transactions = [
    { id: 1, type: 'payment', description: 'Tuition Fee Payment', amount: -5000, date: '2025-10-15', status: 'completed' },
    { id: 2, type: 'scholarship', description: 'Merit Scholarship', amount: 2000, date: '2025-10-10', status: 'completed' },
    { id: 3, type: 'payment', description: 'Library Fee', amount: -200, date: '2025-10-05', status: 'completed' },
    { id: 4, type: 'refund', description: 'Lab Fee Refund', amount: 150, date: '2025-10-01', status: 'pending' }
  ];

  useEffect(() => {
    fetchFinance();
  }, []);

  const fetchFinance = async () => {
    try {
      const response = await financeAPI.getDashboard();
      setFees(response.data.dashboard);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching finance:', err);
      setError('Failed to load financial data');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="finance-loading">
        <Spinner size="lg" text="Loading financial data..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="finance-error">
        <Alert variant="error">{error}</Alert>
        <Button onClick={fetchFinance} variant="primary">Try Again</Button>
      </div>
    );
  }

  if (!fees) return <div>No data</div>;

  const paymentPercentage = ((fees.paid_fees / fees.total_fees) * 100).toFixed(0);

  return (
    <div className="finance-container">
      {/* Header */}
      <div className="finance-header">
        <div>
          <h1 className="finance-title">Finance Management</h1>
          <p className="finance-subtitle">Track your payments, fees, and scholarships</p>
        </div>
        <Button variant="primary">💳 Make Payment</Button>
      </div>

      {/* Financial Summary Cards */}
      <div className="finance-summary">
        <Card className="finance-card total">
  <div className="finance-card-content">
    <p className="finance-card-label">Total Fees</p>
    <h2 className="finance-card-value">${fees.total_fees?.toLocaleString()}</h2>
    <p className="finance-card-badge total-badge">Overall</p>
  </div>
</Card>

<Card className="finance-card paid">
  <div className="finance-card-content">
    <p className="finance-card-label">Paid</p>
    <h2 className="finance-card-value paid-amount">${fees.paid_fees?.toLocaleString()}</h2>
    <p className="finance-card-badge paid-badge">Completed</p>
  </div>
</Card>

<Card className="finance-card outstanding">
  <div className="finance-card-content">
    <p className="finance-card-label">Outstanding</p>
    <h2 className="finance-card-value outstanding-amount">${fees.outstanding_fees?.toLocaleString()}</h2>
    <p className="finance-card-badge outstanding-badge">Due</p>
  </div>
</Card>

<Card className="finance-card scholarship">
  <div className="finance-card-content">
    <p className="finance-card-label">Scholarships</p>
    <h2 className="finance-card-value scholarship-amount">${fees.total_scholarships?.toLocaleString()}</h2>
    <p className="finance-card-badge scholarship-badge">Received</p>
  </div>
</Card>
      </div>

      {/* Payment Progress */}
      <Card title="Payment Progress" subtitle={`${paymentPercentage}% of total fees paid`} className="progress-card">
        <div className="progress-bar-container">
          <div className="progress-bar" style={{ width: `${paymentPercentage}%` }}>
            <span className="progress-label">{paymentPercentage}%</span>
          </div>
        </div>
        <div className="progress-details">
          <div className="progress-item">
            <span className="progress-dot paid"></span>
            <span>Paid: ${fees.paid_fees?.toLocaleString()}</span>
          </div>
          <div className="progress-item">
            <span className="progress-dot outstanding"></span>
            <span>Outstanding: ${fees.outstanding_fees?.toLocaleString()}</span>
          </div>
        </div>
      </Card>

      {/* Recent Transactions */}
      <Card title="Recent Transactions" subtitle="Last 30 days" className="transactions-card">
        <div className="transactions-list">
          {transactions.map(transaction => (
            <div key={transaction.id} className="transaction-item">
              <div className={`transaction-icon ${transaction.type}`}>
                {transaction.type === 'payment' && '💸'}
                {transaction.type === 'scholarship' && '🎓'}
                {transaction.type === 'refund' && '💰'}
              </div>
              <div className="transaction-details">
                <h4 className="transaction-description">{transaction.description}</h4>
                <p className="transaction-date">{transaction.date}</p>
              </div>
              <div className="transaction-right">
                <p className={`transaction-amount ${transaction.amount > 0 ? 'positive' : 'negative'}`}>
                  {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toLocaleString()}
                </p>
                <span className={`transaction-status ${transaction.status}`}>
                  {transaction.status}
                </span>
              </div>
            </div>
          ))}
        </div>
        <div className="transactions-footer">
          <Button variant="ghost" fullWidth>View All Transactions →</Button>
        </div>
      </Card>
    </div>
  );
}

export default Finance;