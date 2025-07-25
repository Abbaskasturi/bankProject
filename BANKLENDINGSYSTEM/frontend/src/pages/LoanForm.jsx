import React, { useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from "../config";

const LoanForm = () => {
  const [form, setForm] = useState({
    customer_id: '',
    loan_amount: '',
    loan_period_years: '',
    interest_rate_yearly: '',
  });

  const [response, setResponse] = useState(null);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post(`${API_BASE_URL}/loans`, form);
      setResponse(res.data);
    } catch (err) {
      setError(err?.response?.data?.message || 'Error submitting loan.');
    }
  };

  return (
    <div>
      <h2>Create a New Loan</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="customer_id" placeholder="Customer ID" onChange={handleChange} required />
        <input type="number" name="loan_amount" placeholder="Loan Amount" onChange={handleChange} required />
        <input type="number" name="loan_period_years" placeholder="Loan Period (Years)" onChange={handleChange} required />
        <input type="number" name="interest_rate_yearly" placeholder="Interest Rate (%)" onChange={handleChange} required />
        <button type="submit">Submit</button>
      </form>

      {response && (
        <div>
          <h3>Loan Created</h3>
          <p>Loan ID: {response.loan_id}</p>
          <p>Total Payable: {response.total_amount_payable}</p>
          <p>Monthly EMI: {response.monthly_emi}</p>
        </div>
      )}

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default LoanForm;
