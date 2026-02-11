import authRoutes from '../modules/auth/authRoutes.js';
import healthRoutes from './healthRoutes.js';
import userRoutes from '../modules/users/userRoutes.js';
import { authMiddleware } from '../common/middleware/authMiddleware.js';
export const registerRoutes = (app) => {
  // public routes
  app.use('/auth', authRoutes);
  app.use('/health', healthRoutes);

  // protected routes
  app.use('/users', authMiddleware, userRoutes);
};
