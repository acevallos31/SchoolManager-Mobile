import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type UserState = {
  name: string;
  email: string;
  role: string;
  accessToken: string;
  isAuthenticated: boolean;
};

const initialUserState: UserState = {
  name: '',
  email: '',
  role: '',
  accessToken: '',
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
        accessToken: string;
      }>
    ) => {
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.role = action.payload.role;
      state.accessToken = action.payload.accessToken;
      state.isAuthenticated = true;
    },

    clearUser: (state) => {
      state.name = '';
      state.email = '';
      state.role = '';
      state.accessToken = '';
      state.isAuthenticated = false;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;

export default userSlice.reducer;
