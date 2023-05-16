const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../.env') })


import { addCookieToRes, CLIENT_URL } from './spotifyConfig';
import axios from 'axios';
import { Request, Response } from 'express';

const SPOTIFY_OAUTH_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_OAUTH_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const REDIRECT_URI = process.env.CLIENT_URL;
const CODE_VERIFIER = process.env.CODE_VERIFIER;
const SPOTIFY_OAUTH_TOKEN_URL = 'https://accounts.spotify.com/api/token';
const SPOTIFY_PROFILE_URL = 'https://api.spotify.com/v1/me';
const BasicAuthToken = Buffer.from(`${SPOTIFY_OAUTH_CLIENT_ID}:${SPOTIFY_OAUTH_CLIENT_SECRET}`).toString('base64');

const spotifyOauthTokenParams = {
  grant_type: 'authorization_code',
  redirect_uri: REDIRECT_URI,
  client_id: SPOTIFY_OAUTH_CLIENT_ID,
  code_verifier: CODE_VERIFIER,
};

type SpotifyTokenResponse = {
  token_type: 'bearer';
  expires_in: 7200;
  access_token: string;
  scope: string;
};
function getSpotifyOAuthToken(code: string): any {
  // @ts-ignore
  let body = new URLSearchParams({ ...spotifyOauthTokenParams, code }).toString();
  console.log(`body: ${body}`);
  const response = fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${BasicAuthToken}`,
    },
    body: body
  })
    .then(response => {
      console.log(response);
      if (!response.ok) {
        throw new Error('HTTP status ' + response.status);
      }
      return response.json();
    })
    .then(data => {
      console.log(data.access_token);
    })
    .catch(error => {
      console.error('Error:', error);
    });
  return response;
}
export async function getSpotifyOAuthToken2(code: string) {
  try {
    // @ts-ignore
    let body = new URLSearchParams({ ...spotifyOauthTokenParams, code });
    console.log(`body: ${body}`);
    const response = await axios.post<SpotifyTokenResponse>(
      SPOTIFY_OAUTH_TOKEN_URL,
      body,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${BasicAuthToken}`,
        }
      }
    );
    console.log(`getSpotifyOAuthToken response: ${response}`);
    return response.data;
  } catch (error) {
    return null;
  }
}

export interface SpotifyUser {
  id: string;
  name: string;
  username: string;
}

export async function getSpotifyUser(accessToken: string): Promise<SpotifyUser | null> {
  try {
    const response = await axios.get<{ data: SpotifyUser }>(
      SPOTIFY_PROFILE_URL,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        }
      }
    );
    return response.data.data ?? null;
  } catch (error) {
    return null;
  }
}

export async function spotifyOauth(req: Request<any, any, any, { code: string }>, res: Response) {
  const code = req.query.code;
  console.log(`code from spotify: ${code}`);
  const spotifyOAuthToken = await getSpotifyOAuthToken(code);
  if (!spotifyOAuthToken) {
    return res.redirect(CLIENT_URL);
  }
  console.log(`spotify oauth token: ${spotifyOAuthToken}`);
  const spotifyUser = await getSpotifyUser(spotifyOAuthToken.access_token);
  if (!spotifyUser) {
    return res.redirect(CLIENT_URL);
  }
  console.log(`spotify user: ${spotifyUser}`);
  addCookieToRes(res, spotifyUser, spotifyOAuthToken.access_token);

  return res.redirect(CLIENT_URL);
}
