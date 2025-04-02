import React from "react";

const LoansOverview = ({ activeLoansCount, totalOutstanding }) => {
  return (
    <div className="bg-white shadow rounded-lg p-6 mb-6">
      <h2 className="text-lg font-semibold mb-4">Active Loans Overview</h2>
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div className="bg-gray-50 p-4 rounded-md">
          <p className="text-sm text-gray-600">Total Outstanding</p>
          <p className="text-2xl font-bold text-indigo-600">
            ${totalOutstanding.toLocaleString()}
          </p>
        </div>
        <div className="bg-gray-50 p-4 rounded-md">
          <p className="text-sm text-gray-600">Active Loans</p>
          <p className="text-2xl font-bold text-indigo-600">
            {activeLoansCount}
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoansOverview;