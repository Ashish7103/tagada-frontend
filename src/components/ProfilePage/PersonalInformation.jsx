import React, { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import NavbarLoanTaker from "./NavbarLoanTaker";
const API_BASE_URL ="https://tagada.onrender.com";

const PersonalInformationLoanTaker = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  if (loading) return <div className="p-8 text-gray-600">Loading data...</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;

  return (
    <div className="bg-gray-50 min-h-screen">
      <NavbarLoanTaker profile={profile || {}} />
      <main className="mt-14 p-4 max-w-8xl mx-auto min-h-screen">
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Personal Information</h2>
            <button className="text-black">
              <FontAwesomeIcon icon={faEdit} />
            </button>
          </div>
          <div className="space-y-4">
            <div className="flex flex-col">
              <label className="text-sm text-gray-600 mb-1">UID</label>
              <p className="text-gray-900">{profile?.uid || "N/A"}</p>
            </div>
            <div className="flex flex-col">
              <label className="text-sm text-gray-600 mb-1">Phone</label>
              <p className="text-gray-900">{profile?.phoneNumber || "N/A"}</p>
            </div>
            <div className="flex flex-col">
              <label className="text-sm text-gray-600 mb-1">Email</label>
              <p className="text-gray-900">{profile?.email || "N/A"}</p>
            </div>
            <div className="flex flex-col">
              <label className="text-sm text-gray-600 mb-1">Address</label>
              <p className="text-gray-900">1234 Maple Avenue, Apt 5B</p>
              <p className="text-gray-900">Brooklyn, NY 11201</p>
            </div>
            <div className="flex flex-col">
              <label className="text-sm text-gray-600 mb-1">Date of Birth</label>
              <p className="text-gray-900">March 15, 1988</p>
            </div>
          </div>
        </div>
        
      </main>
    </div>
  );
};

export default PersonalInformationLoanTaker;
