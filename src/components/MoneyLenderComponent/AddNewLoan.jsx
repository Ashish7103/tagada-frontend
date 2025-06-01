import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Navbar from "./Navbar";
const API_BASE_URL ="https://tagada.onrender.com";

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
  });
  const [searchTerm, setSearchTerm] = useState(""); // State for search input
  const [moneyLenderId, setMoneyLenderId] = useState(null); // State for moneyLenderId
  const [areas, setAreas] = useState([]); // State for areas
  const [loadingProfile, setLoadingProfile] = useState(true); // State for loading profile
  const [loadingAreas, setLoadingAreas] = useState(true); // State for loading areas
  const [error, setError] = useState(null); // State for errors

  // Fetch moneyLenderId (profile.uid) from /profile/user
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        console.log("Fetching profile data..."); // Debug log
        const response = await axios.get(`${API_BASE_URL}/profile/user`, {
          withCredentials: true,
        });
        console.log("Profile Response:", response.data); // Debug log
        setMoneyLenderId(response.data.user.uid);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to fetch profile");
        console.error("Profile Fetch Error:", err); // Debug log
      } finally {
        setLoadingProfile(false);
      }
    };

    fetchProfile();
  }, []); // Run once on mount

  // Fetch areas using moneyLenderId
  useEffect(() => {
    const fetchAreas = async () => {
      if (!moneyLenderId) {
        console.log("moneyLenderId not available, skipping fetchAreas"); // Debug log
        return;
      }

      try {
        console.log(`Fetching areas for moneyLenderId: ${moneyLenderId}`); // Debug log
        const response = await axios.get(
          `${API_BASE_URL}/moneylender/get-areas/${moneyLenderId}`
        );
        console.log("Areas Response:", response.data); // Debug log
        if (response.data && Array.isArray(response.data.areas)) {
          setAreas(response.data.areas);
        } else {
          setError("Invalid API response: areas not found");
          console.error("Invalid areas response:", response.data); // Debug log
        }
      } catch (err) {
        setError("Failed to fetch areas: " + err.message);
        console.error("Areas Fetch Error:", err); // Debug log
      } finally {
        setLoadingAreas(false);
      }
    };

    if (moneyLenderId) {
      fetchAreas();
    }
  }, [moneyLenderId]); // Depend on moneyLenderId to fetch areas after it's available

  // Filter areas based on search term
  const filteredAreas = Array.isArray(areas)
    ? areas.filter((area) =>
        area.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  // Handle input change for new customer
  const handleNewCustomerChange = (field, value) => {
    setNewCustomer((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Post new customer to backend and update daily metrics
  const handleAddNewCustomer = async () => {
    if (!moneyLenderId) {
      setError("MoneyLenderId not available. Please try again.");
      return;
    }

    try {
      // Step 1: Add the new loan
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

      if (loanResponse.status === 200 || loanResponse.status === 201) {
        console.log("Loan API Response:", loanResponse.data); // Debug log

        // Step 2: Call the /admin/daily-metrics API to update daily metrics
        try {
          const metricsResponse = await axios.post(
            `${API_BASE_URL}/GraphMetric/admin/daily-metrics`,
            {}, // No body required as per the backend route
            { withCredentials: true } // Include credentials if needed
          );
          console.log("Daily Metrics API Response:", metricsResponse.data); // Debug log
        } catch (metricsError) {
          console.error("Error updating daily metrics:", metricsError);
          // Optionally set an error message, but don't block the user flow
          setError("Loan created, but failed to update daily metrics.");
        }

        // Step 3: Reset the form and navigate
        setNewCustomer({
          Cus_Id: "",
          Area: "",
          Loan_Amt: "",
          paid: "",
          unpaid: "",
          PPD: "",
          start_date: "",
          completion_date: "",
        });

        // Display success message and navigate after a short delay
        setError("Loan created successfully");
        setTimeout(() => navigate("/overview"), 1000); // Navigate after 2 seconds to show the message
      }
    } catch (err) {
      setError("Failed to add new customer");
      console.error("Error adding customer:", err);
    }
  };

  // Handle cancel button click
  const handleCancel = () => {
    navigate("/add-loan"); // Navigate to dashboard
  };

  if (loadingProfile || loadingAreas) {
    return <div className="p-8 text-gray-600">Loading...</div>;
  }

  if (error) {
    return <div className="p-8 text-red-500">{error}</div>;
  }

  return (
  <div>
     <Navbar   />
     <div className="bg-white rounded-lg shadow-md p-6 mb-4 mt-20 max-w-md mx-auto">
      <h3 className="text-lg font-semibold mb-4 text-center">Add New Loan</h3>
      {error && <div className="text-red-500 mb-4 text-center">{error}</div>}

      {/* Form Fields */}
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
                setSearchTerm(e.target.value); // Sync search term with selected value
              }}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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