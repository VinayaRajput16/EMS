import authRoutes from '../modules/auth/authRoutes.js';
import healthRoutes from './healthRoutes.js';
import userRoutes from '../modules/users/userRoutes.js';
import { authMiddleware } from '../common/middleware/authMiddleware.js';
export const registerRoutes = (app) => {
  app.use('/auth', authRoutes);
  app.use('/health', healthRoutes);
   app.use(authMiddleware);
  app.use('/users', userRoutes);
};
