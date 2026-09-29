// src/api/services/oauthService.js
import { OAuth2Client } from 'google-auth-library';
import models from '../../database/models/index.js';

const { User, Tenant } = models;

const googleClient = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

/**
 * Build the URL to redirect the user to Google's consent screen.
 * `state` is a CSRF token that we'll verify on callback.
 */
export function getGoogleAuthUrl(state) {
  return googleClient.generateAuthUrl({
    access_type: 'offline',
    scope: ['openid', 'email', 'profile'],
    state,
    prompt: 'consent',
  });
}

/**
 * Exchange the authorization code for tokens.
 * This is a server-to-server call — requires the client secret.
 */
export async function exchangeCodeForTokens(code) {
  const { tokens } = await googleClient.getToken(code);
  return tokens;
}

/**
 * Verify the id_token signature, issuer, and audience.
 * Returns the user's identity if valid.
 */
export async function verifyGoogleIdToken(idToken) {
  const ticket = await googleClient.verifyIdToken({
    idToken,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();

  return {
    googleId: payload.sub,
    email: payload.email,
    emailVerified: payload.email_verified,
    name: payload.name,
    picture: payload.picture,
  };
}

/**
 * Find an existing user by Google ID, or link an existing email,
 * or create a new user + tenant.
 */
export async function findOrCreateGoogleUser(googleUser) {
  // 1. User already linked to this Google account
  let user = await User.findOne({
    where: { google_id: googleUser.googleId },
  });
  if (user) return user;

  // 2. Email exists — link this Google account to it
  user = await User.findOne({ where: { email: googleUser.email } });
  if (user) {
    await user.update({
      google_id: googleUser.googleId,
      avatar_url: googleUser.picture || user.avatar_url,
    });
    return user;
  }

  // 3. Brand new user — create tenant + user
  const baseSlug = googleUser.email
    .split('@')[0]
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-');

  let slug = baseSlug;
  let counter = 1;
  while (await Tenant.findOne({ where: { slug } })) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  const tenant = await Tenant.create({
    name: `${googleUser.name}'s Store`,
    slug,
    subscription_status: 'trial',
    subscription_plan: 'starter',
  });

  user = await User.create({
    tenant_id: tenant.id,
    email: googleUser.email,
    google_id: googleUser.googleId,
    avatar_url: googleUser.picture,
    name: googleUser.name,
    role: 'store_owner',
    is_verified: true,
    password_hash: null,
  });

  await tenant.update({ owner_id: user.id });

  return user;
}