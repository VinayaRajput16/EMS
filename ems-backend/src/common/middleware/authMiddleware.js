import { verifyAccessToken } from '../utils/jwt.js';

export const authMiddleware = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ message: 'No token provided' });

  const token = header.split(' ')[1];

  try {
    const payload = verifyAccessToken(token);
    req.user = { id: payload.userId, role: payload.role };
    next();
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
};
