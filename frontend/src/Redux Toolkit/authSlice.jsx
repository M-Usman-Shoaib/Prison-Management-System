import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isAuthenticated: false,
    user: null,
    token: null, // Token added to state
    token: localStorage.getItem('authToken') || null, // Check localStorage for token
  },
  reducers: {
    // Login action to authenticate the user
    login: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      
      // Save token to localStorage
      localStorage.setItem('authToken', action.payload.token);
    },    
    // Logout action to reset authentication state
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null; // Clear the token
      localStorage.removeItem('authToken'); // Remove token from localStorage
    },
  },
});

export const { login, logout } = authSlice.actions; // Export actions
export default authSlice.reducer; // Export the reducer to be used in the store
