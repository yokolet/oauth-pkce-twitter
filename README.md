# OAuth PKCE (Proof Key for Code Exchange) Example for Twitter

The application performs OAuth 2.0 authorization code PKCE flow.
The client React app initiates the authorization sending client id, code_challenge, redirect URI
and some more params to Twitter's auth endpoint.
Once authorized, the server app receives a code to get an access token from Twitter.
The server app makes a query to Twitter's me-query endpoint to get a user info which will be saved
in the local database (PostgreSQL).
Then the server app redirects to the React app with access token.
The React app sends me-query to the server app and renders a user info.

### How to Use

#### Setup Twitter OAuth Authentication

Reference: https://docs.ultimatemember.com/article/1699-social-login-twitter-api-v2-setup

Redirect URL should include www, for example, http://www.localhost:3001/oauth/twitter

#### Install JavaScript Packages
```bash
% yarn install
```

#### Create Database on PostgreSQL

Example
```bash
% psql postgres
postgres=# create database "twitter-oauth2"
```

#### Run Migration
```bash
% yarn migrate-db
```

#### Create Env Files

- for server, create .env

    Example
    ```
    CLIENT_URL=http://localhost:3000
    SERVER_PORT=3001
    JWT_SECRET=write-your-jwt-secret
    TWITTER_DATABASE_URL=postgres://postgres:postgres@localhost:5432/twitter-oauth2
    TWITTER_CLIENT_ID=write-your-twitter-client-id
    TWITTER_CLIENT_SECRET=write-your-twitter-client-secret
    TWITTER_CODE_VERIFIER=omjCvT2xQpr0LAznzCNMHDdQ7neFv5jq29LkMZHN0MQPmfXqVs48eDjVg3u0ov3U
    ```

- for client, create .env.local

    Example
    ```
    REACT_APP_TWITTER_CLIENT_ID=write-your-twitter-client-id
    REACT_APP_TWITTER_REDIRECT_URI=http://www.localhost:3001/oauth/twitter
    REACT_APP_TWITTER_CODE_CHALLENGE=WeI7ul0uzUr0Zv89EPknzv4iNqmQuEysEtkWan7P3FA
    ```

#### Start Two Servers
```bash
% yarn client:start
% yarn server:dev
```

#### Make Request from Browser
```
http://localhost:3000
```
Then, click login button and authorize app.


### Note
- client: react, redux-toolkit, chakra-ui
- server: express
- currently, code_verifier and code_challenge are hardcoded in .env and .env.local
  - Those should be dynamically generated.
  - Reference: https://script.gs/generate-code-verifier-challenge-for-oauth2-with-pkce/
- the client app doesn't save the access token at this moment.


### Reference
#### Proof Kay for Code Exchange
- [RFC 7636: Proof Key for Code Exchange](https://oauth.net/2/pkce/)
- [Authorization Code Flow with Proof Key for Code Exchange (PKCE)](https://blog.miniorange.com/auth-flow-with-pkce/)
- [Authorization Code Flow with PKCE (OAuth) in a React application](https://hceris.com/oauth-authorization-code-flow-pkce-for-react/)
- [Twitter Documentation: Authentication](https://developer.twitter.com/en/docs/authentication/oauth-2-0/authorization-code)
- [Spotify for Developers: Authorization Code with PKCE Flow](https://developer.spotify.com/documentation/web-api/tutorials/code-pkce-flow)

#### Implementation
- [Implementing Authentication with Twitter OAuth 2.0 using Typescript, Express.js and Next.js](https://dev.to/reinforz/implementing-authentication-with-twitter-oauth-20-using-typescript-node-js-express-js-and-next-js-in-a-full-stack-application-353d)
- [Create a React App with TS, Redux and OAuth 2.0 - Spotify login example](https://medium.com/swlh/create-a-react-app-with-typescript-redux-and-oauth-2-0-7f62d57890df)
