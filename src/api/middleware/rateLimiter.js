// src/api/middleware/rateLimiter.js
import rateLimit, { ipKeyGenerator } from 'express-rate-limit';

const sharedOptions = {
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      data: null,
      error: 'Too many requests. Please try again later.',
    });
  },
};

export const globalLimiter = rateLimit({
  ...sharedOptions,
  windowMs: 15 * 60 * 1000,
  max: 500,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      data: null,
      error: 'Too many requests from this IP. Please slow down.',
    });
  },
});

export const loginLimiter = rateLimit({
  ...sharedOptions,
  windowMs: 15 * 60 * 1000,
  max: 5,
  skipSuccessfulRequests: true,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      data: null,
      error: 'Too many login attempts. Try again in 15 minutes.',
    });
  },
});

export const registerLimiter = rateLimit({
  ...sharedOptions,
  windowMs: 60 * 60 * 1000,
  max: 3,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      data: null,
      error: 'Too many accounts created from this IP. Try again in an hour.',
    });
  },
});

export const refreshLimiter = rateLimit({
  ...sharedOptions,
  windowMs: 60 * 60 * 1000,
  max: 30,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      data: null,
      error: 'Too many token refresh requests. Try again later.',
    });
  },
});

export const uploadLimiter = rateLimit({
  ...sharedOptions,
  windowMs: 60 * 60 * 1000,
  max: 50,
  // IPv6-safe key generator
  keyGenerator: (req, res) => {
    if (req.user?.user_id) {
      return `user:${req.user.user_id}`;
    }
    return `ip:${ipKeyGenerator(req, res)}`;
  },
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      data: null,
      error: 'Upload limit reached. Try again in an hour.',
    });
  },
});

export const publicOrderLimiter = rateLimit({
  ...sharedOptions,
  windowMs: 60 * 60 * 1000,
  max: 20,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      data: null,
      error: 'Too many order attempts. Try again later.',
    });
  },
});