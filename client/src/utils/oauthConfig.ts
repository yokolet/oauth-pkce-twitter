const authEndpoint = 'https://accounts.spotify.com/authorize';

const client_id = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
const redirect_uri = process.env.REACT_APP_REDIRECT_URI;


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

export const getPKCEAuthorizationHref = (): string => {
  // temporarily uses static code verifier and challenge
  let code_verifier = process.env.REACT_APP_CODE_VERIFIER;
  let code_challenge = process.env.REACT_APP_CODE_CHALLENGE;
  let state = generateRandomString(16);
  let scope = 'user-read-private user-read-email';
  // @ts-ignore
  let args = new URLSearchParams({
      response_type: 'code',
      client_id,
      scope,
      redirect_uri,
      state,
      code_challenge_method: 'S256',
      code_challenge: code_challenge
    });
  alert(args);
  return `${authEndpoint}?${args}`;
}
