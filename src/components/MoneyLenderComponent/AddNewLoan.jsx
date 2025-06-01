import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Navbar from "./Navbar";
const API_BASE_URL = "https://tagada.onrender.com";

const AddNewLoan = () => {
  const navigate = useNavigate();
  const [newCustomer, setNewCustomer] = useState({
    Cus_Id: "",
    Area: "",
    Loan_Amt: "",
    paid: "",
    unpaid: "",
    PPD: "",
    start_date: "",
    completion_date: "",
    nickname: "" // Added nickname field
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [moneyLenderId, setMoneyLenderId] = useState(null);
  const [areas, setAreas] = useState([]);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingAreas, setLoadingAreas] = useState(true);
  const [error, setError] = useState(null);
  const [nicknameError, setNicknameError] = useState(""); // For nickname validation

  // Fetch moneyLenderId (profile.uid) from /profile/user
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/profile/user`, {
          withCredentials: true,
        });
        setMoneyLenderId(response.data.user.uid);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to fetch profile");
      } finally {
        setLoadingProfile(false);
      }
    };

    fetchProfile();
  }, []);

  // Fetch areas using moneyLenderId
  useEffect(() => {
    const fetchAreas = async () => {
      if (!moneyLenderId) return;

      try {
        const response = await axios.get(
          `${API_BASE_URL}/moneylender/get-areas/${moneyLenderId}`
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

    if (moneyLenderId) {
      fetchAreas();
    }
  }, [moneyLenderId]);

  const filteredAreas = Array.isArray(areas)
    ? areas.filter((area) =>
        area.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const handleNewCustomerChange = (field, value) => {
    setNewCustomer((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear nickname error when user types
    if (field === "nickname") {
      setNicknameError("");
    }
  };

  const validateNickname = () => {
    if (!newCustomer.nickname) {
      setNicknameError("Nickname is required");
      return false;
    }
    if (newCustomer.nickname.length > 50) {
      setNicknameError("Nickname must be less than 50 characters");
      return false;
    }
    return true;
  };

  const handleAddNewCustomer = async () => {
    if (!moneyLenderId) {
      setError("MoneyLenderId not available. Please try again.");
      return;
    }

    // Validate nickname
    if (!validateNickname()) {
      return;
    }

    try {
      const loanResponse = await axios.post(
        `${API_BASE_URL}/moneylender/add`,
        {
          ...newCustomer,
          Cus_Id: parseInt(newCustomer.Cus_Id),
          Loan_Amt: parseFloat(newCustomer.Loan_Amt),
          paid: parseFloat(newCustomer.paid),
          unpaid: parseFloat(newCustomer.unpaid),
          PPD: parseInt(newCustomer.PPD),
          UserId: moneyLenderId,
          start_date: newCustomer.start_date,
          completion_date: newCustomer.completion_date,
          nickname: newCustomer.nickname // Include nickname
        }
      );

      if (loanResponse.status === 200 || loanResponse.status === 201) {
        try {
          await axios.post(
            `${API_BASE_URL}/GraphMetric/admin/daily-metrics`,
            {},
            { withCredentials: true }
          );
        } catch (metricsError) {
          console.error("Error updating daily metrics:", metricsError);
          setError("Loan created, but failed to update daily metrics.");
        }

        setNewCustomer({
          Cus_Id: "",
          Area: "",
          Loan_Amt: "",
          paid: "",
          unpaid: "",
          PPD: "",
          start_date: "",
          completion_date: "",
          nickname: "" // Reset nickname
        });

        setError("Loan created successfully");
        setTimeout(() => navigate("/overview"), 1000);
      }
    } catch (err) {
      if (err.response?.data?.error?.includes("Nickname already exists")) {
        setNicknameError(err.response.data.error);
      } else {
        setError(err.response?.data?.error || "Failed to add new customer");
      }
    }
  };

  const handleCancel = () => {
    navigate("/add-loan");
  };

  if (loadingProfile || loadingAreas) {
    return <div className="p-8 text-gray-600">Loading...</div>;
  }

  if (error) {
    return <div className="p-8 text-red-500">{error}</div>;
  }

  return (
    <div>
      <Navbar />
      <div className="bg-white rounded-lg shadow-md p-6 mb-4 mt-20 max-w-md mx-auto">
        <h3 className="text-lg font-semibold mb-4 text-center">Add New Loan</h3>
        {error && <div className="text-red-500 mb-4 text-center">{error}</div>}

        <div className="space-y-4">
          {/* Customer ID */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Customer ID
            </label>
            <input
              type="number"
              value={newCustomer.Cus_Id}
              onChange={(e) => handleNewCustomerChange("Cus_Id", e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter Customer ID"
            />
          </div>

          {/* Nickname */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nickname (Unique Identifier)
            </label>
            <input
              type="text"
              value={newCustomer.nickname}
              onChange={(e) => handleNewCustomerChange("nickname", e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter a unique nickname for this loan"
              maxLength={50}
            />
            {nicknameError && (
              <div className="text-red-500 text-sm mt-1">{nicknameError}</div>
            )}
          </div>

          {/* Area */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Area
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md mb-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Search or select area..."
              />
              <select
                value={newCustomer.Area}
                onChange={(e) => {
                  handleNewCustomerChange("Area", e.target.value);
                  setSearchTerm(e.target.value);
                }}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="" disabled>
                  Select Area
                </option>
                {filteredAreas.map((area, index) => (
                  <option key={index} value={area}>
                    {area}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Loan Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Loan Amount (₹)
            </label>
            <input
              type="number"
              value={newCustomer.Loan_Amt}
              onChange={(e) => handleNewCustomerChange("Loan_Amt", e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter Loan Amount"
            />
          </div>

          {/* Paid Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Paid Amount (₹)
            </label>
            <input
              type="number"
              value={newCustomer.paid}
              onChange={(e) => handleNewCustomerChange("paid", e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter Paid Amount"
            />
          </div>

          {/* Unpaid Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Unpaid Amount (₹)
            </label>
            <input
              type="number"
              value={newCustomer.unpaid}
              onChange={(e) => handleNewCustomerChange("unpaid", e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter Unpaid Amount"
            />
          </div>

          {/* PPD (Per Payment Day) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Installment (PPD)
            </label>
            <input
              type="number"
              value={newCustomer.PPD}
              onChange={(e) => handleNewCustomerChange("PPD", e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter PPD"
            />
          </div>

          {/* Start Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <DatePicker
              selected={
                newCustomer.start_date ? new Date(newCustomer.start_date) : null
              }
              onChange={(date) => {
                const localDate = date.toLocaleDateString("en-CA");
                handleNewCustomerChange("start_date", localDate);
              }}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholderText="Select Start Date"
            />
          </div>

          {/* Completion Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Date
            </label>
            <DatePicker
              selected={
                newCustomer.completion_date
                  ? new Date(newCustomer.completion_date)
                  : null
              }
              onChange={(date) => {
                if (!date) return;
                const localDate = date.toLocaleDateString("en-CA");
                handleNewCustomerChange("completion_date", localDate);
              }}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholderText="Select End Date"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-between mt-6">
          <button
            onClick={handleAddNewCustomer}
            className="w-1/2 bg-green-600 text-white py-2 rounded-md mr-2 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Post
          </button>
          <button
            onClick={handleCancel}
            className="w-1/2 bg-red-600 text-white py-2 rounded-md ml-2 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddNewLoan;