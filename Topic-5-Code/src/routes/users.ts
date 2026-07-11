import { Router, Request, Response, NextFunction } from 'express';
import { validateUserBody } from '../middlewares/validation';
import { CustomError } from '../middlewares/errorHandler';

const router = Router();

// Define User Interface
interface User {
  id: string;
  name: string;
  email: string;
  age: number;
}

// In-memory Array Database
let usersDatabase: User[] = [
  { id: '1', name: 'Alice Smith', email: 'alice@example.com', age: 25 },
  { id: '2', name: 'Bob Jones', email: 'bob@example.com', age: 32 }
];

// 1. GET /api/users - List all users
router.get('/', (req: Request, res: Response) => {
  res.json(usersDatabase);
});

// 2. GET /api/users/:id - Get user by ID
router.get('/:id', (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const user = usersDatabase.find(u => u.id === id);

  if (!user) {
    const error: CustomError = new Error(`User with ID '${id}' not found`);
    error.statusCode = 404;
    return next(error);
  }

  res.json(user);
});

// 3. POST /api/users - Create a new user (validated)
router.post('/', validateUserBody, (req: Request, res: Response) => {
  const { name, email, age } = req.body;

  const newUser: User = {
    id: (usersDatabase.length + 1).toString(),
    name,
    email,
    age
  };

  usersDatabase.push(newUser);
  res.status(201).json(newUser);
});

// 4. PUT /api/users/:id - Update user details (validated)
router.put('/:id', validateUserBody, (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { name, email, age } = req.body;

  const userIndex = usersDatabase.findIndex(u => u.id === id);
  if (userIndex === -1) {
    const error: CustomError = new Error(`User with ID '${id}' not found for update`);
    error.statusCode = 404;
    return next(error);
  }

  const updatedUser: User = { id, name, email, age };
  usersDatabase[userIndex] = updatedUser;

  res.json(updatedUser);
});

// 5. DELETE /api/users/:id - Delete user by ID
router.delete('/:id', (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const userExists = usersDatabase.some(u => u.id === id);

  if (!userExists) {
    const error: CustomError = new Error(`User with ID '${id}' not found for deletion`);
    error.statusCode = 404;
    return next(error);
  }

  usersDatabase = usersDatabase.filter(u => u.id !== id);
  res.status(200).json({ message: `User with ID '${id}' deleted successfully` });
});

export default router;
