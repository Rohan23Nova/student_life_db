import React, { useState, useEffect } from 'react';
import { financeAPI } from '../services/api';
import '../styles/Finance.css';

function Finance() {
  const [fees, setFees] = useState(null);
  const [loading, setLoading] = useState(true);

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
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (!fees) return <div>No data</div>;

  return (
    <div className="finance-container">
      <h1>Finance</h1>
      
      <div className="finance-grid">
        <div className="finance-card">
          <h3>Total Fees</h3>
          <p className="amount">${fees.total_fees}</p>
        </div>

        <div className="finance-card">
          <h3>Paid Fees</h3>
          <p className="amount paid">${fees.paid_fees}</p>
        </div>

        <div className="finance-card">
          <h3>Outstanding</h3>
          <p className="amount pending">${fees.outstanding_fees}</p>
        </div>

        <div className="finance-card">
          <h3>Scholarships</h3>
          <p className="amount">${fees.total_scholarships}</p>
        </div>
      </div>
    </div>
  );
}

export default Finance;