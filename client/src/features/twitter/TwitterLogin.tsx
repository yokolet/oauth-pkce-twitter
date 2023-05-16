import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  setLoggedIn,
  setAccessToken,
  setTokenExpiryDate,
  selectIsLoggedIn,
  selectTokenExpiryDate,
} from '../auth/authSlice';
import { setUserProfileAsync } from './twitterSlice';
import { getTwitterOauthUrl } from '../../utils/twitterOauthConfig';
import { getOAuthParams, removeHashParamsFromUrl } from '../../utils/hashUtils';
import { useAppDispatch } from '../../app/hooks';
import { Button, Text, VStack } from '@chakra-ui/react';

const { access_token, expires_in } = getOAuthParams();
removeHashParamsFromUrl();

export function TwitterLogin() {
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
          colorScheme='blue'
          aria-label="Log in using OAuth 2.0"
          onClick={() => window.open(getTwitterOauthUrl(), '_self')}
        >
          Log in with Twitter
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
