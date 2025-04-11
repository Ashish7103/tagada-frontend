import axios from 'axios';
const API_BASE_URL = 'https://tagada.onrender.com';

// Profile Actions
export const fetchProfile = () => async (dispatch) => {
  try {
    dispatch({ type: 'FETCH_PROFILE_REQUEST' });
    const response = await axios.get(`${API_BASE_URL}/profile/user`, { withCredentials: true });
    dispatch({ type: 'FETCH_PROFILE_SUCCESS', payload: response.data.user });
  } catch (err) {
    dispatch({ type: 'FETCH_PROFILE_FAIL', payload: err.response?.data?.error || 'Failed to fetch profile' });
  }
};

// QR Scanner Actions
export const setQrResult = (result) => ({ type: 'SET_QR_RESULT', payload: result });
export const toggleScanner = (show) => ({ type: 'TOGGLE_SCANNER', payload: show });
export const updateQrForm = (field, value) => ({ type: 'UPDATE_QR_FORM', field, value });
export const resetQrForm = () => ({ type: 'RESET_QR_FORM' });

export const recordPayment = (paymentData) => async (dispatch) => {
  try {
    dispatch({ type: 'RECORD_PAYMENT_REQUEST' });
    const formattedDate = paymentData.paymentDate.toISOString().slice(0, 19).replace('T', ' ');
    const paymentResponse = await axios.post(
      `${API_BASE_URL}/paymentApprove/payment/direct`,
      { ...paymentData, PaymentDate: formattedDate },
      { withCredentials: true }
    );

    try {
      const totalCollectedResponse = await axios.post(
        `${API_BASE_URL}/DailyLoanCollect/payment/total-collected`,
        {},
        { withCredentials: true }
      );
      dispatch({
        type: 'RECORD_PAYMENT_SUCCESS',
        payload: `${paymentResponse.data.message} Daily totals updated: ${totalCollectedResponse.data.message}`,
      });
    } catch (totalErr) {
      dispatch({
        type: 'RECORD_PAYMENT_SUCCESS',
        payload: paymentResponse.data.message,
      });
      dispatch({
        type: 'RECORD_PAYMENT_FAIL',
        payload: 'Payment recorded, but failed to update daily totals: ' + (totalErr.response?.data?.error || 'Server error'),
      });
    }
  } catch (err) {
    dispatch({ type: 'RECORD_PAYMENT_FAIL', payload: err.response?.data?.error || 'Failed to record payment' });
  }
};

// Payment Requests Actions
export const fetchPaymentRequests = (moneyLenderId) => async (dispatch) => {
  try {
    dispatch({ type: 'FETCH_REQUESTS_REQUEST' });
    console.log(`Fetching payment requests for MoneyLenderId: ${moneyLenderId}`);
    const response = await axios.get(
      `${API_BASE_URL}/paymentRequest/getAllPaymentRequest?Status=Pending&MoneyLenderId=${moneyLenderId}`,
      { withCredentials: true }
    );
    console.log('Payment requests response:', response.data);
    // Always dispatch success, even if empty, as long as the request succeeds
    dispatch({ type: 'FETCH_REQUESTS_SUCCESS', payload: response.data.requests || [] });
  } catch (err) {
    console.error('Fetch payment requests error:', err.response?.status, err.response?.data);
    if (err.response?.status === 404) {
      // Treat 404 as "no pending requests" instead of an error
      dispatch({ type: 'FETCH_REQUESTS_SUCCESS', payload: [] });
    } else {
      dispatch({
        type: 'FETCH_REQUESTS_FAIL',
        payload: err.response?.data?.error || `Failed to fetch requests (Status: ${err.response?.status})`,
      });
    }
  }
};

export const approveOrRejectRequest = (requestId, approve) => async (dispatch) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/paymentApprove/payment/approve`,
      { RequestId: requestId, Approve: approve },
      { withCredentials: true }
    );
    dispatch({ type: 'REMOVE_REQUEST', payload: requestId });
    alert(response.data.message);
  } catch (err) {
    alert('Failed to process request');
  }
};

export const toggleRequestsModal = (open) => ({ type: 'TOGGLE_REQUESTS_MODAL', payload: open });