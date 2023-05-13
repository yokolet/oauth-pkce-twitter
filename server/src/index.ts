import { CLIENT_URL, SERVER_PORT } from "./config";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import { spotifyOauth } from './oauth2';

const app = express();

const origin = [CLIENT_URL];

app.use(cookieParser());
app.use(cors({
   origin,
   credentials: true
 }))

app.get("/ping", (_, res) => res.json("pong"));
app.get('/oauth/spotify', spotifyOauth);

app.listen(SERVER_PORT, () => console.log(`Server listening on port ${SERVER_PORT}`))
