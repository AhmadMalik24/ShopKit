// src/utils/cookies.js

const isProduction = process.env.NODE_ENV === 'production';

const REFRESH_COOKIE_NAME = 'refreshToken';

const cookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: 'strict',
  path: '/api/v1/auth',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
};

export function setRefreshCookie(res, refreshToken) {
  res.cookie(REFRESH_COOKIE_NAME, refreshToken, cookieOptions);
}

export function clearRefreshCookie(res) {
  res.clearCookie(REFRESH_COOKIE_NAME, {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'strict',
    path: '/api/v1/auth',
  });
}

export function getRefreshCookie(req) {
  return req.cookies?.[REFRESH_COOKIE_NAME] || null;
}

export { REFRESH_COOKIE_NAME };