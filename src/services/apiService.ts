import type {User, Report, Activity, DashboardStats} from '../types';
import { mockUsers, mockReports, mockActivities, mockDashboardStats } from './mockData';

// Mock API service
export const apiService = {
    // User management
    getUsers: async (): Promise<User[]> => {
        await new Promise(resolve => setTimeout(resolve, 500));
        return [...mockUsers];
    },

    getUserById: async (id: string): Promise<User | undefined> => {
        await new Promise(resolve => setTimeout(resolve, 300));
        return mockUsers.find(user => user.id === id);
    },

    createUser: async (userData: Partial<User>): Promise<User> => {
        await new Promise(resolve => setTimeout(resolve, 800));
        const newUser = {
            id: `user-${Date.now()}`,
            name: userData.name || '',
            email: userData.email || '',
            status: userData.status || 'active',
            role: userData.role || 'user',
            joinDate: new Date().toISOString().split('T')[0],
            lastActive: new Date().toISOString().split('T')[0],
            avatar: userData.avatar || `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`,
            verified: false,
            verificationStatus: 'pending',
            verificationDocuments: [],
            activities: 0,
            reports: 0,
        } as User;

        mockUsers.push(newUser);
        return newUser;
    },

    updateUser: async (id: string, userData: Partial<User>): Promise<User | undefined> => {
        await new Promise(resolve => setTimeout(resolve, 800));
        const userIndex = mockUsers.findIndex(user => user.id === id);

        if (userIndex === -1) return undefined;

        // Update user data
        mockUsers[userIndex] = { ...mockUsers[userIndex], ...userData };
        return mockUsers[userIndex];
    },

    deleteUser: async (id: string): Promise<boolean> => {
        await new Promise(resolve => setTimeout(resolve, 500));
        const userIndex = mockUsers.findIndex(user => user.id === id);

        if (userIndex === -1) return false;

        mockUsers.splice(userIndex, 1);
        return true;
    },

    // Reports management
    getReports: async (): Promise<Report[]> => {
        await new Promise(resolve => setTimeout(resolve, 500));
        return [...mockReports];
    },

    getReportById: async (id: string): Promise<Report | undefined> => {
        await new Promise(resolve => setTimeout(resolve, 300));
        return mockReports.find(report => report.id === id);
    },

    updateReport: async (id: string, reportData: Partial<Report>): Promise<Report | undefined> => {
        await new Promise(resolve => setTimeout(resolve, 500));
        const reportIndex = mockReports.findIndex(report => report.id === id);

        if (reportIndex === -1) return undefined;

        // Update report data
        mockReports[reportIndex] = { ...mockReports[reportIndex], ...reportData };
        return mockReports[reportIndex];
    },

    // Activities management
    getActivities: async (): Promise<Activity[]> => {
        await new Promise(resolve => setTimeout(resolve, 500));
        return [...mockActivities];
    },

    getUserActivities: async (userId: string): Promise<Activity[]> => {
        await new Promise(resolve => setTimeout(resolve, 500));
        return mockActivities.filter(activity => activity.userId === userId);
    },

    // Verification management
    getPendingVerifications: async (): Promise<User[]> => {
        await new Promise(resolve => setTimeout(resolve, 500));
        return mockUsers.filter(user => user.verificationStatus === 'pending');
    },

    updateVerificationStatus: async (
        userId: string,
        status: 'approved' | 'rejected',
        notes?: string
    ): Promise<User | undefined> => {
        await new Promise(resolve => setTimeout(resolve, 500));
        const userIndex = mockUsers.findIndex(user => user.id === userId);

        if (userIndex === -1) return undefined;

        // Update verification status
        mockUsers[userIndex] = {
            ...mockUsers[userIndex],
            verificationStatus: status,
            verified: status === 'approved',
        };

        // Update document status and notes if provided
        if (mockUsers[userIndex].verificationDocuments && mockUsers[userIndex].verificationDocuments!.length > 0) {
            mockUsers[userIndex].verificationDocuments![0].status = status;
            if (notes) {
                mockUsers[userIndex].verificationDocuments![0].notes = notes;
            }
        }

        return mockUsers[userIndex];
    },

    // Dashboard stats
    getDashboardStats: async (): Promise<DashboardStats> => {
        await new Promise(resolve => setTimeout(resolve, 700));
        return { ...mockDashboardStats };
    },
};