// LoanHistory.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import LoanApproveRequestPopup from "./LoanApproveRequestPopup";
import NavbarLoanTaker from "./NavbarLoanTaker";
import LoansOverview from "./LoansOverview";

const API_BASE_URL = "https://tagada.onrender.com";

const LoanHistory = () => {
  const [profile, setProfile] = useState(null);
  const [loanHistory, setLoanHistory] = useState([]);
  const [loading, setLoading] = useState({
    profile: true,
    loans: true
  });
  const [error, setError] = useState(null);
  const [selectedLoan, setSelectedLoan] = useState(null);

  // Calculate loan statistics from actual data
  const activeLoans = loanHistory.filter(loan => loan.Status === "Active");
  const totalOutstanding = activeLoans.reduce(
    (sum, loan) => sum + parseFloat(loan.RemainingAmount || 0),
    0
  );

  // Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/profile/user`, {
          withCredentials: true,
        });
        setProfile(response.data.user);
        setLoading(prev => ({ ...prev, profile: false }));
      } catch (err) {
        setError(err.response?.data?.error || "Failed to fetch profile");
        setLoading(prev => ({ ...prev, profile: false }));
      }
    };

    fetchProfile();
  }, []);

  // Fetch loan history after profile is loaded
  useEffect(() => {
    if (!profile?.uid) return;

    const fetchLoanHistory = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/profile/loanHistory/customer/${profile.uid}`,
          { withCredentials: true }
        );
        setLoanHistory(response.data.loanHistory || []);
        setLoading(prev => ({ ...prev, loans: false }));
      } catch (err) {
        if (err.response?.status === 404) {
          setError("No loan history found for this user.");
        } else {
          setError(err.response?.data?.error || "Failed to fetch loan history");
        }
        setLoading(prev => ({ ...prev, loans: false }));
      }
    };

    fetchLoanHistory();
  }, [profile?.uid]);

  const isLoading = loading.profile || loading.loans;

  if (isLoading) return <div className="text-center py-4">Loading...</div>;
  if (error) return <div className="text-center py-4 text-gray-500">{error}</div>;
  if (!profile) return <div className="text-center py-4">No profile data available</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <NavbarLoanTaker profile={profile} />
      
      <main className="pt-16 px-4 sm:px-6 lg:px-8 pb-8">
        <LoansOverview 
          activeLoansCount={activeLoans.length}
          totalOutstanding={totalOutstanding}
        />
        
        <div className="bg-white shadow rounded-lg p-6 mt-6">
          <h2 className="text-lg font-semibold mb-4">Loan History</h2>
          <div className="overflow-x-auto">
            {loanHistory.length > 0 ? (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No.</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Loan Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Remaining</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {loanHistory.map((loan, index) => (
                    <tr key={loan.LoanId || index}>
                      <td className="px-6 py-4 whitespace-nowrap">{index + 1}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        ${parseFloat(loan.LoanAmount).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-md ${
                            loan.Status === "Active"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {loan.Status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        ${parseFloat(loan.RemainingAmount).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => setSelectedLoan(loan)}
                          className="rounded-button bg-indigo-600 text-white px-4 py-2 text-sm font-medium hover:bg-indigo-700 transition-colors"
                        >
                          Raise Request
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No loan history available
              </div>
            )}
          </div>
        </div>
      </main>

      {selectedLoan && (
        <LoanApproveRequestPopup
          loan={selectedLoan}
          uid={profile.uid}
          onClose={() => setSelectedLoan(null)}
        />
      )}
    </div>
  );
};

export default LoanHistory;