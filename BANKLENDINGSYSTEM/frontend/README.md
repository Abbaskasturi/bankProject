
# Bank Lending System - Backend

This project is a simple backend system for a bank lending service, developed as part of the AGETWARE hiring process. It provides RESTful API endpoints to manage loans, process payments, and view account details.

## Features

  * **LEND**: Create a new loan for a customer with a specified principal, interest rate, and term.
  * **PAYMENT**: Record EMI or lump-sum payments against an existing loan.
  * **LEDGER**: View the complete transaction history and current balance for a specific loan.
  * **ACCOUNT OVERVIEW**: Get a summary of all loans associated with a customer.

## Technology Stack

  * **Runtime Environment**: Node.js
  * **Framework**: Express.js
  * **Database**: SQLite
  * **Dependencies**: `cors` for cross-origin requests, `uuid` for generating unique IDs.

## Prerequisites

Before you begin, ensure you have the following installed on your system:

  * [Node.js](https://nodejs.org/) (v18.x or later recommended)
  * npm (usually comes with Node.js)

## Installation and Setup

Follow these steps to get the project running on your local machine.

1.  **Clone the repository:**

    ```bash
    git clone [your-github-repository-url]
    ```

2.  **Navigate to the backend directory:**

    ```bash
    cd backend
    ```

3.  **Install the dependencies:**

    ```bash
    npm install
    ```

4.  **Run the server:**

    ```bash
    npm start
    ```

The server will start on `http://localhost:3001`. A `bank.db` file will be automatically created in the directory to store the data.

## API Endpoints

The base URL for all endpoints is `/api/v1`.

-----

### 1\. Create a New Loan (LEND)

Creates a new loan, calculates the total amount payable and the monthly EMI.

  * **Method:** `POST`
  * **URL:** `/loans`
  * **Request Body:**
    ```json
    {
      "customer_id": "string",
      "loan_amount": "number",
      "loan_period_years": "number",
      "interest_rate_yearly": "number"
    }
    ```
  * **Success Response (201 Created):**
    ```json
    {
      "loan_id": "unique_loan_identifier",
      "customer_id": "string",
      "total_amount_payable": "number",
      "monthly_emi": "number"
    }
    ```

-----

### 2\. Record a Payment

Records a payment against a specific loan.

  * **Method:** `POST`
  * **URL:** `/loans/{loan_id}/payments`
  * **Request Body:**
    ```json
    {
      "amount": "number",
      "payment_type": "EMI"
    }
    ```
  * **Success Response (200 OK):**
    ```json
    {
      "payment_id": "unique_payment_identifier",
      "loan_id": "string",
      "message": "Payment recorded successfully.",
      "remaining_balance": "number",
      "emis_left": "number"
    }
    ```

-----

### 3\. View Loan Ledger

Retrieves the complete transaction history and current status of a loan.

  * **Method:** `GET`
  * **URL:** `/loans/{loan_id}/ledger`
  * **Success Response (200 OK):**
    ```json
    {
      "loan_id": "string",
      "customer_id": "string",
      "principal": "number",
      "total_amount": "number",
      "monthly_emi": "number",
      "amount_paid": "number",
      "balance_amount": "number",
      "emis_left": "number",
      "transactions": [
        {
          "transaction_id": "string",
          "date": "timestamp",
          "amount": "number",
          "type": "string"
        }
      ]
    }
    ```

-----

### 4\. View Customer Account Overview

Provides a summary of all loans associated with a specific customer.

  * **Method:** `GET`
  * **URL:** `/customers/{customer_id}/overview`
  * **Success Response (200 OK):**
    ```json
    {
      "customer_id": "string",
      "total_loans": "number",
      "loans": [
        {
          "loan_id": "string",
          "principal": "number",
          "total_amount": "number",
          "total_interest": "number",
          "emi_amount": "number",
          "amount_paid": "number",
          "emis_left": "number"
        }
      ]
    }
    ```

## Design Decisions

  * **Database**: SQLite was chosen for its simplicity and file-based nature, making the project self-contained and easy to set up without needing a separate database server.
  * **Interest Calculation**: The system uses Simple Interest (`I = P * N * R`) as specified in the assignment requirements.
  * **Stateless API**: The API is stateless; each request contains all the information needed to process it, which is a core principle of REST.

## Author

  * Abbas 