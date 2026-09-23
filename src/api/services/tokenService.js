import crypto from 'crypto';
import models from '../../database/models/index.js';
import {
    generateAccessToken,
    generateRefreshToken,
    verifyToken,
} from '../../utils/jwt.js';
import { jwtConfig } from '../../config/auth.js';
const { RefreshToken, User } = models;

/**
 * Hash a refresh token with SHA-256 (deterministic, queryable)
 */
function hashToken(token) {
    return crypto.createHash('sha256').update(token).digest('hex');
}

/**
 * Issue both tokens for a user and store the refresh token hash
 */
async function tokenService(user) {
    const accessToken = generateAccessToken({
        user_id: user.id,
        tenant_id: user.tenant_id,
        role: user.role,
    });

    const refreshToken = generateRefreshToken({
        user_id: user.id,
        tenant_id: user.tenant_id,
        role: user.role,
    });

    const tokenHash = hashToken(refreshToken);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await RefreshToken.create({
        user_id: user.id,
        token_hash: tokenHash,
        expires_at: expiresAt,
    });

    return { accessToken, refreshToken };
}

/**
 * Verify refresh token and issue a new access token
 */
async function refreshTokenService(refreshToken) {
    // 1. Verify JWT signature
    let decoded;
    try {
        decoded = verifyToken(refreshToken, jwtConfig.refreshToken);
    } catch {
        throw new Error('Invalid or expired refresh token');
    }

    if (decoded.type !== 'refresh') {
        throw new Error('Wrong token type');
    }

    // 2. Hash the incoming token and look it up
    const tokenHash = hashToken(refreshToken);

    const storedToken = await RefreshToken.findOne({
        where: { token_hash: tokenHash, user_id: decoded.user_id },
    });

    if (!storedToken) throw new Error('Refresh token not found');
    if (storedToken.revoked_at) throw new Error('Refresh token revoked');
    if (new Date(storedToken.expires_at) < new Date()) {
        throw new Error('Refresh token expired');
    }

    // 3. Re-fetch user for current role/tenant
    const user = await User.findByPk(decoded.user_id);
    if (!user) throw new Error('User not found');

    // 4. Generate new access token
    const newAccessToken = generateAccessToken({
        user_id: user.id,
        tenant_id: user.tenant_id,
        role: user.role,
    });

    // 5. Generate new refresh token
    const newRefreshToken = generateRefreshToken({ user_id: user.id });
    const newTokenHash = hashToken(newRefreshToken);
    const newExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    // 6. Delete old, insert new (rotation)
    await storedToken.destroy();

    await RefreshToken.create({
        user_id: user.id,
        token_hash: newTokenHash,
        expires_at: newExpiresAt,
    });

    // 7. Return BOTH tokens
    return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
    };
}

async function revokeRefreshToken(refreshToken) {
    const tokenHash = hashToken(refreshToken);

    await RefreshToken.destroy({
        where: { token_hash: tokenHash },
    });
}

export { tokenService, refreshTokenService, revokeRefreshToken };