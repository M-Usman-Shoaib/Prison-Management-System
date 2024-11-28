import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    // Add other reducers if needed
  },
  // No need to manually add redux-thunk
});

export default store;
