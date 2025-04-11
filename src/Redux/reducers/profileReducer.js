const initialState = {
    profile: null,
    qrScanner: {
      result: '',
      showScanner: false,
      isOpen: false,
      amount: '',
      paymentDate: new Date(),
    },
    paymentRequests: [],
    paymentRequestsModal: false, // New field for modal state
    loading: false,
    error: null,
    success: null,
  };
  
  export default function profileReducer(state = initialState, action) {
    switch (action.type) {
      // Profile Fetch
      case 'FETCH_PROFILE_REQUEST':
        return { ...state, loading: true, error: null };
      case 'FETCH_PROFILE_SUCCESS':
        return { ...state, loading: false, profile: action.payload };
      case 'FETCH_PROFILE_FAIL':
        return { ...state, loading: false, error: action.payload };
  
      // QR Scanner
      case 'SET_QR_RESULT':
        return { ...state, qrScanner: { ...state.qrScanner, result: action.payload, showScanner: false, isOpen: true } };
      case 'TOGGLE_SCANNER':
        return { ...state, qrScanner: { ...state.qrScanner, showScanner: action.payload } };
      case 'UPDATE_QR_FORM':
        return { ...state, qrScanner: { ...state.qrScanner, [action.field]: action.value } };
      case 'RESET_QR_FORM':
        return {
          ...state,
          qrScanner: { ...initialState.qrScanner, result: state.qrScanner.result },
        };
  
      // Payment Requests
      case 'FETCH_REQUESTS_REQUEST':
        return { ...state, loading: true, error: null };
      case 'FETCH_REQUESTS_SUCCESS':
        return { ...state, loading: false, paymentRequests: action.payload };
      case 'FETCH_REQUESTS_FAIL':
        return { ...state, loading: false, paymentRequests: [], error: action.payload };
      case 'REMOVE_REQUEST':
        return {
          ...state,
          paymentRequests: state.paymentRequests.filter((req) => req.RequestId !== action.payload),
        };
      case 'TOGGLE_REQUESTS_MODAL': // New action type
        return { ...state, paymentRequestsModal: action.payload };
  
      // Payment Actions
      case 'RECORD_PAYMENT_REQUEST':
        return { ...state, loading: true, error: null, success: null };
      case 'RECORD_PAYMENT_SUCCESS':
        return { ...state, loading: false, success: action.payload, qrScanner: initialState.qrScanner };
      case 'RECORD_PAYMENT_FAIL':
        return { ...state, loading: false, error: action.payload };
  
      default:
        return state;
    }
  }