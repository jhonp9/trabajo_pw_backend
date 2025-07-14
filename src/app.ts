import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { config } from 'dotenv';
import authRouter from './routes/auth.routes';
import gamesRouter from './routes/games.routes';
import newsRouter from './routes/news.routes';
import usersRouter from './routes/users.routes';
import { errorHandler } from './middlewares/error.middleware';

config();

const app = express();

// Middlewares
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(cookieParser());
app.use(express.json());

// Routes
app.use('/api/auth', authRouter);
app.use('/api/games', gamesRouter);
app.use('/api/news', newsRouter);
app.use('/api/users', usersRouter);

// Error handling
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));