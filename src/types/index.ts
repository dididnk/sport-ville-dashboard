export interface User {
    id: string;
    name: string;
    email: string;
    status: 'active' | 'inactive' | 'suspended';
    role: 'admin' | 'moderator' | 'user';
    joinDate: string;
    lastActive: string;
    avatar: string;
    verified: boolean;
    verificationStatus?: 'pending' | 'approved' | 'rejected';
    verificationDocuments?: VerificationDocument[];
    activities: number;
    reports: number;
}

export interface VerificationDocument {
    id: string;
    type: 'id' | 'passport' | 'driver_license' | 'other';
    status: 'pending' | 'approved' | 'rejected';
    submittedAt: string;
    imageUrl: string;
    notes?: string;
}

export interface Report {
    id: string;
    reporterId: string;
    reporterName: string;
    reportedItemId: string;
    reportedItemType: 'content' | 'user' | 'comment';
    reason: string;
    description: string;
    status: 'pending' | 'resolved' | 'dismissed';
    createdAt: string;
    resolvedAt?: string;
    resolvedBy?: string;
}

export interface Activity {
    id: string;
    userId: string;
    userName: string;
    type: 'post' | 'comment' | 'like' | 'share';
    content: string;
    createdAt: string;
    status: 'active' | 'deleted' | 'flagged';
}

export interface DashboardStats {
    totalUsers: number;
    activeUsers: number;
    newUsersToday: number;
    pendingVerifications: number;
    openReports: number;
    totalActivities: number;
    userGrowth: {
        labels: string[];
        data: number[];
    };
    activityDistribution: {
        labels: string[];
        data: number[];
    };
    topCreators: {
        userId: string;
        userName: string;
        activities: number;
    }[];
}