import React from 'react';
import './PayslipDisplay.css'; // We'll create this CSS file next

interface PayslipDisplayProps {
  // Define props based on the data you want to display
  employeeName: string;
  payPeriod: string;
  grossPay: number;
  deductions: {
    label: string;
    amount: number;
  }[];
  netPay: number;
  // Add more props as needed for other payslip details
}

const PayslipDisplay: React.FC<PayslipDisplayProps> = ({
  employeeName,
  payPeriod,
  grossPay,
  deductions,
  netPay,
}) => {
  return (
    <div className="payslip-container">
      <div className="payslip-header">
        <h2>Payslip</h2>
      </div>
      <div className="payslip-section">
        <div className="payslip-row">
          <div className="payslip-label">Employee Name:</div>
          <div className="payslip-value">{employeeName}</div>
        </div>
        <div className="payslip-row">
          <div className="payslip-label">Pay Period:</div>
          <div className="payslip-value">{payPeriod}</div>
        </div>
      </div>

      <div className="payslip-section">
        <h3>Earnings</h3>
        <div className="payslip-row">
          <div className="payslip-label">Gross Pay:</div>
          <div className="payslip-value">{grossPay.toFixed(2)}</div>
        </div>
        {/* Add more earning rows if needed */}
      </div>

      <div className="payslip-section">
        <h3>Deductions</h3>
        {deductions.map((deduction, index) => (
          <div className="payslip-row" key={index}>
            <div className="payslip-label">{deduction.label}:</div>
            <div className="payslip-value">{deduction.amount.toFixed(2)}</div>
          </div>
        ))}
      </div>

      <div className="payslip-section payslip-summary">
        <div className="payslip-row">
          <div className="payslip-label">Net Pay:</div>
          <div className="payslip-value">{netPay.toFixed(2)}</div>
        </div>
      </div>

      {/* Add more sections as needed */}
    </div>
  );
};

export default PayslipDisplay;