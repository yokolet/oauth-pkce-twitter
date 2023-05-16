import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk, RootState } from '../../app/store';
import { setLoggedIn } from '../auth/authSlice';

interface TwitterState {
  id: string;
  name: string;
  username: string;
};

const initialState: TwitterState = {
  id: '',
  name: '',
  username: '',
};

export const twitterSlice = createSlice({
  name: 'twitter',
  initialState,
  reducers: {
    setName: (state, action: PayloadAction<string>) => {
      state.name = action.payload;
    },
    setUsername: (state, action: PayloadAction<string>) => {
      state.username = action.payload;
    },
  },
});

export const { setName, setUsername } = twitterSlice.actions;
export const selectName = (state: RootState) => state.twitter.name;
export const selectUsername = (state: RootState) => state.twitter.username;

export const setUserProfileAsync = (accessToken: string): AppThunk => dispatch => {
  fetch('http://www.localhost:3001/twitter/me', {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + accessToken,
    },
  }).then(response => response.json())
    .then((data) => {
      console.log(data);
      dispatch(setLoggedIn(true));
      dispatch(setName(data.name ? data.name : data.id));
      dispatch(setUsername(data.username));
    }).catch((error) => {
      console.log(error);
      if (error instanceof XMLHttpRequest) {
        if (error.status === 401) {
          dispatch(setLoggedIn(false));
        }
      }
    });
};

export default twitterSlice.reducer;
