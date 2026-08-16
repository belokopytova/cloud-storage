import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import fileSlice from './slices/fileSlice';
import userSlice from './slices/userSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    files: fileSlice,
    users: userSlice,
  },
});
