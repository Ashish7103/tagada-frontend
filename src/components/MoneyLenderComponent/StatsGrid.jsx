import React from "react";
import StatCard from "./StatCard";

const StatsGrid = ({ customers }) => {
  const totals = customers.reduce(
    (acc, c) => ({
      totalLoans: acc.totalLoans + 1,
      totalAmount: acc.totalAmount + c.Loan_Amt,
      totalPaid: acc.totalPaid + c.paid,
      totalUnpaid: acc.totalUnpaid + c.unpaid,
    }),
    { totalLoans: 0, totalAmount: 0, totalPaid: 0, totalUnpaid: 0 }
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <StatCard title="Total Loans" value={totals.totalLoans} icon="📈" />
      <StatCard title="Total Amount" value={`₹${totals.totalAmount}`} icon="💰" />
      <StatCard title="Amount Paid" value={`₹${totals.totalPaid}`} icon="✅" />
      <StatCard title="Amount Due" value={`₹${totals.totalUnpaid}`} icon="⚠️" />
    </div>
  );
};

export default StatsGrid;