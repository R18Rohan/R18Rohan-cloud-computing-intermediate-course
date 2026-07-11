import express from 'express';
import cors from 'cors';
import usersRouter from './routes/users';
import { errorHandler } from './middlewares/errorHandler';

const app = express();

// 1. Mount Global Middlewares
app.use(cors());
app.use(express.json()); // Parses incoming JSON body payloads

// 2. Base API health route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'Express REST API'
  });
});

// 3. Register Routers
app.use('/api/users', usersRouter);

// 4. Centralized Error Handler (must be registered last!)
app.use(errorHandler);

export default app;
