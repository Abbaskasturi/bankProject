import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import LoanForm from './pages/LoanForm';
import MakePayment from './pages/MakePayment';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/create-loan" element={<LoanForm />} />
        <Route path="/pay-emi" element={<MakePayment />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
);
