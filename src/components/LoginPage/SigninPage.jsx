import React, { useState, useEffect } from 'react'; // Add useEffect
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login, resetPassword } from '../../Redux/authActions';

const Signin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showResetPopup, setShowResetPopup] = useState(false);
  const [resetEmail, setResetEmail] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated, loading, error, resetError } = useSelector((state) => state.auth);

  // Handle navigation in useEffect
  useEffect(() => {
    if (isAuthenticated && user) {
      switch (user.role_id) {
        case 3:
          navigate('/profile');
          break;
        case 2:
          navigate('/admin');
          break;
        default:
          navigate('/dashboard');
      }
    }
  }, [isAuthenticated, user, navigate]); // Dependencies: run when these change

  const handleSubmit = () => {
    if (!email || !password) {
      dispatch({ type: 'LOGIN_FAIL', payload: 'Email and password are required' });
      return;
    }
    dispatch(login(email, password));
  };

  const handleResetPassword = async () => {
    if (!resetEmail) {
      dispatch({ type: 'RESET_PASSWORD_FAIL', payload: 'Email is required' });
      return;
    }
    try {
      await dispatch(resetPassword(resetEmail));
      alert('Password reset email sent. Please check your inbox.');
      setShowResetPopup(false);
      setResetEmail('');
    } catch (err) {
      // Error handled in Redux
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <nav className="fixed top-0 left-0 w-full bg-white shadow-sm z-50">
        <div className="max-w-8xl mx-auto px-4 h-14 flex items-center justify-center">
          <h1 className="font-['Pacifico'] text-2xl text-gray-800">logo</h1>
        </div>
      </nav>
      <main className="min-h-screen pt-24 px-4 flex flex-col items-center">
        <div className="w-full max-w-md bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-8 text-center">
            Sign in to your account
          </h2>
          {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
          <form className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                  <i className="fas fa-envelope text-sm"></i>
                </span>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                  <i className="fas fa-lock text-sm"></i>
                </span>
                <input
                  type="password"
                  id="password"
                  name="password"
                  required
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="remember"
                  name="remember"
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>
              <button
                type="button"
                onClick={() => setShowResetPopup(true)}
                className="text-sm font-medium text-blue-600 hover:text-blue-500"
              >
                Forgot password?
              </button>
            </div>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2.5 text-sm font-semibold rounded-lg hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 disabled:bg-blue-300"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
          <p className="mt-8 text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <a href="/signup" className="font-medium text-blue-600 hover:text-blue-500">
              Create an account
            </a>
          </p>
        </div>
      </main>
      {showResetPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Reset Password</h2>
            {resetError && <p className="text-red-500 text-sm text-center mb-4">{resetError}</p>}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter your email
              </label>
              <input
                type="email"
                className="w-full border-2 border-gray-300 rounded-lg py-2.5 px-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
              />
            </div>
            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={() => setShowResetPopup(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleResetPassword}
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-500 rounded-lg disabled:bg-blue-300"
              >
                {loading ? 'Sending...' : 'Reset Password'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Signin;


// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// // import dotenv from "dotenv";
// // dotenv.config();
// // const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
// const API_BASE_URL ="https://tagada.onrender.com";
// // import.meta.env.VITE_API_BASE_URL || 
//   // (import.meta.env.MODE === 'production' 
//   //   ? 'https://tagada.onrender.com' 
//   //   : 'http://localhost:5000');

// const Signin = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const [showResetPopup, setShowResetPopup] = useState(false); // State for reset password popup
//   const [resetEmail, setResetEmail] = useState(""); // State for reset email input
//   const [resetError, setResetError] = useState(""); // State for reset password error
//   const navigate = useNavigate();

//   // Handle sign-in form submission
//   const handleSubmit = async () => {
//     if (!email || !password) {
//       setError("Email and password are required are");
//       return;
//     }

//     const requestData = {
//       email,
//       password,
//     };

//     try {
//       const response = await axios.post(
//         `${API_BASE_URL}/LoginSignup/signin`,
//         requestData,
//         { withCredentials: true },
//          // Enable cookie storage
//       );
//       console.log("Login Success:", response.data.user.role_id);
//       console.log("Login Success:", response.data.user);
//       const roleId = response.data.user.role_id;

//       setError("");
//       alert("Login successful!");
//       switch (roleId) {
//         case 3:
//           navigate("/profile");
//           break;
//         case 2:
//           navigate("/admin");
//           break;
//         default:
//           navigate("/dashboard");
//       }
//     } catch (err) {
//       console.error("Login Error:", err);
//       setError("Invalid email or password");
//     }
//   };

//   // Handle reset password form submission
//   const handleResetPassword = async () => {
//     if (!resetEmail) {
//       setResetError("Email is required");
//       return;
//     }

//     try {
//       const response = await axios.post(
//         `${API_BASE_URL}/LoginSignup/reset-password`,
//         { email: resetEmail }
//       );
//       console.log("Reset Password Response:", response.data);
//       alert("Password reset email sent. Please check your inbox.");
//       setShowResetPopup(false); // Close the popup
//       setResetError("");
//     } catch (err) {
//       console.error("Reset Password Error:", err);
//       setResetError("Failed to send reset email. Please try again.");
//     }
//   };

//   return (
//     <div className="bg-gray-50 min-h-screen">
//       {/* Navbar */}
//       <nav className="fixed top-0 left-0 w-full bg-white shadow-sm z-50">
//         <div className="max-w-8xl mx-auto px-4 h-14 flex items-center justify-center">
//           <h1 className="font-['Pacifico'] text-2xl text-gray-800">logo</h1>
//         </div>
//       </nav>

//       {/* Main Content */}
//       <main className="min-h-screen pt-24 px-4 flex flex-col items-center">
//         <div className="w-full max-w-md bg-white rounded-lg shadow-sm p-8">
//           <h2 className="text-2xl font-semibold text-gray-900 mb-8 text-center">
//             Sign in to your account
//           </h2>

//           {/* Error Message */}
//           {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}

//           {/* Form */}
//           <form className="space-y-6">
//             {/* Email Field */}
//             <div>
//               <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
//                 Email
//               </label>
//               <div className="relative">
//                 <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
//                   <i className="fas fa-envelope text-sm"></i>
//                 </span>
//                 <input
//                   type="email"
//                   id="email"
//                   name="email"
//                   required
//                   className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   placeholder="Enter your email"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                 />
//               </div>
//             </div>

//             {/* Password Field */}
//             <div>
//               <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
//                 Password
//               </label>
//               <div className="relative">
//                 <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
//                   <i className="fas fa-lock text-sm"></i>
//                 </span>
//                 <input
//                   type="password"
//                   id="password"
//                   name="password"
//                   required
//                   className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   placeholder="Enter your password"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                 />
//               </div>
//             </div>

//             {/* Remember Me and Forgot Password */}
//             <div className="flex items-center justify-between">
//               <div className="flex items-center">
//                 <input
//                   type="checkbox"
//                   id="remember"
//                   name="remember"
//                   className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
//                 />
//                 <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
//                   Remember me
//                 </label>
//               </div>
//               <button
//                 type="button"
//                 onClick={() => setShowResetPopup(true)}
//                 className="text-sm font-medium text-blue-600 hover:text-blue-500"
//               >
//                 Forgot password?
//               </button>
//             </div>

//             {/* Sign In Button */}
//             <button
//               type="button"
//               onClick={handleSubmit}
//               className="w-full bg-blue-600 text-white py-2.5 text-sm font-semibold rounded-lg hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600"
//             >
//               Sign in
//             </button>
//           </form>

//           {/* Create Account Link */}
//           <p className="mt-8 text-center text-sm text-gray-600">
//             Don't have an account?{" "}
//             <a href="/signup" className="font-medium text-blue-600 hover:text-blue-500">
//               Create an account
//             </a>
//           </p>
//         </div>
//       </main>

//       {/* Reset Password Popup */}
//       {showResetPopup && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
//           <div className="bg-white rounded-lg p-6 w-full max-w-md">
//             <h2 className="text-2xl font-bold text-gray-900 mb-4">Reset Password</h2>
//             {resetError && <p className="text-red-500 text-sm text-center mb-4">{resetError}</p>}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Enter your email
//               </label>
//               <input
//                 type="email"
//                 className="w-full border-2 border-gray-300 rounded-lg py-2.5 px-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                 placeholder="Enter your email"
//                 value={resetEmail}
//                 onChange={(e) => setResetEmail(e.target.value)}
//               />
//             </div>
//             <div className="mt-6 flex justify-end space-x-4">
//               <button
//                 onClick={() => setShowResetPopup(false)}
//                 className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleResetPassword}
//                 className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-500 rounded-lg"
//               >
//                 Reset Password
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Signin;











/////////////////////////////////////////////////
// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";

// const SignIn = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const [showResetPopup, setShowResetPopup] = useState(false); // State for reset password popup
//   const [resetEmail, setResetEmail] = useState(""); // State for reset email input
//   const [resetError, setResetError] = useState(""); // State for reset password error
//   const navigate = useNavigate();

//   // Handle sign-in form submission
//   const handleSubmit = async () => {
//     if (!email || !password) {
//       setError("Email and password are required");
//       return;
//     }

//     const requestData = {
//       email,
//       password,
//     };

//     try {
//       const response = await axios.post(
//         "{API_BASE_URL}/LoginSignup/signin",
//         requestData,
//         { withCredentials: true } // Enable cookie storage
//       );
//       console.log("Login Success:", response.data.user.role_id);
//       const roleId = response.data.user.role_id;

//       setError("");
//       alert("Login successful!");
//       switch (roleId) {
//         case 3:
//           navigate("/profile");
//           break;
//         case 2:
//           navigate("/admin");
//           break;
//         default:
//           navigate("/dashboard");
//       }
//     } catch (err) {
//       console.error("Login Error:", err);
//       setError("Invalid email or password");
//     }
//   };

//   // Handle reset password form submission
//   const handleResetPassword = async () => {
//     if (!resetEmail) {
//       setResetError("Email is required");
//       return;
//     }

//     try {
//       const response = await axios.post(
//         "{API_BASE_URL}/LoginSignup/reset-password",
//         { email: resetEmail }
//       );
//       console.log("Reset Password Response:", response.data);
//       alert("Password reset email sent. Please check your inbox.");
//       setShowResetPopup(false); // Close the popup
//       setResetError("");
//     } catch (err) {
//       console.error("Reset Password Error:", err);
//       setResetError("Failed to send reset email. Please try again.");
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50">
//       <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">
//         <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
//           Sign in to your account
//         </h2>

//         {error && <p className="text-red-500 text-sm text-center">{error}</p>}

//         <div className="space-y-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Email
//             </label>
//             <input
//               type="email"
//               className="w-full border-2 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg py-2.5 px-3"
//               placeholder="Enter your email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-semibold text-gray-700 mb-2">
//               Password
//             </label>
//             <input
//               type="password"
//               className="w-full border-2 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg py-2.5 px-3"
//               placeholder="Enter your password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//             />
//           </div>

//           <button
//             type="button"
//             className="w-full bg-blue-600 text-white py-3 font-semibold hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 rounded-lg transition-colors"
//             onClick={handleSubmit}
//           >
//             Sign in
//           </button>

//           <p className="mt-4 text-center text-sm text-gray-600">
//             Don’t have an account?
//             <a
//               href="/signup"
//               className="font-medium text-blue-600 hover:text-blue-500"
//             >
//               {" "}
//               Create Account
//             </a>
//           </p>

//           <p className="mt-2 text-center text-sm text-gray-600">
//             Forgot your password?
//             <button
//               onClick={() => setShowResetPopup(true)}
//               className="font-medium text-blue-600 hover:text-blue-500"
//             >
//               {" "}
//               Reset it here
//             </button>
//           </p>
//         </div>
//       </div>

//       {/* Reset Password Popup */}
//       {showResetPopup && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
//           <div className="bg-white rounded-lg p-6 w-full max-w-md">
//             <h2 className="text-2xl font-bold text-gray-900 mb-4">
//               Reset Password
//             </h2>
//             {resetError && (
//               <p className="text-red-500 text-sm text-center mb-4">{resetError}</p>
//             )}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Enter your email
//               </label>
//               <input
//                 type="email"
//                 className="w-full border-2 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg py-2.5 px-3"
//                 placeholder="Enter your email"
//                 value={resetEmail}
//                 onChange={(e) => setResetEmail(e.target.value)}
//               />
//             </div>
//             <div className="mt-6 flex justify-end space-x-4">
//               <button
//                 onClick={() => setShowResetPopup(false)}
//                 className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleResetPassword}
//                 className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-500 rounded-lg"
//               >
//                 Reset Password
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default SignIn;

// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";

// const SignIn = () => {
//   const [loginMethod, setLoginMethod] = useState("username");
//   const [identifier, setIdentifier] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const navigate = useNavigate();

//   const handleSubmit = async () => {
//     if (!identifier || !password) {
//       setError("All fields are required");
//       return;
//     }

//     const requestData = {
//       [loginMethod]: identifier,
//       password,
//     };

//     try {
//       const response = await axios.post(
//         "{API_BASE_URL}/LoginSignup/signin",
//         requestData,
//         { withCredentials: true } // Enable cookie storage
//       );
//       console.log("Login Success:", response.data.user.role_id);
//       const roleId = response.data.user.role_id;
      

//       setError("");
//       alert("Login successful!");
//       switch (roleId) {
//         case 3:
//           navigate("/profile");
//           break;
//         case 2:
//           navigate("/admin");
//           break;
//         default:
//           navigate("/dashboard");
//       }
//     } catch (err) {
//       console.error("Login Error:", err);
//       setError("Invalid credentials");
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50">
//       <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">
//         <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
//           Sign in to your account
//         </h2>

//         {error && <p className="text-red-500 text-sm text-center">{error}</p>}

//         <div className="space-y-4">
//           <div>
//             <label className="block text-sm font-semibold text-gray-700 mb-2">
//               Sign in with
//             </label>
//             <select
//               className="w-full border-2 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg py-2.5 text-gray-900"
//               value={loginMethod}
//               onChange={(e) => setLoginMethod(e.target.value)}
//             >
//               <option value="username">Username</option>
//               <option value="phoneNumber">Phone Number</option>
//               <option value="AdharcardNumber">Aadhar Card Number</option>
//             </select>
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               {loginMethod === "username"
//                 ? "Username"
//                 : loginMethod === "phoneNumber"
//                 ? "Phone Number"
//                 : "Aadhar Card Number"}
//             </label>
//             <input
//               type="text"
//               className="w-full border-2 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg py-2.5 px-3"
//               placeholder={`Enter your ${loginMethod}`}
//               value={identifier}
//               onChange={(e) => setIdentifier(e.target.value)}
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-semibold text-gray-700 mb-2">
//               Password
//             </label>
//             <input
//               type="password"
//               className="w-full border-2 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg py-2.5 px-3"
//               placeholder="Enter your password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//             />
//           </div>

//           <button
//             type="button"
//             className="w-full bg-blue-600 text-white py-3 font-semibold hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 rounded-lg transition-colors"
//             onClick={handleSubmit}
//           >
//             Signin
//           </button>

//           <p className="mt-4 text-center text-sm text-gray-600">
//             Don’t have an account?
//             <a
//               href="#"
//               className="font-medium text-blue-600 hover:text-blue-500"
//             >
//               {" "}
//               Create one now
//             </a>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SignIn;













///////////////////////////////////////////////////////

// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";

// const SignIn = () => {
//   const [loginMethod, setLoginMethod] = useState("username");
//   const [identifier, setIdentifier] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const navigate = useNavigate(); // Hook for navigation

//   // Handles form submission
//   const handleSubmit = async () => {
//     if (!identifier || !password) {
//       setError("All fields are required");
//       return;
//     }

//     const requestData = {
//       [loginMethod]: identifier, // Dynamic field based on selected login method
//       password,
//     };

//     try {
//       const response = await axios.post(
//         "{API_BASE_URL}/LoginSignup/signin",
//         requestData
//         // { withCredentials: true }
//       );
//       console.log("Login Success:", response.data);

//       setError("");
//       alert("Login successful!");

//       // Redirect user to profile page
//       navigate("/profile");
//     } catch (err) {
//       console.error("Login Error:", err);
//       setError("Invalid credentials");
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50">
//       <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">
//         <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
//           Sign in to your account
//         </h2>

//         {error && <p className="text-red-500 text-sm text-center">{error}</p>}

//         <div className="space-y-4">
//           <div>
//             <label className="block text-sm font-semibold text-gray-700 mb-2">
//               Sign in with
//             </label>
//             <select
//               className="w-full border-2 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg py-2.5 text-gray-900"
//               value={loginMethod}
//               onChange={(e) => setLoginMethod(e.target.value)}
//             >
//               <option value="username">Username</option>
//               <option value="phoneNumber">Phone Number</option>
//               <option value="AdharcardNumber">Aadhar Card Number</option>
//             </select>
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               {loginMethod === "username"
//                 ? "Username"
//                 : loginMethod === "phoneNumber"
//                 ? "Phone Number"
//                 : "Aadhar Card Number"}
//             </label>
//             <input
//               type="text"
//               className="w-full border-2 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg py-2.5 px-3"
//               placeholder={`Enter your ${loginMethod}`}
//               value={identifier}
//               onChange={(e) => setIdentifier(e.target.value)}
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-semibold text-gray-700 mb-2">
//               Password
//             </label>
//             <input
//               type="password"
//               className="w-full border-2 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg py-2.5 px-3"
//               placeholder="Enter your password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//             />
//           </div>

//           <button
//             type="button"
//             className="w-full bg-blue-600 text-white py-3 font-semibold hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 rounded-lg transition-colors"
//             onClick={handleSubmit}
//           >
//             Signin
//           </button>

//           <p className="mt-4 text-center text-sm text-gray-600">
//             Don’t have an account?
//             <a
//               href="#"
//               className="font-medium text-blue-600 hover:text-blue-500"
//             >
//               {" "}
//               Create one now
//             </a>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SignIn;
