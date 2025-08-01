// backend/models/init.js
const db = require('../db');

db.serialize(() => {
  // Customers table
  db.run(`
    CREATE TABLE IF NOT EXISTS Customers (
      customer_id TEXT PRIMARY KEY,
      name TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Loans table
  db.run(`
    CREATE TABLE IF NOT EXISTS Loans (
      loan_id TEXT PRIMARY KEY,
      customer_id TEXT,
      principal_amount REAL,
      total_amount REAL,
      interest_rate REAL,
      loan_period_years INTEGER,
      monthly_emi REAL,
      status TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (customer_id) REFERENCES Customers(customer_id)
    )
  `);

  // Payments table
  db.run(`
    CREATE TABLE IF NOT EXISTS Payments (
      payment_id TEXT PRIMARY KEY,
      loan_id TEXT,
      amount REAL,
      payment_type TEXT,
      payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (loan_id) REFERENCES Loans(loan_id)
    )
  `);

  console.log("Database tables created.");
});
