import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '@fortawesome/fontawesome-free/css/all.min.css'; // Import Font Awesome CSS
import Navbar from './Navbar';
const API_BASE_URL ="https://tagada.onrender.com";
// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 
//   (import.meta.env.MODE === 'production' 
//     ? 'https://tagada.onrender.com' 
//     : 'localhost:5000');
const LoanDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/profile/user`, {
          withCredentials: true,
        });
        setProfile(response.data.user);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch profile');
      }
    };
    fetchProfile();
  }, []);

  // Fetch loan data dynamically once profile is available
  useEffect(() => {
    const fetchLoans = async () => {
      if (!profile || !profile.uid) return;
      try {
        const response = await axios.get(`${API_BASE_URL}/moneylender/getallissuedLoan`, {
          withCredentials: true,
          headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
        });
        const filteredLoans = response.data.customers.filter(
          (loan) => loan.MoneyLenderId === profile.uid
        );
        setLoans(filteredLoans || []);
      } catch (err) {
        setError('Failed to fetch loans');
      } finally {
        setLoading(false);
      }
    };
    fetchLoans();
  }, [profile]); // Dependency on profile ensures this runs after profile is fetched

  // Calculate totals dynamically
  const totals = loans.reduce(
    (acc, loan) => ({
      totalLoans: acc.totalLoans + 1,
      required: acc.required + (loan.Loan_Amt || 0),
      paid: acc.paid + (loan.paid || 0),
      active: acc.active + (loan.Status === 'Active' ? 1 : 0),
    }),
    { required: 0, paid: 0, totalLoans: 0, active: 0 }
  );

  // Get the 3 most recent active loans
  const recentLoans = loans
    .filter((loan) => loan.Status === 'Active')
    .sort((a, b) => new Date(b.start_date) - new Date(a.start_date))
    .slice(0, 3);

  if (loading) return <div className="p-4 text-gray-600">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="bg-gray-50 font-sans" style={{ width: '375px' }}>
      <Navbar />
      <main className=" min-w-screen pb-20 mt-20 align-items-center">
        {/* Header */}
        <header className="px-4 pt-6 pb-4 bg-white border-b border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-xl font-semibold text-gray-900">
              Welcome back, {profile?.name || 'User'}!
            </h1>
          </div>
          <p className="text-sm text-gray-600">March 20, 2025</p>
        </header>

        {/* Main Content */}
        <section className="p-4 space-y-4">
          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-4 bg-white rounded-lg shadow-sm">
              <p className="mb-1 text-xs font-medium text-gray-500">Required</p>
              <p className="text-lg font-semibold text-gray-900">₹{totals.required.toLocaleString()}</p>
            </div>
            <div className="p-4 bg-white rounded-lg shadow-sm">
              <p className="mb-1 text-xs font-medium text-gray-500">Paid</p>
              <p className="text-lg font-semibold text-green-600">₹{totals.paid.toLocaleString()}</p>
            </div>
            <div className="p-4 bg-white rounded-lg shadow-sm">
              <p className="mb-1 text-xs font-medium text-gray-500">Active</p>
              <p className="text-lg font-semibold text-blue-600">{totals.totalLoans.toLocaleString()}</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="p-4 bg-white rounded-lg shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-medium text-gray-900">Quick Actions</h2>
            </div>
            <div className="grid grid-cols-4 gap-4">
              <Link to="/add-loan" className="flex flex-col items-center justify-center p-3 text-gray-600 bg-gray-50 rounded-lg">
                <i className="mb-1 text-lg fas fa-plus"></i>
                <span className="text-xs">New Loan</span>
              </Link>
              <Link to="/overview" className="flex flex-col items-center justify-center p-3 text-gray-600 bg-gray-50 rounded-lg">
                <i className="mb-1 text-lg fas fa-chart-line"></i>
                <span className="text-xs">Overview</span>
              </Link>
              <Link to="/download" className="flex flex-col items-center justify-center p-3 text-gray-600 bg-gray-50 rounded-lg">
                <i className="mb-1 text-lg fas fa-download"></i>
                <span className="text-xs">Download</span>
              </Link>
              <Link to="/payment-trend" className="flex flex-col items-center justify-center p-3 text-gray-600 bg-gray-50 rounded-lg">
                <i className="mb-1 text-lg fas fa-chart-bar"></i>
                <span className="text-xs">Graph</span>
              </Link>
            </div>
          </div>

          {/* Recent Loans */}
          <div className="p-4 bg-white rounded-lg shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-medium text-gray-900">Recent Loans</h2>
              <Link to="/loans" className="text-sm text-blue-600">View All</Link>
            </div>
            <div className="space-y-4">
              {recentLoans.length === 0 ? (
                <p className="text-sm text-gray-500">No recent active loans.</p>
              ) : (
                recentLoans.map((loan) => (
                  <div
                    key={loan.LoanId}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900">{loan.Cus_Name}</p>
                      <p className="text-xs text-gray-500">
                        ₹{loan.Loan_Amt.toLocaleString()} •{' '}
                        {Math.ceil(
                          (new Date(loan.completion_date) - new Date(loan.start_date)) /
                            (1000 * 60 * 60 * 24 * 30)
                        )}{' '}
                        months
                      </p>
                    </div>
                    <span className="px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded">
                      Active
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default LoanDashboard;
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import Navbar from "./Navbar";
// import StatsGrid from "./StatsGrid";
// import LoanTable from "./LoanTable";
// import ChartsSection from "./ChartsSection";

// const LoanDashboard = () => {
//   const [customers, setCustomers] = useState([]);
//   const [profile, setProfile] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [isAddingNew, setIsAddingNew] = useState(false);
//   const [newCustomer, setNewCustomer] = useState({
//     Cus_Id: "",
//     Cus_Name: "",
//     Mobile_No: "",
//     Area: "",
//     Loan_Amt: "",
//     paid: "",
//     unpaid: "",
//     PPD: "",
//     start_date: "",
//     completion_date: "",
//   });

//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         const response = await axios.get("${API_BASE_URL}/profile/user", {
//           withCredentials: true,
//         });
//         setProfile(response.data.user);
//       } catch (err) {
//         setError(err.response?.data?.error || "Failed to fetch profile");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchProfile();
//   }, []);

//   const fetchCustomers = async () => {
//     if (!profile || !profile.uid) return;
//     try {
//       const response = await axios.get(
//         `${API_BASE_URL}/moneylender/getallissuedLoan`
//       );
//       const filteredCustomers = response.data.customers.filter(
//         (customer) => customer.MoneyLenderId === profile.uid
//       );
//       setCustomers(filteredCustomers || []);
//     } catch (err) {
//       setError("Failed to fetch customers");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (profile) fetchCustomers();
//   }, [profile]);

//   const handleNewCustomerChange = (field, value) => {
//     setNewCustomer((prev) => ({ ...prev, [field]: value }));
//   };

//   const handleAddNewCustomer = async () => {
//     try {
//       const response = await axios.post("${API_BASE_URL}/moneylender/add", {
//         ...newCustomer,
//         Cus_Id: parseInt(newCustomer.Cus_Id),
//         Loan_Amt: parseFloat(newCustomer.Loan_Amt),
//         paid: parseFloat(newCustomer.paid),
//         unpaid: parseFloat(newCustomer.unpaid),
//         PPD: parseInt(newCustomer.PPD),
//         UserId: profile.uid,
//         start_date: newCustomer.start_date,
//         completion_date: newCustomer.completion_date,
//       });
//       setCustomers((prev) => [...prev, response.data]);
//       setIsAddingNew(false);
//       setNewCustomer({
//         Cus_Id: "",
//         Cus_Name: "",
//         Mobile_No: "",
//         Area: "",
//         Loan_Amt: "",
//         paid: "",
//         unpaid: "",
//         PPD: "",
//         start_date: "",
//         completion_date: "",
//       });
//     } catch (err) {
//       setError("Failed to add new customer");
//     }
//   };

//   if (loading) return <div className="p-8 text-gray-600">Loading data...</div>;
//   if (error) return <div className="p-8 text-red-500">{error}</div>;

//   return (
//     <div className="flex flex-col min-h-screen bg-gray-50">
//       <Navbar  profile={profile || {}} />
//       <main className="flex-1 p-8">
//         <div className="max-w-8xl mx-auto space-y-8">
         
//         </div>
//       </main>
//     </div>
//   );
// };

// export default LoanDashboard;