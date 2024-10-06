import { configureStore } from '@reduxjs/toolkit';
import UserSlices from './UserSlice';

export const store = configureStore({
  reducer: {
    user: UserSlices, // No need for .reducer here
    
  },
});
