// src/redux/actions/authActions.js
import axios from 'axios';

const API_BASE_URL = 'https://tagada.onrender.com';

export const signup = (formData) => async (dispatch) => {
  try {
    dispatch({ type: 'SIGNUP_REQUEST' });

    const payload = {
      username: formData.username,
      email: formData.email,
      password: formData.password,
      phoneNumber: formData.phone,
      AdharcardNumber: formData.aadhar,
      Name: formData.name,
      role_id: parseInt(formData.role_id),
    };

    const { data } = await axios.post(
      `${API_BASE_URL}/LoginSignup/signup`,
      payload,
      { withCredentials: true }
    );

    // Assuming the API returns the user object directly or in a 'user' field
    const userData = data.user || data; // Fallback to data if no 'user' field

    dispatch({
      type: 'SIGNUP_SUCCESS',
      payload: userData,
    });
    localStorage.setItem('userInfo', JSON.stringify(userData));
  } catch (error) {
    dispatch({
      type: 'SIGNUP_FAIL',
      payload: error.response?.data?.error || 'An error occurred during signup',
    });
  }
};

export const login = (email, password) => async (dispatch) => {
  try {
    dispatch({ type: 'LOGIN_REQUEST' });
    const config = { headers: { 'Content-Type': 'application/json' }, withCredentials: true };
    const { data } = await axios.post(`${API_BASE_URL}/LoginSignup/signin`, { email, password }, config);
    dispatch({ type: 'LOGIN_SUCCESS', payload: data.user });
    localStorage.setItem('userInfo', JSON.stringify(data.user));
  } catch (error) {
    dispatch({
      type: 'LOGIN_FAIL',
      payload: error.response?.data?.message || 'Invalid email or password',
    });
  }
};

export const resetPassword = (email) => async (dispatch) => {
  try {
    dispatch({ type: 'RESET_PASSWORD_REQUEST' });
    const config = { headers: { 'Content-Type': 'application/json' } };
    await axios.post(`${API_BASE_URL}/LoginSignup/reset-password`, { email }, config);
    dispatch({ type: 'RESET_PASSWORD_SUCCESS' });
  } catch (error) {
    dispatch({
      type: 'RESET_PASSWORD_FAIL',
      payload: error.response?.data?.message || 'Failed to send reset email',
    });
  }
};

export const logout = () => (dispatch) => {
  localStorage.removeItem('userInfo');
  dispatch({ type: 'LOGOUT' });
};