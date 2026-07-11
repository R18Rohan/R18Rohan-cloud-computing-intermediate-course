import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import { IUser, LoginResponse } from '../../shared/types';

const app = express();
const JWT_SECRET = process.env.JWT_SECRET || 'topic9secretkeyforfullstackauth';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

// 1. Configure CORS to allow Next.js credentials (HTTP-only cookies)
app.use(cors({
  origin: FRONTEND_URL,
  credentials: true // Crucial for cookie passing!
}));

app.use(express.json());
app.use(cookieParser());

// Mock user store
const mockUser: IUser = {
  id: 'user_999',
  name: 'John Doe',
  email: 'john@example.com',
  role: 'user'
};

// 2. Login Endpoint setting authentication cookie
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (email === mockUser.email && password === 'password123') {
    const token = jwt.sign({ id: mockUser.id, role: mockUser.role }, JWT_SECRET, { expiresIn: '1h' });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 3600000 // 1 hour
    });

    const responseData: LoginResponse = {
      message: 'Successfully logged in!',
      user: mockUser
    };
    return res.json(responseData);
  }

  return res.status(401).json({ error: 'Invalid email or password' });
});

// 3. Logout Endpoint clearing authentication cookie
app.post('/api/auth/logout', (req: Request, res: Response) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out successfully' });
});

// 4. Protected Session checking endpoint
app.get('/api/users/me', (req: Request, res: Response) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ error: 'Access Denied: Session cookie missing.' });
  }

  try {
    jwt.verify(token, JWT_SECRET);
    return res.json(mockUser);
  } catch (error) {
    return res.status(401).json({ error: 'Access Denied: Invalid or expired token.' });
  }
});

export default app;
