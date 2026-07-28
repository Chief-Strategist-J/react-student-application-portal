import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface UiState {
  currentTab: 'dashboard' | 'application';
  mobileMenuOpen: boolean;
  theme: 'light' | 'dark';
}

const initialState: UiState = {
  currentTab: 'dashboard',
  mobileMenuOpen: false,
  theme: 'light',
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setCurrentTab(state, action: PayloadAction<'dashboard' | 'application'>) {
      state.currentTab = action.payload;
    },
    toggleMobileMenu(state) {
      state.mobileMenuOpen = !state.mobileMenuOpen;
    },
    setMobileMenuOpen(state, action: PayloadAction<boolean>) {
      state.mobileMenuOpen = action.payload;
    },
    toggleTheme(state) {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
    },
  },
});

export const uiActions = uiSlice.actions;
export const uiReducer = uiSlice.reducer;
