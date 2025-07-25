// backend/routes/loans.js
const express = require('express');
const { v4: uuidv4 } = require('uuid');
const db = require('../db');
const router = express.Router();




// POST /api/v1/loans
// 1. Create loan
router.post('/', (req, res) => {
  const { customer_id, loan_amount, loan_period_years, interest_rate_yearly } = req.body;

  if (!customer_id || !loan_amount || !loan_period_years || !interest_rate_yearly) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  const interest = loan_amount * loan_period_years * (interest_rate_yearly / 100);
  const total_amount = loan_amount + interest;
  const monthly_emi = total_amount / (loan_period_years * 12);
  const loan_id = uuidv4();

  db.run(
    `INSERT INTO Loans (loan_id, customer_id, principal_amount, total_amount, interest_rate, loan_period_years, monthly_emi, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [loan_id, customer_id, loan_amount, total_amount, interest_rate_yearly, loan_period_years, monthly_emi, 'ACTIVE'],
    function (err) {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Database error' });
      }

      return res.status(201).json({
        loan_id,
        customer_id,
        total_amount_payable: total_amount,
        monthly_emi: monthly_emi
      });
    }
  );
});
// 2. Make a payment
router.post('/:loan_id/payments', (req, res) => {
  const { loan_id } = req.params;
  const { amount, payment_type } = req.body;

  if (!amount || !payment_type) {
    return res.status(400).json({ error: 'Missing payment amount or type.' });
  }

  db.get(`SELECT * FROM Loans WHERE loan_id = ?`, [loan_id], (err, loan) => {
    if (err || !loan) {
      return res.status(404).json({ error: 'Loan not found' });
    }

    const payment_id = uuidv4();

    // Insert payment into DB
    db.run(
      `INSERT INTO Payments (payment_id, loan_id, amount, payment_type) VALUES (?, ?, ?, ?)`,
      [payment_id, loan_id, amount, payment_type],
      function (err) {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Failed to insert payment.' });
        }

        // Get total payments made so far
        db.get(
          `SELECT SUM(amount) as total_paid FROM Payments WHERE loan_id = ?`,
          [loan_id],
          (err, row) => {
            const totalPaid = row.total_paid || 0;
            const balanceAmount = loan.total_amount - totalPaid;

            // Calculate EMIs left
            let emisLeft = Math.ceil(balanceAmount / loan.monthly_emi);
            if (balanceAmount <= 0) {
              emisLeft = 0;

              // Update loan status to paid off
              db.run(`UPDATE Loans SET status = 'PAID_OFF' WHERE loan_id = ?`, [loan_id]);
            }

            return res.status(200).json({
              payment_id,
              loan_id,
              message: "Payment recorded successfully.",
              remaining_balance: balanceAmount < 0 ? 0 : parseFloat(balanceAmount.toFixed(2)),
              emis_left: emisLeft
            });
          }
        );
      }
    );
  });
});
// GET /loans/:loan_id/ledger
// 3. View ledger


router.get('/:loan_id/ledger', (req, res) => {
  const { loan_id } = req.params;

  // 1. Fetch the loan record
  db.get(`SELECT * FROM Loans WHERE loan_id = ?`, [loan_id], (err, loan) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database error fetching loan.' });
    }
    if (!loan) {
      return res.status(404).json({ error: 'Loan not found' });
    }

    // 2. Extract values from loan record
    const { loan_period_years, monthly_emi: emiStored } = loan;
    // Use the EMI we already calculated at creation
    const monthly_emi = parseFloat(emiStored);
    const total_months = loan_period_years * 12;

    // 3. Build the ledger array
    const ledger = [];
    for (let i = 1; i <= total_months; i++) {
      ledger.push({
        month: i,
        emi_due: monthly_emi.toFixed(2),
        status: 'Pending'
      });
    }

    // 4. Send the response
    return res.json({
      loan_id,
      total_months,
      monthly_emi: monthly_emi.toFixed(2),
      ledger
    });
  });
});




module.exports = router;
