import type {User, Report, Activity, DashboardStats} from '../types';
import { format, subDays, subMonths } from 'date-fns';

// Generate a list of mock users
export const mockUsers: User[] = Array.from({ length: 50 }, (_, i) => {
    const verified = Math.random() > 0.7;
    const verificationStatus = verified ? 'approved' : (Math.random() > 0.5 ? 'pending' : 'rejected');
    const joinDate = format(subDays(new Date(), Math.floor(Math.random() * 365)), 'yyyy-MM-dd');

    return {
        id: `user-${i + 1}`,
        name: `User ${i + 1}`,
        email: `user${i + 1}@example.com`,
        status: Math.random() > 0.8 ? 'inactive' : (Math.random() > 0.9 ? 'suspended' : 'active'),
        role: i < 3 ? 'admin' : (i < 10 ? 'moderator' : 'user'),
        joinDate,
        lastActive: format(subDays(new Date(), Math.floor(Math.random() * 30)), 'yyyy-MM-dd'),
        avatar: `https://i.pravatar.cc/150?img=${(i % 70) + 1}`,
        verified,
        verificationStatus: verified ? 'approved' : (verificationStatus as 'pending' | 'approved' | 'rejected'),
        verificationDocuments: verified || verificationStatus === 'pending' ? [
            {
                id: `doc-${i}-1`,
                type: 'id',
                status: verified ? 'approved' : 'pending',
                submittedAt: joinDate,
                imageUrl: 'https://images.pexels.com/photos/207658/pexels-photo-207658.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
                notes: verified ? 'Approved' : 'Pending review',
            }
        ] : [],
        activities: Math.floor(Math.random() * 100),
        reports: Math.floor(Math.random() * 5),
    };
});

// Generate a list of mock reports
export const mockReports: Report[] = Array.from({ length: 30 }, (_, i) => {
    const reporterId = Math.floor(Math.random() * mockUsers.length);
    const reportedItemType = Math.random() > 0.7 ? 'contenu' : (Math.random() > 0.5 ? 'utilisateur' : 'commentaire');

    return {
        id: `report-${i + 1}`,
        reporterId: mockUsers[reporterId].id,
        reporterName: mockUsers[reporterId].name,
        reportedItemId: `item-${i + 1}`,
        reportedItemType,
        reason: ['inapproprié', 'spam', 'harcèlement','fausse information','autre'][Math.floor(Math.random() * 5)],
        description: `Ce ${reportedItemType} contient un contenu inapproprié qui va à l'encontre de nos lignes directrices.`,
        status: Math.random() > 0.6 ? 'pending' : (Math.random() > 0.5 ? 'résolu' : 'rejeté'),
        createdAt: format(subDays(new Date(), Math.floor(Math.random() * 30)), 'yyyy-MM-dd'),
        resolvedAt: Math.random() > 0.6 ? undefined : format(subDays(new Date(), Math.floor(Math.random() * 15)), 'yyyy-MM-dd'),
        resolvedBy: Math.random() > 0.6 ? undefined : mockUsers[Math.floor(Math.random() * 10)].id,
    };
});

// Generate a list of mock activities
export const mockActivities: Activity[] = Array.from({ length: 100 }, (_, i) => {
    const userId = Math.floor(Math.random() * mockUsers.length);
    const type = ['post', 'comment', 'like', 'share'][Math.floor(Math.random() * 4)];

    return {
        id: `activity-${i + 1}`,
        userId: mockUsers[userId].id,
        userName: mockUsers[userId].name,
        type,
        content: type === 'post' || type === 'comment'
            ? 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
            : '',
        createdAt: format(subDays(new Date(), Math.floor(Math.random() * 30)), 'yyyy-MM-dd'),
        status: Math.random() > 0.9 ? 'flagged' : (Math.random() > 0.95 ? 'deleted' : 'active'),
    };
});

// Generate mock dashboard stats
export const mockDashboardStats: DashboardStats = {
    totalUsers: mockUsers.length,
    activeUsers: mockUsers.filter(u => u.status === 'active').length,
    newUsersToday: Math.floor(Math.random() * 10),
    pendingVerifications: mockUsers.filter(u => u.verificationStatus === 'pending').length,
    openReports: mockReports.filter(r => r.status === 'pending').length,
    totalActivities: mockActivities.length,
    userGrowth: {
        labels: Array.from({ length: 12 }, (_, i) => format(subMonths(new Date(), 11 - i), 'MMM')),
        data: Array.from({ length: 12 }, () => Math.floor(Math.random() * 100))
    },
    activityDistribution: {
        labels: ['Posts', 'Comments', 'Likes', 'Shares'],
        data: [
            mockActivities.filter(a => a.type === 'post').length,
            mockActivities.filter(a => a.type === 'comment').length,
            mockActivities.filter(a => a.type === 'like').length,
            mockActivities.filter(a => a.type === 'share').length
        ]
    },
    topCreators: Array.from({ length: 5 }, (_, i) => ({
        userId: mockUsers[i].id,
        userName: mockUsers[i].name,
        activities: Math.floor(Math.random() * 100) + 50
    })).sort((a, b) => b.activities - a.activities)
};