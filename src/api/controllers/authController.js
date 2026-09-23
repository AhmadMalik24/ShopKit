// src/api/controllers/authController.js
import { registerService, loginService } from '../services/authService.js';
import { tokenService, refreshTokenService, revokeRefreshToken } from '../services/tokenService.js';
import { setRefreshCookie, clearRefreshCookie, getRefreshCookie } from '../../utils/cookies.js';
async function register(req, res) {
    try {
        const result = await registerService(req.body);
        return res.status(201).json({
            success: true,
            data: result,
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
        return res.status(200).json({
            success: true,
            accessToken
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

export { register, login, refreshToken, logout };


