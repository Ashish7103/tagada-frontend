import React, { useEffect, useState, useRef } from "react";
import * as echarts from "echarts";
import axios from "axios";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css"; // Default CSS for the calendar
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Scanner } from '@yudiel/react-qr-scanner';
import { Dialog } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/20/solid';
const API_BASE_URL ="https://tagada.onrender.com";

// Utility function to generate random color
const getRandomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};
////////////////////////////////////////////////////////////////
// add area in moneylender

const AddAreaComponent = ({ moneyLenderId }) => {
  const [areas, setAreas] = useState([""]); // For adding new areas
  const [currentAreas, setCurrentAreas] = useState([]); // Current areas from the database
  const [editAreas, setEditAreas] = useState({}); // For editing area names
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [selectedAreas, setSelectedAreas] = useState([]); // For selecting areas to delete

  // Fetch current areas on component mount
  useEffect(() => {
    const fetchAreas = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/moneylender/get-areas/${moneyLenderId}`);
        setCurrentAreas(response.data.areas || []);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to fetch areas");
      }
    };

    if (moneyLenderId) {
      fetchAreas();
    }
  }, [moneyLenderId]);

  // Handle input change for adding new areas
  const handleAreaChange = (index, value) => {
    const newAreas = [...areas];
    newAreas[index] = value;
    setAreas(newAreas);
  };

  // Add a new area input field
  const handleAddArea = () => {
    setAreas([...areas, ""]);
  };

  // Handle form submission to add new areas
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Filter out empty areas
    const filteredAreas = areas.filter((area) => area.trim() !== "");
    if (filteredAreas.length === 0) {
      setError("Please add at least one area");
      return;
    }

    try {
      const response = await axios.post(
        `${API_BASE_URL}/moneylender/add-area/${moneyLenderId}`,
        { newAreas: filteredAreas }
      );
      setSuccess(response.data.message || "Areas added successfully");
      setAreas([""]); // Reset to one empty field after success
      // Update current areas
      setCurrentAreas([...currentAreas, ...filteredAreas]);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to add areas");
    }
  };

  // Handle selecting areas for deletion
  const handleSelectArea = (area) => {
    setSelectedAreas((prev) =>
      prev.includes(area) ? prev.filter((a) => a !== area) : [...prev, area]
    );
  };

  // Handle deleting selected areas
  const handleDeleteAreas = async () => {
    if (selectedAreas.length === 0) {
      setError("Please select at least one area to delete");
      return;
    }

    try {
      const response = await axios.post(
        `${API_BASE_URL}/moneylender/delete-area/${moneyLenderId}`,
        { areasToDelete: selectedAreas }
      );
      setSuccess(response.data.message || "Areas deleted successfully");
      setCurrentAreas(currentAreas.filter((area) => !selectedAreas.includes(area)));
      setSelectedAreas([]); // Reset selection
    } catch (err) {
      // Handle the case where deletion is blocked due to active loans
      if (err.response?.data?.blockedAreas) {
        setError(
          `Cannot delete the following areas due to active loans: ${err.response.data.blockedAreas.join(", ")}`
        );
      } else {
        setError(err.response?.data?.error || "Failed to delete areas");
      }
    }
  };

  // Handle editing area names
  const handleEditChange = (area, value) => {
    setEditAreas((prev) => ({
      ...prev,
      [area]: value,
    }));
  };

  // Handle saving edited area names
  const handleUpdateAreas = async () => {
    const updates = Object.keys(editAreas).map((oldArea) => ({
      oldArea,
      newArea: editAreas[oldArea],
    }));

    if (updates.length === 0) {
      setError("No areas to update");
      return;
    }

    try {
      const response = await axios.post(
        `${API_BASE_URL}/moneylender/update-area/${moneyLenderId}`,
        { updates }
      );
      setSuccess(response.data.message || "Areas updated successfully");
      // Update current areas with new names
      const updatedAreas = currentAreas.map((area) => editAreas[area] || area);
      setCurrentAreas(updatedAreas);
      setEditAreas({}); // Reset edit state
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update areas");
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Manage Areas for MoneyLender</h2>

      {error && <div className="text-red-500 mb-4">{error}</div>}
      {success && <div className="text-green-500 mb-4">{success}</div>}

      {/* Display Current Areas */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Current Areas</h3>
        {currentAreas.length === 0 ? (
          <p className="text-gray-500">No areas added yet.</p>
        ) : (
          <div>
            {currentAreas.map((area, index) => (
              <div key={index} className="flex items-center mb-2">
                <input
                  type="checkbox"
                  checked={selectedAreas.includes(area)}
                  onChange={() => handleSelectArea(area)}
                  className="mr-2"
                />
                {editAreas[area] !== undefined ? (
                  <input
                    type="text"
                    value={editAreas[area]}
                    onChange={(e) => handleEditChange(area, e.target.value)}
                    className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <span className="flex-1">{area}</span>
                )}
                <button
                  onClick={() => setEditAreas((prev) => ({ ...prev, [area]: area }))}
                  className="ml-2 bg-yellow-500 text-white px-2 py-1 rounded-md hover:bg-yellow-600"
                >
                  Edit
                </button>
              </div>
            ))}
            <button
              onClick={handleDeleteAreas}
              className="mt-2 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
              disabled={selectedAreas.length === 0}
            >
              Delete Selected Areas
            </button>
            <button
              onClick={handleUpdateAreas}
              className="mt-2 ml-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              disabled={Object.keys(editAreas).length === 0}
            >
              Save Changes
            </button>
          </div>
        )}
      </div>

      {/* Add New Areas */}
      <h3 className="text-lg font-semibold mb-2">Add New Areas</h3>
      <form onSubmit={handleSubmit}>
        {areas.map((area, index) => (
          <div key={index} className="mb-4 flex items-center">
            <input
              type="text"
              value={area}
              onChange={(e) => handleAreaChange(index, e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={`Enter Area ${index + 1}`}
              required
            />
          </div>
        ))}

        <button
          type="button"
          onClick={handleAddArea}
          className="mb-4 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
        >
          + Add More Area
        </button>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Post Areas
        </button>
      </form>
    </div>
  );
};
  ///////////////////////////////////////////////////////////
  // Scanner logic
  // Main Component
  const QrCodeScanner = ({ moneyLenderId}) => {
    const [result, setResult] = useState("");
    const [showScanner, setShowScanner] = useState(false);
    const [isOpen, setIsOpen] = useState(false); // For popup
    const [amount, setAmount] = useState("");
    const [paymentDate, setPaymentDate] = useState(new Date());
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
  
    // Handle scan result
    const handleScan = (scanResults) => {
      if (scanResults && scanResults.length > 0) {
        const scannedData = scanResults[0].rawValue; // Extract scanned value
        setResult(scannedData);
        setShowScanner(false); // Stop scanning
        setIsOpen(true); // Open the popup
      }
    };
  
    // Handle errors
    const handleError = (error) => {
      console.error("Scanner error:", error);
      setError("Failed to scan QR code");
    };
  
    // Handle form submission to /payment/direct
    const handleSubmit = async (e) => {
      e.preventDefault();
      setError(null);
      setSuccess(null);
  
      // Format the payment date to "YYYY-MM-DD HH:mm:ss"
      const formattedDate = paymentDate
        .toISOString()
        .slice(0, 19)
        .replace("T", " ");
  
      try {
        const response = await axios.post(`${API_BASE_URL}/paymentApprove/payment/direct`, {
          MoneyLenderId: moneyLenderId,
          Cus_Id: result, // Scanned Cus_Id from QR code
          Amount: parseFloat(amount),
          PaymentDate: formattedDate,
        });
  
        setSuccess(response.data.message);
        setAmount("");
        setPaymentDate(new Date());
        setIsOpen(false); // Close the popup
      } catch (err) {
        setError(err.response?.data?.error || "Failed to record payment");
      }
    };
  
    return (
      <div style={{ padding: "20px" }}>
        <h2 className="text-2xl font-bold mb-4">Scan and Pay</h2>
  
        {/* Scanner controls */}
        <button
          onClick={() => setShowScanner(!showScanner)}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          {showScanner ? "Stop Scanner" : "Scan QR Code"}
        </button>
  
        {showScanner && (
          <Scanner
            onScan={handleScan}
            onError={handleError}
            constraints={{ facingMode: "environment" }} // Use rear camera
            formats={["qr_code"]} // Specify QR code format
            style={{ width: "300px", marginTop: "20px" }}
          />
        )}
  
        {/* Display the scanned result */}
        <div className="mt-4">
          <h3 className="text-lg font-semibold">Scanned Customer ID:</h3>
          {result ? <p>Data: {result}</p> : <p>No data scanned yet</p>}
        </div>
  
        {/* Popup Modal */}
        <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-10">
          <div className="fixed inset-0 bg-black bg-opacity-30" aria-hidden="true" />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className="mx-auto max-w-sm rounded bg-white p-6">
              <div className="flex justify-between items-center mb-4">
                <Dialog.Title className="text-lg font-medium text-gray-900">
                  Record Payment for Customer ID: {result}
                </Dialog.Title>
                <button onClick={() => setIsOpen(false)}>
                  <XMarkIcon className="h-6 w-6 text-gray-500" />
                </button>
              </div>
  
              {error && <div className="text-red-500 mb-4">{error}</div>}
              {success && <div className="text-green-500 mb-4">{success}</div>}
  
              <form onSubmit={handleSubmit}>
                {/* Amount Field */}
                <div className="mb-4">
                  <label
                    htmlFor="amount"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Amount (₹)
                  </label>
                  <input
                    type="number"
                    id="amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                    placeholder="Enter amount"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
  
                {/* Payment Date Field */}
                <div className="mb-4">
                  <label
                    htmlFor="paymentDate"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Payment Date
                  </label>
                  <DatePicker
                    selected={paymentDate}
                    onChange={(date) => setPaymentDate(date)}
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={15}
                    dateFormat="yyyy-MM-dd HH:mm:ss"
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
  
                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  Record Payment
                </button>
              </form>
            </Dialog.Panel>
          </div>
        </Dialog>
      </div>
    );
  };
  //////////////////////////////////
  // const QrCodeScanner = () => {
  //   const [result, setResult] = useState('');
  //   const [showScanner, setShowScanner] = useState(false);
  
  //   // Handle scan result
  //   const handleScan = (scanResults) => {
  //     if (scanResults && scanResults.length > 0) {
  //       const scannedData = scanResults[0].rawValue; // Extract scanned value
  //       setResult(scannedData);
  //       setShowScanner(false); // Stop scanning after successful read
  //     }
  //   };
  
  //   // Handle errors
  //   const handleError = (error) => {
  //     console.error('Scanner error:', error);
  //   };
  
  //   return (
  //     <div style={{ padding: '20px' }}>
  //       <h2>QR Code Scanner</h2>
  
  //       {/* Scanner controls */}
  //       <button onClick={() => setShowScanner(!showScanner)}>
  //         {showScanner ? 'Stop Scanner' : 'Start Scanner'}
  //       </button>
  
  //       {showScanner && (
  //         <Scanner
  //           onScan={handleScan}
  //           onError={handleError}
  //           constraints={{ facingMode: 'environment' }} // Use rear camera
  //           formats={['qr_code']} // Specify QR code format
  //           style={{ width: '300px', marginTop: '20px' }}
  //         />
  //       )}
  
  //       {/* Display the scanned result */}
  //       <div>
  //         <h3>Scanned Result:</h3>
  //         {result ? <p>Data: {result}</p> : <p>No data scanned yet</p>}
  //       </div>
  //     </div>
  //   );
  // }
  /////////////////////////////


//////////////////////////////////////////////////////////////////////////////
// Approve request
const PaymentRequests = ({ profile }) => {
  const [requests, setRequests] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility

  // Fetch payment requests when profile changes

  console.log("Profile Data inside PaymentRequests:", profile);
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/paymentRequest/getAllPaymentRequest?Status=Pending&MoneyLenderId=${profile.uid}`,
          { withCredentials: true }
        );
        console.log("Response Data for request:", response.data);
        setRequests(response.data.requests || []); // Default to empty array if no requests
      } catch (err) {
        console.error("Error fetching payment requests:", err);
        setRequests([]); // Set empty array on error
      }
    };
    if (profile && profile.uid) {
      fetchRequests();
    }
  }, [profile]);

  // Handle approve/reject action
  const handleApprove = async (requestId, approve) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/paymentApprove/payment/approve`,
        { RequestId: requestId, Approve: true },
        { withCredentials: true }
      );
      alert(response.data.message);
      // Update requests by removing the processed one
      setRequests(requests.filter((r) => r.RequestId !== requestId));
    } catch (err) {
      console.error("Error approving payment:", err);
      alert("Failed to process request");
    }
  };

  // Handle approve/reject action
  const handleReject = async (requestId, approve) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/paymentApprove/payment/approve`,
        { RequestId: requestId, Approve: false },
        { withCredentials: true }
      );
      alert(response.data.message);
      // Update requests by removing the processed one
      setRequests(requests.filter((r) => r.RequestId !== requestId));
    } catch (err) {
      console.error("Error approving payment:", err);
      alert("Failed to process request");
    }
  };


  // Open and close modal
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div>
      {/* Button to trigger the modal */}
      <button
        onClick={openModal}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg mb-4"
      >
        View Payment Requests ({requests.length})
      </button>

      {/* Modal Popup */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-4xl max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Payment Requests</h3>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700 text-xl"
              >
                ×
              </button>
            </div>

            {/* Requests Table */}
            {requests.length === 0 ? (
              <p className="text-gray-600">No payment requests found.</p>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="text-left text-sm text-gray-500 border-b">
                    <th className="pb-3 px-4">Request ID</th>
                    <th className="pb-3 px-4">Loan ID</th>
                    <th className="pb-3 px-4">Customer</th>
                    <th className="pb-3 px-4">Amount</th>
                    <th className="pb-3 px-4">Date</th>
                    <th className="pb-3 px-4">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((req) => (
                    <tr
                      key={req.RequestId}
                      className="border-b hover:bg-gray-50"
                    >
                      <td className="py-4 px-4">{req.RequestId}</td>
                      <td className="py-4 px-4">{req.LoanId}</td>
                      <td className="py-4 px-4">{req.Cus_Id}</td>
                      <td className="py-4 px-4">₹{req.Amount}</td>
                      <td className="py-4 px-4">
                        {new Date(req.RequestDate).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-4">
                        <button
                          onClick={() => handleApprove(req.RequestId, true)}
                          className="bg-green-600 text-white px-3 py-1 rounded mr-2"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(req.RequestId, false)}
                          className="bg-red-600 text-white px-3 py-1 rounded"
                        >
                          Reject
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

////////////////////////////////////////////////////////////////

// calender component

const PaymentCalendar = ({ loanId, cusId, ppd }) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false); // State to manage popup visibility
  const [selectedDate, setSelectedDate] = useState(new Date()); // Selected date in the calendar
  const [payments, setPayments] = useState([]); // Payment data for all dates
  const expectedDailyPayment = ppd || 0; // Default to 0 if ppd is not provided

  // Fetch payment data for all dates
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/Calender/payment/history?LoanId=${loanId}&Cus_Id=${cusId}`,
          { withCredentials: true }
        );
        setPayments(response.data.payments || []);
      } catch (err) {
        console.error("Error fetching payment history:", err);
        setPayments([]); // Set empty array on error
      }
    };
    fetchPayments();
  }, [loanId, cusId]);

  // Calculate payment status for a specific date
  const getPaymentStatus = (date) => {
    const paymentsForDate = payments.filter((p) => {
      const paymentDate = new Date(p.PaymentDate).toISOString().split("T")[0];
      return paymentDate === date.toISOString().split("T")[0];
    });

    const totalPayment = paymentsForDate.reduce(
      (sum, payment) => sum + parseFloat(payment.Amount || 0),
      0
    );

    if (totalPayment === 0) return { status: "red", amount: 0 }; // No payment
    if (totalPayment >= expectedDailyPayment)
      return { status: "green", amount: totalPayment }; // Full payment or more
    return { status: "yellow", amount: totalPayment }; // Partial payment
  };

  // Custom tile content for the calendar
  const tileContent = ({ date, view }) => {
    if (view === "month") {
      const { status, amount } = getPaymentStatus(date);
      return (
        <div
          className={`w-full h-full flex flex-col items-center justify-center rounded-full text-xs ${
            status === "green"
              ? "bg-green-500 text-white"
              : status === "yellow"
              ? "bg-yellow-500 text-black"
              : "bg-red-500 text-white"
          }`}
        >
          <span>{amount > 0 ? `₹${amount}` : ""}</span>
        </div>
      );
    }
    return null;
  };

  // Open the popup
  const openPopup = () => {
    setIsPopupOpen(true);
  };

  // Close the popup
  const closePopup = () => {
    setIsPopupOpen(false);
  };

  return (
    <div>
      {/* Eye button to open the popup */}
      <button
        onClick={openPopup}
        className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 focus:outline-none"
      >
        👁️
      </button>

      {/* Popup modal */}
      {isPopupOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          onClick={closePopup} // Close popup when clicking outside
        >
          <div
            className="bg-white rounded-lg p-6 w-11/12 max-w-md max-h-[90vh] overflow-y-auto relative"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the popup
          >
            {/* Close button */}
            <button
              onClick={closePopup}
              className="absolute top-2 right-2 p-2 text-gray-600 hover:text-gray-900 focus:outline-none"
            >
              ×
            </button>

            {/* Calendar component */}
            <Calendar
              onChange={setSelectedDate} // Handle date selection
              value={selectedDate} // Set the selected date
              tileContent={tileContent} // Custom content for each tile
              className="border rounded-lg w-full" // Custom styling
            />

            {/* Decreased width section below the calendar */}
            <div className="mt-4 w-3/4 mx-auto text-center">
              <p className="text-sm text-gray-600">
                Click on a date to view payment details.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const LoanDashboard = () => {
  const [customers, setCustomers] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    Cus_Id: "",
    Cus_Name: "",
    Mobile_No: "",
    Area: "",
    Loan_Amt: "",

    paid: "",
    unpaid: "",
    PPD: "",
  });

  // Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/profile/user`, {
          withCredentials: true,
        });
        console.log("Response Data:", response.data);
        setProfile(response.data.user);
        console.log("Profile Data:", profile);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to fetch profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Fetch customer data filtered by profile.uid
  const fetchCustomers = async () => {
    if (!profile || !profile.uid) return; // Wait until profile is loaded

    console.log("Profile Data inside fetch customer:", profile.uid);
    try {
      const response = await axios.get(
        `${API_BASE_URL}/moneylender/getallissuedLoan`
      );
      console.log("Customers Data:", response.data);

      const filteredCustomers = response.data.customers.filter(
        (customer) => customer.MoneyLenderId === profile.uid
      );

      setCustomers(filteredCustomers || []);
    } catch (err) {
      setError("Failed to fetch customers");
      console.error("Error fetching customers:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (profile) {
      fetchCustomers();
    }
  }, [profile]);

  // Handle input change for new customer
  const handleNewCustomerChange = (field, value) => {
    setNewCustomer((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Post new customer to backend
  const handleAddNewCustomer = async () => {
    const loanResponse = await axios.post(
        `${API_BASE_URL}/moneylender/add`,
        {
          ...newCustomer,
          Cus_Id: parseInt(newCustomer.Cus_Id),
          Area: newCustomer.Area,
          Loan_Amt: parseFloat(newCustomer.Loan_Amt),
          paid: parseFloat(newCustomer.paid),
          unpaid: parseFloat(newCustomer.unpaid),
          PPD: parseInt(newCustomer.PPD),
          UserId: moneyLenderId, // Use the fetched moneyLenderId
          start_date: newCustomer.start_date,
          completion_date: newCustomer.completion_date,
        }
      );
      if (response.status === 200 || response.status === 201) {
        setCustomers((prevCustomers) => [...prevCustomers, response.data]);
        setIsAddingNew(false);
        setNewCustomer({
          Cus_Id: "",
          Cus_Name: "",
          Mobile_No: "",
          Area: "",
          Loan_Amt: "",
          paid: "",
          unpaid: "",
          PPD: "",
          start_date: "", // Reset start_date
          completion_date: "", // Reset completion_date
        });
      }
    } catch (err) {
      setError("Failed to add new customer");
      console.error("Error adding customer:", err);
    }
  };

  if (loading) return <div className="p-8 text-gray-600">Loading data...</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar onNewLoan={() => setIsAddingNew(true)} profile={profile || {}} />
      <main className="flex-1 p-8">
        <div className="max-w-8xl mx-auto space-y-8">
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 md:col-span-4">
              <div className="bg-white shadow rounded-lg p-6 mb-6">
                <h2 className="text-lg font-semibold mb-4">
                  Personal Information
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Phone
                    </label>
                    <p className="mt-1">{profile?.phoneNumber || "N/A"}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <p className="mt-1">{profile?.email || "N/A"}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Address
                    </label>
                    <p className="mt-1">
                      123 Main Street, Apt 4B
                      <br />
                      New York, NY 10001
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Date of Birth
                    </label>
                    <p className="mt-1">January 15, 1985</p>
                  </div>
                  {/* <PaymentRequests profile={profile} /> */}
                  {/* {console.log("Profile Data:", profile)} */}
                  {profile?.role_id === 2 && (
                    <PaymentRequests profile={profile} />
                  )}
                </div>
              </div>
            </div>
            <div className="col-span-12 md:col-span-8">
              <StatsGrid customers={customers} />
              <LoanTable
                customers={customers}
                isAddingNew={isAddingNew}
                newCustomer={newCustomer}
                onNewCustomerChange={handleNewCustomerChange}
                onAddNewCustomer={handleAddNewCustomer}
                onCancel={() => setIsAddingNew(false)}
                profile={profile}
              />
              <ChartsSection customers={customers} profile={profile || {}} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

// Navbar Component
const Navbar = ({ onNewLoan, profile }) => (
  <nav className="bg-white border-b border-gray-200">
    <div className="max-w-8xl mx-auto px-4 py-4 flex items-center justify-between">
      <div className="flex items-center">
        <div>
          <h1 className="text-2xl font-bold">{profile.name || "Loading..."}</h1>
          <div className="flex items-center mt-1">
            <div className="text-gray-600 mr-4">
              ID: #{profile.uid || "N/A"}
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center space-x-4">
      <AddAreaComponent moneyLenderId={profile.uid}/>
         <button
          onClick={onNewLoan}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          + New Loan
        </button> 
        {/* <img src="/avatar.png" className="h-8 w-8 rounded-full" alt="Profile" /> */} 
        <QrCodeScanner  moneyLenderId={profile.uid}/>
      </div>
    </div>
  </nav>
);

// Stats Grid Component
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
      <StatCard
        title="Total Amount"
        value={`₹${totals.totalAmount}`}
        icon="💰"
      />
      <StatCard title="Amount Paid" value={`₹${totals.totalPaid}`} icon="✅" />
      <StatCard title="Amount Due" value={`₹${totals.totalUnpaid}`} icon="⚠️" />
    </div>
  );
};

const StatCard = ({ title, value, icon }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm">
    <div className="flex items-center gap-4">
      <div className="text-2xl">{icon}</div>
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-semibold">{value}</p>
      </div>
    </div>
  </div>
);

/////////////////////////////////////
//Formating date
const formatDate = (dateString) => {
  if (!dateString || isNaN(new Date(dateString).getTime())) {
    return "Invalid Date"; // or return an empty string or a placeholder
  }

  const date = new Date(dateString);

  const formatter = new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return formatter
    .formatToParts(date)
    .map(({ type, value }) => {
      switch (type) {
        case "day":
          return value;
        case "month":
          return value;
        case "year":
          return value;
        default:
          return "";
      }
    })
    .join(" ");
};

// Loan Table Component
const LoanTable = ({
  customers,
  isAddingNew,
  newCustomer,
  onNewCustomerChange,
  onAddNewCustomer,
  onCancel,
  profile,
}) => {
  const [areas, setAreas] = useState([]); // State to store fetched areas
  const [searchTerm, setSearchTerm] = useState(""); // State for search input
  const [error, setError] = useState(null); // State for API errors

  // Fetch areas from the API when the component mounts or isAddingNew changes
  useEffect(() => {
    console.log("profile inside area:",profile)
    const fetchAreas = async () => {
      try {
        console.log("profile inside area:",profile)
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
      }
    };
    fetchAreas();
  }, [isAddingNew]); // Re-fetch if isAddingNew changes

  // Format date function
  const formatDate = (dateString) => {
    return dateString ? new Date(dateString).toLocaleDateString() : "";
  };

  // Filter areas based on search term
  const filteredAreas = areas.filter((area) =>
    area.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-xl shadow-sm mb-7">
      <div className="p-6">
        <h3 className="text-lg font-semibold mb-4">Active Loans</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-gray-500 border-b">
                {[
                  "ID",
                  "Name",
                  "Mobile",
                  "Area",
                  "Loan Amount",
                  "Paid",
                  "Due",
                  "Installment",
                  "Start Date",
                  "End Date",
                  "Calender",
                ].map((th) => (
                  <th key={th} className="pb-3 px-4">
                    {th}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isAddingNew && (
                <tr className="border-b bg-blue-50">
                  <td className="py-4 px-4">
                    <input
                      type="number"
                      value={newCustomer.Cus_Id}
                      onChange={(e) =>
                        onNewCustomerChange("Cus_Id", e.target.value)
                      }
                      className="w-full p-1 border rounded"
                      placeholder="Customer ID"
                    />
                  </td>
                  <td className="py-4 px-4">
                    <input
                      type="text"
                      value={newCustomer.Cus_Name}
                      onChange={(e) =>
                        onNewCustomerChange("Cus_Name", e.target.value)
                      }
                      className="w-full p-1 border rounded"
                      placeholder="Name"
                    />
                  </td>
                  <td className="py-4 px-4">
                    <input
                      type="text"
                      value={newCustomer.Mobile_No}
                      onChange={(e) =>
                        onNewCustomerChange("Mobile_No", e.target.value)
                      }
                      className="w-full p-1 border rounded"
                      placeholder="Mobile"
                    />
                  </td>
                  <td className="py-4 px-4">
                    {/* Searchable dropdown for Area */}
                    <div className="relative">
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full p-1 border rounded mb-1"
                        placeholder="Search or select area..."
                      />
                      <select
                        value={newCustomer.Area}
                        onChange={(e) => {
                          onNewCustomerChange("Area", e.target.value);
                          setSearchTerm(e.target.value); // Sync search term with selected value
                        }}
                        className="w-full p-1 border rounded"
                        required
                      >
                        <option value="" disabled>
                          Select Area
                        </option>
                        {error ? (
                          <option value="" disabled>
                            {error}
                          </option>
                        ) : (
                          filteredAreas.map((area, index) => (
                            <option key={index} value={area}>
                              {area}
                            </option>
                          ))
                        )}
                      </select>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <input
                      type="number"
                      value={newCustomer.Loan_Amt}
                      onChange={(e) =>
                        onNewCustomerChange("Loan_Amt", e.target.value)
                      }
                      className="w-full p-1 border rounded"
                      placeholder="Loan Amount"
                    />
                  </td>
                  <td className="py-4 px-4">
                    <input
                      type="number"
                      value={newCustomer.paid}
                      onChange={(e) =>
                        onNewCustomerChange("paid", e.target.value)
                      }
                      className="w-full p-1 border rounded"
                      placeholder="Paid"
                    />
                  </td>
                  <td className="py-4 px-4">
                    <input
                      type="number"
                      value={newCustomer.unpaid}
                      onChange={(e) =>
                        onNewCustomerChange("unpaid", e.target.value)
                      }
                      className="w-full p-1 border rounded"
                      placeholder="Unpaid"
                    />
                  </td>
                  <td className="py-4 px-4">
                    <input
                      type="number"
                      value={newCustomer.PPD}
                      onChange={(e) => onNewCustomerChange("PPD", e.target.value)}
                      className="w-full p-1 border rounded"
                      placeholder="PPD"
                    />
                  </td>
                  <td className="py-4 px-4">
                    <DatePicker
                      selected={
                        newCustomer.start_date
                          ? new Date(newCustomer.start_date)
                          : null
                      }
                      onChange={(date) => {
                        const localDate = date.toLocaleDateString("en-CA");
                        onNewCustomerChange("start_date", localDate);
                      }}
                      className="w-full p-1 border rounded"
                      placeholderText="Start Date"
                    />
                  </td>
                  <td className="py-4 px-4">
                    <DatePicker
                      selected={
                        newCustomer.completion_date
                          ? new Date(newCustomer.completion_date)
                          : null
                      }
                      onChange={(date) => {
                        if (!date) return;
                        const localDate = date.toLocaleDateString("en-CA");
                        onNewCustomerChange("completion_date", localDate);
                      }}
                      className="w-full p-1 border rounded"
                      placeholderText="End Date"
                    />
                  </td>
                  <td className="py-4 px-4">
                    <button
                      onClick={onAddNewCustomer}
                      className="bg-green-600 text-white px-3 py-1 rounded mr-2"
                    >
                      Post
                    </button>
                    <button
                      onClick={onCancel}
                      className="bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Cancel
                    </button>
                  </td>
                </tr>
              )}
              {customers.length === 0 ? (
                <tr>
                  <td colSpan="10" className="text-center py-8 text-gray-500">
                    No loans found for this MoneyLenderId.
                  </td>
                </tr>
              ) : (
                customers.map((customer) => (
                  <tr key={customer.Id} className="border-b hover:bg-gray-50">
                    <td className="py-4 px-4">{customer.Cus_Id}</td>
                    <td className="py-4 px-4">{customer.Cus_Name}</td>
                    <td className="py-4 px-4">{customer.Mobile_No}</td>
                    <td className="py-4 px-4">{customer.Area}</td>
                    <td className="py-4 px-4">₹{customer.Loan_Amt}</td>
                    <td className="py-4 px-4 text-green-600">₹{customer.paid}</td>
                    <td className="py-4 px-4 text-red-600">₹{customer.unpaid}</td>
                    <td className="py-4 px-4">{customer.PPD}</td>
                    <td className="py-4 px-4">
                      {formatDate(customer.start_date)}
                    </td>
                    <td className="py-4 px-4">
                      {formatDate(customer.completion_date)}
                    </td>
                    <td className="py-4 px-4">
                      <PaymentCalendar
                        loanId={customer.LoanId}
                        cusId={customer.Cus_Id}
                        ppd={customer.PPD}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Charts Section
const ChartsSection = ({ customers ,profile}) => {
  if (!customers || customers.length === 0) return null;
console.log("Profile Data inside ChartSection:", profile);
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <ChartCard
        title="Payment Trends"
        id="paymentChart"
        customers={customers}
        moneyLenderId={profile.uid}
        type="payment"
      />
      <ChartCard
        title="Area Distribution"
        id="areaChart"
        customers={customers}
        moneyLenderId={profile.uid}
        type="area"
      />
    </div>
  );
};

const ChartCard = ({ title, id, customers: propCustomers, type, moneyLenderId }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const [customers, setCustomers] = useState(propCustomers || []);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Utility function for area chart to generate random colors
  const getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  // Helper function to format date as "DD MMM YYYY" (e.g., "28 Feb 2025")
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const day = date.getDate().toString().padStart(2, "0");
    const month = date.toLocaleString("en-US", { month: "short" }); // e.g., "Feb"
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  // Set default date range (last 7 days)
  const today = new Date();
  const endDate = today.toISOString().split("T")[0]; // YYYY-MM-DD format
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 6); // 7 days including today
  const defaultStartDate = startDate.toISOString().split("T")[0];

  // Generate all dates in the range
  const generateDateRange = (start, end) => {
    const dates = [];
    let currentDate = new Date(start);
    const endDateObj = new Date(end);
    while (currentDate <= endDateObj) {
      dates.push(currentDate.toISOString().split("T")[0]);
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return dates;
  };

  const dateRange = generateDateRange(defaultStartDate, endDate);

  // Fetch data for payment chart
  useEffect(() => {
    if (type === "payment") {
      const fetchData = async () => {
        try {
          setLoading(true);
          // Fetch data from both APIs with date range
          const [collectResponse, metricsResponse] = await Promise.all([
            axios.get(
              `${API_BASE_URL}/DailyLoanCollect/payment/total-collected?MoneyLenderId=${moneyLenderId}&startDate=${defaultStartDate}&endDate=${endDate}`,
              { withCredentials: true }
            ),
            axios.get(
              `${API_BASE_URL}/GraphMetric/admin/loan-metrics/${moneyLenderId}?startDate=${defaultStartDate}&endDate=${endDate}`,
              { withCredentials: true }
            ),
          ]);

          const collectData = collectResponse.data.loanCollections || [];
          const metricsData = metricsResponse.data.metrics || [];

          // Combine data into a unified format
          const combinedData = {};

          // First, populate with CollectedAmount (Received Amount)
          collectData.forEach((item) => {
            combinedData[item.CollectDate] = {
              date: item.CollectDate,
              expected: 0,
              received: parseFloat(item.CollectedAmount) || 0,
            };
          });

          // Then, add RequiredAmount (Expected Amount) without overwriting Received Amount
          metricsData.forEach((item) => {
            const date = item.MetricDate;
            if (!combinedData[date]) {
              combinedData[date] = {
                date,
                expected: 0,
                received: 0, // Will remain 0 unless collectData has a value for this date
              };
            }
            combinedData[date].expected = parseFloat(item.RequiredAmount) || 0;
            // Do not overwrite received from collectData; only set if not already set
            if (!combinedData[date].received) {
              combinedData[date].received = parseFloat(item.PaidAmount) || 0;
            }
          });

          // Ensure all dates in the range are present
          let lastExpectedAmount = 0; // Track the last known RequiredAmount
          const filledData = dateRange.map((date) => {
            if (combinedData[date]) {
              // If data exists for this date, update lastExpectedAmount
              lastExpectedAmount = combinedData[date].expected || lastExpectedAmount;
              return {
                date,
                expected: combinedData[date].expected || lastExpectedAmount,
                received: combinedData[date].received || 0,
              };
            } else {
              // If no data for this date, use last known expected amount
              return {
                date,
                expected: lastExpectedAmount,
                received: 0,
              };
            }
          });

          setCustomers(filledData);
        } catch (err) {
          setError("Failed to fetch chart data");
          console.error("Error fetching chart data:", err);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    } else {
      // For area chart, use propCustomers and set loading to false immediately
      setCustomers(propCustomers || []);
      setLoading(false);
    }
  }, [type, defaultStartDate, endDate, propCustomers, moneyLenderId]);

  useEffect(() => {
    if (chartRef.current && !loading && customers.length > 0) {
      if (chartInstance.current) {
        chartInstance.current.dispose();
      }
      chartInstance.current = echarts.init(chartRef.current);

      let option = {};
      console.log("Customers data:", customers); // Debug: Check customers data

      if (type === "payment") {
        const dates = customers.map((c) => c.date);
        const expectedData = customers.map((c) => c.expected || 0);
        const receivedData = customers.map((c) => c.received || 0);

        option = {
          tooltip: {
            trigger: "axis",
            formatter: "{b}<br/>{a0}: ₹{c0}<br/>{a1}: ₹{c1}",
          },
          legend: {
            data: ["Expected Amount", "Received Amount"],
            top: 10,
          },
          xAxis: {
            type: "category",
            data: dates.map(formatDate), // Format dates for x-axis
            axisLabel: { rotate: 45 },
          },
          yAxis: {
            type: "value",
            axisLabel: { formatter: "₹{value}" },
          },
          series: [
            {
              name: "Expected Amount",
              type: "line",
              smooth: true,
              data: expectedData,
              lineStyle: { color: "#4F46E5" },
              areaStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: "rgba(79, 70, 229, 0.3)" },
                  { offset: 1, color: "rgba(79, 70, 229, 0)" },
                ]),
              },
            },
            {
              name: "Received Amount",
              type: "line",
              smooth: true,
              data: receivedData,
              lineStyle: { color: "#10B981" },
              areaStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: "rgba(16, 185, 129, 0.3)" },
                  { offset: 1, color: "rgba(16, 185, 129, 0)" },
                ]),
              },
            },
          ],
        };
      } else if (type === "area") {
        const areaData = customers.reduce((acc, customer) => {
          acc[customer.Area] = (acc[customer.Area] || 0) + (parseFloat(customer.Loan_Amt) || 0);
          return acc;
        }, {});

        const areaColors = {};
        Object.keys(areaData).forEach((area) => {
          areaColors[area] = getRandomColor();
        });

        option = {
          tooltip: {
            trigger: "item",
            formatter: "{b}: ₹{c} ({d}%)",
          },
          legend: {
            top: "bottom",
            data: Object.keys(areaData),
          },
          series: [
            {
              type: "pie",
              radius: ["40%", "70%"],
              label: { show: true, position: "outside" },
              data: Object.entries(areaData).map(([name, value]) => ({
                name,
                value,
                itemStyle: { color: areaColors[name] },
              })),
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: "rgba(0, 0, 0, 0.5)",
                },
              },
            },
          ],
        };
      }

      console.log("Chart option:", option);
      if (option && Object.keys(option).length > 0) {
        chartInstance.current.setOption(option);
      }

      const handleResize = () => {
        if (chartInstance.current) {
          chartInstance.current.resize();
        }
      };
      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
        if (chartInstance.current) {
          chartInstance.current.dispose();
        }
      };
    }
  }, [customers, loading, type]);

  if (loading) return <div className="bg-white rounded-xl shadow-sm p-6 h-96 flex items-center justify-center">Loading data...</div>;
  if (error) return <div className="bg-white rounded-xl shadow-sm p-6 h-96 flex items-center justify-center text-red-500">{error}</div>;
  if (customers.length === 0) return <div className="bg-white rounded-xl shadow-sm p-6 h-96 flex items-center justify-center text-gray-500">No data available</div>;

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h4 className="text-lg font-semibold mb-4">{title}</h4>
      <div ref={chartRef} id={id} className="h-96" />
      {type === "payment" && (
        <div className="mt-6">
          <h5 className="text-md font-semibold mb-2">Payment Data</h5>
          <table className="min-w-full border-collapse border border-gray-200">
            <thead>
              <tr>
                <th className="border border-gray-300 p-2 text-left">Date</th>
                <th className="border border-gray-300 p-2 text-left">Expected Amount (₹)</th>
                <th className="border border-gray-300 p-2 text-left">Received Amount (₹)</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer.date}>
                  <td className="border border-gray-300 p-2">{formatDate(customer.date)}</td>
                  <td className="border border-gray-300 p-2">{customer.expected.toFixed(2)}</td>
                  <td className="border border-gray-300 p-2">{customer.received.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default LoanDashboard;
