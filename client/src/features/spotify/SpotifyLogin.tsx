import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  setLoggedIn,
  setAccessToken,
  setTokenExpiryDate,
  selectIsLoggedIn,
  selectTokenExpiryDate,
} from '../auth/authSlice';
import { setUserProfileAsync } from './spotifySlice';
import { getPKCEAuthorizationHref } from '../../utils/oauthConfig';
import { getHashParams, removeHashParamsFromUrl } from '../../utils/hashUtils';
import { useAppDispatch } from '../../app/hooks';
import { Button, Text, VStack } from '@chakra-ui/react';

const hashParams = getHashParams();
const access_token = hashParams.access_token;
const expires_in = hashParams.expires_in;
removeHashParamsFromUrl();

export function SpotifyLogin() {
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const tokenExpiryDate = useSelector(selectTokenExpiryDate);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (access_token) {
      dispatch(setLoggedIn(true));
      dispatch(setAccessToken(access_token));
      dispatch(setTokenExpiryDate(Number(expires_in)));
      dispatch(setUserProfileAsync(access_token));
    }
  }, []);

  return (
    <VStack spacing="4">
      {!isLoggedIn &&
        <Button
          colorScheme='green'
          aria-label="Log in using OAuth 2.0"
          onClick={() => window.open(getPKCEAuthorizationHref(), '_self')}
        >
          Log in with Spotify
        </Button>
      }
      {isLoggedIn &&
        <Text>
          Token expiry date: {tokenExpiryDate}
        </Text>
      }
    </VStack>
  );
}
