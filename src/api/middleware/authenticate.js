// src/api/middleware/authenticate.js
import { verifyToken } from '../../utils/jwt.js';
import { jwtConfig } from '../../config/auth.js';

export default function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      data: null,
      error: 'No token provided',
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = verifyToken(token, jwtConfig.accessToken);

    if (decoded.type !== 'access') {
      throw new Error('Wrong token type');
    }

    req.user = {
      user_id: decoded.user_id,
      tenant_id: decoded.tenant_id,
      role: decoded.role,
    };

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      data: null,
      error: 'Invalid or expired access token',
    });
  }
}