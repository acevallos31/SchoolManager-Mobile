import { configureStore } from '@reduxjs/toolkit';

import userReducer from './slices/userSlice';
import enrollmentReducer from './slices/enrollmentSlice';
import studentsReducer from './slices/studentsSlice';
import themeReducer from './slices/themeSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    enrollment: enrollmentReducer,
    students: studentsReducer,
    theme: themeReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;