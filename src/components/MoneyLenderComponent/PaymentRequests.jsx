import React, { useEffect, useState } from "react";
import axios from "axios";
const API_BASE_URL ="https://tagada.onrender.com";

const PaymentRequests = ({ profile }) => {
  const [requests, setRequests] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/paymentRequest/getAllPaymentRequest?Status=Pending&MoneyLenderId=${profile.uid}`,
          { withCredentials: true }
        );
        setRequests(response.data.requests || []);
      } catch (err) {
        setRequests([]);
      }
    };
    if (profile && profile.uid) fetchRequests();
  }, [profile]);

  const handleApprove = async (requestId) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/paymentApprove/payment/approve`,
        { RequestId: requestId, Approve: true },
        { withCredentials: true }
      );
      alert(response.data.message);
      setRequests(requests.filter((r) => r.RequestId !== requestId));
    } catch (err) {
      alert("Failed to process request");
    }
  };

  const handleReject = async (requestId) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/paymentApprove/payment/approve`,
        { RequestId: requestId, Approve: false },
        { withCredentials: true }
      );
      alert(response.data.message);
      setRequests(requests.filter((r) => r.RequestId !== requestId));
    } catch (err) {
      alert("Failed to process request");
    }
  };

  return (
    <div>
     <button
          onClick={() => setIsModalOpen(true)}
          className="w-full bg-black text-white py-3 px-4 rounded-lg flex items-center justify-center space-x-2"
        >
          <span>View Payment Requests</span>
          <span className="bg-indigo-700 text-white text-xs px-2 py-1 rounded-full">
            {requests.length}
          </span>
        </button>
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-4xl max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Payment Requests</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-gray-700 text-xl">×</button>
            </div>
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
                    <tr key={req.RequestId} className="border-b hover:bg-gray-50">
                      <td className="py-4 px-4">{req.RequestId}</td>
                      <td className="py-4 px-4">{req.LoanId}</td>
                      <td className="py-4 px-4">{req.Cus_Id}</td>
                      <td className="py-4 px-4">₹{req.Amount}</td>
                      <td className="py-4 px-4">{new Date(req.RequestDate).toLocaleDateString()}</td>
                      {console.log( "action buttonreq")}
                      <td className="py-4 px-4">
                        <button onClick={() => handleApprove(req.RequestId)} className="bg-green-600 text-white px-3 py-1 rounded mr-2">Approve</button>
                        <button onClick={() => handleReject(req.RequestId)} className="bg-red-600 text-white px-3 py-1 rounded">Reject</button>
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

export default PaymentRequests;