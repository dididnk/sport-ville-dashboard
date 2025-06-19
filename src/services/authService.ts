import { z } from 'zod';
import { mockUsers } from './mockData';

// Validation schema for login
export const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

// Validation schema for user registration
export const registerSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
});

export type LoginForm = z.infer<typeof loginSchema>;
export type RegisterForm = z.infer<typeof registerSchema>;

// Mock credentials for admin login
const ADMIN_EMAIL = 'admin@example.com';
const ADMIN_PASSWORD = 'admin123';

// Mock authentication service
export const authService = {
    login: async (credentials: LoginForm): Promise<{ user: any; token: string } | null> => {
        // Simulate API request delay
        await new Promise(resolve => setTimeout(resolve, 800));

        // Check if credentials match admin account
        if (credentials.email === ADMIN_EMAIL && credentials.password === ADMIN_PASSWORD) {
            const adminUser = mockUsers.find(user => user.role === 'admin');
            return {
                user: adminUser,
                token: 'mock-jwt-token',
            };
        }

        // Check if credentials match other mock users (simplified for demo)
        const matchedUser = mockUsers.find(
            user => user.email.toLowerCase() === credentials.email.toLowerCase()
        );

        if (matchedUser && credentials.password === 'password123') {
            return {
                user: matchedUser,
                token: 'mock-jwt-token',
            };
        }

        return null;
    },

    logout: async (): Promise<void> => {
        // Simulate API request delay
        await new Promise(resolve => setTimeout(resolve, 300));

        // In a real application, you would call an API endpoint to invalidate the token
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
    },

    getCurrentUser: (): any => {
        const userStr = localStorage.getItem('auth_user');
        if (!userStr) return null;
        try {
            return JSON.parse(userStr);
        } catch (error) {
            console.error('Error parsing user from localStorage', error);
            return null;
        }
    },

    isAuthenticated: (): boolean => {
        return !!localStorage.getItem('auth_token');
    },
};