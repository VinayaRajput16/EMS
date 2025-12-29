import { userService } from './userService.js';
import { validateUpdateProfile } from './userDto.js';

export const userController = {
  async getMe(req, res, next) {
    try {
      const user = await userService.getProfile(req.user.id);
      res.json(user);
    } catch (err) {
      next(err);
    }
  },

  async updateMe(req, res, next) {
    try {
      validateUpdateProfile(req.body);
      const user = await userService.updateProfile(req.user.id, req.body);
      res.json(user);
    } catch (err) {
      next(err);
    }
  },

  async list(req, res, next) {
    try {
      const users = await userService.listUsers();
      res.json(users);
    } catch (err) {
      next(err);
    }
  },

  async block(req, res, next) {
    try {
      const user = await userService.blockUser(req.params.id);
      res.json(user);
    } catch (err) {
      next(err);
    }
  }
};
