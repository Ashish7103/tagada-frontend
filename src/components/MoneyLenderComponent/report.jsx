import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Navbar from "./Navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarAlt } from "@fortawesome/free-solid-svg-icons";

const API_BASE_URL = "https://tagada.onrender.com";

const DownloadReport = () => {
  const navigate = useNavigate();
  const [reportParams, setReportParams] = useState({
    uid: "",
    startDate: null,
    endDate: null,
  });
  const [downloadLink, setDownloadLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [moneyLenderId, setMoneyLenderId] = useState(null);
  const [isDownloaded, setIsDownloaded] = useState(false); // New state to track download

  // Fetch moneyLenderId from /profile/user
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        console.log("Fetching profile data..."); // Debug log
        const response = await axios.get(`${API_BASE_URL}/profile/user`, {
          withCredentials: true,
        });
        console.log("Profile Response:", response.data); // Debug log
        setMoneyLenderId(response.data.user.uid);
        setReportParams((prev) => ({ ...prev, uid: response.data.user.uid }));
      } catch (err) {
        setError(err.response?.data?.error || "Failed to fetch profile");
        console.error("Profile Fetch Error:", err); // Debug log
      }
    };

    fetchProfile();
  }, []);

  // Handle date changes
  const handleDateChange = (field, date) => {
    const localDate = date ? date.toLocaleDateString("en-CA") : null;
    setReportParams((prev) => ({
      ...prev,
      [field]: localDate,
    }));
  };

  // Generate report and fetch download link
  const handleGenerateReport = async () => {
    if (!reportParams.uid || !reportParams.startDate || !reportParams.endDate) {
      setError("Please select UID, start date, and end date.");
      return;
    }

    setLoading(true);
    setError(null);
    setIsDownloaded(false); // Reset download state when generating a new report

    try {
      console.log("Generating report with params:", reportParams); // Debug log
      const response = await axios.get(
        `${API_BASE_URL}/payment/export-excel?uid=${reportParams.uid}&startDate=${reportParams.startDate}&endDate=${reportParams.endDate}`,
        {
          withCredentials: true,
        }
      );
      console.log("Report Response:", response.data); // Debug log
      if (response.data.downloadLink) {
        setDownloadLink(response.data.downloadLink);
      } else if (response.data && (!response.data.downloadLink || (Array.isArray(response.data) && response.data.length === 0))) {
        // Check for no records
        setError("No record found between selected dates");
      } else {
        throw new Error("Unexpected response format");
      }
    } catch (err) {
      setError(`Failed to generate report: ${err.message}`);
      console.error("Report Generation Error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Handle download
  const handleDownload = () => {
    if (downloadLink && !isDownloaded) {
      window.location.href = downloadLink; // Trigger download
      setIsDownloaded(true); // Disable further clicks
    }
  };

  // Handle cancel
  const handleCancel = () => {
    navigate("/overview"); // Navigate back to overview or dashboard
  };

  if (loading) {
    return (
      <div className="p-8 text-gray-600">
        <Navbar />
        <div className="mt-20">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-red-500">
        <Navbar />
        <div className="mt-20">{error}</div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="bg-white rounded-lg shadow-md p-6 mb-4 mt-20 max-w-md mx-auto">
        <h3 className="text-lg font-semibold mb-4 text-center">Generate Report</h3>
        {error && <div className="text-red-500 mb-4 text-center">{error}</div>}

        {/* Form Fields */}
        <div className="space-y-4">
          {/* UID (Read-only if fetched from profile) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Money Lender ID
            </label>
            <input
              type="text"
              value={reportParams.uid || ""}
              readOnly
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100"
              placeholder="Fetching UID..."
            />
          </div>

          {/* Start Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <div className="relative flex items-center">
              <DatePicker
                selected={reportParams.startDate ? new Date(reportParams.startDate) : null}
                onChange={(date) => handleDateChange("startDate", date)}
                className="w-full p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholderText="Select Start Date"
                dateFormat="yyyy-MM-dd"
              />
              <div className="bg-gray-50 border border-l-0 border-gray-200 rounded-r-md flex items-center justify-center p-2 cursor-pointer">
                <FontAwesomeIcon
                  icon={faCalendarAlt}
                  className="text-gray-500"
                  onClick={() => document.querySelector('input[placeholder="Select Start Date"]').focus()}
                />
              </div>
            </div>
          </div>

          {/* End Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Date
            </label>
            <div className="relative flex items-center">
              <DatePicker
                selected={reportParams.endDate ? new Date(reportParams.endDate) : null}
                onChange={(date) => handleDateChange("endDate", date)}
                className="w-full p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholderText="Select End Date"
                dateFormat="yyyy-MM-dd"
              />
              <div className="bg-gray-50 border border-l-0 border-gray-200 rounded-r-md flex items-center justify-center p-2 cursor-pointer">
                <FontAwesomeIcon
                  icon={faCalendarAlt}
                  className="text-gray-500"
                  onClick={() => document.querySelector('input[placeholder="Select End Date"]').focus()}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-between mt-6">
          <button
            onClick={handleGenerateReport}
            className="w-1/2 bg-green-600 text-white py-2 rounded-md mr-2 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            disabled={loading}
          >
            Generate Report
          </button>
          <button
            onClick={handleCancel}
            className="w-1/2 bg-red-600 text-white py-2 rounded-md ml-2 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
            disabled={loading}
          >
            Cancel
          </button>
        </div>

        {downloadLink && (
          <div className="mt-4">
            <button
              onClick={handleDownload}
              className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isDownloaded} // Disable button after first click
            >
              Download Report
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DownloadReport;