import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../Redux/actions/authActions';

const Logout = () => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error } = useSelector((state) => state.auth);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await dispatch(logout());
      navigate('/signin');
    } catch (err) {
      // Error handled in Redux
      setLoading(false);
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
            Log out of your account
          </h2>
          {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
          <p className="text-gray-600 mb-6 text-center">
            Are you sure you want to log out?
          </p>
          <button
            type="button"
            onClick={handleLogout}
            disabled={loading}
            className="w-full bg-red-600 text-white py-2.5 text-sm font-semibold rounded-lg hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-600 disabled:bg-red-300"
          >
            {loading ? 'Logging out...' : 'Log out'}
          </button>
          <p className="mt-8 text-center text-sm text-gray-600">
            Changed your mind?{' '}
            <a href="/dashboard" className="font-medium text-blue-600 hover:text-blue-500">
              Go back to dashboard
            </a>
          </p>
        </div>
      </main>
    </div>
  );
};

export default Logout;