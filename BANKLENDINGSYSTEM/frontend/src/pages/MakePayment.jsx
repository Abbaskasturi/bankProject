import React, { useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from "../config";

const MakePayment = () => {
  const [loanId, setLoanId] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handlePayment = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const res = await axios.post(`${API_BASE_URL}/loans/${loanId}/pay`);
      setMessage(res.data.message);
    } catch (err) {
      setError(err?.response?.data?.error || 'Payment failed.');
    }
  };

  return (
    <div>
      <h2>Make EMI Payment</h2>
      <form onSubmit={handlePayment}>
        <input
          type="text"
          placeholder="Loan ID"
          value={loanId}
          onChange={(e) => setLoanId(e.target.value)}
          required
        />
        <button type="submit">Pay EMI</button>
      </form>

      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default MakePayment;
