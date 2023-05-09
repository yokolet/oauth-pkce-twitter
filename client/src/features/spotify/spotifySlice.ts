import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk, RootState } from '../../app/store';
import { setLoggedIn } from '../auth/authSlice';

interface SpotifyState {
  displayName: string;
  product: string;
};

const initialState: SpotifyState = {
  displayName: '',
  product: '',
};

export const spotifySlice = createSlice({
  name: 'spotify',
  initialState,
  reducers: {
    setDisplayName: (state, action: PayloadAction<string>) => {
      state.displayName = action.payload;
    },
    setProduct: (state, action: PayloadAction<string>) => {
      state.product = action.payload;
    },
  },
});

export const { setDisplayName, setProduct } = spotifySlice.actions;
export const selectDisplayName = (state: RootState) => state.spotify.displayName;
export const selectProduct = (state: RootState) => state.spotify.product;

export const setUserProfileAsync = (accessToken: string): AppThunk => dispatch => {
  const headers = new Headers();
  headers.append('Authorization', 'Bearer ' + accessToken);
  fetch('https://api.spotify.com/v1/me', {
    method: 'GET',
    headers,
  }).then(response => response.json())
    .then((data) => {
      console.log(data);
      dispatch(setDisplayName(data.display_name ? data.display_name : data.id));
      dispatch(setProduct(data.product));
    }).catch((error) => {
      console.log(error);
      if (error instanceof XMLHttpRequest) {
        if (error.status === 401) {
          dispatch(setLoggedIn(false));
        }
      }
    });
};

export default spotifySlice.reducer;
