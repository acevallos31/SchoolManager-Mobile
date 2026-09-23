import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { clearUser } from './slices/userSlice';

import userReducer from './slices/userSlice';
import enrollmentReducer from './slices/enrollmentSlice';
import studentsReducer from './slices/studentsSlice';


const appReducer = combineReducers({
    user: userReducer,
    enrollment: enrollmentReducer,
    students: studentsReducer,
});

export const store = configureStore({
  // Los datos de alumnos/matriculas no deben pasar a otra cuenta.
  reducer: (state: ReturnType<typeof appReducer> | undefined, action: Parameters<typeof appReducer>[1]) =>
    appReducer(clearUser.match(action) ? undefined : state, action),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
