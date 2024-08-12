import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface AuthData {
  name?: string;
  email: string;
  password: string;
  confirmPassword?: string;
}

export const useAuth = () => {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const register = async (data: AuthData) => {
    if (data.password !== data.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setError(null);

    try {
      const response = await fetch('http://localhost:3000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.text();
      console.log('Register Success:', result);
      router.push('/login');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }
    }
  };

  const login = async (data: AuthData) => {
    setError(null);

    try {
      const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage || 'Network response was not ok');
      }

      const { token } = await response.json();

      if (token) {
        localStorage.setItem('token', token);
        console.log('Login Success:', token);
        router.push('/');
      } else {
        throw new Error('Authentication failed. No token received.');
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };


  return { login, register, logout, error };
};
