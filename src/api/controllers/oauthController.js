// src/api/controllers/oauthController.js
import crypto from 'crypto';
import * as oauthService from '../services/oauthService.js';
import { tokenService } from '../services/tokenService.js';
import { setRefreshCookie } from '../../utils/cookies.js';

/**
 * GET /auth/google
 * Redirect the user to Google's consent screen.
 */
export async function initiateGoogleAuth(req, res) {
  try {
    // 1. Generate a random state token to prevent CSRF
    const state = crypto.randomBytes(32).toString('hex');

    // 2. Store it in a short-lived cookie so we can verify on callback
    res.cookie('oauth_state', state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',          // must be 'lax' for the redirect to work
      maxAge: 10 * 60 * 1000,   // 10 minutes
      path: '/',
    });

    // 3. Optionally store the redirect target
    const redirectTo = req.query.redirect || '/dashboard';
    res.cookie('oauth_redirect', redirectTo, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 10 * 60 * 1000,
      path: '/',
    });

    // 4. Build and redirect to Google
    const authUrl = oauthService.getGoogleAuthUrl(state);
    return res.redirect(authUrl);
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: null,
      error: error.message,
    });
  }
}

/**
 * GET /auth/google/callback
 * Google redirects here with a code and state.
 */
export async function handleGoogleCallback(req, res) {
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

  try {
    const { code, state } = req.query;

    // 1. Verify state matches what we stored
    const storedState = req.cookies?.oauth_state;
    if (!state || !storedState || state !== storedState) {
      return res.redirect(`${frontendUrl}/login?error=invalid_state`);
    }

    if (!code) {
      return res.redirect(`${frontendUrl}/login?error=no_code`);
    }

    // 2. Exchange code for tokens
    const tokens = await oauthService.exchangeCodeForTokens(code);

    if (!tokens.id_token) {
      return res.redirect(`${frontendUrl}/login?error=no_id_token`);
    }

    // 3. Verify id_token and extract user identity
    const googleUser = await oauthService.verifyGoogleIdToken(tokens.id_token);

    // 4. Find or create the ShopKit user
    const user = await oauthService.findOrCreateGoogleUser(googleUser);

    // 5. Issue ShopKit access + refresh tokens
    const { accessToken, refreshToken } = await tokenService(user);
    setRefreshCookie(res, refreshToken);

    // 6. Clean up the temporary cookies
    res.clearCookie('oauth_state', { path: '/' });
    res.clearCookie('oauth_redirect', { path: '/' });

    // 7. Redirect to frontend with the access token
    const redirectTo = req.cookies?.oauth_redirect || '/dashboard';
    const targetUrl = `${frontendUrl}${redirectTo}?accessToken=${accessToken}`;
    return res.redirect(targetUrl);
  } catch (error) {
    console.error('[OAuth] Callback error:', error);
    return res.redirect(
      `${frontendUrl}/login?error=${encodeURIComponent(error.message)}`
    );
  }
}