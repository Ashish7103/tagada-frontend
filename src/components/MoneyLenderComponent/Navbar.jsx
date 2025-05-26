// import React from "react";
// import AddAreaComponent from "./AddAreaComponent";
// import QrCodeScanner from "./QrCodeScanner";

// const Navbar = ({ onNewLoan, profile }) => (
//   <nav className="bg-white border-b border-gray-200">
//     <div className="max-w-8xl mx-auto px-4 py-4 flex items-center justify-between">
//       <div className="flex items-center">
//         <div>
//           <h1 className="text-2xl font-bold">{profile.name || "Loading..."}</h1>
//           <div className="flex items-center mt-1">
//             <div className="text-gray-600 mr-4">ID: #{profile.uid || "N/A"}</div>
//           </div>
//         </div>
//       </div>
//       <div className="flex items-center space-x-4">
//         <AddAreaComponent moneyLenderId={profile.uid} />
//         <button
//           onClick={onNewLoan}
//           className="bg-blue-600 text-white px-4 py-2 rounded-lg"
//         >
//           + New Loan
//         </button>
//         <QrCodeScanner moneyLenderId={profile.uid} />
//       </div>
//     </div>
//   </nav>
// );

// export default Navbar;
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
  faDownload,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

const Navbar = ({ profile }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 w-full bg-white shadow-sm z-50">
        <div className="max-w-8xl mx-auto px-4 h-14 flex items-center justify-center relative">
          <h1 className="font-['Pacifico'] text-2xl text-black">tagada</h1>
          <button
            onClick={toggleSidebar}
            className="text-gray-600 absolute left-4"
          >
            <FontAwesomeIcon icon={faBars} className="text-xl" />
          </button>
        </div>
      </nav>

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
            {/* Menu Items */}
            {[
              { icon: faUser, text: "Profile", path: "/admin" },
              { icon: faInfoCircle, text: "Personal Information", path: "/personal-information" },
              { icon: faMapMarkerAlt, text: "Areas", path: "/areas" },
              { icon: faQrcode, text: "Scan and Pay", path: "/scan-and-pay" },
              { icon: faChartLine, text: "Overview", path: "/overview" },
              { icon: faChartBar, text: "Payment Trend", path: "/payment-trend" },
              { icon: faPlusCircle, text: "Add Loan", path: "/add-loan" },
              { icon: faDownload, text: "Report", path: "/download" }, // Link to /add-loan
              { icon: faSignOutAlt, text: "Logout", path: "/logout" }, // Link to /add-loan
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

export default Navbar;