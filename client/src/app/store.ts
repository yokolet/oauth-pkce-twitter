import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import spotifySlice from '../features/spotify/spotifySlice';
import twitterSlice from '../features/twitter/twitterSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    spotify: spotifySlice,
    twitter: twitterSlice,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
