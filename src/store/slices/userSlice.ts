import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type UserState = {
  name: string;
  email: string;
  role: string;
  isAuthenticated: boolean;
};

const initialUserState: UserState = {
  name: '',
  email: '',
  role: '',
  isAuthenticated: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState: initialUserState,
  reducers: {
    setUser: (
      state,
      action: PayloadAction<{
        name: string;
        email: string;
        role: string;
      }>
    ) => {
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.role = action.payload.role;
      state.isAuthenticated = true;

      console.log('Usuario guardado en Redux:', state);
    },

    clearUser: (state) => {
      state.name = '';
      state.email = '';
      state.role = '';
      state.isAuthenticated = false;

      console.log('Usuario eliminado de Redux');
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;

export default userSlice.reducer;