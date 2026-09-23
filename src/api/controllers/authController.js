// src/api/controllers/authController.js
import { registerService, loginService } from '../services/authService.js';
import { tokenService, refreshTokenService, revokeRefreshToken } from '../services/tokenService.js';
import { setRefreshCookie, clearRefreshCookie, getRefreshCookie } from '../../utils/cookies.js';
import models from '../../database/models/index.js';

const { Tenant } = models;

async function register(req, res) {
  try {
    const result = await registerService(req.body);
    const { accessToken, refreshToken } = await tokenService(result.user);
    setRefreshCookie(res, refreshToken);

    const tenant = result.user.tenant_id
      ? await Tenant.findByPk(result.user.tenant_id)
      : null;

    return res.status(201).json({
      success: true,
      data: {
        accessToken,
        user: {
          id: result.user.id,
          name: result.user.name,
          email: result.user.email,
          role: result.user.role,
          tenant_id: result.user.tenant_id,
        },
        tenant: tenant
          ? {
              id: tenant.id,
              name: tenant.name,
              slug: tenant.slug,
              primary_color: tenant.primary_color,
              secondary_color: tenant.secondary_color,
              custom_domain: tenant.custom_domain,
              logo_url: tenant.logo_url,
            }
          : null,
      },
      error: null,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      data: null,
      error: error.message,
    });
  }
}

async function login(req, res) {
  try {
    const result = await loginService(req.body);
    const { accessToken, refreshToken } = await tokenService(result);
    setRefreshCookie(res, refreshToken);

    const tenant = result.tenant_id
      ? await Tenant.findByPk(result.tenant_id)
      : null;

    return res.status(200).json({
      success: true,
      data: {
        accessToken,
        user: {
          id: result.id,
          name: result.name,
          email: result.email,
          role: result.role,
          tenant_id: result.tenant_id,
        },
        tenant: tenant
          ? {
              id: tenant.id,
              name: tenant.name,
              slug: tenant.slug,
              primary_color: tenant.primary_color,
              secondary_color: tenant.secondary_color,
              custom_domain: tenant.custom_domain,
              logo_url: tenant.logo_url,
            }
          : null,
      },
      error: null,
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      data: null,
      error: error.message,
    });
  }
}

async function refreshToken(req, res) {
  try {
    const refreshToken = getRefreshCookie(req);
    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        data: null,
        error: 'No refresh token provided',
      });
    }
    const result = await refreshTokenService(refreshToken);
    setRefreshCookie(res, result.refreshToken);
    return res.status(200).json({
      success: true,
      data: { accessToken: result.accessToken },
      error: null,
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      data: null,
      error: error.message,
    });
  }
}

async function logout(req, res) {
  try {
    const refreshToken = getRefreshCookie(req);
    if (refreshToken) {
      await revokeRefreshToken(refreshToken);
    }
    clearRefreshCookie(res);
    return res.status(200).json({
      success: true,
      data: null,
      error: null,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: null,
      error: error.message,
    });
  }
}

async function me(req, res) {
  try {
    const { User } = models;
    const user = await User.findByPk(req.user.user_id, {
      attributes: { exclude: ['password_hash'] },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        data: null,
        error: 'User not found',
      });
    }

    const tenant = user.tenant_id ? await Tenant.findByPk(user.tenant_id) : null;

    return res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          tenant_id: user.tenant_id,
        },
        tenant: tenant
          ? {
              id: tenant.id,
              name: tenant.name,
              slug: tenant.slug,
              primary_color: tenant.primary_color,
              secondary_color: tenant.secondary_color,
              custom_domain: tenant.custom_domain,
              logo_url: tenant.logo_url,
            }
          : null,
      },
      error: null,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: null,
      error: error.message,
    });
  }
}

export { register, login, refreshToken, logout, me };