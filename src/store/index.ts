import { configureStore } from '@reduxjs/toolkit';

import userReducer from './slices/userSlice';
import enrollmentReducer from './slices/enrollmentSlice';
import studentsReducer from './slices/studentsSlice';


export const store = configureStore({
  reducer: {
    user: userReducer,
    enrollment: enrollmentReducer,
    students: studentsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;