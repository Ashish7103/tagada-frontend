import React, { useEffect, useState } from "react";
import axios from "axios";
import ChartCard from "./ChartCard";
import Navbar from "./Navbar";
const API_BASE_URL ="https://tagada.onrender.com";
const ChartsSection = () => {
  const [customers, setCustomers] = useState([]);
  const [profile, setProfile] = useState(null);
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
      }
    };
    fetchProfile();
  }, []);

  // Fetch customers data
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
      setError("Failed to fetch customers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (profile) fetchCustomers();
  }, [profile]);

  // Render loading, error, or empty states
  if (loading) {
    return (
      <div className="p-8 text-gray-600 text-center">
        Loading charts data...
      </div>
    );
  }
  if (error) {
    return (
      <div className="p-8 text-red-500 text-center">
        {error}
      </div>
    );
  }
  if (!customers || customers.length === 0) {
    return (
      <div className="p-8 text-gray-500 text-center">
        No data available for charts
      </div>
    );
  }

  return (
    <div>
      <Navbar profile={profile || {}} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

      <ChartCard
        title="Area Distribution"
        id="areaChart"
        customers={customers}
        moneyLenderId={profile.uid}
        type="area"
      />
      <ChartCard
        title="Payment Trends"
        id="paymentChart"
        customers={customers}
        moneyLenderId={profile.uid}
        type="payment"
      />
    </div>
    </div>
    
  );
};

export default ChartsSection;