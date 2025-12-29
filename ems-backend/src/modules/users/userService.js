import { userRepository } from './userRepository.js';

export const userService = {
  async getProfile(userId) {
    const user = await userRepository.findById(userId);
    if (!user) throw new Error('User not found');

    return sanitizeUser(user);
  },

  async updateProfile(userId, data) {
    const user = await userRepository.findById(userId);
    if (!user) throw new Error('User not found');
    if (!user.is_active) throw new Error('User is blocked');

    const updated = await userRepository.updateUser(userId, {
      name: data.name
    });

    return sanitizeUser(updated);
  },

  async listUsers() {
    const users = await userRepository.listUsers();
    return users.map(sanitizeUser);
  },

  async blockUser(userId) {
    const user = await userRepository.findById(userId);
    if (!user) throw new Error('User not found');

    return sanitizeUser(await userRepository.blockUser(userId));
  }
};

function sanitizeUser(user) {
  const { password_hash, ...safe } = user;
  return safe;
}
