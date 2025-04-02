// import React, { useEffect, useRef, useState } from "react";
// import * as echarts from "echarts";
// import axios from "axios";
// import personalInformation from "./PersonalInformation";

// const Navbar = () => {
//   return (
//     <nav className="bg-white shadow">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between h-16">
//           <div className="flex">
//             <div className="flex-shrink-0 flex items-center">
//               <img
//                 className="h-8 w-auto"
//                 src="https://ai-public.creatie.ai/gen_page/logo_placeholder.png"
//                 alt="Logo"
//               />
//             </div>
//           </div>
//           <div className="flex items-center">
//             <div className="relative">
//               <input
//                 type="text"
//                 placeholder="Search by ID..."
//                 className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
//               />
//               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                 <i className="fas fa-search text-gray-400"></i>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </nav>
//   );
// };

// ///////////////////////////////////////////////////////////////////////////////
// // generate QR
// const QRCodeGenerator = () => {
//   const [qrCodeUrl, setQrCodeUrl] = useState('');

//   const generateQRCode = () => {
//     const data = Math.floor(100000 + Math.random() * 900000); // Generate a random 6-digit number
//     const url = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${data}`;
//     setQrCodeUrl(url);
//   };

//   return (
//     <div style={{ padding: '20px' }}>
//       <h2>QR Code Generator</h2>

//       {/* Button to generate QR Code */}
//       <button
//         onClick={generateQRCode}
//         style={{
//           backgroundColor: '#007bff',
//           color: 'white',
//           padding: '10px 20px',
//           fontSize: '16px',
//           border: 'none',
//           borderRadius: '5px',
//           cursor: 'pointer',
//           transition: 'background 0.3s ease',
//           marginTop: '10px',
//         }}
//         onMouseOver={(e) => (e.target.style.backgroundColor = '#0056b3')}
//         onMouseOut={(e) => (e.target.style.backgroundColor = '#007bff')}
//       >
//         Generate QR Code
//       </button>


//       {/* Display QR Code after clicking the button */}
//       {qrCodeUrl && (
//         <div style={{ marginTop: '20px' }}>
//           <h3>Generated QR Code:</h3>
//           <img src={qrCodeUrl} alt="QR Code" />
//         </div>
//       )}
//     </div>
//   );
// };

// const UserProfile = ({ user }) => {
//   return (
//     <div className="bg-white shadow rounded-lg p-6 mb-6">
//       <div className="flex items-center justify-between">
//         <div className="flex items-center">
//           <div>
//             <h1 className="text-2xl font-bold">{user.name}</h1>
//             <div className="flex items-center mt-1">
//               <span className="text-gray-600 mr-4">ID: #{user.uid}</span>
//               <span className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-green-100 text-green-800">
//                 <i className="fas fa-check-circle mr-2"></i>
//                 Highly Reliable
//               </span>
//             </div>
//           </div>
//         </div>
//         {/* <div className="flex space-x-4">
//           <button className="bg-green-100 text-green-800 px-4 py-2 rounded-md hover:bg-green-200">
//             <i className="fas fa-money-bill-wave mr-2"></i>
//             Issue New Loan
//           </button>
//         </div> */}
//         <QRCodeGenerator />
//       </div>
//     </div>
//   );
// };

// // Loan Approve request component

// const LoanApproverequestPopup = ({ loan, onClose, uid }) => {
//   const [amount, setAmount] = useState(loan.LoanAmount); // Default to the loan's amount
//   const [amountError, setAmountError] = useState("");
//   const [isSubmitting, setIsSubmitting] = useState(false); // To handle loading state during API call

//   const handleAmountChange = (e) => {
//     setAmount(e.target.value);
//     if (amountError) setAmountError("");
//   };

//   const handleCreateRequest = async () => {
//     if (!amount) {
//       setAmountError("Amount is required");
//       return;
//     }

//     // Prepare the payload for the POST request
//     const payload = {
//       LoanId: loan.LoanId, // Loan ID from the selected loan
//       Cus_Id: uid, // Customer ID from the user prop
//       Amount: parseFloat(amount), // Amount entered by the user
//     };

//     setIsSubmitting(true); // Start loading state

//     try {
//       // Send the POST request to the API
//       const response = await axios.post(
//         "http://localhost:5000/paymentRequest/payment/request",
//         payload,
//         {
//           withCredentials: true, // Include credentials if needed
//           headers: {
//             "Content-Type": "application/json", // Set the content type
//           },
//         }
//       );

//       // Handle successful response
//       console.log("Payment request created successfully:", response.data);
//       alert("Payment request created successfully!"); // Notify the user
//       onClose(); // Close the popup
//     } catch (error) {
//       // Handle errors
//       console.error("Failed to create payment request:", error);
//       alert(
//         error.response?.data?.error ||
//           "An error occurred while creating the payment request."
//       );
//     } finally {
//       setIsSubmitting(false); // End loading state
//     }
//   };

//   return (
//     <div
//       id="overlay"
//       className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
//       onClick={onClose} // Close the popup when clicking outside
//     >
//       <div
//         className="bg-white rounded-lg w-[480px] shadow-xl"
//         onClick={(e) => e.stopPropagation()} // Prevent clicks inside the popup from closing it
//       >
//         <div className="p-6 space-y-6">
//           <div className="flex items-center justify-between border-b border-gray-200 pb-4">
//             <h2 className="text-xl font-semibold text-gray-800">Loan Details</h2>
//             <button
//               onClick={onClose}
//               className="text-gray-400 hover:text-gray-600"
//             >
//               <i className="fas fa-times"></i>
//             </button>
//           </div>
//           <div className="space-y-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Loan ID</label>
//               <input
//                 type="text"
//                 value={loan.LoanId}
//                 className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none bg-gray-100"
//                 readOnly
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Customer ID</label>
//               <input
//                 type="text"
//                 value={uid}
//                 className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none bg-gray-100"
//                 readOnly
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
//               <input
//                 type="text"
//                 value={amount}
//                 onChange={handleAmountChange}
//                 className={`w-full border ${
//                   amountError ? "border-red-500" : "border-gray-300"
//                 } rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-custom focus:border-transparent`}
//                 required
//               />
//               {amountError && (
//                 <div className="text-red-500 text-sm mt-1">{amountError}</div>
//               )}
//             </div>
//           </div>
//           <div className="flex justify-between pt-4 border-t border-gray-200">
//             <button
//               onClick={handleCreateRequest}
//               disabled={isSubmitting} // Disable button during submission
//               className="!rounded-button px-4 py-2 bg-green-600 text-white hover:bg-opacity-90 disabled:bg-opacity-50"
//             >
//               {isSubmitting ? "Creating..." : "Create Request"}
//             </button>
//             <button
//               onClick={onClose}
//               className="!rounded-button px-4 py-2 bg-red-600 text-white hover:bg-opacity-90"
//             >
//               Cancel
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };


// // reliability chart
// const ReliabilityChart = () => {
//   const chartRef = useRef(null);

//   useEffect(() => {
//     const chart = echarts.init(chartRef.current);
//     const option = {
//       animation: false,
//       series: [
//         {
//           type: "gauge",
//           startAngle: 180,
//           endAngle: 0,
//           min: 0,
//           max: 100,
//           splitNumber: 10,
//           itemStyle: { color: "#4F46E5" },
//           progress: { show: true, width: 18 },
//           pointer: { show: false },
//           axisLine: { lineStyle: { width: 18 } },
//           axisTick: { show: false },
//           splitLine: { show: false },
//           axisLabel: { show: false },
//           title: { fontSize: 14 },
//           detail: {
//             width: 50,
//             height: 14,
//             fontSize: 28,
//             color: "#4F46E5",
//             formatter: "{value}%",
//           },
//           data: [{ value: 85 }],
//         },
//       ],
//     };
//     chart.setOption(option);

//     return () => chart.dispose();
//   }, []);

//   return (
//     <div className="bg-white shadow rounded-lg p-6">
//       <h2 className="text-lg font-semibold mb-4">Reliability Score</h2>
//       <div className="flex justify-center" ref={chartRef} style={{ height: "200px" }}></div>
//       <div className="mt-4">
//         <div className="flex justify-between items-center mb-2">
//           <span className="text-sm text-gray-600">On-time Payments</span>
//           <span className="font-medium">95%</span>
//         </div>
//         <div className="w-full bg-gray-200 rounded-md h-2">
//           <div className="bg-indigo-600 h-2 rounded-md" style={{ width: "95%" }}></div>
//         </div>
//       </div>
//     </div>
//   );
// };

// const LoansOverview = () => {
//   return (
//     <div className="bg-white shadow rounded-lg p-6 mb-6">
//       <h2 className="text-lg font-semibold mb-4">Active Loans Overview</h2>
//       <div className="grid grid-cols-2 gap-6 mb-6">
//         <div className="bg-gray-50 p-4 rounded-md">
//           <p className="text-sm text-gray-600">Total Outstanding</p>
//           <p className="text-2xl font-bold text-indigo-600">$12,500</p>
//         </div>
//         <div className="bg-gray-50 p-4 rounded-md">
//           <p className="text-sm text-gray-600">Active Loans</p>
//           <p className="text-2xl font-bold text-indigo-600">3</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// const LoanHistory = ({ uid }) => {
//   const [loanHistory, setLoanHistory] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [selectedLoan, setSelectedLoan] = useState(null); // To store the selected loan for the popup

//   useEffect(() => {
//     const fetchLoanHistory = async () => {
//       try {
//         const response = await axios.get(
//           `http://localhost:5000/profile/loanHistory/customer/${uid}`,
//           {
//             withCredentials: true,
//           }
//         );
//         setLoanHistory(response.data.loanHistory || []);
//         setLoading(false);
//       } catch (err) {
//         if (err.response?.status === 404) {
//           setError("No loan history found for this user.");
//         } else {
//           setError(err.response?.data?.error || "Failed to fetch loan history");
//         }
//         setLoading(false);
//       }
//     };

//     fetchLoanHistory();
//   }, [uid]);

//   if (loading) return <div className="text-center py-4">Loading loan history...</div>;
//   if (error) return <div className="text-center py-4 text-gray-500">{error}</div>;

//   return (
//     <div className="bg-white shadow rounded-lg p-6">
//       <h2 className="text-lg font-semibold mb-4">Loan History</h2>
//       <div className="overflow-x-auto">
//         {loanHistory.length > 0 ? (
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead>
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No.</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Loan Amount</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Remaining</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Create request</th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {loanHistory.map((loan, index) => (
//                 <tr key={loan.LoanId}>
//                   <td className="px-6 py-4 whitespace-nowrap">{index + 1}</td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     ${parseFloat(loan.LoanAmount).toLocaleString()}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <span
//                       className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-md ${
//                         loan.Status === "Active"
//                           ? "bg-green-100 text-green-800"
//                           : "bg-gray-100 text-gray-800"
//                       }`}
//                     >
//                       {loan.Status}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     ${parseFloat(loan.RemainingAmount).toLocaleString()}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <button
//                       onClick={() => setSelectedLoan(loan)} // Set the selected loan
//                       className="rounded-button bg-indigo-500 text-white px-4 py-2 font-medium hover:bg-opacity-90 cursor-pointer"
//                     >
//                       Open Loan Details
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         ) : (
//           <div className="text-center py-4 text-gray-500">No Loan Issued Yet</div>
//         )}
//       </div>

//       {/* Render the popup if a loan is selected */}
//       {selectedLoan && (
//         <LoanApproverequestPopup
//           loan={selectedLoan} uid={uid}
//           onClose={() => setSelectedLoan(null)} // Close the popup
//         />
//       )}
//     </div>
//   );
// };


// // Key Changes
// const oldProfilePage = () => {
//   const [profile, setProfile] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         const response = await axios.get("http://localhost:5000/profile/user", {
//           withCredentials: true,
//         });
//         setProfile(response.data.user);
//         setLoading(false);
//       } catch (err) {
//         setError(err.response?.data?.error || "Failed to fetch profile");
//         setLoading(false);
//       }
//     };

//     fetchProfile();
//   }, []);

//   if (loading) return <div className="text-center py-8">Loading...</div>;
//   if (error) return <div className="text-center py-8 text-red-500">Error: {error}</div>;

//   return (
//     <div className="bg-gray-50 font-sans min-h-screen">
//       <Navbar />
//       <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <UserProfile user={profile} />
//         <div className="grid grid-cols-12 gap-6">
//           <div className="col-span-12 md:col-span-4">
//             <div className="bg-white shadow rounded-lg p-6 mb-6">
//               <h2 className="text-lg font-semibold mb-4">Personal Information</h2>
//               <div className="space-y-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Phone</label>
//                   <p className="mt-1">{profile.phoneNumber}</p>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Email</label>
//                   <p className="mt-1">{profile.email}</p>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Address</label>
//                   <p className="mt-1">123 Main Street, Apt 4B<br />New York, NY 10001</p>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
//                   <p className="mt-1">January 15, 1985</p>
//                 </div>
//               </div>
//             </div>
//             <ReliabilityChart />
//           </div>
//           <div className="col-span-12 md:col-span-8">
//             <LoansOverview />
//             <LoanHistory uid={profile.uid} />
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// };

// export default oldProfilePage;

//////////////////////////////////////////////////////////////////////////

// import React, { useEffect, useRef } from 'react';
// import * as echarts from 'echarts';
// import axios from 'axios';
// const Navbar = () => {
//     return (
//         <nav className="bg-white shadow">
//             <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
//                 <div className="flex justify-between h-16">
//                     <div className="flex">
//                         <div className="flex-shrink-0 flex items-center">
//                             <img className="h-8 w-auto" src="https://ai-public.creatie.ai/gen_page/logo_placeholder.png" alt="Logo" />
//                         </div>
//                     </div>
//                     <div className="flex items-center">
//                         <div className="relative">
//                             <input type="text" placeholder="Search by ID..." className="w-64 pl-10 pr-4 py-2 border border-gray-300 !rounded-button focus:ring-custom focus:border-custom" />
//                             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                                 <i className="fas fa-search text-gray-400"></i>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </nav>
//     );
// };

// const UserProfile = () => {
//     return (
//         <div className="bg-white shadow !rounded-button p-6 mb-6">
//             <div className="flex items-center justify-between">
//                 <div className="flex items-center">
//                     <div>
//                         <h1 className="text-2xl font-bold">John Anderson</h1>
//                         <div className="flex items-center mt-1">
//                             <span className="text-gray-600 mr-4">ID: #123456</span>
//                             <span className="inline-flex items-center px-3 py-1 !rounded-button text-sm font-medium bg-green-100 text-green-800">
//                                 <i className="fas fa-check-circle mr-2"></i>
//                                 Highly Reliable
//                             </span>
//                         </div>
//                     </div>
//                 </div>
//                 <div className="flex space-x-4">
//                     <button className="bg-green-100 text-green-800 px-4 py-2 !rounded-button hover:bg-green-200">
//                         <i className="fas fa-money-bill-wave mr-2"></i>
//                         Issue New Loan
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// };

// const ReliabilityChart = () => {
//     const chartRef = useRef(null);

//     useEffect(() => {
//         const reliabilityChart = echarts.init(chartRef.current);
//         const reliabilityOption = {
//             animation: false,
//             series: [{
//                 type: 'gauge',
//                 startAngle: 180,
//                 endAngle: 0,
//                 min: 0,
//                 max: 100,
//                 splitNumber: 10,
//                 itemStyle: {
//                     color: '#4F46E5'
//                 },
//                 progress: {
//                     show: true,
//                     width: 18
//                 },
//                 pointer: {
//                     show: false
//                 },
//                 axisLine: {
//                     lineStyle: {
//                         width: 18
//                     }
//                 },
//                 axisTick: {
//                     show: false
//                 },
//                 splitLine: {
//                     show: false
//                 },
//                 axisLabel: {
//                     show: false
//                 },
//                 title: {
//                     fontSize: 14
//                 },
//                 detail: {
//                     width: 50,
//                     height: 14,
//                     fontSize: 28,
//                     color: '#4F46E5',
//                     formatter: '{value}%'
//                 },
//                 data: [{
//                     value: 85
//                 }]
//             }]
//         };
//         reliabilityChart.setOption(reliabilityOption);

//         return () => {
//             reliabilityChart.dispose();
//         };
//     }, []);

//     return (
//         <div className="bg-white shadow !rounded-button p-6">
//             <h2 className="text-lg font-semibold mb-4">Reliability Score</h2>
//             <div className="flex justify-center" ref={chartRef} style={{ height: '200px' }}></div>
//             <div className="mt-4">
//                 <div className="flex justify-between items-center mb-2">
//                     <span className="text-sm text-gray-600">On-time Payments</span>
//                     <span className="font-medium">95%</span>
//                 </div>
//                 <div className="w-full bg-gray-200 !rounded-button h-2">
//                     <div className="h-2 !rounded-button" style={{ width: '95%' }}></div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// const LoansOverview = () => {
//     return (
//         <div className="bg-white shadow !rounded-button p-6 mb-6">
//             <h2 className="text-lg font-semibold mb-4">Active Loans Overview</h2>
//             <div className="grid grid-cols-2 gap-6 mb-6">
//                 <div className="bg-gray-50 p-4 !rounded-button">
//                     <p className="text-sm text-gray-600">Total Outstanding</p>
//                     <p className="text-2xl font-bold text-custom">$12,500</p>
//                 </div>
//                 <div className="bg-gray-50 p-4 !rounded-button">
//                     <p className="text-sm text-gray-600">Active Loans</p>
//                     <p className="text-2xl font-bold text-custom">3</p>
//                 </div>
//             </div>
//         </div>
//     );
// };

// const LoanHistory = () => {
//     return (
//         <div className="bg-white shadow !rounded-button p-6">
//             <h2 className="text-lg font-semibold mb-4">Loan History</h2>
//             <div className="overflow-x-auto">
//                 <table className="min-w-full divide-y divide-gray-200">
//                     <thead>
//                         <tr>
//                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No.</th>
//                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Loan Amount</th>
//                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Paid</th>
//                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Remaining</th>
//                         </tr>
//                     </thead>
//                     <tbody className="bg-white divide-y divide-gray-200">
//                         <tr>
//                             <td className="px-6 py-4 whitespace-nowrap">1</td>
//                             <td className="px-6 py-4 whitespace-nowrap">$5,000</td>
//                             <td className="px-6 py-4 whitespace-nowrap">
//                                 <span className="px-2 inline-flex text-xs leading-5 font-semibold !rounded-button bg-green-100 text-green-800">Active</span>
//                             </td>
//                             <td className="px-6 py-4 whitespace-nowrap">$3,250</td>
//                         </tr>
//                         <tr>
//                             <td className="px-6 py-4 whitespace-nowrap">2</td>
//                             <td className="px-6 py-4 whitespace-nowrap">$3,000</td>
//                             <td className="px-6 py-4 whitespace-nowrap">
//                                 <span className="px-2 inline-flex text-xs leading-5 font-semibold !rounded-button bg-green-100 text-green-800">Active</span>
//                             </td>
//                             <td className="px-6 py-4 whitespace-nowrap">$2,100</td>
//                         </tr>
//                         <tr>
//                             <td className="px-6 py-4 whitespace-nowrap">3</td>
//                             <td className="px-6 py-4 whitespace-nowrap">$2,500</td>
//                             <td className="px-6 py-4 whitespace-nowrap">
//                                 <span className="px-2 inline-flex text-xs leading-5 font-semibold !rounded-button bg-gray-100 text-gray-800">Completed</span>
//                             </td>
//                             <td className="px-6 py-4 whitespace-nowrap">$0</td>
//                         </tr>
//                     </tbody>
//                 </table>
//             </div>
//         </div>
//     );
// };

// const oldProfilePage = () => {
//     const xhr = new XMLHttpRequest();
// xhr.open('GET', 'http://localhost:5000/profile/user', true);
// xhr.withCredentials = false; // Set to false (default is false anyway)
// xhr.send();

//     // Axios call to fetch user data 
//     axios.get('http://localhost:5000/profile/user', {
//         // withCredentials: true, // Send cookies
//       })
//       .then((response) => {
//         console.log('Profile Data:', response.data);
//       })
//       .catch((error) => {
//         console.error('Error fetching profile:', error.response ? error.response.data : error.message);
//       }); 

//     return (
//         <div className="bg-gray-50 font-sans">
//             <div className="min-h-screen">
//                 <Navbar />
//                 <main className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//                     <UserProfile />
//                     <div className="grid grid-cols-12 gap-6">
//                         <div className="col-span-4">
//                             <div className="bg-white shadow !rounded-button p-6 mb-6">
//                                 <h2 className="text-lg font-semibold mb-4">Personal Information</h2>
//                                 <div className="space-y-4">
//                                     <div>
//                                         <label className="block text-sm font-medium text-gray-700">Phone</label>
//                                         <p className="mt-1">+1 (555) 123-4567</p>
//                                     </div>
//                                     <div>
//                                         <label className="block text-sm font-medium text-gray-700">Email</label>
//                                         <p className="mt-1">john.anderson@example.com</p>
//                                     </div>
//                                     <div>
//                                         <label className="block text-sm font-medium text-gray-700">Address</label>
//                                         <p className="mt-1">123 Main Street, Apt 4B<br />New York, NY 10001</p>
//                                     </div>
//                                     <div>
//                                         <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
//                                         <p className="mt-1">January 15, 1985</p>
//                                     </div>
//                                 </div>
//                             </div>
//                             <ReliabilityChart />
//                         </div>
//                         <div className="col-span-8">
//                             <LoansOverview />
//                             <LoanHistory />
//                         </div>
//                     </div>
//                 </main>
//             </div>
//         </div>
//     );
// };

// export default oldProfilePage;