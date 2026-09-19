import { createSlice } from '@reduxjs/toolkit';

const lightColors = {
  background: '#FFFFFF',
  surface: '#F5F5F5',
  text: '#1A1A1A',
  textSecondary: '#666666',
  primary: '#1E3A8A',
  border: '#E0E0E0',
  cardBackground: '#FFFFFF',
  cardBorder: '#E0E0E0',
};

const darkColors = {
  background: '#121212',
  surface: '#1E1E1E',
  text: '#F5F5F5',
  textSecondary: '#AAAAAA',
  primary: '#60A5FA',
  border: '#333333',
  cardBackground: '#2C2C2C',
  cardBorder: '#444444',
};

type ThemeState = {
  isDark: boolean;
};

const initialState: ThemeState = {
  isDark: false,
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.isDark = !state.isDark;
    },
  },
});

export const { toggleTheme } = themeSlice.actions;

export const getThemeColors = (isDark: boolean) => {
  return isDark ? darkColors : lightColors;
};

export default themeSlice.reducer;