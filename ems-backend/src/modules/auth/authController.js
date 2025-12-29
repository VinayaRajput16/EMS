import { authService } from './authService.js';
import { validateRegister, validateLogin } from './authDto.js';

export const authController = {
  async register(req, res, next) {
    try {
      validateRegister(req.body);
      const data = await authService.register(req.body);
      res.status(201).json(data);
    } catch (err) {
      next(err);
    }
  },

  async login(req, res, next) {
    try {
      validateLogin(req.body);
      const data = await authService.login(req.body);
      res.json(data);
    } catch (err) {
      next(err);
    }
  },

  async refresh(req, res, next) {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) throw new Error('Refresh token required');

      const data = await authService.refresh(refreshToken);
      res.json(data);
    } catch (err) {
      next(err);
    }
  }
};
