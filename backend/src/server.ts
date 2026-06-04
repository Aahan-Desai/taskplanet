import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db';
import authRoutes from './routes/authRoutes';
import postRoutes from './routes/postRoutes';

dotenv.config();

connectDB();

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Mount API Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);

app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'TaskPlanet Social API (TypeScript) is running smoothly.' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server executing in ${process.env.NODE_ENV} mode on port ${PORT}`);
 });