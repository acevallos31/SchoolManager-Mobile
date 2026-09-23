import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { UsuarioActual } from '../../services/authApi';

type UserState = {
  name: string;
  email: string;
  role: string;
  isAuthenticated: boolean;
  profile: UsuarioActual | null;
};

const initialUserState: UserState = {
  name: '',
  email: '',
  role: '',
  isAuthenticated: false,
  profile: null,
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
        profile: UsuarioActual;
      }>
    ) => {
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.role = action.payload.role;
      state.isAuthenticated = true;

      state.profile = action.payload.profile;
    },

    clearUser: () => initialUserState,
  },
});

export const { setUser, clearUser } = userSlice.actions;

export default userSlice.reducer;
