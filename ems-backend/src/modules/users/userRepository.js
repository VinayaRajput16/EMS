import prisma from '../../config/db.js';

export const userRepository = {
  createUser(data) {
    return prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password_hash: data.passwordHash,
        role: data.role,
        is_active: true
      }
    });
  },

  findByEmail(email) {
    return prisma.user.findUnique({
      where: { email }
    });
  },

  findById(id) {
    return prisma.user.findUnique({
      where: { id }
    });
  },

  listUsers() {
    return prisma.user.findMany({
      orderBy: { created_at: 'desc' }
    });
  },

  updateUser(id, data) {
    return prisma.user.update({
      where: { id },
      data
    });
  },

  blockUser(id) {
    return prisma.user.update({
      where: { id },
      data: { is_active: false }
    });
  }
};
