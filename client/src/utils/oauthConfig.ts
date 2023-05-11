import pkceChallenge from 'pkce-challenge';

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
export const getPKCEAuthorizationHref = (): string => {
  let { code_verifier, code_challenge} = pkceChallenge();
  localStorage.setItem('code_verifier', code_verifier);
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

const scopes = [
  'user-read-private',
];

export const getAuthorizeHref = (): string => {
  return `${authEndpoint}?client_id=${client_id}&redirect_uri=${redirect_uri}&scope=${scopes.join("%20")}&response_type=token`;
}
