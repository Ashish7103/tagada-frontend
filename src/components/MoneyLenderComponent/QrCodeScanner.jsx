

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Scanner } from '@yudiel/react-qr-scanner';
import { Dialog } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/20/solid';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Navbar from './Navbar';
import {
  fetchProfile,
  setQrResult,
  toggleScanner,
  updateQrForm,
  resetQrForm,
  recordPayment,
} from '../../Redux/actions/profileActions';

const QrCodeScanner = () => {
  const dispatch = useDispatch();
  const { profile, qrScanner, loading, error, success } = useSelector((state) => state.profile);

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  const handleScan = (scanResults) => {
    if (scanResults && scanResults.length > 0) {
      dispatch(setQrResult(scanResults[0].rawValue));
    }
  };

  const handleError = (err) => {
    console.error('Scanner error:', err);
    dispatch({ type: 'RECORD_PAYMENT_FAIL', payload: 'Failed to scan QR code' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!qrScanner.amount || !qrScanner.paymentDate) {
      dispatch({ type: 'RECORD_PAYMENT_FAIL', payload: 'Please fill in all fields' });
      return;
    }
    dispatch(
      recordPayment({
        MoneyLenderId: profile?.uid,
        Cus_Id: qrScanner.result,
        Amount: parseFloat(qrScanner.amount),
        paymentDate: qrScanner.paymentDate,
      })
    );
  };

  if (loading) return <div className="p-8 text-gray-600">Loading data...</div>;
  if (error && !profile) return <div className="p-8 text-red-500">{error}</div>;

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar profile={profile || {}} />
      <main className="pt-20 px-4 pb-24">
        <div className="max-w-lg mx-auto">
          <h1 className="text-2xl font-semibold mb-8">Scan & Pay</h1>

          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <button
              onClick={() => dispatch(toggleScanner(!qrScanner.showScanner))}
              className="w-full bg-black text-white py-4 rounded-lg flex items-center justify-center gap-2 mb-4"
            >
              <i className="fas fa-qrcode"></i>
              {qrScanner.showScanner ? 'Stop Scanner' : 'Scan QR Code'}
            </button>
            {qrScanner.showScanner && (
              <div className="mt-4 relative">
                <div className="flex justify-end mb-2">
                  <button
                    onClick={() => dispatch(toggleScanner(false))}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>
                <Scanner
                  onScan={handleScan}
                  onError={handleError}
                  constraints={{ facingMode: 'environment' }}
                  formats={['qr_code']}
                  style={{ width: '100%', maxWidth: '300px', margin: '0 auto' }}
                />
              </div>
            )}
            <div className="space-y-2">
              <p className="text-sm text-gray-500">Scanned Customer ID:</p>
              <p className="text-gray-700">{qrScanner.result || 'No data scanned yet'}</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="font-semibold mb-4">Recent Transactions</h2>
            {/* Static content unchanged */}
          </div>
        </div>
      </main>

      <Dialog open={qrScanner.isOpen} onClose={() => dispatch(updateQrForm('isOpen', false))} className="relative z-10">
        <div className="fixed inset-0 bg-black bg-opacity-30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-sm rounded bg-white p-6">
            <div className="flex justify-between items-center mb-4">
              <Dialog.Title className="text-lg font-medium text-gray-900">
                Record Payment for Customer ID: {qrScanner.result}
              </Dialog.Title>
              <button onClick={() => dispatch(updateQrForm('isOpen', false))}>
                <XMarkIcon className="h-6 w-6 text-gray-500" />
              </button>
            </div>
            {error && <div className="text-red-500 mb-4">{error}</div>}
            {success && <div className="text-green-500 mb-4">{success}</div>}
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                  Amount (₹)
                </label>
                <input
                  type="number"
                  id="amount"
                  value={qrScanner.amount}
                  onChange={(e) => dispatch(updateQrForm('amount', e.target.value))}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Enter amount"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="paymentDate" className="block text-sm font-medium text-gray-700">
                  Payment Date
                </label>
                <DatePicker
                  selected={qrScanner.paymentDate}
                  onChange={(date) => dispatch(updateQrForm('paymentDate', date))}
                  showTimeSelect
                  timeFormat="HH:mm"
                  timeIntervals={15}
                  dateFormat="yyyy-MM-dd HH:mm:ss"
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                disabled={loading}
              >
                {loading ? 'Recording...' : 'Record Payment'}
              </button>
            </form>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};

export default QrCodeScanner;

///////////////////////////////////////////////////////

// import React, { useState, useEffect } from "react";
// import { Scanner } from "@yudiel/react-qr-scanner";
// import { Dialog } from "@headlessui/react";
// import { XMarkIcon } from "@heroicons/react/20/solid";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
// import axios from "axios";
// import Navbar from "./Navbar"; 
// const API_BASE_URL ="https://tagada.onrender.com";// Assuming you have a Navbar component

// const QrCodeScanner = () => {
//   const [profile, setProfile] = useState(null);
//   const [result, setResult] = useState("");
//   const [showScanner, setShowScanner] = useState(false);
//   const [isOpen, setIsOpen] = useState(false);
//   const [amount, setAmount] = useState("");
//   const [paymentDate, setPaymentDate] = useState(new Date());
//   const [error, setError] = useState(null);
//   const [success, setSuccess] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // Fetch profile data to get MoneyLenderId
//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         const response = await axios.get(`${API_BASE_URL}/profile/user`, {
//           withCredentials: true,
//         });
//         console.log("Response Data:", response.data);
//         setProfile(response.data.user);
//         console.log("Profile Data:", response.data.user);
//       } catch (err) {
//         setError(err.response?.data?.error || "Failed to fetch profile");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchProfile();
//   }, []);

//   const handleScan = (scanResults) => {
//     if (scanResults && scanResults.length > 0) {
//       const scannedData = scanResults[0].rawValue;
//       setResult(scannedData);
//       setShowScanner(false);
//       setIsOpen(true);
//     }
//   };

//   const handleError = (error) => {
//     console.error("Scanner error:", error);
//     setError("Failed to scan QR code");
//   };

//   const handleCloseScanner = () => {
//     setShowScanner(false);
//     setError(null); // Clear any scanner-related errors
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError(null);
//     setSuccess(null);

//     const formattedDate = paymentDate
//       .toISOString()
//       .slice(0, 19)
//       .replace("T", " ");

//     try {
//       // Step 1: Record the payment
//       const paymentResponse = await axios.post(
//         `${API_BASE_URL}/paymentApprove/payment/direct`,
//         {
//           MoneyLenderId: profile?.uid,
//           Cus_Id: result,
//           Amount: parseFloat(amount),
//           PaymentDate: formattedDate,
//         },
//         { withCredentials: true }
//       );

//       // Step 2: Update the daily loan collection totals
//       try {
//         const totalCollectedResponse = await axios.post(
//           `${API_BASE_URL}/DailyLoanCollect/payment/total-collected`,
//           {},
//           { withCredentials: true }
//         );
//         setSuccess(
//           `${paymentResponse.data.message} Daily totals updated: ${totalCollectedResponse.data.message}`
//         );
//       } catch (totalErr) {
//         // If the total-collected API fails, show a warning but keep the payment success
//         setSuccess(paymentResponse.data.message);
//         setError(
//           "Payment recorded, but failed to update daily totals: " +
//             (totalErr.response?.data?.error || "Server error")
//         );
//       }

//       // Reset form fields
//       setAmount("");
//       setPaymentDate(new Date());
//       setIsOpen(false);
//     } catch (err) {
//       setError(err.response?.data?.error || "Failed to record payment");
//     }
//   };

//   if (loading) return <div className="p-8 text-gray-600">Loading data...</div>;
//   if (error && !profile)
//     return <div className="p-8 text-red-500">{error}</div>;

//   return (
//     <div className="bg-gray-50 min-h-screen">
//       <Navbar profile={profile || {}} />
//       <main className="pt-20 px-4 pb-24">
//         <div className="max-w-lg mx-auto">
//           <h1 className="text-2xl font-semibold mb-8">Scan & Pay</h1>

//           <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
//             <button
//               onClick={() => setShowScanner(!showScanner)}
//               className="w-full bg-black text-white py-4 rounded-lg flex items-center justify-center gap-2 mb-4"
//             >
//               <i className="fas fa-qrcode"></i>
//               {showScanner ? "Stop Scanner" : "Scan QR Code"}
//             </button>
//             {showScanner && (
//               <div className="mt-4 relative">
//                 <div className="flex justify-end mb-2">
//                   <button
//                     onClick={handleCloseScanner}
//                     className="text-gray-500 hover:text-gray-700"
//                   >
//                     <XMarkIcon className="h-6 w-6" />
//                   </button>
//                 </div>
//                 <Scanner
//                   onScan={handleScan}
//                   onError={handleError}
//                   constraints={{ facingMode: "environment" }}
//                   formats={["qr_code"]}
//                   style={{ width: "100%", maxWidth: "300px", margin: "0 auto" }}
//                 />
//               </div>
//             )}
//             <div className="space-y-2">
//               <p className="text-sm text-gray-500">Scanned Customer ID:</p>
//               <p className="text-gray-700">
//                 {result ? result : "No data scanned yet"}
//               </p>
//             </div>
//           </div>

//           <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
//             <h2 className="font-semibold mb-4">Recent Transactions</h2>
//             <div className="space-y-4">
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center gap-3">
//                   <i className="fas fa-arrow-down text-green-500"></i>
//                   <div>
//                     <p className="font-medium">Received Payment</p>
//                     <p className="text-sm text-gray-500">Today, 2:30 PM</p>
//                   </div>
//                 </div>
//                 <p className="text-green-500 font-medium">+$245.00</p>
//               </div>
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center gap-3">
//                   <i className="fas fa-arrow-up text-red-500"></i>
//                   <div>
//                     <p className="font-medium">Service Fee</p>
//                     <p className="text-sm text-gray-500">Today, 1:15 PM</p>
//                   </div>
//                 </div>
//                 <p className="text-red-500 font-medium">-$4.50</p>
//               </div>
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center gap-3">
//                   <i className="fas fa-arrow-up text-red-500"></i>
//                   <div>
//                     <p className="font-medium">Transfer to Bank</p>
//                     <p className="text-sm text-gray-500">
//                       Yesterday, 5:45 PM
//                     </p>
//                   </div>
//                 </div>
//                 <p className="text-red-500 font-medium">-$65.50</p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </main>

//       {/* Payment Dialog */}
//       <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-10">
//         <div className="fixed inset-0 bg-black bg-opacity-30" aria-hidden="true" />
//         <div className="fixed inset-0 flex items-center justify-center p-4">
//           <Dialog.Panel className="mx-auto max-w-sm rounded bg-white p-6">
//             <div className="flex justify-between items-center mb-4">
//               <Dialog.Title className="text-lg font-medium text-gray-900">
//                 Record Payment for Customer ID: {result}
//               </Dialog.Title>
//               <button onClick={() => setIsOpen(false)}>
//                 <XMarkIcon className="h-6 w-6 text-gray-500" />
//               </button>
//             </div>
//             {error && <div className="text-red-500 mb-4">{error}</div>}
//             {success && <div className="text-green-500 mb-4">{success}</div>}
//             <form onSubmit={handleSubmit}>
//               <div className="mb-4">
//                 <label
//                   htmlFor="amount"
//                   className="block text-sm font-medium text-gray-700"
//                 >
//                   Amount (₹)
//                 </label>
//                 <input
//                   type="number"
//                   id="amount"
//                   value={amount}
//                   onChange={(e) => setAmount(e.target.value)}
//                   className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
//                   placeholder="Enter amount"
//                   min="0"
//                   step="0.01"
//                   required
//                 />
//               </div>
//               <div className="mb-4">
//                 <label
//                   htmlFor="paymentDate"
//                   className="block text-sm font-medium text-gray-700"
//                 >
//                   Payment Date
//                 </label>
//                 <DatePicker
//                   selected={paymentDate}
//                   onChange={(date) => setPaymentDate(date)}
//                   showTimeSelect
//                   timeFormat="HH:mm"
//                   timeIntervals={15}
//                   dateFormat="yyyy-MM-dd HH:mm:ss"
//                   className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
//                   required
//                 />
//               </div>
//               <button
//                 type="submit"
//                 className="w-full p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
//               >
//                 Record Payment
//               </button>
//             </form>
//           </Dialog.Panel>
//         </div>
//       </Dialog>
//     </div>
//   );
// };

// export default QrCodeScanner;