import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "./Navbar"; // Assuming you have a Navbar component
import PaymentCalendar from "./PaymentCalendar"; // Assuming this component exists
import { XMarkIcon } from "@heroicons/react/20/solid"; // Import XMarkIcon for the close button

const API_BASE_URL ="https://tagada.onrender.com";
const LoanTable = () => {
  const [profile, setProfile] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [loanDetails, setLoanDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch profile data to get MoneyLenderId
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

  // Fetch loan data
  const fetchCustomers = async () => {
    if (!profile || !profile.uid) return;
    try {
      const response = await axios.get(
        `${API_BASE_URL}/moneylender/getallissuedLoan`
      );
      const filteredCustomers = response.data.customers.filter(
        (customer) => customer.MoneyLenderId === profile.uid
      );
      setCustomers(filteredCustomers || []);
    } catch (err) {
      setError("Failed to fetch loans");
    }
  };

  useEffect(() => {
    if (profile) fetchCustomers();
  }, [profile]);

  // Calculate stats for the grid
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

  if (loading) return <div className="p-8 text-gray-600">Loading data...</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar profile={profile || {}} />
      <main className="mt-14 px-4 py-6">
        {/* Stats Grid */}
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

        {/* Active Loans Table */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="p-4 border-b">
            <h2 className="font-semibold">Active Loans</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    UID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Loan Amount
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Due
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {customers.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-4 py-3 text-sm text-center">
                      No active loans found.
                    </td>
                  </tr>
                ) : (
                  customers.map((customer) => (
                    <tr key={customer.Loan_Id}>
                      <td className="px-4 py-3 text-sm">{customer.Cus_Id}</td>
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

        {/* Recent Transactions */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-4 border-b">
            <h2 className="font-semibold">Recent Transactions</h2>
          </div>
          <div className="p-4 space-y-4">
            {/* Mocked transactions; replace with actual data if available */}
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

        {/* Loan Details Modal */}
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




// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
// import PaymentCalendar from "./PaymentCalendar";

// const LoanTable = ({
//   customers,
//   isAddingNew,
//   newCustomer,
//   onNewCustomerChange,
//   onAddNewCustomer,
//   onCancel,
//   profile,
// }) => {
//   const [areas, setAreas] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchAreas = async () => {
//       try {
//         const response = await axios.get(
//           `http://localhost:5000/moneylender/get-areas/${profile.uid}`
//         );
//         setAreas(response.data.areas || []);
//       } catch (err) {
//         setError("Failed to fetch areas");
//       }
//     };
//     fetchAreas();
//   }, [profile.uid, isAddingNew]);

//   const filteredAreas = areas.filter((area) =>
//     area.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <div className="bg-white rounded-xl shadow-sm mb-7">
//       <div className="p-6">
//         <h3 className="text-lg font-semibold mb-4">Active Loans</h3>
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead>
//               <tr className="text-left text-sm text-gray-500 border-b">
//                 {[
//                   "ID",
//                   "Name",
//                   "Mobile",
//                   "Area",
//                   "Loan Amount",
//                   "Paid",
//                   "Due",
//                   "Installment",
//                   "Start Date",
//                   "End Date",
//                   "Calendar",
//                 ].map((th) => (
//                   <th key={th} className="pb-3 px-4">
//                     {th}
//                   </th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody>
//               {isAddingNew && (
//                 <tr className="border-b bg-blue-50">
//                   <td className="py-4 px-4">
//                     <input
//                       type="number"
//                       value={newCustomer.Cus_Id}
//                       onChange={(e) =>
//                         onNewCustomerChange("Cus_Id", e.target.value)
//                       }
//                       className="w-full p-1 border rounded"
//                       placeholder="Customer ID"
//                     />
//                   </td>
//                   <td className="py-4 px-4">
//                     <input
//                       type="text"
//                       value={newCustomer.Cus_Name}
//                       onChange={(e) =>
//                         onNewCustomerChange("Cus_Name", e.target.value)
//                       }
//                       className="w-full p-1 border rounded"
//                       placeholder="Name"
//                     />
//                   </td>
//                   <td className="py-4 px-4">
//                     <input
//                       type="text"
//                       value={newCustomer.Mobile_No}
//                       onChange={(e) =>
//                         onNewCustomerChange("Mobile_No", e.target.value)
//                       }
//                       className="w-full p-1 border rounded"
//                       placeholder="Mobile"
//                     />
//                   </td>
//                   <td className="py-4 px-4">
//                     <div className="relative">
//                       <input
//                         type="text"
//                         value={searchTerm}
//                         onChange={(e) => setSearchTerm(e.target.value)}
//                         className="w-full p-1 border rounded mb-1"
//                         placeholder="Search or select area..."
//                       />
//                       <select
//                         value={newCustomer.Area}
//                         onChange={(e) => {
//                           onNewCustomerChange("Area", e.target.value);
//                           setSearchTerm(e.target.value);
//                         }}
//                         className="w-full p-1 border rounded"
//                         required
//                       >
//                         <option value="" disabled>
//                           Select Area
//                         </option>
//                         {error ? (
//                           <option value="" disabled>
//                             {error}
//                           </option>
//                         ) : (
//                           filteredAreas.map((area, index) => (
//                             <option key={index} value={area}>
//                               {area}
//                             </option>
//                           ))
//                         )}
//                       </select>
//                     </div>
//                   </td>
//                   <td className="py-4 px-4">
//                     <input
//                       type="number"
//                       value={newCustomer.Loan_Amt}
//                       onChange={(e) =>
//                         onNewCustomerChange("Loan_Amt", e.target.value)
//                       }
//                       className="w-full p-1 border rounded"
//                       placeholder="Loan Amount"
//                     />
//                   </td>
//                   <td className="py-4 px-4">
//                     <input
//                       type="number"
//                       value={newCustomer.paid}
//                       onChange={(e) =>
//                         onNewCustomerChange("paid", e.target.value)
//                       }
//                       className="w-full p-1 border rounded"
//                       placeholder="Paid"
//                     />
//                   </td>
//                   <td className="py-4 px-4">
//                     <input
//                       type="number"
//                       value={newCustomer.unpaid}
//                       onChange={(e) =>
//                         onNewCustomerChange("unpaid", e.target.value)
//                       }
//                       className="w-full p-1 border rounded"
//                       placeholder="Unpaid"
//                     />
//                   </td>
//                   <td className="py-4 px-4">
//                     <input
//                       type="number"
//                       value={newCustomer.PPD}
//                       onChange={(e) =>
//                         onNewCustomerChange("PPD", e.target.value)
//                       }
//                       className="w-full p-1 border rounded"
//                       placeholder="PPD"
//                     />
//                   </td>
//                   <td className="py-4 px-4">
//                     <DatePicker
//                       selected={
//                         newCustomer.start_date
//                           ? new Date(newCustomer.start_date)
//                           : null
//                       }
//                       onChange={(date) =>
//                         onNewCustomerChange(
//                           "start_date",
//                           date.toLocaleDateString("en-CA")
//                         )
//                       }
//                       className="w-full p-1 border rounded"
//                       placeholderText="Start Date"
//                     />
//                   </td>
//                   <td className="py-4 px-4">
//                     <DatePicker
//                       selected={
//                         newCustomer.completion_date
//                           ? new Date(newCustomer.completion_date)
//                           : null
//                       }
//                       onChange={(date) =>
//                         onNewCustomerChange(
//                           "completion_date",
//                           date.toLocaleDateString("en-CA")
//                         )
//                       }
//                       className="w-full p-1 border rounded"
//                       placeholderText="End Date"
//                     />
//                   </td>
//                   <td className="py-4 px-4">
//                     <button
//                       onClick={onAddNewCustomer}
//                       className="bg-green-600 text-white px-3 py-1 rounded mr-2"
//                     >
//                       Post
//                     </button>
//                     <button
//                       onClick={onCancel}
//                       className="bg-red-600 text-white px-3 py-1 rounded"
//                     >
//                       Cancel
//                     </button>
//                   </td>
//                 </tr>
//               )}
//               {customers.length === 0 ? (
//                 <tr>
//                   <td colSpan="11" className="text-center py-8 text-gray-500">
//                     No loans found for this MoneyLenderId.
//                   </td>
//                 </tr>
//               ) : (
//                 customers.map((customer) => (
//                   <tr key={customer.Id} className="border-b hover:bg-gray-50">
//                     <td className="py-4 px-4">{customer.Cus_Id}</td>
//                     <td className="py-4 px-4">{customer.Cus_Name}</td>
//                     <td className="py-4 px-4">{customer.Mobile_No}</td>
//                     <td className="py-4 px-4">{customer.Area}</td>
//                     <td className="py-4 px-4">₹{customer.Loan_Amt}</td>
//                     <td className="py-4 px-4 text-green-600">
//                       ₹{customer.paid}
//                     </td>
//                     <td className="py-4 px-4 text-red-600">
//                       ₹{customer.unpaid}
//                     </td>
//                     <td className="py-4 px-4">{customer.PPD}</td>
//                     <td className="py-4 px-4">
//                       {new Date(customer.start_date).toLocaleDateString()}
//                     </td>
//                     <td className="py-4 px-4">
//                       {new Date(customer.completion_date).toLocaleDateString()}
//                     </td>
//                     <td className="py-4 px-4">
//                       <PaymentCalendar
//                         loanId={customer.LoanId}
//                         cusId={customer.Cus_Id}
//                         ppd={customer.PPD}
//                       />
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LoanTable;
