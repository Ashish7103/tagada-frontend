// src/redux/reducers/authReducer.js
const initialState = {
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null,
    resetError: null,
  };
  
  const authReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'SIGNUP_REQUEST':
      case 'LOGIN_REQUEST':
        return {
          ...state,
          loading: true,
          error: null,
        };
      case 'SIGNUP_SUCCESS':
      case 'LOGIN_SUCCESS':
        return {
          ...state,
          user: action.payload,
          isAuthenticated: true,
          loading: false,
        };
      case 'SIGNUP_FAIL':
      case 'LOGIN_FAIL':
        return {
          ...state,
          error: action.payload,
          loading: false,
        };
      case 'LOGOUT':
        return {
          ...state,
          user: null,
          isAuthenticated: false,
        };
      case 'RESET_PASSWORD_REQUEST':
        return {
          ...state,
          loading: true,
          resetError: null,
        };
      case 'RESET_PASSWORD_SUCCESS':
        return {
          ...state,
          loading: false,
        };
      case 'RESET_PASSWORD_FAIL':
        return {
          ...state,
          resetError: action.payload,
          loading: false,
        };
      default:
        return state;
    }
  };
  
  export default authReducer;