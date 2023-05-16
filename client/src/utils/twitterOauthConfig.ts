const authEndpoint = 'https://twitter.com/i/oauth2/authorize';

const client_id = process.env.REACT_APP_TWITTER_CLIENT_ID;
const redirect_uri = process.env.REACT_APP_TWITTER_REDIRECT_URI;


export const generateRandomString = (length: number) => {
  let text = '';
  let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

export async function generatePKCEChallenge(code_verifier: string) {
  const buffer = await window.crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(code_verifier)
  );
  // Generate base64url string
  // btoa is deprecated in Node.js but is used here for web browser compatibility
  // (which has no good replacement yet, see also https://github.com/whatwg/html/issues/6811)
  return btoa(String.fromCharCode(...new Uint8Array(buffer)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

async function getPKCEChallenge(code_verifier: string): Promise<string> {
  const challenge = await generatePKCEChallenge(code_verifier);
  return challenge;
}

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
