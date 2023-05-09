import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';

interface AuthState {
  loggedIn: boolean;
  accessToken: string;
  tokenExpiryDate: string;
};

const initialState: AuthState = {
  loggedIn: false,
  accessToken: '',
  tokenExpiryDate: '',
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoggedIn: (state, action: PayloadAction<boolean>) => {
      state.loggedIn = action.payload;
    },
    setAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
    },
    setTokenExpiryDate: (state, action: PayloadAction<number>) => {
      const date = new Date();
      date.setSeconds(date.getSeconds() + action.payload);
      state.tokenExpiryDate = date.toISOString();
    },
  },
});

export const { setLoggedIn, setAccessToken, setTokenExpiryDate } = authSlice.actions;
export const selectIsLoggedIn = (state: RootState) => state.auth.loggedIn;
export const selectAccessToken = (state: RootState) => state.auth.accessToken;
export const selectTokenExpiryDate = (state: RootState) => state.auth.tokenExpiryDate;

export default authSlice.reducer;
