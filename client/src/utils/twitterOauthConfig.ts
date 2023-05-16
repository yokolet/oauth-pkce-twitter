const authEndpoint = 'https://twitter.com/i/oauth2/authorize';

const client_id = process.env.REACT_APP_TWITTER_CLIENT_ID;
const redirect_uri = process.env.REACT_APP_TWITTER_REDIRECT_URI;

export const getTwitterOauthUrl = (): string => {
  // temporarily uses static code verifier and challenge
  let code_challenge = process.env.REACT_APP_TWITTER_CODE_CHALLENGE;
  let state = "state"; // generateRandomString(16);
  let scope = ["users.read", "tweet.read", "follows.read", "follows.write"].join(" ");
  // @ts-ignore
  let args = new URLSearchParams({
    redirect_uri,
    client_id,
    state,
    response_type: 'code',
    code_challenge,
    code_challenge_method: "S256",
    scope,
  }).toString();
  return `${authEndpoint}?${args}`;
}
