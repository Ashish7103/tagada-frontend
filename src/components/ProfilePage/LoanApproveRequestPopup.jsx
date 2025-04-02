import React, { useState } from "react";
import axios from "axios";
const API_BASE_URL ="https://tagada.onrender.com";

const LoanApproveRequestPopup = ({ loan, onClose, uid }) => {
  const [amount, setAmount] = useState(loan.LoanAmount);
  const [amountError, setAmountError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAmountChange = (e) => {
    setAmount(e.target.value);
    if (amountError) setAmountError("");
  };

  const handleCreateRequest = async () => {
    if (!amount) {
      setAmountError("Amount is required");
      return;
    }

    const payload = {
      LoanId: loan.LoanId,
      Cus_Id: uid, // Use uid passed as prop
      Amount: parseFloat(amount),
    };

    setIsSubmitting(true);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/paymentRequest/payment/request`,
        payload,
        { withCredentials: true, headers: { "Content-Type": "application/json" } }
      );
      console.log("Payment request created successfully:", response.data);
      alert("Payment request created successfully!");
      onClose();
    } catch (error) {
      console.error("Failed to create payment request:", error);
      alert(
        error.response?.data?.error ||
          "An error occurred while creating the payment request."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      id="overlay"
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg w-[480px] shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-gray-200 pb-4">
            <h2 className="text-xl font-semibold text-gray-800">Loan Details</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Loan ID</label>
              <input
                type="text"
                value={loan.LoanId}
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none bg-gray-100"
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Customer ID</label>
              <input
                type="text"
                value={uid}
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none bg-gray-100"
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
              <input
                type="text"
                value={amount}
                onChange={handleAmountChange}
                className={`w-full border ${
                  amountError ? "border-red-500" : "border-gray-300"
                } rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-custom focus:border-transparent`}
                required
              />
              {amountError && (
                <div className="text-red-500 text-sm mt-1">{amountError}</div>
              )}
            </div>
          </div>
          <div className="flex justify-between pt-4 border-t border-gray-200">
            <button
              onClick={handleCreateRequest}
              disabled={isSubmitting}
              className="!rounded-button px-4 py-2 bg-green-600 text-white hover:bg-opacity-90 disabled:bg-opacity-50"
            >
              {isSubmitting ? "Creating..." : "Create Request"}
            </button>
            <button
              onClick={onClose}
              className="!rounded-button px-4 py-2 bg-red-600 text-white hover:bg-opacity-90"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoanApproveRequestPopup;