import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faTimes,
  faUser,
  faInfoCircle,
  faMapMarkerAlt,
  faQrcode,
  faChartLine,
  faChartBar,
  faPlusCircle,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

const NavbarLoanTaker = ({ profile }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showQRPopup, setShowQRPopup] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState("");

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const generateQRCode = () => {
    const data = Math.floor(100000 + Math.random() * 900000);
    const url = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${profile?.uid}`;
    setQrCodeUrl(url);
    setShowQRPopup(true);
  };

  const closeQRPopup = () => {
    setShowQRPopup(false);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 w-full bg-white shadow-sm z-50">
        <div className="max-w-8xl mx-auto px-4 h-14 flex items-center justify-center relative">
          {/* Menu Button (Left) */}
          <button
            onClick={toggleSidebar}
            className="text-gray-600 absolute left-4"
          >
            <FontAwesomeIcon icon={faBars} className="text-xl" />
          </button>

          {/* Logo (Center) */}
          <h1 className="font-['Pacifico'] text-2xl text-black">tagada</h1>

          {/* QR Code Icon (Right) */}
          <button
            onClick={generateQRCode}
            className="text-gray-600 hover:text-gray-800 absolute right-4"
          >
            <FontAwesomeIcon icon={faQrcode} className="text-xl" />
          </button>
        </div>
      </nav>

      {/* QR Code Popup */}
      {showQRPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg relative max-w-sm w-full">
            <button
              onClick={closeQRPopup}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl bg-transparent border-none cursor-pointer"
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
            <h3 className="text-lg font-medium mb-4">Generated QR Code</h3>
            {qrCodeUrl && (
              <img
                src={qrCodeUrl}
                alt="QR Code"
                className="mx-auto border border-gray-200 p-2"
              />
            )}
            <p className="mt-4 text-gray-500">Scan this QR code</p>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 w-64 h-full bg-white shadow-lg transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out z-50`}
      >
        <div className="p-4 h-screen overflow-y-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-semibold">Menu</h2>
            <button onClick={toggleSidebar} className="text-gray-600">
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>
          <div className="space-y-4">
            {[
             { icon: faUser, text: "Profile", path: "/profile" },
                           { icon: faInfoCircle, text: "Personal Information", path: "/profile/profile-information" },
                           { icon: faChartBar, text: "Overview", path: "/profile/LoanOverview" },
                           { icon: faChartLine, text: "Reliability Index", path: "/profile/relibility" },
                           { icon: faSignOutAlt, text: "Logout", path: "/logout" },
            ].map((item, index) => (
              <Link
                key={index}
                to={item.path}
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100"
                onClick={toggleSidebar}
              >
                <FontAwesomeIcon icon={item.icon} className="text-black" />
                <span>{item.text}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default NavbarLoanTaker;