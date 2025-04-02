import React from "react";
// import QRCodeGenerator from "./QRCodeGenerator";
import NavbarLoanTaker from "./NavbarLoanTaker";
const UserProfile = ({ user }) => {
  return (
<div>
    <NavbarLoanTaker profile={user} />
    <div className="bg-white shadow rounded-lg p-6 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div>
            <h1 className="text-2xl font-bold">{user.name}</h1>
            <div className="flex items-center mt-1">
              <span className="text-gray-600 mr-4">ID: #{user.uid}</span>
              <span className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-green-100 text-green-800">
                <i className="fas fa-check-circle mr-2"></i>
                Highly Reliable
              </span>
            </div>
          </div>
        </div>
        {/* <QRCodeGenerator /> */}
      </div>
    </div>
    </div>
  );
};

export default UserProfile;