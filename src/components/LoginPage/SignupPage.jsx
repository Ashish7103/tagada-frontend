import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signup } from '../../Redux/actions/authActions';

const SignUp = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    aadhar: '',
    name: '',
    password: '',
    role_id: '',
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated, loading, error } = useSelector((state) => state.auth);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (
      !formData.username ||
      !formData.email ||
      !formData.phone ||
      !formData.aadhar ||
      !formData.password ||
      !formData.name ||
      !formData.role_id
    ) {
      dispatch({ type: 'SIGNUP_FAIL', payload: 'Please fill in all fields including role selection' });
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      dispatch({ type: 'SIGNUP_FAIL', payload: 'Please enter a valid email address' });
      return;
    }

    if (!/^\d{10}$/.test(formData.phone)) {
      dispatch({ type: 'SIGNUP_FAIL', payload: 'Please enter a valid 10-digit phone number' });
      return;
    }

    if (!/^\d{12}$/.test(formData.aadhar)) {
      dispatch({ type: 'SIGNUP_FAIL', payload: 'Please enter a valid 12-digit Aadhar number' });
      return;
    }

    if (formData.password.length < 8) {
      dispatch({ type: 'SIGNUP_FAIL', payload: 'Password must be at least 8 characters long' });
      return;
    }

    // Store role_id locally before dispatching
    const selectedRoleId = parseInt(formData.role_id);
    dispatch(signup(formData));

    // Navigate immediately using the selected role_id if API doesn't return it
    if (isAuthenticated) {
      switch (selectedRoleId) {
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
  };

  // Navigation fallback using Redux state (if API returns role_id)
  useEffect(() => {
    if (isAuthenticated && user) {
      const roleId = user.role_id || parseInt(formData.role_id); // Fallback to formData.role_id
      if (roleId) {
        switch (roleId) {
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
    }
  }, [isAuthenticated, user, navigate, formData.role_id]);

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <header className="w-full border-b border-gray-200">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <img
                src="https://ai-public.creatie.ai/gen_page/logo_placeholder.png"
                alt="Tagada Logo"
                className="h-8 w-auto"
              />
              <span className="ml-2 text-xl font-semibold text-gray-900">
                Tagada
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Create your account
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Join Tagada and get started today
            </p>
          </div>

          <div className="bg-gradient-to-br from-white to-blue-50 p-8 shadow-lg rounded-lg border border-gray-200">
            {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="role_id" className="block text-sm font-medium text-gray-700">
                  Select Role
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <i className="fas fa-user-tag text-gray-400"></i>
                  </div>
                  <select
                    id="role_id"
                    name="role_id"
                    required
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-custom focus:border-custom sm:text-sm"
                    value={formData.role_id}
                    onChange={handleChange}
                  >
                    <option value="">Select a role</option>
                    <option value="2">Money Lender</option>
                    <option value="3">Loan Taker</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                  Username
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <i className="fas fa-user text-gray-400"></i>
                  </div>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    required
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-custom focus:border-custom sm:text-sm"
                    placeholder="Enter your username"
                    value={formData.username}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <i className="fas fa-envelope text-gray-400"></i>
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-custom focus:border-custom sm:text-sm"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Phone number
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <i className="fas fa-phone text-gray-400"></i>
                  </div>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-custom focus:border-custom sm:text-sm"
                    placeholder="Enter your phone number"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="aadhar" className="block text-sm font-medium text-gray-700">
                  Aadhar card number
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <i className="fas fa-id-card text-gray-400"></i>
                  </div>
                  <input
                    id="aadhar"
                    name="aadhar"
                    type="text"
                    required
                    maxLength="12"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-custom focus:border-custom sm:text-sm"
                    placeholder="Enter your 12-digit Aadhar number"
                    value={formData.aadhar}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <i className="fas fa-user-circle text-gray-400"></i>
                  </div>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <i className="fas fa-lock text-gray-400"></i>
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-custom focus:border-custom sm:text-sm"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded-md disabled:bg-gray-400"
                >
                  {loading ? 'Signing up...' : 'Sign up'}
                </button>
              </div>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?
                <a href="#" className="font-medium text-custom hover:text-custom/90">
                  Log in
                </a>
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center py-8">
            <div className="flex space-x-6 mb-4">
              <a href="#" className="text-sm text-gray-600 hover:text-gray-900">
                Privacy Policy
              </a>
              <a href="#" className="text-sm text-gray-600 hover:text-gray-900">
                Terms of Service
              </a>
            </div>
            <p className="text-sm text-gray-500">
              © 2024 Tagada. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SignUp;