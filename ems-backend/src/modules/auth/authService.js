import { userRepository } from '../users/userRepository.js';
import { hashPassword, comparePassword } from '../../common/utils/password.js';
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken
} from '../../common/utils/jwt.js';

export const authService = {
  async register({ name, email, password }) {
    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) throw new Error('Email already exists');

    const passwordHash = await hashPassword(password);

    const user = await userRepository.createUser({
      name,
      email,
      passwordHash,
      role: 'USER'
    });

    const payload = { userId: user.id, role: user.role };

    return {
      user,
      accessToken: signAccessToken(payload),
      refreshToken: signRefreshToken(payload)
    };
  },

  async login({ email, password }) {
    const user = await userRepository.findByEmail(email);
    if (!user) throw new Error('Invalid credentials');
    if (!user.is_active) throw new Error('User is blocked');

    const valid = await comparePassword(password, user.password_hash);
    if (!valid) throw new Error('Invalid credentials');

    const payload = { userId: user.id, role: user.role };

    return {
      user,
      accessToken: signAccessToken(payload),
      refreshToken: signRefreshToken(payload)
    };
  },

  async refresh(refreshToken) {
    const payload = verifyRefreshToken(refreshToken);
    const user = await userRepository.findById(payload.userId);

    if (!user || !user.is_active) {
      throw new Error('Invalid refresh token');
    }

    return {
      accessToken: signAccessToken({
        userId: user.id,
        role: user.role
      })
    };
  }
};
