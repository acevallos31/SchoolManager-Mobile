import { configureStore } from '@reduxjs/toolkit';

import userReducer from './slices/userSlice';
import enrollmentReducer from './slices/enrollmentSlice';
import studentsReducer from './slices/studentsSlice';
import themeReducer from './slices/themeSlice';
import responsablesReducer from './slices/responsablesSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    enrollment: enrollmentReducer,
    students: studentsReducer,
    theme: themeReducer,
    responsables: responsablesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;