import React, { useEffect, useState } from "react";
import axios from "axios";
import NavbarLoanTaker from "./NavbarLoanTaker";
import UserProfile from "./UserProfile";
import PersonalInformationLoanTaker from "./PersonalInformation";
import ReliabilityChart from "./ReliabilityChart";
import LoansOverview from "./LoansOverview";
import LoanHistory from "./LoanHistory";
const API_BASE_URL ="https://tagada.onrender.com";

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/profile/user`, {
          withCredentials: true,
        });
        setProfile(response.data.user); // Assume response.data.user contains uid, name, email, etc.
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to fetch profile");
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error) return <div className="text-center py-8 text-red-500">Error: {error}</div>;

  return (
    <div className="bg-gray-50 font-sans min-h-screen">
      {/* <NavbarLoanTaker profile={profile}/> */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <UserProfile user={profile} />
        {/* <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 md:col-span-4"> */}
            {/* <PersonalInformationLoanTaker />
            <ReliabilityChart /> */}
          {/* </div> */}
          {/* <div className="col-span-12 md:col-span-8">
            <LoansOverview />
            <LoanHistory  /> {/* Pass profile instead of just uid */}
          {/* </div> */}
        {/* </div> */}
      </main>
    </div>
  );
};

export default ProfilePage;