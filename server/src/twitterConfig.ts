const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../.env') })

import { PrismaClient } from "@prisma/client"
import { CookieOptions, Response } from "express";
import jwt from "jsonwebtoken";
import { TwitterUser } from './twitterOauth2';

export const CLIENT_URL = process.env.CLIENT_URL!
export const SERVER_PORT = process.env.SERVER_PORT!
export const CODE_VERIFIER = process.env.TWITTER_CODE_VERIFIER!
export const CLIENT_ID = process.env.TWITTER_CLIENT_ID!
export const CLIENT_SECRET = process.env.TWITTER_CLIENT_SECRET!

export const prisma = new PrismaClient()

export function upsertUser(twitterUser: TwitterUser) {
  // create a new user in our database or return an old user who already signed up earlier
  return prisma.user.upsert({
    create: {
      username: twitterUser.username,
      id: twitterUser.id,
      name: twitterUser.name,
    },
    update: {
      id: twitterUser.id,
    },
    where: {
      id: twitterUser.id
    },
  });
}

// JWT_SECRET from our environment variable file
export const JWT_SECRET = process.env.JWT_SECRET!

// cookie name
export const TWITTER_COOKIE_NAME = 'twitter_oauth2_token'

// cookie setting options
const cookieOptions: CookieOptions = {
  httpOnly: true,
  sameSite: "strict"
}

// step 4
export function addCookieToRes(res: Response, user: TwitterUser, accessToken: string) {
  const { id, name } = user;
  const token = jwt.sign({ // Signing the token to send to client side
    id,
    accessToken,
    name
  }, JWT_SECRET);
  res.cookie(TWITTER_COOKIE_NAME, token, {  // adding the cookie to response here
    ...cookieOptions,
    expires: new Date(Date.now() + 7200 * 1000),
  });
}

export function getSignedToken(user: TwitterUser, accessToken: string) {
  const { id, name } = user;
  return jwt.sign({ // Signing the token to send to client side
    id,
    accessToken,
    name
  }, JWT_SECRET);
}
