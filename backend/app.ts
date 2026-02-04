
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import logRoutes from './routes/log.routes';
import { errorHandler } from './middlewares/errorHandler';

dotenv.config();

const app = express();

// Security Middlewares
// Fix: Use 'as any' to avoid PathParams overload mismatch errors with helmet middleware
app.use(helmet() as any); 
// Fix: Use 'as any' to ensure cors middleware compatibility with express type definitions
app.use(cors({ origin: process.env.CLIENT_URL || '*' }) as any);
// Fix: Use 'as any' to resolve express.json type mismatch in current environment
app.use(express.json() as any);

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/logs', logRoutes);

// Error Handling
app.use(errorHandler);

export default app;
