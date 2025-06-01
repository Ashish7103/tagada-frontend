import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import PaymentCalendar from "./PaymentCalendar";
import { XMarkIcon } from "@heroicons/react/20/solid";

const API_BASE_URL = "https://tagada.onrender.com";

const LoanTable = () => {
  const [profile, setProfile] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [loanDetails, setLoanDetails] = useState(null);
  const [areas, setAreas] = useState([]);
  const [selectedArea, setSelectedArea] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingAreas, setLoadingAreas] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/profile/user`, {
          withCredentials: true,
        });
        setProfile(response.data.user);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to fetch profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    const fetchAreas = async () => {
      if (!profile || !profile.uid) {
        console.log("moneyLenderId not available, skipping fetchAreas");
        return;
      }
      try {
        console.log(`Fetching areas for moneyLenderId: ${profile.uid}`);
        const response = await axios.get(
          `${API_BASE_URL}/moneylender/get-areas/${profile.uid}`
        );
        if (response.data && Array.isArray(response.data.areas)) {
          setAreas(response.data.areas);
        } else {
          setError("Invalid API response: areas not found");
        }
      } catch (err) {
        setError("Failed to fetch areas: " + err.message);
      } finally {
        setLoadingAreas(false);
      }
    };
    if (profile && profile.uid) {
      fetchAreas();
    }
  }, [profile]);

  const fetchCustomers = async () => {
    if (!profile || !profile.uid) return;
    try {
      const response = await axios.get(
        `${API_BASE_URL}/moneylender/getallissuedLoan`
      );
      let filteredCustomers = response.data.customers.filter(
        (customer) => customer.MoneyLenderId === profile.uid
      );
      if (selectedArea) {
        filteredCustomers = filteredCustomers.filter(
          (customer) => customer.Area.toLowerCase() === selectedArea.toLowerCase()
        );
      }
      setCustomers(filteredCustomers || []);
    } catch (err) {
      setError("Failed to fetch loans");
    }
  };

  useEffect(() => {
    if (profile) fetchCustomers();
  }, [profile, selectedArea]);

  const totals = customers.reduce(
    (acc, c) => ({
      totalLoans: acc.totalLoans + 1,
      totalAmount: acc.totalAmount + (c.Loan_Amt || 0),
      totalPaid: acc.totalPaid + (c.paid || 0),
      totalUnpaid: acc.totalUnpaid + (c.unpaid || 0),
    }),
    { totalLoans: 0, totalAmount: 0, totalPaid: 0, totalUnpaid: 0 }
  );

  const showLoanDetails = (loan) => {
    setLoanDetails({
      id: loan.LoanId,
      uid: loan.Cus_Id,
      borrowerName: loan.Cus_Name,
      nickname: loan.nickname || "N/A",
      mobile: loan.Mobile_No,
      area: loan.Area,
      loanAmount: `₹${loan.Loan_Amt}`,
      paid: `₹${loan.paid}`,
      due: `₹${loan.unpaid}`,
      installment: loan.PPD,
      startDate: new Date(loan.start_date).toLocaleDateString(),
      endDate: new Date(loan.completion_date).toLocaleDateString(),
      status: loan.Status || "Active",
      calendar: <PaymentCalendar loanId={loan.LoanId} cusId={loan.Cus_Id} ppd={loan.PPD} />,
    });
  };

  const closeLoanDetails = () => {
    setLoanDetails(null);
  };

  if (loading || loadingAreas) return <div className="p-8 text-gray-600">Loading data...</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar profile={profile || {}} />
      <main className="mt-14 px-4 py-6">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="text-sm text-gray-500 mb-1">Total Loans</div>
            <div className="text-2xl font-semibold">{totals.totalLoans}</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="text-sm text-gray-500 mb-1">Total Amount</div>
            <div className="text-2xl font-semibold">₹{totals.totalAmount}</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="text-sm text-gray-500 mb-1">Last Payment</div>
            <div className="text-2xl font-semibold text-green-500">
              ₹{totals.totalPaid}
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="text-sm text-gray-500 mb-1">Due Amount</div>
            <div className="text-2xl font-semibold text-amber-500">
              ₹{totals.totalUnpaid}
            </div>
          </div>
        </div>

        <div className="mb-6">
          <label htmlFor="area-filter" className="block text-sm font-medium text-gray-700 mb-2">
            Filter by Area
          </label>
          <select
            id="area-filter"
            value={selectedArea}
            onChange={(e) => setSelectedArea(e.target.value)}
            className="block w-full max-w-xs rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="">All Areas</option>
            {areas.map((area) => (
              <option key={area} value={area}>
                {area}
              </option>
            ))}
          </select>
        </div>

        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="p-4 border-b">
            <h2 className="font-semibold">Active Loans</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">UID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nickname</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Loan Amount</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Due</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {customers.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-4 py-3 text-sm text-center">
                      No active loans found.
                    </td>
                  </tr>
                ) : (
                  customers.map((customer) => (
                    <tr key={customer.LoanId}>
                      <td className="px-4 py-3 text-sm">{customer.Cus_Id}</td>
                      <td className="px-4 py-3 text-sm">{customer.nickname || null}</td>
                      <td className="px-4 py-3 text-sm">{customer.Cus_Name}</td>
                      <td className="px-4 py-3 text-sm">₹{customer.Loan_Amt}</td>
                      <td className="px-4 py-3 text-sm">₹{customer.unpaid}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            customer.Status === "Pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {customer.Status || "Active"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          className="px-3 py-1.5 text-sm text-white bg-black rounded hover:bg-black/90"
                          onClick={() => showLoanDetails(customer)}
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-4 border-b">
            <h2 className="font-semibold">Recent Transactions</h2>
          </div>
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Loan Payment</p>
                <p className="text-sm text-gray-500">Today, 2:30 PM</p>
              </div>
              <span className="text-green-500 font-medium">+₹245.00</span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Processing Fee</p>
                <p className="text-sm text-gray-500">Yesterday, 4:15 PM</p>
              </div>
              <span className="text-red-500 font-medium">-₹4.50</span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Late Payment Fee</p>
                <p className="text-sm text-gray-500">23 Jan, 11:30 AM</p>
              </div>
              <span className="text-red-500 font-medium">-₹65.50</span>
            </div>
          </div>
        </div>

        {loanDetails && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Loan Details</h3>
                <button
                  onClick={closeLoanDetails}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-500">Loan ID</p>
                  <p className="font-medium">#{loanDetails.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Customer UID</p>
                  <p className="font-medium">{loanDetails.uid}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Nickname</p>
                  <p className="font-medium">{loanDetails.nickname}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Borrower Name</p>
                  <p className="font-medium">{loanDetails.borrowerName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Mobile</p>
                  <p className="font-medium">{loanDetails.mobile}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Area</p>
                  <p className="font-medium">{loanDetails.area}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Loan Amount</p>
                  <p className="font-medium">{loanDetails.loanAmount}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Paid</p>
                  <p className="font-medium">{loanDetails.paid}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Due</p>
                  <p className="font-medium">{loanDetails.due}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Installment (PPD)</p>
                  <p className="font-medium">{loanDetails.installment}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Start Date</p>
                  <p className="font-medium">{loanDetails.startDate}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">End Date</p>
                  <p className="font-medium">{loanDetails.endDate}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <p className="font-medium">{loanDetails.status}</p>
                </div>
              </div>
              <div className="mb-4">
                <h4 className="font-medium mb-2">Payment Schedule</h4>
                <div className="bg-gray-50 p-4 rounded">
                  {loanDetails.calendar}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default LoanTable;