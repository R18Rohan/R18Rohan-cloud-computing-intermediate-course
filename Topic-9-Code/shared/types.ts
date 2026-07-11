export interface IUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

export interface LoginResponse {
  message: string;
  user: IUser;
}

export interface ApiResponse<T> {
  data?: T;
  error?: {
    message: string;
    statusCode: number;
  };
}
