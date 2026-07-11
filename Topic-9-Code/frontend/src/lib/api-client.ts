import { ApiResponse } from '../../../shared/types';

// Load backend base URL from environment variables, defaulting to port 4000
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Enforce including credentials (cookies) in cross-origin fetch requests
  const defaultOptions: RequestInit = {
    ...options,
    credentials: 'include', // Crucial for reading/writing HTTP-only auth cookies!
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, defaultOptions);
    const data = await response.json();

    if (!response.ok) {
      return {
        error: {
          message: data.error || 'API Fetch Request failed.',
          statusCode: response.status,
        },
      };
    }

    return { data };
  } catch (error: any) {
    return {
      error: {
        message: error.message || 'API Network connectivity failure.',
        statusCode: 500,
      },
    };
  }
}
