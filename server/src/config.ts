import { PrismaClient } from "@prisma/client"
import { CookieOptions, Response } from "express";
import jwt from "jsonwebtoken";
import { SpotifyUser } from './oauth2';

export const CLIENT_URL = process.env.CLIENT_URL!
export const SERVER_PORT = process.env.SERVER_PORT!

export const prisma = new PrismaClient()

// JWT_SECRET from our environment variable file
export const JWT_SECRET = process.env.JWT_SECRET!

// cookie name
export const COOKIE_NAME = 'oauth2_token'

// cookie setting options
const cookieOptions: CookieOptions = {
  httpOnly: true,
  sameSite: "strict"
}

// step 4
export function addCookieToRes(res: Response, user: SpotifyUser, accessToken: string) {
  const { id, name } = user;
  const token = jwt.sign({ // Signing the token to send to client side
    id,
    accessToken,
    name
  }, JWT_SECRET);
  res.cookie(COOKIE_NAME, token, {  // adding the cookie to response here
    ...cookieOptions,
    expires: new Date(Date.now() + 7200 * 1000),
  });
}
