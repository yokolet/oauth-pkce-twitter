import {
  CLIENT_URL,
  CLIENT_ID,
  CLIENT_SECRET,
  CODE_VERIFIER,
  upsertUser, getSignedToken
} from './twitterConfig';
import axios from "axios";
import { Request, Response } from "express";

// the url where we get the twitter access token from
const TWITTER_OAUTH_TOKEN_URL = "https://api.twitter.com/2/oauth2/token";

// we need to encrypt our twitter client id and secret here in base 64 (stated in twitter documentation)
const BasicAuthToken = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`, "utf8").toString(
  "base64"
);

// filling up the query parameters needed to request for getting the token
export const twitterOauthTokenParams = {
  client_id: CLIENT_ID,
  // based on code_challenge
  code_verifier: CODE_VERIFIER,
  redirect_uri: `http://www.localhost:3001/oauth/twitter`,
  grant_type: "authorization_code",
};

// the shape of the object we should recieve from twitter in the request
type TwitterTokenResponse = {
  token_type: "bearer";
  expires_in: 7200;
  access_token: string;
  scope: string;
};

// the main step 1 function, getting the access token from twitter using the code that twitter sent us
export async function getTwitterOAuthToken(code: string) {
  try {
    // POST request to the token url to get the access token
    const res = await axios.post<TwitterTokenResponse>(
      TWITTER_OAUTH_TOKEN_URL,
      new URLSearchParams({ ...twitterOauthTokenParams, code }).toString(),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${BasicAuthToken}`,
        },
      }
    );

    return res.data;
  } catch (err) {
    console.log(`getTwitterOAuthToken Error: ${err}`);
    return null;
  }
}

// the shape of the response we should get
export interface TwitterUser {
  id: string;
  name: string;
  username: string;
}

// getting the twitter user from access token
export async function getTwitterUser(accessToken: string): Promise<TwitterUser | null> {
  try {
    // request GET https://api.twitter.com/2/users/me
    const res = await axios.get<{ data: TwitterUser }>("https://api.twitter.com/2/users/me", {
      headers: {
        "Content-type": "application/json",
        // put the access token in the Authorization Bearer token
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return res.data.data ?? null;
  } catch (err) {
    console.log(`getTwitterUser Error: ${err}`);
    return null;
  }
}


// the function which will be called when twitter redirects to the server at http://www.localhost:3001/oauth/twitter
export async function twitterOauth(req: Request<any, any, any, {code:string}>, res: Response) {
  const code = req.query.code; // getting the code if the user authorized the app

  // 1. get the access token with the code
  const TwitterOAuthToken = await getTwitterOAuthToken(code);
  console.log(`TwitterOAuthToken: ${JSON.stringify(TwitterOAuthToken)}`);

  if (!TwitterOAuthToken) {
    // redirect if no auth token
    return res.redirect(CLIENT_URL);
  }

  // 2. get the twitter user using the access token
  const twitterUser = await getTwitterUser(TwitterOAuthToken.access_token);
  console.log(`twitterUser: ${JSON.stringify(twitterUser)}`);

  if (!twitterUser) {
    // redirect if no twitter user
    return res.redirect(CLIENT_URL);
  }

  // 3. upsert the user in our db
  const user = await upsertUser(twitterUser)
  console.log(`user: ${JSON.stringify(user)}`);

  // 4. create cookie so that the server can validate the user
  //addCookieToRes(res, user, TwitterOAuthToken.access_token)
  const signedToken = getSignedToken(user, TwitterOAuthToken.access_token);
  // 5. finally redirect to the client
  return res.redirect(`${CLIENT_URL}?access_token=${signedToken}`);
}
